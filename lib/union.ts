/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Either,
    err,
    failure,
    getDisplayType,
    isLiteralSchema,
    isRecordSchema,
    Schema,
    success,
    SupportedSchema,
} from './utils';

const unionError = (union: Array<string>, input: unknown) =>
    err('union', 'E_NOT_IN_UNION', 'provided value is not in union', {
        provided: {
            type: getDisplayType(input),
            value: input,
        },
        expected: {
            type: 'union',
            union,
        },
    });

type UnionError = ReturnType<typeof unionError>;

export const union = <S extends Array<SupportedSchema>>(
    possibleSchemas: S,
): Schema<S[number]['I'], S[number]['O'], UnionError> => {
    const I = null as unknown as S[number]['I'];
    const O = null as unknown as S[number]['O'];
    const E = null as unknown as UnionError;

    const serializedUnion = possibleSchemas.map((s) => {
        if (isLiteralSchema(s)) return s.literal;
        if (isRecordSchema(s))
            return `record(${JSON.stringify(
                Object.fromEntries(
                    Object.entries(s.definition).map(([k, v]) => [k, v.schema]),
                ),
            )})`;
        return s.schema;
    });

    const validate = (input: typeof I): Either<typeof O, typeof E> => {
        const items = possibleSchemas.map((s) => s.validate(input));
        const isSuccessful = items.some((item) => item.status === 'SUCCESS');
        return isSuccessful
            ? success(input)
            : failure(unionError(serializedUnion, input));
    };

    return {
        schema: 'union',
        I,
        O,
        E,
        validate,
    };
};
