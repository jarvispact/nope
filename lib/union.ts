/* eslint-disable @typescript-eslint/no-explicit-any */

import { AutoComplete, createError, Schema, schema } from './utils';

const uri = 'union';

export const union = <S extends Schema<any, any, any, any>[]>(schemaList: S) =>
    schema<
        typeof uri,
        AutoComplete<S[number]['O'], S[number]['I']>,
        S[number]['O'],
        S[number]['E']
    >({
        uri,
        displayString: `${schemaList.map((s) => s.displayString).join(' | ')}`,
        is: (input) => schemaList.some((s) => s.is(input)),
        err: (input, { displayString }) =>
            createError(
                uri,
                'E_UNION',
                `input: "${input}" is not of type: ${displayString}`,
                input,
            ),
    });

export type UnionSchema = typeof union;
