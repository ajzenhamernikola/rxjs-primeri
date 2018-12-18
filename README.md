# rxjs-primeri

Repozitorijum koji sadrzi primere za ucenje biblioteke RxJS 6.

### Potrebni alati za rad

1. [Node.js](https://nodejs.org/en/){:target="_blank"}

### Pokretanje primera

1. `git clone https://github.com/theikeofficial/rxjs-primeri`
2. `cd rxjs-primeri`
3. `npm install`
4. `npm start`
5. Otvoriti datoteku `index.html` u veb pregledacu

### Napomena

Neki primeri zahtevaju dodatne akcije. U nastavku su detalji sta svaki od takvih primera zahteva.

### Primer 008

Potrebno je otici na [https://github.com/settings/developers](https://github.com/settings/developers) i napraviti novu OAuth aplikaciju. Kada se aplikacija napravi, bice dostupni parametri `Client ID` i `Client Secret`. Te parametre ubaciti u datoteku [githubApi.js.example](./src/utils/githubApi.js.example) u odgovarajuca svojstva i primenovati tu datoteku u `githubApi.js`.