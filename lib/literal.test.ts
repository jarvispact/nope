import { expect, it } from 'vitest';
import { LiteralSchema } from './literal';
import { ok } from './utils';

type OkTestcase = { literal: string | number | boolean };

const okTestcases: OkTestcase[] = [{ literal: 'A' }, { literal: 42 }, { literal: true }];

it.each(okTestcases)(
    '[LiteralSchema] should return status: "OK" and value: $either.value for input: $input',
    (testcase) => {
        const either = LiteralSchema(testcase.literal).validate(testcase.literal);
        expect(either).to.eql(ok(testcase.literal));
    },
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ErrTestcase = { literal: 'A'; input: any };

const errTestcases: ErrTestcase[] = [
    { literal: 'A', input: undefined },
    { literal: 'A', input: null },
    { literal: 'A', input: 42 },
    { literal: 'A', input: 'abc' },
    { literal: 'A', input: 'B' },
    { literal: 'A', input: true },
    { literal: 'A', input: [] },
    { literal: 'A', input: {} },
];

it.each(errTestcases)(
    '[LiteralSchema] should return status: "ERR" and value.code: $either.code for input: $input',
    (testcase) => {
        const either = LiteralSchema(testcase.literal).validate(testcase.input);
        expect(either).toEqual({
            status: 'ERR',
            value: expect.objectContaining({
                code: 'E_LITERAL',
            }),
        });
    },
);
