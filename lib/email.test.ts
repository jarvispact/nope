import { expect, it } from 'vitest';
import { EmailSchema } from './email';
import { InferErrorType, ok } from './utils';

type OkTestcase = { input: string };

const okTestcases: OkTestcase[] = [
    { input: 'michaelknight@gmail.com' },
    { input: 'michaelknight+whaat@gmail.com' },
    { input: 'michaelknight@domain.tld' },
    { input: 'michaelknight.foo@orf.at' },
    { input: 'MIchAELkniGHT@orf.at' },
    { input: 'michaelknight42@orf.at' },
];

it.each(okTestcases)(
    '[EmailSchema] should return status: "OK" and value: $either.value for input: $input',
    (testcase) => {
        const either = EmailSchema.validate(testcase.input);
        expect(either).to.eql(ok(testcase.input));
    },
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ErrTestcase = { input: any; code: InferErrorType<typeof EmailSchema>['code'] };

const errTestcases: ErrTestcase[] = [
    { input: undefined, code: 'E_STRING' },
    { input: null, code: 'E_STRING' },
    { input: 42, code: 'E_STRING' },
    { input: true, code: 'E_STRING' },
    { input: [], code: 'E_STRING' },
    { input: {}, code: 'E_STRING' },

    { input: '', code: 'E_EMAIL' },
    { input: 'j@s', code: 'E_EMAIL' },
    { input: 'test', code: 'E_EMAIL' },
    { input: 'test@.com', code: 'E_EMAIL' },
];

it.each(errTestcases)(
    '[EmailSchema] should return status: "ERR" and value.code: $either.code for input: $input',
    (testcase) => {
        const either = EmailSchema.validate(testcase.input);
        expect(either).toEqual({
            status: 'ERR',
            value: expect.objectContaining({
                code: testcase.code,
            }),
        });
    },
);
