import { record, string, union, literal, isSuccess } from '../../lib/nope';

const TodoSchema = record({
    id: string(),
    content: string(),
    status: union([literal('COMPLETE'), literal('INCOMPLETE')]),
});

// ---

const either = TodoSchema.validate({
    id: '42',
    content: 'some content',
    status: 'INCOMPLETE',
});

// typeof either = Either<Todo, TodoError>

if (isSuccess(either)) {
    const { value } = either; // value is of type: Todo
} else {
    const { value } = either; // value is of type: TodoError
}
