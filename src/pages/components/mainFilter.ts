import { expect, Locator, Page } from '@playwright/test';
import { UiElements } from '@src/framework/UiElements';
import { getRandomArrayElement, getRandomInt } from '@src/helpers/randomHelper';
import { FilterDayTolerance } from '@src/types';

export class MainFilterComponent {
    private browser: UiElements;
    private readonly searchFilterSelector = '.UI__choiceSearchPanel';
    private readonly departureAirportLocator: Locator;

    constructor(private page: Page) {
        this.browser = new UiElements(this.page);
        this.departureAirportLocator = this.browser
            .locator(this.searchFilterSelector)
            .locator('input[name="Departure Airport"]');
    }

    async setDepartureAirport(airportName?: string): Promise<void> {
        await this.openDepartureAirportDropdown();
        await this.selectDepartureAirportByName(airportName);
        await this.saveForm('Departure');
    }

    async setDestinationAirport(countryName?: string, cityName?: string): Promise<void> {
        await this.openDestinationAirportDropdown();
        await this.selectDestinationAirport(countryName, cityName);
        await this.saveForm('Destination');
    }

    async setDepartureDate(daysTolerance: FilterDayTolerance): Promise<void> {
        await this.openDepartureDatePicker();
        await this.setDateTolerance(daysTolerance);
        await this.setDatePicker();
        await this.saveForm('Date');
    }

    async isMonthAvailable(): Promise<boolean> {
        await this.openDepartureDatePicker();
        const monthSelector = this.browser
            .locator('.dropModalScope_Departuredate .SelectLegacyDate__monthSelector')
            .filter({ hasText: 'EERDER VERTREKKEN' });

        const isMonthAvailable = await monthSelector.isVisible({ timeout: 2000 });

        await this.closeDepartureDate();

        return isMonthAvailable;
    }

    async resetFormSettings(resetFormName: 'Departure' | 'Destination'): Promise<void> {
        await this.openDestinationAirportDropdown();
        let resetButtonLocator: Locator;

        if (resetFormName === 'Destination') {
            resetButtonLocator = this.browser.locator('.dropModalScope_destinations [class="DropModal__clear"]');
        } else {
            resetButtonLocator = this.browser.locator('.dropModalScope_airports [class="DropModal__clear"]');
        }
        await this.browser.clickOnLocator(resetButtonLocator);
    }

    async closeDestinationAirportDropdown(): Promise<void> {
        const closeButton = this.browser.locator('[aria-label="destinations close"]');

        await this.browser.clickOnLocator(closeButton);
        await expect(closeButton, 'Destination airport dropdown did not close').toBeHidden();
    }

    async openTravelersDropdown(): Promise<void> {
        const travelersDropdownInput = this.browser.locator('[data-test-id="rooms-and-guest-input"]');

        await this.browser.clickOnLocator(travelersDropdownInput);

        const travelersDropdownContent = this.browser.locator('.dropModalScope_roomandguest');

        await this.browser.waitForLocator(travelersDropdownContent);
    }

    async selectAdultsCount(adultsCount = 2): Promise<void> {
        const adultsCounterLocator = this.browser.locator('.AdultSelector__adultSelector select');

        await adultsCounterLocator.selectOption({ label: adultsCount.toString() });
    }

    async selectChildrenCount(childrenAges: Array<number>): Promise<void> {
        const childrenCounterLocator = this.browser.locator('.ChildrenSelector__childrenSelector select');

        if (childrenAges.length === 0) {
            childrenAges = [getRandomInt(0, 17)];
        }
        await childrenCounterLocator.selectOption({ label: childrenAges.length.toString() });

        const childrenAgesSelectLocatorList = await this.browser.locator('.ChildrenAge__childAgeSelector select').all();

        for (const child of childrenAges) {
            const i = childrenAges.indexOf(child);

            await childrenAgesSelectLocatorList[i].selectOption({ label: child.toString() });
        }
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

    private async selectDestinationAirport(countryName?: string, cityName?: string): Promise<void> {
        await this.selectDestinationCountry(countryName);
        await this.setDestinationCityAirport(cityName);
    }

    private async selectDestinationCountry(countryName?: string): Promise<void> {
        const availableCountriesLocators = await this.getAllAvailableDestinationCountries();

        let selectedCountry: { locator: Locator; name: string };

        if (countryName) {
            const country = availableCountriesLocators.find((a) => a.name.includes(countryName));

            if (country) {
                selectedCountry = country;
            } else {
                throw new Error(`Country with name ${countryName} not found among available options.`);
            }
        } else {
            selectedCountry = getRandomArrayElement<{ locator: Locator; name: string }>(availableCountriesLocators);
        }
        console.log(`Select destination country: ${selectedCountry.name}`);
        await this.browser.clickOnLocator(selectedCountry.locator);
        await expect(
            selectedCountry.locator,
            `Failed to select destination country: ${selectedCountry.name}`,
        ).toBeHidden();
    }

    private async selectDepartureAirportByName(airportName?: string): Promise<void> {
        const availableAirportsLocators = await this.getAllAvailableDepartureAirports();
        let selectedAirport: { locator: Locator; name: string };

        if (airportName) {
            const airport = availableAirportsLocators.find((a) => a.name.includes(airportName));

            if (airport) {
                selectedAirport = airport;
            } else {
                throw new Error(`Airport with name ${airportName} not found among available options.`);
            }
        } else {
            selectedAirport = getRandomArrayElement<{ locator: Locator; name: string }>(availableAirportsLocators);
        }
        console.log(`Select departure airport: ${selectedAirport.name}`);
        await this.browser.clickOnLocator(selectedAirport.locator);
    }

    private async openDepartureAirportDropdown(): Promise<void> {
        await this.browser.clickOnLocator(this.departureAirportLocator);
    }

    private async openDestinationAirportDropdown(): Promise<void> {
        const destinationAirportLocator = this.browser
            .locator("[data-test-id='destination-input']~span")
            .getByText('Lijst');

        await this.browser.clickOnLocator(destinationAirportLocator);
        const destinationAirportsDropdown = this.browser.locator(
            '.dropModalScope_destinations .DestinationsList__destinationListContainer ul',
        );

        await this.browser.waitForLocator(destinationAirportsDropdown);
    }

    private async getAllAvailableDepartureAirports(): Promise<Array<{ locator: Locator; name: string }>> {
        const availableAirports: Array<{ locator: Locator; name: string }> = [];
        const airportsArea = this.browser.locator('.SelectAirports__droplistContainer');

        await this.browser.waitForLocator(airportsArea);
        const allAirports = await airportsArea.locator('[role="checkbox"]').all();

        console.log('Filter available airports');
        for (const airport of allAirports) {
            await this.browser.waitForLocator(airport);
            const isDisabled = await airport.locator('input').isDisabled();
            const text = await airport.innerText();

            if (isDisabled === false) {
                availableAirports.push({ locator: airport, name: text });
            }
        }

        return availableAirports;
    }

    private async getAllAvailableDestinationCountries(): Promise<Array<{ locator: Locator; name: string }>> {
        const availableAirports: Array<{ locator: Locator; name: string }> = [];
        const airportsDropDown = this.browser.locator('.dropModalScope_destinations .DropModal__content');

        await this.browser.waitForLocator(airportsDropDown);
        const airportsListItems = await airportsDropDown.locator('li>a').all();

        for (const airport of airportsListItems) {
            await this.browser.waitForLocator(airport);
            const className = await airport.getAttribute('class');
            const text = await airport.innerText();

            if (!className?.includes('disabled')) {
                availableAirports.push({ locator: airport, name: text });
            }
        }

        if (availableAirports.length === 0) {
            throw new Error('No available destination airports found.');
        }

        return availableAirports;
    }

    private async setDestinationCityAirport(cityName?: string): Promise<void> {
        const subItemAreaLocator = this.browser.locator('.DestinationsList__droplistContainer');

        await this.browser.waitForLocator(subItemAreaLocator);
        const allSubItems = await subItemAreaLocator.locator('[aria-checked="false"]').all();
        const allCities = Array<{ locator: Locator; name: string }>();
        let selectedSubItem: { locator: Locator; name: string };

        for (const item of allSubItems) {
            await this.browser.waitForLocator(item);
            const text = await item.innerText();

            allCities.push({ locator: item, name: text });
        }

        if (cityName) {
            const city = allCities.find((a) => a.name.includes(cityName));

            if (city) {
                selectedSubItem = city;
            } else {
                throw new Error(`City with name ${cityName} not found among available options.`);
            }
        } else {
            const subItem = getRandomArrayElement(allCities);

            selectedSubItem = { locator: subItem.locator, name: subItem.name };
        }

        console.log(`Select destination city/airport: ${selectedSubItem.name}`);
        await this.browser.clickOnLocator(selectedSubItem.locator);
    }

    private async openDepartureDatePicker(): Promise<void> {
        const departureDateInput = this.browser.locator('[data-test-id="departure-date-input"]');

        await this.browser.clickOnLocator(departureDateInput);
        await this.browser.waitForLocator(
            this.browser.locator('.DropModal__dropModalContent.dropModalScope_Departuredate'),
        );
    }

    private async setDateTolerance(daysTolerance: FilterDayTolerance): Promise<void> {
        const toleranceAreaLocator = this.browser.locator('.SelectLegacyDate__flexibilityOnly');

        await this.browser.waitForLocator(toleranceAreaLocator);
        let selectedToleranceSettings: string;

        switch (daysTolerance) {
            case '0':
                selectedToleranceSettings = 'Niet flexibel';
                break;
            case '3':
                selectedToleranceSettings = '+/- 3 dagen';
                break;
            case '7':
                selectedToleranceSettings = '+/- 7 dagen';
                break;
            case '14':
                selectedToleranceSettings = '+/- 14 dagen';
                break;
            default:
                selectedToleranceSettings = 'Niet flexibel';
                break;
        }

        const selectedRadio = toleranceAreaLocator.locator('li').getByText(selectedToleranceSettings);

        await this.browser.clickOnLocator(selectedRadio);
        const radioInput = toleranceAreaLocator.locator('li input[aria-label="' + selectedToleranceSettings + '"]');
        const isChecked = await radioInput.isChecked();

        expect(isChecked, `Failed to select date tolerance: ${selectedToleranceSettings}`).toBeTruthy();
    }

    private async setDatePicker(): Promise<void> {
        const availableDates = await this.getAllAvailableDates();
        const selectedDate = getRandomArrayElement<{ locator: Locator; date: string }>(availableDates);

        console.log(`Select departure date: ${selectedDate.date}`);
        await this.browser.clickOnLocator(selectedDate.locator);
    }

    private async getAllAvailableDates(): Promise<Array<{ locator: Locator; date: string }>> {
        const availableDateLocators = this.browser.locator('.SelectLegacyDate__calendar');

        await this.browser.waitForLocator(availableDateLocators);

        const availableDates: Array<{ locator: Locator; date: string }> = [];
        const allDateCells = await availableDateLocators.locator('td.SelectLegacyDate__available').all();

        for (const dateCell of allDateCells) {
            await this.browser.waitForLocator(dateCell);
            const dateText = await dateCell.innerText();

            availableDates.push({ locator: dateCell, date: dateText });
        }

        expect(availableDates.length, 'No available dates found').toBeGreaterThan(0);

        return availableDates;
    }

    private async closeDepartureDate(): Promise<void> {
        const closeButton = this.browser.locator('[aria-label="Departure date close"]');

        await this.browser.clickOnLocator(closeButton);

        await expect(closeButton, 'Departure date picker did not close').toBeHidden();
    }
}
