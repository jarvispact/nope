import { NumberValidation } from './number';
import { createError, extendValidation, schema } from './utils';
const tag = 'UInt';
export const UIntValidation = extendValidation(NumberValidation)({
    is: (input) => input >= 0,
    err: createError({ code: 'E_UINT' }),
});
export const UIntSchema = schema({
    uri: 'UIntSchema',
    create: (input) => input,
    validation: UIntValidation,
});
//# sourceMappingURL=uint.js.map