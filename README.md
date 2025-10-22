# TUI Test Task

A test automation project built with Playwright and TypeScript for end-to-end testing.

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Running Tests](#running-tests)
- [Configuration](#configuration)
- [Writing Tests](#writing-tests)
- [Reporting](#reporting)
- [CI/CD](#cicd)

## 🔧 Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## 🚀 Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/AndreyMelnichenko/tui-test-task.git
    cd tui-test-task
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Install Playwright browsers:
    ```bash
    npx playwright install
    ```

## 📁 Project Structure

```
tui-test-task/
├── tests/                 # Test files
│   └── example.spec.ts    # Example test suite
├── playwright.config.ts   # Playwright configuration
├── package.json          # Project dependencies
└── README.md             # Project documentation
```

## 🧪 Running Tests

### Run all tests

```bash
npx playwright test
```

### Run tests in headed mode (with browser UI)

```bash
npx playwright test --headed
```

### Run specific test file

```bash
npx playwright test tests/example.spec.ts
```

### Run tests in debug mode

```bash
npx playwright test --debug
```

### Run tests with specific browser

```bash
npx playwright test --project=chromium
```

## ⚙️ Configuration

The project is configured via `playwright.config.ts`:

- **Test Directory**: `./tests`
- **Parallel Execution**: Enabled
- **Browsers**: Chromium (Desktop Chrome)
- **Reporter**: HTML
- **Trace**: On first retry
- **Retries**: 2 on CI, 0 locally

## ✍️ Writing Tests

Tests are written using Playwright's test framework. Example structure:

```typescript
import { test, expect } from '@playwright/test';

test('test description', async ({ page }) => {
    await page.goto('https://example.com');
    await expect(page).toHaveTitle(/Expected Title/);
});
```

### Best Practices

- Use descriptive test names
- Follow the AAA pattern (Arrange, Act, Assert)
- Use page object model for complex applications
- Utilize Playwright's built-in locators and assertions

## 📊 Reporting

After running tests, view the HTML report:

```bash
npx playwright show-report
```

Test results include:

- Test execution status
- Screenshots on failure
- Traces for debugging
- Performance metrics

## 🔄 CI/CD

The project is configured for CI environments:

- Tests run with 2 retries on CI
- Single worker on CI for stability
- Fails build if `test.only` is found

### GitHub Actions Example

```yaml
name: Playwright Tests
on:
    push:
        branches: [main, master]
    pull_request:
        branches: [main, master]
jobs:
    test:
        timeout-minutes: 60
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v4
            - uses: actions/setup-node@v4
              with:
                  node-version: lts/*
            - name: Install dependencies
              run: npm ci
            - name: Install Playwright Browsers
              run: npx playwright install --with-deps
            - name: Run Playwright tests
              run: npx playwright test
            - uses: actions/upload-artifact@v4
              if: always()
              with:
                  name: playwright-report
                  path: playwright-report/
                  retention-days: 30
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For questions or support, please open an issue in the [GitHub repository](https://github.com/AndreyMelnichenko/tui-test-task/issues).
