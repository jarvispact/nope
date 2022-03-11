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
    isObject,
    objectKeys,
} from './utils';

const errNoRecord = (input: unknown) =>
    createError(
        'record',
        'E_NO_RECORD',
        'input is not of type: "record"',
        getErrorDetails('record', input),
    );

type ErrNoRecord = ReturnType<typeof errNoRecord>;

const errMissingProperties = (input: unknown, requiredProperties: string[]) =>
    createError(
        'record',
        'E_MISSING_RECORD_PROPERTIES',
        'input is missing record properties',
        { ...getErrorDetails('record', input), requiredProperties },
    );

type ErrMissingProperties = ReturnType<typeof errMissingProperties>;

const errUnexpectedProperties = (
    input: unknown,
    requiredProperties: string[],
) =>
    createError(
        'record',
        'E_UNEXPECTED_RECORD_PROPERTIES',
        'input has unexpected record properties',
        { ...getErrorDetails('record', input), requiredProperties },
    );

type ErrUnexpectedProperties = ReturnType<typeof errUnexpectedProperties>;

type RecordErrors<
    Definition extends { [Key: string]: Schema<any, any, any, any> },
> = {
    error: ErrNoRecord | ErrMissingProperties | ErrUnexpectedProperties | null;
    properties:
        | {
              [K in keyof Definition]: Either<
                  Definition[K]['O'],
                  Definition[K]['E']
              >;
          }
        | null;
};

type FromDefinition<
    Definition extends { [Key: string]: Schema<any, any, any, any> },
    T extends 'I' | 'O' | 'E',
> = {
    [K in keyof Definition]: Definition[K][T];
};

export const record = <
    Definition extends { [Key: string]: Schema<any, any, any, any> },
>(
    definition: Definition,
) =>
    createSchema<
        FromDefinition<Definition, 'I'>,
        FromDefinition<Definition, 'O'>,
        RecordErrors<Definition>,
        'record'
    >({
        uri: 'record',
        is: (input): input is FromDefinition<Definition, 'O'> =>
            isObject(input) &&
            objectKeys(input).length === objectKeys(definition).length &&
            objectKeys(definition).every((k) => definition[k].is(input[k])),
        create: identity,
        validate: (input, { is, create }) => {
            if (is(input)) {
                return success(create(input));
            }

            if (!isObject(input)) {
                return failure({
                    error: errNoRecord(input),
                    properties: null,
                });
            }

            if (objectKeys(input).length < objectKeys(definition).length) {
                return failure({
                    error: errMissingProperties(input, Object.keys(definition)),
                    properties: null,
                });
            }

            if (objectKeys(input).length > objectKeys(definition).length) {
                return failure({
                    error: errUnexpectedProperties(
                        input,
                        Object.keys(definition),
                    ),
                    properties: null,
                });
            }

            return failure({
                error: null,
                properties: objectKeys(definition).reduce(
                    (accum, key) => {
                        accum[key] = definition[key].validate(input[key]);
                        return accum;
                    },
                    {} as {
                        [K in keyof Definition]: Either<
                            Definition[K]['O'],
                            Definition[K]['E']
                        >;
                    },
                ),
            });
        },
    });
