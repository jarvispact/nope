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
    test: recordSchema({
        foo: numberLiteralSchema(42),
        whaat: recordSchema({
            ok: stringLiteralSchema('abc'),
            t: arraySchema(recordSchema({ tt: booleanSchema })),
        }),
    }),
    test2: arraySchema(booleanLiteralSchema(true)),
    list: arraySchema(
        recordSchema({
            test: numberLiteralSchema(42),
            what: arraySchema(
                recordSchema({
                    omg: stringLiteralSchema('abc'),
                }),
            ),
        }),
    ),
    test3: recordSchema({
        what: numberSchema,
    }),
});

const res = PersonSchema.validate({} as any);
if (isFailure(res)) {
    const errors = PersonSchema.collectErrors(res);
    // const item = errors[0].code;
}

console.log({ either: res });

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
    <div class="container">
        <pre class="pre">${JSON.stringify({}, null, 2)}</pre>
    </div>
`;
