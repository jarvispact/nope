import { InferInputType, InferType, Schema } from './utils';
type UnionInputType<List extends Schema<string, any, any, any>[]> = InferInputType<List[number]>;
export declare const UnionValidation: <List extends Schema<string, any, any, any>[]>(list: List) => import("./utils").Validation<unknown, InferType<List[number]>, string, import("./utils").SchemaError<"E_UNION", unknown>>;
export declare const UnionSchema: <List extends Schema<string, any, any, any>[]>(list: List) => Schema<"UnionSchema", UnionInputType<List>, InferType<List[number]>, import("./utils").SchemaError<"E_UNION", unknown>>;
export {};
