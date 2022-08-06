import { emailSchema, recordSchema, stringSchema } from '../lib/test';
import './style.css';

const PersonSchema = recordSchema({
    firstname: stringSchema,
    email: emailSchema,
    nested: recordSchema({
        firstname: stringSchema,
        email: emailSchema,
    }),
});

const either = PersonSchema.validate({} as any);
const errors = PersonSchema.collectErrors({ nested: {} } as any);

console.log({ either, errors });

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
    <div class="container">
        <pre class="pre">${JSON.stringify({}, null, 2)}</pre>
    </div>
`;
