import {
    string,
    record,
    array,
    union,
    literal,
    date,
    partial,
    optional,
    boolean,
    nullable,
} from '../../lib/nope';

// ---

const AddressSchema = record({
    street: string(),
    zip: string(),
    city: string(),
    country: union([literal('AT'), literal('DE'), literal('CH')]),
});

const UserSchema = record({
    name: string(),
    email: string(),
    password: string(),
    birthday: date(),
    newsletter: optional(boolean()),
    importedAt: nullable(date()),
    address: record({
        main: AddressSchema,
        others: array(AddressSchema),
    }),
    profileData: partial(
        record({
            language: union([literal('DE'), literal('IT'), literal('FR')]),
            theme: union([literal('light'), literal('dark')]),
        }),
    ),
});

type User = typeof UserSchema['O'];
/**
{
    name: string;
    email: string;
    password: string;
    birthday: Date;
    newsletter: boolean | undefined;
    importedAt: Date | null;
    address: {
        main: {
            street: string;
            zip: string;
            city: string;
            country: "AT" | "DE" | "CH";
        };
        others: {
            street: string;
            zip: string;
            city: string;
            country: "AT" | "DE" | "CH";
        }[];
    };
    profileData: {
        language?: "DE" | "IT" | "FR";
        theme?: "light" | "dark";
    };
}
*/

type UserError = typeof UserSchema['E'];
/**
{
    errors: Array<RecordError>;
    properties: {
        name: Either<string, StringError>;
        email: Either<string, StringError>;
        password: Either<string, StringError>;
        birthday: Either<Date, DateError>;
        newsletter: Either<boolean | undefined, BooleanError>;
        importedAt: Either<Date | null, DateError>;
        address: {
            errors: Array<RecordError>;
            properties: {
                main: {
                    errors: Array<RecordError>;
                    properties: {
                        street: Either<string, StringError>;
                        zip: Either<string, StringError>;
                        city: Either<string, StringError>;
                        country: Either<"AT" | "DE" | "CH", UnionError>;
                    }
                }
                others: {
                    errors: Array<ArrayErrors>;
                    items: Array<{
                        errors: Array<RecordError>;
                        properties: {
                            street: Either<string, StringError>;
                            zip: Either<string, StringError>;
                            city: Either<string, StringError>;
                            country: Either<"AT" | "DE" | "CH", UnionError>;
                        }
                    }>
                }
            }
        }
        profileData: {
            errors: Array<RecordError>;
            properties: {
                language?: Either<"DE" | "IT" | "FR", UnionError>;
                theme?: Either<"light" | "dark", UnionError>;
            }
        }
    }
}
*/
