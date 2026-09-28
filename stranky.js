/*
  stranky.js
  ----------
  Kompletní správa stránek: výpis, přidání, úprava, smazání, náhled.

  OBHAJOBA: otázka "kde je správa stránek" -> je to tady, celá.
*/

// vykreslí tabulku se všemi stránkami
function vykresliStranky() {
  var data = nacti();                                     // načte data
  var tbody = document.getElementById('tabulkaStranky');  // tělo tabulky, kam se řádky vloží
  tbody.innerHTML = '';                                    // nejdřív ho vyprázdní

  if (data.stranky.length === 0) {                         // pokud nejsou žádné stránky
    tbody.innerHTML = '<tr><td colspan="4">Zatím žádné stránky.</td></tr>'; // zobrazí hlášku místo tabulky
    return;
  }

  var serazene = data.stranky.slice().sort(function (a, b) { // seřadí kopii pole podle data úpravy
    return b.upraveno - a.upraveno;                           // nejnovější nahoře
  });

  for (var i = 0; i < serazene.length; i++) {              // projde všechny stránky
    var s = serazene[i];                                    // aktuální stránka
    var stavText = s.stav === 'publikovano' ? 'Publikováno' : 'Koncept'; // text stavu pro zobrazení
    var radek = document.createElement('tr');               // vytvoří nový řádek tabulky
    radek.innerHTML =                                        // naplní ho sloupci a tlačítky
      '<td>' + escapovat(s.titulek) + '</td>' +
      '<td><span class="stav-' + s.stav + '">' + stavText + '</span></td>' +
      '<td>' + formatDatum(s.upraveno) + '</td>' +
      '<td>' +
        '<button onclick="nahledStranky(\'' + s.id + '\')">Náhled</button>' +
        '<button onclick="upravitStranku(\'' + s.id + '\')">Upravit</button>' +
        '<button onclick="smazatStranku(\'' + s.id + '\')">Smazat</button>' +
      '</td>';
    tbody.appendChild(radek); // přidá řádek do tabulky
  }
}

// otevře prázdný formulář pro novou stránku
function novaStranka() {
  document.getElementById('strankaId').value = '';                           // skryté ID je prázdné = jde o novou stránku
  document.getElementById('strankaTitulek').value = '';                      // vyprázdní titulek
  document.getElementById('strankaObsah').value = '';                        // vyprázdní obsah
  document.getElementById('strankaStav').value = 'koncept';                  // výchozí stav je koncept
  document.getElementById('strankaChyba').textContent = '';                  // vymaže chybu
  document.getElementById('formStrankyNadpis').textContent = 'Nová stránka'; // nadpis formuláře
  document.getElementById('formStranky').classList.remove('skryto');         // zobrazí formulář
}

// otevře formulář předvyplněný existující stránkou (úprava)
function upravitStranku(id) {
  var data = nacti(); // načte data
  var s = null;         // sem se uloží nalezená stránka
  for (var i = 0; i < data.stranky.length; i++) {
    if (data.stranky[i].id === id) s = data.stranky[i]; // najde stránku podle ID
  }
  if (!s) return; // pokud neexistuje, nic nedělá

  document.getElementById('strankaId').value = s.id;                             // uloží ID do skrytého pole (jde o úpravu)
  document.getElementById('strankaTitulek').value = s.titulek;                   // předvyplní titulek
  document.getElementById('strankaObsah').value = s.obsah;                       // předvyplní obsah
  document.getElementById('strankaStav').value = s.stav;                         // předvyplní stav
  document.getElementById('strankaChyba').textContent = '';                      // vymaže chybu
  document.getElementById('formStrankyNadpis').textContent = 'Upravit stránku';  // nadpis formuláře
  document.getElementById('formStranky').classList.remove('skryto');             // zobrazí formulář
}

// zavře formulář stránky bez uložení
function zrusitFormStranky() {
  document.getElementById('formStranky').classList.add('skryto'); // schová formulář
}

// uloží novou nebo upravenou stránku
function ulozitStranku() {
  var titulek = document.getElementById('strankaTitulek').value.trim(); // přečte titulek
  if (!titulek) {                                                       // titulek je povinný
    document.getElementById('strankaChyba').textContent = 'Titulek je povinný.';
    return;
  }

  var data = nacti();                                          // načte data
  var id = document.getElementById('strankaId').value;         // skryté ID (prázdné = nová stránka)
  var obsah = document.getElementById('strankaObsah').value;   // přečte obsah
  var stav = document.getElementById('strankaStav').value;     // přečte stav

  if (id) {                                                     // pokud ID existuje, jde o úpravu
    for (var i = 0; i < data.stranky.length; i++) {
      if (data.stranky[i].id === id) {                          // najde stránku podle ID
        data.stranky[i].titulek = titulek;                      // přepíše titulek
        data.stranky[i].obsah = obsah;                          // přepíše obsah
        data.stranky[i].stav = stav;                            // přepíše stav
        data.stranky[i].upraveno = Date.now();                  // aktualizuje čas úpravy
      }
    }
  } else {                          // jinak jde o novou stránku
    data.stranky.push({
      id: vytvorId(),               // nové ID
      titulek: titulek,             // titulek
      obsah: obsah,                 // obsah
      stav: stav,                   // stav
      vytvoreno: Date.now(),        // čas vytvoření
      upraveno: Date.now()          // čas poslední úpravy (zatím stejný)
    });
  }

  uloz(data);                                                     // uloží data
  document.getElementById('formStranky').classList.add('skryto'); // schová formulář
  vykresliStranky();                                                // znovu vykreslí tabulku
  hlaska('Stránka byla uložena.');                                   // zobrazí potvrzovací hlášku
}

// smaže stránku po potvrzení
function smazatStranku(id) {
  if (!confirm('Opravdu smazat tuto stránku?')) return; // zeptá se na potvrzení
  var data = nacti();                                     // načte data
  data.stranky = data.stranky.filter(function (s) { return s.id !== id; }); // odstraní stránku s daným ID
  uloz(data);                          // uloží data
  vykresliStranky();                    // znovu vykreslí tabulku
  hlaska('Stránka byla smazána.');       // potvrzovací hláška
}

// zobrazí náhled stránky
function nahledStranky(id) {
  var data = nacti(); // načte data
  var s = null;         // nalezená stránka
  for (var i = 0; i < data.stranky.length; i++) {
    if (data.stranky[i].id === id) s = data.stranky[i]; // najde stránku podle ID
  }
  if (!s) return; // pokud neexistuje, nic nedělá
  zobrazNahled(s.titulek, s.obsah, s.stav, null); // zobrazí náhled (stránka nemá kategorii, proto null)
}
