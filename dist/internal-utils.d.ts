export declare const err: <S extends string, C extends string, T>(schema: S, code: C, message: string, details: T) => {
    schema: S;
    code: C;
    message: string;
    details: T;
};
export declare const objectKeys: <T extends {
    [x: string]: unknown;
}>(rec: T) => (keyof T)[];
export declare const isObject: (v: unknown) => v is Record<string, unknown>;
export declare const getDisplayType: (value: unknown) => "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function" | "record" | "date" | "array" | "null";
export declare type SchemaType = 'optional' | 'nullable' | 'string' | 'number' | 'date' | 'boolean' | 'string-literal' | 'number-literal' | 'union' | 'record' | 'partial' | 'array';
