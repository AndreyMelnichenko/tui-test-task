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
├── .github/               # GitHub workflows and templates
├── .vscode/               # VS Code configuration
│   ├── launch.json        # Debug configurations
│   └── settings.json      # Workspace settings
├── src/                   # Source code
│   ├── framework/         # Test framework utilities
│   ├── helpers/           # Helper functions
│   └── pages/             # Page Object Model classes
├── tests/                 # Test files
│   └── example.spec.ts    # Example test suite
├── .eslintrc.json         # ESLint configuration
├── .prettierrc            # Prettier configuration
├── global-setup.ts        # Global test setup
├── playwright.config.ts   # Playwright configuration
├── tsconfig.json          # TypeScript configuration
├── package.json           # Project dependencies
└── README.md              # Project documentation
```

## 🧪 Running Tests

### Run all tests

```bash
npm test
# or
npx playwright test
```

### Run tests with specific tag

```bash
TAG=TUI-001 npm test
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

### View test report

```bash
npm run report
```

### Code quality commands

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Build TypeScript
npm run build
```

## ⚙️ Configuration

The project is configured via `playwright.config.ts`:

- **Test Directory**: `./tests`
- **Test Filtering**: By TAG environment variable
- **Parallel Execution**: Enabled (4 workers on CI, 1 locally)
- **Browsers**: Chromium (Desktop Chrome)
- **Reporter**: HTML (opens never)
- **Trace**: On first retry
- **Screenshots**: Only on failure
- **Video**: On (retain on failure for CI)
- **Retries**: 2 on CI, 0 locally
- **Timezone**: Europe/Kyiv
- **Global Setup**: Configured via `global-setup.ts`

### Environment Variables

- `TAG`: Filter tests by tag (e.g., `TUI-001`)
- `CI`: Determines if running in CI environment
- `BASE_URL_UI`: Base URL for the application under test

## ✍️ Writing Tests

Tests are written using Playwright's test framework with Page Object Model pattern.

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test('test description @TUI-001', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Expected Title/);
});
```

### Using Page Objects

```typescript
import { test, expect } from '@playwright/test';
import { MainPage } from '../src/pages/MainPage';

test('test with page object @TUI-001', async ({ page }) => {
    const mainPage = new MainPage(page);
    await mainPage.navigate();
    await expect(mainPage.title).toBeVisible();
});
```

### Test Tagging

Use tags in test names to filter tests:

```typescript
test('login functionality @TUI-001 @smoke', async ({ page }) => {
    // Test implementation
});
```

### Best Practices

- Use descriptive test names with tags
- Follow the AAA pattern (Arrange, Act, Assert)
- Implement Page Object Model for reusability
- Use Playwright's built-in locators and assertions
- Add proper wait conditions
- Use environment-specific configurations

## 📊 Reporting

After running tests, view the HTML report:

```bash
npm run report
# or
npx playwright show-report
```

Test results include:

- Test execution status and duration
- Screenshots on failure
- Video recordings (on by default, retained on failure for CI)
- Traces for debugging (on first retry)
- Performance metrics and timing data
- Test artifacts in `test-results/` directory

## 🐛 Debugging

### VS Code Debugging

The project includes VS Code debug configurations:

1. **PW-DEBUG**: Run tests with debugger attached
2. **Debug Playwright with Inspector**: Use Playwright Inspector for step-by-step debugging

### Debug Settings

- `debug.focusWindowOnBreak`: Automatically focuses VS Code on breakpoints
- `debug.focusEditorOnBreak`: Focuses editor when hitting breakpoints

### Manual Debugging

Add `await page.pause()` in your test to open Playwright Inspector:

```typescript
test('debug test', async ({ page }) => {
    await page.goto('/');
    await page.pause(); // Opens Playwright Inspector
    // Continue with test steps
});
```

## 🔄 CI/CD

The project is configured for CI environments:

- Tests run with 2 retries on CI
- 4 workers on CI for faster execution
- Fails build if `test.only` is found
- Video recording retained on failure for CI
- Headless mode enabled on CI
- TAG-based test filtering support

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
              run: npm test
              env:
                  CI: true
                  TAG: TUI-001
            - uses: actions/upload-artifact@v4
              if: always()
              with:
                  name: playwright-report
                  path: playwright-report/
                  retention-days: 30
            - uses: actions/upload-artifact@v4
              if: always()
              with:
                  name: test-results
                  path: test-results/
                  retention-days: 30
```

## 🔧 Development Tools

### Code Quality

- **ESLint**: JavaScript/TypeScript linting with Prettier integration
- **Prettier**: Code formatting
- **TypeScript**: Type checking and compilation
- **Pre-commit hooks**: Automated code quality checks

### IDE Configuration

- VS Code settings for consistent development experience
- Debug configurations for Playwright tests
- Recommended extensions and settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run code quality checks:
    ```bash
    npm run lint
    npm run format
    npm run build
    ```
5. Add tests for new functionality with appropriate tags
6. Ensure all tests pass: `npm test`
7. Commit your changes (`git commit -m 'Add amazing feature'`)
8. Push to the branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For questions or support, please open an issue in the [GitHub repository](https://github.com/AndreyMelnichenko/tui-test-task/issues).
