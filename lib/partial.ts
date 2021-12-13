/* eslint-disable @typescript-eslint/no-explicit-any */
import { isObject, objectKeys } from './internal-utils';
import {
    notARecordError,
    NotARecordError,
    record,
    TooManyKeysError,
} from './record';
import { Either, failure, RecordSchema, Schema } from './utils';

type DefEither<Def extends { [x: string]: Schema<any, any, any> }> = Partial<{
    [Key in keyof Def]: Either<Def[Key]['O'], Def[Key]['E']>;
}>;

export type RecordFailure<Def extends { [x: string]: Schema<any, any, any> }> =
    {
        errors: Array<RecordError>;
        properties: DefEither<Def>;
    };

type RecordError = NotARecordError | TooManyKeysError;

export const partial = <Def extends RecordSchema<any, any, any>>(
    recordSchemaDefinition: Def,
): Schema<
    Partial<Def['I']>,
    Partial<Def['O']>,
    RecordFailure<Def['definition']>
> => {
    const I = null as unknown as Partial<Def['I']>;
    const O = null as unknown as Partial<Def['O']>;
    const E = null as any as RecordFailure<Def['definition']>;

    const validate = (input: typeof I): Either<typeof O, typeof E> => {
        if (!isObject(input)) {
            return failure({
                errors: [
                    notARecordError(recordSchemaDefinition.definition, input),
                ],
                properties: {},
            });
        }

        const partialDefinition = Object.fromEntries(
            Object.entries(recordSchemaDefinition.definition).filter(([k]) =>
                objectKeys(input).includes(k),
            ),
        ) as Def['definition'];

        // TODO: E_MISSING_KEYS is not a valid error in case of a partial record
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return record(partialDefinition).validate(input);
    };

    return {
        schema: 'partial',
        I,
        O,
        E,
        validate,
    };
};
