export const predicateNonNullable = <T>(value: T): value is NonNullable<T> => value != null;

export const min = <T>(array: T[], predicate: (data: T) => number) => {
    if (array.length < 1)
        return undefined;

    return [...array].sort((a, b) => predicate(a) - predicate(b))[0];
};

export const max = <T>(array: T[], predicate: (data: T) => number) => {
    if (array.length < 1)
        return undefined;

    return [...array].sort((a, b) => predicate(b) - predicate(a))[0];
};
