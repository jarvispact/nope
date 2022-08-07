import { array } from '../lib/array';
import { boolean } from '../lib/boolean';
import { booleanLiteral } from '../lib/boolean-literal';
import { email } from '../lib/email';
import { number } from '../lib/number';
import { numberLiteral } from '../lib/number-literal';
import { record } from '../lib/record';
import { string } from '../lib/string';
import { stringLiteral } from '../lib/string-literal';
// import { isFailure } from '../lib/utils';
import './style.css';

const PersonSchema = record({
    firstname: string,
    email: email,
    test: record({
        foo: numberLiteral(42),
        whaat: record({
            ok: stringLiteral('abc'),
            t: array(record({ tt: boolean })),
        }),
    }),
    test2: array(booleanLiteral(true)),
    list: array(
        record({
            test: numberLiteral(42),
            what: array(
                record({
                    omg: stringLiteral('abc'),
                }),
            ),
        }),
    ),
    test3: record({
        what: number,
    }),
});

const res = PersonSchema.validate({} as any);
// if (isFailure(res)) {
//     const errors = PersonSchema.collectErrors(res);
//     // const item = errors[0].code;
// }

console.log({ either: res });

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const app = document.querySelector<HTMLDivElement>('#app')!;

app.innerHTML = `
    <div class="container">
        <pre class="pre">${JSON.stringify({}, null, 2)}</pre>
    </div>
`;
