# DocuQuery POC

A proof-of-concept document Q&A system using RAG (Retrieval-Augmented Generation).

## Quick Start

```bash
# 1. Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Set up API keys
cp .env.example .env
# Edit .env and add your actual API keys

# 4. Run the app
streamlit run app.py
```

## Project Structure

```
poc/
├── app.py                  # Main Streamlit application
├── documents/
│   ├── company_policy.md   # Company policies document
│   ├── product_guide.md    # Product information
│   └── faq.md              # Frequently asked questions
├── .env                    # API keys (create from .env.example)
├── .env.example            # Template for API keys
├── requirements.txt        # Python dependencies
└── README.md               # This file
```

## Sample Questions to Test

1. "How many days can I work remotely?"
2. "What is the refund policy for enterprise customers?"
3. "How do I reset my password?"
4. "What is the annual learning budget?"
5. "Does CloudSync Pro integrate with Slack?"
6. "What are the support hours for Business plan?"

## API Keys Required

| Service | Environment Variable | Get it from |
|---------|---------------------|-------------|
| OpenAI | `OPENAI_API_KEY` | https://platform.openai.com/api-keys |
| Anthropic | `ANTHROPIC_API_KEY` | https://console.anthropic.com/ |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `ModuleNotFoundError` | Run `pip install <module>` |
| API key errors | Check `.env` file exists and has valid keys |
| Port already in use | Run `streamlit run app.py --server.port 8502` |
| Chroma errors | Delete any `.chroma` folder and restart |
