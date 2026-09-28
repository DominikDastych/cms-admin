/*
  nastaveni.js
  ------------
  Sekce Nastavení: úprava jména, změna hesla, název webu.

  OBHAJOBA: otázka "kde je nastavení / jak se mění heslo" -> je to
  tady, celé.
*/

// naplní formuláře v Nastavení aktuálními hodnotami
function vykresliNastaveni() {
  var data = nacti();                                                                // načte data
  var uzivatel = aktualniUzivatel();                                                 // zjistí přihlášeného uživatele
  document.getElementById('nastaveniJmeno').value = uzivatel ? uzivatel.jmeno : '';  // předvyplní jméno
  document.getElementById('nastaveniStareHeslo').value = '';                         // pole hesla nechá prázdná
  document.getElementById('nastaveniNoveHeslo').value = '';                          // pole hesla nechá prázdná
  document.getElementById('nastaveniChyba').textContent = '';                        // vymaže chybu
  document.getElementById('nastaveniNazevWebu').value = data.nastaveni.nazevWebu;    // předvyplní název webu
}

// uloží nové zobrazované jméno uživatele
function ulozitProfil() {
  var jmeno = document.getElementById('nastaveniJmeno').value.trim(); // přečte jméno
  if (!jmeno) return; // prázdné jméno se neuloží

  var data = nacti(); // načte data
  for (var i = 0; i < data.uzivatele.length; i++) {
    if (data.uzivatele[i].id === data.prihlasenyId) { // najde přihlášeného uživatele
      data.uzivatele[i].jmeno = jmeno;                 // přepíše jeho jméno
    }
  }
  uloz(data);                                                     // uloží data
  document.getElementById('jmenoUzivatele').textContent = jmeno;  // aktualizuje jméno i v hlavičce
  hlaska('Profil byl uložen.');                                     // potvrzovací hláška
}

// změní heslo přihlášeného uživatele
function zmenitHeslo() {
  var stareHeslo = document.getElementById('nastaveniStareHeslo').value; // přečte staré heslo
  var noveHeslo = document.getElementById('nastaveniNoveHeslo').value;   // přečte nové heslo
  var chybaEl = document.getElementById('nastaveniChyba');               // element pro chybu
  chybaEl.textContent = '';                                              // vymaže chybu

  var data = nacti();  // načte data
  var uzivatel = null; // přihlášený uživatel
  for (var i = 0; i < data.uzivatele.length; i++) {
    if (data.uzivatele[i].id === data.prihlasenyId) uzivatel = data.uzivatele[i]; // najde ho
  }

  if (!uzivatel || uzivatel.heslo !== jednoducheHash(stareHeslo)) { // staré heslo nesedí
    chybaEl.textContent = 'Současné heslo není správně.';
    return;
  }
  if (noveHeslo.length < 4) { // nové heslo je moc krátké
    chybaEl.textContent = 'Nové heslo musí mít alespoň 4 znaky.';
    return;
  }

  uzivatel.heslo = jednoducheHash(noveHeslo);                 // uloží nové heslo jako hash
  uloz(data);                                                 // uloží data
  document.getElementById('nastaveniStareHeslo').value = '';  // vyprázdní pole starého hesla
  document.getElementById('nastaveniNoveHeslo').value = '';   // vyprázdní pole nového hesla
  hlaska('Heslo bylo změněno.');                                // potvrzovací hláška
}

// uloží nový název webu (zobrazuje se v náhledu)
function ulozitNazevWebu() {
  var nazev = document.getElementById('nastaveniNazevWebu').value.trim() || 'Můj web'; // přečte název (nebo výchozí)
  var data = nacti();               // načte data
  data.nastaveni.nazevWebu = nazev; // přepíše název webu
  uloz(data);                        // uloží data
  hlaska('Název webu byl uložen.');   // potvrzovací hláška
}
