import { createError, schema, validation } from './utils';

export const NumberValidation = validation({
    is: (input): input is number => typeof input === 'number' && !Number.isNaN(input),
    err: createError({ code: 'E_NUMBER' }),
});

export const NumberSchema = schema({
    uri: 'NumberSchema',
    create: (input) => Number(input),
    validation: NumberValidation,
});
