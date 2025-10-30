import { BasePage } from './BasePage';
import { PassengerDetailsPage } from './PassengerDetailsPage';

export class SummaryBookingPage extends BasePage {
    override pagePrefix: string = '/h/nl/book/flow/summary';

    async pageLoaded() {
        await this.browser.waitForUrl(new RegExp(`.*${this.pagePrefix}.*`), {
            timeout: 10000,
            waitUntil: 'domcontentloaded',
        });
        await this.browser.waitForLocator(this.browser.locator('h1').filter({ hasText: 'Vakantie samenstellen' }));

        return this;
    }

    navigate(): Promise<this> {
        throw new Error('Method not implemented.');
    }

    async proceedBooking() {
        await this.browser.clickOnLocator(this.browser.locator('.ProgressbarNavigation__summaryButton button'));

        return new PassengerDetailsPage(this.page).pageLoaded();
    }
}
