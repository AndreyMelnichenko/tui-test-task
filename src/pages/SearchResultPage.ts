import { BasePage } from './BasePage';
import { HotelDetailsPage } from './HotelDetailsPage';

export class SearchResultPage extends BasePage {
    override pagePrefix = '/h/nl/packages';
    private readonly resultsList = this.browser.locator('[data-test-id="search-results-list"]');
    private readonly filterPanel = this.browser.locator('.flitersPanel'); // WTF class name !!!! should be "filtersPanel"
    private readonly resultItem = this.browser.locator('section[data-test-result-item-uniq-id]');

    async pageLoaded() {
        await this.browser.waitForUrl(new RegExp(`.*${this.pagePrefix}.*`), {
            timeout: 10000,
            waitUntil: 'domcontentloaded',
        });
        await this.browser.waitForLocator(this.resultsList);
        await this.browser.waitForLocator(this.filterPanel);

        return this;
    }

    navigate(): Promise<this> {
        throw new Error('Method not implemented.');
    }

    async pickSearchResult(resultIndex: number = 0) {
        await this.browser.clickOnLocator(this.resultItem.locator('.ResultListItemV2__details h5 a').nth(resultIndex));

        return new HotelDetailsPage(this.page).pageLoaded();
    }
}
