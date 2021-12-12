import { Schema } from './utils';
declare type LiteralSchema<I, O extends I, E> = Schema<I, O, E> & {
    literal: O;
};
export declare const literal: <Literal extends string | number>(l: Literal) => LiteralSchema<Literal, Literal, {
    schema: "literal";
    code: "E_INVALID_LITERAL";
    message: string;
    details: {
        provided: {
            type: string;
            value: string | number;
        };
        expected: {
            type: string;
            literal: unknown;
        };
    };
}>;
export {};
