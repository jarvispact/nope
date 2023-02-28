import { schema, createError, validation } from './utils';

export const StringValidation = validation({
    is: (input): input is string => typeof input === 'string',
    err: createError({ code: 'E_STRING' }),
});

export const StringSchema = schema({
    uri: 'StringSchema',
    create: (input: string) => String(input),
    validation: StringValidation,
});
