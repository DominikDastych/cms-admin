# Tahák na obhajobu

Účel tohodle souboru: když se u obhajoby zeptají na konkrétní věc,
tady najdeš přesně který soubor otevřít a co říct. Žádný soubor
nemá přes 160 řádků, takže je najdeš rychle a nemusíš scrollovat.

## Mapa souborů (co je kde)

| Soubor | Co v něm je |
|---|---|
| `data.js` | ukládání dat do localStorage, hash hesla |
| `ucet.js` | přihlášení, registrace, odhlášení |
| `hlavni.js` | start appky, přepínání sekcí, přehled |
| `stranky.js` | správa stránek |
| `prispevky.js` | správa příspěvků |
| `kategorie.js` | správa kategorií |
| `nastaveni.js` | profil, heslo, název webu |
| `nahled.js` | náhled stránky/příspěvku |

Pravidlo: název souboru = název sekce v menu. "Kde je X?" → soubor
`X.js`. Kategorie → `kategorie.js`, nastavení → `nastaveni.js` atd.
Uvnitř souboru pak hledej funkci podle jména - jsou v češtině a
popisují přesně, co dělají (`ulozitStranku`, `smazatKategorii`...).

## Konkrétní otázky, které padnou nejčastěji

**Kde a jak se ukládají data, když nemáte databázi?**
`data.js`, funkce `nacti()` a `uloz()`. Všechno (uživatelé, stránky,
příspěvky, kategorie, nastavení) je jeden objekt uložený v
`localStorage` prohlížeče pod klíčem `cmsData`. `nacti()` ho přečte
a rozparsuje z textu (JSON), `uloz()` ho zase převede na text a
uloží zpátky.

**Jak funguje přihlášení?**
`ucet.js`, funkce `prihlasit()`. Najde uživatele podle jména,
spočítá hash zadaného hesla a porovná ho s uloženým hashem. Když
sedí, uloží se ID uživatele do `data.prihlasenyId` a zobrazí se
appka.

**Proč není heslo uložené normálně, jako text?**
`data.js`, funkce `jednoducheHash()`. Heslo se před uložením přežene
přes jednoduchý matematický výpočet, takže v datech není vidět
přímo. Není to skutečné bezpečnostní šifrování jako používají
opravdové weby (to se dělá přes silnější algoritmy jako bcrypt, a
obvykle na serveru) - tady jde jen o to, aby heslo nebylo v
localStorage čitelné na první pohled.

**Jak funguje registrace?**
`ucet.js`, funkce `registrovat()`. Zkontroluje, že jméno má aspoň
3 znaky, heslo aspoň 4, a že takové jméno už neexistuje. Pak vytvoří
nového uživatele stejným způsobem jako demo účet.

**Kde je CRUD (přidat/upravit/smazat) pro stránky/příspěvky/kategorie?**
`stranky.js` / `prispevky.js` / `kategorie.js` - každý má stejnou
strukturu čtyř funkcí: `vykresli*()` (vykreslí tabulku), `novy*()`
(otevře prázdný formulář), `ulozit*()` (uloží nový nebo upravený
záznam - pozná se podle toho, jestli formulář má vyplněné skryté
ID), `smazat*()` (smaže po potvrzení).

**Jak příspěvek ví, do jaké kategorie patří?**
`prispevky.js`, pole `kategorieId` u příspěvku ukládá jen ID
kategorie (ne celý název), stejně jako to funguje v databázích -
funkce `nazevKategorie()` pak podle ID dohledá název pro zobrazení.

**Co se stane, když smažu kategorii, kterou má přiřazenou příspěvek?**
`kategorie.js`, funkce `smazatKategorii()`. Appka nejdřív spočítá,
kolik příspěvků tu kategorii používá, upozorní na to v potvrzovací
hlášce, a po potvrzení všem těm příspěvkům nastaví kategorii na
`null` (zobrazí se jim "Bez kategorie") - teprve pak kategorii
smaže.

**Kde je náhled stránky/příspěvku?**
`nahled.js`, funkce `zobrazNahled()`. Dostane titulek, obsah, stav
a případně název kategorie, a vykreslí je do jedné sekce, jako by to
viděl návštěvník webu. Tlačítko "Zpět" (`zavritNahled()`) se vrátí
na sekci, ze které se náhled otevřel - appka si ji pamatuje v
proměnné `predchoziSekce`.

**Kde je nastavení a jak funguje změna hesla?**
`nastaveni.js`. Funkce `zmenitHeslo()` nejdřív ověří staré heslo
stejným způsobem jako přihlášení (porovná hash), a jen když sedí,
uloží nový hash místo starého.

**Jak appka funguje offline?**
Dvě věci dohromady:
1. `sw.js` (Service Worker) - při první návštěvě si do cache
   prohlížeče uloží všechny soubory appky (HTML, CSS, JS...), takže
   se příště appka načte i bez internetu.
2. Všechna data jsou v `localStorage`, ne na nějakém serveru, takže
   appka nikam po síti nic neposílá - proto offline funguje i
   přidávání/úprava/mazání, ne jen prohlížení.

**Proč je JavaScript rozdělený do víc souborů a ne v jednom?**
Aby se v tom dalo rychle orientovat - každý soubor odpovídá jedné
sekci v menu a dělá jen jednu věc. Když se zeptáte na kategorie,
stačí otevřít `kategorie.js` (114 řádků) místo hledání v jednom
velkém souboru.

**Proč mají stránky a příspěvky skoro identický kód?**
Schválně nejsou spojené do jedné obecné funkce - i když by to ušlo
míň kódu, bylo by pak potřeba appce rozumět o úroveň hlouběji
(parametry, obecné názvy proměnných). Takhle je `stranky.js` a
`prispevky.js` možné vysvětlit úplně stejně, jeden po druhém,
odděleně.
