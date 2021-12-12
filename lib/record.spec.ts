/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import { record } from './record';
import { string } from './string';

describe('record.ts', () => {
    it("should return status: 'SUCCESS' for input of type record", () => {
        const schema = record({ firstname: string() });
        expect(schema.validate({ firstname: '' })).to.eql({
            status: 'SUCCESS',
            value: {
                firstname: '',
            },
        });
    });

    describe('record level errors', () => {
        it("should return status: 'FAILURE' for input of type array", () => {
            const schema = record({ firstname: string() });
            const input = [] as any;

            expect(schema.validate(input)).to.eql({
                status: 'FAILURE',
                value: {
                    errors: [
                        {
                            schema: 'record',
                            code: 'E_NOT_A_RECORD',
                            message: 'provided value is not of type record',
                            details: {
                                provided: {
                                    type: 'array',
                                    value: input,
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

        it("should return status: 'FAILURE' for input of type string", () => {
            const schema = record({ firstname: string() });
            const input = 'dont use any' as any;

            expect(schema.validate(input)).to.eql({
                status: 'FAILURE',
                value: {
                    errors: [
                        {
                            schema: 'record',
                            code: 'E_NOT_A_RECORD',
                            message: 'provided value is not of type record',
                            details: {
                                provided: {
                                    type: 'string',
                                    value: input,
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

        it("should return status: 'FAILURE' if provided record has missing keys", () => {
            const schema = record({
                firstname: string(),
                lastname: string(),
            });

            const input = { firstname: '' } as any;

            expect(schema.validate(input)).to.eql({
                status: 'FAILURE',
                value: {
                    errors: [
                        {
                            schema: 'record',
                            code: 'E_MISSING_KEYS',
                            message: 'provided value has missing keys',
                            details: {
                                provided: {
                                    type: 'record',
                                    value: input,
                                },
                                expected: {
                                    type: 'record',
                                    keys: ['firstname', 'lastname'],
                                },
                            },
                        },
                    ],
                    properties: {
                        firstname: {
                            status: 'SUCCESS',
                            value: '',
                        },
                        lastname: {
                            status: 'FAILURE',
                            value: [
                                {
                                    schema: 'string',
                                    code: 'E_NOT_A_STRING',
                                    message:
                                        'provided value is not of type string',
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
                        },
                    },
                },
            });
        });

        it("should return status: 'FAILURE' if provided record has too many keys", () => {
            const schema = record({
                firstname: string(),
                lastname: string(),
            });

            const input = {
                firstname: '',
                lastname: '',
                whaaat: '',
            } as any;

            expect(schema.validate(input)).to.eql({
                status: 'FAILURE',
                value: {
                    errors: [
                        {
                            schema: 'record',
                            code: 'E_TOO_MANY_KEYS',
                            message: 'provided value has too many keys',
                            details: {
                                provided: {
                                    type: 'record',
                                    value: input,
                                    keys: ['firstname', 'lastname', 'whaaat'],
                                },
                                expected: {
                                    type: 'record',
                                    keys: ['firstname', 'lastname'],
                                },
                            },
                        },
                    ],
                    properties: {
                        firstname: {
                            status: 'SUCCESS',
                            value: '',
                        },
                        lastname: {
                            status: 'SUCCESS',
                            value: '',
                        },
                    },
                },
            });
        });
    });

    describe('property level errors', () => {
        it("should return status: 'FAILURE' if a property is not valid", () => {
            const schema = record({
                firstname: string(),
                lastname: string(),
            });

            const input = {
                firstname: '',
                lastname: 1,
            } as any;

            expect(schema.validate(input)).to.eql({
                status: 'FAILURE',
                value: {
                    errors: [],
                    properties: {
                        firstname: {
                            status: 'SUCCESS',
                            value: '',
                        },
                        lastname: {
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
            });
        });

        it("should return status: 'FAILURE' if a record property is missing", () => {
            const schema = record({
                firstname: string(),
                lastname: string(),
                address: record({
                    street: string(),
                }),
            });

            const input = {
                firstname: '',
                lastname: '',
            } as any;

            expect(schema.validate(input)).to.eql({
                status: 'FAILURE',
                value: {
                    errors: [
                        {
                            schema: 'record',
                            code: 'E_MISSING_KEYS',
                            message: 'provided value has missing keys',
                            details: {
                                provided: {
                                    type: 'record',
                                    value: input,
                                },
                                expected: {
                                    type: 'record',
                                    keys: ['firstname', 'lastname', 'address'],
                                },
                            },
                        },
                    ],
                    properties: {
                        firstname: {
                            status: 'SUCCESS',
                            value: '',
                        },
                        lastname: {
                            status: 'SUCCESS',
                            value: '',
                        },
                        address: {
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
                                                type: 'undefined',
                                                value: undefined,
                                            },
                                            expected: {
                                                type: 'record',
                                                keys: ['street'],
                                            },
                                        },
                                    },
                                ],
                                properties: {},
                            },
                        },
                    },
                },
            });
        });

        it("should return status: 'FAILURE' if a record property is invalid", () => {
            const schema = record({
                firstname: string(),
                lastname: string(),
                address: record({
                    street: string(),
                }),
            });

            const input = {
                firstname: '',
                lastname: '',
                address: [],
            } as any;

            expect(schema.validate(input)).to.eql({
                status: 'FAILURE',
                value: {
                    errors: [],
                    properties: {
                        firstname: {
                            status: 'SUCCESS',
                            value: '',
                        },
                        lastname: {
                            status: 'SUCCESS',
                            value: '',
                        },
                        address: {
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
                                                type: 'array',
                                                value: [],
                                            },
                                            expected: {
                                                type: 'record',
                                                keys: ['street'],
                                            },
                                        },
                                    },
                                ],
                                properties: {},
                            },
                        },
                    },
                },
            });
        });

        it("should return status: 'FAILURE' if a nested record property is missing", () => {
            const schema = record({
                firstname: string(),
                lastname: string(),
                address: record({
                    street: string(),
                }),
            });

            const input = {
                firstname: '',
                lastname: '',
                address: {},
            } as any;

            expect(schema.validate(input)).to.eql({
                status: 'FAILURE',
                value: {
                    errors: [],
                    properties: {
                        firstname: {
                            status: 'SUCCESS',
                            value: '',
                        },
                        lastname: {
                            status: 'SUCCESS',
                            value: '',
                        },
                        address: {
                            status: 'FAILURE',
                            value: {
                                errors: [
                                    {
                                        schema: 'record',
                                        code: 'E_MISSING_KEYS',
                                        message:
                                            'provided value has missing keys',
                                        details: {
                                            provided: {
                                                type: 'record',
                                                value: input.address,
                                            },
                                            expected: {
                                                type: 'record',
                                                keys: ['street'],
                                            },
                                        },
                                    },
                                ],
                                properties: {
                                    street: {
                                        status: 'FAILURE',
                                        value: [
                                            {
                                                schema: 'string',
                                                code: 'E_NOT_A_STRING',
                                                message:
                                                    'provided value is not of type string',
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
                                    },
                                },
                            },
                        },
                    },
                },
            });
        });

        it("should return status: 'FAILURE' if a nested record property is invalid", () => {
            const schema = record({
                firstname: string(),
                lastname: string(),
                address: record({
                    street: string(),
                }),
            });

            const input = {
                firstname: '',
                lastname: '',
                address: {
                    street: 1,
                },
            } as any;

            expect(schema.validate(input)).to.eql({
                status: 'FAILURE',
                value: {
                    errors: [],
                    properties: {
                        firstname: {
                            status: 'SUCCESS',
                            value: '',
                        },
                        lastname: {
                            status: 'SUCCESS',
                            value: '',
                        },
                        address: {
                            status: 'FAILURE',
                            value: {
                                errors: [],
                                properties: {
                                    street: {
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
                    },
                },
            });
        });
    });
});
