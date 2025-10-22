export const escapeRegex = (str: string): string => {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export const createUrlRegex = (pagePrefix: string): RegExp => {
    return new RegExp(`.*${escapeRegex(pagePrefix)}.*`);
};
