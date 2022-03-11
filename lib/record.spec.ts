/* eslint-disable @typescript-eslint/no-explicit-any */
import { string } from './string';
import { record } from './record';
import { tsExpect } from './test-utils';

describe('record.ts', () => {
    it("should return status: 'SUCCESS' for input of type 'record' without property definition and no input properties", () => {
        const schema = record({});

        const either = schema.validate({});

        if (either.status === 'FAILURE') {
            throw new Error('[TS-CHECK] should not be a failure');
        }

        tsExpect(either, {
            status: 'SUCCESS',
            value: {},
        });
    });

    it("should return status: 'SUCCESS' for input of type 'record' with property definition", () => {
        const schema = record({
            a: string,
            b: string,
        });

        const either = schema.validate({
            a: 'a',
            b: 'b',
        });

        if (either.status === 'FAILURE') {
            throw new Error('[TS-CHECK] should not be a failure');
        }

        tsExpect(either, {
            status: 'SUCCESS',
            value: {
                a: 'a',
                b: 'b',
            },
        });
    });

    it("should return status: 'FAILURE' for input of type 'string'", () => {
        const schema = record({
            a: string,
            b: string,
        });

        const either = schema.validate('42' as any);

        if (either.status === 'SUCCESS') {
            throw new Error('[TS-CHECK] should not be a success');
        }

        tsExpect(either.value, {
            error: {
                uri: 'record',
                code: 'E_NO_RECORD',
                message: 'input is not of type: "record"',
                details: {
                    expectedType: 'record',
                    providedType: 'string',
                    providedNativeType: 'string',
                    providedValue: '42',
                },
            },
            properties: null,
        });
    });

    it("should return status: 'FAILURE' for input of type 'number'", () => {
        const schema = record({
            a: string,
            b: string,
        });

        const either = schema.validate(42 as any);

        if (either.status === 'SUCCESS') {
            throw new Error('[TS-CHECK] should not be a success');
        }

        tsExpect(either.value, {
            error: {
                uri: 'record',
                code: 'E_NO_RECORD',
                message: 'input is not of type: "record"',
                details: {
                    expectedType: 'record',
                    providedType: 'number',
                    providedNativeType: 'number',
                    providedValue: 42,
                },
            },
            properties: null,
        });
    });

    it("should return status: 'FAILURE' for input of type 'record' but properties are missing on the input", () => {
        const schema = record({
            a: string,
            b: string,
        });

        const either = schema.validate({ a: 'a' } as any);

        if (either.status === 'SUCCESS') {
            throw new Error('[TS-CHECK] should not be a success');
        }

        tsExpect(either.value, {
            error: {
                uri: 'record',
                code: 'E_MISSING_RECORD_PROPERTIES',
                message: 'input is missing record properties',
                details: {
                    expectedType: 'record',
                    providedType: 'record',
                    providedNativeType: 'object',
                    providedValue: { a: 'a' },
                    requiredProperties: ['a', 'b'],
                },
            },
            properties: null,
        });
    });

    it("should return status: 'FAILURE' for input of type 'record' but too many properties are on the input", () => {
        const schema = record({
            a: string,
            b: string,
        });

        const either = schema.validate({ a: 'a', b: 'b', c: 'c' } as any);

        if (either.status === 'SUCCESS') {
            throw new Error('[TS-CHECK] should not be a success');
        }

        tsExpect(either.value, {
            error: {
                uri: 'record',
                code: 'E_UNEXPECTED_RECORD_PROPERTIES',
                message: 'input has unexpected record properties',
                details: {
                    expectedType: 'record',
                    providedType: 'record',
                    providedNativeType: 'object',
                    providedValue: { a: 'a', b: 'b', c: 'c' },
                    requiredProperties: ['a', 'b'],
                },
            },
            properties: null,
        });
    });

    it("should return status: 'FAILURE' for input of type 'record' when 1 property is not valid", () => {
        const schema = record({
            a: string,
            b: string,
        });

        const either = schema.validate({ a: 'a', b: 42 } as any);

        if (either.status === 'SUCCESS') {
            throw new Error('[TS-CHECK] should not be a success');
        }

        tsExpect(either.value, {
            error: null,
            properties: {
                a: {
                    status: 'SUCCESS',
                    value: 'a',
                },
                b: {
                    status: 'FAILURE',
                    value: {
                        uri: 'string',
                        code: 'E_NO_STRING',
                        message: 'input is not of type: "string"',
                        details: {
                            expectedType: 'string',
                            providedType: 'number',
                            providedNativeType: 'number',
                            providedValue: 42,
                        },
                    },
                },
            },
        });
    });

    it("should return status: 'FAILURE' for input of type 'record' when 1 nested record property is not valid", () => {
        const schema = record({
            a: string,
            b: record({
                c: string,
                d: string,
            }),
        });

        const either = schema.validate({ a: 'a', b: { c: 'c', d: 42 } } as any);

        if (either.status === 'SUCCESS') {
            throw new Error('[TS-CHECK] should not be a success');
        }

        tsExpect(either.value, {
            error: null,
            properties: {
                a: {
                    status: 'SUCCESS',
                    value: 'a',
                },
                b: {
                    status: 'FAILURE',
                    value: {
                        error: null,
                        properties: {
                            c: {
                                status: 'SUCCESS',
                                value: 'c',
                            },
                            d: {
                                status: 'FAILURE',
                                value: {
                                    uri: 'string',
                                    code: 'E_NO_STRING',
                                    message: 'input is not of type: "string"',
                                    details: {
                                        expectedType: 'string',
                                        providedType: 'number',
                                        providedNativeType: 'number',
                                        providedValue: 42,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    });
});
