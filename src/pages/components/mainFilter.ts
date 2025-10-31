import { Locator, Page } from '@playwright/test';
import { UiElements } from '@src/framework/UiElements';

import { DepartureAirportFilter } from './departureAirportFilter';
import { DestinationAirportFilter } from './destinationAirportFilter';
import { DepartureDateFilter } from './departureDateFilter';
import { TravelersFilter } from './travelersFilter';

export class MainFilterComponent {
    private browser: UiElements;
    departureAirportFilter: DepartureAirportFilter;
    destinationAirportFilter: DestinationAirportFilter;
    departureDateFilter: DepartureDateFilter;
    travelersFilter: TravelersFilter;

    constructor(private page: Page) {
        this.browser = new UiElements(this.page);
        this.departureAirportFilter = new DepartureAirportFilter(this.page);
        this.destinationAirportFilter = new DestinationAirportFilter(this.page);
        this.departureDateFilter = new DepartureDateFilter(this.page);
        this.travelersFilter = new TravelersFilter(this.page);
    }

    async resetFormSettings(resetFormName: 'Departure' | 'Destination'): Promise<void> {
        await this.destinationAirportFilter.openDestinationAirportDropdown();
        let resetButtonLocator: Locator;

        if (resetFormName === 'Destination') {
            resetButtonLocator = this.browser.locator('.dropModalScope_destinations [class="DropModal__clear"]');
        } else {
            resetButtonLocator = this.browser.locator('.dropModalScope_airports [class="DropModal__clear"]');
        }
        await this.browser.clickOnLocator(resetButtonLocator);
    }

    async saveForm(nameSaveForm: 'Destination' | 'Departure' | 'Date' | 'Travelers'): Promise<void> {
        let buttonText: string;

        switch (nameSaveForm) {
            case 'Destination':
                buttonText = 'Opslaan destinations';
                break;
            case 'Departure':
                buttonText = 'Opslaan airports';
                break;
            case 'Date':
                buttonText = 'Opslaan Departure date';
                break;
            case 'Travelers':
                buttonText = 'Opslaan room and guest';
                break;
        }
        const saveAirportButton = this.browser.locator(`footer span[aria-label="${buttonText}"] button`);

        await this.browser.waitForLocator(saveAirportButton);
        await this.browser.clickOnLocator(saveAirportButton);
        await this.browser.waitForLocator(saveAirportButton, {
            visible: false,
        });
    }

    async search(): Promise<void> {
        const searchButton = this.browser.locator('[data-test-id="search-button"]');

        await this.browser.clickOnLocator(searchButton);
    }
}
