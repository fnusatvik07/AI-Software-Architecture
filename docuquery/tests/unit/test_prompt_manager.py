"""Tests for prompt manager."""

import tempfile
from pathlib import Path

import pytest

from src.core.exceptions import ConfigurationError
from src.prompts.manager import PromptManager


class TestPromptManager:
    """Test cases for PromptManager."""

    def test_get_prompt_success(self):
        """Test successful prompt retrieval."""
        with tempfile.TemporaryDirectory() as tmpdir:
            # Create test prompt
            version_dir = Path(tmpdir) / "v1"
            version_dir.mkdir()
            (version_dir / "test.txt").write_text("Hello {{ name }}")

            manager = PromptManager(prompts_dir=tmpdir, version="v1")
            prompt = manager.get_prompt("test")

            assert prompt == "Hello {{ name }}"

    def test_get_prompt_not_found(self):
        """Test prompt not found error."""
        with tempfile.TemporaryDirectory() as tmpdir:
            manager = PromptManager(prompts_dir=tmpdir, version="v1")

            with pytest.raises(ConfigurationError):
                manager.get_prompt("nonexistent")

    def test_render_prompt(self):
        """Test prompt rendering with variables."""
        with tempfile.TemporaryDirectory() as tmpdir:
            # Create test prompt
            version_dir = Path(tmpdir) / "v1"
            version_dir.mkdir()
            (version_dir / "greeting.txt").write_text("Hello {{ greeting_name }}!")

            manager = PromptManager(prompts_dir=tmpdir, version="v1")
            rendered = manager.render_prompt("greeting", greeting_name="World")

            assert rendered == "Hello World!"

    def test_prompt_caching(self):
        """Test that prompts are cached."""
        with tempfile.TemporaryDirectory() as tmpdir:
            # Create test prompt
            version_dir = Path(tmpdir) / "v1"
            version_dir.mkdir()
            (version_dir / "cached.txt").write_text("Original")

            manager = PromptManager(prompts_dir=tmpdir, version="v1")

            # First call should cache
            first_result = manager.get_prompt("cached")

            # Modify file
            (version_dir / "cached.txt").write_text("Modified")

            # Second call should return cached version
            second_result = manager.get_prompt("cached")

            assert first_result == second_result == "Original"

    def test_list_versions(self):
        """Test listing available versions."""
        with tempfile.TemporaryDirectory() as tmpdir:
            Path(tmpdir, "v1").mkdir()
            Path(tmpdir, "v2").mkdir()

            manager = PromptManager(prompts_dir=tmpdir)
            versions = manager.list_versions()

            assert set(versions) == {"v1", "v2"}
