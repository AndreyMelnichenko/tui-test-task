import { e2eUserTest } from '@src/framework/fixtures';

e2eUserTest(
    'Book TUI tour',
    {
        tag: ['@TUI-001', '@smoke'],
    },
    async ({ userMainPage }) => {
        await e2eUserTest.step('Accept cookies on main page', async () => {
            await userMainPage.acceptCookies();
        });

        await e2eUserTest.step('Select a random available departure airport.', async () => {
            await userMainPage.selectRandomDepartureAirport();
        });
    },
);
