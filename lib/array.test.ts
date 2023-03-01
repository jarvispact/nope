/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, it } from 'vitest';
import { LiteralSchema } from './literal';
import { NumberSchema } from './number';
import { StringSchema } from './string';
import { ArraySchema } from './array';
import { InferErrorType, ok, Schema } from './utils';
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

const TestArraySchema = ArraySchema(StringSchema);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ErrTestcase = {
    item: Schema<string, any, any, any>;
    code: InferErrorType<typeof TestArraySchema>['code'];
    input: any;
};

const errTestcases: ErrTestcase[] = [
    { item: StringSchema, code: 'E_ARRAY', input: undefined },
    { item: StringSchema, code: 'E_ARRAY', input: null },
    { item: StringSchema, code: 'E_ARRAY', input: true },
    { item: StringSchema, code: 'E_ARRAY', input: 42 },
    { item: StringSchema, code: 'E_ARRAY', input: 'abc' },
    { item: StringSchema, code: 'E_ARRAY', input: {} },

    { item: LiteralSchema('A'), code: 'E_ARRAY_ITEM', input: ['C'] },
    { item: LiteralSchema('A'), code: 'E_ARRAY_ITEM', input: ['D'] },
    { item: LiteralSchema('A'), code: 'E_ARRAY_ITEM', input: [42] },
    { item: LiteralSchema('A'), code: 'E_ARRAY_ITEM', input: [true] },
    { item: LiteralSchema('A'), code: 'E_ARRAY_ITEM', input: ['A', 'B'] },
];

it.each(errTestcases)(
    '[ArraySchema] should return status: "ERR" and value.code: $either.code for input: $input',
    (testcase) => {
        const either = ArraySchema(testcase.item).validate(testcase.input);
        expect(either).toEqual({
            status: 'ERR',
            value: expect.objectContaining({
                code: testcase.code,
            }),
        });
    },
);
