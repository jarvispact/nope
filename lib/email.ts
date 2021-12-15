// import { err, getDisplayType } from './internal-utils';
// import { string } from './string';
// import { Either, failure, isFailure, isSuccess, success } from './utils';

// declare const tag: unique symbol;

// type Tagged<Token> = {
//     readonly [tag]: Token;
// };

// export type Opaque<Type, Token = unknown> = Type & Tagged<Token>;

// // type EmailSchema = {
// //     schema: 'email';
// //     I: string; // phantom type for: Input
// //     O: Email; // phantom type for: Output
// //     E: StringError; // phantom type for: Error
// //     validate: (v: string) => Either<Email, StringError>;
// // };

// // type EmailInput = EmailSchema['I'];
// // type EmailOutput = EmailSchema['O'];
// // type EmailError = EmailSchema['E'];

// // const email: EmailOutput = 'test@test.com';

// // const email2 = createEmail('test@test.com');

// export type Schema<N extends string, I, O extends I, E> = {
//     schema: N;
//     I: I;
//     O: O;
//     E: E;
//     validate: (v: I) => Either<O, E>;
// };

// // export const extendSchema = <
// //     Name extends string,
// //     BaseSchema extends Schema<any, any, any, any>,
// //     I,
// //     O extends I,
// //     E,
// // >({
// //     name,
// //     baseSchema,
// //     validate,
// // }: {
// //     name: Name;
// //     baseSchema: BaseSchema;
// //     validate: (input: BaseSchema['I'], baseSchema: BaseSchema) => Either<O, E>;
// // }): Schema<'email', I, O, E> => {
// //     const I = null as unknown as I;
// //     const O = null as unknown as O;
// //     const E = null as unknown as E;

// //     // const validate = (input: typeof I): Either<typeof O, typeof E> => {};

// //     return {
// //         schema: name,
// //         I,
// //         O,
// //         E,
// //         validate,
// //     };
// // };

// const emailError = (input: unknown) =>
//     err('email', 'E_NOT_A_EMAIL', 'provided value is not of type: "email"', {
//         provided: {
//             type: getDisplayType(input),
//             value: input,
//         },
//         expected: {
//             type: 'string',
//         },
//     });

// type EmailError = ReturnType<typeof emailError>;

// // const email = extendSchema({
// //     name: 'email',
// //     baseSchema: string(),
// //     validate: (input, baseSchema) => {
// //         const baseSchemaEither = baseSchema.validate(input);
// //         if (isFailure(baseSchemaEither)) {
// //             return baseSchemaEither.value;
// //         }

// //         if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(input)) {
// //             return failure(emailError(input));
// //         }

// //         return success(input);
// //     },
// // });

// export const extendSchema =
//     <
//         I,
//         O extends I,
//         E,
//         Name extends string,
//         BaseSchema extends Schema<any, any, any, any>,
//     >({
//         name,
//         baseSchema,
//         factory,
//     }: {
//         name: Name;
//         baseSchema: BaseSchema;
//         factory: (name: Name, baseSchema: BaseSchema) => Schema<Name, I, O, E>;
//     }) =>
//     () =>
//         factory(name, baseSchema);

// type Email = Opaque<string, 'email'>;
// // const createEmail = (input: EmailInput): EmailOutput => input as EmailOutput;

// const email = extendSchema<
//     string,
//     Email,
//     EmailError,
//     'email',
//     ReturnType<typeof string>
// >({
//     name: 'email',
//     baseSchema: string(),
//     factory: (name, baseSchema) => {
//         type BaseSchemaError = typeof baseSchema['E'];
//         const I = null as unknown as string;
//         const O = null as unknown as Email;
//         const E = null as unknown as BaseSchemaError | EmailError;

//         return {
//             schema: name,
//             I,
//             O,
//             E,
//             validate: (input) => {
//                 const baseEither = baseSchema.validate(input);
//                 if (isFailure(baseEither)) {
//                     return baseEither;
//                 }

//                 if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(input)) {
//                     return failure(emailError(input));
//                 }

//                 return success(input as Email);
//             },
//         };
//     },
// });

// const schema = email();

// type I = typeof schema['I'];
// type O = typeof schema['O'];
// type E = typeof schema['E'];

// const either = schema.validate('test@test.com');
// if (isSuccess(either)) {
//     const { value } = either;
// } else {
//     const { value } = either;
// }
