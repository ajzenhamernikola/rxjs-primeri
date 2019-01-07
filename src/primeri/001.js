import $ from 'jquery';
import * as rxjs from 'rxjs';

export function main()
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