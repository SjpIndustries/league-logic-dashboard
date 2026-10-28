"""Validate the API contract from any working directory; no service calls."""
from pathlib import Path

from openapi_spec_validator import validate
import yaml

SPEC_PATH = Path(__file__).resolve().with_name("openapi.yaml")


def load_spec():
    with SPEC_PATH.open(encoding="utf-8") as stream:
        return yaml.safe_load(stream)


if __name__ == "__main__":
    validate(load_spec())
    print("openapi.yaml is valid.")
