import { string, StringSchema } from './string';
import { createError, Opaque, getErrorDetails, extendSchema } from './utils';

const uri = 'uuid';

export type Uuid = Opaque<string, 'Uuid'>;

const err = (input: StringSchema['I']) =>
    createError(
        uri,
        'E_NO_UUID',
        `input is not of type: "${uri}"`,
        getErrorDetails(uri, input),
    );

type Err = ReturnType<typeof err>;

export const uuid = extendSchema<StringSchema, string, Uuid, Err, 'uuid'>(
    string,
    {
        uri,
        is: (input): input is Uuid =>
            /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
                input,
            ),
        create: (input) => input as Uuid,
        err,
    },
);

export type UuidSchema = typeof uuid;
