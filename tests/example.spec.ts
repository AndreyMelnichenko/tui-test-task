import { e2eUserTest } from '@src/framework/fixtures';

e2eUserTest(
    'has title',
    {
        tag: ['@TUI-001', '@smoke'],
    },
    async ({ userMainPage }) => {
        await userMainPage.pageLoaded();
    },
);
