import { number } from './number';
import { createError, Opaque, schema, SchemaError } from './utils';

const uri = 'integer';

export type Integer = Opaque<number, typeof uri>;

export const integer = schema<
    typeof uri,
    number,
    Integer,
    SchemaError<typeof uri, 'E_INTEGER', number>
>({
    uri,
    is: (input) => number.is(input) && Number.isInteger(input),
    err: (input) =>
        createError(
            uri,
            'E_INTEGER',
            `input: "${input}" is not of type: ${uri}`,
            input,
        ),
});

export type IntegerSchema = typeof integer;
