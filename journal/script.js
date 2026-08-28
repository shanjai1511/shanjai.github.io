/* SHANJAI Journal: mobile nav, header scroll state, search overlay. */
(function () {
  "use strict";

  // ---- Header scroll shrink ----
  var header = document.querySelector(".jrnl-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // ---- Mobile nav ----
  var menuBtn = document.querySelector("[data-menu-trigger]");
  var mobileNav = document.querySelector(".jrnl-mobile-nav");
  var menuClose = document.querySelector("[data-menu-close]");

  function toggleMobileNav(open) {
    if (!mobileNav) return;
    mobileNav.classList.toggle("open", open);
    document.body.style.overflow = open ? "hidden" : "";
  }
  if (menuBtn) menuBtn.addEventListener("click", function () { toggleMobileNav(true); });
  if (menuClose) menuClose.addEventListener("click", function () { toggleMobileNav(false); });

  // ---- Search overlay ----
  var searchTriggers = document.querySelectorAll("[data-search-trigger]");
  var searchOverlay = document.querySelector(".jrnl-search-overlay");
  var searchInput = document.querySelector(".jrnl-search-field input");
  var searchResults = document.querySelector(".jrnl-search-results");
  var searchClose = document.querySelector("[data-search-close]");

  var activeIndex = -1;
  var currentMatches = [];

  function renderResults(query) {
    if (!searchResults) return;
    var q = query.trim().toLowerCase();
    var articles = (typeof JRNL_ARTICLES !== "undefined") ? JRNL_ARTICLES : [];

    if (!q) {
      currentMatches = articles.slice(0, 6);
    } else {
      currentMatches = articles.filter(function (a) {
        return (
          a.title.toLowerCase().indexOf(q) !== -1 ||
          a.excerpt.toLowerCase().indexOf(q) !== -1 ||
          a.category.toLowerCase().indexOf(q) !== -1
        );
      });
    }

    activeIndex = -1;

    if (currentMatches.length === 0) {
      searchResults.innerHTML = '<p class="jrnl-search-empty">No articles match &ldquo;' + escapeHtml(query) + '&rdquo;.</p>';
      return;
    }

    searchResults.innerHTML = currentMatches.map(function (a, i) {
      return (
        '<a class="jrnl-search-result" href="' + a.slug + '" data-index="' + i + '">' +
        '<div class="eyebrow">' + a.category + '</div>' +
        "<h3>" + escapeHtml(a.title) + "</h3>" +
        "<p>" + escapeHtml(a.excerpt) + "</p>" +
        '<div class="jrnl-search-date">' + a.date + " &middot; " + a.readTime + "</div>" +
        "</a>"
      );
    }).join("");
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function openSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
    renderResults("");
    if (searchInput) {
      searchInput.value = "";
      setTimeout(function () { searchInput.focus(); }, 30);
    }
  }

  function closeSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  searchTriggers.forEach(function (btn) {
    btn.addEventListener("click", openSearch);
  });
  if (searchClose) searchClose.addEventListener("click", closeSearch);
  if (searchOverlay) {
    searchOverlay.addEventListener("click", function (e) {
      if (e.target === searchOverlay) closeSearch();
    });
  }
  if (searchInput) {
    searchInput.addEventListener("input", function () { renderResults(searchInput.value); });
    searchInput.addEventListener("keydown", function (e) {
      var items = searchResults ? searchResults.querySelectorAll(".jrnl-search-result") : [];
      if (e.key === "ArrowDown") {
        e.preventDefault();
        activeIndex = Math.min(activeIndex + 1, items.length - 1);
        items.forEach(function (el, i) { el.classList.toggle("active", i === activeIndex); });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        activeIndex = Math.max(activeIndex - 1, 0);
        items.forEach(function (el, i) { el.classList.toggle("active", i === activeIndex); });
      } else if (e.key === "Enter" && activeIndex > -1 && items[activeIndex]) {
        window.location.href = items[activeIndex].getAttribute("href");
      }
    });
  }

  document.addEventListener("keydown", function (e) {
    var isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
    var modifier = isMac ? e.metaKey : e.ctrlKey;
    if (modifier && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openSearch();
    } else if (e.key === "Escape") {
      closeSearch();
      toggleMobileNav(false);
    }
  });
})();
