export const BASE_URL_UI = () => {
    return process.env['BASE_URL_UI'] ?? 'https://www.tui.nl';
};

export const isCI = () => {
    return process.env['CI'] === 'true' && process.env['GITHUB_ACTIONS'] === 'true';
};
