const CACHE_NAME = "A's-Site-v1.01";

const urls = [

"/",
"/index.html",
"/pages/home.html",
"/pages/calendar.html",
"/pages/owner.html",
"/pages/news.html",

"/css/admin.css",
"/css/style.css",
"/css/calendar.css",

"/js/admin.js",
"/js/script.js",
"/js/calendar.js",
"/js/install.js",
"/js/login.js",
"/js/radial-menu.js",

"/data/2026/schedule.json",
"/data/2027/schedule.json",
"/data/2028/schedule.json",

"/img/admin.jpg",
"/img/hero.jpg",

"/icon/icon-1.png",
"/icon/icon-2.png",
"/icon/kairanban.png",

"/manifest.json"
];

self.addEventListener("install", e => {

  e.waitUntil(
    caches.open(CACHE_NAME)
    .then(cache =>
      cache.addAll(urls)
    )
  );

});

self.addEventListener("fetch", e => {

  e.respondWith(

    caches.match(e.request)

      .then(response => {

        return response ||
          fetch(e.request);

      })

  );

});