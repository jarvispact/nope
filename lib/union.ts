/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    createError,
    success,
    failure,
    getErrorDetails,
    Schema,
    identity,
    createSchema,
} from './utils';

const uri = 'union';

const err = <WrappedSchemaList extends Schema<any, any, any, any>[]>(
    input: unknown,
    wrappedSchemaList: WrappedSchemaList,
) => {
    const humanReadableType = `union([${wrappedSchemaList
        .map((s) => s.serialize())
        .join(', ')}])`;

    return createError(
        uri,
        'E_NO_UNION',
        `input is not of type: "${humanReadableType}"`,
        getErrorDetails(uri, input),
    );
};

type Err = ReturnType<typeof err>;

export const union = <WrappedSchemaList extends Schema<any, any, any, any>[]>(
    wrappedSchemaList: WrappedSchemaList,
) =>
    createSchema<
        WrappedSchemaList[number]['I'],
        WrappedSchemaList[number]['O'],
        Err,
        'union'
    >({
        uri: uri,
        is: (input): input is WrappedSchemaList[number]['O'] =>
            wrappedSchemaList.some((s) => s.is(input)),
        create: identity,
        validate: (input, { is, create }) => {
            if (is(input)) {
                return success(create(input));
            }

            return failure(err(input, wrappedSchemaList));
        },
    });
