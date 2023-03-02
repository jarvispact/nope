/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, it } from 'vitest';
import { NumberSchema } from './number';
import { ObjectSchema, ObjectValidationOptions } from './object';
import { StringSchema } from './string';
import { InferErrorType, ok } from './utils';

const testShape = { a: StringSchema, b: NumberSchema };

type OkTestcase = { input: any; options?: ObjectValidationOptions };

const okTestcases: OkTestcase[] = [
    { input: { a: '', b: 0 } },
    { input: { a: 'a', b: 42 } },
    { input: { a: 'abc', b: -42 } },
    { input: { a: 'abc', b: -42, c: true }, options: { failOnAdditionalProperties: false } },
];

it.each(okTestcases)(
    '[ObjectSchema] should return status: "OK" and value: $either.value for input: $input',
    (testcase) => {
        const TestObjectSchema = ObjectSchema({ a: StringSchema, b: NumberSchema }, testcase.options);
        const either = TestObjectSchema.validate(testcase.input);
        expect(either).to.eql(ok(testcase.input));
    },
);

const TestObjectSchema = ObjectSchema(testShape);
type ErrTestcase = { input: any; code: InferErrorType<typeof TestObjectSchema>['code'] };

const errTestcases: ErrTestcase[] = [
    { input: undefined, code: 'E_OBJECT' },
    { input: null, code: 'E_OBJECT' },
    { input: 42, code: 'E_OBJECT' },
    { input: true, code: 'E_OBJECT' },
    { input: 'abc', code: 'E_OBJECT' },
    { input: [], code: 'E_OBJECT' },
    { input: new Date(), code: 'E_OBJECT' },

    { input: {}, code: 'E_OBJECT_MISSING_KEYS' },
    { input: { a: 'a' }, code: 'E_OBJECT_MISSING_KEYS' },
    { input: { a: 'a', c: 'c' }, code: 'E_OBJECT_MISSING_KEYS' },

    { input: { a: 'a', b: 42, c: 'c' }, code: 'E_OBJECT_ADDITIONAL_KEYS' },

    { input: { a: 'a', b: 'b' }, code: 'E_OBJECT_PROPERTY' },
];

it.each(errTestcases)(
    '[ObjectSchema] should return status: "ERR" and value.code: $code for input: $input',
    (testcase) => {
        const either = TestObjectSchema.validate(testcase.input);
        expect(either).toEqual({
            status: 'ERR',
            value: expect.objectContaining({
                code: testcase.code,
            }),
        });
    },
);

it('[ObjectSchema] should cascade errors from nested object schema', () => {
    const TestSchema = ObjectSchema({
        a: StringSchema,
        b: ObjectSchema({
            c: ObjectSchema({
                d: NumberSchema,
            }),
        }),
    });

    const either = TestSchema.validate({
        a: '',
        b: {
            c: {
                d: '42' as any,
            },
        },
    });

    expect(either).toEqual({
        status: 'ERR',
        value: expect.objectContaining({
            code: 'E_OBJECT_PROPERTY',
            details: expect.objectContaining({
                properties: {
                    a: ok(''),
                    b: expect.objectContaining({
                        status: 'ERR',
                        value: expect.objectContaining({
                            code: 'E_OBJECT_PROPERTY',
                            details: expect.objectContaining({
                                properties: {
                                    c: expect.objectContaining({
                                        status: 'ERR',
                                        value: expect.objectContaining({
                                            code: 'E_OBJECT_PROPERTY',
                                            details: expect.objectContaining({
                                                properties: {
                                                    d: expect.objectContaining({
                                                        status: 'ERR',
                                                        value: expect.objectContaining({
                                                            code: 'E_NUMBER',
                                                        }),
                                                    }),
                                                },
                                            }),
                                        }),
                                    }),
                                },
                            }),
                        }),
                    }),
                },
            }),
        }),
    });
});
