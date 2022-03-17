/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    createError,
    success,
    failure,
    getErrorDetails,
    Schema,
    identity,
    createSchema,
    Either,
} from './utils';

const uri = 'array';

const err = (input: unknown) =>
    createError(
        uri,
        'E_NO_ARRAY',
        `input is not of type: "${uri}"`,
        getErrorDetails(uri, input),
    );

type Err = ReturnType<typeof err>;

type ArrayErrors<WrappedSchema extends Schema<any, any, any, any>> = {
    error: Err | null;
    items: Either<WrappedSchema['O'], WrappedSchema['E']>[];
};

export const array = <WrappedSchema extends Schema<any, any, any, any>>(
    wrappedSchema: WrappedSchema,
) =>
    createSchema<
        WrappedSchema['I'][],
        WrappedSchema['O'][],
        ArrayErrors<WrappedSchema>,
        'array'
    >({
        uri,
        is: (input): input is WrappedSchema['O'][] =>
            Array.isArray(input) && input.every(wrappedSchema.is),
        create: identity,
        validate: (input, { is, create }) => {
            if (is(input)) {
                return success(create(input));
            }

            if (!Array.isArray(input)) {
                return failure({ error: err(input), items: [] });
            }

            return failure({
                error: null,
                items: input.map(wrappedSchema.validate),
            });
        },
    });
