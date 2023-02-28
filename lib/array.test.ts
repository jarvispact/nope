/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, it } from 'vitest';
import { LiteralSchema } from './literal';
import { NumberSchema } from './number';
import { StringSchema } from './string';
import { ArraySchema } from './array';
import { ok, Schema } from './utils';
import { UnionSchema } from './union';

type OkTestcase = { item: Schema<string, any, any, any>; input: unknown[] };

const okTestcases: OkTestcase[] = [
    { item: StringSchema, input: ['a'] },
    { item: NumberSchema, input: [42] },

    { item: LiteralSchema('A'), input: ['A'] },
    { item: LiteralSchema('B'), input: ['B'] },
    { item: LiteralSchema('A'), input: ['A', 'A'] },

    { item: UnionSchema([LiteralSchema('A'), LiteralSchema('B')]), input: ['A', 'B'] },
    { item: UnionSchema([LiteralSchema(1), LiteralSchema(2)]), input: [1, 2] },
];

it.each(okTestcases)(
    '[ArraySchema] should return status: "OK" and value: $either.value for input: $input',
    (testcase) => {
        const either = ArraySchema(testcase.item).validate(testcase.input);
        expect(either).to.eql(ok(testcase.input));
    },
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ErrTestcase = { item: Schema<string, any, any, any>; input: any };

const errTestcases: ErrTestcase[] = [
    { item: StringSchema, input: undefined },
    { item: StringSchema, input: null },
    { item: StringSchema, input: true },
    { item: StringSchema, input: 42 },
    { item: StringSchema, input: 'abc' },
    { item: StringSchema, input: {} },

    { item: LiteralSchema('A'), input: ['C'] },
    { item: LiteralSchema('A'), input: ['D'] },
    { item: LiteralSchema('A'), input: [42] },
    { item: LiteralSchema('A'), input: [true] },
    { item: LiteralSchema('A'), input: ['A', 'B'] },
];

it.each(errTestcases)(
    '[ArraySchema] should return status: "ERR" and value.code: $either.code for input: $input',
    (testcase) => {
        const either = ArraySchema(testcase.item).validate(testcase.input);
        expect(either).toEqual({
            status: 'ERR',
            value: expect.objectContaining({
                code: 'E_ARRAY',
            }),
        });
    },
);
