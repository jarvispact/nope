import { StringSchema } from '../lib/string';
import { createError, Opaque, schema, SchemaError } from '../lib/utils';

const uri = 'invoice-number';

export type InvoiceNumber = Opaque<string, typeof uri>;

export const InvoiceNumberSchema = schema<
    typeof uri,
    string,
    InvoiceNumber,
    SchemaError<typeof uri, 'E_INVOICE_NUMBER', string>
>({
    uri,
    is: (input) => StringSchema.is(input) && input.startsWith('RE-'),
    err: (input) =>
        createError(
            uri,
            'E_INVOICE_NUMBER',
            `input: "${input}" is not of type: ${uri}`,
            input,
        ),
});

export type InvoiceNumberSchema = typeof InvoiceNumberSchema;
