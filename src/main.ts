import { PersonSchema } from './person';

const either = PersonSchema.validate({
    id: '00000000-0000-0000-0000-00000000000a',
    firstname: '42',
    lastname: '42',
    other: '1',
});

console.log({ either });
