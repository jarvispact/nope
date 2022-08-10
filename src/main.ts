/* eslint-disable @typescript-eslint/no-explicit-any */

import {
    ArraySchema,
    EmailSchema,
    FloatSchema,
    NullSchema,
    RecordSchema,
    StringSchema,
    LiteralSchema,
    UndefinedSchema,
    UnionSchema,
    UuidSchema,
    isInvalid,
} from '../lib/nope';
import { InvoiceNumberSchema } from './invoice-number';
import './style.css';

const countryCodes = ['AT', 'DE', 'CH'] as const;
const CountryCodeSchema = UnionSchema(countryCodes.map(LiteralSchema));

const InvoiceSchema = RecordSchema({
    number: InvoiceNumberSchema,
    amount: FloatSchema,
});

const PersonSchema = RecordSchema({
    id: UuidSchema,
    firstname: UnionSchema([StringSchema, UndefinedSchema]),
    lastname: UnionSchema([StringSchema, NullSchema]),
    name: UnionSchema([StringSchema, NullSchema, UndefinedSchema]),
    test: UnionSchema([LiteralSchema('a'), LiteralSchema('b')]),
    email: EmailSchema,
    groups: ArraySchema(StringSchema),
    address: RecordSchema({
        street: StringSchema,
        country: CountryCodeSchema,
    }),
    deliveryAddresses: ArraySchema(
        RecordSchema({
            street: StringSchema,
            country: CountryCodeSchema,
        }),
    ),
    invoices: ArraySchema(InvoiceSchema),
});

// type Person = Infer<typeof PersonSchema>;

const either = PersonSchema.validate({
    id: 1,
    firstname: 42,
    lastname: 4242,
    name: 444222,
    test: 'a',
    email: 'test',
    groups: [42],
    address: [],
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
