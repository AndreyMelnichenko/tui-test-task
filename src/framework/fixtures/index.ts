import test, { chromium } from '@playwright/test';
import { MainPage } from '@page';

const browserArgs: Array<string> = [];

export const e2eUserTest = test.extend<{
    userMainPage: MainPage;
}>({
    // eslint-disable-next-line no-empty-pattern -- PW requirement due to https://github.com/microsoft/playwright/blob/289127d523d7f49ca460f73fa65283f14d06b4de/packages/playwright/src/common/fixtures.ts#L244
    userMainPage: async ({}, use) => {
        const browser = await chromium.launch({
            args: [...browserArgs, '--start-maximized'],
        });
        const context = await browser.newContext();
        const page = await context.newPage();
        const mainPage = new MainPage(page);

        await mainPage.navigate();

        await use(mainPage);
        await browser.close();
    },
});
