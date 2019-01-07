import * as rxjs from 'rxjs';
import {take} from 'rxjs/operators';
import { getSubscriber } from '../utils/getSubscriber';

export function main()
{
    // Operator interval(period) ce emitovati cele brojeve
    // na svakih period milisekundi
    rxjs.interval(100)
        .pipe(
            // Operator take(count) zavrsava emitovanje toka
            // nakon prvih count poziva next metoda
            take(10)
        )
        .subscribe(getSubscriber("interval"));

    // Operator timer(dueTime, periodOrScheduler) ce emitovati brojeve
    // slicno kao interval(period) na svakih periodOrScheduler ms,
    // ali zapocinje tek kad prodje dueTime ms
    rxjs.timer(2000, 100)
        .pipe(
            take(10)
        )
        .subscribe(getSubscriber("timer"));

    // Operator range(start, count) ce emitovati brojeve u intervalu [start, start+count)
    // jedan za drugim, bez ikakvog tajmera
    rxjs.range(5, 10)
        .subscribe(getSubscriber("range"));

    // Operator of(...args) pravi tok od bilo koje vrednosti
    rxjs.of(45, ["Niz", "niski"])
        .subscribe(getSubscriber("of"));

    // Operator defer(observableFactory) nam omogucava da kreiramo tok
    // samo kada se pretplatimo na njega,
    // i pri tome se kreira novi tok za svako pretplacivanje
    let count = 0;
    const source$ = rxjs.defer(() => {
        ++count;

        return rxjs.of(count);
    });

    source$.subscribe(getSubscriber("defer1"));
    source$.subscribe(getSubscriber("defer2"));
    source$.subscribe(getSubscriber("defer3"));
}