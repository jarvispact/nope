/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, it } from 'vitest';
import { LiteralSchema } from './literal';
import { NumberSchema } from './number';
import { StringSchema } from './string';
import { UnionSchema } from './union';
import { ok, Schema } from './utils';

type OkTestcase = { unionList: Schema<string, any, any, any>[]; input: unknown };

const okTestcases: OkTestcase[] = [
    { unionList: [StringSchema, NumberSchema], input: 'a' },
    { unionList: [StringSchema, NumberSchema], input: 42 },

    { unionList: [LiteralSchema('A'), LiteralSchema('B')], input: 'A' },
    { unionList: [LiteralSchema('A'), LiteralSchema('B')], input: 'B' },
];

it.each(okTestcases)(
    '[UnionSchema] should return status: "OK" and value: $either.value for input: $input',
    (testcase) => {
        const either = UnionSchema(testcase.unionList).validate(testcase.input);
        expect(either).to.eql(ok(testcase.input));
    },
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ErrTestcase = { unionList: Schema<string, any, any, any>[]; input: any };

const errTestcases: ErrTestcase[] = [
    { unionList: [StringSchema, NumberSchema], input: undefined },
    { unionList: [StringSchema, NumberSchema], input: null },
    { unionList: [StringSchema, NumberSchema], input: true },
    { unionList: [StringSchema, NumberSchema], input: [] },
    { unionList: [StringSchema, NumberSchema], input: {} },

    { unionList: [LiteralSchema('A'), LiteralSchema('B')], input: 'C' },
    { unionList: [LiteralSchema('A'), LiteralSchema('B')], input: 'D' },
    { unionList: [LiteralSchema('A'), LiteralSchema('B')], input: 42 },
    { unionList: [LiteralSchema('A'), LiteralSchema('B')], input: true },
];

it.each(errTestcases)(
    '[UnionSchema] should return status: "ERR" and value.code: $code for input: $input',
    (testcase) => {
        const either = UnionSchema(testcase.unionList).validate(testcase.input);
        expect(either).toEqual({
            status: 'ERR',
            value: expect.objectContaining({
                code: 'E_UNION',
            }),
        });
    },
);
