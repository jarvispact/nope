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
const defaultOptions = {
    caseSensitive: false,
};
export const StringStartsWith = (substring, options = {}) => {
    const opts = { ...defaultOptions, ...options };
    return extendValidation(StringValidation)({
        is: (input) => opts.caseSensitive ? input.toLowerCase().startsWith(substring.toLowerCase()) : input.startsWith(substring),
        err: createError({ code: 'E_STRING_STARTS_WITH', details: { substring } }),
    });
};
export const StringEndsWith = (substring, options = {}) => {
    const opts = { ...defaultOptions, ...options };
    return extendValidation(StringValidation)({
        is: (input) => opts.caseSensitive ? input.toLowerCase().endsWith(substring.toLowerCase()) : input.endsWith(substring),
        err: createError({ code: 'E_STRING_ENDS_WITH', details: { substring } }),
    });
};
export const StringIncludes = (substring, options = {}) => {
    const opts = { ...defaultOptions, ...options };
    return extendValidation(StringValidation)({
        is: (input) => opts.caseSensitive ? input.toLowerCase().includes(substring.toLowerCase()) : input.includes(substring),
        err: createError({ code: 'E_STRING_INCLUDES', details: { substring } }),
    });
};
//# sourceMappingURL=string-validations.js.map