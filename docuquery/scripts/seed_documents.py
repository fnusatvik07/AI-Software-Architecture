"""Seed sample documents into the system."""

import asyncio
import base64
import httpx
from pathlib import Path


SAMPLE_DOCUMENTS = [
    {
        "filename": "company_policy.md",
        "content": """# Company Policy Document

## Remote Work Policy

Employees may work remotely up to 3 days per week with manager approval.
All remote workers must be available during core hours (10am-4pm local time).

## Leave Policy

- Annual Leave: 20 days per year
- Sick Leave: 10 days per year
- Personal Leave: 5 days per year

## Code of Conduct

All employees are expected to maintain professional behavior and treat
colleagues with respect. Harassment of any kind is not tolerated.
""",
        "file_type": "markdown"
    },
    {
        "filename": "product_guide.md",
        "content": """# Product Guide

## Overview

Our flagship product is an AI-powered document management system.

## Features

- **Document Upload**: Support for PDF, Word, and Markdown files
- **AI Search**: Natural language search across all documents
- **Collaboration**: Share documents with team members
- **Version Control**: Track changes and revisions

## Pricing

- Starter: $10/month - Up to 100 documents
- Professional: $50/month - Unlimited documents
- Enterprise: Custom pricing - Advanced features

## Support

Contact support@company.com for assistance.
Available 24/7 for Enterprise customers.
""",
        "file_type": "markdown"
    },
    {
        "filename": "faq.md",
        "content": """# Frequently Asked Questions

## How do I reset my password?

Click on "Forgot Password" on the login page and enter your email.
You will receive a reset link within 5 minutes.

## What file formats are supported?

We support PDF, DOCX, TXT, and Markdown files.
Maximum file size is 50MB.

## How does the AI search work?

Our AI analyzes document content and creates semantic embeddings.
When you search, we find the most relevant passages using similarity matching.

## Is my data secure?

Yes, all data is encrypted at rest and in transit.
We are SOC 2 Type II certified.
""",
        "file_type": "markdown"
    }
]


async def seed_documents():
    """Upload sample documents to the API."""
    base_url = "http://localhost:8000/api/v1"
    
    async with httpx.AsyncClient() as client:
        for doc in SAMPLE_DOCUMENTS:
            # Base64 encode the content
            content_b64 = base64.b64encode(doc["content"].encode()).decode()
            
            payload = {
                "filename": doc["filename"],
                "content": content_b64,
                "file_type": doc["file_type"]
            }
            
            try:
                response = await client.post(
                    f"{base_url}/documents/upload",
                    json=payload,
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    print(f"✅ Uploaded {doc['filename']}: {result['chunk_count']} chunks")
                else:
                    print(f"❌ Failed to upload {doc['filename']}: {response.text}")
                    
            except Exception as e:
                print(f"❌ Error uploading {doc['filename']}: {e}")


if __name__ == "__main__":
    print("🌱 Seeding sample documents...")
    asyncio.run(seed_documents())
    print("\n✨ Done!")
