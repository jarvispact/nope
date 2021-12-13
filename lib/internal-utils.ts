export const err = <S extends string, C extends string, T>(
    schema: S,
    code: C,
    message: string,
    details: T,
) => ({
    schema,
    code,
    message,
    details,
});

export const objectKeys = <T extends { [x: string]: unknown }>(rec: T) =>
    Object.keys(rec) as Array<keyof T>;

export const isObject = (v: unknown): v is Record<string, unknown> =>
    typeof v === 'object' && !Array.isArray(v) && v !== null;

export const getDisplayType = (value: unknown) => {
    if (value === null) return 'null';
    if (value instanceof Date) return 'date';
    if (isObject(value)) return 'record';
    if (Array.isArray(value)) return 'array';
    return typeof value;
};

export type SchemaType =
    | 'optional'
    | 'nullable'
    | 'string'
    | 'number'
    | 'date'
    | 'boolean'
    | 'string-literal'
    | 'number-literal'
    | 'union'
    | 'record'
    | 'partial'
    | 'array';
