export const predicateNonNullable = <T>(value: T): value is NonNullable<T> => value != null;
