/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, it } from 'vitest';
import { LiteralSchema } from './literal';
import { NumberSchema } from './number';
import { StringSchema } from './string';
import { RecordSchema } from './record';
import { InferErrorType, ok, Schema } from './utils';
import { UnionSchema } from './union';

type OkTestcase = { item: Schema<string, any, any, any>; input: Record<string, unknown> };

const okTestcases: OkTestcase[] = [
    { item: StringSchema, input: { a: 'a' } },
    { item: NumberSchema, input: { a: 42 } },

    { item: LiteralSchema('A'), input: { a: 'A' } },
    { item: LiteralSchema('B'), input: { b: 'B' } },
    { item: LiteralSchema('A'), input: { a: 'A', b: 'A' } },

    { item: UnionSchema([LiteralSchema('A'), LiteralSchema('B')]), input: { a: 'A', b: 'B' } },
    { item: UnionSchema([LiteralSchema(1), LiteralSchema(2)]), input: { a: 1, b: 2 } },
];

it.each(okTestcases)(
    '[RecordSchema] should return status: "OK" and value: $either.value for input: $input',
    (testcase) => {
        const either = RecordSchema(testcase.item).validate(testcase.input);
        expect(either).to.eql(ok(testcase.input));
    },
);

const TestRecordSchema = RecordSchema(StringSchema);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ErrTestcase = {
    item: Schema<string, any, any, any>;
    code: InferErrorType<typeof TestRecordSchema>['code'];
    input: any;
};

const errTestcases: ErrTestcase[] = [
    { item: StringSchema, code: 'E_RECORD', input: undefined },
    { item: StringSchema, code: 'E_RECORD', input: null },
    { item: StringSchema, code: 'E_RECORD', input: true },
    { item: StringSchema, code: 'E_RECORD', input: 42 },
    { item: StringSchema, code: 'E_RECORD', input: 'abc' },
    { item: StringSchema, code: 'E_RECORD', input: [] },

    { item: LiteralSchema('A'), code: 'E_RECORD_PROPERTY', input: { a: 'C' } },
    { item: LiteralSchema('A'), code: 'E_RECORD_PROPERTY', input: { a: 'D' } },
    { item: LiteralSchema('A'), code: 'E_RECORD_PROPERTY', input: { a: 42 } },
    { item: LiteralSchema('A'), code: 'E_RECORD_PROPERTY', input: { a: true } },
    { item: LiteralSchema('A'), code: 'E_RECORD_PROPERTY', input: { a: 'A', b: 'B' } },
];

it.each(errTestcases)(
    '[RecordSchema] should return status: "ERR" and value.code: $either.code for input: $input',
    (testcase) => {
        const either = RecordSchema(testcase.item).validate(testcase.input);
        expect(either).toEqual({
            status: 'ERR',
            value: expect.objectContaining({
                code: testcase.code,
            }),
        });
    },
);
