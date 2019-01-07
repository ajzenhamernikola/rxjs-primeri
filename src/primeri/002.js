import $ from 'jquery';
import * as rxjs from 'rxjs';

export function main()
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