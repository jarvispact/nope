import { StringValidation } from './string';
import { createError, extendValidation } from './utils';

export const StringMinLength = <MinLength extends number>(minLength: MinLength) =>
    extendValidation(StringValidation)({
        is: (input): input is string => input.length >= minLength,
        err: createError({ code: `E_STRING_MIN_LENGTH_${minLength}`, details: { minLength } }),
    });

export const StringMaxLength = <MaxLength extends number>(maxLength: MaxLength) =>
    extendValidation(StringValidation)({
        is: (input): input is string => input.length <= maxLength,
        err: createError({ code: `E_STRING_MAX_LENGTH_${maxLength}`, details: { maxLength } }),
    });

export const StringMatches = (regex: RegExp) =>
    extendValidation(StringValidation)({
        is: (input): input is string => regex.test(input),
        err: createError({ code: 'E_STRING_MATCHES', details: { regex } }),
    });
