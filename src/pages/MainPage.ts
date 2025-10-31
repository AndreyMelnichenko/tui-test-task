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
        await this.mainFilterComponent.departureAirportFilter.setDepartureAirport(airportName);
        await this.mainFilterComponent.saveForm('Departure');
    }

    async selectRandomDestinationAirport(countryName?: string, cityName?: string) {
        await this.mainFilterComponent.destinationAirportFilter.setDestinationAirport(countryName, cityName);
        await this.mainFilterComponent.saveForm('Destination');
    }

    async selectDepartureDate(daysTolerance: FilterDayTolerance = '0') {
        while (!(await this.mainFilterComponent.departureDateFilter.isMonthAvailable())) {
            console.log('Month is not available, resetting destination airport and trying again...');
            await this.mainFilterComponent.resetFormSettings('Destination');
            await this.mainFilterComponent.destinationAirportFilter.closeDestinationAirportDropdown();
            await this.mainFilterComponent.destinationAirportFilter.setDestinationAirport();
        }

        await this.mainFilterComponent.departureDateFilter.setDepartureDate(daysTolerance);
        await this.mainFilterComponent.saveForm('Date');
    }

    async selectTravelers(adultsCount: number, childrenAges?: Array<number>) {
        await this.mainFilterComponent.travelersFilter.openTravelersDropdown();
        await this.mainFilterComponent.travelersFilter.selectAdultsCount(adultsCount);
        if (childrenAges) {
            await this.mainFilterComponent.travelersFilter.selectChildrenCount(childrenAges);
        }
    }

    async clickSearchButton() {
        await this.mainFilterComponent.search();

        return new SearchResultPage(this.page).pageLoaded();
    }
}
