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

- [Node.js](https://nodejs.org/) (version **20.0.0 or higher** - enforced by package.json engines)
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
├── .github/               # GitHub workflows and CI/CD configurations
├── .vscode/               # VS Code workspace settings and debug configurations
├── dist/                  # Compiled TypeScript output files
├── src/                   # Source code directory
│   ├── framework/         # Core test framework utilities and infrastructure
│   │   ├── config/        # Environment and application configuration files
│   │   └── fixtures/      # Custom Playwright fixtures and test contexts
│   ├── helpers/           # Utility functions and helper libraries
│   └── pages/             # Page Object Model classes and page abstractions
│       └── components/    # Reusable page components and UI elements
└── tests/                 # Test specification files and test suites
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

### Using Page Objects

```typescript
import { e2eUserTest } from '@src/framework/fixtures';

e2eUserTest('test with page object @TUI-001', async ({ userMainPage }) => {
    await userMainPage.acceptCookies();
    await userMainPage.selectRandomDepartureAirport();
});
```

### Using Custom Fixtures

```typescript
import { e2eUserTest } from '@src/framework/fixtures';

e2eUserTest(
    'Book TUI tour @TUI-001',
    {
        tag: ['@TUI-001', '@smoke'],
    },
    async ({ userMainPage }) => {
        await e2eUserTest.step('Accept cookies', async () => {
            await userMainPage.acceptCookies();
        });

        await e2eUserTest.step('Select departure airport', async () => {
            await userMainPage.selectRandomDepartureAirport();
        });
    },
);
```

### Test Tagging

Tests use tags for filtering and organization. Tags can be added in test names or fixture options:

```typescript
// Method 1: Tags in test name
e2eUserTest('Accept cookies and select airport @TUI-001 @smoke', async ({ userMainPage }) => {
    await userMainPage.acceptCookies();
    await userMainPage.selectRandomDepartureAirport();
});

// Method 2: Tags in fixture options
e2eUserTest(
    'Book TUI tour',
    {
        tag: ['@TUI-001', '@smoke'],
    },
    async ({ userMainPage }) => {
        // Test implementation
    },
);

// Method 3: Multiple tags for test categorization
e2eUserTest('Complex booking flow @TUI-002 @regression @booking', async ({ userMainPage }) => {
    // Test implementation
});
```

**Common tag patterns:**

- `@TUI-001`, `@TUI-002` - Test case identifiers
- `@smoke` - Critical functionality tests
- `@regression` - Full regression test suite
- `@booking` - Booking-related functionality

### Framework Features

- **Custom Fixtures**: Pre-configured browser contexts and page objects
- **UiElements Utility**: Comprehensive element interaction methods
- **Page Object Model**: Organized page classes with components
- **Random Helpers**: Utilities for generating test data
- **String Helpers**: Text manipulation utilities
- **Component-Based Architecture**: Reusable page components

### Best Practices

- Use descriptive test names with tags
- Follow the AAA pattern (Arrange, Act, Assert)
- Leverage custom fixtures for consistent test setup
- Implement Page Object Model with component architecture
- Use the UiElements utility class for element interactions
- Utilize helper functions for data generation
- Add proper wait conditions and error handling
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

**Recommended approach**: Use VS Code debug configurations from `launch.json`:

1. **Set breakpoints** in your test files or page objects
2. **Run debug configuration**:
    - `PW-DEBUG`: Debug tests with custom environment variables
    - `Debug Playwright with Inspector`: Step-by-step debugging with Playwright Inspector

3. **Debug workflow**:

```typescript
e2eUserTest('debug test @TUI-001', async ({ userMainPage }) => {
    // Set breakpoint here ←
    await userMainPage.acceptCookies();

    // Set breakpoint here ←
    await userMainPage.selectRandomDepartureAirport();
});
```

**Alternative**: Add `await page.pause()` for inline debugging:

```typescript
e2eUserTest('inline debug test @TUI-001', async ({ userMainPage }) => {
    await userMainPage.acceptCookies();

    // Opens Playwright Inspector
    await userMainPage.page.pause();

    await userMainPage.selectRandomDepartureAirport();
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

## 🔧 Development Tools

### Code Quality

- **ESLint**: JavaScript/TypeScript linting with Prettier integration
- **Prettier**: Code formatting
- **TypeScript**: Type checking and compilation with build output to `dist/`
- **Pre-commit hooks**: Automated code quality checks

### Framework Architecture

- **UiElements Class**: Centralized UI interaction utilities with comprehensive JSDoc
- **Custom Fixtures**: Pre-configured test contexts with browser setup
- **Page Object Model**: Hierarchical page structure with base classes
- **Component Architecture**: Reusable page components (e.g., MainFilter)
- **Helper Libraries**: Random data generation and string manipulation utilities
- **Configuration Management**: Environment-specific settings and base URLs

### IDE Configuration

- VS Code settings for consistent development experience
- Debug configurations for Playwright tests with focus management
- Recommended extensions and settings
- TypeScript path mapping for clean imports (@src, @page, @config)

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
