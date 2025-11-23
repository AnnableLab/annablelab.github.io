# Migration to uv

This project has been migrated from traditional pip/shell scripts to [uv](https://docs.astral.sh/uv/) for faster, more
reliable dependency management.

## What Changed

### Removed Files

- ❌ `run_tests.sh` - Bash test runner
- ❌ `run_tests.ps1` - PowerShell test runner
- ❌ `pytest.ini` - Moved to `pyproject.toml`

### New Files

- ✅ `pyproject.toml` - Modern Python project configuration
- ✅ `.python-version` - Specifies Python 3.12

### Modified Files

- 📝 `run_tests.py` - Added inline script metadata (PEP 723)
- 📝 `.github/workflows/test-yaml.yml` - Uses uv instead of pip
- 📝 `README.md` - Updated with uv instructions
- 📝 `TESTING.md` - Updated with uv usage

## How to Use

### Before (pip)

```bash
pip install -r requirements-test.txt
pytest
```

### After (uv - recommended)

```bash
uv run run_tests.py  # That's it! Auto-installs deps and runs tests
```

## Benefits

### Speed

- **270ms** to install 12 packages (vs ~5-10 seconds with pip)
- **10-100x faster** than pip for dependency resolution

### Simplicity

- No need to manually create/activate virtual environments
- No need to run separate install commands
- Just `uv run <command>` and you're done

### Reliability

- Deterministic dependency resolution
- Cross-platform consistency
- Respects `pyproject.toml` standards

## CI/CD Changes

GitHub Actions now uses the official `astral-sh/setup-uv@v4` action:

```yaml
- name: Install uv
  uses: astral-sh/setup-uv@v4

- name: Run tests
  run: uv run run_tests.py
```

## Inline Script Metadata (PEP 723)

The `run_tests.py` script now includes its dependencies:

```python
# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "pytest>=7.4.0",
#     "pytest-cov>=4.1.0",
#     # ...
# ]
# ///
```

This allows `uv run run_tests.py` to automatically resolve and install dependencies.

## Installation

### macOS and Linux

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### Windows

```powershell
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

### Using pip

```bash
pip install uv
```

## Backward Compatibility

If you prefer traditional pip, you can install from `pyproject.toml`:

```bash
pip install -e '.[test]'
pytest
```

This reads the test dependencies from the `[project.optional-dependencies]` section in `pyproject.toml`.
