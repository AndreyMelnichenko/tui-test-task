import { Page } from '@playwright/test';
import { UiElements } from '@src/framework/UiElements';
import { getRandomInt } from '@src/helpers/randomHelper';

export class TravelersFilter {
    private browser: UiElements;

    constructor(private page: Page) {
        this.browser = new UiElements(this.page);
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
}
