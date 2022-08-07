import { createError, failure, schema, SchemaError, success } from './utils';

const uri = 'string';

export const string = schema<
    typeof uri,
    string,
    string,
    SchemaError<typeof uri, 'E_STRING'>
>({
    uri,
    is: (input) => typeof input === uri,
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
