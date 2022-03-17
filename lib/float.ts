import { number, NumberSchema } from './number';
import { createError, Opaque, getErrorDetails, extendSchema } from './utils';

const uri = 'float';

export type Float = Opaque<number, typeof uri>;

const err = (input: NumberSchema['I']) =>
    createError(
        uri,
        'E_NO_FLOAT',
        `input is not of type: "${uri}"`,
        getErrorDetails(uri, input),
    );

type Err = ReturnType<typeof err>;

export const float = extendSchema<NumberSchema, number, Float, Err, 'float'>(
    number,
    {
        uri,
        is: (input): input is Float => input % 1 !== 0,
        create: (input) => input as Float,
        err,
    },
);

export type FloatSchema = typeof float;
