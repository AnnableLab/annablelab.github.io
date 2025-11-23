# Sigenergy with Home Assistant and EMHASS + Amber Electric

[![Test YAML Files](https://github.com/USERNAME/REPO/actions/workflows/test-yaml.yml/badge.svg)](https://github.com/USERNAME/REPO/actions/workflows/test-yaml.yml)

This guide is automatically published to: [https://sigenergy.annable.me](https://sigenergy.annable.me)

## Local development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Testing

This project includes unit tests for all Home Assistant YAML files in the `src/includes/` directory.

### Prerequisites

Install [uv](https://docs.astral.sh/uv/) - a fast Python package manager:

```bash
# macOS and Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# Or with pip
pip install uv
```

### Running Tests

#### Quick Start (using uv - recommended)
```bash
# Run all tests (uv auto-installs dependencies in ~270ms!)
uv run run_tests.py

# Or run pytest directly
uv run --with pytest --with pytest-cov --with pyyaml --with jinja2 --with voluptuous pytest
```

#### Additional Options
```bash
# Run with verbose output
uv run run_tests.py -vv

# Run specific test class
uv run --with pytest --with pyyaml --with jinja2 --with voluptuous pytest tests/test_yaml_validity.py::TestEntityIDs -v

# Run tests for specific file
uv run --with pytest --with pyyaml --with jinja2 --with voluptuous pytest -k "emhass_script" -v
```

#### Alternative: Using pip
If you prefer traditional pip, you can install from pyproject.toml:
```bash
pip install -e '.[test]'
pytest
```

### What Gets Tested

The test suite validates:

- ✅ **YAML Syntax** - All files are valid YAML
- ✅ **Structure Validation** - Automations and scripts have required fields
- ✅ **Entity ID Format** - Entity IDs follow Home Assistant conventions
- ✅ **Jinja2 Templates** - Template syntax is valid
- ✅ **Best Practices** - No hardcoded paths, proper descriptions, action aliases

### Test Files

- `tests/test_yaml_validity.py` - Main test suite
- `pytest.ini` - Pytest configuration
- `requirements-test.txt` - Python test dependencies

### CI/CD

Tests can be integrated into CI/CD pipelines. Example for GitHub Actions:

```yaml
- name: Install test dependencies
  run: pip install -r requirements-test.txt

- name: Run tests
  run: pytest
```
