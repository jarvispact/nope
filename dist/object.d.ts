import { InferInputType, InferType, Schema, SchemaError } from './utils';
type GenericShape = Record<string, Schema<string, any, any, SchemaError<string>>>;
export type ObjectValidationOptions = {
    failOnAdditionalProperties?: boolean;
};
export declare const ObjectValidation: <Shape extends GenericShape>(shape: Shape, options?: ObjectValidationOptions) => import("./utils").Validation<unknown, { [Key in keyof Shape]: InferType<Shape[Key]>; }, string, SchemaError<"E_OBJECT", unknown> | SchemaError<"E_OBJECT_MISSING_KEYS", unknown> | SchemaError<"E_OBJECT_ADDITIONAL_KEYS", unknown> | SchemaError<"E_OBJECT_PROPERTY", {
    properties: { [Key_1 in keyof Shape]: ReturnType<Shape[Key_1]["validate"]>; };
}>>;
export declare const ObjectSchema: <Shape extends GenericShape>(shape: Shape, options?: ObjectValidationOptions) => Schema<"ObjectSchema", { [Key in keyof Shape]: InferInputType<Shape[Key]>; }, { [Key_1 in keyof Shape]: InferType<Shape[Key_1]>; }, SchemaError<"E_OBJECT", unknown> | SchemaError<"E_OBJECT_MISSING_KEYS", unknown> | SchemaError<"E_OBJECT_ADDITIONAL_KEYS", unknown> | SchemaError<"E_OBJECT_PROPERTY", {
    properties: { [Key_2 in keyof Shape]: ReturnType<Shape[Key_2]["validate"]>; };
}>>;
export {};
