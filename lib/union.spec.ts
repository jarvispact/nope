/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import { literal } from './literal';
import { number } from './number';
import { record } from './record';
import { string } from './string';
import { union } from './union';

describe('union.ts', () => {
    describe('union of literals', () => {
        it("should return status: 'SUCCESS' with a value from the union", () => {
            const schema = union([string(), number()]);
            expect(schema.validate('')).to.eql({
                status: 'SUCCESS',
                value: '',
            });
        });

        it("should return status: 'FAILURE' with a value outside the union", () => {
            const schema = union([string(), number()]);
            expect(schema.validate(true as any)).to.eql({
                status: 'FAILURE',
                value: {
                    schema: 'union',
                    code: 'E_NOT_IN_UNION',
                    message: 'provided value is not in union',
                    details: {
                        provided: {
                            type: 'boolean',
                            value: true,
                        },
                        expected: {
                            type: 'union',
                            union: ['string', 'number'],
                        },
                    },
                },
            });
        });
    });

    describe('union of literals', () => {
        it("should return status: 'SUCCESS' with a value from the union", () => {
            const schema = union([literal('A'), literal('B'), literal('C')]);
            expect(schema.validate('B')).to.eql({
                status: 'SUCCESS',
                value: 'B',
            });
        });

        it("should return status: 'FAILURE' with a value outside the union", () => {
            const schema = union([literal('A'), literal('B'), literal('C')]);
            expect(schema.validate('D' as any)).to.eql({
                status: 'FAILURE',
                value: {
                    schema: 'union',
                    code: 'E_NOT_IN_UNION',
                    message: 'provided value is not in union',
                    details: {
                        provided: {
                            type: 'string',
                            value: 'D',
                        },
                        expected: {
                            type: 'union',
                            union: ['A', 'B', 'C'],
                        },
                    },
                },
            });
        });
    });

    describe('union of records', () => {
        it("should return status: 'SUCCESS' with a value from the union", () => {
            const schema = union([
                record({ a: string() }),
                record({ b: string() }),
            ]);

            expect(schema.validate({ a: 'a' })).to.eql({
                status: 'SUCCESS',
                value: { a: 'a' },
            });
        });

        it("should return status: 'FAILURE' with a value outside the union", () => {
            const schema = union([
                record({ a: string() }),
                record({ b: string() }),
            ]);

            expect(schema.validate({ c: 'c' } as any)).to.eql({
                status: 'FAILURE',
                value: {
                    schema: 'union',
                    code: 'E_NOT_IN_UNION',
                    message: 'provided value is not in union',
                    details: {
                        provided: {
                            type: 'record',
                            value: { c: 'c' },
                        },
                        expected: {
                            type: 'union',
                            union: [
                                'record({"a":"string"})',
                                'record({"b":"string"})',
                            ],
                        },
                    },
                },
            });
        });
    });
});
