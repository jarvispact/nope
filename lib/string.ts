import { createError, failure, schema, SchemaError, success } from './utils';

export const string = schema<
    'string',
    string,
    string,
    SchemaError<'string', 'E_STRING'>
>({
    uri: 'string',
    is: (input) => typeof input === 'string',
    validate: (input, { uri, is }) =>
        is(input)
            ? success(input)
            : failure(
                  createError(
                      uri,
                      'E_STRING',
                      `input: "${input}" is not of type ${uri}`,
                  ),
              ),
});

export type StringSchema = typeof string;
