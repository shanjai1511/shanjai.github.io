/* ═══════════════════════════════════════════════════════
   Playground — shared utilities
   Plain vanilla JS, no build step, no external dependencies.
   Every experiment page includes this file and calls into
   the PG namespace. Keeps each experiment's own <script>
   block small and focused on that experiment's UI wiring.
   ═══════════════════════════════════════════════════════ */
(function (global) {
    "use strict";

    const PG = {};

    /* ── Set similarity ── */
    // Jaccard similarity: size of intersection / size of union, both as arrays of strings.
    PG.jaccard = function (a, b) {
        const setA = new Set(a);
        const setB = new Set(b);
        const intersection = [...setA].filter(x => setB.has(x));
        const union = new Set([...setA, ...setB]);
        if (union.size === 0) return 0;
        return intersection.length / union.size;
    };
    PG.intersect = function (a, b) {
        const setB = new Set(b);
        return a.filter(x => setB.has(x));
    };

    /* ── E-commerce: competitor scoring ──
       Transparent, explainable weighted score. Every sub-score is 0..1;
       shown to the visitor broken out, not just the final number. */
    const TIER_ORDER = { budget: 0, mid: 1, premium: 2 };
    PG.competitorScore = function (a, b) {
        if (a.id === b.id) return null;

        const categoryScore = PG.jaccard(a.categories, b.categories);
        const marketplaceScore = PG.jaccard(a.marketplaces, b.marketplaces);

        const tierGap = Math.abs(TIER_ORDER[a.priceTier] - TIER_ORDER[b.priceTier]);
        const priceTierScore = tierGap === 0 ? 1 : tierGap === 1 ? 0.5 : 0;

        const priceDelta = Math.abs(a.avgPrice - b.avgPrice);
        const priceMax = Math.max(a.avgPrice, b.avgPrice);
        const priceProximityScore = priceMax === 0 ? 1 : Math.max(0, 1 - priceDelta / priceMax);

        const weights = { category: 0.4, priceTier: 0.2, marketplace: 0.2, priceProximity: 0.2 };
        const total =
            categoryScore * weights.category +
            priceTierScore * weights.priceTier +
            marketplaceScore * weights.marketplace +
            priceProximityScore * weights.priceProximity;

        return {
            total: Math.round(total * 100),
            categoryScore, marketplaceScore, priceTierScore, priceProximityScore,
            weights,
            sharedCategories: PG.intersect(a.categories, b.categories),
            sharedMarketplaces: PG.intersect(a.marketplaces, b.marketplaces),
        };
    };

    /* ── CSV parsing (hand-rolled, no CDN dependency) ──
       Handles comma-separated values with optional double-quoted fields
       (including quoted commas, quoted newlines, and "" as an escaped quote).
       Not a full RFC 4180 implementation, but correct for typical demo CSVs. */
    PG.parseCSV = function (text, opts) {
        opts = opts || {};
        const maxRows = opts.maxRows || 5000;
        const rows = [];
        let row = [];
        let field = "";
        let inQuotes = false;
        let i = 0;
        const n = text.length;

        function pushField() { row.push(field); field = ""; }
        function pushRow() { pushField(); rows.push(row); row = []; }

        while (i < n && rows.length < maxRows) {
            const c = text[i];
            if (inQuotes) {
                if (c === '"') {
                    if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
                    inQuotes = false; i++; continue;
                }
                field += c; i++; continue;
            }
            if (c === '"') { inQuotes = true; i++; continue; }
            if (c === ',') { pushField(); i++; continue; }
            if (c === '\r') { i++; continue; }
            if (c === '\n') { pushRow(); i++; continue; }
            field += c; i++;
        }
        if (field.length > 0 || row.length > 0) pushRow();

        if (rows.length === 0) return { headers: [], rows: [], truncated: false };
        const headers = rows[0].map(h => h.trim());
        const dataRows = rows.slice(1).filter(r => r.length > 1 || (r.length === 1 && r[0] !== ""));
        return {
            headers,
            rows: dataRows.map(r => {
                const obj = {};
                headers.forEach((h, idx) => { obj[h] = r[idx] !== undefined ? r[idx] : ""; });
                return obj;
            }),
            truncated: text.length > 0 && rows.length >= maxRows,
        };
    };

    /* ── Basic statistics (pure functions, no dependency) ── */
    PG.stats = {
        mean(arr) {
            if (!arr.length) return NaN;
            return arr.reduce((s, v) => s + v, 0) / arr.length;
        },
        median(arr) {
            if (!arr.length) return NaN;
            const s = [...arr].sort((a, b) => a - b);
            const mid = Math.floor(s.length / 2);
            return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
        },
        quantile(arr, q) {
            if (!arr.length) return NaN;
            const s = [...arr].sort((a, b) => a - b);
            const pos = (s.length - 1) * q;
            const base = Math.floor(pos);
            const rest = pos - base;
            return s[base + 1] !== undefined ? s[base] + rest * (s[base + 1] - s[base]) : s[base];
        },
        quartiles(arr) {
            return { q1: PG.stats.quantile(arr, 0.25), q2: PG.stats.quantile(arr, 0.5), q3: PG.stats.quantile(arr, 0.75) };
        },
        stdev(arr) {
            if (arr.length < 2) return NaN;
            const m = PG.stats.mean(arr);
            const variance = arr.reduce((s, v) => s + (v - m) ** 2, 0) / (arr.length - 1);
            return Math.sqrt(variance);
        },
        correlation(xs, ys) {
            const n = Math.min(xs.length, ys.length);
            if (n < 2) return NaN;
            const mx = PG.stats.mean(xs.slice(0, n));
            const my = PG.stats.mean(ys.slice(0, n));
            let num = 0, dx2 = 0, dy2 = 0;
            for (let i = 0; i < n; i++) {
                const dx = xs[i] - mx, dy = ys[i] - my;
                num += dx * dy; dx2 += dx * dx; dy2 += dy * dy;
            }
            const denom = Math.sqrt(dx2 * dy2);
            return denom === 0 ? 0 : num / denom;
        },
        outliersIQR(arr) {
            const { q1, q3 } = PG.stats.quartiles(arr);
            const iqr = q3 - q1;
            const lo = q1 - 1.5 * iqr, hi = q3 + 1.5 * iqr;
            return arr.map((v, i) => ({ value: v, index: i, isOutlier: v < lo || v > hi }));
        },
    };

    /* ── E-commerce: price violation detection ──
       Transparent rule: a marketplace is allowed to discount up to
       `allowedDiscountPct` below the brand's MAP (minimum advertised price)
       before it's flagged as a potential violation. */
    PG.priceViolation = function (listing, allowedDiscountPct) {
        allowedDiscountPct = allowedDiscountPct === undefined ? 10 : allowedDiscountPct;
        const floor = listing.mapPrice * (1 - allowedDiscountPct / 100);
        const discountPct = ((listing.listPrice - listing.sellingPrice) / listing.listPrice) * 100;
        const isViolation = listing.sellingPrice < floor;
        const diff = Math.round(floor - listing.sellingPrice);
        return {
            floor: Math.round(floor),
            discountPct: Math.round(discountPct * 10) / 10,
            isViolation,
            diff: isViolation ? diff : 0,
        };
    };

    /* ── AI/ML: product similarity ──
       Weighted attribute match: category (0.4), price proximity (0.3),
       color (0.15), material (0.15). Same "transparent, explainable" spirit
       as the competitor scorer. */
    PG.productSimilarity = function (a, b) {
        if (a.id === b.id) return null;
        const categoryScore = a.category === b.category ? 1 : 0;
        const colorScore = a.color === b.color ? 1 : 0;
        const materialScore = a.material === b.material ? 1 : 0;
        const priceDelta = Math.abs(a.price - b.price);
        const priceMax = Math.max(a.price, b.price);
        const priceScore = priceMax === 0 ? 1 : Math.max(0, 1 - priceDelta / priceMax);
        const weights = { category: 0.4, price: 0.3, color: 0.15, material: 0.15 };
        const total = categoryScore * weights.category + priceScore * weights.price +
                       colorScore * weights.color + materialScore * weights.material;
        return { total: Math.round(total * 100), categoryScore, priceScore, colorScore, materialScore, weights };
    };

    /* ── Data quality: overall score from a parsed {headers, rows} table ──
       completeness (40%): 1 - overall missing-value rate.
       uniqueness  (30%): 1 - duplicate-row rate.
       validity    (30%): 1 - rate of numeric fields holding a negative value
                          in a column where every other value is non-negative
                          (a simple, explainable "looks invalid" heuristic). */
    PG.assessDataQuality = function (parsed) {
        const { headers, rows } = parsed;
        const n = rows.length;
        if (n === 0) return null;

        let missing = 0, totalCells = 0;
        const columnStats = {};
        headers.forEach(h => { columnStats[h] = { missing: 0, numericCount: 0, negativeCount: 0, values: [] }; });

        rows.forEach(row => {
            headers.forEach(h => {
                totalCells++;
                const v = (row[h] || "").trim();
                if (v === "") { missing++; columnStats[h].missing++; return; }
                const num = Number(v);
                if (!Number.isNaN(num) && v !== "") {
                    columnStats[h].numericCount++;
                    columnStats[h].values.push(num);
                    if (num < 0) columnStats[h].negativeCount++;
                }
            });
        });

        const completeness = 1 - missing / totalCells;

        const seen = new Set();
        let duplicates = 0;
        rows.forEach(row => {
            const key = headers.map(h => row[h]).join("|");
            if (seen.has(key)) duplicates++; else seen.add(key);
        });
        const uniqueness = 1 - duplicates / n;

        let invalidColumns = 0, numericColumns = 0;
        const columnDetails = headers.map(h => {
            const cs = columnStats[h];
            const isNumericColumn = cs.numericCount > n * 0.6;
            let outlierCount = 0;
            if (isNumericColumn && cs.values.length >= 4) {
                outlierCount = PG.stats.outliersIQR(cs.values).filter(o => o.isOutlier).length;
            }
            if (isNumericColumn) {
                numericColumns++;
                if (cs.negativeCount > 0) invalidColumns++;
            }
            return {
                name: h, missingPct: Math.round((cs.missing / n) * 1000) / 10,
                isNumericColumn, negativeCount: cs.negativeCount, outlierCount,
            };
        });
        const validity = numericColumns === 0 ? 1 : 1 - invalidColumns / numericColumns;

        const score = Math.round((completeness * 0.4 + uniqueness * 0.3 + validity * 0.3) * 100);
        return { score, completeness, uniqueness, validity, rowCount: n, duplicateCount: duplicates, columnDetails };
    };

    /* ── Histogram bucketing (Distribution Explorer) ──
       Splits arr into `bucketCount` equal-width buckets across its range
       and returns each bucket's edges and count. */
    PG.histogram = function (arr, bucketCount) {
        bucketCount = bucketCount || 8;
        const min = Math.min(...arr), max = Math.max(...arr);
        const width = (max - min) / bucketCount || 1;
        const buckets = Array.from({ length: bucketCount }, (_, i) => ({
            lo: min + i * width, hi: min + (i + 1) * width, count: 0,
        }));
        arr.forEach(v => {
            let idx = width === 0 ? 0 : Math.floor((v - min) / width);
            if (idx >= bucketCount) idx = bucketCount - 1;
            if (idx < 0) idx = 0;
            buckets[idx].count++;
        });
        return buckets;
    };

    /* ── Simple linear regression (least squares) ──
       Fits y = slope*x + intercept, reports R² (goodness of fit) and a
       predict() function for arbitrary x. */
    PG.linearRegression = function (xs, ys) {
        const n = Math.min(xs.length, ys.length);
        const mx = PG.stats.mean(xs.slice(0, n));
        const my = PG.stats.mean(ys.slice(0, n));
        let num = 0, den = 0;
        for (let i = 0; i < n; i++) {
            num += (xs[i] - mx) * (ys[i] - my);
            den += (xs[i] - mx) ** 2;
        }
        const slope = den === 0 ? 0 : num / den;
        const intercept = my - slope * mx;
        const r = PG.stats.correlation(xs.slice(0, n), ys.slice(0, n));
        return {
            slope, intercept, rSquared: r * r,
            predict: x => slope * x + intercept,
        };
    };

    /* ── Duplicate detection (exact + near) over a parsed {headers, rows} table ──
       Exact: identical across every column. Near: identical across every
       column except exactly one (the differing column is reported so the
       visitor can judge whether it's a typo/formatting slip or a real
       difference). Near-duplicate search is O(n^2), so it's skipped past
       a row-count guard to keep the page responsive. */
    PG.findDuplicates = function (parsed, opts) {
        opts = opts || {};
        const nearLimit = opts.nearLimit || 400;
        const { headers, rows } = parsed;
        const seen = new Map();
        const exact = [];
        rows.forEach((row, i) => {
            const key = headers.map(h => row[h]).join("|");
            if (seen.has(key)) exact.push({ index: i, matchIndex: seen.get(key) });
            else seen.set(key, i);
        });

        const near = [];
        if (rows.length <= nearLimit) {
            for (let i = 0; i < rows.length; i++) {
                for (let j = i + 1; j < rows.length; j++) {
                    let diffCol = null, diffCount = 0;
                    for (const h of headers) {
                        if ((rows[i][h] || "") !== (rows[j][h] || "")) {
                            diffCount++;
                            diffCol = h;
                            if (diffCount > 1) break;
                        }
                    }
                    if (diffCount === 1) near.push({ i, j, column: diffCol });
                }
            }
        }
        return { exact, near, nearSkipped: rows.length > nearLimit };
    };

    /* ── Column profiling (Analyze My Data) ──
       Classifies each column as numeric or text (same >60%-numeric heuristic
       as assessDataQuality) and reports the summary a quick "what's in this
       dataset?" pass would want: numeric → min/max/mean/median; text →
       most frequent value and how many distinct values there are. */
    PG.profileColumns = function (parsed) {
        const { headers, rows } = parsed;
        const n = rows.length;
        return headers.map(h => {
            const raw = rows.map(r => (r[h] || "").trim());
            const missing = raw.filter(v => v === "").length;
            const present = raw.filter(v => v !== "");
            const numericVals = present.map(Number).filter(v => !Number.isNaN(v));
            const isNumeric = present.length > 0 && numericVals.length > present.length * 0.6;
            const missingPct = n === 0 ? 0 : Math.round((missing / n) * 1000) / 10;
            if (isNumeric) {
                return {
                    name: h, type: "numeric", missingPct,
                    min: Math.min(...numericVals), max: Math.max(...numericVals),
                    mean: PG.stats.mean(numericVals), median: PG.stats.median(numericVals),
                };
            }
            const freq = new Map();
            present.forEach(v => freq.set(v, (freq.get(v) || 0) + 1));
            let topValue = "", topCount = 0;
            freq.forEach((c, v) => { if (c > topCount) { topCount = c; topValue = v; } });
            return { name: h, type: "text", missingPct, uniqueCount: freq.size, topValue, topCount };
        });
    };

    /* ── Threshold classification (Classification Playground) ──
       Evaluates a simple "predict positive if value is above/below threshold"
       rule against known labels. Returns the confusion-matrix counts plus
       accuracy/precision/recall, so moving the threshold shows the real
       trade-off rather than a single canned number. */
    PG.evaluateThreshold = function (values, threshold, actualPositive, direction) {
        let tp = 0, fp = 0, tn = 0, fn = 0;
        values.forEach((v, i) => {
            const predicted = direction === "below" ? v < threshold : v > threshold;
            const actual = actualPositive[i];
            if (predicted && actual) tp++;
            else if (predicted && !actual) fp++;
            else if (!predicted && actual) fn++;
            else tn++;
        });
        const total = values.length;
        return {
            tp, fp, tn, fn,
            accuracy: total === 0 ? 0 : (tp + tn) / total,
            precision: (tp + fp) === 0 ? 0 : tp / (tp + fp),
            recall: (tp + fn) === 0 ? 0 : tp / (tp + fn),
        };
    };

    /* ── Per-row issue detection (Find the Problem) ──
       For each row, flags missing cells, negative values in numeric columns,
       and IQR outliers within their own column — the same signals
       assessDataQuality aggregates, reported per-row instead of as a score
       so a visitor can point at a specific row and be told what's wrong
       with it (or that nothing is). */
    PG.detectRowIssues = function (parsed) {
        const { headers, rows } = parsed;
        const numericCols = headers.filter(h => {
            const present = rows.map(r => (r[h] || "").trim()).filter(v => v !== "");
            const numericVals = present.map(Number).filter(v => !Number.isNaN(v));
            return present.length > 0 && numericVals.length > present.length * 0.6;
        });
        const outlierSets = {};
        numericCols.forEach(h => {
            const idxVals = rows
                .map((r, i) => ({ i, raw: (r[h] || "").trim() }))
                .filter(o => o.raw !== "" && !Number.isNaN(Number(o.raw)))
                .map(o => ({ i: o.i, v: Number(o.raw) }));
            const flagged = PG.stats.outliersIQR(idxVals.map(o => o.v))
                .map((o, k) => (o.isOutlier ? idxVals[k].i : null))
                .filter(x => x !== null);
            outlierSets[h] = new Set(flagged);
        });
        return rows.map((row, i) => {
            const issues = [];
            headers.forEach(h => {
                const v = (row[h] || "").trim();
                if (v === "") { issues.push({ column: h, type: "missing", detail: "Missing value" }); return; }
                if (numericCols.includes(h)) {
                    const num = Number(v);
                    if (num < 0) issues.push({ column: h, type: "negative", detail: `Negative value: ${v}` });
                    if (outlierSets[h].has(i)) issues.push({ column: h, type: "outlier", detail: `Outlier value: ${v}` });
                }
            });
            return { index: i, issues };
        });
    };

    /* ── Small helpers ── */
    PG.clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    PG.pct = v => Math.round(v * 100) + "%";
    PG.esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

    global.PG = PG;
})(window);
