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

type Options = {
    caseSensitive: boolean;
};

const defaultOptions: Options = {
    caseSensitive: false,
};

export const StringStartsWith = (substring: string, options: Partial<Options> = {}) => {
    const opts = { ...defaultOptions, ...options };
    return extendValidation(StringValidation)({
        is: (input): input is string =>
            opts.caseSensitive ? input.toLowerCase().startsWith(substring.toLowerCase()) : input.startsWith(substring),
        err: createError({ code: 'E_STRING_STARTS_WITH', details: { substring } }),
    });
};

export const StringEndsWith = (substring: string, options: Partial<Options> = {}) => {
    const opts = { ...defaultOptions, ...options };
    return extendValidation(StringValidation)({
        is: (input): input is string =>
            opts.caseSensitive ? input.toLowerCase().endsWith(substring.toLowerCase()) : input.endsWith(substring),
        err: createError({ code: 'E_STRING_ENDS_WITH', details: { substring } }),
    });
};

export const StringIncludes = (substring: string, options: Partial<Options> = {}) => {
    const opts = { ...defaultOptions, ...options };
    return extendValidation(StringValidation)({
        is: (input): input is string =>
            opts.caseSensitive ? input.toLowerCase().includes(substring.toLowerCase()) : input.includes(substring),
        err: createError({ code: 'E_STRING_INCLUDES', details: { substring } }),
    });
};
