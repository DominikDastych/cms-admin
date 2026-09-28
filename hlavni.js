/*
  hlavni.js
  ---------
  Spuštění aplikace, přepínání mezi sekcemi (Přehled/Stránky/...)
  a přehledová obrazovka se statistikami. Tenhle soubor spouští
  celou appku.

  OBHAJOBA: otázka "jak appka startuje" nebo "jak funguje menu/offline
  hláška nahoře" -> je to tady.
*/

// spustí se při načtení stránky - připraví appku
function init() {
  zajistiDemoUcet();                                        // vytvoří demo účet, pokud ještě neexistuje
  aktualizujOnlineStav();                                   // zjistí, jestli appka je online/offline
  window.addEventListener('online', aktualizujOnlineStav);  // při návratu připojení aktualizuje hlášku
  window.addEventListener('offline', aktualizujOnlineStav); // při ztrátě připojení aktualizuje hlášku

  var data = nacti();      // načte data
  if (data.prihlasenyId) { // pokud je někdo přihlášený (i po předchozí návštěvě)
    zobrazApp();            // rovnou zobrazí administraci
  } else {
    zobrazLogin();          // jinak zobrazí přihlašovací obrazovku
  }

  if ('serviceWorker' in navigator) {          // pokud prohlížeč podporuje Service Worker
    navigator.serviceWorker.register('sw.js'); // zaregistruje ho (kvůli offline režimu)
  }
}

// zobrazí/schová hlášku o tom, že appka je offline
function aktualizujOnlineStav() {
  var info = document.getElementById('offlineInfo'); // element s hláškou
  if (navigator.onLine) {           // prohlížeč hlásí připojení k internetu
    info.classList.add('skryto');   // hlášku schová
  } else {
    info.classList.remove('skryto'); // jinak ji zobrazí
  }
}

// přepne zobrazenou sekci administrace (Přehled/Stránky/Příspěvky/...)
function zobrazSekci(nazev) {
  var vsechnySekce = document.querySelectorAll('.sekce'); // všechny sekce v <main>
  for (var i = 0; i < vsechnySekce.length; i++) {
    vsechnySekce[i].classList.add('skryto');               // nejdřív všechny schová
  }
  document.getElementById('sekce-' + nazev).classList.remove('skryto'); // a zobrazí jen tu vybranou

  var vsechnaTlacitka = document.querySelectorAll('#menu button'); // všechna tlačítka v menu
  for (var j = 0; j < vsechnaTlacitka.length; j++) {
    vsechnaTlacitka[j].classList.remove('aktivni');          // zruší jim zvýraznění
  }
  var aktivniTlacitko = document.getElementById('menu-' + nazev); // tlačítko odpovídající vybrané sekci
  if (aktivniTlacitko) {
    aktivniTlacitko.classList.add('aktivni'); // a to zvýrazní
  }

  if (nazev === 'prehled') vykresliPrehled();       // podle vybrané sekce zavolá funkci, co ji naplní daty
  if (nazev === 'stranky') vykresliStranky();       // sekce Stránky
  if (nazev === 'prispevky') vykresliPrispevky();   // sekce Příspěvky
  if (nazev === 'kategorie') vykresliKategorie();   // sekce Kategorie
  if (nazev === 'nastaveni') vykresliNastaveni();   // sekce Nastavení
}

// naplní úvodní přehled počty stránek/příspěvků/kategorií/uživatelů
function vykresliPrehled() {
  var data = nacti();                                 // načte data
  var box = document.getElementById('prehledStaty');  // element, kam se statistiky vykreslí
  box.innerHTML =                                      // sestaví HTML se 4 "kartičkami"
    '<div><div class="cislo">' + data.stranky.length + '</div><div class="popisek">Stránky</div></div>' +
    '<div><div class="cislo">' + data.prispevky.length + '</div><div class="popisek">Příspěvky</div></div>' +
    '<div><div class="cislo">' + data.kategorie.length + '</div><div class="popisek">Kategorie</div></div>' +
    '<div><div class="cislo">' + data.uzivatele.length + '</div><div class="popisek">Uživatelé</div></div>';
}

window.onload = init; // jakmile se stránka celá načte, spustí se init()
