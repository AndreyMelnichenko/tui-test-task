import { Page, Locator, expect } from '@playwright/test';
import { UiElements } from '@src/framework/UiElements';
import { getRandomArrayElement } from '@src/helpers/randomHelper';

export class DestinationAirportFilter {
    private browser: UiElements;

    constructor(private page: Page) {
        this.browser = new UiElements(this.page);
    }

    async setDestinationAirport(countryName?: string, cityName?: string): Promise<void> {
        await this.openDestinationAirportDropdown();
        await this.selectDestinationAirport(countryName, cityName);
    }

    async openDestinationAirportDropdown(): Promise<void> {
        const destinationAirportLocator = this.browser
            .locator("[data-test-id='destination-input']~span")
            .getByText('Lijst');

        await this.browser.clickOnLocator(destinationAirportLocator);
        const destinationAirportsDropdown = this.browser.locator(
            '.dropModalScope_destinations .DestinationsList__destinationListContainer ul',
        );

        await this.browser.waitForLocator(destinationAirportsDropdown);
    }

    async closeDestinationAirportDropdown(): Promise<void> {
        const closeButton = this.browser.locator('[aria-label="destinations close"]');

        await this.browser.clickOnLocator(closeButton);
        await expect(closeButton, 'Destination airport dropdown did not close').toBeHidden();
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
}
