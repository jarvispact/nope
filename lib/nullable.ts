/* eslint-disable @typescript-eslint/no-explicit-any */
import { success, Schema, identity, createSchema } from './utils';

export const nullable = <WrappedSchema extends Schema<any, any, any, any>>(
    wrappedSchema: WrappedSchema,
) =>
    createSchema<
        WrappedSchema['I'] | null,
        WrappedSchema['O'] | null,
        WrappedSchema['E'],
        'nullable'
    >({
        uri: 'nullable',
        is: (input): input is WrappedSchema['O'] | null =>
            input === null || wrappedSchema.is(input),
        create: identity,
        validate: (input, { is, create }) => {
            if (is(input)) {
                return success(create(input));
            }

            return wrappedSchema.validate(input);
        },
    });
