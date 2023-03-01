/* eslint-disable @typescript-eslint/no-explicit-any */
import { StringSchema } from './string';
import {
    createError,
    InferErrorType,
    InferInputType,
    InferType,
    isObject,
    objectKeys,
    Schema,
    schema,
    validation,
} from './utils';

export const RecordValidation = <Item extends Schema<string, any, any, any>>(item: Item) =>
    validation({
        is: (input): input is Record<string, InferType<Item>> => isObject(input) && Object.values(input).every(item.is),
        err: (input, ctx) => {
            if (!isObject(input)) return createError({ code: 'E_RECORD' })(input, ctx);
            return createError({
                code: 'E_RECORD_PROPERTY',
                details: {
                    properties: objectKeys(input).reduce((accum, key) => {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        accum[key] = item.validate(input[key]);
                        return accum;
                    }, {} as Record<string, ReturnType<Item['validate']>>),
                },
            })(input, ctx);
        },
    });

export const RecordSchema = <Item extends Schema<string, any, any, any>>(item: Item) =>
    schema({
        uri: 'RecordSchema',
        displayString: `RecordSchema( ${item.displayString} )`,
        create: (input: Record<string, InferInputType<Item>>) => input as Record<string, InferType<Item>>,
        validation: RecordValidation(item),
    });

const TestSchema = RecordSchema(StringSchema);
type E = InferErrorType<typeof TestSchema>;
