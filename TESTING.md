# Home Assistant YAML Testing Guide

This document provides detailed information about the unit testing framework for Home Assistant YAML files.

## Overview

The testing framework validates all YAML files in the `src/includes/` directory, ensuring they follow Home Assistant conventions and best practices.

## Test Categories

### 1. YAML Validity Tests (`TestYAMLValidity`)

**Purpose**: Ensure all YAML files have valid syntax and are not empty.

**Tests**:
- `test_yaml_syntax` - Validates YAML syntax is correct
- `test_yaml_not_empty` - Ensures files contain data

**What it catches**:
- Syntax errors (missing colons, incorrect indentation)
- Empty files
- Malformed YAML structures

### 2. Structure Validity Tests (`TestStructureValidity`)

**Purpose**: Validate the structure of automations and scripts.

**Tests**:
- `test_has_alias` - Ensures automations/scripts have a human-readable alias
- `test_automation_structure` - Validates automation structure (triggers, actions, mode)
- `test_script_structure` - Validates script structure (sequence, alias)

**What it catches**:
- Missing required fields (`alias`, `triggers`, `actions`, `sequence`, `mode`)
- Invalid mode values (must be: single, restart, queued, or parallel)
- Empty sequences
- Incorrect data types

### 3. Entity ID Tests (`TestEntityIDs`)

**Purpose**: Validate entity ID formats follow Home Assistant conventions.

**Tests**:
- `test_entity_id_format` - Checks entity IDs match pattern `domain.entity_name`
- `test_entity_ids_exist` - Verifies entity IDs are present where expected

**What it catches**:
- Invalid entity ID formats (e.g., missing domain, incorrect characters)
- Malformed entity IDs that would cause runtime errors

**Valid format**: `[domain].[entity_name]` where:
- Domain: lowercase letters and underscores (e.g., `sensor`, `binary_sensor`)
- Entity name: lowercase letters, numbers, and underscores (e.g., `living_room_temp`)

### 4. Jinja2 Template Tests (`TestJinja2Templates`)

**Purpose**: Validate Jinja2 template syntax used in automations and scripts.

**Tests**:
- `test_jinja2_syntax` - Parses Jinja2 templates to catch syntax errors

**What it catches**:
- Unclosed template tags (`{{` without `}}`)
- Invalid Jinja2 syntax
- Malformed filter expressions
- Template parsing errors

**Note**: This test validates syntax only, not runtime behavior or undefined variables.

### 5. Best Practices Tests (`TestBestPractices`)

**Purpose**: Enforce Home Assistant best practices and coding standards.

**Tests**:
- `test_no_hardcoded_paths` - Detects hardcoded file paths
- `test_has_description` - Ensures automations/scripts have descriptions
- `test_action_has_alias` - Checks that actions have aliases for debugging

**What it catches**:
- Hardcoded paths (e.g., `/home/user/`, `C:\Users\`)
- Missing descriptions (helpful for documentation)
- Missing action aliases (makes debugging easier)

## Special Handling

### Home Assistant YAML Tags

The test framework supports Home Assistant-specific YAML tags:

- `!include` - Include external files
- `!include_dir_named` - Include directory as named dictionary
- `!include_dir_list` - Include directory as list
- `!include_dir_merge_list` - Include and merge directory contents
- `!include_dir_merge_named` - Include and merge named directory contents
- `!secret` - Reference secrets
- `!env_var` - Reference environment variables

### Configuration Files

Configuration files (like `packages_config.yaml`) are automatically detected and skipped for automation/script-specific tests.

## Running Tests

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

### Quick Start

```bash
# Run all tests (uv auto-installs dependencies)
uv run run_tests.py

# Or use pytest with explicit dependencies
uv run --with pytest --with pytest-cov --with pyyaml --with jinja2 --with voluptuous pytest
```

### Advanced Usage

**Run with verbose output**:
```bash
uv run pytest -vv
```

**Run specific test class**:
```bash
uv run pytest tests/test_yaml_validity.py::TestEntityIDs -v
```

**Run tests for specific file**:
```bash
uv run pytest -k "emhass_script" -v
```

**Run with extra verbose output**:
```bash
uv run run_tests.py -vv
```

> **Note**: Code coverage is not applicable for YAML file testing. Coverage tools measure Python code execution, but these tests validate YAML data files.

**Stop on first failure**:
```bash
uv run pytest -x
```

### Alternative: Traditional Installation

If you prefer traditional pip installation:
```bash
# Using pip (reads from pyproject.toml)
pip install -e '.[test]'
pytest

# Or using uv's pip interface
uv pip install -e '.[test]'
pytest
```

### Why We Recommend uv

- **Fast**: Installed 12 packages in 270ms (vs several seconds with pip)
- **Zero Config**: Just run `uv run pytest` - no virtual env setup needed
- **Consistent**: Guaranteed reproducible dependency resolution
- **Modern**: Uses PEP 723 inline script metadata

## Continuous Integration

The repository includes a GitHub Actions workflow (`.github/workflows/test-yaml.yml`) that automatically runs tests on:

- Push to main branch
- Pull requests to main branch
- Manual workflow dispatch
- Changes to YAML files or test files

## Extending the Tests

### Adding New Test Classes

1. Create a new test class in `tests/test_yaml_validity.py`
2. Use `@pytest.mark.parametrize` to test all YAML files
3. Follow the existing patterns for loading and validating files

Example:
```python
class TestCustomValidation:
    """Custom validation tests."""
    
    @pytest.mark.parametrize("yaml_file", get_yaml_files(), ids=lambda x: x.name)
    def test_custom_rule(self, yaml_file):
        """Test custom validation rule."""
        data = load_yaml_file(yaml_file)
        # Add your validation logic here
        assert condition, "Error message"
```

### Adding New File Patterns

To test additional directories or file patterns, modify `get_yaml_files()` in `tests/test_yaml_validity.py`:

```python
def get_yaml_files():
    """Get all YAML files to test."""
    files = []
    files.extend(INCLUDES_DIR.glob("*.yaml"))
    files.extend(Path("other_dir").glob("*.yaml"))
    return files
```

## Troubleshooting

### Common Issues

**Issue**: `ModuleNotFoundError: No module named 'pytest'`
- **Solution**: Run `uv run pytest` (uv will auto-install dependencies) or `uv pip install -e '.[test]'`

**Issue**: `uv: command not found`
- **Solution**: Install uv following the instructions in the Prerequisites section

**Issue**: Tests fail on `!include` tags
- **Solution**: The custom YAML loader should handle this. Ensure you're using the latest test code.

**Issue**: False positives on template syntax
- **Solution**: The Jinja2 parser checks syntax only. Undefined variables are expected and ignored.

**Issue**: Coverage warnings
- **Solution**: Coverage warnings for YAML testing are normal since we're testing data files, not Python code.

### Why uv?

- **Fast**: 10-100x faster than pip
- **Reliable**: Consistent dependency resolution
- **Simple**: Auto-installs dependencies when running `uv run`
- **Modern**: Uses Python's latest packaging standards (pyproject.toml)

## Best Practices

1. **Run tests before committing** - Catch errors early
2. **Add descriptions to automations** - Improves maintainability
3. **Use action aliases** - Makes debugging easier
4. **Follow entity ID conventions** - Prevents runtime errors
5. **Validate templates** - Test Jinja2 syntax before deploying

## Test Results Interpretation

**PASSED** ✓ - Test executed successfully, validation passed
**SKIPPED** ⊘ - Test skipped (e.g., config file, not applicable)
**FAILED** ✗ - Validation failed, needs attention

Example output:
```
======================== 72 passed, 5 skipped in 1.15s ========================
```

This means:
- 72 tests passed successfully
- 5 tests were skipped (typically config files)
- No failures detected

## Additional Resources

- [Home Assistant YAML Documentation](https://www.home-assistant.io/docs/configuration/yaml/)
- [Jinja2 Template Documentation](https://jinja.palletsprojects.com/)
- [pytest Documentation](https://docs.pytest.org/)

