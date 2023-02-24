import { schema, createError, validation } from './utils';
export const StringValidation = validation({
    is: (input) => typeof input === 'string',
    err: createError({ code: 'E_STRING' }),
});
export const StringSchema = schema({
    uri: 'StringSchema',
    create: (input) => String(input),
    validation: StringValidation,
});
//# sourceMappingURL=string.js.map