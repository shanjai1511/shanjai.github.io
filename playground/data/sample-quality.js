/* Representative/synthetic demo CSV (as text, run through the real PG.parseCSV
   the same way an uploaded file would be): deliberately contains the kinds of
   problems the Data Quality Checker looks for: duplicate rows, missing values,
   a negative price, and a price outlier. Not real product/client data. */
const PG_SAMPLE_QUALITY_CSV =
`product_id,product_name,category,price,rating,in_stock
1,Air Zoom Pegasus,Footwear,6999,4.4,true
1,Air Zoom Pegasus,Footwear,6999,4.4,true
3,Ultraboost 22,Footwear,15999,4.3,true
4,RS-X,Footwear,7999,,true
5,Classic Leather,Footwear,5499,3.9,true
6,Gel-Kayano 29,Footwear,-13999,4.5,false
7,Revolution 6,Footwear,2999,4.0,true
8,Track Jacket,Apparel,2200,,true
9,Running Cap,Accessories,899,4.1,true
9,Running Cap,Accessories,899,4.1,true
11,Duffel Bag,Accessories,3499,4.2,
12,Yoga Mat,Accessories,1899,4.6,true
13,Compression Socks,Apparel,499,3.7,true
14,Windbreaker,Apparel,45000,4.1,true`;
