/* ═══════════════════════════════════════════════════════
   Playground — persistent sidebar behavior
   Shared across every Playground page (landing, domain,
   experiment). Marks the current page in the sidebar tree at
   runtime by comparing resolved URLs — works identically under
   file://, a local server, and the hosted site, with no need to
   bake a different "active" variant of the sidebar per page.
   ═══════════════════════════════════════════════════════ */
(function () {
    "use strict";

    function normalize(pathname) {
        return (pathname.replace(/\/index\.html$/, "/").replace(/\/$/, "")) || "/";
    }

    function markActive() {
        var here = normalize(window.location.pathname);
        var links = document.querySelectorAll(".pg-sidebar-list a, .pg-sidebar-domain-title");
        links.forEach(function (a) {
            var href = a.getAttribute("href");
            if (!href) return;
            var resolved;
            try {
                resolved = normalize(new URL(href, window.location.href).pathname);
            } catch (e) {
                return;
            }
            if (resolved === here) {
                a.classList.add("is-active");
                var group = a.closest(".pg-sidebar-domain");
                if (group) group.classList.add("is-current");
            }
        });
    }

    function wireToggle() {
        var toggle = document.getElementById("pgSidebarToggle");
        var sidebar = document.getElementById("pgSidebar");
        var overlay = document.getElementById("pgSidebarOverlay");
        if (!toggle || !sidebar) return;

        function setOpen(open) {
            sidebar.classList.toggle("is-open", open);
            if (overlay) overlay.classList.toggle("is-open", open);
            toggle.setAttribute("aria-expanded", open ? "true" : "false");
            document.body.style.overflow = open ? "hidden" : "";
        }

        toggle.addEventListener("click", function () {
            setOpen(!sidebar.classList.contains("is-open"));
        });
        if (overlay) {
            overlay.addEventListener("click", function () { setOpen(false); });
        }
        sidebar.querySelectorAll("a").forEach(function (a) {
            a.addEventListener("click", function () { setOpen(false); });
        });
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") setOpen(false);
        });
    }

    markActive();
    wireToggle();
})();
