/* ═══════════════════════════════════════════════════════
   Intro flashcards - "Quick intro"
   Landing-page-only widget. Self-contained: injects its own
   DOM (launcher + modal), same pattern as chatbot.js.
   A short, self-paced set of cards - no video, no avatar.
   ═══════════════════════════════════════════════════════ */
(function () {
    "use strict";

    if (document.getElementById("icLauncher")) return;

    const STORAGE_KEY = "sr_intro_cards_seen_v1";
    const AUTO_ADVANCE_MS = 4200;

    const CARDS = [
        {
            icon: "lni-user", eyebrow: "Hey there",
            title: "I'm Shanjai R.",
            body: "Software Engineer at 42Signals, based in Coimbatore - currently pursuing an M.Tech in Data Science at BITS Pilani.",
        },
        {
            icon: "lni-database", eyebrow: "What I do",
            title: "Where data meets decisions",
            body: "I work where data infrastructure, analytics, and data science meet - building systems that turn raw data into real business intelligence.",
        },
        {
            icon: "lni-cog", eyebrow: "Day to day",
            title: "Collection, processing, quality - at scale",
            body: "A lot of my work is about getting the pipeline itself right, long before anyone builds a dashboard on top of it.",
        },
        {
            icon: "lni-target", eyebrow: "Selected work",
            title: "Competitor discovery & price-violation detection",
            body: "The goal was never just collecting data - it was making that data useful for real business decisions.",
        },
        {
            icon: "lni-bulb", eyebrow: "How I work",
            title: "Root cause over quick fixes",
            body: "I enjoy breaking down messy problems, finding what's actually wrong, and building practical systems around it.",
        },
        {
            icon: "lni-rocket", eyebrow: "Next",
            title: "Take a look around",
            body: "Explore the case studies, playgrounds, and writing below.",
            cta: "Start exploring",
        },
    ];

    function esc(s) {
        return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    }

    const ICON_PLAY = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 5l12 7-12 7V5z"/></svg>`;
    const ICON_CLOSE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>`;
    const ICON_ARROW_L = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>`;
    const ICON_ARROW_R = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>`;
    const ICON_REPLAY = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 11A8 8 0 104.5 15"/><path d="M4 6v5h5"/></svg>`;

    // ── Launcher ──
    const launcher = document.createElement("button");
    launcher.type = "button";
    launcher.id = "icLauncher";
    launcher.className = "ic-launcher";
    launcher.setAttribute("aria-label", "Quick intro to Shanjai R");
    launcher.innerHTML = `<span class="ic-launcher-icon">${ICON_PLAY}</span><span class="ic-launcher-label">Quick intro</span>`;
    document.body.appendChild(launcher);

    // ── Modal ──
    const overlay = document.createElement("div");
    overlay.className = "ic-overlay";
    overlay.id = "icOverlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "A quick introduction to Shanjai R");
    overlay.setAttribute("aria-hidden", "true");

    const refTag = (i) => `${String(i + 1).padStart(2, "0")}/${String(CARDS.length).padStart(2, "0")}`;

    const cardsHtml = CARDS.map((c, i) => `
        <div class="ic-card${i === 0 ? " is-active" : ""}" data-index="${i}" aria-hidden="${i === 0 ? "false" : "true"}">
            <span class="ic-card-ref">N&deg; ${refTag(i)}</span>
            <span class="ic-card-mark"><i class="lni ${c.icon}"></i></span>
            <div class="ic-card-eyebrow">${esc(c.eyebrow)}</div>
            <h3 class="ic-card-title">${esc(c.title)}</h3>
            <p class="ic-card-body">${esc(c.body)}</p>
            ${c.cta ? `<button type="button" class="ic-card-cta btn btn-primary" id="icCta">${esc(c.cta)} ${ICON_ARROW_R}</button>` : ""}
        </div>
    `).join("");

    const tabsHtml = CARDS.map((_, i) => `<button type="button" class="ic-tab${i === 0 ? " is-active" : ""}" data-tab="${i}" aria-label="Card ${i + 1} of ${CARDS.length}">${String(i + 1).padStart(2, "0")}</button>`).join("");

    overlay.innerHTML = `
        <div class="ic-modal">
            <button type="button" class="ic-close" id="icClose" aria-label="Close intro">${ICON_CLOSE}</button>
            <div class="ic-stage">
                <div class="ic-deck" id="icDeck">
                    <div class="ic-ghost ic-ghost-1" aria-hidden="true"></div>
                    <div class="ic-ghost ic-ghost-2" aria-hidden="true"></div>
                    ${cardsHtml}
                </div>
                <div class="ic-panel">
                    <button type="button" class="ic-arrow ic-prev" id="icPrev" aria-label="Previous card">${ICON_ARROW_L}</button>
                    <div class="ic-tabs" id="icTabs">${tabsHtml}</div>
                    <button type="button" class="ic-arrow ic-next" id="icNext" aria-label="Next card">${ICON_ARROW_R}</button>
                    <button type="button" class="ic-replay" id="icReplay" aria-label="Replay from the start">${ICON_REPLAY}</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    const deck = document.getElementById("icDeck");
    const cardEls = Array.from(deck.querySelectorAll(".ic-card"));
    const tabEls = Array.from(document.getElementById("icTabs").children);
    const prevBtn = document.getElementById("icPrev");
    const nextBtn = document.getElementById("icNext");
    const closeBtn = document.getElementById("icClose");
    const replayBtn = document.getElementById("icReplay");

    const state = { index: 0, timer: null, lastFocused: null };

    function render(prevIndex) {
        cardEls.forEach((el, i) => {
            el.classList.toggle("is-active", i === state.index);
            el.classList.toggle("is-leaving", i === prevIndex && i !== state.index);
            el.setAttribute("aria-hidden", i === state.index ? "false" : "true");
        });
        tabEls.forEach((el, i) => el.classList.toggle("is-active", i === state.index));
        prevBtn.disabled = state.index === 0;
        nextBtn.disabled = state.index === CARDS.length - 1;
    }

    function goTo(i, userTriggered) {
        const prevIndex = state.index;
        const clamped = Math.max(0, Math.min(CARDS.length - 1, i));
        if (clamped === prevIndex && userTriggered !== "force") return;
        state.index = clamped;
        render(prevIndex);
        if (userTriggered) restartAutoAdvance();
    }

    function next() {
        if (state.index >= CARDS.length - 1) { stopAutoAdvance(); return; }
        goTo(state.index + 1);
    }

    function startAutoAdvance() {
        stopAutoAdvance();
        state.timer = setInterval(next, AUTO_ADVANCE_MS);
    }
    function stopAutoAdvance() {
        if (state.timer) clearInterval(state.timer);
        state.timer = null;
    }
    function restartAutoAdvance() { startAutoAdvance(); }

    prevBtn.addEventListener("click", () => goTo(state.index - 1, true));
    nextBtn.addEventListener("click", () => goTo(state.index + 1, true));
    tabEls.forEach((el, i) => el.addEventListener("click", () => goTo(i, true)));

    deck.addEventListener("mouseenter", stopAutoAdvance);
    deck.addEventListener("mouseleave", startAutoAdvance);
    deck.addEventListener("focusin", stopAutoAdvance);
    deck.addEventListener("focusout", startAutoAdvance);

    function scrollToContent() {
        const target = document.getElementById("home");
        if (target) target.scrollIntoView({ behavior: "smooth" });
    }

    overlay.addEventListener("click", e => {
        if (e.target && e.target.id === "icCta") {
            closeModal();
            scrollToContent();
        }
    });

    // ── Open / close ──
    function openModal() {
        state.lastFocused = document.activeElement;
        overlay.classList.add("is-open");
        overlay.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        closeBtn.focus();
        goTo(0);
        startAutoAdvance();
        try { localStorage.setItem(STORAGE_KEY, String(Date.now())); } catch (err) { /* private mode etc. */ }
    }

    function closeModal() {
        overlay.classList.remove("is-open");
        overlay.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        stopAutoAdvance();
        if (state.lastFocused && typeof state.lastFocused.focus === "function") {
            state.lastFocused.focus();
        }
    }

    launcher.addEventListener("click", openModal);
    closeBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", e => { if (e.target === overlay) closeModal(); });
    replayBtn.addEventListener("click", () => { goTo(0, true); });

    document.addEventListener("keydown", e => {
        if (!overlay.classList.contains("is-open")) return;
        if (e.key === "Escape") closeModal();
        if (e.key === "ArrowRight") goTo(state.index + 1, true);
        if (e.key === "ArrowLeft") goTo(state.index - 1, true);
    });

    // Basic swipe support for touch devices.
    let touchStartX = null;
    deck.addEventListener("touchstart", e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    deck.addEventListener("touchend", e => {
        if (touchStartX === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) goTo(state.index + (dx < 0 ? 1 : -1), true);
        touchStartX = null;
    }, { passive: true });

    // ── Auto-show once, on first visit, after the hero has settled ──
    let alreadySeen = false;
    try { alreadySeen = !!localStorage.getItem(STORAGE_KEY); } catch (err) { /* private mode etc. */ }
    if (!alreadySeen) {
        setTimeout(openModal, 1400);
    }
})();
