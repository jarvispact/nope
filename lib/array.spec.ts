/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import { array } from './array';
import { literal } from './literal';
import { record } from './record';
import { string } from './string';

describe('array.ts', () => {
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
                            message: 'provided value is not of type array',
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
                                        'provided value is not of type string',
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
                                        'provided value is not of type string',
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
                            message: 'provided value is not of type array',
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
                                    'the provided value does not match the specified literal: "42"',
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
                                    'the provided value does not match the specified literal: "42"',
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
                            message: 'provided value is not of type array',
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
                                            'provided value is not of type record',
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
                                            'provided value is not of type record',
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
                                                    'provided value is not of type string',
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
