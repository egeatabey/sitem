(function () {
  "use strict";

  var hareketiAzalt = window.matchMedia("(prefers-reduced-motion: reduce)");
  var ustMenu = document.getElementById("ust-menu");
  var menuDugmesi = document.getElementById("menu-dugmesi");
  var gezinme = document.getElementById("ana-gezinme");
  var menuBaglantilari = Array.prototype.slice.call(
    document.querySelectorAll(".gezinme-baglantisi")
  );
  var tumIcBaglantilar = Array.prototype.slice.call(
    document.querySelectorAll('a[href^="#"]')
  );

  function menuyuKapat() {
    if (!gezinme || !menuDugmesi) {
      return;
    }
    gezinme.classList.remove("acik");
    menuDugmesi.setAttribute("aria-expanded", "false");
    menuDugmesi.textContent = "Menü";
  }

  if (menuDugmesi && gezinme) {
    menuDugmesi.addEventListener("click", function () {
      var acikMi = gezinme.classList.toggle("acik");
      menuDugmesi.setAttribute("aria-expanded", acikMi ? "true" : "false");
      menuDugmesi.textContent = acikMi ? "Kapat" : "Menü";
    });
  }

  tumIcBaglantilar.forEach(function (baglanti) {
    baglanti.addEventListener("click", function (olay) {
      var hedefId = baglanti.getAttribute("href");
      if (!hedefId || hedefId === "#") {
        return;
      }

      var hedef = document.querySelector(hedefId);
      if (!hedef) {
        return;
      }

      olay.preventDefault();
      menuyuKapat();

      var menuYuksekligi = ustMenu ? ustMenu.offsetHeight : 0;
      var hedefKonumu =
        hedef.getBoundingClientRect().top + window.scrollY - menuYuksekligi;

      window.scrollTo({
        top: Math.max(0, hedefKonumu),
        behavior: hareketiAzalt.matches ? "auto" : "smooth",
      });

      if (window.history && window.history.pushState) {
        window.history.pushState(null, "", hedefId);
      }
    });
  });

  function aktifBaglantiyiGuncelle() {
    var menuYuksekligi = ustMenu ? ustMenu.offsetHeight : 0;
    var kaydirmaKonumu = window.scrollY + menuYuksekligi + 80;
    var aktifId = "#kapak";

    menuBaglantilari.forEach(function (baglanti) {
      var id = baglanti.getAttribute("href");
      var bolum = id ? document.querySelector(id) : null;
      if (bolum && bolum.offsetTop <= kaydirmaKonumu) {
        aktifId = id;
      }
    });

    if (
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 24
    ) {
      var sonBaglanti = menuBaglantilari[menuBaglantilari.length - 1];
      if (sonBaglanti) {
        aktifId = sonBaglanti.getAttribute("href");
      }
    }

    menuBaglantilari.forEach(function (baglanti) {
      var eslesti = baglanti.getAttribute("href") === aktifId;
      baglanti.classList.toggle("aktif", eslesti);
      if (eslesti) {
        baglanti.setAttribute("aria-current", "true");
      } else {
        baglanti.removeAttribute("aria-current");
      }
    });
  }

  window.addEventListener("scroll", aktifBaglantiyiGuncelle, { passive: true });
  window.addEventListener("resize", aktifBaglantiyiGuncelle);
  aktifBaglantiyiGuncelle();

  var kopyalaDugmesi = document.getElementById("eposta-kopyala");
  var kopyaDurumu = document.getElementById("kopya-durumu");

  if (kopyalaDugmesi && kopyaDurumu) {
    kopyalaDugmesi.addEventListener("click", function () {
      var eposta = kopyalaDugmesi.getAttribute("data-eposta") || "";
      if (!eposta) {
        return;
      }

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard
          .writeText(eposta)
          .then(function () {
            kopyaDurumu.textContent = "E-posta adresi kopyalandı.";
          })
          .catch(function () {
            kopyaDurumu.textContent = "Adres: " + eposta;
          });
      } else {
        kopyaDurumu.textContent = "Adres: " + eposta;
      }
    });
  }
})();
