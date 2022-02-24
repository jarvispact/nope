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
    isObject,
    objectKeys,
} from './utils';

const errNoRecord = (input: unknown) =>
    err(
        'record',
        'E_NO_RECORD',
        'input is not of type: "record"',
        getErrorDetails('record', input),
    );

type ErrNoRecord = ReturnType<typeof errNoRecord>;

const errMissingProperties = (input: unknown) =>
    err(
        'record',
        'E_MISSING_RECORD_PROPERTIES',
        'input is missing record properties',
        getErrorDetails('record', input),
    );

type ErrMissingProperties = ReturnType<typeof errMissingProperties>;

type RecordErrors<
    Definition extends { [Key: string]: Schema<any, any, any, any> },
> = {
    error: ErrNoRecord | ErrMissingProperties | null;
    properties: {
        [K in keyof Definition]: Either<Definition[K]['O'], Definition[K]['E']>;
    };
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
            objectKeys(definition).every((k) => definition[k].is(input[k])),
        create: identity,
        validate: (input, { is, create }) => {
            if (is(input)) {
                return success(create(input));
            }

            if (!isObject(input)) {
                return failure({
                    error: errNoRecord(input),
                    properties: {} as RecordErrors<Definition>['properties'],
                });
            }

            return failure({
                error: null,
                properties: objectKeys(definition).reduce((accum, key) => {
                    accum[key] = definition[key].validate(input[key]);
                    return accum;
                }, {} as RecordErrors<Definition>['properties']),
            });
        },
    })();
