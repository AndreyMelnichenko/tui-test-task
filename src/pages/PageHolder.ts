import { Page } from '@playwright/test';
import { UiElements } from '@src/framework/UiElements';

export abstract class PageHolder {
    protected page: Page;
    protected readonly browser: UiElements;

    constructor(page: Page) {
        this.page = page;
        this.browser = new UiElements(page);
    }
}
