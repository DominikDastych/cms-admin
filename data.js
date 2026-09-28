/*
  data.js
  -------
  Všechno kolem ukládání dat. Nic vizuálního, jen práce s localStorage
  a pár drobných pomocných funkcí, které používají ostatní soubory.

  Data (uživatelé, stránky, příspěvky, kategorie, nastavení) se
  ukládají do localStorage prohlížeče - žádný server, žádná databáze.
  Díky tomu appka funguje i bez připojení k internetu.

  OBHAJOBA: otázka "kde a jak se to ukládá" -> je to tady, funkce
  nacti() a uloz().
*/

var KLIC_V_ULOZISTI = 'cmsData'; // klíč, pod kterým jsou všechna data uložená v localStorage

// vrátí prázdnou/výchozí strukturu dat - použije se při úplně prvním spuštění appky
function vychoziData() {
  return {
    uzivatele: [],                        // seznam všech uživatelských účtů
    stranky: [],                          // seznam všech stránek
    prispevky: [],                        // seznam všech příspěvků
    kategorie: [],                        // seznam všech kategorií
    nastaveni: { nazevWebu: 'Můj web' },  // obecné nastavení webu (zatím jen název)
    prihlasenyId: null                    // ID aktuálně přihlášeného uživatele (nikdo, když null)
  };
}

// přečte data z localStorage a vrátí je jako obyčejný JS objekt
function nacti() {
  var text = localStorage.getItem(KLIC_V_ULOZISTI); // přečte uložený text (nebo null, když tam nic není)
  if (!text) {                                       // appka běží poprvé, nic tam ještě není
    return vychoziData();                            // vrátí výchozí prázdná data
  }
  return JSON.parse(text);                           // jinak text (JSON) převede zpátky na objekt
}

// uloží objekt s daty zpátky do localStorage jako text
function uloz(data) {
  localStorage.setItem(KLIC_V_ULOZISTI, JSON.stringify(data)); // objekt převede na text (JSON) a uloží
}

// vytvoří "unikátní" ID pro nový záznam (stránku, příspěvek, kategorii...)
function vytvorId() {
  return Date.now().toString() + '-' + Math.floor(Math.random() * 10000); // aktuální čas + náhodné číslo
}

// naformátuje časové razítko (číslo) na čitelné datum a čas v češtině
function formatDatum(casovaZnamka) {
  return new Date(casovaZnamka).toLocaleString('cs-CZ'); // vestavěná funkce JS na formátování data
}

// Jednoduchá "hashovací" funkce pro heslo - jen aby se heslo neukládalo
// v čitelném textu. Skutečné weby používají mnohem silnější metody
// (bcrypt apod.), ale to už je nad rámec tohoto projektu.
function jednoducheHash(text) {
  var hash = 0;                                         // počáteční hodnota hashe
  for (var i = 0; i < text.length; i++) {               // projde heslo znak po znaku
    hash = (hash * 31 + text.charCodeAt(i)) % 999999937; // přepočítá hash podle kódu znaku
  }
  return hash.toString(16);                             // vrátí hash jako text v šestnáctkové soustavě
}

// Ošetření textu před vložením do stránky (aby speciální znaky
// nerozbily HTML, kdyby je někdo napsal do titulku nebo obsahu).
function escapovat(text) {
  var pomocnyDiv = document.createElement('div');                             // vytvoří pomocný (neviditelný) element
  pomocnyDiv.textContent = (text === null || text === undefined) ? '' : text; // vloží text jako čistý text, ne HTML
  return pomocnyDiv.innerHTML;                                                // prohlížeč ho sám "bezpečně" převede na HTML text
}

// zobrazí krátkou potvrzovací hlášku dole vpravo (např. "Uloženo")
function hlaska(text) {
  var el = document.getElementById('hlaskaBox'); // najde element, kam se hláška vypisuje
  el.textContent = text;                          // nastaví text hlášky
  el.classList.remove('skryto');                  // zobrazí ji (odebere třídu, co ji skrývá)
  setTimeout(function () {                        // po 2.5 sekundy...
    el.classList.add('skryto');                   // ...ji zase schová
  }, 2500);
}
