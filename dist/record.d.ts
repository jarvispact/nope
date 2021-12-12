import { Either, RecordSchema, Schema } from './utils';
export declare const notARecordError: (definition: Record<string, unknown>, input: Record<string, unknown>) => {
    schema: "record";
    code: "E_NOT_A_RECORD";
    message: string;
    details: {
        provided: {
            type: string;
            value: Record<string, unknown>;
        };
        expected: {
            type: string;
            keys: string[];
        };
    };
};
export declare type NotARecordError = ReturnType<typeof notARecordError>;
declare const missingKeysError: (definition: Record<string, unknown>, input: Record<string, unknown>) => {
    schema: "record";
    code: "E_MISSING_KEYS";
    message: string;
    details: {
        provided: {
            type: string;
            value: Record<string, unknown>;
        };
        expected: {
            type: string;
            keys: string[];
        };
    };
};
declare type MissingKeysError = ReturnType<typeof missingKeysError>;
declare const tooManyKeysError: (definition: Record<string, unknown>, input: Record<string, unknown>) => {
    schema: "record";
    code: "E_TOO_MANY_KEYS";
    message: string;
    details: {
        provided: {
            type: string;
            value: Record<string, unknown>;
            keys: string[];
        };
        expected: {
            type: string;
            keys: string[];
        };
    };
};
export declare type TooManyKeysError = ReturnType<typeof tooManyKeysError>;
declare type RecordError = NotARecordError | MissingKeysError | TooManyKeysError;
declare type DefEither<Def extends {
    [x: string]: Schema<any, any, any>;
}> = {
    [Key in keyof Def]: Either<Def[Key]['O'], Def[Key]['E']>;
};
declare type RecordFailure<Def extends {
    [x: string]: Schema<any, any, any>;
}> = {
    errors: Array<RecordError>;
    properties: DefEither<Def>;
};
export declare const record: <Def extends {
    [Key: string]: Schema<any, any, any>;
}>(definition: Def) => RecordSchema<{ [Key in keyof Def]: Def[Key]["I"]; }, { [Key_1 in keyof Def]: Def[Key_1]["I"]; }, RecordFailure<Def>, Def>;
export {};
