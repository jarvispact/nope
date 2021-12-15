import { record, string, union, literal } from '../../lib/nope';

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
