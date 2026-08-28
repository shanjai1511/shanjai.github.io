/* Representative/synthetic demo dataset for the Correlation Explorer — 20 rows,
   5 numeric columns with deliberately varied relationships (price vs. units_sold
   trend downward together, ad_spend vs. units_sold trend upward together, rating
   is mostly independent of the rest) so the correlation matrix tells a real,
   instructive story. Not real sales data. */
const PG_SAMPLE_SALES = [
    { price: 899,  units_sold: 410, ad_spend: 12000, rating: 4.2, returns_pct: 3.1 },
    { price: 1199, units_sold: 360, ad_spend: 11000, rating: 4.0, returns_pct: 3.4 },
    { price: 1499, units_sold: 330, ad_spend: 14000, rating: 4.5, returns_pct: 2.8 },
    { price: 1799, units_sold: 300, ad_spend: 13500, rating: 3.8, returns_pct: 4.0 },
    { price: 2099, units_sold: 275, ad_spend: 15500, rating: 4.3, returns_pct: 3.6 },
    { price: 2399, units_sold: 250, ad_spend: 16000, rating: 4.1, returns_pct: 4.2 },
    { price: 2699, units_sold: 230, ad_spend: 17500, rating: 3.9, returns_pct: 4.5 },
    { price: 2999, units_sold: 205, ad_spend: 18000, rating: 4.6, returns_pct: 3.9 },
    { price: 3299, units_sold: 190, ad_spend: 19500, rating: 4.0, returns_pct: 5.1 },
    { price: 3599, units_sold: 175, ad_spend: 20000, rating: 4.4, returns_pct: 4.7 },
    { price: 3899, units_sold: 160, ad_spend: 21500, rating: 3.7, returns_pct: 5.5 },
    { price: 4199, units_sold: 150, ad_spend: 22000, rating: 4.2, returns_pct: 5.2 },
    { price: 4499, units_sold: 135, ad_spend: 23500, rating: 4.5, returns_pct: 5.8 },
    { price: 4799, units_sold: 120, ad_spend: 24000, rating: 3.9, returns_pct: 6.1 },
    { price: 5099, units_sold: 110, ad_spend: 25500, rating: 4.1, returns_pct: 6.4 },
    { price: 5399, units_sold: 100, ad_spend: 26000, rating: 4.6, returns_pct: 5.9 },
    { price: 5699, units_sold: 90,  ad_spend: 27500, rating: 3.8, returns_pct: 6.8 },
    { price: 5999, units_sold: 80,  ad_spend: 28000, rating: 4.3, returns_pct: 7.0 },
    { price: 6299, units_sold: 70,  ad_spend: 29500, rating: 4.0, returns_pct: 7.3 },
    { price: 6599, units_sold: 60,  ad_spend: 30000, rating: 4.4, returns_pct: 7.6 },
];
