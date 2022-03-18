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

const uri = 'record';

const errNoRecord = (input: unknown, humanReadableType: string) =>
    createError(
        uri,
        'E_NO_RECORD',
        `input is not of type: "${humanReadableType}"`,
        getErrorDetails(uri, input),
    );

type ErrNoRecord = ReturnType<typeof errNoRecord>;

const errMissingProperties = (input: unknown, requiredProperties: string[]) =>
    createError(
        uri,
        'E_RECORD_MISSING_PROPERTIES',
        'input is missing record properties',
        { ...getErrorDetails(uri, input), requiredProperties },
    );

type ErrMissingProperties = ReturnType<typeof errMissingProperties>;

const errUnexpectedProperties = (
    input: unknown,
    requiredProperties: string[],
) =>
    createError(
        uri,
        'E_RECORD_UNEXPECTED_PROPERTIES',
        'input has unexpected record properties',
        { ...getErrorDetails(uri, input), requiredProperties },
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

type RequiredPart<
    Definition extends { [Key: string]: Schema<any, any, any, any> },
    T extends 'I' | 'O' | 'E',
    OptionalKeys extends keyof Definition,
> = {
    [K in OptionalKeys]: Definition[K][T];
};

type OptionalPart<
    Definition extends { [Key: string]: Schema<any, any, any, any> },
    T extends 'I' | 'O' | 'E',
    OptionalKeys extends keyof Definition,
> = {
    [K in OptionalKeys]?: Definition[K][T];
};

type FromDefinition<
    Definition extends { [Key: string]: Schema<any, any, any, any> },
    T extends 'I' | 'O' | 'E',
    RequiredKey extends keyof Definition,
    OptionalKey extends keyof Definition = keyof Definition,
> = RequiredPart<Definition, T, RequiredKey> &
    OptionalPart<Definition, T, OptionalKey>;

export const record = <
    Definition extends { [Key: string]: Schema<any, any, any, any> },
    RequiredKey extends keyof Definition,
>(
    definition: Definition,
    options: {
        requiredProperties?: RequiredKey[];
    } = {},
) =>
    createSchema<
        FromDefinition<Definition, 'I', RequiredKey>,
        FromDefinition<Definition, 'O', RequiredKey>,
        RecordErrors<Definition>,
        'record'
    >({
        uri: uri,
        is: (input): input is FromDefinition<Definition, 'O', RequiredKey> => {
            if (!isObject(input)) return false;

            const definitionKeys = objectKeys(definition);
            const definitionKeysLength = definitionKeys.length;
            const inputKeys = objectKeys(input);
            const inputKeysLength = inputKeys.length;

            const requiredKeys =
                options.requiredProperties || objectKeys(definition);

            if (
                options.requiredProperties &&
                options.requiredProperties.length !== definitionKeysLength
            ) {
                const inputSatisfiesRequiredProperties =
                    inputKeysLength >= options.requiredProperties.length &&
                    inputKeysLength <= definitionKeysLength;

                return (
                    inputSatisfiesRequiredProperties &&
                    requiredKeys.every((k) => definition[k].is(input[k]))
                );
            }

            const inputSatisfiesRequiredProperties =
                inputKeysLength === definitionKeysLength;

            return (
                inputSatisfiesRequiredProperties &&
                requiredKeys.every((k) => definition[k].is(input[k]))
            );
        },
        create: identity,
        validate: (input, { is, create, serialize }) => {
            if (is(input)) {
                return success(create(input));
            }

            if (!isObject(input)) {
                return failure({
                    error: errNoRecord(input, serialize()),
                    properties: null,
                });
            }

            const requiredKeys =
                options.requiredProperties || objectKeys(definition);

            if (objectKeys(input).length < requiredKeys.length) {
                return failure({
                    error: errMissingProperties(
                        input,
                        (options.requiredProperties as string[]) ||
                            Object.keys(definition),
                    ),
                    properties: null,
                });
            }

            if (objectKeys(input).length > objectKeys(definition).length) {
                return failure({
                    error: errUnexpectedProperties(
                        input,
                        (options.requiredProperties as string[]) ||
                            Object.keys(definition),
                    ),
                    properties: null,
                });
            }

            return failure({
                error: null,
                properties: requiredKeys.reduce(
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
        serialize: () => {
            const serializedObj = Object.keys(definition)
                .map((key) =>
                    [`${key}: `, `${definition[key].serialize()}`].join(''),
                )
                .join(', ');

            return `record({ ${serializedObj} })`;
        },
    });
