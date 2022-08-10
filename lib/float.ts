import { NumberSchema } from './number';
import { createError, Opaque, schema, SchemaError } from './utils';

const uri = 'FloatSchema';
const errorCode = 'E_FLOAT_SCHEMA';

export type Float = Opaque<number, typeof uri>;

export const FloatSchema = schema<
    typeof uri,
    number,
    Float,
    SchemaError<typeof uri, typeof errorCode, number>
>({
    uri,
    is: (input) => NumberSchema.is(input),
    err: (input) =>
        createError(
            uri,
            errorCode,
            `input: "${input}" is not of type: ${uri}`,
            input,
        ),
});

export type FloatSchema = typeof FloatSchema;
