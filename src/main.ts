import {
    arraySchema,
    booleanSchema,
    emailSchema,
    stringLiteralSchema,
    numberSchema,
    recordSchema,
    stringSchema,
    numberLiteralSchema,
    booleanLiteralSchema,
} from '../lib/test';
import { isFailure } from '../lib/utils';
import './style.css';

const PersonSchema = recordSchema({
    firstname: stringSchema,
    email: emailSchema,
    // friends: arraySchema(emailSchema),
    nested: recordSchema({
        age: numberSchema,
        nested2: recordSchema({
            what: booleanSchema,
            nested3: recordSchema({
                bar: stringLiteralSchema('abc'),
            }),
            nested4: recordSchema({
                baz: numberLiteralSchema(42),
                nested5: recordSchema({
                    baz: booleanLiteralSchema(false),
                }),
            }),
        }),
    }),
});

const res = PersonSchema.validate({} as any);
if (isFailure(res)) {
    const errors = PersonSchema.collectErrors(res);
    const item = errors[0].code;
}

console.log({ either: res });

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
    <div class="container">
        <pre class="pre">${JSON.stringify({}, null, 2)}</pre>
    </div>
`;
