import { InferInputType, InferType, Schema, SchemaError } from './utils';
type GenericShape = Record<string, Schema<string, any, any, SchemaError<string>>>;
type InputShape<Shape extends GenericShape> = {
    [Key in keyof Shape]: InferInputType<Shape[Key]>;
};
type OutputShape<Shape extends GenericShape> = {
    [Key in keyof Shape]: InferType<Shape[Key]>;
};
export declare const ObjectValidation: <Shape extends GenericShape>(shape: Shape) => import("./utils").Validation<unknown, OutputShape<Shape>, string, SchemaError<"E_OBJECT_SHAPE", unknown> | SchemaError<"E_OBJECT_MISSING_KEYS", unknown> | SchemaError<"E_OBJECT_PROPERTIES", {
    properties: { [Key in keyof Shape]: ReturnType<Shape[Key]["validate"]>; };
}>>;
export declare const ObjectSchema: <Shape extends GenericShape>(shape: Shape) => Schema<"ObjectSchema", InputShape<Shape>, OutputShape<Shape>, SchemaError<"E_OBJECT_SHAPE", unknown> | SchemaError<"E_OBJECT_MISSING_KEYS", unknown> | SchemaError<"E_OBJECT_PROPERTIES", {
    properties: { [Key in keyof Shape]: ReturnType<Shape[Key]["validate"]>; };
}>>;
export {};
