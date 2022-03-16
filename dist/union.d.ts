import { Schema } from './utils';
export declare const union: <WrappedSchemaList extends Schema<any, any, any, any>[]>(wrappedSchemaList: WrappedSchemaList) => Schema<WrappedSchemaList[number]["I"], WrappedSchemaList[number]["O"], {
    uri: "union";
    code: "E_NO_UNION";
    message: string;
    details: {
        expectedType: "union";
        providedType: string;
        providedNativeType: "string" | "number" | "bigint" | "boolean" | "symbol" | "undefined" | "object" | "function";
        providedValue: unknown;
    };
}, "union">;
