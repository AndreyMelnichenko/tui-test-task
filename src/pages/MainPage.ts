import { BasePage } from './BasePage';

export class MainPage extends BasePage {
    override pagePrefix: string = '/h/nl';
    private readonly cookiePopUp = this.browser.locator('[id="cmBannerDescription"]');

    async navigate() {
        await this.browser.gotoPath(`${this.pagePrefix}`, { timeout: 60000 });

        return await this.pageLoaded();
    }

    async pageLoaded() {
        await this.browser.waitForUrl(new RegExp(`.*${this.pagePrefix}.*`), {
            timeout: 10000,
            waitUntil: 'domcontentloaded',
        });
        await this.browser.waitForTitle('TUI - Live Happy - volledig verzorgde reizen');
        await this.browser.waitForLocator(this.cookiePopUp);

        return this;
    }

    async acceptCookies() {
        await this.browser.clickOnLocator(this.cookiePopUp.getByRole('button', { name: 'Accepteer cookies' }));
        await this.browser.waitForLocator(this.cookiePopUp, {
            visible: false,
        });
    }

    async selectRandomDepartureAirport() {
        await this.mainFilterComponent.setDepartureAirport();
    }
}
