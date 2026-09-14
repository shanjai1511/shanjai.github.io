/* ═══════════════════════════════════════════════════════
   Sticky mobile CTA
   Self-contained, site-wide (same injection pattern as
   chatbot.js). Hidden above 640px via CSS.
   ═══════════════════════════════════════════════════════ */
(function () {
    "use strict";

    if (document.getElementById("mctaBar")) return;

    const ROOT = window.CB_ROOT || "";
    // "Home" means the site's own root index.html specifically - not
    // just any index.html (about/index.html, playground/.../index.html,
    // etc. don't have a #contact section of their own). CB_ROOT is only
    // "" when the page is already at the site root, so combined with
    // the filename this reliably picks out just the real homepage.
    const path = location.pathname;
    const isHome = ROOT === "" && (path === "/" || /\/index\.html$/.test(path) || path.endsWith("/"));
    const href = isHome ? "#contact" : ROOT + "index.html#contact";

    const ICON_MAIL = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v14H4z"/><path d="m4 6 8 7 8-7"/></svg>`;

    const bar = document.createElement("div");
    bar.className = "mcta-bar";
    bar.id = "mctaBar";
    bar.innerHTML = `
        <span class="mcta-label"><strong>Available for opportunities</strong>Data engineering &amp; analytics</span>
        <a class="mcta-btn" href="${href}">${ICON_MAIL} Get in touch</a>
    `;
    document.body.appendChild(bar);
})();
