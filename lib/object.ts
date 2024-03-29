/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    InferInputType,
    InferType,
    isObject,
    Schema,
    schema,
    SchemaError,
    objectKeys,
    validation,
    createError,
} from './utils';

type GenericShape = Record<string, Schema<string, any, any, SchemaError<string>>>;

const shapeToDisplayString = (shape: GenericShape) => {
    const maxDisplayProperties = 3;
    const shapeKeys = Object.keys(shape);

    const additionalFieldsCount = Math.max(0, shapeKeys.length - maxDisplayProperties);

    const fields = shapeKeys
        .map((key) => `${key}: ${shape[key].displayString}`)
        .slice(0, maxDisplayProperties)
        .join(', ');

    return shapeKeys.length > 0
        ? `ObjectSchema({ ${fields}${additionalFieldsCount > 0 ? `, + ${additionalFieldsCount} more` : ''} })`
        : 'ObjectSchema({})';
};

const hasAllKeysFromShape = (
    shape: GenericShape,
    input: {
        [Key in keyof GenericShape]: InferInputType<GenericShape[Key]>;
    },
) => {
    const inputKeys = Object.keys(input);
    return Object.keys(shape).every((key) => inputKeys.includes(key));
};

const hasAdditionalProperties = (
    shape: GenericShape,
    input: {
        [Key in keyof GenericShape]: InferInputType<GenericShape[Key]>;
    },
) => {
    return Object.keys(shape) < Object.keys(input);
};

export type ObjectValidationOptions = {
    failOnAdditionalProperties?: boolean;
};

const defaultOptions: ObjectValidationOptions = {
    failOnAdditionalProperties: true,
};

export const ObjectValidation = <Shape extends GenericShape>(shape: Shape, options?: ObjectValidationOptions) => {
    const opts = { ...defaultOptions, ...options };

    return validation({
        is: (
            input,
        ): input is {
            [Key in keyof Shape]: InferType<Shape[Key]>;
        } => {
            if (!isObject(input)) return false;
            if (!hasAllKeysFromShape(shape, input)) return false;
            if (opts.failOnAdditionalProperties && hasAdditionalProperties(shape, input)) {
                return false;
            }
            return Object.keys(shape).every((key) => shape[key].is(input[key]));
        },
        err: (input, ctx) => {
            if (!isObject(input)) {
                return createError({
                    code: 'E_OBJECT',
                })(input, ctx);
            }

            if (!hasAllKeysFromShape(shape, input)) {
                return createError({
                    code: 'E_OBJECT_MISSING_KEYS',
                    details: { shapeKeys: Object.keys(shape), inputKeys: Object.keys(input) },
                })(input, ctx);
            }

            if (opts.failOnAdditionalProperties && hasAdditionalProperties(shape, input)) {
                return createError({
                    code: 'E_OBJECT_ADDITIONAL_KEYS',
                    details: { shapeKeys: Object.keys(shape), inputKeys: Object.keys(input) },
                })(input, ctx);
            }

            return createError({
                code: 'E_OBJECT_PROPERTY',
                details: {
                    properties: objectKeys(shape).reduce((accum, key) => {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        accum[key] = shape[key].validate(input[key]);
                        return accum;
                    }, {} as { [Key in keyof Shape]: ReturnType<Shape[Key]['validate']> }),
                },
            })(input, ctx);
        },
    });
};

export const ObjectSchema = <Shape extends GenericShape>(shape: Shape, options?: ObjectValidationOptions) =>
    schema({
        uri: 'ObjectSchema',
        displayString: shapeToDisplayString(shape),
        create: (input: {
            [Key in keyof Shape]: InferInputType<Shape[Key]>;
        }) =>
            input as {
                [Key in keyof Shape]: InferType<Shape[Key]>;
            },
        validation: ObjectValidation(shape, options),
    });
