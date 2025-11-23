#!/usr/bin/env python3
# /// script
# requires-python = ">=3.10"
# dependencies = [
#     "pytest>=7.4.0",
#     "pytest-cov>=4.1.0",
#     "pyyaml>=6.0",
#     "jinja2>=3.1.2",
#     "voluptuous>=0.13.1",
# ]
# ///
"""
Test runner script for Home Assistant YAML files.
This script runs all tests and provides a summary of results.

Usage:
  uv run run_tests.py           # Run all tests
  uv run run_tests.py -vv       # Run with verbose output
  uv run run_tests.py --coverage # Run with coverage report
"""
import sys


def main():
    """Run pytest with appropriate options."""
    print("=" * 70)
    print("Running Home Assistant YAML Tests")
    print("=" * 70)
    print()
    
    # Check if pytest is installed
    try:
        import pytest
    except ImportError:
        print("ERROR: pytest is not installed.")
        print("Please install test dependencies:")
        print("  uv run run_tests.py  (recommended)")
        print("  OR: pip install -e '.[test]'")
        return 1
    
    # Run pytest
    args = [
        "-v",
        "--tb=short",
        "--color=yes",
    ]
    
    # Note: Coverage removed as we're testing YAML files, not Python code
    # Coverage only makes sense when testing Python source code
    
    # Add verbose if requested
    if "-vv" in sys.argv:
        args.append("-vv")
    
    result = pytest.main(args)
    
    print()
    print("=" * 70)
    if result == 0:
        print("All tests passed!")
    else:
        print("Some tests failed. Please review the output above.")
    print("=" * 70)
    
    return result


if __name__ == "__main__":
    sys.exit(main())

