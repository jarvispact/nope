import { NotARecordError, TooManyKeysError } from './record';
import { Either, RecordSchema, Schema } from './utils';
declare type DefEither<Def extends {
    [x: string]: Schema<any, any, any>;
}> = Partial<{
    [Key in keyof Def]: Either<Def[Key]['O'], Def[Key]['E']>;
}>;
export declare type RecordFailure<Def extends {
    [x: string]: Schema<any, any, any>;
}> = {
    errors: Array<RecordError>;
    properties: DefEither<Def>;
};
declare type RecordError = NotARecordError | TooManyKeysError;
export declare const partial: <Def extends RecordSchema<any, any, any, {
    [Key: string]: Schema<any, any, any>;
}>>(recordSchemaDefinition: Def) => Schema<Partial<Def["I"]>, Partial<Def["O"]>, RecordFailure<Def["definition"]>>;
export {};
