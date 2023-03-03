import { InferInputType, InferType, Schema } from './utils';
export declare const UnionValidation: <List extends Schema<string, any, any, any>[]>(list: List) => import("./utils").Validation<unknown, InferType<List[number]>, string, import("./utils").SchemaError<"E_UNION", unknown>>;
export declare const UnionSchema: <List extends Schema<string, any, any, any>[]>(list: List) => Schema<"UnionSchema", InferInputType<List[number]>, InferType<List[number]>, import("./utils").SchemaError<"E_UNION", unknown>>;
