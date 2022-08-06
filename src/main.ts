import {
    arraySchema,
    emailSchema,
    recordSchema,
    stringSchema,
} from '../lib/test';
import { isFailure } from '../lib/utils';
import './style.css';

const PersonSchema = recordSchema({
    firstname: stringSchema,
    email: emailSchema,
    // friends: arraySchema(emailSchema),
});

const either = PersonSchema.validate({} as any);
if (isFailure(either)) {
    const errors = PersonSchema.collectErrors(either);
    const item = errors[0];
}

console.log({ either });

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
    <div class="container">
        <pre class="pre">${JSON.stringify({}, null, 2)}</pre>
    </div>
`;
