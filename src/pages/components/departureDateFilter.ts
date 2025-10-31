import { Page, expect, Locator } from '@playwright/test';
import { UiElements } from '@src/framework/UiElements';
import { getRandomArrayElement } from '@src/helpers/randomHelper';
import { FilterDayTolerance } from '@src/types';

export class DepartureDateFilter {
    private browser: UiElements;

    constructor(private page: Page) {
        this.browser = new UiElements(this.page);
    }

    async setDepartureDate(daysTolerance: FilterDayTolerance): Promise<void> {
        await this.openDepartureDatePicker();
        await this.setDateTolerance(daysTolerance);
        await this.setDatePicker();
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

    private async openDepartureDatePicker(): Promise<void> {
        const departureDateInput = this.browser.locator('[data-test-id="departure-date-input"]');

        await this.browser.clickOnLocator(departureDateInput);
        await this.browser.waitForLocator(
            this.browser.locator('.DropModal__dropModalContent.dropModalScope_Departuredate'),
        );
    }

    private async closeDepartureDate(): Promise<void> {
        const closeButton = this.browser.locator('[aria-label="Departure date close"]');

        await this.browser.clickOnLocator(closeButton);

        await expect(closeButton, 'Departure date picker did not close').toBeHidden();
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
}
