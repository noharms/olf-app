


export function decrementOrWrapAround(index: number, size: number): number {
    return (index - 1 + size) % size;
}

export function incrementOrWrapAround(index: number, size: number): number {
    return (index + 1) % size;
}

export function isXAfterYPeriodic(x: number, y: number, size: number) {
    if (x < 0 || y < 0) {
        throw new Error('Negative player index not allowed.')
    } else if (x >= size || y >= size) {
        throw new Error(`Index larger than ${size} not allowed.`);
    } else {
        return incrementOrWrapAround(y, size) === x;
    }
}

