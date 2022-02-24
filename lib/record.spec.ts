/* eslint-disable @typescript-eslint/no-explicit-any */
import { string } from './string';
import { record } from './record';
import { tsExpect } from './test-utils';

describe.only('record.ts', () => {
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

    it("should return status: 'SUCCESS' for input of type 'record' without property definition but input has properties", () => {
        const schema = record({});

        const either = schema.validate({
            a: 'a',
        });

        if (either.status === 'FAILURE') {
            throw new Error('[TS-CHECK] should not be a failure');
        }

        tsExpect(either, {
            status: 'SUCCESS',
            value: { a: 'a' },
        });
    });

    it("should return status: 'SUCCESS' for input of type 'record' with property definition", () => {
        const schema = record({
            a: string(),
            b: string(),
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

    // it("should return status: 'FAILURE' for input of type 'string'", () => {
    //     const schema = array(string());
    //     const either = schema.validate('42' as any);

    //     if (either.status === 'SUCCESS') {
    //         throw new Error('[TS-CHECK] should not be a success');
    //     }

    //     tsExpect(either, {
    //         status: 'FAILURE',
    //         value: {
    //             error: {
    //                 uri: 'array',
    //                 code: 'E_NO_ARRAY',
    //                 message: 'input is not of type: "array"',
    //                 details: {
    //                     expectedType: 'array',
    //                     providedType: 'string',
    //                     providedNativeType: 'string',
    //                     providedValue: '42',
    //                 },
    //             },
    //             items: [],
    //         },
    //     });
    // });

    // it("should return status: 'FAILURE' for input of type 'number'", () => {
    //     const schema = array(string());
    //     const either = schema.validate(42 as any);

    //     if (either.status === 'SUCCESS') {
    //         throw new Error('[TS-CHECK] should not be a success');
    //     }

    //     tsExpect(either, {
    //         status: 'FAILURE',
    //         value: {
    //             error: {
    //                 uri: 'array',
    //                 code: 'E_NO_ARRAY',
    //                 message: 'input is not of type: "array"',
    //                 details: {
    //                     expectedType: 'array',
    //                     providedType: 'number',
    //                     providedNativeType: 'number',
    //                     providedValue: 42,
    //                 },
    //             },
    //             items: [],
    //         },
    //     });
    // });

    // it("should return status: 'FAILURE' if all items are of type 'number'", () => {
    //     const schema = array(string());
    //     const either = schema.validate([42, 43] as any);

    //     if (either.status === 'SUCCESS') {
    //         throw new Error('[TS-CHECK] should not be a success');
    //     }

    //     tsExpect(either.status, 'FAILURE');
    //     tsExpect(either.value.error, null);

    //     const firstItem = either.value.items[0];
    //     if (firstItem.status === 'SUCCESS') {
    //         throw new Error('[TS-CHECK] should not be a success');
    //     }

    //     tsExpect(firstItem.value, {
    //         uri: 'string',
    //         code: 'E_NO_STRING',
    //         message: 'input is not of type: "string"',
    //         details: {
    //             expectedType: 'string',
    //             providedType: 'number',
    //             providedNativeType: 'number',
    //             providedValue: 42,
    //         },
    //     });

    //     const secondItem = either.value.items[1];
    //     if (secondItem.status === 'SUCCESS') {
    //         throw new Error('[TS-CHECK] should not be a success');
    //     }

    //     tsExpect(secondItem.value, {
    //         uri: 'string',
    //         code: 'E_NO_STRING',
    //         message: 'input is not of type: "string"',
    //         details: {
    //             expectedType: 'string',
    //             providedType: 'number',
    //             providedNativeType: 'number',
    //             providedValue: 43,
    //         },
    //     });
    // });

    // it("should return status: 'FAILURE' if 1 item is of type 'number'", () => {
    //     const schema = array(string());
    //     const either = schema.validate(['42', 43] as any);

    //     if (either.status === 'SUCCESS') {
    //         throw new Error('[TS-CHECK] should not be a success');
    //     }

    //     tsExpect(either.status, 'FAILURE');
    //     tsExpect(either.value.error, null);

    //     const firstItem = either.value.items[0];
    //     if (firstItem.status === 'FAILURE') {
    //         throw new Error('[TS-CHECK] should not be a failure');
    //     }

    //     tsExpect(firstItem.value, '42');

    //     const secondItem = either.value.items[1];
    //     if (secondItem.status === 'SUCCESS') {
    //         throw new Error('[TS-CHECK] should not be a success');
    //     }

    //     tsExpect(secondItem.value, {
    //         uri: 'string',
    //         code: 'E_NO_STRING',
    //         message: 'input is not of type: "string"',
    //         details: {
    //             expectedType: 'string',
    //             providedType: 'number',
    //             providedNativeType: 'number',
    //             providedValue: 43,
    //         },
    //     });
    // });
});
