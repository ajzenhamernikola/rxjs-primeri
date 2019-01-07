import $ from 'jquery';
import * as rxjs from 'rxjs';
import {take, map, mapTo, pluck} from 'rxjs/operators';
import { getSubscriber } from '../utils/getSubscriber';

export function main()
{
    // Operator map transformise svaku vrednost koja je emitovana iz toka,
    // tako sto primenjuje prosledjenu funkciju nad svakom vrednoscu
    rxjs.interval(1000)
        .pipe(
            take(5),
            map(value => value * value)
        )
        .subscribe(getSubscriber("map"));

    const unos = $("#unos");
    const duzina = $("#duzina");

    let unosi$ = rxjs.fromEvent(unos, "keyup");
    unosi$.pipe(
            map(e => e.target.value),
            map(value => ({
                v: value,
                l: value.length
            }))
        )
        .subscribe(x => {
            console.log(`map: ${x.v}`);
            duzina.text(x.l);
        });

    // Operator mapTo transformise svaku vrednost koja je emitovana iz toka,
    // u vrednost koju prosledimo
    rxjs.timer(5000, 1000)
        .pipe(
            take(5),
            mapTo("Emitovan!")
        )
        .subscribe(getSubscriber("mapTo"));

    // Operatorom pluck mozemo da izdvojimo odredjeno svojstvo iz svake emitovane vrednosti.
    // Mozemo proslediti ili ime svojstva ili listu imena svojstava,
    // u zavisnosti od toga koliko duboko se nalazi svojstvo koje trazimo.
    // Na primer, neka imamo tok koji emituje objekte obj:
    //  1. Ako zelimo da tok transformisemo u tok vrednost obj.naziv, pozivamo pluck('naziv')
    //  2. Ako zelimo da tok transformisemo u tok vrednost obj.drzava.grad.adresa, pozivamo pluck('drzava', 'grad', 'adresa')
    let osobe = [
        { ime: "Ana" },
        { ime: "Jovan" },
        { ime: "Stefan" },
    ];
    setTimeout(() => {
        rxjs.from(osobe)
        .pipe(
            pluck('ime')
        )
        .subscribe(getSubscriber("pluck"));
    }, 10000);

    unosi$.pipe(
        pluck('target', 'value')
    ).subscribe(tekst => console.log(`pluck: ${tekst}`));
}