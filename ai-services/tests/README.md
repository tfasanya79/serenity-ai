# AI Services Tests

This directory contains tests for the AI services component of SerenityAI.

## Test Files

- `test_basic.py` - Basic environment and import tests
- `test_models.py` - AI model functionality tests

## Running Tests

```bash
# Run all tests
python -m pytest tests/

# Run specific test file
python -m pytest tests/test_basic.py

# Run with verbose output
python -m pytest tests/ -v
```

## Test Philosophy

These tests are designed to:
1. **Gracefully handle missing dependencies** - Tests will skip rather than fail if heavy ML dependencies are missing
2. **Validate basic functionality** - Ensure modules can be imported and basic operations work
3. **Support CI/CD environments** - Work in environments where GPU-heavy dependencies might not be available

## CI/CD Integration

The tests are integrated into the GitHub Actions workflow and will:
- Install dependencies from `requirements.txt`
- Run basic validation tests
- Skip heavy ML tests if dependencies are unavailable
- Report results without failing the entire pipeline unnecessarily
