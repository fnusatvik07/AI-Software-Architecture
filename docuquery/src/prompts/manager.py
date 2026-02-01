"""Prompt template management with versioning."""

import logging
from pathlib import Path

from jinja2 import Template

from config.settings import settings
from src.core.exceptions import ConfigurationError

logger = logging.getLogger(__name__)


class PromptManager:
    """Manages prompt templates with versioning and caching."""

    def __init__(self, prompts_dir: str = None, version: str = None):
        self.prompts_dir = Path(prompts_dir or settings.prompts_dir)
        self.version = version or settings.prompt_version
        self.cache: dict[str, str] = {}

    def get_prompt(self, name: str, version: str = None) -> str:
        """Get a prompt template by name."""
        version = version or self.version
        cache_key = f"{version}/{name}"

        if cache_key in self.cache:
            return self.cache[cache_key]

        prompt_path = self.prompts_dir / version / f"{name}.txt"

        if not prompt_path.exists():
            raise ConfigurationError(f"Prompt not found: {prompt_path}")

        prompt = prompt_path.read_text(encoding="utf-8")
        self.cache[cache_key] = prompt

        return prompt

    def render_prompt(self, name: str, version: str = None, **kwargs) -> str:
        """Render a prompt template with variables."""
        template_str = self.get_prompt(name, version)
        template = Template(template_str)
        return template.render(**kwargs)

    def list_prompts(self, version: str = None) -> list:
        """List all available prompts for a version."""
        version = version or self.version
        version_dir = self.prompts_dir / version

        if not version_dir.exists():
            return []

        return [p.stem for p in version_dir.glob("*.txt")]

    def list_versions(self) -> list:
        """List all available prompt versions."""
        if not self.prompts_dir.exists():
            return []

        return [d.name for d in self.prompts_dir.iterdir() if d.is_dir()]
