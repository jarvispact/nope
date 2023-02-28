import { StringValidation } from './string';
import { Opaque, schema, extendValidation, createError } from './utils';

const tag = 'Uuid';
export type Uuid = Opaque<string, typeof tag>;

const uuidRegex =
    /^([a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[a-f0-9]{4}-[a-f0-9]{12}|00000000-0000-0000-0000-000000000000)$/i;

export const UuidValidation = extendValidation(StringValidation)({
    is: (input): input is Uuid => uuidRegex.test(input),
    err: createError({ code: 'E_UUID' }),
});

export const UuidSchema = schema({
    uri: 'UuidSchema',
    create: (input: string) => input as Uuid,
    validation: UuidValidation,
});
