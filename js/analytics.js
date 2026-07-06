/* Google Analytics 4 loader.
   Paste your GA4 Measurement ID below (looks like "G-XXXXXXXXXX").
   Find it in Google Analytics → Admin → Data streams → your web stream.
   Until an ID is set, this file does nothing (no tracking, no network calls). */
(function () {
  var GA_ID = ""; // <-- paste your GA4 Measurement ID here, e.g. "G-ABC123XYZ"

  if (!GA_ID) return;

  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA_ID);
})();
