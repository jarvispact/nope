import { string } from './string';
import {
    createError,
    failure,
    Opaque,
    schema,
    SchemaError,
    success,
} from './utils';

export type Email = Opaque<string, 'Email'>;

export const email = schema<
    'email',
    string,
    Email,
    SchemaError<'email', 'E_EMAIL'>
>({
    uri: 'email',
    is: (input) => string.is(input) && input.includes('@'),
    validate: (input, { uri, is }) =>
        is(input)
            ? success(input)
            : failure(
                  createError(
                      uri,
                      'E_EMAIL',
                      `input: "${input}" is not of type ${uri}`,
                  ),
              ),
});

export type EmailSchema = typeof email;
