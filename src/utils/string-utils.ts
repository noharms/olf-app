


export function isBlank(text: string): boolean {
    return text.trim().length === 0;
}

export function getOrIfBlank(text: string, defaultIfBlank: string) {
    return isBlank(text) ? defaultIfBlank : text;
}