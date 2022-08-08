/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    array,
    email,
    float,
    nullSchema,
    record,
    string,
    literal,
    undefinedSchema,
    union,
    uuid,
    isInvalid,
} from '../lib/nope';
import { InvoiceNumberSchema } from './invoice-number';
import './style.css';

const countryCodes = ['AT', 'DE', 'CH'] as const;
const CountryCodeSchema = union(countryCodes.map(literal));

const InvoiceSchema = record({ number: InvoiceNumberSchema, amount: float });

const PersonSchema = record({
    id: uuid,
    firstname: union([string, undefinedSchema]),
    lastname: union([string, nullSchema]),
    name: union([string, nullSchema, undefinedSchema]),
    email: email,
    groups: array(string),
    address: record({
        street: string,
        country: CountryCodeSchema,
    }),
    deliveryAddresses: array(
        record({
            street: string,
            country: CountryCodeSchema,
        }),
    ),
    invoices: array(InvoiceSchema),
});

// type Person = Infer<typeof PersonSchema>;

const either = PersonSchema.validate({
    id: 1,
    firstname: 42,
    lastname: 4242,
    name: 444222,
    email: 'test',
    groups: [42],
    address: { country: 'AU', street: true },
    deliveryAddresses: [{ country: 'EN', street: [] }],
    invoices: [{ number: '42' }],
} as any);

console.log({ either });

if (isInvalid(either)) {
    const errors = PersonSchema.collectErrors(either);
    console.log(errors);
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
    <div class="container">
        <pre class="pre">${JSON.stringify(either, null, 2)}</pre>
    </div>
`;
