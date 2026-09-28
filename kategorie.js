/*
  kategorie.js
  ------------
  Kompletní správa kategorií (rubrik): výpis, přidání, úprava, smazání.

  OBHAJOBA: otázka "kde je správa kategorií" -> je to tady, celá.
*/

// vykreslí tabulku se všemi kategoriemi
function vykresliKategorie() {
  var data = nacti();                                       // načte data
  var tbody = document.getElementById('tabulkaKategorie');  // tělo tabulky
  tbody.innerHTML = '';                                      // vyprázdní ho

  if (data.kategorie.length === 0) { // žádné kategorie
    tbody.innerHTML = '<tr><td colspan="4">Zatím žádné kategorie.</td></tr>';
    return;
  }

  for (var i = 0; i < data.kategorie.length; i++) { // projde kategorie
    var k = data.kategorie[i];
    var pocetPrispevku = 0; // počítadlo příspěvků v této kategorii
    for (var j = 0; j < data.prispevky.length; j++) {
      if (data.prispevky[j].kategorieId === k.id) pocetPrispevku++; // spočítá příspěvky patřící do kategorie
    }
    var radek = document.createElement('tr'); // nový řádek
    radek.innerHTML =                          // naplní ho daty a tlačítky
      '<td>' + escapovat(k.nazev) + '</td>' +
      '<td>' + escapovat(k.popis || '') + '</td>' +
      '<td>' + pocetPrispevku + '</td>' +
      '<td>' +
        '<button onclick="upravitKategorii(\'' + k.id + '\')">Upravit</button>' +
        '<button onclick="smazatKategorii(\'' + k.id + '\')">Smazat</button>' +
      '</td>';
    tbody.appendChild(radek); // přidá řádek do tabulky
  }
}

// otevře prázdný formulář pro novou kategorii
function novaKategorie() {
  document.getElementById('kategorieId').value = '';                             // prázdné ID = nová kategorie
  document.getElementById('kategorieNazev').value = '';                          // vyprázdní název
  document.getElementById('kategoriePopis').value = '';                          // vyprázdní popis
  document.getElementById('kategorieChyba').textContent = '';                    // vymaže chybu
  document.getElementById('formKategorieNadpis').textContent = 'Nová kategorie'; // nadpis formuláře
  document.getElementById('formKategorie').classList.remove('skryto');           // zobrazí formulář
}

// otevře formulář předvyplněný existující kategorií (úprava)
function upravitKategorii(id) {
  var data = nacti(); // načte data
  var k = null;         // nalezená kategorie
  for (var i = 0; i < data.kategorie.length; i++) {
    if (data.kategorie[i].id === id) k = data.kategorie[i]; // najde podle ID
  }
  if (!k) return; // neexistuje -> konec

  document.getElementById('kategorieId').value = k.id;                              // uloží ID (jde o úpravu)
  document.getElementById('kategorieNazev').value = k.nazev;                        // předvyplní název
  document.getElementById('kategoriePopis').value = k.popis || '';                  // předvyplní popis
  document.getElementById('kategorieChyba').textContent = '';                       // vymaže chybu
  document.getElementById('formKategorieNadpis').textContent = 'Upravit kategorii'; // nadpis
  document.getElementById('formKategorie').classList.remove('skryto');              // zobrazí formulář
}

// zavře formulář kategorie bez uložení
function zrusitFormKategorie() {
  document.getElementById('formKategorie').classList.add('skryto'); // schová formulář
}

// uloží novou nebo upravenou kategorii
function ulozitKategorii() {
  var nazev = document.getElementById('kategorieNazev').value.trim(); // přečte název
  if (!nazev) {                                                        // název je povinný
    document.getElementById('kategorieChyba').textContent = 'Název je povinný.';
    return;
  }

  var data = nacti();                                                  // načte data
  var id = document.getElementById('kategorieId').value;               // skryté ID (prázdné = nová)
  var popis = document.getElementById('kategoriePopis').value.trim();  // přečte popis

  if (id) { // existuje ID -> úprava
    for (var i = 0; i < data.kategorie.length; i++) {
      if (data.kategorie[i].id === id) {
        data.kategorie[i].nazev = nazev; // přepíše název
        data.kategorie[i].popis = popis;  // přepíše popis
      }
    }
  } else { // jinak nová kategorie
    data.kategorie.push({ id: vytvorId(), nazev: nazev, popis: popis });
  }

  uloz(data);                                                       // uloží data
  document.getElementById('formKategorie').classList.add('skryto'); // schová formulář
  vykresliKategorie();                                                // znovu vykreslí tabulku
  hlaska('Kategorie byla uložena.');                                   // potvrzovací hláška
}

// smaže kategorii po potvrzení (a odebere ji z příspěvků, které ji používaly)
function smazatKategorii(id) {
  var data = nacti(); // načte data
  var pocet = 0;         // kolik příspěvků kategorii používá
  for (var i = 0; i < data.prispevky.length; i++) {
    if (data.prispevky[i].kategorieId === id) pocet++; // spočítá je
  }

  var zprava = pocet > 0 // sestaví text potvrzení
    ? 'Tuto kategorii používá ' + pocet + ' příspěvek/ů. Po smazání jim bude kategorie odebrána. Pokračovat?'
    : 'Opravdu smazat tuto kategorii?';
  if (!confirm(zprava)) return; // pokud uživatel nepotvrdí, nic se nestane

  for (var j = 0; j < data.prispevky.length; j++) {
    if (data.prispevky[j].kategorieId === id) data.prispevky[j].kategorieId = null; // příspěvkům zruší kategorii
  }
  data.kategorie = data.kategorie.filter(function (k) { return k.id !== id; }); // odstraní kategorii ze seznamu
  uloz(data);                        // uloží data
  vykresliKategorie();                // znovu vykreslí tabulku
  hlaska('Kategorie byla smazána.');   // potvrzovací hláška
}
