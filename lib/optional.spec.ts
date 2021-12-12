/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import { optional } from './optional';
import { record } from './record';
import { string } from './string';

describe('optional.ts', () => {
    describe('string schema', () => {
        it("should return status: 'SUCCESS' for undefined as input", () => {
            const schema = optional(string());
            expect(schema.validate(undefined)).to.eql({
                status: 'SUCCESS',
                value: undefined,
            });
        });

        it("should return status: 'FAILURE' for null as input", () => {
            const schema = optional(string());
            expect(schema.validate(null as any)).to.eql({
                status: 'FAILURE',
                value: [
                    {
                        schema: 'string',
                        code: 'E_NOT_A_STRING',
                        message: 'provided value is not of type string',
                        details: {
                            provided: {
                                type: 'null',
                                value: null,
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
        it("should return status: 'SUCCESS' for undefined as input", () => {
            const schema = optional(record({ firstname: string() }));
            expect(schema.validate(undefined)).to.eql({
                status: 'SUCCESS',
                value: undefined,
            });
        });

        it("should return status: 'FAILURE' for null as input", () => {
            const schema = optional(record({ firstname: string() }));
            expect(schema.validate(null as any)).to.eql({
                status: 'FAILURE',
                value: {
                    errors: [
                        {
                            schema: 'record',
                            code: 'E_NOT_A_RECORD',
                            message: 'provided value is not of type record',
                            details: {
                                provided: {
                                    type: 'null',
                                    value: null,
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
