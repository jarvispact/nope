export declare const NumberMin: <MinLength extends number>(minLength: MinLength) => import("./utils").Validation<unknown, number, string, import("./utils").SchemaError<"E_NUMBER", unknown> | import("./utils").SchemaError<`E_NUMBER_MIN_LENGTH_${MinLength}`, {
    minLength: MinLength;
}>>;
export declare const NumberMax: <MaxLength extends number>(maxLength: MaxLength) => import("./utils").Validation<unknown, number, string, import("./utils").SchemaError<"E_NUMBER", unknown> | import("./utils").SchemaError<`E_NUMBER_MAX_LENGTH_${MaxLength}`, {
    maxLength: MaxLength;
}>>;
