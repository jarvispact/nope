import { number } from './number';
import { createError, Opaque, schema, SchemaError } from './utils';

const uri = 'float';

export type Float = Opaque<number, typeof uri>;

export const float = schema<
    typeof uri,
    number,
    Float,
    SchemaError<typeof uri, 'E_FLOAT'>
>({
    uri,
    is: (input) => number.is(input),
    err: (input) =>
        createError(uri, 'E_FLOAT', `input: "${input}" is not of type: ${uri}`),
});

export type FloatSchema = typeof float;
