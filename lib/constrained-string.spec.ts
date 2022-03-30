/* eslint-disable @typescript-eslint/no-explicit-any */
import { constrainedString } from './constrained-string';
import { tsExpect } from './test-utils';

describe('constrained-string.ts', () => {
    describe('without constraints', () => {
        const withoutConstraints = constrainedString();

        it("should return status: 'SUCCESS' with a valid input", () => {
            const either = withoutConstraints.validate('test');

            if (either.status === 'FAILURE') {
                throw new Error('[TS-CHECK] should not be a failure');
            }

            tsExpect(either, {
                status: 'SUCCESS',
                value: withoutConstraints.create('test'),
            });
        });

        it("should return status: 'FAILURE' and code: 'E_NO_DATE_STRING' with a invalid date-string input", () => {
            const input = 42 as any;
            const either = withoutConstraints.validate(input);

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
                ],
            });
        });
    });

    describe('with minLength constraint', () => {
        const minLengthString = constrainedString({ minLength: 3 });

        it("should return status: 'SUCCESS' with a valid input", () => {
            const either = minLengthString.validate('test');

            if (either.status === 'FAILURE') {
                throw new Error('[TS-CHECK] should not be a failure');
            }

            tsExpect(either, {
                status: 'SUCCESS',
                value: minLengthString.create('test'),
            });
        });

        it("should return status: 'SUCCESS' with a valid input, matching exactly the minLength", () => {
            const either = minLengthString.validate('tes');

            if (either.status === 'FAILURE') {
                throw new Error('[TS-CHECK] should not be a failure');
            }

            tsExpect(either, {
                status: 'SUCCESS',
                value: minLengthString.create('tes'),
            });
        });

        it("should return status: 'FAILURE' and code: 'E_CONSTRAINED_STRING_MIN_LENGTH' with a too short string input", () => {
            const input = 'te';
            const either = minLengthString.validate(input);

            if (either.status === 'SUCCESS') {
                throw new Error('[TS-CHECK] should not be a success');
            }

            tsExpect(either, {
                status: 'FAILURE',
                value: [
                    {
                        uri: 'constrained-string',
                        code: 'E_CONSTRAINED_STRING_MIN_LENGTH',
                        message:
                            'input does not satisfy constraint. minLength: "3"',
                        details: {
                            expectedType: 'constrained-string',
                            providedType: 'string',
                            providedNativeType: 'string',
                            providedValue: input,
                        },
                    },
                ],
            });
        });

        it("should return status: 'FAILURE' and code: 'E_NO_STRING' with a number input", () => {
            const input = 42 as any;
            const either = minLengthString.validate(input);

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
                ],
            });
        });
    });

    describe('with maxLength constraint', () => {
        const maxLengthString = constrainedString({ maxLength: 3 });

        it("should return status: 'SUCCESS' with a valid input", () => {
            const either = maxLengthString.validate('te');

            if (either.status === 'FAILURE') {
                throw new Error('[TS-CHECK] should not be a failure');
            }

            tsExpect(either, {
                status: 'SUCCESS',
                value: maxLengthString.create('te'),
            });
        });

        it("should return status: 'SUCCESS' with a valid input, matching exactly the maxLength", () => {
            const either = maxLengthString.validate('tes');

            if (either.status === 'FAILURE') {
                throw new Error('[TS-CHECK] should not be a failure');
            }

            tsExpect(either, {
                status: 'SUCCESS',
                value: maxLengthString.create('tes'),
            });
        });

        it("should return status: 'FAILURE' and code: 'E_CONSTRAINED_STRING_MIN_LENGTH' with a too long string input", () => {
            const input = 'test';
            const either = maxLengthString.validate(input);

            if (either.status === 'SUCCESS') {
                throw new Error('[TS-CHECK] should not be a success');
            }

            tsExpect(either, {
                status: 'FAILURE',
                value: [
                    {
                        uri: 'constrained-string',
                        code: 'E_CONSTRAINED_STRING_MAX_LENGTH',
                        message:
                            'input does not satisfy constraint. maxLength: "3"',
                        details: {
                            expectedType: 'constrained-string',
                            providedType: 'string',
                            providedNativeType: 'string',
                            providedValue: input,
                        },
                    },
                ],
            });
        });

        it("should return status: 'FAILURE' and code: 'E_NO_STRING' with a number input", () => {
            const input = 42 as any;
            const either = maxLengthString.validate(input);

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
                ],
            });
        });
    });

    describe('with includes constraint', () => {
        const includesString = constrainedString({ includes: 't' });

        it("should return status: 'SUCCESS' with a valid input", () => {
            const either = includesString.validate('te');

            if (either.status === 'FAILURE') {
                throw new Error('[TS-CHECK] should not be a failure');
            }

            tsExpect(either, {
                status: 'SUCCESS',
                value: includesString.create('te'),
            });
        });

        it("should return status: 'SUCCESS' with a valid input, matching exactly the includes", () => {
            const either = includesString.validate('t');

            if (either.status === 'FAILURE') {
                throw new Error('[TS-CHECK] should not be a failure');
            }

            tsExpect(either, {
                status: 'SUCCESS',
                value: includesString.create('t'),
            });
        });

        it("should return status: 'FAILURE' and code: 'E_CONSTRAINED_STRING_MIN_LENGTH' with a too long string input", () => {
            const input = 'hello';
            const either = includesString.validate(input);

            if (either.status === 'SUCCESS') {
                throw new Error('[TS-CHECK] should not be a success');
            }

            tsExpect(either, {
                status: 'FAILURE',
                value: [
                    {
                        uri: 'constrained-string',
                        code: 'E_CONSTRAINED_STRING_INCLUDES',
                        message:
                            'input does not satisfy constraint. includes: "t"',
                        details: {
                            expectedType: 'constrained-string',
                            providedType: 'string',
                            providedNativeType: 'string',
                            providedValue: input,
                        },
                    },
                ],
            });
        });

        it("should return status: 'FAILURE' and code: 'E_NO_STRING' with a number input", () => {
            const input = 42 as any;
            const either = includesString.validate(input);

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
                ],
            });
        });
    });

    describe('with matches constraint', () => {
        const matchesString = constrainedString({ matches: /^t.*/ });

        it("should return status: 'SUCCESS' with a valid input", () => {
            const either = matchesString.validate('te');

            if (either.status === 'FAILURE') {
                throw new Error('[TS-CHECK] should not be a failure');
            }

            tsExpect(either, {
                status: 'SUCCESS',
                value: matchesString.create('te'),
            });
        });

        it("should return status: 'SUCCESS' with a valid input, matching exactly the matches", () => {
            const either = matchesString.validate('t');

            if (either.status === 'FAILURE') {
                throw new Error('[TS-CHECK] should not be a failure');
            }

            tsExpect(either, {
                status: 'SUCCESS',
                value: matchesString.create('t'),
            });
        });

        it("should return status: 'FAILURE' and code: 'E_CONSTRAINED_STRING_MATCHES' with a non matching string input", () => {
            const input = 'hello';
            const either = matchesString.validate(input);

            if (either.status === 'SUCCESS') {
                throw new Error('[TS-CHECK] should not be a success');
            }

            tsExpect(either, {
                status: 'FAILURE',
                value: [
                    {
                        uri: 'constrained-string',
                        code: 'E_CONSTRAINED_STRING_MATCHES',
                        message:
                            'input does not satisfy constraint. regex match: "^t.*"',
                        details: {
                            expectedType: 'constrained-string',
                            providedType: 'string',
                            providedNativeType: 'string',
                            providedValue: input,
                        },
                    },
                ],
            });
        });

        it("should return status: 'FAILURE' and code: 'E_NO_STRING' with a number input", () => {
            const input = 42 as any;
            const either = matchesString.validate(input);

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
                ],
            });
        });
    });

    describe('combined constraints', () => {
        const password = constrainedString({
            minLength: 8,
            matches: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/,
        });

        it("should return status: 'SUCCESS' with a valid input", () => {
            const either = password.validate('012abcDEF');

            if (either.status === 'FAILURE') {
                throw new Error('[TS-CHECK] should not be a failure');
            }

            tsExpect(either, {
                status: 'SUCCESS',
                value: password.create('012abcDEF'),
            });
        });

        it("should return status: 'FAILURE' and codes: ['E_CONSTRAINED_STRING_MATCHES', 'E_CONSTRAINED_STRING_MIN_LENGTH'] with a invalid password", () => {
            const input = 'hello';
            const either = password.validate(input);

            if (either.status === 'SUCCESS') {
                throw new Error('[TS-CHECK] should not be a success');
            }

            tsExpect(either, {
                status: 'FAILURE',
                value: [
                    {
                        uri: 'constrained-string',
                        code: 'E_CONSTRAINED_STRING_MIN_LENGTH',
                        message:
                            'input does not satisfy constraint. minLength: "8"',
                        details: {
                            expectedType: 'constrained-string',
                            providedType: 'string',
                            providedNativeType: 'string',
                            providedValue: input,
                        },
                    },
                    {
                        uri: 'constrained-string',
                        code: 'E_CONSTRAINED_STRING_MATCHES',
                        message:
                            'input does not satisfy constraint. regex match: "^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])"',
                        details: {
                            expectedType: 'constrained-string',
                            providedType: 'string',
                            providedNativeType: 'string',
                            providedValue: input,
                        },
                    },
                ],
            });
        });
    });
});
