import * as rxjs from 'rxjs';
import {publish, take} from 'rxjs/operators';
import { getSubscriber } from '../utils/getSubscriber';

export function main()
{
    // Da li je ovaj tok hladan ili topli?
    // Ako pokrenemo primer, vidimo da dobijamo dve razlicite vrednosti
    // svaki put kada se pretplatimo.
    // Drugim recima, izvor vrednosti je aktivan samo tokom pretplate.
    // Dakle, tok je hladan.
    const source$ = rxjs.Observable.create(observer => {
        observer.next(Date.now());
    });

    source$.subscribe(getSubscriber("one"));
    source$.subscribe(getSubscriber("two"));

    // Da li je ovaj tok hladan ili topli?
    // Posto dobijamo istu vrednost,
    // onda je topao tok jer se kreira samo jednom,
    // a mi svaki put kada se pretplatimo, 
    // ocitavamo tu istu vrednost.
    const source2$ = rxjs.Observable.create(observer => {
        observer.next(Date.now());
    })
    // Ne mozemo direktno pozvati publish
    // jer se od verzije 5.5 koristi metod push
    // za ulancavanje operatora nad tokom.
    // Za vise informacija pogledati:
    // https://github.com/ReactiveX/rxjs/blob/91088dae1df097be2370c73300ffa11b27fd0100/doc/pipeable-operators.md
    .pipe(
        // Operator publish kreira topao tok.
        // Potrebno je pozvati metod connect 
        // inace se nece emitovati vrednosti
        publish()
    );

    source2$.subscribe(getSubscriber("three"));
    source2$.subscribe(getSubscriber("four"));

    // Mora da bude nakon subscribe poziva
    source2$.connect();

    // Da li je ovaj tok hladan ili topli?
    // Posto izvor vrednosti tece bez obzira na to da li smo se mi pretplatili,
    // i zbog toga sto kad se drugi put pretplatimo, on se ne restaruje od pocetka,
    // u pitanju je topli tok
    const source3$ = rxjs
        .interval(1000)
        .pipe(
            // Operator take ce zaustaviti emitovanje u toku nakon zadate vrednosti
            take(6),
            publish()
        );
    source3$.connect();
    
    setTimeout(() => {
        source3$.subscribe(getSubscriber("five"));

        setTimeout(() => {
            source3$.subscribe(getSubscriber("six"));
        }, 2000);
    }, 2000);

    // Ukoliko zelimo da se prva vrednost emituje sa prvom pretplatom,
    // mozemo koristiti refCount metod umesto connect.
    // Na primer:
    const source4$ = rxjs
        .interval(1000)
        .pipe(
            take(6),
            publish()
        )
        .refCount();

    setTimeout(() => {
        source4$.subscribe(getSubscriber("seven"));

        setTimeout(() => {
            source4$.subscribe(getSubscriber("eight"));
        }, 2000);
    }, 6000);
}