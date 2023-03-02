import { expect, it } from 'vitest';
import { IntSchema } from './int';
import { InferErrorType, ok } from './utils';

type OkTestcase = { input: number };

const okTestcases: OkTestcase[] = [{ input: 0 }, { input: -42 }, { input: 42 }];

it.each(okTestcases)(
    '[IntSchema] should return status: "OK" and value: $either.value for input: $input',
    (testcase) => {
        const either = IntSchema.validate(testcase.input);
        expect(either).to.eql(ok(testcase.input));
    },
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ErrTestcase = { input: any; code: InferErrorType<typeof IntSchema>['code'] };

const errTestcases: ErrTestcase[] = [
    { input: undefined, code: 'E_NUMBER' },
    { input: null, code: 'E_NUMBER' },
    { input: 'abc', code: 'E_NUMBER' },
    { input: true, code: 'E_NUMBER' },
    { input: [], code: 'E_NUMBER' },
    { input: {}, code: 'E_NUMBER' },

    { input: 42.2, code: 'E_INT' },
    { input: -42.1, code: 'E_INT' },
    { input: 0.1, code: 'E_INT' },
];

it.each(errTestcases)('[IntSchema] should return status: "ERR" and value.code: $code for input: $input', (testcase) => {
    const either = IntSchema.validate(testcase.input);
    expect(either).toEqual({
        status: 'ERR',
        value: expect.objectContaining({
            code: testcase.code,
        }),
    });
});
