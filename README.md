# Administrace webu - školní projekt

Jednoduché webové administrační rozhraní pro přihlášení a správu
stránek, příspěvků a kategorií. Běží celé v prohlížeči - žádný
server, žádná databáze jako MySQL. Data se ukládají do `localStorage`
(uložiště přímo v prohlížeči), takže appka funguje i bez internetu.

## Jak to spustit

Aby fungoval Service Worker (kvůli offline režimu), appka se musí
spouštět přes lokální server, ne otevřením souboru přímo dvojklikem.

Nejjednodušší je Python (bývá skoro všude nainstalovaný):

```
cd cms-admin
python3 -m http.server 8080
```

Pak stačí v prohlížeči otevřít `http://localhost:8080`.

Jde to i přes VS Code rozšíření "Live Server" (pravým tlačítkem na
`index.html` → Open with Live Server).

Zkušební účet, který se založí automaticky při prvním spuštění:
- uživatelské jméno: `admin`
- heslo: `admin123`

Nový účet jde založit i přes "Zaregistruj se".

## Soubory v projektu

- `index.html` - celé rozhraní (přihlášení i administrace)
- `style.css` - vzhled
- `sw.js` - Service Worker, díky kterému appka funguje offline
- `manifest.json` - základní info o appce pro instalaci jako PWA
- `icons/` - ikony appky

JavaScript logika je rozdělená do víc menších souborů podle toho, co
dělají (žádný z nich nemá přes 160 řádků), aby se v tom dalo rychle
najít, co člověk zrovna hledá:

- `data.js` - ukládání do localStorage, hash hesla, pomocné funkce
- `ucet.js` - přihlášení, registrace, odhlášení
- `hlavni.js` - spuštění appky, přepínání sekcí, přehled/statistiky
- `stranky.js` - správa stránek (přidat/upravit/smazat)
- `prispevky.js` - správa příspěvků (přidat/upravit/smazat, kategorie)
- `kategorie.js` - správa kategorií (přidat/upravit/smazat)
- `nastaveni.js` - profil, změna hesla, název webu
- `nahled.js` - náhled stránky/příspěvku

Viz taky `OBHAJOBA.md` - tahák s tím, kde přesně najít odpověď na
typické otázky u obhajoby.

## Jak appka funguje (stručně)

Všechna data (uživatelé, stránky, příspěvky, kategorie) jsou uložená
v jednom velkém objektu v `localStorage` pod klíčem `cmsData`. Funkce
`nacti()` ho přečte, `uloz()` ho zase uloží zpátky. Každá sekce
(stránky, příspěvky, kategorie) má stejný princip: funkce na
vykreslení tabulky, funkce na otevření formuláře pro přidání/úpravu
a funkce na uložení/smazání.

Heslo se neukládá v čitelné podobě, ale přehází se přes jednoduchou
funkci `jednoducheHash()`. Není to skutečné šifrování jako v
opravdových aplikacích (to dělají třeba přes bcrypt na serveru), ale
pro projekt bez serveru je to dostačující zjednodušení.

Offline režim zajišťuje `sw.js` (Service Worker) - při první návštěvě
si uloží všechny soubory appky do cache prohlížeče, takže se příště
appka načte i bez internetu. Protože data jsou stejně jen v
localStorage a appka nikam nic po síti neposílá, funguje offline i
veškeré přidávání/úprava/mazání obsahu, ne jen prohlížení.

## Co zadání požadovalo a kde to je

- **Přihlášení/registrace + nastavení** → přihlašovací obrazovka +
  sekce Nastavení (jméno, heslo, název webu)
- **Správa stránek** → sekce Stránky (přidat, upravit, smazat)
- **Správa příspěvků** → sekce Příspěvky (přidat, upravit, smazat,
  přiřadit kategorii)
- **Správa kategorií** → sekce Kategorie (přidat, upravit, smazat)
- **Náhled stránky/příspěvku** → tlačítko "Náhled" u každé položky
- **Funguje offline** → `sw.js` + data v `localStorage`
