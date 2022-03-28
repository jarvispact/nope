/* eslint-disable @typescript-eslint/no-explicit-any */
import { success, identity, createSchema } from './utils';
export const nullable = (wrappedSchema) => createSchema({
    uri: 'nullable',
    is: (input) => input === null || wrappedSchema.is(input),
    create: identity,
    validate: (input, { is, create }) => {
        if (is(input))
            return success(create(input));
        return wrappedSchema.validate(input);
    },
});
//# sourceMappingURL=nullable.js.map