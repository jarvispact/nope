/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import { literal } from './literal';

describe('literal.ts', () => {
    describe('string literal', () => {
        it("should return status: 'SUCCESS' with the correct literal as input", () => {
            const schema = literal('A');
            expect(schema.validate('A')).to.eql({
                status: 'SUCCESS',
                value: 'A',
            });
        });

        it("should return status: 'FAILURE' with a string value that does not match the literal", () => {
            const schema = literal('A');
            expect(schema.validate('B' as any)).to.eql({
                status: 'FAILURE',
                value: {
                    schema: 'literal',
                    code: 'E_INVALID_LITERAL',
                    message: `the provided value does not match the specified literal: "A"`,
                    details: {
                        provided: {
                            type: 'string',
                            value: 'B',
                        },
                        expected: {
                            type: 'string-literal',
                            literal: 'A',
                        },
                    },
                },
            });
        });
    });

    describe('number literal', () => {
        it("should return status: 'SUCCESS' with the correct literal as input", () => {
            const schema = literal(42);
            expect(schema.validate(42)).to.eql({
                status: 'SUCCESS',
                value: 42,
            });
        });

        it("should return status: 'FAILURE' with a string value that does not match the literal", () => {
            const schema = literal(42);
            expect(schema.validate(1 as any)).to.eql({
                status: 'FAILURE',
                value: {
                    schema: 'literal',
                    code: 'E_INVALID_LITERAL',
                    message: `the provided value does not match the specified literal: "42"`,
                    details: {
                        provided: {
                            type: 'number',
                            value: 1,
                        },
                        expected: {
                            type: 'number-literal',
                            literal: 42,
                        },
                    },
                },
            });
        });
    });
});
