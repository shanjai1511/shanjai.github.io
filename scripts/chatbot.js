/* ═══════════════════════════════════════════════════════
   Chatbot widget — Ask about Shanjai
   Self-contained: injects its own DOM into every page that
   loads this script (after chatbot-data.js). No markup needed
   per-page. Root-relative links in the knowledge base are
   resolved against window.CB_ROOT, which each page sets to its
   own "up to site root" prefix right before loading this file.
   Rule-based keyword matching only — no external API, no cost,
   no network request, works identically under file:// and hosted.
   ═══════════════════════════════════════════════════════ */
(function () {
    "use strict";

    const ROOT = window.CB_ROOT || "";
    const TOPICS = window.CB_TOPICS || [];
    const QUICK = window.CB_QUICK_QUESTIONS || [];
    const FALLBACK = window.CB_FALLBACK || { answer: "I don't have an answer for that.", links: [] };

    function resolveHref(link) {
        if (link.external || /^(https?:|mailto:)/.test(link.href)) return link.href;
        return ROOT + link.href;
    }

    function esc(s) {
        return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    }

    // Hand-built line-art robot-face icon (no icon-font match existed for this
    // style, so this is an inline SVG rather than a new external dependency) —
    // rounded head, two antennae, dot eyes, a small smile, and a speech-bubble
    // tail. Uses currentColor so it inherits whatever it's placed in.
    const ICON_ROBOT = `
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="8" y1="4.5" x2="8" y2="2"/><circle cx="8" cy="1.4" r="0.9" fill="currentColor" stroke="none"/>
            <line x1="16" y1="4.5" x2="16" y2="2"/><circle cx="16" cy="1.4" r="0.9" fill="currentColor" stroke="none"/>
            <rect x="4" y="4.5" width="16" height="12.5" rx="4"/>
            <circle cx="9" cy="10.2" r="1.1" fill="currentColor" stroke="none"/>
            <circle cx="15" cy="10.2" r="1.1" fill="currentColor" stroke="none"/>
            <path d="M9 13.3c1 1 5 1 6 0"/>
            <path d="M7.5 17l-2 2.8c-.28.4.08.9.55.73L9.5 19.2"/>
        </svg>`;
    const ICON_CLOSE = `
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M6 6l12 12M18 6L6 18"/>
        </svg>`;

    // ── Build DOM ──
    const root = document.createElement("div");
    root.className = "cb-root";
    root.innerHTML = `
        <button type="button" class="cb-toggle" id="cbToggle" aria-label="Chat with Shanjai's assistant" aria-expanded="false" aria-controls="cbPanel">
            <span class="cb-toggle-icon" id="cbToggleIcon" aria-hidden="true">${ICON_ROBOT}</span>
        </button>
        <div class="cb-panel" id="cbPanel" role="dialog" aria-label="Ask about Shanjai" aria-hidden="true">
            <div class="cb-header">
                <div class="cb-header-info">
                    <span class="cb-avatar">${ICON_ROBOT}</span>
                    <div>
                        <strong>Ask about Shanjai</strong>
                        <span class="cb-sub">Rule-based FAQ assistant, not a live AI</span>
                    </div>
                </div>
                <button type="button" class="cb-close" id="cbClose" aria-label="Close chat">
                    <i class="lni lni-close"></i>
                </button>
            </div>
            <div class="cb-messages" id="cbMessages" aria-live="polite"></div>
            <div class="cb-quick" id="cbQuick"></div>
            <form class="cb-input-row" id="cbForm">
                <label for="cbInput" class="sr-only">Type a question</label>
                <input type="text" id="cbInput" placeholder="Ask a question…" autocomplete="off">
                <button type="submit" aria-label="Send"><i class="lni lni-paper-plane"></i></button>
            </form>
        </div>
    `;
    document.body.appendChild(root);

    const toggle = document.getElementById("cbToggle");
    const toggleIcon = document.getElementById("cbToggleIcon");
    const panel = document.getElementById("cbPanel");
    const closeBtn = document.getElementById("cbClose");
    const messagesEl = document.getElementById("cbMessages");
    const quickEl = document.getElementById("cbQuick");
    const form = document.getElementById("cbForm");
    const input = document.getElementById("cbInput");

    let opened = false;
    let greeted = false;

    function addMessage(role, html) {
        const row = document.createElement("div");
        row.className = "cb-msg cb-msg--" + role;
        row.innerHTML = html;
        messagesEl.appendChild(row);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function renderAnswer(topic) {
        let html = `<p>${esc(topic.answer)}</p>`;
        if (topic.links && topic.links.length) {
            html += '<div class="cb-msg-links">' + topic.links.map(l =>
                `<a href="${esc(resolveHref(l))}" class="cb-msg-link"${l.external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${esc(l.label)} <i class="lni lni-arrow-right"></i></a>`
            ).join("") + '</div>';
        }
        addMessage("bot", html);
    }

    function renderQuick() {
        quickEl.innerHTML = "";
        QUICK.forEach(q => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "cb-quick-btn";
            btn.textContent = q;
            btn.addEventListener("click", () => handleQuestion(q));
            quickEl.appendChild(btn);
        });
    }

    function escapeRegex(s) {
        return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    // Word-boundary matching, not plain substring search — a naive .includes()
    // check would match "yo" (a greeting keyword) inside the word "you", or
    // "hi" inside "which", firing on nearly every question. \b anchors each
    // keyword (single word or multi-word phrase) to real word edges instead.
    function matchTopic(text) {
        const lower = text.toLowerCase();
        let best = null, bestScore = 0;
        TOPICS.forEach(topic => {
            let score = 0;
            topic.keywords.forEach(kw => {
                const re = new RegExp("\\b" + escapeRegex(kw.toLowerCase()) + "\\b");
                if (re.test(lower)) score += kw.length; // longer/more-specific keyword hits count more
            });
            if (score > bestScore) { bestScore = score; best = topic; }
        });
        return bestScore > 0 ? best : null;
    }

    function handleQuestion(text) {
        addMessage("user", `<p>${esc(text)}</p>`);
        input.value = "";
        const typing = document.createElement("div");
        typing.className = "cb-msg cb-msg--bot cb-typing";
        typing.innerHTML = '<span></span><span></span><span></span>';
        messagesEl.appendChild(typing);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        window.setTimeout(() => {
            typing.remove();
            const topic = matchTopic(text);
            if (topic) renderAnswer(topic);
            else renderAnswer(FALLBACK);
        }, 400 + Math.random() * 300);
    }

    function openPanel() {
        opened = true;
        panel.classList.add("is-open");
        panel.setAttribute("aria-hidden", "false");
        toggle.setAttribute("aria-expanded", "true");
        toggleIcon.innerHTML = ICON_CLOSE;
        if (!greeted) {
            greeted = true;
            addMessage("bot", "<p>Hi! I'm a quick FAQ assistant — ask me about Shanjai's background, skills, projects, education, or how to get in touch.</p>");
            renderQuick();
        }
        window.setTimeout(() => input.focus(), 150);
    }

    function closePanel() {
        opened = false;
        panel.classList.remove("is-open");
        panel.setAttribute("aria-hidden", "true");
        toggle.setAttribute("aria-expanded", "false");
        toggleIcon.innerHTML = ICON_ROBOT;
    }

    toggle.addEventListener("click", () => { opened ? closePanel() : openPanel(); });
    closeBtn.addEventListener("click", closePanel);
    document.addEventListener("keydown", e => { if (e.key === "Escape" && opened) closePanel(); });

    form.addEventListener("submit", e => {
        e.preventDefault();
        const text = input.value.trim();
        if (!text) return;
        handleQuestion(text);
    });
})();
