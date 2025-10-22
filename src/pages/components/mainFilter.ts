import { Locator, Page } from '@playwright/test';
import { UiElements } from '@src/framework/UiElements';
import { getRandomArrayElement } from '@src/helpers/randomHelper';

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
        await this.saveSelectedDepartureAirport();
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
        console.log(`Select airport: ${selectedAirport.name}`);
        await this.browser.clickOnLocator(selectedAirport.locator);
    }

    private async openDepartureAirportDropdown(): Promise<void> {
        await this.browser.clickOnLocator(this.departureAirportLocator);
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

    private async saveSelectedDepartureAirport(): Promise<void> {
        const saveAirportButton = this.browser.locator('footer span[aria-label="Opslaan airports"] button');

        await this.browser.waitForLocator(saveAirportButton);
        await this.browser.clickOnLocator(saveAirportButton);
        await this.browser.waitForLocator(saveAirportButton, {
            visible: false,
        });
    }
}
