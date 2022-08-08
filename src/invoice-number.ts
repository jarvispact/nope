import { string } from '../lib/string';
import { createError, Opaque, schema, SchemaError } from '../lib/utils';

const uri = 'invoice-number';

export type InvoiceNumber = Opaque<string, typeof uri>;

export const InvoiceNumberSchema = schema<
    typeof uri,
    string,
    InvoiceNumber,
    SchemaError<typeof uri, 'E_INVOICE_NUMBER'>
>({
    uri,
    is: (input) => string.is(input) && input.startsWith('RE-'),
    err: (input) =>
        createError(
            uri,
            'E_INVOICE_NUMBER',
            `input: "${input}" is not of type: ${uri}`,
        ),
});

export type InvoiceNumberSchema = typeof InvoiceNumberSchema;
