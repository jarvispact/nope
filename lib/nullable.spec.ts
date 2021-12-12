/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import { nullable } from './nullable';
import { record } from './record';
import { string } from './string';

describe('nullable.ts', () => {
    describe('string schema', () => {
        it("should return status: 'SUCCESS' for null as input", () => {
            const schema = nullable(string());
            expect(schema.validate(null)).to.eql({
                status: 'SUCCESS',
                value: null,
            });
        });

        it("should return status: 'FAILURE' for undefined as input", () => {
            const schema = nullable(string());
            expect(schema.validate(undefined as any)).to.eql({
                status: 'FAILURE',
                value: [
                    {
                        schema: 'string',
                        code: 'E_NOT_A_STRING',
                        message: 'provided value is not of type string',
                        details: {
                            provided: {
                                type: 'undefined',
                                value: undefined,
                            },
                            expected: {
                                type: 'string',
                            },
                        },
                    },
                ],
            });
        });
    });

    describe('record schema', () => {
        it("should return status: 'SUCCESS' for null as input", () => {
            const schema = nullable(record({ firstname: string() }));
            expect(schema.validate(null)).to.eql({
                status: 'SUCCESS',
                value: null,
            });
        });

        it("should return status: 'FAILURE' for undefined as input", () => {
            const schema = nullable(record({ firstname: string() }));
            expect(schema.validate(undefined as any)).to.eql({
                status: 'FAILURE',
                value: {
                    errors: [
                        {
                            schema: 'record',
                            code: 'E_NOT_A_RECORD',
                            message: 'provided value is not of type record',
                            details: {
                                provided: {
                                    type: 'undefined',
                                    value: undefined,
                                },
                                expected: {
                                    type: 'record',
                                    keys: ['firstname'],
                                },
                            },
                        },
                    ],
                    properties: {},
                },
            });
        });
    });
});
