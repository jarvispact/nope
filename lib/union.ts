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

const err = (input: unknown, humanReadableType: string) =>
    createError(
        uri,
        'E_NO_UNION',
        `input is not of type: "${humanReadableType}"`,
        getErrorDetails(uri, input),
    );

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
        uri,
        is: (input): input is WrappedSchemaList[number]['O'] =>
            wrappedSchemaList.some((s) => s.is(input)),
        create: identity,
        validate: (input, { is, create, serialize }) => {
            if (is(input)) {
                return success(create(input));
            }

            return failure(err(input, serialize()));
        },
        serialize: () =>
            `union([${wrappedSchemaList
                .map((s) => s.serialize())
                .join(', ')}])`,
    });
