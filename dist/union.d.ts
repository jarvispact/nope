import { Schema, SupportedSchema } from './utils';
declare const unionError: (union: Array<string>, input: unknown) => {
    schema: "union";
    code: "E_NOT_IN_UNION";
    message: string;
    details: {
        provided: {
            type: string;
            value: unknown;
        };
        expected: {
            type: string;
            union: string[];
        };
    };
};
declare type UnionError = ReturnType<typeof unionError>;
export declare const union: <S extends SupportedSchema[]>(possibleSchemas: S) => Schema<S[number]["I"], S[number]["O"], {
    schema: "union";
    code: "E_NOT_IN_UNION";
    message: string;
    details: {
        provided: {
            type: string;
            value: unknown;
        };
        expected: {
            type: string;
            union: string[];
        };
    };
}>;
export {};
