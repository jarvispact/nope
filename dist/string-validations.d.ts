export declare const StringMinLength: <MinLength extends number>(minLength: MinLength) => import("./utils").Validation<unknown, string, string, import("./utils").SchemaError<"E_STRING", unknown> | import("./utils").SchemaError<`E_STRING_MIN_LENGTH_${MinLength}`, {
    minLength: MinLength;
}>>;
export declare const StringMaxLength: <MaxLength extends number>(maxLength: MaxLength) => import("./utils").Validation<unknown, string, string, import("./utils").SchemaError<"E_STRING", unknown> | import("./utils").SchemaError<`E_STRING_MAX_LENGTH_${MaxLength}`, {
    maxLength: MaxLength;
}>>;
export declare const StringMatches: (regex: RegExp) => import("./utils").Validation<unknown, string, string, import("./utils").SchemaError<"E_STRING", unknown> | import("./utils").SchemaError<"E_STRING_MATCHES", {
    regex: RegExp;
}>>;
type Options = {
    caseSensitive: boolean;
};
export declare const StringStartsWith: (substring: string, options?: Partial<Options>) => import("./utils").Validation<unknown, string, string, import("./utils").SchemaError<"E_STRING", unknown> | import("./utils").SchemaError<"E_STRING_STARTS_WITH", {
    substring: string;
}>>;
export declare const StringEndsWith: (substring: string, options?: Partial<Options>) => import("./utils").Validation<unknown, string, string, import("./utils").SchemaError<"E_STRING", unknown> | import("./utils").SchemaError<"E_STRING_ENDS_WITH", {
    substring: string;
}>>;
export declare const StringIncludes: (substring: string, options?: Partial<Options>) => import("./utils").Validation<unknown, string, string, import("./utils").SchemaError<"E_STRING", unknown> | import("./utils").SchemaError<"E_STRING_INCLUDES", {
    substring: string;
}>>;
export {};
