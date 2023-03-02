export declare const StringMinLength: <MinLength extends number>(minLength: MinLength) => import("./utils").Validation<unknown, string, string, import("./utils").SchemaError<"E_STRING", unknown> | import("./utils").SchemaError<`E_STRING_MIN_LENGTH_${MinLength}`, {
    minLength: MinLength;
}>>;
export declare const StringMaxLength: <MaxLength extends number>(maxLength: MaxLength) => import("./utils").Validation<unknown, string, string, import("./utils").SchemaError<"E_STRING", unknown> | import("./utils").SchemaError<`E_STRING_MAX_LENGTH_${MaxLength}`, {
    maxLength: MaxLength;
}>>;
export declare const StringMatches: (regex: RegExp) => import("./utils").Validation<unknown, string, string, import("./utils").SchemaError<"E_STRING", unknown> | import("./utils").SchemaError<"E_STRING_MATCHES", {
    regex: RegExp;
}>>;
