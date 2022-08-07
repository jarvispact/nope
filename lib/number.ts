import { createError, failure, schema, SchemaError, success } from './utils';

export const number = schema<
    'number',
    number,
    number,
    SchemaError<'number', 'E_NUMBER'>
>({
    uri: 'number',
    is: (input) => typeof input === 'number',
    validate: (input, { uri, is }) =>
        is(input)
            ? success(input)
            : failure(
                  createError(
                      uri,
                      'E_NUMBER',
                      `input: "${input}" is not of type ${uri}`,
                  ),
              ),
});

export type NumberSchema = typeof number;
