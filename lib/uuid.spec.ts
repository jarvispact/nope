/* eslint-disable @typescript-eslint/no-explicit-any */
import { uuid } from './uuid';
import { tsExpect } from './test-utils';

describe('uuid.ts', () => {
    it("should return status: 'SUCCESS' with a valid uuid input", () => {
        const either = uuid.validate('1bfeea64-43da-4ef8-a6a5-e33512d7d169');

        if (either.status === 'FAILURE') {
            throw new Error('[TS-CHECK] should not be a failure');
        }

        tsExpect(either, {
            status: 'SUCCESS',
            value: uuid.create('1bfeea64-43da-4ef8-a6a5-e33512d7d169'),
        });
    });

    it("should return status: 'SUCCESS' with a valid nil uuid input", () => {
        const either = uuid.validate('00000000-0000-0000-0000-000000000000');

        if (either.status === 'FAILURE') {
            throw new Error('[TS-CHECK] should not be a failure');
        }

        tsExpect(either, {
            status: 'SUCCESS',
            value: uuid.create('00000000-0000-0000-0000-000000000000'),
        });
    });

    it("should return status: 'FAILURE' and code: 'E_NO_UUID' with a invalid uuid input", () => {
        const either = uuid.validate('1bfeea64-43da-4ef8-a6a5-e33512d7d16');

        if (either.status === 'SUCCESS') {
            throw new Error('[TS-CHECK] should not be a success');
        }

        tsExpect(either, {
            status: 'FAILURE',
            value: [
                {
                    uri: 'uuid',
                    code: 'E_NO_UUID',
                    message: 'input is not of type: "uuid"',
                    details: {
                        expectedType: 'uuid',
                        providedType: 'string',
                        providedNativeType: 'string',
                        providedValue: '1bfeea64-43da-4ef8-a6a5-e33512d7d16',
                    },
                },
            ],
        });
    });

    it("should return status: 'FAILURE' and code: 'E_NO_UUID' with a string input", () => {
        const input = '42' as any;

        const either = uuid.validate(input);

        if (either.status === 'SUCCESS') {
            throw new Error('[TS-CHECK] should not be a success');
        }

        tsExpect(either, {
            status: 'FAILURE',
            value: [
                {
                    uri: 'uuid',
                    code: 'E_NO_UUID',
                    message: 'input is not of type: "uuid"',
                    details: {
                        expectedType: 'uuid',
                        providedType: 'string',
                        providedNativeType: 'string',
                        providedValue: input,
                    },
                },
            ],
        });
    });

    it("should return status: 'FAILURE' and codes: ['E_NO_STRING', 'E_NO_UUID'] with a number input", () => {
        const input = 42 as any;

        const either = uuid.validate(input);

        if (either.status === 'SUCCESS') {
            throw new Error('[TS-CHECK] should not be a success');
        }

        tsExpect(either, {
            status: 'FAILURE',
            value: [
                {
                    uri: 'string',
                    code: 'E_NO_STRING',
                    message: 'input is not of type: "string"',
                    details: {
                        expectedType: 'string',
                        providedType: 'number',
                        providedNativeType: 'number',
                        providedValue: input,
                    },
                },
                {
                    uri: 'uuid',
                    code: 'E_NO_UUID',
                    message: 'input is not of type: "uuid"',
                    details: {
                        expectedType: 'uuid',
                        providedType: 'number',
                        providedNativeType: 'number',
                        providedValue: input,
                    },
                },
            ],
        });
    });
});
