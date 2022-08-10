import { NumberSchema } from './number';
import { createError, Opaque, schema, SchemaError } from './utils';

const uri = 'IntegerSchema';
const errorCode = 'E_INTEGER_SCHEMA';

export type Integer = Opaque<number, typeof uri>;

export const IntegerSchema = schema<
    typeof uri,
    number,
    Integer,
    SchemaError<typeof uri, typeof errorCode, number>
>({
    uri,
    is: (input) => NumberSchema.is(input) && Number.isInteger(input),
    err: (input) =>
        createError(
            uri,
            errorCode,
            `input: "${input}" is not of type: ${uri}`,
            input,
        ),
});

export type IntegerSchema = typeof IntegerSchema;
