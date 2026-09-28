/*
  sw.js - Service Worker
  -----------------------
  Stará se o to, aby aplikace fungovala i offline.

  Při instalaci si uloží všechny soubory appky do "cache" (uložiště
  v prohlížeči). Při každém dalším požadavku se appka nejdřív podívá
  do cache - pokud tam soubor je, použije ho rovnou a nemusí čekat
  na internet.

  Poznámka: Service Worker funguje jen když appku spouštíme přes
  lokální server (http://localhost...), ne při otevření souboru
  přímo dvojklikem. Viz README.md.
*/

var NAZEV_CACHE = 'cms-admin-cache-v1';

var SOUBORY_K_ULOZENI = [
  './',
  'index.html',
  'style.css',
  'data.js',
  'ucet.js',
  'hlavni.js',
  'stranky.js',
  'prispevky.js',
  'kategorie.js',
  'nastaveni.js',
  'nahled.js',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(NAZEV_CACHE).then(function (cache) {
      return cache.addAll(SOUBORY_K_ULOZENI);
    })
  );
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (odpovedZCache) {
      // Pokud soubor máme v cache, použijeme ho. Jinak zkusíme síť.
      return odpovedZCache || fetch(event.request);
    })
  );
});
