/* eslint-disable @typescript-eslint/no-explicit-any */
import { success, identity, createSchema } from './utils';
export const optional = (wrappedSchema) => createSchema({
    uri: 'array',
    is: (input) => input === undefined || wrappedSchema.is(input),
    create: identity,
    validate: (input, { is, create }) => {
        if (is(input)) {
            return success(create(input));
        }
        return wrappedSchema.validate(input);
    },
});
//# sourceMappingURL=optional.js.map