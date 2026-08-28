/* Representative/synthetic demo dataset for the Trend Analyzer — 30 daily
   rows with a gently upward-trending order count plus realistic day-to-day
   noise (including a couple of dips), so a date-range filter produces a
   genuinely different trend line depending on the window chosen. Not real
   sales or order data. */
const PG_SAMPLE_TIMESERIES = [
    { date: "2026-06-01", orders: 142, avg_order_value: 1180 },
    { date: "2026-06-02", orders: 138, avg_order_value: 1205 },
    { date: "2026-06-03", orders: 151, avg_order_value: 1150 },
    { date: "2026-06-04", orders: 147, avg_order_value: 1220 },
    { date: "2026-06-05", orders: 160, avg_order_value: 1190 },
    { date: "2026-06-06", orders: 129, avg_order_value: 1240 },
    { date: "2026-06-07", orders: 134, avg_order_value: 1210 },
    { date: "2026-06-08", orders: 158, avg_order_value: 1170 },
    { date: "2026-06-09", orders: 163, avg_order_value: 1230 },
    { date: "2026-06-10", orders: 171, avg_order_value: 1195 },
    { date: "2026-06-11", orders: 155, avg_order_value: 1260 },
    { date: "2026-06-12", orders: 149, avg_order_value: 1245 },
    { date: "2026-06-13", orders: 178, avg_order_value: 1200 },
    { date: "2026-06-14", orders: 182, avg_order_value: 1215 },
    { date: "2026-06-15", orders: 168, avg_order_value: 1280 },
    { date: "2026-06-16", orders: 174, avg_order_value: 1255 },
    { date: "2026-06-17", orders: 190, avg_order_value: 1225 },
    { date: "2026-06-18", orders: 121, avg_order_value: 1300 },
    { date: "2026-06-19", orders: 186, avg_order_value: 1270 },
    { date: "2026-06-20", orders: 195, avg_order_value: 1240 },
    { date: "2026-06-21", orders: 201, avg_order_value: 1290 },
    { date: "2026-06-22", orders: 188, avg_order_value: 1310 },
    { date: "2026-06-23", orders: 207, avg_order_value: 1265 },
    { date: "2026-06-24", orders: 213, avg_order_value: 1295 },
    { date: "2026-06-25", orders: 199, avg_order_value: 1340 },
    { date: "2026-06-26", orders: 219, avg_order_value: 1310 },
    { date: "2026-06-27", orders: 226, avg_order_value: 1325 },
    { date: "2026-06-28", orders: 208, avg_order_value: 1360 },
    { date: "2026-06-29", orders: 231, avg_order_value: 1330 },
    { date: "2026-06-30", orders: 238, avg_order_value: 1350 },
];
