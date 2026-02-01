# Stage 2: Proof of Concept (POC)

> **Goal:** Build a minimal working prototype that proves the core AI capability works — in the fastest way possible.

This stage takes 1-3 days and results in a demo-able prototype that answers the fundamental question: *"Can an LLM accurately answer questions about our documents with citations?"*

---

## 📋 Table of Contents

1. [POC Philosophy](#1-poc-philosophy)
2. [POC Scope](#2-poc-scope)
3. [Technical Architecture](#3-technical-architecture)
4. [Tech Stack](#4-tech-stack)
5. [Project Structure](#5-project-structure)
6. [Sample Documents](#6-sample-documents)
7. [The Code](#7-the-code)
8. [Running the POC](#8-running-the-poc)
9. [Testing](#9-testing)
10. [Evaluation](#10-evaluation)
11. [Common Issues & Fixes](#11-common-issues--fixes)
12. [Demo Script](#12-demo-script)
13. [Exit Criteria](#13-exit-criteria)
14. [What Changes in Stage 3](#14-what-changes-in-stage-3)

---

## 1. POC Philosophy

### What POC Is vs. Isn't

| POC Is ✅ | POC Is NOT ❌ |
|-----------|---------------|
| Proving the core idea works | A production system |
| Quick and dirty | Clean, scalable code |
| For internal demo | For real users |
| 1-3 days of work | Weeks of engineering |
| Throwaway code | Foundation for production |
| Learning what works | Building everything |

### The One Question POC Answers

> **"Can an LLM accurately answer questions about our documents with citations?"**

That's it. If the answer is yes, we proceed. If no, we learn why and pivot.

### POC Mindset

```
Speed > Perfection
Learning > Building
Proving > Polishing
```

---

## 2. POC Scope

### ✅ What We Build

| Feature | Included | Rationale |
|---------|----------|-----------|
| Load 1-3 sample documents | ✅ | Need data to test |
| Chunk documents | ✅ | Core RAG requirement |
| Generate embeddings | ✅ | Core RAG requirement |
| Store in vector DB | ✅ | Core RAG requirement |
| Accept user question | ✅ | Core functionality |
| Retrieve relevant chunks | ✅ | Core RAG requirement |
| Generate answer with LLM | ✅ | Core functionality |
| Show source citation | ✅ | Key differentiator |
| Simple UI to interact | ✅ | Need to demo it |

### ❌ What We Skip

| Feature | Skipped | Rationale |
|---------|---------|-----------|
| File upload UI | ❌ | Hardcode file paths |
| Multiple file formats | ❌ | Just use .txt or .md |
| User authentication | ❌ | Not needed for demo |
| Conversation memory | ❌ | Single question is enough |
| Error handling | ❌ | We'll babysit it |
| Logging/monitoring | ❌ | We're watching it live |
| Deployment | ❌ | Run locally |
| Tests | ❌ | Manual testing only |

---

## 3. Technical Architecture

### Simplified RAG Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         POC Architecture                         │
└─────────────────────────────────────────────────────────────────┘

                    ┌──────────────────┐
                    │  📄 Documents    │
                    │  (3 markdown     │
                    │   files)         │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  ✂️ Chunking     │
                    │  (500 tokens,    │
                    │   50 overlap)    │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  🔢 Embeddings   │
                    │  (OpenAI)        │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │  💾 Vector Store │
                    │  (Chroma)        │
                    └────────┬─────────┘
                             │
         ┌───────────────────┴───────────────────┐
         │                                       │
         ▼                                       │
┌──────────────────┐                             │
│  👤 User         │                             │
│  Question        │                             │
└────────┬─────────┘                             │
         │                                       │
         ▼                                       │
┌──────────────────┐                             │
│  🔢 Embed Query  │                             │
└────────┬─────────┘                             │
         │                                       │
         ▼                                       ▼
┌─────────────────────────────────────────────────┐
│           🔍 Similarity Search                  │
│              (Top 3 chunks)                     │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│                🤖 LLM (Claude)                  │
│                                                 │
│  System: Answer based on context only.          │
│          Cite your sources.                     │
│                                                 │
│  Context: [Retrieved chunks]                    │
│  Question: [User question]                      │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│              📝 Answer                          │
│              + Source Citations                 │
│              + Relevant Chunks                  │
└─────────────────────────────────────────────────┘
```

### Data Flow Summary

```
Documents → Chunks → Embeddings → Vector DB
                                      ↓
Question → Query Embedding → Similarity Search
                                      ↓
                         Retrieved Chunks + Question
                                      ↓
                                    LLM
                                      ↓
                            Answer + Citations
```

---

## 4. Tech Stack

### POC Choices (Optimized for Speed)

| Component | POC Choice | Why This | Production Alternative |
|-----------|------------|----------|------------------------|
| **Language** | Python | Fastest for AI prototyping | Same |
| **UI** | Streamlit | 10 lines for full UI | React |
| **Vector DB** | Chroma (in-memory) | Zero setup, pip install | Qdrant, Pinecone |
| **Embeddings** | OpenAI text-embedding-3-small | API call, no setup | Same or local |
| **LLM** | Claude 3.5 Sonnet | Best at citations | Same |
| **Chunking** | LangChain RecursiveTextSplitter | Battle-tested | Same or custom |
| **Doc Loading** | LangChain TextLoader | Simple, works | Unstructured, docling |

### Why Chroma for POC (Not Qdrant)?

| Aspect | Chroma | Qdrant |
|--------|--------|--------|
| Setup | `pip install chromadb` | Docker required |
| Persistence | In-memory or file | Requires server |
| Lines of code | ~5 | ~15 |
| Production-ready | No | Yes |

**For POC:** Chroma wins on simplicity  
**For Dev+:** Switch to Qdrant

---

## 5. Project Structure

```
poc/
├── app.py                  # Main Streamlit app (~100 lines)
├── documents/
│   ├── company_policy.md   # Sample doc 1
│   ├── product_guide.md    # Sample doc 2
│   └── faq.md              # Sample doc 3
├── .env                    # API keys (gitignored)
├── .env.example            # Template for API keys
├── requirements.txt        # Dependencies
└── README.md               # How to run
```

### requirements.txt

```
streamlit==1.31.0
langchain==0.1.0
langchain-openai==0.0.5
langchain-anthropic==0.1.1
chromadb==0.4.22
python-dotenv==1.0.0
```

### .env.example

```bash
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
```

---

## 6. Sample Documents

We need realistic test documents. Here are three examples covering different use cases.

### Document 1: `documents/company_policy.md`

```markdown
# Company Policies

## Remote Work Policy

Employees may work remotely up to 3 days per week with manager approval. 
Full-time remote arrangements require VP approval and HR documentation.

Remote workers must:
- Be available during core hours (10 AM - 4 PM local time)
- Have reliable internet connection (minimum 50 Mbps)
- Use company-approved VPN for all work activities
- Attend in-person meetings when required (minimum 2 days notice)

## Expense Policy

### Travel Expenses
- Flights: Economy class for trips under 6 hours, business class for longer
- Hotels: Up to $250/night in major cities, $150/night elsewhere
- Meals: Up to $75/day while traveling
- All expenses over $500 require pre-approval from finance

### Equipment
- Employees receive $1,500 home office stipend (one-time)
- Annual learning budget: $2,000 per employee
- Software requests go through IT ticketing system

## Leave Policy

- PTO: 20 days per year (accrued monthly)
- Sick leave: 10 days per year (no carryover)
- Parental leave: 16 weeks paid for primary caregiver, 8 weeks for secondary
- Bereavement: 5 days for immediate family, 3 days for extended family

Unused PTO carries over up to 5 days maximum.
```

### Document 2: `documents/product_guide.md`

```markdown
# Product Guide: CloudSync Pro

## Overview

CloudSync Pro is our enterprise file synchronization solution. 
It enables teams to collaborate on documents in real-time while 
maintaining security and compliance.

## Pricing Tiers

### Starter - $10/user/month
- Up to 10 users
- 100 GB storage per user
- Basic sharing features
- Email support

### Business - $25/user/month
- Unlimited users
- 1 TB storage per user
- Advanced sharing with permissions
- SSO integration
- Priority support
- 99.9% uptime SLA

### Enterprise - Custom pricing
- Everything in Business
- Unlimited storage
- Custom integrations
- Dedicated account manager
- On-premise deployment option
- 99.99% uptime SLA
- HIPAA compliance available

## Refund Policy

- Monthly plans: Cancel anytime, no refund for current month
- Annual plans: Pro-rated refund within first 30 days
- Enterprise: As per contract terms

## Integration Support

CloudSync Pro integrates with:
- Slack (real-time notifications)
- Microsoft 365 (document editing)
- Salesforce (file attachments)
- Jira (project documentation)

API access available on Business and Enterprise plans.
```

### Document 3: `documents/faq.md`

```markdown
# Frequently Asked Questions

## Account & Billing

**Q: How do I reset my password?**
A: Click "Forgot Password" on the login page. You'll receive a reset 
link within 5 minutes. Check spam folder if not received.

**Q: Can I change my subscription plan?**
A: Yes, upgrades take effect immediately. Downgrades take effect at 
the next billing cycle. Contact support@company.com for plan changes.

**Q: Do you offer discounts for nonprofits?**
A: Yes, we offer 50% discount for registered nonprofits. Email 
nonprofit@company.com with your 501(c)(3) documentation.

## Technical Issues

**Q: Why is sync slow?**
A: Common causes include:
1. Large files (>1GB) - these sync in background
2. Poor internet connection - need minimum 10 Mbps
3. Too many files changed at once - sync happens in batches
Contact support if issues persist.

**Q: Is my data encrypted?**
A: Yes, we use AES-256 encryption at rest and TLS 1.3 in transit. 
Enterprise plans can use customer-managed encryption keys.

**Q: What happens if I exceed storage?**
A: You'll receive warnings at 80% and 95% usage. At 100%, new uploads 
are blocked but existing files remain accessible. Upgrade plan or 
delete files to resolve.

## Support

**Q: How do I contact support?**
A: 
- Email: support@company.com (response within 24 hours)
- Chat: Available in-app for Business and Enterprise
- Phone: Enterprise plans only, dedicated number provided

**Q: What are support hours?**
A: 
- Starter: Monday-Friday 9 AM - 5 PM EST
- Business: Monday-Friday 8 AM - 8 PM EST
- Enterprise: 24/7 with dedicated team
```

---

## 7. The Code

### Complete POC: `app.py` (~100 lines)

```python
"""
DocuQuery POC - Document Q&A with RAG
Run with: streamlit run app.py
"""

import os
from pathlib import Path
import streamlit as st
from dotenv import load_dotenv

from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_anthropic import ChatAnthropic
from langchain_community.vectorstores import Chroma
from langchain.prompts import ChatPromptTemplate

# Load environment variables
load_dotenv()

# --- Configuration ---
DOCS_DIR = "documents"
CHUNK_SIZE = 500
CHUNK_OVERLAP = 50
TOP_K = 3

# --- Initialize Components (cached) ---

@st.cache_resource
def load_and_index_documents():
    """Load documents, chunk them, and create vector store."""
    
    # Load all .md files from documents folder
    loader = DirectoryLoader(
        DOCS_DIR, 
        glob="**/*.md", 
        loader_cls=TextLoader
    )
    documents = loader.load()
    
    # Split into chunks
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        separators=["\n\n", "\n", ". ", " ", ""]
    )
    chunks = splitter.split_documents(documents)
    
    # Create embeddings and vector store
    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        collection_name="docuquery_poc"
    )
    
    return vectorstore, len(documents), len(chunks)


@st.cache_resource
def get_llm():
    """Initialize the LLM."""
    return ChatAnthropic(
        model="claude-3-5-sonnet-20241022",
        temperature=0
    )


# --- RAG Chain ---

SYSTEM_PROMPT = """You are a helpful assistant that answers questions based on the provided context.

Rules:
1. Only answer based on the context provided
2. If the answer is not in the context, say "I don't have information about that in the documents"
3. Always cite which document your answer comes from
4. Be concise but complete

Context:
{context}
"""

def answer_question(question: str, vectorstore, llm) -> dict:
    """Retrieve relevant chunks and generate answer."""
    
    # Retrieve relevant chunks
    retriever = vectorstore.as_retriever(search_kwargs={"k": TOP_K})
    relevant_docs = retriever.invoke(question)
    
    # Format context
    context_parts = []
    sources = []
    for i, doc in enumerate(relevant_docs, 1):
        source = Path(doc.metadata.get("source", "unknown")).name
        context_parts.append(f"[Source {i}: {source}]\n{doc.page_content}")
        sources.append({
            "source": source,
            "content": doc.page_content
        })
    
    context = "\n\n---\n\n".join(context_parts)
    
    # Generate answer
    prompt = ChatPromptTemplate.from_messages([
        ("system", SYSTEM_PROMPT),
        ("human", "{question}")
    ])
    
    chain = prompt | llm
    response = chain.invoke({
        "context": context,
        "question": question
    })
    
    return {
        "answer": response.content,
        "sources": sources
    }


# --- Streamlit UI ---

st.set_page_config(
    page_title="DocuQuery POC",
    page_icon="📄",
    layout="wide"
)

st.title("📄 DocuQuery POC")
st.caption("Ask questions about your documents")

# Load documents and create index
with st.spinner("Loading and indexing documents..."):
    vectorstore, num_docs, num_chunks = load_and_index_documents()
    llm = get_llm()

st.success(f"✅ Loaded {num_docs} documents ({num_chunks} chunks)")

# Question input
question = st.text_input(
    "Ask a question:",
    placeholder="e.g., What is the remote work policy?"
)

if question:
    with st.spinner("Thinking..."):
        result = answer_question(question, vectorstore, llm)
    
    # Display answer
    st.markdown("### Answer")
    st.markdown(result["answer"])
    
    # Display sources
    st.markdown("### Sources")
    for i, source in enumerate(result["sources"], 1):
        with st.expander(f"Source {i}: {source['source']}"):
            st.markdown(source["content"])

# Sidebar with sample questions
with st.sidebar:
    st.markdown("### 💡 Sample Questions")
    sample_questions = [
        "How many days can I work remotely?",
        "What is the refund policy for enterprise customers?",
        "How do I reset my password?",
        "What is the annual learning budget?",
        "Does CloudSync Pro integrate with Slack?",
        "What are the support hours for Business plan?",
    ]
    for q in sample_questions:
        if st.button(q, key=q):
            st.session_state["question"] = q
            st.rerun()
```

---

## 8. Running the POC

### Quick Start (Recommended)

The POC is fully implemented and ready to run. Follow these steps:

```bash
# 1. Navigate to the project root
cd /path/to/architecture

# 2. Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# 3. Install pip (if needed)
python -m ensurepip --upgrade

# 4. Install dependencies
python -m pip install -r poc/requirements.txt

# 5. Create .env file with your API key
cp poc/.env.example poc/.env
# Edit poc/.env and add your OPENAI_API_KEY

# 6. Run the Streamlit POC
cd poc
streamlit run app.py
```

### Running the React UI (Frontend)

A separate React-based UI is also available for Stage 2 visualization:

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev

# 4. Open in browser
# http://localhost:5173
```

### Environment Variables

Create a `.env` file in the `poc/` directory:

```bash
# Required for LLM and embeddings
OPENAI_API_KEY=sk-your-openai-key-here
```

### POC Tech Stack (Current Implementation)

| Component | Implementation | Details |
|-----------|---------------|---------|
| **LLM** | GPT-4o | OpenAI's latest model |
| **Embeddings** | text-embedding-3-large | 3072 dimensions |
| **Vector Store** | ChromaDB | Persisted to `./chroma_db` |
| **UI** | Streamlit | Interactive web interface |
| **Chunking** | RecursiveCharacterTextSplitter | 500 chars, 50 overlap |

### Expected Output

```
  You can now view your Streamlit app in your browser.

  Local URL: http://localhost:8501
  Network URL: http://192.168.1.x:8501
```

### Troubleshooting

| Issue | Solution |
|-------|----------|
| `ModuleNotFoundError` | Run `pip install <module>` |
| API key errors | Check `.env` file exists and has valid `OPENAI_API_KEY` |
| Port already in use | Run `streamlit run app.py --server.port 8502` |
| Chroma dimension errors | Click "Clear Vector Store" in sidebar, or delete `./chroma_db` folder |
| Embedding model mismatch | Delete `./chroma_db` and restart - this recreates with correct dimensions |

---

## 9. Testing

### Test Questions Matrix

| # | Question | Expected Source | Expected Answer Contains |
|---|----------|-----------------|--------------------------|
| 1 | How many days can I work remotely? | company_policy.md | "3 days per week" |
| 2 | What is the refund policy? | product_guide.md | "Pro-rated refund within first 30 days" |
| 3 | How do I reset my password? | faq.md | "Forgot Password" on login page |
| 4 | What is the enterprise pricing? | product_guide.md | "Custom pricing" |
| 5 | What is the parental leave policy? | company_policy.md | "16 weeks paid" |
| 6 | Does it integrate with Jira? | product_guide.md | "Yes" with Jira mention |
| 7 | What is the hotel expense limit? | company_policy.md | "$250/night" major cities |
| 8 | What encryption do you use? | faq.md | "AES-256" |
| 9 | What's the nonprofit discount? | faq.md | "50% discount" |
| 10 | What is the CEO's name? | N/A | "I don't have information" |

### What to Observe During Testing

| Aspect | What to Check |
|--------|---------------|
| **Retrieval Quality** | Are the right chunks being retrieved? |
| **Answer Accuracy** | Is the LLM correctly using the context? |
| **Citation Quality** | Does it cite the correct source? |
| **Edge Cases** | What happens with questions not in docs? |
| **Latency** | How long does each query take? |
| **Hallucination** | Does it make up facts not in context? |

---

## 10. Evaluation

### Quick Eval Spreadsheet

Track results in a simple spreadsheet:

| # | Question | Expected | Actual | Correct? | Right Chunk? | Latency | Notes |
|---|----------|----------|--------|----------|--------------|---------|-------|
| 1 | Remote work days? | 3 days/week | | Y/N | Y/N | 3.2s | |
| 2 | Refund policy? | 30-day prorated | | Y/N | Y/N | 2.8s | |
| 3 | Password reset? | Forgot Password link | | Y/N | Y/N | 3.5s | |
| ... | | | | | | | |

### Success Criteria

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Answer accuracy | >60% | Manual check of 20 questions |
| Retrieval recall | >70% | Is correct chunk in top 3? |
| "I don't know" works | Yes | Ask question not in docs |
| Latency | <15s | Time each response |
| Demo-able | Yes | Can show to stakeholders? |

### Calculating Metrics

```
Answer Accuracy = (Correct Answers) / (Total Questions) × 100%

Retrieval Recall@3 = (Questions with correct chunk in top 3) / (Total Questions) × 100%

Avg Latency = Sum of all response times / Number of queries
```

---

## 11. Common Issues & Fixes

| Issue | Symptom | Quick Fix |
|-------|---------|-----------|
| **Wrong chunks retrieved** | Answer references wrong document | Increase `CHUNK_SIZE` to 800, reduce overlap |
| **LLM ignores context** | Makes up facts not in docs | Strengthen system prompt with "ONLY use provided context" |
| **Too slow** | >20s response time | Reduce `TOP_K` to 2, or use `claude-3-haiku` |
| **"I don't know" too often** | Can't answer obvious questions | Increase `TOP_K` to 5 |
| **Chunks cut mid-sentence** | Context looks incomplete | Adjust `separators` in text splitter |
| **API rate limits** | 429 errors | Add `time.sleep(1)` between calls |
| **Inconsistent answers** | Different answers for same question | Set `temperature=0` in LLM |

### Prompt Engineering Fixes

If the LLM behaves unexpectedly, try these prompt modifications:

**For hallucination:**
```python
SYSTEM_PROMPT = """You are a helpful assistant. 

CRITICAL RULES:
1. ONLY use information from the context below
2. If the answer is not explicitly stated in the context, say "I don't have information about that"
3. NEVER make up or infer information
4. Always cite your source

Context:
{context}
"""
```

**For better citations:**
```python
SYSTEM_PROMPT = """Answer the question using ONLY the provided context.

Format your response as:
ANSWER: [Your answer here]
SOURCE: [Which document this came from]

If the information is not in the context, respond with:
ANSWER: I don't have information about that in the available documents.
SOURCE: N/A

Context:
{context}
"""
```

---

## 12. Demo Script

### 5-Minute Stakeholder Demo

```
┌─────────────────────────────────────────────────────────────────┐
│                    POC DEMO SCRIPT                               │
└─────────────────────────────────────────────────────────────────┘

1. INTRO (30 seconds)
   "This is DocuQuery - it lets you ask questions about company 
   documents and get instant, accurate answers with sources."

2. SHOW THE DATA (30 seconds)
   "We loaded 3 documents: company policies, product guide, and FAQ.
   The system automatically chunks and indexes them."
   
   → Point to "Loaded 3 documents (X chunks)" message

3. SIMPLE QUESTION (1 minute)
   → Type: "How many days can I work remotely?"
   → Show the answer appears in ~3 seconds
   → Expand the source to show where it came from
   
   "Notice it gives the exact policy AND shows the source document."

4. CROSS-DOCUMENT QUESTION (1 minute)
   → Type: "What's the refund policy for enterprise customers?"
   → Show it correctly identifies this is in the product guide
   
   "It searched across all documents and found the right one."

5. EDGE CASE - UNKNOWN (30 seconds)
   → Type: "What is the CEO's name?"
   → Show it says "I don't have information"
   
   "Importantly, it doesn't make things up. If it's not in the 
   docs, it tells you."

6. THE VALUE (30 seconds)
   "This took 3 seconds. Previously, finding this info meant:
   - Searching Drive for 10 minutes
   - Asking 3 colleagues
   - Maybe still not finding the right version
   
   Now: instant, accurate, with proof."

7. NEXT STEPS (30 seconds)
   "This POC proves the concept works. Next we'll:
   - Add your real documents
   - Improve accuracy further
   - Build a proper production system
   
   Questions?"
```

### Demo Tips

- Pre-load the app before the demo (avoid cold start)
- Have backup questions ready if one fails
- If something breaks, show the source chunks directly
- Keep it short — leave time for questions

---

## 13. Exit Criteria

### ✅ POC Completion Checklist

Before moving to Stage 3 (Development), confirm:

**Technical Validation**
- [ ] Core RAG flow works end-to-end
- [ ] Documents load and chunk correctly
- [ ] Embeddings generate without errors
- [ ] Vector search returns relevant chunks
- [ ] LLM generates coherent answers
- [ ] Citations point to correct sources

**Quality Metrics**
- [ ] Answer accuracy >60% on test questions
- [ ] Retrieval finds relevant chunks >70% of time
- [ ] "I don't know" triggers appropriately for unknown questions
- [ ] No obvious hallucinations observed
- [ ] Response time <15 seconds

**Stakeholder Alignment**
- [ ] Demo completed successfully
- [ ] Stakeholders understand the value
- [ ] Go/No-Go decision made
- [ ] Feedback documented

**Learnings Documented**
- [ ] What worked well
- [ ] What didn't work
- [ ] Chunk size findings
- [ ] Prompt engineering insights
- [ ] Decisions for next stage

### Go/No-Go Decision

| Signal | Go ✅ | No-Go / Pivot 🔄 |
|--------|-------|------------------|
| Answer accuracy | >60% | <40% |
| Retrieval quality | >70% | <50% |
| Stakeholder feedback | Positive | Major concerns |
| Technical feasibility | Confirmed | Blockers found |
| Cost estimate | Acceptable | Too expensive |

---

## 14. What Changes in Stage 3

### POC → Development Comparison

| Aspect | POC (Stage 2) | Development (Stage 3) |
|--------|---------------|----------------------|
| **Vector DB** | Chroma (in-memory) | Qdrant (Docker) |
| **Code structure** | Single file (~100 lines) | Proper modules |
| **Error handling** | None | Try/catch, retries, fallbacks |
| **Configuration** | Hardcoded | Environment-based configs |
| **Testing** | Manual only | Unit + integration tests |
| **Evaluation** | Spreadsheet | Automated eval pipeline |
| **Documents** | 3 sample files | Real company documents |
| **UI** | Streamlit | FastAPI + React (separate) |
| **Deployment** | Local only | Dev server (Docker) |
| **Observability** | Print statements | Langfuse/structured logging |
| **Auth** | None | Basic API keys |
| **CI/CD** | None | GitHub Actions |

### New Components in Stage 3

```
Stage 3 Additions:
├── Proper project structure
├── FastAPI backend
├── Qdrant vector database
├── Environment configurations (dev/staging/prod)
├── Error handling & retries
├── Basic logging
├── Unit tests
├── Integration tests
├── Evaluation pipeline
├── Docker setup
├── CI pipeline (lint, test)
└── README & documentation
```

---

## 📦 Deliverables Summary

| Deliverable | Description | Status |
|-------------|-------------|--------|
| `app.py` | Complete POC application | ✅ |
| `documents/` | 3 sample markdown files | ✅ |
| `requirements.txt` | Python dependencies | ✅ |
| `.env.example` | API key template | ✅ |
| Test questions | 10 validation questions | ✅ |
| Eval criteria | Success metrics defined | ✅ |
| Demo script | 5-minute presentation guide | ✅ |
| Exit criteria | Go/No-Go checklist | ✅ |

---

## 🚀 Next: Stage 3 — Development

Once POC is validated, we move to building a proper development environment with:
- Clean architecture
- Real error handling
- Automated testing
- Evaluation pipelines
- Docker-based deployment

[→ Continue to Stage 3: Development](../stage-3-development/README.md)

---

## Quick Reference

### Commands

```bash
# Install dependencies
pip install -r requirements.txt

# Run the POC
streamlit run app.py

# Run on different port
streamlit run app.py --server.port 8502
```

### Key Files

```
poc/
├── app.py              # Main application
├── documents/          # Sample documents
├── .env                # API keys (create from .env.example)
├── requirements.txt    # Dependencies
└── README.md           # This file
```

### API Keys Required

| Service | Environment Variable | Get it from |
|---------|---------------------|-------------|
| OpenAI | `OPENAI_API_KEY` | https://platform.openai.com/api-keys |
| Anthropic | `ANTHROPIC_API_KEY` | https://console.anthropic.com/ |