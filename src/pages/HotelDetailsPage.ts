import { BasePage } from './BasePage';
import { SummaryBookingPage } from './SummaryBookingPage';

export class HotelDetailsPage extends BasePage {
    override pagePrefix: string = '/h/nl/bookaccommodation';

    async pageLoaded() {
        await this.browser.waitForUrl(new RegExp(`.*${this.pagePrefix}.*`), {
            timeout: 30000,
            waitUntil: 'domcontentloaded',
        });
        await this.browser.waitForLocator(this.browser.locator('[aria-label="unit details hero nanner"]')); // banner or nanner?!!!
        await this.browser.waitForLocator(this.browser.locator('[id="progressBarNavigation__component"]'));
        await this.browser.waitForLocator(this.browser.locator('[id="OverviewComponentContainer"]'));

        return this;
    }

    navigate(): Promise<this> {
        throw new Error('Method not implemented.');
    }

    async proceedBooking(): Promise<SummaryBookingPage> {
        await this.browser.clickOnLocator(this.browser.locator('.ProgressbarNavigation__summaryButton'));

        return new SummaryBookingPage(this.page).pageLoaded();
    }
}
