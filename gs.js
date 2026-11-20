/* App instalable «Fotos paquetes» (20-11): la misma página que en Apps Script, pero alojada en GitHub Pages.
   Fuera de Google no existe google.script.run: este archivo lo imita con fetch al doPost de la app de Google, así
   Index.html es el mismo en los dos sitios. */
(function () {
  var URL_GS = 'https://script.google.com/macros/s/AKfycbwyEcttCw3wJjUmei7yPI6178cLA_EIsodj339r_mSJJK6Th2ciKMdXHsko7mqY17M7xw/exec';
  function run(ok, ko) {
    return new Proxy({}, { get: function (_, fn) {
      if (fn === 'withSuccessHandler') return function (f) { return run(f, ko); };
      if (fn === 'withFailureHandler') return function (f) { return run(ok, f); };
      return function (arg) {
        fetch(URL_GS, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ fn: fn, arg: arg }) })
          .then(function (r) { return r.json(); })
          .then(function (j) { if (j.ok) { if (ok) ok(j.r); } else if (ko) ko(new Error(j.error)); })
          .catch(function (e) { if (ko) ko(new Error('Sin conexión: ' + (e && e.message || e))); });
      };
    }});
  }
  window.google = { script: { run: run(null, null), url: { getLocation: function (cb) {
    var p = {};
    new URLSearchParams(location.search).forEach(function (v, k) { p[k] = v; });
    setTimeout(function () { cb({ parameter: p }); }, 0);
  } } } };
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(function () {});
})();
