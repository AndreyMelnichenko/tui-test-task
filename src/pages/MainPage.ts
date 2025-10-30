import { FilterDayTolerance } from '@src/types';

import { BasePage } from './BasePage';
import { SearchResultPage } from './SearchResultPage';

export class MainPage extends BasePage {
    override pagePrefix: string = '/h/nl';
    private readonly cookiePopUp = this.browser.locator('[id="cmBannerDescription"]');

    async navigate() {
        await this.browser.gotoPath(`${this.pagePrefix}`, { timeout: 60000 });

        return await this.pageLoaded();
    }

    async pageLoaded() {
        await this.browser.waitForUrl(new RegExp(`.*${this.pagePrefix}.*`), {
            timeout: 40000,
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

    async selectRandomDepartureAirport(airportName?: string) {
        await this.mainFilterComponent.setDepartureAirport(airportName);
    }

    async selectRandomDestinationAirport(countryName?: string, cityName?: string) {
        return await this.mainFilterComponent.setDestinationAirport(countryName, cityName);
    }

    async selectDepartureDate(daysTolerance: FilterDayTolerance = '0') {
        while (!(await this.mainFilterComponent.isMonthAvailable())) {
            console.log('Month is not available, resetting destination airport and trying again...');
            await this.mainFilterComponent.resetFormSettings('Destination');
            await this.mainFilterComponent.closeDestinationAirportDropdown();
            await this.mainFilterComponent.setDestinationAirport();
        }

        return await this.mainFilterComponent.setDepartureDate(daysTolerance);
    }

    async selectTravelers(adultsCount: number, childrenAges?: Array<number>) {
        await this.mainFilterComponent.openTravelersDropdown();
        await this.mainFilterComponent.selectAdultsCount(adultsCount);
        if (childrenAges) {
            await this.mainFilterComponent.selectChildrenCount(childrenAges);
        }
    }

    async clickSearchButton() {
        await this.mainFilterComponent.search();

        return new SearchResultPage(this.page).pageLoaded();
    }
}
