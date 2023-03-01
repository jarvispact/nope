import { InferInputType, InferType, Schema } from './utils';
export declare const RecordValidation: <Item extends Schema<string, any, any, any>>(item: Item) => import("./utils").Validation<unknown, Record<string, InferType<Item>>, string, import("./utils").SchemaError<"E_RECORD", unknown> | import("./utils").SchemaError<"E_RECORD_PROPERTY", {
    properties: Record<string, ReturnType<Item["validate"]>>;
}>>;
export declare const RecordSchema: <Item extends Schema<string, any, any, any>>(item: Item) => Schema<"RecordSchema", Record<string, InferInputType<Item>>, Record<string, InferType<Item>>, import("./utils").SchemaError<"E_RECORD", unknown> | import("./utils").SchemaError<"E_RECORD_PROPERTY", {
    properties: Record<string, ReturnType<Item["validate"]>>;
}>>;
