import { string } from './string';
import { err, success, failure, extendSchema, getErrorDetails, } from './utils';
const errNoEmail = (input) => err('email', 'E_NO_EMAIL', 'input is not of type: "email"', getErrorDetails('email', input));
export const createEmail = (input) => input;
export const email = extendSchema(string(), {
    uri: 'email',
    is: (input) => /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(input),
    create: createEmail,
    validate: (input, { is, create }) => {
        if (is(input))
            return success(create(input));
        return failure([errNoEmail(input)]);
    },
});
//# sourceMappingURL=email.js.map