/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    err,
    success,
    failure,
    getErrorDetails,
    Schema,
    identity,
    createSchema,
    Either,
} from './utils';

const errNoArray = (input: unknown) =>
    err(
        'array',
        'E_NO_ARRAY',
        'input is not of type: "array"',
        getErrorDetails('array', input),
    );

type ErrNoArray = ReturnType<typeof errNoArray>;

type ArrayErrors<WrappedSchema extends Schema<any, any, any, any>> = {
    error: ErrNoArray | null;
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
        uri: 'array',
        is: (input): input is WrappedSchema['O'][] =>
            Array.isArray(input) && input.every(wrappedSchema.is),
        create: identity,
        validate: (input, { is, create }) => {
            if (is(input)) {
                return success(create(input));
            }

            if (!Array.isArray(input)) {
                return failure({ error: errNoArray(input), items: [] });
            }

            return failure({
                error: null,
                items: input.map(wrappedSchema.validate),
            });
        },
    })();
