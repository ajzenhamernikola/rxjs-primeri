import $ from 'jquery';
import * as rxjs from 'rxjs';
import {publish, take} from 'rxjs/operators'

if (primer === "001")
{
    const dugme1 = $("#dugme1");
    // Funkcija fromEvent sluzi za kreiranje toka od dogadjaja.
    // Prosledjujemo joj element na stranici
    // i dogadjaj koji se dogodi nad tim elementom,
    // i onda svaki put kad se taj dogadjaj okine nad elementom,
    // tok ce emitovati taj dogadjaj kao vrednost
    const dugme1Stream$ = rxjs.fromEvent(dugme1, "click");
    // Funkcijom subscribe se pretplacujemo na tok.
    // Ona prima tri funkcije kao argumente 
    // koje ce se izvrsiti ako je emitovana:
    //  1. vrednost
    //  2. greska
    //  3. signal za prestanak toka
    dugme1Stream$.subscribe(
        event => {
            $(document.body).append("<p>Dugme 1 je kliknuto!</p>");
        },
        error => {
            $(document.body).append(`<p style="color:red">${error.message}</p><hr>`);
        },
        () => {
            // DOM eventi nikada ne prestaju,
            // pa ovaj tok nikada nece biti zavrsen
            $(document.body).append("<p>Tok je zavrsen!</p><hr>");
        }
    );
}

if (primer === "002")
{
    const unos = $("#unos");
    const unosStream$ = rxjs.fromEvent(unos, "keyup");
    unosStream$.subscribe(
        event => {
            // Umesto pristupanja promenljivoj unos
            // mogli smo napisati:
            // event.target.value
            $("#prikaz").text(unos.val());
        }
        // Ostale dve funkcije nisu obavezne,
        // samo je prva funkcija obavezna
    );

    const mouseMoveStream$ = rxjs.fromEvent(document, "mousemove");
    mouseMoveStream$.subscribe(event => {
        $("#mis").text(`X: ${event.clientX}, Y: ${event.clientY}`);
    });

    unos.focus();
}

if (primer === "003")
{
    const posts = [
        { title: "Title 1", content: "This is a post content." },
        { title: "Title 2", content: "This is a post content." },
        { title: "Title 3", content: "This is a post content." }
    ];
    // Za kreiranje tokova od nizova
    // koristimo funkciju from
    const posts$ = rxjs.from(posts);
    posts$.subscribe(
        post => {
            $("ul").append(`<li>
                <h5>${post.title}</h5>
                <p>${post.content}</p>
            </li>`);

            console.log(post);
        },
        error => {
            console.error(error.message);
        },
        () => {
            // Tok se zavrsava kada se iscrpe svi elementi u nizu
            console.log("Completed!");
        }
    );
}

// Napisali smo svoju funkciju za pretplatu
// da ne bismo stalno pisali prakticno isti kod
import { getSubscriber } from './utils/getSubscriber';

if (primer === "004")
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

if (primer === "005")
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

if (primer === "006")
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

if (primer === "007")
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

import githubApi from './utils/githubApi';

if (primer === "008")
{
    // const githubPromise = new Promise((resolve, reject) => {
    //     console.log("Creating a promise...");

    //     setTimeout(() => {
    //         console.log("Something...");
    //         resolve("Hello from promise!");
    //     }, 2000);
    // });

    // // Bez tokova:
    // // githubPromise
    // // .then(result => {
    // //     console.log(result);
    // // });

    // // Kreiranje toka iz obecanja se vrsi pozivom operatora from
    // rxjs.from(githubPromise)
    //     .subscribe(getSubscriber("promise"));

    $("#profile").hide();

    function getGithubUser(username)
    {
        let clientId = githubApi.clientId;
        let clientSecret = githubApi.clientSecret;

        return $.ajax(`https://api.github.com/users/${username}?client_id=${clientId}&client_secret=${clientSecret}`, {
            dataType: 'jsonp'
        }).promise();
    }

    function displayGitHubUser(user)
    {
        $("#profile").show();
        $("#username").text(user.data.login);
        $("name").text(user.data.name);
        $("img").attr("src", user.data.avatar_url);
        $("#public_repos").text(user.data.public_repos);
        $("#followers").text(user.data.followers);
        $("#following").text(user.data.following);
        $("#html_url").attr("href", user.data.html_url);
    }
    
    rxjs.fromEvent($("#search"), "keyup")
        .subscribe(event => {
            let username = event.target.value;
            if (username === "")
            {
                $("#profile").hide();
            }
            else 
            {
                rxjs.from(getGithubUser(username))
                    .subscribe(user => displayGitHubUser(user));
            }
        });
}

console.log("Primer je pokrenut...");