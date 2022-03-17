/* eslint-disable @typescript-eslint/no-explicit-any */
import { success, Schema, identity, createSchema } from './utils';

export const optional = <WrappedSchema extends Schema<any, any, any, any>>(
    wrappedSchema: WrappedSchema,
) =>
    createSchema<
        WrappedSchema['I'] | undefined,
        WrappedSchema['O'] | undefined,
        WrappedSchema['E'],
        'optional'
    >({
        uri: 'optional',
        is: (input): input is WrappedSchema['O'] | undefined =>
            input === undefined || wrappedSchema.is(input),
        create: identity,
        validate: (input, { is, create }) => {
            if (is(input)) {
                return success(create(input));
            }

            return wrappedSchema.validate(input);
        },
    });
