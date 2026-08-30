/* ═══════════════════════════════════════════════════════
   Chatbot knowledge base — Ask about Shanjai
   A fixed set of real facts pulled directly from this site's
   own content (About, Experience, Education, Projects, Skills,
   Playground, Now, Journal, Contact). No invented claims, no
   live AI — this is intentionally a rule-based FAQ assistant,
   disclosed as such in the widget itself.
   ═══════════════════════════════════════════════════════ */
(function (global) {
    "use strict";

    const CB_TOPICS = [
        {
            id: "about",
            keywords: ["who are you", "who is shanjai", "yourself", "you are", "shanjai", "introduce yourself", "bio", "your intro"],
            answer: "I'm Shanjai R, a Data Scientist working at the intersection of data, engineering and analytics — with a production engineering foundation underneath it. My current focus is E-commerce & Market Intelligence. I work where messy data meets real-world systems.",
            links: [{ label: "Read About", href: "about/index.html" }],
        },
        {
            id: "role",
            keywords: ["role", "job", "work at", "company", "employer", "current job", "position", "promptcloud", "42signals", "42 signals", "what do you do"],
            answer: "I'm a Software Engineer II at PromptCloud / 42Signals (42Signals is PromptCloud's e-commerce intelligence product). I work across data engineering, analytics and e-commerce intelligence — turning raw marketplace and web data into systems that support business decisions.",
            links: [{ label: "See Experience", href: "index.html#experience" }],
        },
        {
            id: "experience",
            keywords: ["experience", "career", "background", "timeline", "history", "journey", "promoted", "promotion"],
            answer: "I joined PromptCloud as an intern in July 2023, moved into software engineering in 2024 as an Associate Software Engineer, took on full product ownership of 42Signals as Software Engineer I (2025–2026), and I'm now Software Engineer II (2026–Present). I started my M.Tech alongside that in 2025.",
            links: [{ label: "Full Timeline", href: "index.html#experience" }],
        },
        {
            id: "first-job",
            keywords: ["first job", "started career", "internship", "intern"],
            answer: "I started as a Software Engineering Intern at PromptCloud in July 2023, working on banner placement analysis for Amazon, Nykaa and Blinkit. That's where I discovered a real interest in messy, real-world data over textbook problems.",
        },
        {
            id: "education",
            keywords: ["education", "educational background", "academic background", "degree", "college", "university", "study", "studied", "studying", "bits", "pilani", "mtech", "m.tech", "btech", "b.tech", "cgpa", "school"],
            answer: "I'm currently pursuing an M.Tech in Data Science and Engineering at BITS Pilani (Oct 2025 – Aug 2027, WILP — Work Integrated Learning Programme, current CGPA 8.58). Before that, I completed a B.Tech in Information Technology at Sri Shakthi Institute of Engineering and Technology (Nov 2020 – Apr 2024), graduating with 8.58 CGPA, First Class with Distinction.",
            links: [{ label: "See Education", href: "index.html#skills" }],
        },
        {
            id: "skills",
            keywords: ["skills", "tech stack", "technologies", "technology", "tools", "tool", "programming languages", "python", "sql", "machine learning", "programming", "stack"],
            answer: "My core stack: Python, Pandas, NumPy, SQL/MySQL, ETL & data pipelines, Elasticsearch, RabbitMQ and distributed processing on the engineering side; Machine Learning, LLMs, LangChain, Hugging Face and OpenAI on the ML/AI side; plus Git, Linux, Docker, JavaScript and web-scraping tools like XPath and BeautifulSoup.",
            links: [{ label: "Technical Toolbox", href: "index.html#skills" }],
        },
        {
            id: "ai-ml",
            keywords: ["ai work", "llm", "llms", "langchain", "hugging face", "openai", "artificial intelligence", "genai", "generative ai"],
            answer: "On the AI/ML side I work with Machine Learning fundamentals, LLMs, LangChain, Hugging Face and OpenAI — mostly applied to e-commerce and market intelligence problems rather than as a standalone research focus. A few of that flavor of experiment are in the Playground under AI & Machine Learning.",
            links: [{ label: "AI & Machine Learning Playground", href: "playground/ai/index.html" }],
        },
        {
            id: "projects",
            keywords: ["projects", "portfolio", "case study", "case studies", "built", "work you've done", "what have you built", "shipped"],
            answer: "Six case studies: the Competitor Intelligence Engine, Price Intelligence & Revenue Leakage Detection, Search Intelligence & Brand Visibility Analytics, Automated Product Matching Pipeline, SARA (my data-engineering foundation), and a Modular Web Scraping Pipeline.",
            links: [{ label: "View All Projects", href: "projects/index.html" }],
        },
        {
            id: "competitor-intelligence",
            keywords: ["competitor intelligence", "competitor analysis", "competitor engine", "competitor discovery"],
            answer: "The Competitor Intelligence Engine is a product-level system that identifies and ranks marketplace competitors using product names, inferred brands, categories, pricing and similarity signals — turning a manual, easily-outdated competitor list into a continuously updated one.",
            links: [{ label: "Read the Case Study", href: "competitor-intelligence.html" }],
        },
        {
            id: "price-intelligence",
            keywords: ["price intelligence", "revenue leakage", "pricing discrepancies", "map violation"],
            answer: "Price Intelligence & Revenue Leakage Detection is a marketplace pricing intelligence workflow designed to identify meaningful price discrepancies — like MAP violations and unauthorized discounting — while reducing noise from irrelevant or low-value data fields.",
            links: [{ label: "Read the Case Study", href: "price-intelligence.html" }],
        },
        {
            id: "search-intelligence",
            keywords: ["search intelligence", "brand visibility", "keyword ranking", "share of search"],
            answer: "Search Intelligence & Brand Visibility Analytics is a search-performance intelligence system covering keyword rankings, brand visibility, competitor movement, rank distribution and product-level performance.",
            links: [{ label: "Read the Case Study", href: "search-intelligence.html" }],
        },
        {
            id: "product-matching",
            keywords: ["product matching", "digital shelf", "cross market", "fashion retail"],
            answer: "The Automated Product Matching Pipeline connects products across marketplaces using product attributes and similarity signals to improve cross-market analysis — built for a fashion retail client's digital shelf analytics.",
            links: [{ label: "Read the Case Study", href: "product-matching.html" }],
        },
        {
            id: "web-scraping",
            keywords: ["web scraping", "scraping pipeline", "modular pipeline", "url collection"],
            answer: "The Modular Web Scraping Pipeline handles URL collection, fetching and rule-based extraction using Python, YAML, MySQL, CSV and web-parsing components — it's the engineering foundation this whole career has been built on.",
            links: [{ label: "Read the Case Study", href: "web-scraping-pipeline.html" }],
        },
        {
            id: "sara",
            keywords: ["sara", "scalable automated retrieval", "retrieval architecture"],
            answer: "SARA (Scalable Automated Retrieval Architecture) is my data-engineering foundation project — a reusable retrieval architecture covering the full pipeline from collection through to a searchable index (Elasticsearch), spanning 22 fashion e-commerce and media sites. It's not a Data Science project in itself, but the trustworthy foundation the analytics work sits on. Still in active development.",
            links: [{ label: "Read the SARA Case Study", href: "sara.html" }],
        },
        {
            id: "playground",
            keywords: ["playground", "experiment", "experiments", "demo", "demos", "interactive", "try"],
            answer: "The Playground is a set of 22 interactive, genuinely-working demos across 5 domains — E-commerce Intelligence, Data Cleaning & Quality, Data Analytics, AI & Machine Learning, and Engineering & Systems. Everything runs client-side in your browser — upload a CSV, pick a brand, move a slider — real computation, not a mockup.",
            links: [{ label: "Open the Playground", href: "playground/index.html" }],
        },
        {
            id: "lab",
            keywords: ["lab", "experimenting", "exploring", "unfinished", "research"],
            answer: "The Lab is different from Projects — it's where I experiment with data, machine learning, AI and ideas I want to understand better, before they're finished or verified. Some experiments become projects, some fail, some just teach me something. \"Not everything I build starts as a production project.\"",
            links: [{ label: "Visit the Lab", href: "lab/index.html" }],
        },
        {
            id: "now",
            keywords: ["now", "currently working", "current focus", "these days", "right now"],
            answer: "Right now I'm building SARA (data infrastructure & intelligence), exploring data science for market intelligence, and studying for my M.Tech in Data Science and Engineering at BITS Pilani.",
            links: [{ label: "See the Now Page", href: "now/index.html" }],
        },
        {
            id: "writing",
            keywords: ["writing", "blog", "article", "articles", "essay", "essays", "journal", "posts", "read", "beyond the obvious"],
            answer: "I write essays on data, systems and decisions — some published as a Journal on this site (\"Beyond the Obvious\"), others on LinkedIn and Medium. Topics include why dashboards fail even when the data is correct, why the costliest data is the data nobody acts on, and why second-order effects are easy to miss.",
            links: [{ label: "Read the Writing", href: "index.html#posts" }],
        },
        {
            id: "philosophy",
            keywords: ["philosophy", "how do you think", "approach to systems", "principles"],
            answer: "\"I don't start with the dataset. I start with the decision the dataset is supposed to support.\" That's the core of how I think about systems — six principles I keep coming back to when building data and engineering work.",
            links: [{ label: "How I Think About Systems", href: "philosophy.html" }],
        },
        {
            id: "impact",
            keywords: ["impact", "results", "achievements", "outcomes", "what changed"],
            answer: "The Impact page documents specific before/after changes from my work — like turning a dashboard that tracked everything but answered nothing into a decision system, and reducing noise by categorizing data by relevance instead of collecting everything.",
            links: [{ label: "See Impact", href: "impact.html" }],
        },
        {
            id: "awards",
            keywords: ["awards", "recognition", "honours", "honors", "achievements at work"],
            answer: "I've received three internal recognitions at PromptCloud/42Signals: Emerging Leader (for ownership of the 42Signals product and driving client engagements), a Stretch Award x2 (for going above and beyond on key projects), and a Hi5 Award x5 (for teamwork and cross-functional collaboration).",
            links: [{ label: "See Awards", href: "index.html#experience" }],
        },
        {
            id: "location",
            keywords: ["located", "based", "where are you", "location", "city", "coimbatore"],
            answer: "I'm based in Coimbatore, India.",
        },
        {
            id: "languages",
            keywords: ["what languages", "languages do you speak", "speak", "tamil", "english language"],
            answer: "I speak Tamil and English.",
        },
        {
            id: "hobbies",
            keywords: ["hobbies", "hobby", "interests", "free time", "not coding", "spare time", "photography", "travel", "music", "mentoring", "fun", "outside work", "what do you do for fun", "do for fun"],
            answer: "Outside work: travel (recently Poovar Island and Udaipur), photography, mentoring college juniors through mock interviews on resumes, Python and logical thinking (10+ sessions so far), and music.",
        },
        {
            id: "availability",
            keywords: ["available", "hiring", "opportunities", "open to work", "freelance", "job opening"],
            answer: "I'm currently available for opportunities — that status is shown right on the homepage. The best way to start a conversation is email or LinkedIn.",
            links: [{ label: "Contact", href: "index.html#contact" }],
        },
        {
            id: "resume",
            keywords: ["resume", "cv", "download resume"],
            answer: "You can view my resume here.",
            links: [{ label: "Open Resume", href: "https://docs.google.com/document/d/1CuNf3c0HqHSQjyJzvckA4KE_3--v1WsG9807g1U0QyU/edit?usp=sharing", external: true }],
        },
        {
            id: "salary",
            keywords: ["salary", "rate", "pay", "compensation", "cost", "pricing", "charge", "quote", "budget"],
            answer: "That's not something I've put on the site — best to raise it directly over email or LinkedIn.",
            links: [
                { label: "Email", href: "mailto:shanjai1511@gmail.com", external: true },
                { label: "LinkedIn", href: "https://www.linkedin.com/in/shanjai/", external: true },
            ],
        },
        {
            id: "contact",
            keywords: ["contact", "email", "reach", "hire", "get in touch", "talk", "message", "linkedin", "github", "instagram", "medium", "social"],
            answer: "You can reach me directly at shanjai1511@gmail.com, or connect on LinkedIn, GitHub, Medium or Instagram.",
            links: [
                { label: "Email", href: "mailto:shanjai1511@gmail.com", external: true },
                { label: "LinkedIn", href: "https://www.linkedin.com/in/shanjai/", external: true },
                { label: "GitHub", href: "https://github.com/shanjai1511", external: true },
                { label: "Medium", href: "https://medium.com/@shanjai1511", external: true },
                { label: "Instagram", href: "https://www.instagram.com/r.shanjai/", external: true },
            ],
        },
        {
            id: "confidentiality",
            keywords: ["client name", "which client", "confidential", "confidentiality", "real client"],
            answer: "Some of my case studies involve real client work under confidentiality — those are marked \"Confidential\" and described by what the system does rather than who it was built for. Everything else on the site is accurately attributed.",
        },
        {
            id: "greeting",
            keywords: ["hi", "hello", "hey", "yo", "sup"],
            answer: "Hey! I can answer quick questions about Shanjai's background, skills, projects, education or how to get in touch. What would you like to know?",
        },
        {
            id: "thanks",
            keywords: ["thanks", "thank you", "cheers", "appreciate"],
            answer: "You're welcome! Anything else you'd like to know?",
        },
    ];

    const CB_QUICK_QUESTIONS = [
        "What do you do?",
        "What are your skills?",
        "Tell me about your projects",
        "How can I contact you?",
    ];

    const CB_FALLBACK = {
        answer: "I don't have a canned answer for that — I'm a simple FAQ assistant, not a live AI, so I only know a fixed set of topics. Try asking about background, skills, projects, education, SARA, the Playground, writing, or how to get in touch — or reach Shanjai directly.",
        links: [{ label: "Email Shanjai", href: "mailto:shanjai1511@gmail.com", external: true }],
    };

    global.CB_TOPICS = CB_TOPICS;
    global.CB_QUICK_QUESTIONS = CB_QUICK_QUESTIONS;
    global.CB_FALLBACK = CB_FALLBACK;
})(window);
