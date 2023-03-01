import { InferInputType, InferType, Schema } from './utils';
type TupleInput<Tuple extends [...Schema<string, any, any, any>[]]> = {
    [Index in keyof Tuple]: InferInputType<Tuple[Index]>;
};
type TupleOutput<Tuple extends [...Schema<string, any, any, any>[]]> = {
    [Index in keyof Tuple]: InferType<Tuple[Index]>;
};
type TupleEither<Tuple extends [...Schema<string, any, any, any>[]]> = {
    [Index in keyof Tuple]: ReturnType<Tuple[Index]['validate']>;
};
export declare const TupleValidation: <Items extends Schema<string, any, any, any>[]>(items: Items) => import("./utils").Validation<unknown, TupleOutput<Items>, string, import("./utils").SchemaError<"E_TUPLE", unknown> | import("./utils").SchemaError<"E_TUPLE_ITEM", {
    items: TupleEither<Items>;
}>>;
export declare const TupleSchema: <Items extends Schema<string, any, any, any>[]>(...items: Items) => Schema<"TupleSchema", TupleInput<Items>, TupleOutput<Items>, import("./utils").SchemaError<"E_TUPLE", unknown> | import("./utils").SchemaError<"E_TUPLE_ITEM", {
    items: TupleEither<Items>;
}>>;
export {};
