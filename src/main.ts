import { PersonSchema } from './person';

const either = PersonSchema.validate({
    id: '00000000-0000-0000-0000-00000000000a',
    name: '',
    email: 'test@test',
    birthday: '',
    importedAt: '',
    address: {
        main: {
            street: '',
            zip: '',
            city: '',
            country: 'AT',
        },
        others: [
            {
                street: '',
                zip: '',
                city: '',
                country: 'AT',
            },
        ],
    },
    profile: {
        theme: 'whaaaat',
    },
});

const pre = document.getElementById('either') as HTMLPreElement;
pre.innerText = JSON.stringify(either, null, 2);
