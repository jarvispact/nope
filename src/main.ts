/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    array,
    email,
    float,
    Infer,
    isValid,
    record,
    string,
    stringLiteral,
    union,
    valueOf,
} from '../lib/nope';
import { InvoiceNumberSchema } from './invoice-number';
import './style.css';

const countryCodes = ['AT', 'DE', 'CH'] as const;
const CountryCodeSchema = union(countryCodes.map(stringLiteral));

const InvoiceSchema = record({ number: InvoiceNumberSchema, amount: float });

const PersonSchema = record({
    firstname: string,
    email: email,
    groups: array(string),
    address: record({
        street: string,
        country: CountryCodeSchema,
    }),
    invoices: array(InvoiceSchema),
});

type Person = Infer<typeof PersonSchema>;

const either = PersonSchema.validate({
    firstname: 'test',
    email: 'test@test.com',
    groups: [],
    address: { country: 'AT', street: 'street' },
    invoices: [{ number: 'RE-42', amount: 44.0 }],
});

console.log({ either });

if (isValid(either)) {
    const data = valueOf(either);
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
    <div class="container">
        <pre class="pre">${JSON.stringify(either, null, 2)}</pre>
    </div>
`;
