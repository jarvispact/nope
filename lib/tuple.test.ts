/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, it } from 'vitest';
import { LiteralSchema } from './literal';
import { NumberSchema } from './number';
import { StringSchema } from './string';
import { TupleSchema } from './tuple';
import { InferErrorType, ok, Schema } from './utils';
import { UnionSchema } from './union';

type OkTestcase = { items: Schema<string, any, any, any>[]; input: unknown[] };

const okTestcases: OkTestcase[] = [
    { items: [StringSchema, NumberSchema], input: ['a', 42] },
    { items: [NumberSchema, StringSchema], input: [42, 'a'] },

    { items: [LiteralSchema('A'), LiteralSchema('B')], input: ['A', 'B'] },
    { items: [LiteralSchema('B'), LiteralSchema('A')], input: ['B', 'A'] },
    { items: [LiteralSchema('A'), LiteralSchema('A')], input: ['A', 'A'] },

    {
        items: [
            UnionSchema([LiteralSchema('A'), LiteralSchema('B')]),
            UnionSchema([LiteralSchema('A'), LiteralSchema('B')]),
        ],
        input: ['B', 'A'],
    },
    {
        items: [UnionSchema([LiteralSchema(1), LiteralSchema(2)]), UnionSchema([LiteralSchema(1), LiteralSchema(2)])],
        input: [2, 1],
    },
];

it.each(okTestcases)(
    '[TupleSchema] should return status: "OK" and value: $either.value for input: $input',
    (testcase) => {
        const either = TupleSchema(...testcase.items).validate(testcase.input);
        expect(either).to.eql(ok(testcase.input));
    },
);

const TestTupleSchema = TupleSchema(StringSchema, NumberSchema);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ErrTestcase = {
    items: Schema<string, any, any, any>[];
    code: InferErrorType<typeof TestTupleSchema>['code'];
    input: any;
};

const errTestcases: ErrTestcase[] = [
    { items: [StringSchema, NumberSchema], code: 'E_TUPLE', input: undefined },
    { items: [StringSchema, NumberSchema], code: 'E_TUPLE', input: null },
    { items: [StringSchema, NumberSchema], code: 'E_TUPLE', input: true },
    { items: [StringSchema, NumberSchema], code: 'E_TUPLE', input: 42 },
    { items: [StringSchema, NumberSchema], code: 'E_TUPLE', input: 'abc' },
    { items: [StringSchema, NumberSchema], code: 'E_TUPLE', input: {} },

    { items: [LiteralSchema('A'), LiteralSchema('B')], code: 'E_TUPLE_ITEM', input: ['C'] },
    { items: [LiteralSchema('B'), LiteralSchema('A')], code: 'E_TUPLE_ITEM', input: ['D'] },
    { items: [LiteralSchema('B'), LiteralSchema('A')], code: 'E_TUPLE_ITEM', input: ['B'] },
    { items: [LiteralSchema('B'), LiteralSchema('A')], code: 'E_TUPLE_ITEM', input: ['A'] },
    { items: [LiteralSchema('B'), LiteralSchema('A')], code: 'E_TUPLE_ITEM', input: ['A', 'B'] },
];

it.each(errTestcases)(
    '[TupleSchema] should return status: "ERR" and value.code: $code for input: $input',
    (testcase) => {
        const either = TupleSchema(...testcase.items).validate(testcase.input);
        expect(either).toEqual({
            status: 'ERR',
            value: expect.objectContaining({
                code: testcase.code,
            }),
        });
    },
);
