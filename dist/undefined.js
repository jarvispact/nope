import { schema, createError, validation } from './utils';
export const UndefinedValidation = validation({
    is: (input) => input === undefined,
    err: createError({ code: 'E_UNDEFINED' }),
});
export const UndefinedSchema = schema({
    uri: 'UndefinedSchema',
    create: (input) => input,
    validation: UndefinedValidation,
});
//# sourceMappingURL=undefined.js.map