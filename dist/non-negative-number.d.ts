import { Opaque, SchemaError } from './utils';
declare const uri = "NonNegativeNumber";
export declare type NonNegativeNumber = Opaque<number, typeof uri>;
export declare const NonNegativeNumberSchema: import("./utils").Schema<"NonNegativeNumber", number, NonNegativeNumber, SchemaError<"NonNegativeNumber", "E_NON_NEGATIVE_NUMBER", number>>;
export declare type NonNegativeNumberSchema = typeof NonNegativeNumberSchema;
export {};
