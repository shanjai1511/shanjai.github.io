/* Representative/synthetic demo data for the Playground's E-commerce Intelligence
   experiments. Not real client or production data — plausible values only, for
   demonstrating how the scoring logic works. Loaded as a plain script (not fetch()),
   so it works identically over file://, a local server, and GitHub Pages. */
const PG_ECOMMERCE_BRANDS = [
    { id: "nike",         name: "Nike",          categories: ["Footwear", "Activewear", "Accessories"], priceTier: "premium", avgPrice: 4200, marketplaces: ["Amazon", "Myntra", "Flipkart", "AJIO"],            productCount: 1450, rating: 4.4 },
    { id: "adidas",       name: "Adidas",        categories: ["Footwear", "Activewear", "Accessories"], priceTier: "premium", avgPrice: 3900, marketplaces: ["Amazon", "Myntra", "Flipkart", "AJIO", "TataCliq"], productCount: 1620, rating: 4.3 },
    { id: "puma",         name: "Puma",          categories: ["Footwear", "Activewear"],                 priceTier: "mid",     avgPrice: 2800, marketplaces: ["Amazon", "Myntra", "Flipkart"],                    productCount: 980,  rating: 4.1 },
    { id: "asics",        name: "ASICS",         categories: ["Footwear", "Activewear"],                 priceTier: "premium", avgPrice: 4500, marketplaces: ["Amazon", "Myntra"],                                productCount: 320,  rating: 4.5 },
    { id: "underarmour",  name: "Under Armour",  categories: ["Activewear", "Accessories"],               priceTier: "premium", avgPrice: 3600, marketplaces: ["Amazon", "Myntra", "AJIO"],                        productCount: 540,  rating: 4.0 },
    { id: "reebok",       name: "Reebok",        categories: ["Footwear", "Activewear"],                 priceTier: "mid",     avgPrice: 2500, marketplaces: ["Amazon", "Myntra", "Flipkart", "AJIO"],           productCount: 760,  rating: 3.9 },
    { id: "newbalance",   name: "New Balance",   categories: ["Footwear"],                                priceTier: "premium", avgPrice: 5200, marketplaces: ["Amazon", "Myntra"],                                productCount: 210,  rating: 4.6 },
    { id: "skechers",     name: "Skechers",      categories: ["Footwear", "Accessories"],                priceTier: "mid",     avgPrice: 2900, marketplaces: ["Amazon", "Myntra", "Flipkart", "AJIO", "TataCliq"], productCount: 1100, rating: 4.2 },
    { id: "levis",        name: "Levi's",        categories: ["Apparel", "Accessories"],                  priceTier: "mid",     avgPrice: 2200, marketplaces: ["Amazon", "Myntra", "Flipkart"],                    productCount: 890,  rating: 4.0 },
    { id: "hm",           name: "H&M",           categories: ["Apparel", "Accessories"],                  priceTier: "budget",  avgPrice: 1200, marketplaces: ["Amazon", "Myntra", "Flipkart", "AJIO"],           productCount: 2400, rating: 3.8 }
];
