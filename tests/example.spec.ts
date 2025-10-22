import { e2eUserTest } from '@src/framework/fixtures';

e2eUserTest(
    'has title',
    {
        tag: ['@TUI-001'],
    },
    async ({ userMainPage }) => {
        await userMainPage.pageLoaded();
    },
);
