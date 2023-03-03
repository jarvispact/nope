import { NumberValidation } from './number';
import { createError, extendValidation } from './utils';
export const NumberMin = (minLength) => extendValidation(NumberValidation)({
    is: (input) => input >= minLength,
    err: createError({ code: `E_NUMBER_MIN_LENGTH_${minLength}`, details: { minLength } }),
});
export const NumberMax = (maxLength) => extendValidation(NumberValidation)({
    is: (input) => input <= maxLength,
    err: createError({ code: `E_NUMBER_MAX_LENGTH_${maxLength}`, details: { maxLength } }),
});
//# sourceMappingURL=number-validations.js.map