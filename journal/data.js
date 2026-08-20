/* SHANJAI — Journal article index. Used for the homepage feed,
   the archive, topics, related-article modules and search.
   Slugs are bare filenames — these article pages live in /journal/
   alongside index.html, articles.html, topics.html and about.html,
   so no relative-path prefix is needed. */

const JRNL_ARTICLES = [
  {
    slug: "the-most-expensive-data.html",
    title: "The Most Expensive Data Is the Data That Changes Nothing",
    excerpt: "A perspective on why collecting more data doesn't necessarily create better decisions.",
    category: "Data",
    date: "Aug 2026",
    readTime: "4 min"
  },
  {
    slug: "when-more-data-makes-a-product-worse.html",
    title: "When More Data Makes a Product Worse",
    excerpt: "Why collecting more data isn't automatically better data, and how unused fields quietly slow down the systems built around them.",
    category: "Data",
    date: "Aug 2026",
    readTime: "4 min"
  },
  {
    slug: "hidden-cost-of-losing-organizational-knowledge.html",
    title: "The Hidden Cost of Losing Organizational Knowledge",
    excerpt: "Why systems outlast the people who build them, and why understanding the history behind a system matters as much as understanding its code.",
    category: "Systems",
    date: "Aug 2026",
    readTime: "4 min"
  },
  {
    slug: "philosophy.html",
    title: "How I Think About Systems",
    excerpt: "Six principles behind how I approach data systems: starting with the decision, tracing symptoms back to systems, and treating data collection as a cost that has to earn its place.",
    category: "Systems",
    date: "Aug 2026",
    readTime: "5 min"
  },
  {
    slug: "thinking-and-systems.html",
    title: "Thinking & Systems",
    excerpt: "How I think about data, systems, products, and the problems between them — a short collection.",
    category: "Systems",
    date: "Aug 2026",
    readTime: "2 min"
  },
  {
    slug: "knowledge-that-moves-decisions.html",
    title: "Knowledge That Moves Decisions Is More Valuable Than Knowledge Alone",
    excerpt: "Why the value of information isn't what it describes, but what it changes — and what that means for building analytics people actually use.",
    category: "Decision Making",
    date: "Aug 2026",
    readTime: "4 min"
  },
  {
    slug: "why-dashboards-fail.html",
    title: "Why Dashboards Fail Even When the Data Is Correct",
    excerpt: "Why accuracy isn't the same as usefulness, and why a technically correct dashboard can still fail to help anyone make a decision.",
    category: "Analytics",
    date: "Aug 2026",
    readTime: "3 min"
  },
  {
    slug: "what-ecommerce-data-taught-me.html",
    title: "What Working With E-commerce Data Taught Me",
    excerpt: "What years of working with marketplace, pricing and competitor data across e-commerce platforms actually taught me about building systems.",
    category: "Career",
    date: "Aug 2026",
    readTime: "4 min"
  },
  {
    slug: "what-i-notice-that-others-miss.html",
    title: "What I Notice That Others Miss",
    excerpt: "Five observations from working closely with data systems — on relevance, dashboards, context, automation and signal.",
    category: "Ideas",
    date: "Aug 2026",
    readTime: "4 min"
  },
  {
    slug: "impact.html",
    title: "What Changed Because I Worked On It",
    excerpt: "Four short case studies in how I measure engineering work: not by what was built, but by what became clearer, faster, or more useful because of it.",
    category: "Work",
    date: "Aug 2026",
    readTime: "5 min"
  },
  {
    slug: "failure-to-learning.html",
    title: "Failure → Learning",
    excerpt: "Three honest case notes on things that technically worked but weren't right — and what they taught me.",
    category: "Work",
    date: "Aug 2026",
    readTime: "4 min"
  },
  {
    slug: "system-playground.html",
    title: "System Playground",
    excerpt: "An interactive walkthrough of a data intelligence pipeline, plus a simplified competitive-intelligence demo you can try yourself.",
    category: "Technology",
    date: "Aug 2026",
    readTime: "Interactive"
  }
];

if (typeof module !== "undefined") { module.exports = JRNL_ARTICLES; }
