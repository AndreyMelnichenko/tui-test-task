import { Page } from '@playwright/test';
import { BASE_URL_UI } from '@config';
import { UiElements } from '@src/framework/UiElements';

import { MainFilterComponent } from './components/mainFilter';

export abstract class BasePage {
    protected readonly browser: UiElements;
    protected readonly mainFilterComponent: MainFilterComponent;

    constructor(protected page: Page = page) {
        this.browser = new UiElements(this.page);
        this.mainFilterComponent = new MainFilterComponent(this.page);
    }

    protected buildPageUrl(pagePrefix: string): string {
        return `${BASE_URL_UI()}/${pagePrefix}`;
    }

    abstract pageLoaded(pageParam?: string): Promise<this> | this;
    abstract navigate(slug?: string): Promise<this> | this;
    abstract pagePrefix: string;

    async reloadPage(): Promise<void> {
        await this.page.reload();
    }
}
