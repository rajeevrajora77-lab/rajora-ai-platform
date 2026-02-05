# Contributing to Rajora AI Platform

We love your input! We want to make contributing to Rajora AI as easy and transparent as possible.

## Development Process

1. Fork the repo and create your branch from `main`
2. If you've added code, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Local Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/rajora-ai-platform.git
cd rajora-ai-platform

# Install dependencies
npm install
cd backend && pip install -r requirements.txt

# Start development stack
docker-compose up -d

# Run frontend
npm run dev

# Run backend (separate terminal)
cd backend && uvicorn main:app --reload
```

## Pull Request Process

1. Update README.md with details of changes if needed
2. Update API documentation for any endpoint changes
3. The PR will be merged once you have sign-off from maintainers

## Coding Standards

### Frontend (TypeScript/React)

- Use TypeScript strict mode
- Follow ESLint rules
- Use functional components with hooks
- Prefer composition over inheritance
- Write meaningful component names

### Backend (Python)

- Follow PEP 8 style guide
- Use type hints
- Write docstrings for functions
- Keep functions small and focused
- Use async/await for I/O operations

## Commit Messages

Use conventional commits:

```
feat: add user authentication
fix: resolve database connection issue
docs: update API documentation
chore: update dependencies
test: add chat completion tests
```

## Testing

### Frontend Tests

```bash
npm test
npm run test:e2e
```

### Backend Tests

```bash
cd backend
pytest tests/ -v
pytest tests/ --cov=api
```

## License

By contributing, you agree that your contributions will be licensed under the MIT License.