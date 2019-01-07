import * as rxjs from 'rxjs';
import { getSubscriber } from '../utils/getSubscriber';

export function main()
{
    // Staticka funkcija create sluzi za kreiranje novih tokova.
    // Argument je funkcija kojom se definise
    // kako se vrednosti salju pretplatiocu
    const source$ = new rxjs.Observable.create(observer => {
        console.log("Creating an observable...");

        // Funkcije next, error i complete koje se pominju u nastavku
        // dolaze iz observer argumenta ove lambda funkcije.
        // Njih smo definisali u getSubscriber,
        // sto znaci ako tamo promenimo funkciju next u, na primer, sledeci,
        // onda treba sve next pozive ovde preimenovati u sledeci.

        // Prosledjivanje vrednosti se vrsi pozivom funkcije next()
        observer.next("A value");
        observer.next("Another value");

        // Prosledjivanje greske se vrsi pozivom funkcije error().
        // Ukoliko se prosledi greska, 
        // nista nakon greske nece biti poslato
        if (Math.random() < 0.5)
        {
            observer.error(new Error("Something is wrong! :O"));
        }

        // Zatvaranje toka se vrsi pozivom funkcije complete()
        setTimeout(() => {
            observer.next("Third value");
            // Ako imamo asinhrono slanje vrednosti,
            // onda moramo staviti poziv complete unutar asinhrone akcije,
            // jer ce se u suprotnom tok zatvoriti
            // pre nego sto se asihnrono slanje izvrsi
            observer.complete();
        }, 2000);

        // Ako nemamo asinhrona slanja vrednosti,
        // mozemo zavrsiti tok pozivom complete na kraju funkcije:
        // observer.complete();
    });

    source$.subscribe(getSubscriber('myObs'));

    setTimeout(() => {
        source$.subscribe(getSubscriber("myObs"));
    }, 5000);
}