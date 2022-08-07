/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    AutoComplete,
    createError,
    failure,
    Schema,
    schema,
    success,
} from './utils';

export const union = <S extends Schema<any, any, any, any>[]>(schemaList: S) =>
    schema<
        'union',
        AutoComplete<S[number]['O'], S[number]['I']>,
        S[number]['O'],
        S[number]['E']
    >({
        uri: 'union',
        is: (input) => schemaList.some((s) => s.is(input)),
        validate: (input, { uri, is }) =>
            is(input)
                ? success(input)
                : failure(
                      createError(
                          uri,
                          'E_UNION',
                          `input: "${input}" is not of type ${uri}(${schemaList
                              .map((s) => s.uri)
                              .join(', ')})`,
                      ),
                  ),
    });

export type UnionSchema = typeof union;
