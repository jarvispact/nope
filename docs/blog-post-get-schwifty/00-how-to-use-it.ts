import { record, string, union, literal } from '../../lib/nope';

const TodoSchema = record({
    id: string(),
    content: string(),
    status: union([literal('COMPLETE'), literal('INCOMPLETE')]),
});

type TodoInput = typeof TodoSchema['I'];
// this is the static type for the Input of your validate function
/**
{
    id: string;
    content: string;
    status: 'COMPLETE' | 'INCOMPLETE';
}
*/

type Todo = typeof TodoSchema['O'];
// this is the static type for your domain model: Todo
/**
{
    id: string;
    content: string;
    status: 'COMPLETE' | 'INCOMPLETE';
}
*/

type TodoError = typeof TodoSchema['E'];
// this is the static type of an Error for this schema:
/**
{
    errors: Array<RecordError>;
    properties: {
        id: Either<string, StringError>;
        content: Either<string, StringError>;
        status: Either<'COMPLETE' | 'INCOMPLETE', UnionError>;
    }
}
*/
