/* eslint-disable @typescript-eslint/no-explicit-any */

import './style.css';
import {
    record,
    email,
    date,
    string,
    union,
    literal,
    uuid,
    dateString,
} from '../lib/nope';

const PersonSchema = record({
    id: uuid,
    email,
    username: string,
    firstname: string,
    lastname: string,
    birthday: dateString,
    source: record({
        importedAt: date,
        system: union([literal('SYS1'), literal('SYS2')]),
    }),
});

type I = typeof PersonSchema['I'];
// type O = typeof PersonSchema['O'];
// type E = typeof PersonSchema['E'];

const validPerson: I = {
    id: '1bfeea64-43da-4ef8-a6a5-e33512d7d169',
    email: 'tony@starkindustries.com',
    username: 'ironman',
    firstname: 'Tony',
    lastname: 'Stark',
    birthday: '1970-05-29',
    source: {
        importedAt: new Date(),
        system: 'SYS1',
    },
};

const invalidPerson = {
    id: '1bfeea64-43da-4ef8-a6a5-',
    email: 'tony@starkindustries',
    username: 'ironman',
    firstname: 'Tony',
    lastname: 42,
    birthday: '1970-05-35',
    source: {
        importedAt: Date.now(),
        system: 'AVENGERS-DB',
    },
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
                { invalidPerson: PersonSchema.validate(invalidPerson) },
                null,
                2,
            )}</pre>
        </div>
    </div>
`;
