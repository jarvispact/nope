import { expect, it } from 'vitest';
import { Iso8601TimeSchema } from './iso-8601-time';
import { InferErrorType, ok } from './utils';

type OkTestcase = { input: string };

const okTestcases: OkTestcase[] = [
    { input: '00:00' },
    { input: '00:00:00' },
    { input: '00:00:00.000' },

    { input: '00:00Z' },
    { input: '00:00:00Z' },
    { input: '00:00:00.000Z' },

    { input: '00:00+01:00' },
    { input: '00:00:00+01:00' },
    { input: '00:00:00.000+01:00' },

    { input: '00:00-01:00' },
    { input: '00:00:00-01:00' },
    { input: '00:00:00.000-01:00' },
];

it.each(okTestcases)(
    '[Iso8601TimeSchema] should return status: "OK" and value: $value for input: $input',
    (testcase) => {
        const either = Iso8601TimeSchema.validate(testcase.input);
        expect(either).to.eql(ok(testcase.input));
    },
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ErrTestcase = { input: any; code: InferErrorType<typeof Iso8601TimeSchema>['code'] };

const errTestcases: ErrTestcase[] = [
    { input: undefined, code: 'E_STRING' },
    { input: null, code: 'E_STRING' },
    { input: 42, code: 'E_STRING' },
    { input: true, code: 'E_STRING' },
    { input: [], code: 'E_STRING' },
    { input: {}, code: 'E_STRING' },

    { input: '', code: 'E_ISO_8601_TIME' },
    { input: '00', code: 'E_ISO_8601_TIME' },
    { input: '00:', code: 'E_ISO_8601_TIME' },
    { input: '00:0', code: 'E_ISO_8601_TIME' },
    { input: '00:00:', code: 'E_ISO_8601_TIME' },
    { input: '00:00:0', code: 'E_ISO_8601_TIME' },
    { input: '00:00:0.', code: 'E_ISO_8601_TIME' },
    { input: '00:00:00.', code: 'E_ISO_8601_TIME' },
    { input: '00:00:00.0', code: 'E_ISO_8601_TIME' },
    { input: '00:00:00.00', code: 'E_ISO_8601_TIME' },
    { input: '00:00:00.0000', code: 'E_ISO_8601_TIME' },

    { input: '25:00', code: 'E_ISO_8601_TIME' },
    { input: '24:01', code: 'E_ISO_8601_TIME' },
];

it.each(errTestcases)(
    '[Iso8601TimeSchema] should return status: "ERR" and value.code: $code for input: $input',
    (testcase) => {
        const either = Iso8601TimeSchema.validate(testcase.input);
        expect(either).toEqual({
            status: 'ERR',
            value: expect.objectContaining({
                code: testcase.code,
            }),
        });
    },
);
