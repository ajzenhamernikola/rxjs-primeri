import * as rxjs from 'rxjs';

// Napisali smo svoju funkciju za pretplatu
// da ne bismo stalno pisali prakticno isti kod
import { getSubscriber } from '../utils/getSubscriber';

export function main()
{
    // Tok od niza brojeva sa nasom getSubscriber funkcijom
    const nums = [1, 2, 3, 4, 5];
    const nums$ = rxjs.from(nums);
    nums$.subscribe(getSubscriber('nums'));

    // Tok od niza objekata sa nasom getSubscriber funkcijom
    // samo sto prosledjujemo i funkciju 
    // koja transformise ispis svakog elementa toka
    const users = [
        { name: "John Doe", email: "johndoe@gmail.com" },
        { name: "Sam Smith", email: "samsmith@gmail.com" },
        { name: "Jane Doe", email: "janedoe@gmail.com" },
    ];
    const users$ = rxjs.from(users);
    users$.subscribe(getSubscriber('users', user => JSON.stringify(user)));

    // Tok od Set objekta
    // const s = new Set(['Foo', 43, { name: 'Jeff' }]);
    // const s$ = rxjs.from(s);
    // s$.subscribe(getSubscriber('set'));

    // Tok od Map objekta
    // const m = new Map([[1,2], [3,4], [5,6]]);
    // const m$ = rxjs.from(m);
    // m$.subscribe(getSubscriber('map'));

    // Tok od niske
    const str = 'Hello World';
    const str$ = rxjs.from(str);
    str$.subscribe(getSubscriber('str'));
}