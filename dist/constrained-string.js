import { string } from './string';
import { createError, getErrorDetails, extendSchema, success, failure, isNotNil, } from './utils';
const uri = 'constrained-string';
const minLengthErr = (input, minLength) => createError(uri, 'E_CONSTRAINED_STRING_MIN_LENGTH', `input does not satisfy constraint. minLength: "${minLength}"`, getErrorDetails(uri, input));
const maxLengthErr = (input, maxLength) => createError(uri, 'E_CONSTRAINED_STRING_MAX_LENGTH', `input does not satisfy constraint. maxLength: "${maxLength}"`, getErrorDetails(uri, input));
const includesErr = (input, includes) => createError(uri, 'E_CONSTRAINED_STRING_INCLUDES', `input does not satisfy constraint. includes: "${includes}"`, getErrorDetails(uri, input));
const matchesErr = (input, matches) => createError(uri, 'E_CONSTRAINED_STRING_MATCHES', `input does not satisfy constraint. regex match: "${matches.source}"`, getErrorDetails(uri, input));
export const constrainedString = ({ minLength, maxLength, includes, matches, } = {}) => extendSchema(string, {
    uri,
    is: (input) => {
        if (isNotNil(minLength) && input.length < minLength)
            return false;
        if (isNotNil(maxLength) && input.length > maxLength)
            return false;
        if (isNotNil(includes) && !input.includes(includes))
            return false;
        if (isNotNil(matches) && input.match(matches) === null)
            return false;
        return true;
    },
    create: (input) => input,
    validate: (input, { is, create }) => {
        if (is(input))
            return success(create(input));
        const errors = [];
        if (isNotNil(minLength) &&
            typeof input === 'string' &&
            input.length < minLength) {
            errors.push(minLengthErr(input, minLength));
        }
        if (isNotNil(maxLength) &&
            typeof input === 'string' &&
            input.length > maxLength) {
            errors.push(maxLengthErr(input, maxLength));
        }
        if (isNotNil(includes) &&
            typeof input === 'string' &&
            !input.includes(includes)) {
            errors.push(includesErr(input, includes));
        }
        if (isNotNil(matches) &&
            typeof input === 'string' &&
            input.match(matches) === null) {
            errors.push(matchesErr(input, matches));
        }
        return failure(errors);
    },
});
//# sourceMappingURL=constrained-string.js.map