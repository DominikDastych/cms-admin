/*
  prispevky.js
  ------------
  Kompletní správa příspěvků: výpis, přidání, úprava, smazání, náhled.
  Je to skoro to samé jako stranky.js, jen navíc příspěvek může mít
  přiřazenou kategorii.

  OBHAJOBA: otázka "kde je správa příspěvků" nebo "jak se přiřazuje
  kategorie" -> je to tady.
*/

// naplní <select> v formuláři seznamem kategorií (pro výběr u příspěvku)
function naplnVyberKategorii(vybranaId) {
  var data = nacti();                                            // načte data
  var select = document.getElementById('prispevekKategorie');    // element <select>
  select.innerHTML = '<option value="">Bez kategorie</option>';  // první možnost = žádná kategorie
  for (var i = 0; i < data.kategorie.length; i++) {               // projde všechny kategorie
    var k = data.kategorie[i];
    var option = document.createElement('option'); // vytvoří novou možnost
    option.value = k.id;                            // hodnota = ID kategorie
    option.textContent = k.nazev;                    // text = název kategorie
    if (k.id === vybranaId) option.selected = true;   // pokud je to aktuálně vybraná kategorie, označí ji
    select.appendChild(option);                        // přidá možnost do selectu
  }
}

// podle ID kategorie vrátí její název (pro zobrazení v tabulce/náhledu)
function nazevKategorie(kategorieId) {
  var data = nacti(); // načte data
  for (var i = 0; i < data.kategorie.length; i++) {
    if (data.kategorie[i].id === kategorieId) return data.kategorie[i].nazev; // najde a vrátí název
  }
  return 'Bez kategorie'; // žádná kategorie nenalezena
}

// vykreslí tabulku se všemi příspěvky
function vykresliPrispevky() {
  var data = nacti();                                        // načte data
  var tbody = document.getElementById('tabulkaPrispevky');   // tělo tabulky
  tbody.innerHTML = '';                                       // vyprázdní ho

  if (data.prispevky.length === 0) { // žádné příspěvky
    tbody.innerHTML = '<tr><td colspan="5">Zatím žádné příspěvky.</td></tr>';
    return;
  }

  var serazene = data.prispevky.slice().sort(function (a, b) { // seřadí podle data úpravy
    return b.upraveno - a.upraveno;                             // nejnovější nahoře
  });

  for (var i = 0; i < serazene.length; i++) {                 // projde příspěvky
    var p = serazene[i];
    var stavText = p.stav === 'publikovano' ? 'Publikováno' : 'Koncept'; // text stavu
    var radek = document.createElement('tr');                  // nový řádek
    radek.innerHTML =                                            // naplní ho daty a tlačítky
      '<td>' + escapovat(p.titulek) + '</td>' +
      '<td>' + escapovat(nazevKategorie(p.kategorieId)) + '</td>' +
      '<td><span class="stav-' + p.stav + '">' + stavText + '</span></td>' +
      '<td>' + formatDatum(p.upraveno) + '</td>' +
      '<td>' +
        '<button onclick="nahledPrispevku(\'' + p.id + '\')">Náhled</button>' +
        '<button onclick="upravitPrispevek(\'' + p.id + '\')">Upravit</button>' +
        '<button onclick="smazatPrispevek(\'' + p.id + '\')">Smazat</button>' +
      '</td>';
    tbody.appendChild(radek); // přidá řádek do tabulky
  }
}

// otevře prázdný formulář pro nový příspěvek
function novyPrispevek() {
  document.getElementById('prispevekId').value = '';                              // prázdné ID = nový příspěvek
  document.getElementById('prispevekTitulek').value = '';                         // vyprázdní titulek
  document.getElementById('prispevekObsah').value = '';                           // vyprázdní obsah
  document.getElementById('prispevekStav').value = 'koncept';                     // výchozí stav
  document.getElementById('prispevekChyba').textContent = '';                     // vymaže chybu
  naplnVyberKategorii(null);                                                       // naplní select kategorií, nic není vybrané
  document.getElementById('formPrispevkyNadpis').textContent = 'Nový příspěvek';  // nadpis formuláře
  document.getElementById('formPrispevky').classList.remove('skryto');            // zobrazí formulář
}

// otevře formulář předvyplněný existujícím příspěvkem (úprava)
function upravitPrispevek(id) {
  var data = nacti(); // načte data
  var p = null;         // nalezený příspěvek
  for (var i = 0; i < data.prispevky.length; i++) {
    if (data.prispevky[i].id === id) p = data.prispevky[i]; // najde podle ID
  }
  if (!p) return; // neexistuje -> konec

  document.getElementById('prispevekId').value = p.id;                               // uloží ID (jde o úpravu)
  document.getElementById('prispevekTitulek').value = p.titulek;                     // předvyplní titulek
  document.getElementById('prispevekObsah').value = p.obsah;                         // předvyplní obsah
  document.getElementById('prispevekStav').value = p.stav;                           // předvyplní stav
  document.getElementById('prispevekChyba').textContent = '';                        // vymaže chybu
  naplnVyberKategorii(p.kategorieId);                                                 // naplní select a označí aktuální kategorii
  document.getElementById('formPrispevkyNadpis').textContent = 'Upravit příspěvek';  // nadpis
  document.getElementById('formPrispevky').classList.remove('skryto');               // zobrazí formulář
}

// zavře formulář příspěvku bez uložení
function zrusitFormPrispevky() {
  document.getElementById('formPrispevky').classList.add('skryto'); // schová formulář
}

// uloží nový nebo upravený příspěvek
function ulozitPrispevek() {
  var titulek = document.getElementById('prispevekTitulek').value.trim(); // přečte titulek
  if (!titulek) {                                                          // titulek je povinný
    document.getElementById('prispevekChyba').textContent = 'Titulek je povinný.';
    return;
  }

  var data = nacti();                                                     // načte data
  var id = document.getElementById('prispevekId').value;                  // skryté ID (prázdné = nový)
  var obsah = document.getElementById('prispevekObsah').value;            // přečte obsah
  var stav = document.getElementById('prispevekStav').value;              // přečte stav
  var kategorieId = document.getElementById('prispevekKategorie').value || null; // vybraná kategorie (nebo null)

  if (id) { // existuje ID -> úprava
    for (var i = 0; i < data.prispevky.length; i++) {
      if (data.prispevky[i].id === id) {
        data.prispevky[i].titulek = titulek;         // přepíše titulek
        data.prispevky[i].obsah = obsah;              // přepíše obsah
        data.prispevky[i].stav = stav;                 // přepíše stav
        data.prispevky[i].kategorieId = kategorieId;    // přepíše kategorii
        data.prispevky[i].upraveno = Date.now();         // aktualizuje čas úpravy
      }
    }
  } else { // jinak nový příspěvek
    data.prispevky.push({
      id: vytvorId(),           // nové ID
      titulek: titulek,         // titulek
      obsah: obsah,             // obsah
      stav: stav,               // stav
      kategorieId: kategorieId, // vybraná kategorie
      vytvoreno: Date.now(),    // čas vytvoření
      upraveno: Date.now()      // čas poslední úpravy
    });
  }

  uloz(data);                                                      // uloží data
  document.getElementById('formPrispevky').classList.add('skryto'); // schová formulář
  vykresliPrispevky();                                               // znovu vykreslí tabulku
  hlaska('Příspěvek byl uložen.');                                    // potvrzovací hláška
}

// smaže příspěvek po potvrzení
function smazatPrispevek(id) {
  if (!confirm('Opravdu smazat tento příspěvek?')) return; // potvrzení
  var data = nacti();                                        // načte data
  data.prispevky = data.prispevky.filter(function (p) { return p.id !== id; }); // odstraní příspěvek
  uloz(data);                          // uloží data
  vykresliPrispevky();                  // znovu vykreslí tabulku
  hlaska('Příspěvek byl smazán.');       // potvrzovací hláška
}

// zobrazí náhled příspěvku
function nahledPrispevku(id) {
  var data = nacti(); // načte data
  var p = null;         // nalezený příspěvek
  for (var i = 0; i < data.prispevky.length; i++) {
    if (data.prispevky[i].id === id) p = data.prispevky[i]; // najde podle ID
  }
  if (!p) return; // neexistuje -> konec
  zobrazNahled(p.titulek, p.obsah, p.stav, nazevKategorie(p.kategorieId)); // zobrazí náhled i s názvem kategorie
}
