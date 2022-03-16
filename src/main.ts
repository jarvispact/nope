/* eslint-disable @typescript-eslint/no-explicit-any */

import './style.css';
import { record, email, date, string, union, literal } from '../lib/nope';

const PersonSchema = record({
    email,
    firstname: string,
    lastname: string,
    importedAt: date,
    sourceSystem: union([literal('SYS1'), literal('SYS2')]),
});

type I = typeof PersonSchema['I'];
// type O = typeof PersonSchema['O'];
// type E = typeof PersonSchema['E'];

const validPerson: I = {
    email: 'tony@starkindustries.com',
    firstname: 'Tony',
    lastname: 'Stark',
    importedAt: new Date(),
    sourceSystem: 'SYS1',
};

const invalidPerson2 = {
    email: 'test',
    firstname: 42,
    lastname: 42,
    importedAt: 'brokendate',
    sourceSystem: 'AVENGERS-DB',
} as any;

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
    <div class="flex">
        <div class="scrollable">
            <pre class="pre">${JSON.stringify(
                { validPerson: PersonSchema.validate(validPerson) },
                null,
                2,
            )}</pre>
            <pre class="pre">${JSON.stringify(
                { invalidPerson0: PersonSchema.validate(null as any) },
                null,
                2,
            )}</pre>
            <pre class="pre">${JSON.stringify(
                { invalidPerson1: PersonSchema.validate({} as any) },
                null,
                2,
            )}</pre>
            <pre class="pre">${JSON.stringify(
                { invalidPerson2: PersonSchema.validate(invalidPerson2) },
                null,
                2,
            )}</pre>
        </div>
    </div>
`;
