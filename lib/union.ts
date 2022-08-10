/* eslint-disable @typescript-eslint/no-explicit-any */

import { createError, Schema, schema, SchemaError } from './utils';

const uri = 'UnionSchema';
const errorCode = 'E_UNION_SCHEMA';

export const UnionSchema = <S extends Schema<any, any, any, any>[]>(
    schemaList: S,
) =>
    schema<
        typeof uri,
        S[number]['I'],
        S[number]['O'],
        SchemaError<typeof uri, typeof errorCode, S[number]['I']>
    >({
        uri,
        displayString: `${schemaList.map((s) => s.displayString).join(' | ')}`,
        is: (input) => schemaList.some((s) => s.is(input)),
        err: (input, { displayString }) =>
            createError(
                uri,
                errorCode,
                `input: "${input}" is not of type: ${displayString}`,
                input,
            ),
    });

export type UnionSchema = typeof UnionSchema;
