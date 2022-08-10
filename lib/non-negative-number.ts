import { NumberSchema } from './number';
import { createError, Opaque, schema, SchemaError } from './utils';

const uri = 'NonNegativeNumber';
const errorCode = 'E_NON_NEGATIVE_NUMBER';

export type NonNegativeNumber = Opaque<number, typeof uri>;

export const NonNegativeNumberSchema = schema<
    typeof uri,
    number,
    NonNegativeNumber,
    SchemaError<typeof uri, typeof errorCode, number>
>({
    uri: uri,
    is: (input) => NumberSchema.is(input) && input >= 0,
    err: (input, { uri }) =>
        createError(
            uri,
            errorCode,
            `input: "${input}" is not of type: ${uri}`,
            input,
        ),
});

export type NonNegativeNumberSchema = typeof NonNegativeNumberSchema;
