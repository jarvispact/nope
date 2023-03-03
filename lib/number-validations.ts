import { NumberValidation } from './number';
import { createError, extendValidation } from './utils';

export const NumberMin = <MinLength extends number>(minLength: MinLength) =>
    extendValidation(NumberValidation)({
        is: (input): input is number => input >= minLength,
        err: createError({ code: `E_NUMBER_MIN_LENGTH_${minLength}`, details: { minLength } }),
    });

export const NumberMax = <MaxLength extends number>(maxLength: MaxLength) =>
    extendValidation(NumberValidation)({
        is: (input): input is number => input <= maxLength,
        err: createError({ code: `E_NUMBER_MAX_LENGTH_${maxLength}`, details: { maxLength } }),
    });
