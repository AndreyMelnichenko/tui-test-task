import { expect, Locator, Page } from '@playwright/test';

export class UiElements {
    private defaultTimeout = 30000;

    constructor(private page: Page) {}

    getByText(text: string, exact = false): Locator {
        return this.page.getByText(text, { exact });
    }

    getById(value: string): Locator {
        return this.page.getByTestId(value);
    }

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

    async waitForTimeout(timeout: number): Promise<void> {
        await this.page.waitForTimeout(timeout);
    }

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

    getUrl(): string {
        return this.page.url();
    }

    async gotoPath(path: string): Promise<Page> {
        await this.page.goto(path);

        return this.page;
    }

    async waitForTitle(title: string | RegExp, options = this.defaultTimeout): Promise<void> {
        await expect(this.page, `Expected Title ${title} not match Actual`).toHaveTitle(`${title}`, {
            timeout: options,
        });
    }

    /**
     * Waits for a locator to be visible.
     * @param locator - The locator to wait for.
     * @param opts - Options for the wait.
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

    async pushKey(key: string): Promise<void> {
        await this.page.keyboard.press(key);
    }

    async reload(): Promise<void> {
        await this.page.reload();
    }

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

    async getValueProperty(locator: Locator): Promise<string> {
        return await locator.evaluate((el: HTMLInputElement) => el.value);
    }
}
