/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from 'chai';
import { array } from './array';
import { date, dateConstraint } from './date';
import { literal } from './literal';
import { partial } from './partial';
import { record } from './record';
import { string, stringConstraint } from './string';
import { union } from './union';
import { isSuccess } from './utils';

describe('complex-schema', () => {
    const emailConstraint = () =>
        stringConstraint({
            when: (input) =>
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(input),
            error: (input) => ({
                code: 'E_NOT_A_EMAIL_ADDRESS',
                message: 'it is not a valid email address',
                details: {
                    provided: {
                        type: typeof input,
                        value: input,
                    },
                    expected: {
                        type: 'string',
                    },
                },
            }),
        });

    const minStringLengthConstraint = (minLength: number) =>
        stringConstraint({
            when: (input) => input.length < minLength,
            error: (input) => ({
                code: 'E_MIN_STRING_LENGTH',
                message: 'input does not have the required minimum length',
                details: {
                    provided: {
                        type: typeof input,
                        value: input,
                    },
                    expected: {
                        type: 'string',
                        minLength,
                    },
                },
            }),
        });

    const maxStringLengthConstraint = (maxLength: number) =>
        stringConstraint({
            when: (input) => input.length > maxLength,
            error: (input) => ({
                code: 'E_MAX_STRING_LENGTH',
                message: 'input exceeds the maximum length',
                details: {
                    provided: {
                        type: typeof input,
                        value: input,
                    },
                    expected: {
                        type: 'string',
                        maxLength,
                    },
                },
            }),
        });

    const minYearConstraint = (minYear: number) =>
        dateConstraint({
            when: (input) => input.getFullYear() <= minYear,
            error: (input) => ({
                code: 'E_MIN_DATE_YEAR',
                message: `provided date has a year that is before the specified minYear: "${minYear}"`,
                details: {
                    provided: {
                        type: typeof input,
                        value: input,
                    },
                    expected: {
                        type: 'date',
                        minYear,
                    },
                },
            }),
        });

    const nameMaxLengthConstraint = maxStringLengthConstraint(30);

    const emailSchema = string([emailConstraint()]);

    const passwordSchema = string([minStringLengthConstraint(8)]);

    const countrySchema = union([literal('AT'), literal('DE'), literal('CH')]);

    const languageSchema = union([literal('DE'), literal('IT'), literal('FR')]);

    const themeSchema = union([literal('light'), literal('dark')]);

    const addressSchema = record({
        street: string(),
        zip: string(),
        city: string(),
        country: countrySchema,
    });

    const schema = record({
        name: string([nameMaxLengthConstraint]),
        email: emailSchema,
        password: passwordSchema,
        birthday: date([minYearConstraint(1900)]),
        address: record({
            main: addressSchema,
            others: array(addressSchema),
        }),
        profileData: partial(
            record({
                language: languageSchema,
                theme: themeSchema,
            }),
        ),
    });

    type I = typeof schema['I'];

    it("should return status: 'SUCCESS' if the input is valid", () => {
        const input: I = {
            name: 'Bruce Wayne',
            email: 'bruce.wayne@wayne-enterprises.com',
            password: 'ironmansucks',
            birthday: new Date(),
            address: {
                main: {
                    street: '1007 Mountain Drive',
                    zip: '4242',
                    city: 'Gotham',
                    country: 'AT',
                },
                others: [],
            },
            profileData: {
                theme: 'dark',
            },
        };

        const result = schema.validate(input);

        expect(result).to.eql({
            status: 'SUCCESS',
            value: input,
        });
    });

    describe('name', () => {
        it("should return status: 'FAILURE' if name is not of type string", () => {
            const input: I = {
                name: 1 as any,
                email: 'bruce.wayne@wayne-enterprises.com',
                password: 'ironmansucks',
                birthday: new Date(),
                address: {
                    main: {
                        street: '1007 Mountain Drive',
                        zip: '4242',
                        city: 'Gotham',
                        country: 'AT',
                    },
                    others: [],
                },
                profileData: {
                    theme: 'dark',
                },
            };

            const result = schema.validate(input);
            expect(result.status).to.eql('FAILURE');

            if (isSuccess(result)) {
                throw new Error('should not be a SUCCESS');
            }

            const either = result.value.properties.name;
            if (isSuccess(either)) {
                throw new Error('should not be a SUCCESS');
            }

            const errorCodes = either.value.map((e) => e.code);

            expect(errorCodes.length).to.eql(1);
            expect(errorCodes[0] === 'E_NOT_A_STRING').to.eql(true);
        });

        it("should return status: 'FAILURE' if name exceeds the maxLength constraint", () => {
            const input: I = {
                name: 'Bruce Wayne Bruce Wayne Bruce Wayne Bruce Wayne Bruce Wayne Bruce Wayne Bruce Wayne',
                email: 'bruce.wayne@wayne-enterprises.com',
                password: 'ironmansucks',
                birthday: new Date(),
                address: {
                    main: {
                        street: '1007 Mountain Drive',
                        zip: '4242',
                        city: 'Gotham',
                        country: 'AT',
                    },
                    others: [],
                },
                profileData: {
                    theme: 'dark',
                },
            };

            const result = schema.validate(input);
            expect(result.status).to.eql('FAILURE');

            if (isSuccess(result)) {
                throw new Error('should not be a SUCCESS');
            }

            const either = result.value.properties.name;
            if (isSuccess(either)) {
                throw new Error('should not be a SUCCESS');
            }

            const errorCodes = either.value.map((e) => e.code);

            expect(errorCodes.length).to.eql(1);
            expect(errorCodes[0] === 'E_MAX_STRING_LENGTH').to.eql(true);
        });
    });

    describe('email', () => {
        it("should return status: 'FAILURE' if email is not of type string", () => {
            const input: I = {
                name: 'Bruce Wayne',
                email: true as any,
                password: 'ironmansucks',
                birthday: new Date(),
                address: {
                    main: {
                        street: '1007 Mountain Drive',
                        zip: '4242',
                        city: 'Gotham',
                        country: 'AT',
                    },
                    others: [],
                },
                profileData: {
                    theme: 'dark',
                },
            };

            const result = schema.validate(input);
            expect(result.status).to.eql('FAILURE');

            if (isSuccess(result)) {
                throw new Error('should not be a SUCCESS');
            }

            const either = result.value.properties.email;
            if (isSuccess(either)) {
                throw new Error('should not be a SUCCESS');
            }

            const errorCodes = either.value.map((e) => e.code);

            expect(errorCodes.length).to.eql(1);
            expect(errorCodes[0] === 'E_NOT_A_STRING').to.eql(true);
        });

        it("should return status: 'FAILURE' if email is not a valid email address", () => {
            const input: I = {
                name: 'Bruce Wayne',
                email: 'bruce.wayne@wayne-enterprises',
                password: 'ironmansucks',
                birthday: new Date(),
                address: {
                    main: {
                        street: '1007 Mountain Drive',
                        zip: '4242',
                        city: 'Gotham',
                        country: 'AT',
                    },
                    others: [],
                },
                profileData: {
                    theme: 'dark',
                },
            };

            const result = schema.validate(input);
            expect(result.status).to.eql('FAILURE');

            if (isSuccess(result)) {
                throw new Error('should not be a SUCCESS');
            }

            const either = result.value.properties.email;
            if (isSuccess(either)) {
                throw new Error('should not be a SUCCESS');
            }

            const errorCodes = either.value.map((e) => e.code);

            expect(errorCodes.length).to.eql(1);
            expect(errorCodes[0] === 'E_NOT_A_EMAIL_ADDRESS').to.eql(true);
        });
    });

    describe('password', () => {
        it("should return status: 'FAILURE' if password is not of type string", () => {
            const input: I = {
                name: 'Bruce Wayne',
                email: 'bruce.wayne@wayne-enterprises.com',
                password: {} as any,
                birthday: new Date(),
                address: {
                    main: {
                        street: '1007 Mountain Drive',
                        zip: '4242',
                        city: 'Gotham',
                        country: 'AT',
                    },
                    others: [],
                },
                profileData: {
                    theme: 'dark',
                },
            };

            const result = schema.validate(input);
            expect(result.status).to.eql('FAILURE');

            if (isSuccess(result)) {
                throw new Error('should not be a SUCCESS');
            }

            const either = result.value.properties.password;
            if (isSuccess(either)) {
                throw new Error('should not be a SUCCESS');
            }

            const errorCodes = either.value.map((e) => e.code);

            expect(errorCodes.length).to.eql(1);
            expect(errorCodes[0] === 'E_NOT_A_STRING').to.eql(true);
        });

        it("should return status: 'FAILURE' if password does not satisfies minLength constraint", () => {
            const input: I = {
                name: 'Bruce Wayne',
                email: 'bruce.wayne@wayne-enterprises.com',
                password: 'ironman',
                birthday: new Date(),
                address: {
                    main: {
                        street: '1007 Mountain Drive',
                        zip: '4242',
                        city: 'Gotham',
                        country: 'AT',
                    },
                    others: [],
                },
                profileData: {
                    theme: 'dark',
                },
            };

            const result = schema.validate(input);
            expect(result.status).to.eql('FAILURE');

            if (isSuccess(result)) {
                throw new Error('should not be a SUCCESS');
            }

            const either = result.value.properties.password;
            if (isSuccess(either)) {
                throw new Error('should not be a SUCCESS');
            }

            const errorCodes = either.value.map((e) => e.code);

            expect(errorCodes.length).to.eql(1);
            expect(errorCodes[0] === 'E_MIN_STRING_LENGTH').to.eql(true);
        });
    });

    describe('birthday', () => {
        it("should return status: 'FAILURE' if birthday is not of type date", () => {
            const input: I = {
                name: 1 as any,
                email: 'bruce.wayne@wayne-enterprises.com',
                password: 'ironmansucks',
                birthday: '' as any,
                address: {
                    main: {
                        street: '1007 Mountain Drive',
                        zip: '4242',
                        city: 'Gotham',
                        country: 'AT',
                    },
                    others: [],
                },
                profileData: {
                    theme: 'dark',
                },
            };

            const result = schema.validate(input);
            expect(result.status).to.eql('FAILURE');

            if (isSuccess(result)) {
                throw new Error('should not be a SUCCESS');
            }

            const either = result.value.properties.birthday;
            if (isSuccess(either)) {
                throw new Error('should not be a SUCCESS');
            }

            const errorCodes = either.value.map((e) => e.code);

            expect(errorCodes.length).to.eql(1);
            expect(errorCodes[0] === 'E_NOT_A_DATE').to.eql(true);
        });

        it("should return status: 'FAILURE' if birthday is a invalid date", () => {
            const input: I = {
                name: 1 as any,
                email: 'bruce.wayne@wayne-enterprises.com',
                password: 'ironmansucks',
                birthday: new Date('wat'),
                address: {
                    main: {
                        street: '1007 Mountain Drive',
                        zip: '4242',
                        city: 'Gotham',
                        country: 'AT',
                    },
                    others: [],
                },
                profileData: {
                    theme: 'dark',
                },
            };

            const result = schema.validate(input);
            expect(result.status).to.eql('FAILURE');

            if (isSuccess(result)) {
                throw new Error('should not be a SUCCESS');
            }

            const either = result.value.properties.birthday;
            if (isSuccess(either)) {
                throw new Error('should not be a SUCCESS');
            }

            const errorCodes = either.value.map((e) => e.code);

            expect(errorCodes.length).to.eql(1);
            expect(errorCodes[0] === 'E_INVALID_DATE').to.eql(true);
        });

        it("should return status: 'FAILURE' if birthday has a year before the specified minYear constraint", () => {
            const input: I = {
                name: 'Bruce Wayne Bruce Wayne Bruce Wayne Bruce Wayne Bruce Wayne Bruce Wayne Bruce Wayne',
                email: 'bruce.wayne@wayne-enterprises.com',
                password: 'ironmansucks',
                birthday: new Date(1800, 1, 1),
                address: {
                    main: {
                        street: '1007 Mountain Drive',
                        zip: '4242',
                        city: 'Gotham',
                        country: 'AT',
                    },
                    others: [],
                },
                profileData: {
                    theme: 'dark',
                },
            };

            const result = schema.validate(input);
            expect(result.status).to.eql('FAILURE');

            if (isSuccess(result)) {
                throw new Error('should not be a SUCCESS');
            }

            const either = result.value.properties.birthday;
            if (isSuccess(either)) {
                throw new Error('should not be a SUCCESS');
            }

            const errorCodes = either.value.map((e) => e.code);

            expect(errorCodes.length).to.eql(1);
            expect(errorCodes[0] === 'E_MIN_DATE_YEAR').to.eql(true);
        });
    });

    describe('address', () => {
        it("should return status: 'FAILURE' if address is not of type record", () => {
            const input: I = {
                name: 'Bruce Wayne',
                email: 'bruce.wayne@wayne-enterprises.com',
                password: 'ironmansucks',
                birthday: new Date(),
                address: [] as any,
                profileData: {
                    theme: 'dark',
                },
            };

            const result = schema.validate(input);
            expect(result.status).to.eql('FAILURE');

            if (isSuccess(result)) {
                throw new Error('should not be a SUCCESS');
            }

            const either = result.value.properties.address;
            if (isSuccess(either)) {
                throw new Error('should not be a SUCCESS');
            }

            const errorCodes = either.value.errors.map((e) => e.code);

            expect(errorCodes.length).to.eql(1);
            expect(errorCodes[0] === 'E_NOT_A_RECORD').to.eql(true);
        });

        it("should return status: 'FAILURE' if address has not all required keys", () => {
            const input: I = {
                name: 'Bruce Wayne',
                email: 'bruce.wayne@wayne-enterprises.com',
                password: 'ironmansucks',
                birthday: new Date(),
                address: {
                    others: [],
                } as any,
                profileData: {
                    theme: 'dark',
                },
            };

            const result = schema.validate(input);
            expect(result.status).to.eql('FAILURE');

            if (isSuccess(result)) {
                throw new Error('should not be a SUCCESS');
            }

            const either = result.value.properties.address;
            if (isSuccess(either)) {
                throw new Error('should not be a SUCCESS');
            }

            const errorCodes = either.value.errors.map((e) => e.code);

            expect(errorCodes.length).to.eql(1);
            expect(errorCodes[0] === 'E_MISSING_RECORD_KEYS').to.eql(true);
        });

        it("should return status: 'FAILURE' if address has too many keys", () => {
            const input: I = {
                name: 'Bruce Wayne',
                email: 'bruce.wayne@wayne-enterprises.com',
                password: 'ironmansucks',
                birthday: new Date(),
                address: {
                    main: {
                        street: '1007 Mountain Drive',
                        zip: '4242',
                        city: 'Gotham',
                        country: 'AT',
                    },
                    others: [],
                    wat: '',
                } as any,
                profileData: {
                    theme: 'dark',
                },
            };

            const result = schema.validate(input);
            expect(result.status).to.eql('FAILURE');

            if (isSuccess(result)) {
                throw new Error('should not be a SUCCESS');
            }

            const either = result.value.properties.address;
            if (isSuccess(either)) {
                throw new Error('should not be a SUCCESS');
            }

            const errorCodes = either.value.errors.map((e) => e.code);

            expect(errorCodes.length).to.eql(1);
            expect(errorCodes[0] === 'E_UNKNOWN_RECORD_KEYS').to.eql(true);
        });

        describe('address.main', () => {
            it("should return status: 'FAILURE' if address.main is not of type record", () => {
                const input: I = {
                    name: 'Bruce Wayne',
                    email: 'bruce.wayne@wayne-enterprises.com',
                    password: 'ironmansucks',
                    birthday: new Date(),
                    address: {
                        main: [] as any,
                        others: [],
                    },
                    profileData: {
                        theme: 'dark',
                    },
                };

                const result = schema.validate(input);
                expect(result.status).to.eql('FAILURE');

                if (isSuccess(result)) {
                    throw new Error('should not be a SUCCESS');
                }

                const addressEither = result.value.properties.address;
                if (isSuccess(addressEither)) {
                    throw new Error('should not be a SUCCESS');
                }

                const either = addressEither.value.properties.main;
                if (isSuccess(either)) {
                    throw new Error('should not be a SUCCESS');
                }

                const errorCodes = either.value.errors.map((e) => e.code);

                expect(errorCodes.length).to.eql(1);
                expect(errorCodes[0] === 'E_NOT_A_RECORD').to.eql(true);
            });

            it("should return status: 'FAILURE' if address.main has not all required keys", () => {
                const input: I = {
                    name: 'Bruce Wayne',
                    email: 'bruce.wayne@wayne-enterprises.com',
                    password: 'ironmansucks',
                    birthday: new Date(),
                    address: {
                        main: {
                            street: '1007 Mountain Drive',
                            zip: '4242',
                            city: 'Gotham',
                        } as any,
                        others: [],
                    },
                    profileData: {
                        theme: 'dark',
                    },
                };

                const result = schema.validate(input);
                expect(result.status).to.eql('FAILURE');

                if (isSuccess(result)) {
                    throw new Error('should not be a SUCCESS');
                }

                const addressEither = result.value.properties.address;
                if (isSuccess(addressEither)) {
                    throw new Error('should not be a SUCCESS');
                }

                const either = addressEither.value.properties.main;
                if (isSuccess(either)) {
                    throw new Error('should not be a SUCCESS');
                }

                const errorCodes = either.value.errors.map((e) => e.code);

                expect(errorCodes.length).to.eql(1);
                expect(errorCodes[0] === 'E_MISSING_RECORD_KEYS').to.eql(true);
            });

            it("should return status: 'FAILURE' if address.main has too many keys", () => {
                const input: I = {
                    name: 'Bruce Wayne',
                    email: 'bruce.wayne@wayne-enterprises.com',
                    password: 'ironmansucks',
                    birthday: new Date(),
                    address: {
                        main: {
                            street: '1007 Mountain Drive',
                            zip: '4242',
                            city: 'Gotham',
                            country: 'AT',
                            wat: 'wat',
                        } as any,
                        others: [],
                    },
                    profileData: {
                        theme: 'dark',
                    },
                };

                const result = schema.validate(input);
                expect(result.status).to.eql('FAILURE');

                if (isSuccess(result)) {
                    throw new Error('should not be a SUCCESS');
                }

                const addressEither = result.value.properties.address;
                if (isSuccess(addressEither)) {
                    throw new Error('should not be a SUCCESS');
                }

                const either = addressEither.value.properties.main;
                if (isSuccess(either)) {
                    throw new Error('should not be a SUCCESS');
                }

                const errorCodes = either.value.errors.map((e) => e.code);

                expect(errorCodes.length).to.eql(1);
                expect(errorCodes[0] === 'E_UNKNOWN_RECORD_KEYS').to.eql(true);
            });

            it("should return status: 'FAILURE' if address.main.country is not within the country union", () => {
                const input: I = {
                    name: 'Bruce Wayne',
                    email: 'bruce.wayne@wayne-enterprises.com',
                    password: 'ironmansucks',
                    birthday: new Date(),
                    address: {
                        main: {
                            street: '1007 Mountain Drive',
                            zip: '4242',
                            city: 'Gotham',
                            country: 'IT' as any,
                        },
                        others: [],
                    },
                    profileData: {
                        theme: 'dark',
                    },
                };

                const result = schema.validate(input);
                expect(result.status).to.eql('FAILURE');

                if (isSuccess(result)) {
                    throw new Error('should not be a SUCCESS');
                }

                const addressEither = result.value.properties.address;
                if (isSuccess(addressEither)) {
                    throw new Error('should not be a SUCCESS');
                }

                const mainEither = addressEither.value.properties.main;
                if (isSuccess(mainEither)) {
                    throw new Error('should not be a SUCCESS');
                }

                const either = mainEither.value.properties.country;
                if (isSuccess(either)) {
                    throw new Error('should not be a SUCCESS');
                }

                expect(either.value.code === 'E_NOT_IN_UNION').to.eql(true);
            });
        });

        describe('address.others', () => {
            it("should return status: 'FAILURE' if address.others is not of type array", () => {
                const input: I = {
                    name: 'Bruce Wayne',
                    email: 'bruce.wayne@wayne-enterprises.com',
                    password: 'ironmansucks',
                    birthday: new Date(),
                    address: {
                        main: {
                            street: '1007 Mountain Drive',
                            zip: '4242',
                            city: 'Gotham',
                            country: 'AT',
                        },
                        others: {} as any,
                    },
                    profileData: {
                        theme: 'dark',
                    },
                };

                const result = schema.validate(input);
                expect(result.status).to.eql('FAILURE');

                if (isSuccess(result)) {
                    throw new Error('should not be a SUCCESS');
                }

                const addressEither = result.value.properties.address;
                if (isSuccess(addressEither)) {
                    throw new Error('should not be a SUCCESS');
                }

                const either = addressEither.value.properties.others;
                if (isSuccess(either)) {
                    throw new Error('should not be a SUCCESS');
                }

                const errorCodes = either.value.errors.map((e) => e.code);

                expect(errorCodes.length).to.eql(1);
                expect(errorCodes[0] === 'E_NOT_A_ARRAY').to.eql(true);
            });

            it("should return status: 'FAILURE' if address.others[0] is not of type record", () => {
                const input: I = {
                    name: 'Bruce Wayne',
                    email: 'bruce.wayne@wayne-enterprises.com',
                    password: 'ironmansucks',
                    birthday: new Date(),
                    address: {
                        main: {
                            street: '1007 Mountain Drive',
                            zip: '4242',
                            city: 'Gotham',
                            country: 'AT',
                        },
                        others: ['' as any],
                    },
                    profileData: {
                        theme: 'dark',
                    },
                };

                const result = schema.validate(input);
                expect(result.status).to.eql('FAILURE');

                if (isSuccess(result)) {
                    throw new Error('should not be a SUCCESS');
                }

                const addressEither = result.value.properties.address;
                if (isSuccess(addressEither)) {
                    throw new Error('should not be a SUCCESS');
                }

                const othersEither = addressEither.value.properties.others;
                if (isSuccess(othersEither)) {
                    throw new Error('should not be a SUCCESS');
                }

                const either = othersEither.value.items[0];
                if (isSuccess(either)) {
                    throw new Error('should not be a SUCCESS');
                }

                const errorCodes = either.value.errors.map((e) => e.code);

                expect(errorCodes.length).to.eql(1);
                expect(errorCodes[0] === 'E_NOT_A_RECORD').to.eql(true);
            });

            it("should return status: 'FAILURE' if address.others[0] has missing keys", () => {
                const input: I = {
                    name: 'Bruce Wayne',
                    email: 'bruce.wayne@wayne-enterprises.com',
                    password: 'ironmansucks',
                    birthday: new Date(),
                    address: {
                        main: {
                            street: '1007 Mountain Drive',
                            zip: '4242',
                            city: 'Gotham',
                            country: 'AT',
                        },
                        others: [
                            {
                                street: '1007 Mountain Drive',
                                zip: '4242',
                                city: 'Gotham',
                            } as any,
                        ],
                    },
                    profileData: {
                        theme: 'dark',
                    },
                };

                const result = schema.validate(input);
                expect(result.status).to.eql('FAILURE');

                if (isSuccess(result)) {
                    throw new Error('should not be a SUCCESS');
                }

                const addressEither = result.value.properties.address;
                if (isSuccess(addressEither)) {
                    throw new Error('should not be a SUCCESS');
                }

                const othersEither = addressEither.value.properties.others;
                if (isSuccess(othersEither)) {
                    throw new Error('should not be a SUCCESS');
                }

                const either = othersEither.value.items[0];
                if (isSuccess(either)) {
                    throw new Error('should not be a SUCCESS');
                }

                const errorCodes = either.value.errors.map((e) => e.code);

                expect(errorCodes.length).to.eql(1);
                expect(errorCodes[0] === 'E_MISSING_RECORD_KEYS').to.eql(true);
            });

            it("should return status: 'FAILURE' if address.others[0] has too many keys", () => {
                const input: I = {
                    name: 'Bruce Wayne',
                    email: 'bruce.wayne@wayne-enterprises.com',
                    password: 'ironmansucks',
                    birthday: new Date(),
                    address: {
                        main: {
                            street: '1007 Mountain Drive',
                            zip: '4242',
                            city: 'Gotham',
                            country: 'AT',
                        },
                        others: [
                            {
                                street: '1007 Mountain Drive',
                                zip: '4242',
                                city: 'Gotham',
                                country: 'AT',
                                wat: 'wat',
                            } as any,
                        ],
                    },
                    profileData: {
                        theme: 'dark',
                    },
                };

                const result = schema.validate(input);
                expect(result.status).to.eql('FAILURE');

                if (isSuccess(result)) {
                    throw new Error('should not be a SUCCESS');
                }

                const addressEither = result.value.properties.address;
                if (isSuccess(addressEither)) {
                    throw new Error('should not be a SUCCESS');
                }

                const othersEither = addressEither.value.properties.others;
                if (isSuccess(othersEither)) {
                    throw new Error('should not be a SUCCESS');
                }

                const either = othersEither.value.items[0];
                if (isSuccess(either)) {
                    throw new Error('should not be a SUCCESS');
                }

                const errorCodes = either.value.errors.map((e) => e.code);

                expect(errorCodes.length).to.eql(1);
                expect(errorCodes[0] === 'E_UNKNOWN_RECORD_KEYS').to.eql(true);
            });

            it("should return status: 'FAILURE' if address.others[0].country is not within the country union", () => {
                const input: I = {
                    name: 'Bruce Wayne',
                    email: 'bruce.wayne@wayne-enterprises.com',
                    password: 'ironmansucks',
                    birthday: new Date(),
                    address: {
                        main: {
                            street: '1007 Mountain Drive',
                            zip: '4242',
                            city: 'Gotham',
                            country: 'AT',
                        },
                        others: [
                            {
                                street: '1007 Mountain Drive',
                                zip: '4242',
                                city: 'Gotham',
                                country: 'IT' as any,
                            },
                        ],
                    },
                    profileData: {
                        theme: 'dark',
                    },
                };

                const result = schema.validate(input);
                expect(result.status).to.eql('FAILURE');

                if (isSuccess(result)) {
                    throw new Error('should not be a SUCCESS');
                }

                const addressEither = result.value.properties.address;
                if (isSuccess(addressEither)) {
                    throw new Error('should not be a SUCCESS');
                }

                const othersEither = addressEither.value.properties.others;
                if (isSuccess(othersEither)) {
                    throw new Error('should not be a SUCCESS');
                }

                const firstItemEither = othersEither.value.items[0];
                if (isSuccess(firstItemEither)) {
                    throw new Error('should not be a SUCCESS');
                }

                const either = firstItemEither.value.properties.country;
                if (isSuccess(either)) {
                    throw new Error('should not be a SUCCESS');
                }

                expect(either.value.code === 'E_NOT_IN_UNION').to.eql(true);
            });
        });
    });

    describe('profileData', () => {
        it("should return status: 'FAILURE' if profileData is not of type record", () => {
            const input: I = {
                name: 'Bruce Wayne',
                email: 'bruce.wayne@wayne-enterprises.com',
                password: 'ironmansucks',
                birthday: new Date(),
                address: {
                    main: {
                        street: '1007 Mountain Drive',
                        zip: '4242',
                        city: 'Gotham',
                        country: 'AT',
                    },
                    others: [],
                },
                profileData: '' as any,
            };

            const result = schema.validate(input);
            expect(result.status).to.eql('FAILURE');

            if (isSuccess(result)) {
                throw new Error('should not be a SUCCESS');
            }

            const either = result.value.properties.profileData;
            if (isSuccess(either)) {
                throw new Error('should not be a SUCCESS');
            }

            const errorCodes = either.value.errors.map((e) => e.code);

            expect(errorCodes.length).to.eql(1);
            expect(errorCodes[0] === 'E_NOT_A_RECORD').to.eql(true);
        });

        it("should return status: 'SUCCESS' if profileData is a empty object", () => {
            const input: I = {
                name: 'Bruce Wayne',
                email: 'bruce.wayne@wayne-enterprises.com',
                password: 'ironmansucks',
                birthday: new Date(),
                address: {
                    main: {
                        street: '1007 Mountain Drive',
                        zip: '4242',
                        city: 'Gotham',
                        country: 'AT',
                    },
                    others: [],
                },
                profileData: {},
            };

            const result = schema.validate(input);
            expect(result.status).to.eql('SUCCESS');
        });
    });
});
