/*
  ucet.js
  -------
  Přihlášení, registrace, odhlášení a práce s přihlášeným uživatelem.

  OBHAJOBA: otázka "jak funguje přihlášení/registrace" -> je to tady,
  funkce prihlasit() a registrovat().
*/

// při úplně prvním spuštění appky vytvoří zkušební účet admin/admin123
function zajistiDemoUcet() {
  var data = nacti();                    // načte aktuální data
  if (data.uzivatele.length === 0) {     // pokud ještě neexistuje žádný uživatel
    data.uzivatele.push({                // přidá nový demo účet
      id: vytvorId(),                    // vygeneruje mu ID
      jmeno: 'Administrátor',            // zobrazované jméno
      username: 'admin',                 // přihlašovací jméno
      heslo: jednoducheHash('admin123')  // heslo uložené jako hash, ne v čitelné podobě
    });
    uloz(data);                          // uloží data zpátky
  }
}

// přepne přihlašovací obrazovku na registrační formulář
function prepniNaRegistraci() {
  document.getElementById('loginForm').classList.add('skryto');       // schová přihlašovací formulář
  document.getElementById('registerForm').classList.remove('skryto'); // zobrazí registrační formulář
}

// přepne registrační formulář zpátky na přihlašovací
function prepniNaPrihlaseni() {
  document.getElementById('registerForm').classList.add('skryto'); // schová registrační formulář
  document.getElementById('loginForm').classList.remove('skryto'); // zobrazí přihlašovací formulář
}

// ověří přihlašovací údaje a přihlásí uživatele
function prihlasit() {
  var username = document.getElementById('loginUsername').value.trim(); // přečte zadané jméno
  var heslo = document.getElementById('loginPassword').value;           // přečte zadané heslo
  var chybaEl = document.getElementById('loginChyba');                  // element pro chybovou hlášku
  chybaEl.textContent = '';                                             // nejdřív chybu vymaže

  var data = nacti();  // načte data
  var uzivatel = null; // sem se uloží nalezený uživatel (pokud existuje)
  for (var i = 0; i < data.uzivatele.length; i++) {                            // projde všechny uživatele
    if (data.uzivatele[i].username.toLowerCase() === username.toLowerCase()) { // porovná jméno (bez ohledu na velikost písmen)
      uzivatel = data.uzivatele[i];                                            // našel shodu
    }
  }

  if (!uzivatel || uzivatel.heslo !== jednoducheHash(heslo)) {    // uživatel neexistuje NEBO heslo nesedí
    chybaEl.textContent = 'Špatné uživatelské jméno nebo heslo.'; // zobrazí chybu
    return;                                                       // a přihlášení se přeruší
  }

  data.prihlasenyId = uzivatel.id; // zapamatuje si, kdo je přihlášený
  uloz(data);                      // uloží tu informaci
  zobrazApp();                     // zobrazí administraci
}

// vytvoří nový uživatelský účet
function registrovat() {
  var jmeno = document.getElementById('regJmeno').value.trim();       // zobrazované jméno
  var username = document.getElementById('regUsername').value.trim(); // přihlašovací jméno
  var heslo = document.getElementById('regPassword').value;           // heslo
  var chybaEl = document.getElementById('regChyba');                  // element pro chybu
  chybaEl.textContent = '';                                           // vymaže předchozí chybu

  if (username.length < 3) {                                            // jméno musí mít aspoň 3 znaky
    chybaEl.textContent = 'Uživatelské jméno musí mít alespoň 3 znaky.';
    return;
  }
  if (heslo.length < 4) {                                               // heslo musí mít aspoň 4 znaky
    chybaEl.textContent = 'Heslo musí mít alespoň 4 znaky.';
    return;
  }

  var data = nacti();                                              // načte data
  for (var i = 0; i < data.uzivatele.length; i++) {                // zkontroluje, jestli jméno už nepoužívá někdo jiný
    if (data.uzivatele[i].username.toLowerCase() === username.toLowerCase()) {
      chybaEl.textContent = 'Toto uživatelské jméno už existuje.';
      return;
    }
  }

  var novyUzivatel = {             // sestaví nového uživatele
    id: vytvorId(),                // vygeneruje ID
    jmeno: jmeno || username,      // pokud jméno nevyplnil, použije se username
    username: username,            // přihlašovací jméno
    heslo: jednoducheHash(heslo)   // heslo se uloží jako hash
  };
  data.uzivatele.push(novyUzivatel);   // přidá uživatele do seznamu
  data.prihlasenyId = novyUzivatel.id; // rovnou ho i přihlásí
  uloz(data);                          // uloží data
  zobrazApp();                         // zobrazí administraci
}

// odhlásí aktuálního uživatele
function odhlasit() {
  var data = nacti();       // načte data
  data.prihlasenyId = null; // zruší info o přihlášení
  uloz(data);                // uloží
  zobrazLogin();              // zobrazí přihlašovací obrazovku
}

// najde a vrátí objekt aktuálně přihlášeného uživatele (nebo null)
function aktualniUzivatel() {
  var data = nacti();                                // načte data
  for (var i = 0; i < data.uzivatele.length; i++) {  // projde uživatele
    if (data.uzivatele[i].id === data.prihlasenyId) { // najde toho, jehož ID sedí s přihlášeným
      return data.uzivatele[i];
    }
  }
  return null; // nikdo není přihlášený
}

// zobrazí přihlašovací obrazovku a schová administraci
function zobrazLogin() {
  document.getElementById('appBox').classList.add('skryto');      // schová administraci
  document.getElementById('loginBox').classList.remove('skryto'); // zobrazí přihlašovací box
}

// zobrazí administraci po úspěšném přihlášení
function zobrazApp() {
  document.getElementById('loginBox').classList.add('skryto');  // schová přihlašovací box
  document.getElementById('appBox').classList.remove('skryto'); // zobrazí administraci
  var uzivatel = aktualniUzivatel();                             // zjistí, kdo je přihlášený
  document.getElementById('jmenoUzivatele').textContent = uzivatel ? uzivatel.jmeno : ''; // vypíše jeho jméno v hlavičce
  zobrazSekci('prehled'); // rovnou zobrazí sekci Přehled
}
