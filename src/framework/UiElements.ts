import { expect, Locator, Page } from '@playwright/test';

/**
 * UI Elements utility class that provides common methods for interacting with page elements.
 * This class wraps Playwright's Page API to provide reusable methods for test automation.
 */
export class UiElements {
    private defaultTimeout = 30000;

    /**
     * Creates an instance of UiElements.
     * @param page - The Playwright Page instance to interact with.
     */
    constructor(private page: Page) {}

    /**
     * Locates elements by their text content.
     * @param text - The text content to search for.
     * @param exact - Whether to match the text exactly or partially. Defaults to false.
     * @returns A Locator for the element containing the specified text.
     * @example
     * ```typescript
     * const button = uiElements.getByText('Click me');
     * const exactMatch = uiElements.getByText('Submit', true);
     * ```
     */
    getByText(text: string, exact = false): Locator {
        return this.page.getByText(text, { exact });
    }

    /**
     * Locates elements by their test ID (data-testid attribute).
     * @param value - The test ID value to search for.
     * @returns A Locator for the element with the specified test ID.
     * @example
     * ```typescript
     * const loginButton = uiElements.getById('login-btn');
     * ```
     */
    getById(value: string): Locator {
        return this.page.getByTestId(value);
    }

    /**
     * Creates a locator for elements matching the given CSS selector.
     * @param selector - The CSS selector to match elements.
     * @param options - Additional filtering options for the locator.
     * @param options.has - Matches elements that contain a descendant matching this locator.
     * @param options.hasNot - Matches elements that do not contain a descendant matching this locator.
     * @param options.hasNotText - Matches elements that do not contain the specified text.
     * @param options.hasText - Matches elements that contain the specified text.
     * @returns A Locator for elements matching the selector and options.
     * @example
     * ```typescript
     * const button = uiElements.locator('button', { hasText: 'Submit' });
     * const form = uiElements.locator('form', { has: page.locator('input') });
     * ```
     */
    locator(
        selector: string,
        options?: {
            has?: Locator;
            hasNot?: Locator;
            hasNotText?: string | RegExp;
            hasText?: string | RegExp;
        },
    ): Locator {
        return this.page.locator(selector, options);
    }

    /**
     * Waits for the specified amount of time.
     * @param timeout - The time to wait in milliseconds.
     * @returns A Promise that resolves after the timeout.
     * @example
     * ```typescript
     * await uiElements.waitForTimeout(2000); // Wait for 2 seconds
     * ```
     */
    async waitForTimeout(timeout: number): Promise<void> {
        await this.page.waitForTimeout(timeout);
    }

    /**
     * Waits for the page to navigate to a URL matching the specified pattern.
     * @param url - The URL pattern to wait for (string, RegExp, or function).
     * @param options - Additional wait options.
     * @param options.timeout - Maximum wait time in milliseconds. Defaults to 30000ms.
     * @param options.waitUntil - When to consider navigation successful. Defaults to 'networkidle'.
     * @returns A Promise that resolves when the URL matches.
     * @example
     * ```typescript
     * await uiElements.waitForUrl('/dashboard');
     * await uiElements.waitForUrl(/\/user\/\d+/, { timeout: 15000 });
     * ```
     */
    async waitForUrl(
        url: string | RegExp | ((url: URL) => boolean),
        options?: {
            timeout?: number;
            waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit';
        },
    ): Promise<void> {
        const opts = {
            timeout: options?.timeout ?? this.defaultTimeout,
            waitUntil: options?.waitUntil ?? 'networkidle',
        };

        await this.page.waitForURL(url, opts);
    }

    /**
     * Gets the current URL of the page.
     * @returns The current page URL as a string.
     * @example
     * ```typescript
     * const currentUrl = uiElements.getUrl();
     * console.log(`Current page: ${currentUrl}`);
     * ```
     */
    getUrl(): string {
        return this.page.url();
    }

    /**
     * Navigates to the specified path/URL.
     * @param path - The path or URL to navigate to.
     * @param options - Navigation options.
     * @param options.timeout - Maximum navigation time in milliseconds. Defaults to 30000ms.
     * @param options.waitUntil - When to consider navigation successful. Defaults to 'domcontentloaded'.
     * @returns A Promise that resolves to the Page instance after navigation.
     * @example
     * ```typescript
     * await uiElements.gotoPath('/login');
     * await uiElements.gotoPath('https://example.com', { waitUntil: 'networkidle' });
     * ```
     */
    async gotoPath(
        path: string,
        options?: {
            timeout?: number;
            waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit';
        },
    ): Promise<Page> {
        const opts = {
            timeout: options?.timeout ?? this.defaultTimeout,
            waitUntil: options?.waitUntil ?? 'domcontentloaded',
        };

        await this.page.goto(path, opts);

        return this.page;
    }

    /**
     * Waits for the page title to match the specified pattern.
     * @param title - The expected title (string or RegExp pattern).
     * @param options - Maximum wait time in milliseconds. Defaults to 30000ms.
     * @returns A Promise that resolves when the title matches.
     * @throws Will throw an error if the title doesn't match within the timeout.
     * @example
     * ```typescript
     * await uiElements.waitForTitle('Dashboard - MyApp');
     * await uiElements.waitForTitle(/Dashboard/, 15000);
     * ```
     */
    async waitForTitle(title: string | RegExp, options = this.defaultTimeout): Promise<void> {
        await expect(this.page, `Expected Title ${title} not match Actual`).toHaveTitle(`${title}`, {
            timeout: options,
        });
    }

    /**
     * Waits for a locator to be visible on the page.
     * @param locator - The locator to wait for.
     * @param opts - Wait options.
     * @param opts.timeout - Maximum wait time in milliseconds. Defaults to 30000ms.
     * @param opts.visible - Whether to wait for visibility (true) or invisibility (false). Defaults to true.
     * @returns A Promise that resolves when the locator becomes visible.
     * @throws Will throw an error if the element doesn't become visible within the timeout.
     * @example
     * ```typescript
     * const button = page.locator('button');
     * await uiElements.waitForLocator(button);
     * await uiElements.waitForLocator(button, { timeout: 15000 });
     * ```
     */
    async waitForLocator(
        locator: Locator,
        opts: { timeout?: number; visible?: boolean } = {
            timeout: this.defaultTimeout,
            visible: true,
        },
    ): Promise<void> {
        await expect(locator).toBeVisible(opts);
    }

    /**
     * Clicks on the specified locator element.
     * This method waits for the element to be actionable before clicking.
     * @param locator - The locator of the element to click.
     * @param timeout - Maximum time to wait for the element to be clickable in milliseconds. Defaults to 30000ms.
     * @returns A Promise that resolves after the click action completes.
     * @throws Will throw an error if the element is not clickable within the timeout.
     * @example
     * ```typescript
     * const button = page.locator('button[type="submit"]');
     * await uiElements.clickOnLocator(button);
     * await uiElements.clickOnLocator(button, 15000); // Custom timeout
     * ```
     */
    async clickOnLocator(locator: Locator, timeout = this.defaultTimeout): Promise<void> {
        await expect(locator).toBeVisible({ timeout });
        await locator.click({ timeout });
    }

    /**
     * Simulates pressing a keyboard key.
     * @param key - The key to press (e.g., 'Enter', 'Escape', 'Tab', 'ArrowDown').
     * @returns A Promise that resolves after the key press.
     * @example
     * ```typescript
     * await uiElements.pushKey('Enter');
     * await uiElements.pushKey('Escape');
     * await uiElements.pushKey('Tab');
     * ```
     */
    async pushKey(key: string): Promise<void> {
        await this.page.keyboard.press(key);
    }

    /**
     * Reloads the current page.
     * @returns A Promise that resolves after the page reload completes.
     * @example
     * ```typescript
     * await uiElements.reload();
     * ```
     */
    async reload(): Promise<void> {
        await this.page.reload();
    }

    /**
     * Waits for an element to become visible with retry logic.
     * This method will reload the page and retry until the element appears or max retries is reached.
     * @param locator - The locator of the element to wait for.
     * @param maxRetries - Maximum number of retry attempts. Defaults to 10.
     * @param timeout - Wait time between retries in seconds. Defaults to 1 second.
     * @returns A Promise that resolves when the element becomes visible.
     * @throws Will throw an error if the element doesn't appear after all retry attempts.
     * @example
     * ```typescript
     * const dynamicElement = page.locator('.dynamic-content');
     * await uiElements.waitForElementWithRetries(dynamicElement, 5, 2);
     * ```
     */
    async waitForElementWithRetries(locator: Locator, maxRetries = 10, timeout = 1): Promise<void> {
        for (let i = 0; i < maxRetries; i++) {
            await this.page.reload();
            await this.page.waitForTimeout(timeout * 1000);

            const isVisible = await locator.isVisible().catch(() => false);

            if (isVisible) {
                // eslint-disable-next-line no-console
                console.log(`Element appeared after ${i + 1} attempt(s).`);

                return;
            }

            // eslint-disable-next-line no-console
            console.log(`Attempt ${i + 1}: Element not visible, retrying...`);
        }

        throw new Error(`Element did not appear after ${maxRetries} attempts.`);
    }

    /**
     * Gets the value property of an input element.
     * This method evaluates the element in the browser context to retrieve its current value.
     * @param locator - The locator of the input element.
     * @returns A Promise that resolves to the input element's value as a string.
     * @example
     * ```typescript
     * const input = page.locator('input[name="username"]');
     * const value = await uiElements.getValueProperty(input);
     * console.log(`Input value: ${value}`);
     * ```
     */
    async getProperty(locator: Locator, property: string): Promise<string> {
        return await locator.evaluate((el: HTMLElement) => el[property as keyof HTMLElement] as string);
    }

    /**
     * Fills an input element with the specified value.
     * @param locator - The locator of the input element.
     * @param value - The value to fill into the input element.
     */
    async fillInput(locator: Locator, value: string): Promise<void> {
        await this.waitForLocator(locator);
        await locator.fill(value);
    }

    /**
     * Selects an option in a dropdown element.
     * @param locator - The locator of the dropdown element.
     * @param value - The value to select.
     */
    async selectOption(locator: Locator, value: string): Promise<void> {
        await this.waitForLocator(locator);
        await locator.selectOption(value);
    }
}
