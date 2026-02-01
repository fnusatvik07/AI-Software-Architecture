"""Query processing engine."""

import logging
import time

from config.settings import settings
from src.core.exceptions import LLMException, RetrievalException
from src.llm.gateway import LLMGateway
from src.models.queries import QueryRequest, QueryResponse, Source
from src.prompts.manager import PromptManager
from src.retrieval.embeddings import EmbeddingService
from src.retrieval.vector_store import VectorStore

logger = logging.getLogger(__name__)


class QueryEngine:
    """
    Processes user queries through the RAG pipeline.

    Flow:
    1. Embed the question
    2. Retrieve relevant chunks
    3. Build context from chunks
    4. Generate answer with LLM
    5. Format and return response
    """

    def __init__(
        self,
        vector_store: VectorStore,
        embedding_service: EmbeddingService,
        llm_gateway: LLMGateway,
        prompt_manager: PromptManager,
    ):
        self.vector_store = vector_store
        self.embedding_service = embedding_service
        self.llm_gateway = llm_gateway
        self.prompt_manager = prompt_manager

    async def query(self, request: QueryRequest) -> QueryResponse:
        """Process a query and return an answer with sources."""
        start_time = time.time()
        tokens_used = 0

        try:
            # Step 1: Embed the question
            logger.info(f"Processing query: {request.question[:50]}...")
            question_embedding = await self.embedding_service.embed_text(
                request.question
            )

            # Step 2: Retrieve relevant chunks
            top_k = request.top_k or settings.retrieval_top_k
            retrieved_chunks = await self.vector_store.search(
                embedding=question_embedding,
                top_k=top_k,
                score_threshold=settings.retrieval_score_threshold,
            )

            if not retrieved_chunks:
                logger.warning("No relevant chunks found for query")
                return self._create_no_results_response(request, start_time)

            # Step 3: Build context
            context, sources = self._build_context(retrieved_chunks)

            # Step 4: Generate answer
            system_prompt = self.prompt_manager.get_prompt("system")
            query_prompt = self.prompt_manager.render_prompt(
                "query", context=context, question=request.question
            )

            llm_response = await self.llm_gateway.complete(
                system_prompt=system_prompt, user_prompt=query_prompt
            )

            tokens_used = llm_response.get("tokens_used", 0)

            # Step 5: Build response
            latency_ms = int((time.time() - start_time) * 1000)

            return QueryResponse(
                question=request.question,
                answer=llm_response["content"],
                sources=sources if request.include_sources else [],
                latency_ms=latency_ms,
                tokens_used=tokens_used,
            )

        except (RetrievalException, LLMException):
            raise
        except Exception as e:
            logger.exception(f"Unexpected error processing query: {e}")
            raise

    def _build_context(self, chunks: list[dict]) -> tuple[str, list[Source]]:
        """Build context string and source list from chunks."""
        context_parts = []
        sources = []

        for i, chunk in enumerate(chunks, 1):
            source_name = chunk["metadata"].get("filename", "Unknown")
            context_parts.append(f"[Source {i}: {source_name}]\n{chunk['content']}")

            sources.append(
                Source(
                    document_id=chunk["metadata"].get("document_id", ""),
                    document_name=source_name,
                    chunk_id=chunk["id"],
                    content=chunk["content"],
                    relevance_score=chunk["score"],
                    page_number=chunk["metadata"].get("page_number"),
                )
            )

        context = "\n\n---\n\n".join(context_parts)
        return context, sources

    def _create_no_results_response(
        self, request: QueryRequest, start_time: float
    ) -> QueryResponse:
        """Create response when no relevant documents found."""
        latency_ms = int((time.time() - start_time) * 1000)

        return QueryResponse(
            question=request.question,
            answer="I don't have any relevant information in the documents to answer this question.",
            sources=[],
            latency_ms=latency_ms,
            tokens_used=0,
        )
