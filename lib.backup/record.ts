/* eslint-disable @typescript-eslint/no-explicit-any */
import { err, getDisplayType, isObject, objectKeys } from './internal-utils';
import {
    Either,
    failure,
    RecordSchema,
    Schema,
    success,
} from './utils.backup.ts.backup';

export const notARecordError = (
    definition: Record<string, unknown>,
    input: Record<string, unknown>,
) =>
    err('record', 'E_NOT_A_RECORD', 'provided value is not of type: "record"', {
        provided: {
            type: getDisplayType(input),
            value: input,
        },
        expected: {
            type: 'record',
            keys: Object.keys(definition),
        },
    });

export type NotARecordError = ReturnType<typeof notARecordError>;

const missingKeysError = (
    definition: Record<string, unknown>,
    input: Record<string, unknown>,
) =>
    err('record', 'E_MISSING_RECORD_KEYS', 'record has missing keys', {
        provided: {
            type: getDisplayType(input),
            value: input,
        },
        expected: {
            type: 'record',
            keys: Object.keys(definition),
        },
    });

type MissingKeysError = ReturnType<typeof missingKeysError>;

const tooManyKeysError = (
    definition: Record<string, unknown>,
    input: Record<string, unknown>,
) =>
    err('record', 'E_UNKNOWN_RECORD_KEYS', 'record has unknown keys', {
        provided: {
            type: getDisplayType(input),
            value: input,
            keys: Object.keys(input),
        },
        expected: {
            type: 'record',
            keys: Object.keys(definition),
        },
    });

export type TooManyKeysError = ReturnType<typeof tooManyKeysError>;

type RecordError = NotARecordError | MissingKeysError | TooManyKeysError;

type DefEither<Def extends { [x: string]: Schema<any, any, any> }> = {
    [Key in keyof Def]: Either<Def[Key]['O'], Def[Key]['E']>;
};

type RecordFailure<Def extends { [x: string]: Schema<any, any, any> }> = {
    errors: Array<RecordError>;
    properties: DefEither<Def>;
};

export const record = <Def extends { [Key: string]: Schema<any, any, any> }>(
    definition: Def,
): RecordSchema<
    { [Key in keyof Def]: Def[Key]['I'] },
    { [Key in keyof Def]: Def[Key]['I'] },
    RecordFailure<Def>,
    Def
> => {
    const I = null as unknown as { [Key in keyof Def]: Def[Key]['I'] };
    const O = null as unknown as { [Key in keyof Def]: Def[Key]['O'] };
    const E = null as unknown as RecordFailure<Def>;

    const validate = (input: typeof I): Either<typeof O, typeof E> => {
        if (!isObject(input)) {
            return failure({
                errors: [notARecordError(definition, input)],
                properties: {} as DefEither<Def>,
            });
        }

        const errors: Array<RecordError> = [];

        if (objectKeys(definition).length > objectKeys(input).length) {
            errors.push(missingKeysError(definition, input));
        }

        if (objectKeys(input).length > objectKeys(definition).length) {
            errors.push(tooManyKeysError(definition, input));
        }

        const properties = objectKeys(definition).reduce((accum, key) => {
            accum[key] = definition[key].validate(input[key]);
            return accum;
        }, {} as DefEither<Def>);

        const propertiesHaveErrors = objectKeys(properties).some(
            (k) => properties[k].status === 'FAILURE',
        );

        if (errors.length || propertiesHaveErrors) {
            return failure({
                errors,
                properties,
            });
        }

        return success(input);
    };

    return {
        schema: 'record',
        I,
        O,
        E,
        validate,
        definition,
    };
};
