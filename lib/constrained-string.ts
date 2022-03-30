import { string, StringSchema } from './string';
import {
    createError,
    Opaque,
    getErrorDetails,
    extendSchema,
    success,
    failure,
    isNotNil,
} from './utils';

const uri = 'constrained-string';

export type ConstrainedString = Opaque<string, typeof uri>;

const minLengthErr = (input: StringSchema['I'], minLength: number) =>
    createError(
        uri,
        'E_CONSTRAINED_STRING_MIN_LENGTH',
        `input does not satisfy constraint. minLength: "${minLength}"`,
        getErrorDetails(uri, input),
    );

const maxLengthErr = (input: StringSchema['I'], maxLength: number) =>
    createError(
        uri,
        'E_CONSTRAINED_STRING_MAX_LENGTH',
        `input does not satisfy constraint. maxLength: "${maxLength}"`,
        getErrorDetails(uri, input),
    );

const includesErr = (input: StringSchema['I'], includes: string) =>
    createError(
        uri,
        'E_CONSTRAINED_STRING_INCLUDES',
        `input does not satisfy constraint. includes: "${includes}"`,
        getErrorDetails(uri, input),
    );

const matchesErr = (input: StringSchema['I'], matches: RegExp) =>
    createError(
        uri,
        'E_CONSTRAINED_STRING_MATCHES',
        `input does not satisfy constraint. regex match: "${matches.source}"`,
        getErrorDetails(uri, input),
    );

type MinLengthError = ReturnType<typeof minLengthErr>;
type MaxLengthError = ReturnType<typeof maxLengthErr>;
type IncludesError = ReturnType<typeof includesErr>;
type MatchesError = ReturnType<typeof matchesErr>;

type Err = MinLengthError | MaxLengthError | IncludesError | MatchesError;

type Options = {
    minLength?: number;
    maxLength?: number;
    includes?: string;
    matches?: RegExp;
};

export const constrainedString = ({
    minLength,
    maxLength,
    includes,
    matches,
}: Options = {}) =>
    extendSchema<
        StringSchema,
        string,
        ConstrainedString,
        Err[],
        'constrained-string'
    >(string, {
        uri,
        is: (input): input is ConstrainedString => {
            if (isNotNil(minLength) && input.length < minLength) return false;
            if (isNotNil(maxLength) && input.length > maxLength) return false;
            if (isNotNil(includes) && !input.includes(includes)) return false;
            if (isNotNil(matches) && input.match(matches) === null)
                return false;
            return true;
        },
        create: (input) => input as ConstrainedString,
        validate: (input, { is, create }) => {
            if (is(input)) return success(create(input));

            const errors: Err[] = [];

            if (
                isNotNil(minLength) &&
                typeof input === 'string' &&
                input.length < minLength
            ) {
                errors.push(minLengthErr(input, minLength));
            }

            if (
                isNotNil(maxLength) &&
                typeof input === 'string' &&
                input.length > maxLength
            ) {
                errors.push(maxLengthErr(input, maxLength));
            }

            if (
                isNotNil(includes) &&
                typeof input === 'string' &&
                !input.includes(includes)
            ) {
                errors.push(includesErr(input, includes));
            }

            if (
                isNotNil(matches) &&
                typeof input === 'string' &&
                input.match(matches) === null
            ) {
                errors.push(matchesErr(input, matches));
            }

            return failure(errors);
        },
    });

export type ConstrainedStringSchema = typeof constrainedString;
