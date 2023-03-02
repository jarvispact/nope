import { expect, it } from 'vitest';
import { Iso8601DateSchema } from './iso-8601-date';
import { InferErrorType, ok } from './utils';

type OkTestcase = { input: string };

const okTestcases: OkTestcase[] = [{ input: '2000-01-01' }, { input: '2000-12-31' }, { input: '2000-02-20' }];

it.each(okTestcases)(
    '[Iso8601DateSchema] should return status: "OK" and value: $either.value for input: $input',
    (testcase) => {
        const either = Iso8601DateSchema.validate(testcase.input);
        expect(either).to.eql(ok(testcase.input));
    },
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ErrTestcase = { input: any; code: InferErrorType<typeof Iso8601DateSchema>['code'] };

const errTestcases: ErrTestcase[] = [
    { input: undefined, code: 'E_STRING' },
    { input: null, code: 'E_STRING' },
    { input: 42, code: 'E_STRING' },
    { input: true, code: 'E_STRING' },
    { input: [], code: 'E_STRING' },
    { input: {}, code: 'E_STRING' },

    { input: '', code: 'E_ISO_8601_DATE' },
    { input: '200', code: 'E_ISO_8601_DATE' },
    { input: '2000', code: 'E_ISO_8601_DATE' },
    { input: '2000-00', code: 'E_ISO_8601_DATE' },
    { input: '2000-00-', code: 'E_ISO_8601_DATE' },
    { input: '2000-00-0', code: 'E_ISO_8601_DATE' },
    { input: '2000-0-00', code: 'E_ISO_8601_DATE' },
    { input: '2000-0000', code: 'E_ISO_8601_DATE' },
    { input: '20000000', code: 'E_ISO_8601_DATE' },
    { input: '2000:00:00', code: 'E_ISO_8601_DATE' },

    { input: '2000-00-00', code: 'E_ISO_8601_DATE' },
    { input: '2000-13-00', code: 'E_ISO_8601_DATE' },
    { input: '2000-12-32', code: 'E_ISO_8601_DATE' },
    { input: '2000-13-01', code: 'E_ISO_8601_DATE' },
];

it.each(errTestcases)(
    '[Iso8601DateSchema] should return status: "ERR" and value.code: $code for input: $input',
    (testcase) => {
        const either = Iso8601DateSchema.validate(testcase.input);
        expect(either).toEqual({
            status: 'ERR',
            value: expect.objectContaining({
                code: testcase.code,
            }),
        });
    },
);
