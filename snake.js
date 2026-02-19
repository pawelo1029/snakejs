const planszaGry = document.querySelector("#PlanszaGry");
const ctx = planszaGry.getContext("2d");
const wynikEl = document.querySelector("#wynik");
const guzik = document.querySelector("#guzik");

const szerokoscGry = planszaGry.width;
const wysokoscGry = planszaGry.height;

const kolorWeza = "lightgreen";
const obramowanieWeza = "black";
const kolorJedzenia = "red";

const rozmiar = 25;

let predkoscX = rozmiar;
let predkoscY = 0;

let jedzenieX;
let jedzenieY;
let wynik = 0;
let running = true;

const poczatkowyWaz = [
    { x: rozmiar * 4, y: 0 },
    { x: rozmiar * 3, y: 0 },
    { x: rozmiar * 2, y: 0 },
    { x: rozmiar, y: 0 },
    { x: 0, y: 0 }
];

let waz = poczatkowyWaz.map(c => ({ x: c.x, y: c.y }));

window.addEventListener("keydown", zmienKierunek);
guzik.addEventListener("click", resetGry);

startGry();

function startGry() {
    wynik = 0;
    wynikEl.textContent = wynik;
    running = true;
    predkoscX = rozmiar;
    predkoscY = 0;
    waz = poczatkowyWaz.map(c => ({ x: c.x, y: c.y }));
    stworzJedzenie();
    wyczyscPlansze();
    rysujJedzenie();
    rysujWeza();
    nastepnyTick();
}

function nastepnyTick(){
    if(running){
        setTimeout(() => {
            wyczyscPlansze();
            rysujJedzenie();
            ruchWeza();
            rysujWeza();
            sprawdzKoniecGry();
            nastepnyTick();
        }, 90);
    }
    else{
        wyswietlKoniecGry();
    }
}

function wyczyscPlansze(){
    ctx.clearRect(0, 0, szerokoscGry, wysokoscGry);
}

function losowaPozycja(min, max) {
    const rand = Math.round((Math.random() * (max - min) + min) / rozmiar) * rozmiar;
    return rand;
}

function stworzJedzenie() {
    do {
        jedzenieX = losowaPozycja(0, szerokoscGry - rozmiar);
        jedzenieY = losowaPozycja(0, wysokoscGry - rozmiar);

        var kolizja = false;
        for(let i = 0; i < waz.length; i++){
            if(waz[i].x === jedzenieX && waz[i].y === jedzenieY){
                kolizja = true;
                break;
            }
        }
    } while(kolizja);
}

function rysujJedzenie() {
    ctx.fillStyle = kolorJedzenia;
    ctx.strokeStyle = "black";
    ctx.fillRect(jedzenieX, jedzenieY, rozmiar, rozmiar);
    ctx.strokeRect(jedzenieX, jedzenieY, rozmiar, rozmiar);
}

function ruchWeza() {
    const glowa = { x: waz[0].x + predkoscX, y: waz[0].y + predkoscY };
    waz.unshift(glowa);

    if(waz[0].x === jedzenieX && waz[0].y === jedzenieY){
        wynik += 1;
        wynikEl.textContent = wynik;
        stworzJedzenie();
    }
    else{
        waz.pop();
    }
}

function rysujWeza(){
    ctx.fillStyle = kolorWeza;
    ctx.strokeStyle = obramowanieWeza;
    waz.forEach(czescWeza => {
        ctx.fillRect(czescWeza.x, czescWeza.y, rozmiar, rozmiar);
        ctx.strokeRect(czescWeza.x, czescWeza.y, rozmiar, rozmiar);
    });
}

function zmienKierunek(event){
    const kodPrzycisku = event.keyCode;

    if((kodPrzycisku === 37 || kodPrzycisku === 65) && predkoscX !== rozmiar){
        predkoscX = -rozmiar;
        predkoscY = 0;
    }
    else if((kodPrzycisku === 39 || kodPrzycisku === 68) && predkoscX !== -rozmiar){
        predkoscX = rozmiar;
        predkoscY = 0;
    }
    else if((kodPrzycisku === 38 || kodPrzycisku === 87) && predkoscY !== rozmiar){
        predkoscX = 0;
        predkoscY = -rozmiar;
    }
    else if((kodPrzycisku === 40 || kodPrzycisku === 83) && predkoscY !== -rozmiar){
        predkoscX = 0;
        predkoscY = rozmiar;
    }
}

function sprawdzKoniecGry(){
    const glowa = waz[0];

    if(glowa.x < 0 || glowa.x >= szerokoscGry || glowa.y < 0 || glowa.y >= wysokoscGry){
        running = false;
        return;
    }

    for(let i = 1; i < waz.length; i++){
        if(glowa.x === waz[i].x && glowa.y === waz[i].y){
            running = false;
            return;
        }
    }
}

function wyswietlKoniecGry(){
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(0,0,szerokoscGry, wysokoscGry);

    ctx.fillStyle = "white";
    ctx.font = "30px 'Press Start 2P', monospace";
    ctx.textAlign = "center";
    ctx.fillText("KONIEC GRY", szerokoscGry / 2, wysokoscGry / 2 - 20);

    ctx.font = "16px 'Press Start 2P', monospace";
    ctx.fillText("Wynik: " + wynik, szerokoscGry / 2, wysokoscGry / 2 + 10);
    ctx.fillText("Kliknij Reset", szerokoscGry / 2, wysokoscGry / 2 + 40);
}

function resetGry(){
    wynik = 0;
    wynikEl.textContent = wynik;
    predkoscX = rozmiar;
    predkoscY = 0;
    waz = poczatkowyWaz.map(c => ({ x: c.x, y: c.y }));
    running = true;
    stworzJedzenie();
    wyczyscPlansze();
    rysujJedzenie();
    rysujWeza();
    nastepnyTick();
}