import $ from 'jquery';
import * as rxjs from 'rxjs';

export function main()
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