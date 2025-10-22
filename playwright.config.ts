import { defineConfig, devices } from '@playwright/test';
import { BASE_URL_UI, isCI } from '@config';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
    grep: new RegExp(`.*(${process.env['TAG'] ?? '@smoke'}).*`, 'gm'),
    testDir: './tests',
    /* Run tests in files in parallel */
    fullyParallel: true,
    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: isCI(),
    /* Retry on CI only */
    retries: isCI() ? 2 : 0,
    /* Opt out of parallel tests on CI. */
    workers: isCI() ? 4 : 1,
    timeout: 30 * 60 * 1000,
    expect: {
        timeout: 10 * 1000,
    },
    globalSetup: './global-setup.ts',
    reporter: [['html', { open: 'never' }], ['list']],
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Base URL to use in actions like `await page.goto('/')`. */
        // baseURL: 'http://127.0.0.1:3000',

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: isCI() ? 'retain-on-failure' : 'on',
        baseURL: BASE_URL_UI(),
        headless: process.env['CI'] === 'true',
        actionTimeout: 30 * 1000,
        navigationTimeout: 30 * 1000,
        timezoneId: 'Europe/Kyiv',
    },

    projects: [
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                viewport: { width: 1920, height: 1080 },
                launchOptions: {
                    args: ['--start-maximized', '--disable-web-security', '--disable-features=VizDisplayCompositor'],
                },
            },
        },
    ],
});
