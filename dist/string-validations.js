import { StringValidation } from './string';
import { createError, extendValidation } from './utils';
export const StringMinLength = (minLength) => extendValidation(StringValidation)({
    is: (input) => input.length >= minLength,
    err: createError({ code: `E_STRING_MIN_LENGTH_${minLength}`, details: { minLength } }),
});
export const StringMaxLength = (maxLength) => extendValidation(StringValidation)({
    is: (input) => input.length <= maxLength,
    err: createError({ code: `E_STRING_MAX_LENGTH_${maxLength}`, details: { maxLength } }),
});
export const StringMatches = (regex) => extendValidation(StringValidation)({
    is: (input) => regex.test(input),
    err: createError({ code: 'E_STRING_MATCHES', details: { regex } }),
});
//# sourceMappingURL=string-validations.js.map