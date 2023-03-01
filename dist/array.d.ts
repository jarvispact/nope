import { InferInputType, InferType, Schema } from './utils';
export declare const ArrayValidation: <Item extends Schema<string, any, any, any>>(item: Item) => import("./utils").Validation<unknown, InferType<Item>[], string, import("./utils").SchemaError<"E_ARRAY", unknown> | import("./utils").SchemaError<"E_ARRAY_ITEM", {
    items: ReturnType<Item["validate"]>[];
}>>;
export declare const ArraySchema: <Item extends Schema<string, any, any, any>>(item: Item) => Schema<"ArraySchema", InferInputType<Item>[], InferType<Item>[], import("./utils").SchemaError<"E_ARRAY", unknown> | import("./utils").SchemaError<"E_ARRAY_ITEM", {
    items: ReturnType<Item["validate"]>[];
}>>;
