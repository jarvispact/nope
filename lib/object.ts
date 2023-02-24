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

type InputShape<Shape extends GenericShape> = {
    [Key in keyof Shape]: InferInputType<Shape[Key]>;
};

type OutputShape<Shape extends GenericShape> = {
    [Key in keyof Shape]: InferType<Shape[Key]>;
};

const shapeToDisplayString = (shape: GenericShape) => {
    const maxDisplayProperties = 3;
    const shapeKeys = Object.keys(shape);

    const additionalFieldsCount = Math.max(0, shapeKeys.length - maxDisplayProperties);

    const fields = shapeKeys
        .map((key) => `${key}: ${shape[key].uri}`)
        .slice(0, maxDisplayProperties)
        .join(', ');

    return shapeKeys.length > 0
        ? `ObjectSchema({ ${fields}${additionalFieldsCount > 0 ? `, + ${additionalFieldsCount} more` : ''} })`
        : 'ObjectSchema({})';
};

const hasAllKeys = (shape: GenericShape, input: InputShape<GenericShape>) => {
    const inputKeys = Object.keys(input);
    return Object.keys(shape).every((key) => inputKeys.includes(key));
};

export const ObjectValidation = <Shape extends GenericShape>(shape: Shape) =>
    validation({
        is: (input): input is OutputShape<Shape> => {
            if (!isObject(input)) return false;
            if (!hasAllKeys(shape, input)) return false;
            return Object.keys(shape).every((key) => shape[key].is(input[key]));
        },
        err: (input, ctx) => {
            if (!isObject(input)) {
                return createError({
                    code: 'E_OBJECT_SHAPE',
                })(input, ctx);
            }

            if (!hasAllKeys(shape, input)) {
                return createError({ code: 'E_OBJECT_MISSING_KEYS' })(input, ctx);
            }

            return createError({
                code: 'E_OBJECT_PROPERTIES',
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

export const ObjectSchema = <Shape extends GenericShape>(shape: Shape) =>
    schema({
        uri: 'ObjectSchema',
        displayString: shapeToDisplayString(shape),
        create: (input: InputShape<Shape>) => input as OutputShape<Shape>,
        validation: ObjectValidation(shape),
    });
