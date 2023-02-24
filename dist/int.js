import { NumberValidation } from './number';
import { createError, extendValidation, schema } from './utils';
const tag = 'Int';
export const IntValidation = extendValidation(NumberValidation)({
    is: (input) => Number.isInteger(input),
    err: createError({ code: 'E_INT' }),
});
export const IntSchema = schema({
    uri: 'IntSchema',
    create: (input) => input,
    validation: IntValidation,
});
//# sourceMappingURL=int.js.map