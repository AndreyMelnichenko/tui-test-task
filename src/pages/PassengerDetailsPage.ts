import { PassengerDetailsData } from '@src/types';
import { expect } from '@playwright/test';

import { BasePage } from './BasePage';

export class PassengerDetailsPage extends BasePage {
    override pagePrefix: string = '/h/nl/book/passengerdetails';

    async pageLoaded() {
        await this.browser.waitForUrl(new RegExp(`.*${this.pagePrefix}.*`), {
            timeout: 40000,
            waitUntil: 'domcontentloaded',
        });
        await this.browser.waitForLocator(this.browser.locator('h1').filter({ hasText: 'Persoonsgegevens' }));

        return this;
    }

    navigate(): Promise<this> {
        throw new Error('Method not implemented.');
    }

    async personalDetailsValidating(objectToCheck: PassengerDetailsData, errorText?: string) {
        for (const [key, value] of Object.entries(objectToCheck)) {
            for (const [subKey, subValue] of Object.entries(value)) {
                const locator = this.inputLocatorBuilder(key, subKey);

                await this.browser.waitForLocator(locator);
                if (subKey === 'gender') {
                    await this.browser.selectOption(locator, subValue);
                    continue;
                }
                await this.browser.fillInput(locator, subValue);
                await this.browser.clickOnLocator(this.browser.locator('[aria-label="page heading"]'));
                await this.browser.waitForLocator(this.errorLocatorBuilder(key, subKey));

                expect(await this.errorLocatorBuilder(key, subKey).innerText()).toEqual(errorText);
            }
        }
    }

    private inputLocatorBuilder(key: string, subKey: string) {
        return this.browser.locator(`[id="${subKey.toUpperCase()}${key.toUpperCase()}"]`);
    }

    private errorLocatorBuilder(key: string, subKey: string) {
        return this.browser.locator(`[id="${subKey.toUpperCase()}${key.toUpperCase()}__errorMessage"]`);
    }
}
