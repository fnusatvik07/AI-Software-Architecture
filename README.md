# Stage 1: Ideation & Validation

> **Goal:** Define the problem, validate feasibility, and make key decisions BEFORE writing any code.

This is the most skipped stage in AI projects — and the reason most fail. Spending 1-2 days here saves weeks of wasted effort.

---

## 📋 Table of Contents

1. [Problem Discovery](#1-problem-discovery)
2. [User Personas](#2-user-personas)
3. [Scope Definition](#3-scope-definition)
4. [Technical Feasibility](#4-technical-feasibility)
5. [Architecture Decisions](#5-architecture-decisions-adrs)
6. [Success Metrics](#6-success-metrics)
7. [Risk Assessment](#7-risk-assessment)
8. [Cost Estimation](#8-cost-estimation)
9. [Project One-Pager](#9-project-one-pager)

---

## 1. Problem Discovery

### The Problem Statement

> **Employees spend too much time searching for information that already exists in company documents.**

### Quantifying the Pain

| Pain Point | Time Wasted | Frequency |
|------------|-------------|-----------|
| "Where's the refund policy?" | 15-30 mins | Daily |
| "What's the process for X?" | 20-40 mins (asking colleagues) | Daily |
| "Is this covered in our docs?" | Give up, make assumptions | Weekly |
| Onboarding new employees | 5-10 hrs answering same questions | Per hire |

**Estimated cost:** 2+ hours/employee/week = **$5,000+/employee/year** in lost productivity.

### Why Current Solutions Fail

| Solution | Why It Fails |
|----------|--------------|
| Google Drive search | Keyword-only, doesn't understand questions |
| Confluence/Notion search | Same problem, scattered across spaces |
| Ask on Slack | Depends on who's online, interrupts others |
| Ask manager | Doesn't scale, creates bottleneck |

### The Opportunity

An AI system that:
- Understands natural language questions
- Searches across all company documents
- Provides accurate answers with citations
- Available 24/7, instant responses

---

## 2. User Personas

### Primary: The Information Seeker

```
👤 Priya, Sales Representative

GOAL: Get quick answers to close deals faster

SCENARIO: "I'm on a call with a prospect asking about enterprise 
pricing. I can't find the doc and my prospect is waiting."

NEEDS:
• Answer in <30 seconds
• Confidence the answer is correct
• Link to source document for verification

FRUSTRATIONS:
• Search returns 50 irrelevant results
• Has to interrupt colleagues
• Sometimes gives wrong info to customers
```

### Secondary: The Knowledge Manager

```
👤 Rahul, Operations Lead

GOAL: Keep documentation accessible and reduce repeated questions

SCENARIO: "I answer the same 10 questions every week. 
I wish people would just read the docs."

NEEDS:
• Easy way to upload/update documents
• See what questions people are asking
• Identify documentation gaps

FRUSTRATIONS:
• No visibility into what people search for
• Docs get outdated, no one notices
• Time spent answering instead of doing real work
```

---

## 3. Scope Definition

### ✅ In Scope (MVP)

| Feature | Priority | Rationale |
|---------|----------|-----------|
| Upload documents (PDF, TXT, MD) | P0 | Core functionality |
| Natural language Q&A | P0 | Core value proposition |
| Answers with source citations | P0 | Trust & verification |
| View source chunk | P0 | "Show me where it says that" |
| Session conversation history | P1 | Follow-up questions |
| Basic admin: list documents | P1 | Manageability |

### ❌ Out of Scope (MVP)

| Feature | Reason to Defer |
|---------|-----------------|
| Multi-tenant architecture | Adds complexity, not needed for v1 |
| SSO/Enterprise auth | POC can use simple API keys |
| Document versioning | Nice-to-have, not critical |
| Slack/Teams integration | Add after core works |
| Analytics dashboard | Post-MVP feature |
| Fine-tuned models | Overkill, prompting works fine |
| Real-time document sync | Manual upload is fine for MVP |

### Scope Creep Warning Signs 🚨

Watch out for:
- "Can we also add..." before MVP is done
- "What if we need to support..." for hypothetical cases
- "Competitor X has..." feature comparison rabbit holes

**Rule:** If it doesn't directly help answer questions accurately, it's not MVP.

---

## 4. Technical Feasibility

### Component-by-Component Validation

| Component | Feasibility | Confidence | Tools/Approach |
|-----------|-------------|------------|----------------|
| Document parsing | ✅ Solved | High | PyPDF2, Unstructured, docling |
| Text chunking | ✅ Solved | High | LangChain splitters, 500-1000 tokens |
| Embedding generation | ✅ API call | High | OpenAI, Cohere, or local models |
| Vector storage | ✅ Many options | High | Qdrant, Pinecone, Chroma, pgvector |
| Similarity search | ✅ Built-in | High | Vector DB handles this |
| Answer generation | ✅ API call | High | Claude, GPT-4, etc. |
| Citation extraction | ✅ Prompting | Medium | Requires good prompt engineering |
| Streaming responses | ✅ Supported | High | SSE, WebSockets |
| Simple UI | ✅ Rapid | High | Streamlit, Gradio |

**Overall Verdict:** ✅ Fully feasible with existing tools. No research required.

### Technical Risks

| Risk | Mitigation |
|------|------------|
| LLM hallucination | Strict prompting, "I don't know" fallback |
| Poor retrieval quality | Reranking, hybrid search, better chunking |
| Slow responses | Streaming, caching, async processing |
| High costs | Token budgets, semantic caching |

---

## 5. Architecture Decisions (ADRs)

### ADR-001: LLM Provider Selection

**Decision:** Claude 3.5 Sonnet (primary), GPT-4o-mini (fallback)

| Option | Pros | Cons |
|--------|------|------|
| Claude 3.5 Sonnet ✅ | Excellent instruction following, great at citations | Higher cost |
| GPT-4o | Strong general performance | Similar cost, less reliable citations |
| GPT-4o-mini | Cheap, fast | Quality tradeoff |
| Llama 3 (local) | Free, private | Needs GPU, lower quality |

**Rationale:** Claude excels at structured outputs and following citation instructions. Cost is acceptable for enterprise use case.

---

### ADR-002: Vector Database Selection

**Decision:** Qdrant

| Option | Pros | Cons |
|--------|------|------|
| Qdrant ✅ | Free local mode, great performance, easy Docker setup | Fewer managed options |
| Pinecone | Fully managed, scales easily | Cost, vendor lock-in |
| Chroma | Simple, good for POC | Not production-ready |
| pgvector | Single DB for everything | More complex setup |

**Rationale:** Qdrant offers the best balance of ease-of-use, performance, and cost for our scale. Can migrate to Pinecone later if needed.

---

### ADR-003: Chunking Strategy

**Decision:** Recursive text splitter, 500 tokens, 50 token overlap

| Strategy | Pros | Cons |
|----------|------|------|
| Fixed size | Simple, predictable | Cuts mid-sentence/paragraph |
| Recursive ✅ | Respects structure (paragraphs, sentences) | Slightly more complex |
| Semantic | Best quality | Slow, expensive |
| Sentence-based | Clean boundaries | Chunks too small |

**Rationale:** Recursive splitting provides good balance of quality and simplicity. Can experiment with semantic chunking later.

---

### ADR-004: Embedding Model

**Decision:** OpenAI text-embedding-3-small

| Option | Dimensions | Cost (per 1M tokens) | Quality |
|--------|------------|----------------------|---------|
| text-embedding-3-small ✅ | 1536 | $0.02 | Good |
| text-embedding-3-large | 3072 | $0.13 | Better |
| Cohere embed-v3 | 1024 | ~$0.10 | Good |
| Local (BGE, E5) | Varies | Free | Good enough |

**Rationale:** Best cost/quality ratio. Can upgrade to large model if retrieval quality is insufficient.

---

## 6. Success Metrics

### Primary Metrics

| Metric | POC Target | MVP Target | Production Target |
|--------|------------|------------|-------------------|
| **Answer Accuracy** | 60% | 75% | 85% |
| **Retrieval Recall@3** | 70% | 80% | 90% |
| **Response Latency (P95)** | <15s | <8s | <5s |
| **Citation Accuracy** | 70% | 85% | 95% |

### How to Measure

| Metric | Measurement Method |
|--------|-------------------|
| Answer Accuracy | Human evaluation on 50-100 test questions |
| Retrieval Recall | Is correct chunk in top-k results? |
| Latency | Application metrics (P50, P95, P99) |
| Citation Accuracy | Does cited source contain the answer? |

### Secondary Metrics (Production)

| Metric | Target |
|--------|--------|
| User satisfaction | 4.0/5.0 stars |
| Daily active users | 50% of employees |
| Questions per user per day | 3-5 |
| "I don't know" rate | <20% |

---

## 7. Risk Assessment

| Risk | Likelihood | Impact | Mitigation Strategy |
|------|------------|--------|---------------------|
| **LLM hallucinates facts** | High | Critical | Strict prompting, require citations, "I don't know" fallback |
| **Wrong documents retrieved** | Medium | High | Reranking, hybrid search, metadata filtering |
| **Sensitive data exposure** | Medium | Critical | Access controls, no PII in logs, document permissions |
| **API costs exceed budget** | Medium | Medium | Token budgets, caching, usage alerts |
| **Slow response times** | Medium | Medium | Streaming, async processing, caching |
| **Users don't trust answers** | Medium | High | Always show sources, confidence indicators |
| **Documents become stale** | Low | Medium | Last-updated timestamps, admin alerts |

### Risk Response Plan

**If LLM hallucinates:**
1. Immediately add example to test suite
2. Adjust prompt to handle similar cases
3. Consider adding verification step

**If costs spike:**
1. Enable semantic caching
2. Reduce context window size
3. Switch to cheaper model for simple queries

---

## 8. Cost Estimation

### Per-Query Cost Breakdown

| Component | Tokens | Cost |
|-----------|--------|------|
| Query embedding | ~50 | $0.000001 |
| Vector search | - | ~$0 (self-hosted) |
| LLM input (query + context) | ~1,500 | $0.0045 |
| LLM output | ~400 | $0.006 |
| **Total per query** | | **~$0.01** |

### Monthly Cost Projections

| Stage | Users | Queries/Month | LLM Cost | Infra Cost | Total |
|-------|-------|---------------|----------|------------|-------|
| POC | 5 | 500 | $5 | $0 | $5 |
| MVP | 20 | 5,000 | $50 | $50 | $100 |
| Production | 200 | 50,000 | $500 | $200 | $700 |
| Scale | 1000 | 250,000 | $2,500 | $500 | $3,000 |

### Cost Optimization Opportunities

| Optimization | Potential Savings |
|--------------|-------------------|
| Semantic caching | 30-50% |
| Model routing (simple → cheap model) | 20-30% |
| Batch processing for ingestion | 40% on embeddings |
| Self-hosted embedding model | 90% on embeddings |

---

## 9. Project One-Pager

```
╔═══════════════════════════════════════════════════════════════════╗
║                         DocuQuery                                  ║
║              Internal Document Q&A Assistant                       ║
╠═══════════════════════════════════════════════════════════════════╣
║                                                                   ║
║  🎯 PROBLEM                                                       ║
║  Employees waste 2+ hours/week searching for information          ║
║  that already exists in company documents.                        ║
║                                                                   ║
║  💡 SOLUTION                                                      ║
║  AI-powered Q&A system that understands natural language          ║
║  questions and returns accurate answers with source citations.    ║
║                                                                   ║
║  ✨ KEY FEATURES (MVP)                                            ║
║  • Upload PDF, TXT, Markdown documents                            ║
║  • Ask questions in natural language                              ║
║  • Get answers with clickable source citations                    ║
║  • Conversation memory for follow-ups                             ║
║                                                                   ║
║  🛠️ TECH STACK                                                    ║
║  • LLM: Claude 3.5 Sonnet                                         ║
║  • Embeddings: OpenAI text-embedding-3-small                      ║
║  • Vector DB: Qdrant                                              ║
║  • Backend: FastAPI                                               ║
║  • Frontend: Streamlit (POC) → React (Production)                 ║
║                                                                   ║
║  📊 SUCCESS METRICS                                               ║
║  • 85% answer accuracy                                            ║
║  • <5s response time                                              ║
║  • 95% citation accuracy                                          ║
║                                                                   ║
║  💰 COST                                                          ║
║  • ~$0.01 per query                                               ║
║  • ~$700/month for 200-user deployment                            ║
║                                                                   ║
║  📅 TIMELINE                                                      ║
║  • POC: 1 week                                                    ║
║  • MVP: 3-4 weeks                                                 ║
║  • Production: 6-8 weeks                                          ║
║                                                                   ║
╚═══════════════════════════════════════════════════════════════════╝
```

---

## ✅ Stage 1 Checklist

Before moving to Stage 2 (POC), ensure you have:

- [x] Clear problem statement with quantified impact
- [x] Defined user personas with specific needs
- [x] Scoped MVP features (and explicitly excluded others)
- [x] Validated technical feasibility of all components
- [x] Made and documented key architecture decisions
- [x] Defined measurable success metrics
- [x] Identified risks with mitigation strategies
- [x] Estimated costs at different scales
- [x] Created project one-pager for stakeholder alignment

---

## 🚀 Next: Stage 2 — Proof of Concept

In Stage 2, we'll build a working prototype that demonstrates the core value proposition in ~100 lines of code.

[→ Continue to Stage 2: POC](../stage-2-poc/README.md)