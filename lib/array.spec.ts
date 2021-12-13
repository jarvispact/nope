/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import { array, arrayConstraint } from './array';
import { literal } from './literal';
import { record } from './record';
import { string } from './string';

describe('array.ts', () => {
    describe('without constraints', () => {
        describe('string items', () => {
            it("should return status: 'SUCCESS' with a valid input", () => {
                const schema = array(string());
                expect(schema.validate(['1'])).to.eql({
                    status: 'SUCCESS',
                    value: ['1'],
                });
            });

            it("should return status: 'FAILURE' with a invalid input type", () => {
                const schema = array(string());
                expect(schema.validate({} as any)).to.eql({
                    status: 'FAILURE',
                    value: {
                        errors: [
                            {
                                schema: 'array',
                                code: 'E_NOT_A_ARRAY',
                                message:
                                    'provided value is not of type: "array"',
                                details: {
                                    provided: {
                                        type: 'record',
                                        value: {},
                                    },
                                    expected: {
                                        type: 'array',
                                    },
                                },
                            },
                        ],
                        items: [],
                    },
                });
            });

            it("should return status: 'FAILURE' with a invalid item input type", () => {
                const schema = array(string());
                expect(schema.validate([1] as any)).to.eql({
                    status: 'FAILURE',
                    value: {
                        errors: [],
                        items: [
                            {
                                status: 'FAILURE',
                                value: [
                                    {
                                        schema: 'string',
                                        code: 'E_NOT_A_STRING',
                                        message:
                                            'provided value is not of type: "string"',
                                        details: {
                                            provided: {
                                                type: 'number',
                                                value: 1,
                                            },
                                            expected: {
                                                type: 'string',
                                            },
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                });
            });

            it("should return status: 'FAILURE' with a invalid item input type on second index", () => {
                const schema = array(string());
                expect(schema.validate(['1', 1] as any)).to.eql({
                    status: 'FAILURE',
                    value: {
                        errors: [],
                        items: [
                            {
                                status: 'SUCCESS',
                                value: '1',
                            },
                            {
                                status: 'FAILURE',
                                value: [
                                    {
                                        schema: 'string',
                                        code: 'E_NOT_A_STRING',
                                        message:
                                            'provided value is not of type: "string"',
                                        details: {
                                            provided: {
                                                type: 'number',
                                                value: 1,
                                            },
                                            expected: {
                                                type: 'string',
                                            },
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                });
            });
        });

        describe('literal items', () => {
            it("should return status: 'SUCCESS' with a valid input", () => {
                const schema = array(literal('42'));
                expect(schema.validate(['42'])).to.eql({
                    status: 'SUCCESS',
                    value: ['42'],
                });
            });

            it("should return status: 'FAILURE' with a invalid input type", () => {
                const schema = array(literal('42'));
                expect(schema.validate({} as any)).to.eql({
                    status: 'FAILURE',
                    value: {
                        errors: [
                            {
                                schema: 'array',
                                code: 'E_NOT_A_ARRAY',
                                message:
                                    'provided value is not of type: "array"',
                                details: {
                                    provided: {
                                        type: 'record',
                                        value: {},
                                    },
                                    expected: {
                                        type: 'array',
                                    },
                                },
                            },
                        ],
                        items: [],
                    },
                });
            });

            it("should return status: 'FAILURE' with a invalid item input type", () => {
                const schema = array(literal('42'));
                expect(schema.validate([1] as any)).to.eql({
                    status: 'FAILURE',
                    value: {
                        errors: [],
                        items: [
                            {
                                status: 'FAILURE',
                                value: {
                                    schema: 'literal',
                                    code: 'E_INVALID_LITERAL',
                                    message:
                                        'provided value is not of type: "literal(42)"',
                                    details: {
                                        provided: {
                                            type: 'number',
                                            value: 1,
                                        },
                                        expected: {
                                            type: 'string-literal',
                                            literal: '42',
                                        },
                                    },
                                },
                            },
                        ],
                    },
                });
            });

            it("should return status: 'FAILURE' with a invalid item input type on second index", () => {
                const schema = array(literal('42'));
                expect(schema.validate(['42', 1] as any)).to.eql({
                    status: 'FAILURE',
                    value: {
                        errors: [],
                        items: [
                            {
                                status: 'SUCCESS',
                                value: '42',
                            },
                            {
                                status: 'FAILURE',
                                value: {
                                    schema: 'literal',
                                    code: 'E_INVALID_LITERAL',
                                    message:
                                        'provided value is not of type: "literal(42)"',
                                    details: {
                                        provided: {
                                            type: 'number',
                                            value: 1,
                                        },
                                        expected: {
                                            type: 'string-literal',
                                            literal: '42',
                                        },
                                    },
                                },
                            },
                        ],
                    },
                });
            });
        });

        describe('record items', () => {
            it("should return status: 'SUCCESS' with a valid input", () => {
                const schema = array(record({ foo: string() }));
                expect(schema.validate([{ foo: '' }])).to.eql({
                    status: 'SUCCESS',
                    value: [{ foo: '' }],
                });
            });

            it("should return status: 'FAILURE' with a invalid input type", () => {
                const schema = array(record({ foo: string() }));
                expect(schema.validate({} as any)).to.eql({
                    status: 'FAILURE',
                    value: {
                        errors: [
                            {
                                schema: 'array',
                                code: 'E_NOT_A_ARRAY',
                                message:
                                    'provided value is not of type: "array"',
                                details: {
                                    provided: {
                                        type: 'record',
                                        value: {},
                                    },
                                    expected: {
                                        type: 'array',
                                    },
                                },
                            },
                        ],
                        items: [],
                    },
                });
            });

            it("should return status: 'FAILURE' with a invalid item input type", () => {
                const schema = array(record({ foo: string() }));
                expect(schema.validate([1] as any)).to.eql({
                    status: 'FAILURE',
                    value: {
                        errors: [],
                        items: [
                            {
                                status: 'FAILURE',
                                value: {
                                    errors: [
                                        {
                                            schema: 'record',
                                            code: 'E_NOT_A_RECORD',
                                            message:
                                                'provided value is not of type: "record"',
                                            details: {
                                                provided: {
                                                    type: 'number',
                                                    value: 1,
                                                },
                                                expected: {
                                                    type: 'record',
                                                    keys: ['foo'],
                                                },
                                            },
                                        },
                                    ],
                                    properties: {},
                                },
                            },
                        ],
                    },
                });
            });

            it("should return status: 'FAILURE' with a invalid item input type on second index", () => {
                const schema = array(record({ foo: string() }));
                expect(schema.validate([{ foo: '' }, 1] as any)).to.eql({
                    status: 'FAILURE',
                    value: {
                        errors: [],
                        items: [
                            {
                                status: 'SUCCESS',
                                value: {
                                    foo: '',
                                },
                            },
                            {
                                status: 'FAILURE',
                                value: {
                                    errors: [
                                        {
                                            schema: 'record',
                                            code: 'E_NOT_A_RECORD',
                                            message:
                                                'provided value is not of type: "record"',
                                            details: {
                                                provided: {
                                                    type: 'number',
                                                    value: 1,
                                                },
                                                expected: {
                                                    type: 'record',
                                                    keys: ['foo'],
                                                },
                                            },
                                        },
                                    ],
                                    properties: {},
                                },
                            },
                        ],
                    },
                });
            });

            it("should return status: 'FAILURE' with a invalid item input type on nested record property", () => {
                const schema = array(record({ foo: string() }));
                expect(schema.validate([{ foo: 1 }] as any)).to.eql({
                    status: 'FAILURE',
                    value: {
                        errors: [],
                        items: [
                            {
                                status: 'FAILURE',
                                value: {
                                    errors: [],
                                    properties: {
                                        foo: {
                                            status: 'FAILURE',
                                            value: [
                                                {
                                                    schema: 'string',
                                                    code: 'E_NOT_A_STRING',
                                                    message:
                                                        'provided value is not of type: "string"',
                                                    details: {
                                                        provided: {
                                                            type: 'number',
                                                            value: 1,
                                                        },
                                                        expected: {
                                                            type: 'string',
                                                        },
                                                    },
                                                },
                                            ],
                                        },
                                    },
                                },
                            },
                        ],
                    },
                });
            });
        });
    });

    describe('constraints argument validation', () => {
        it('should throw an error if a empty constraints array was passed', () => {
            expect(() => array(string(), [])).to.throw(
                /array\(\) was called with an empty constraints array. provide at least 1 constraint or call array\(\) without array argument\./,
            );
        });
    });

    describe('minLengthConstraint', () => {
        const minLengthConstraint = (minLength: number) =>
            arrayConstraint({
                when: (input) => input.length < minLength,
                error: () => ({
                    code: 'E_MIN_ARRAY_LENGTH',
                    message: `provided array is shorter than the specified minLength: "${minLength}"`,
                    details: {
                        expected: {
                            type: 'array',
                            minLength,
                        },
                    },
                }),
            });

        it("should return status: 'SUCCESS' with a valid input", () => {
            const schema = array(string(), [minLengthConstraint(2)]);
            expect(schema.validate(['1', '2'])).to.eql({
                status: 'SUCCESS',
                value: ['1', '2'],
            });
        });

        it("should return status: 'FAILURE' with a invalid item input type", () => {
            const schema = array(string(), [minLengthConstraint(2)]);
            expect(schema.validate([1] as any)).to.eql({
                status: 'FAILURE',
                value: {
                    errors: [
                        {
                            schema: 'array',
                            code: 'E_MIN_ARRAY_LENGTH',
                            message: `provided array is shorter than the specified minLength: "2"`,
                            details: {
                                provided: {
                                    type: 'array',
                                    value: [1],
                                },
                                constraint: {
                                    expected: {
                                        type: 'array',
                                        minLength: 2,
                                    },
                                },
                            },
                        },
                    ],
                    items: [
                        {
                            status: 'FAILURE',
                            value: [
                                {
                                    schema: 'string',
                                    code: 'E_NOT_A_STRING',
                                    message:
                                        'provided value is not of type: "string"',
                                    details: {
                                        provided: {
                                            type: 'number',
                                            value: 1,
                                        },
                                        expected: {
                                            type: 'string',
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                },
            });
        });

        it("should return status: 'FAILURE' with a invalid item input type on second index", () => {
            const schema = array(string(), [minLengthConstraint(3)]);
            expect(schema.validate(['1', 2] as any)).to.eql({
                status: 'FAILURE',
                value: {
                    errors: [
                        {
                            schema: 'array',
                            code: 'E_MIN_ARRAY_LENGTH',
                            message: `provided array is shorter than the specified minLength: "3"`,
                            details: {
                                provided: {
                                    type: 'array',
                                    value: ['1', 2],
                                },
                                constraint: {
                                    expected: {
                                        type: 'array',
                                        minLength: 3,
                                    },
                                },
                            },
                        },
                    ],
                    items: [
                        {
                            status: 'SUCCESS',
                            value: '1',
                        },
                        {
                            status: 'FAILURE',
                            value: [
                                {
                                    schema: 'string',
                                    code: 'E_NOT_A_STRING',
                                    message:
                                        'provided value is not of type: "string"',
                                    details: {
                                        provided: {
                                            type: 'number',
                                            value: 2,
                                        },
                                        expected: {
                                            type: 'string',
                                        },
                                    },
                                },
                            ],
                        },
                    ],
                },
            });
        });
    });
});
