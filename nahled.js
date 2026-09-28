/*
  nahled.js
  ---------
  Náhled stránky/příspěvku - to, co by viděl návštěvník webu.

  OBHAJOBA: otázka "kde je náhled" -> je to tady, funkce zobrazNahled().
*/

var predchoziSekce = 'prehled'; // aby tlačítko "Zpět" u náhledu vědělo, kam se vrátit

// zobrazí náhled stránky/příspěvku (titulek, obsah, stav, případně kategorii)
function zobrazNahled(titulek, obsah, stav, kategorieNazev) {
  // Zapamatujeme si aktuální sekci, aby tlačítko "Zpět" vědělo,
  // kam se má vrátit (Stránky nebo Příspěvky).
  var zobrazenaSekce = document.querySelector('.sekce:not(.skryto)'); // najde aktuálně viditelnou sekci
  if (zobrazenaSekce && zobrazenaSekce.id !== 'sekce-nahled') {       // pokud to není zrovna náhled
    predchoziSekce = zobrazenaSekce.id.replace('sekce-', '');         // zapamatuje si její název
  }

  var data = nacti();                                                // načte data (kvůli názvu webu)
  var stavText = stav === 'publikovano' ? 'Publikováno' : 'Koncept';  // text stavu
  var meta = stavText;                                                // řádek s metadaty pod titulkem
  if (kategorieNazev) {                                               // pokud má kategorii
    meta += ' &middot; ' + escapovat(kategorieNazev);                 // přidá ji za tečku
  }

  var box = document.getElementById('nahledBox'); // element, kam se náhled vykreslí
  box.innerHTML =                                   // sestaví náhled, jako by ho viděl návštěvník
    '<p class="mala-poznamka">' + escapovat(data.nastaveni.nazevWebu) + '</p>' +
    '<h1>' + escapovat(titulek) + '</h1>' +
    '<p class="nahled-meta">' + meta + '</p>' +
    '<div class="nahled-obsah">' + escapovat(obsah || '(bez obsahu)') + '</div>';

  var vsechnySekce = document.querySelectorAll('.sekce'); // všechny sekce
  for (var i = 0; i < vsechnySekce.length; i++) {
    vsechnySekce[i].classList.add('skryto'); // schová je všechny
  }
  document.getElementById('sekce-nahled').classList.remove('skryto'); // a zobrazí jen náhled
}

// zavře náhled a vrátí se na sekci, ze které byl otevřený
function zavritNahled() {
  zobrazSekci(predchoziSekce); // zobrazí zapamatovanou předchozí sekci
}
