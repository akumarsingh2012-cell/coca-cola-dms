import { useState, useEffect, useCallback, useRef } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ComposedChart } from "recharts";

/* ═══════════════════════════════════════════════════════════════════
   DESIGN SYSTEM
═══════════════════════════════════════════════════════════════════ */
const C = {
  // Core palette — warm industrial dark
  bg:        "#0C0B0A",
  surface:   "#141312",
  panel:     "#1A1918",
  card:      "#201F1D",
  raised:    "#272523",
  hover:     "#2E2C29",
  border:    "#302E2B",
  divider:   "#252320",
  // Brand
  red:       "#E8001C",
  redDim:    "#8C0011",
  redGlow:   "rgba(232,0,28,0.15)",
  // Text
  white:     "#F2EDE4",
  text:      "#C8C0B4",
  muted:     "#7A7268",
  faint:     "#3D3A36",
  // Semantic
  green:     "#00C97A",
  greenDim:  "rgba(0,201,122,0.12)",
  blue:      "#1E88E5",
  blueDim:   "rgba(30,136,229,0.12)",
  yellow:    "#F5B800",
  yellowDim: "rgba(245,184,0,0.12)",
  orange:    "#E8670A",
  orangeDim: "rgba(232,103,10,0.12)",
  purple:    "#9C6FD6",
  purpleDim: "rgba(156,111,214,0.12)",
  teal:      "#00B8A0",
  // Fonts
  display:   "'Syne', 'DM Sans', sans-serif",
  mono:      "'JetBrains Mono', 'Fira Code', monospace",
  body:      "'Syne', 'DM Sans', system-ui, sans-serif",
};

/* ═══════════════════════════════════════════════════════════════════
   MOCK DATA — Complete FMCG Dataset
═══════════════════════════════════════════════════════════════════ */
const DATA = {
  // ── Auth Users ──────────────────────────────────────────────
  users: [
    { id:"USR001", name:"Neha Sharma", role:"NSM", email:"neha@coke.in", mobile:"9810012345", zone:"All India", avatar:"NS", password:"admin123" },
    { id:"USR002", name:"Rajesh Pillai", role:"RSM", email:"rajesh@coke.in", mobile:"9820023456", zone:"South India", avatar:"RP", password:"rsm123" },
    { id:"USR003", name:"Amit Verma", role:"SO", email:"amit@coke.in", mobile:"9830034567", zone:"Delhi NCR", avatar:"AV", password:"so123" },
    { id:"USR004", name:"Priya Krishnan", role:"Salesman", email:"priya@coke.in", mobile:"9840045678", zone:"Bangalore East", avatar:"PK", password:"sm123" },
    { id:"USR005", name:"Dinesh Rao", role:"Distributor", email:"dinesh@coke.in", mobile:"9850056789", zone:"Chennai North", avatar:"DR", password:"dist123" },
  ],

  // ── Org Hierarchy ────────────────────────────────────────────
  org: {
    company: { id:"HCCB", name:"Hindustan Coca-Cola Beverages Pvt. Ltd.", gstin:"27AAACC1234A1Z5", hq:"Gurugram, Haryana" },
    zones: [
      { id:"ZN-N", name:"North Zone", head:"Anil Kapoor", states:["Delhi","UP","Uttarakhand","HP","J&K","Punjab","Haryana","Rajasthan"], regions:4, territories:24, distributors:312 },
      { id:"ZN-S", name:"South Zone", head:"Suresh Iyer", states:["Tamil Nadu","Karnataka","Kerala","Telangana","AP"], regions:5, territories:28, distributors:284 },
      { id:"ZN-W", name:"West Zone", head:"Farhan Sheikh", states:["Maharashtra","Gujarat","Goa","MP","Chhattisgarh"], regions:4, territories:22, distributors:268 },
      { id:"ZN-E", name:"East Zone", head:"Biplab Roy", states:["West Bengal","Odisha","Bihar","Jharkhand","Assam","NE States"], regions:3, territories:18, distributors:241 },
      { id:"ZN-C", name:"Central Zone", head:"Meera Joshi", states:["UP (East)","MP (North)"], regions:2, territories:14, distributors:179 },
    ],
    regions: [
      { id:"RG-DL", zone:"ZN-N", name:"Delhi Metro Region", territories:6, distributors:84 },
      { id:"RG-UP", zone:"ZN-N", name:"UP Region", territories:8, distributors:112 },
      { id:"RG-MH", zone:"ZN-W", name:"Maharashtra Region", territories:8, distributors:98 },
      { id:"RG-KA", zone:"ZN-S", name:"Karnataka Region", territories:6, distributors:78 },
      { id:"RG-TN", zone:"ZN-S", name:"Tamil Nadu Region", territories:7, distributors:92 },
    ],
    territories: [
      { id:"TR-DLN", region:"RG-DL", name:"Delhi North Territory", so:"Ravi Saxena", distributors:14, retailers:2840, beats:28 },
      { id:"TR-DLS", region:"RG-DL", name:"Delhi South Territory", so:"Monika Tiwari", distributors:12, retailers:2420, beats:24 },
      { id:"TR-BLR", region:"RG-KA", name:"Bangalore East Territory", so:"Arun Kumar", distributors:11, retailers:2180, beats:22 },
      { id:"TR-CHN", region:"RG-TN", name:"Chennai North Territory", so:"Kavitha S", distributors:13, retailers:2560, beats:26 },
      { id:"TR-MUM", region:"RG-MH", name:"Mumbai West Territory", so:"Vikram Joshi", distributors:16, retailers:3120, beats:32 },
    ],
  },

  // ── Distributors ─────────────────────────────────────────────
  distributors: [
    { id:"DB-1024", name:"Ramesh Beverages Pvt Ltd", type:"primary", territory:"TR-DLN", state:"Delhi", gstin:"07AABCR1234D1Z2", contact:"Ramesh Gupta", mobile:"9811122334", credit:2500000, used:1820000, outstanding:682000, agingDays:12, status:"active", lastOrder:"Today", salesmen:4, retailers:142 },
    { id:"DB-1025", name:"Krishna Traders", type:"primary", territory:"TR-DLS", state:"Delhi", gstin:"07AABCK5678D1Z3", contact:"Krishna Sharma", mobile:"9822233445", credit:2000000, used:1980000, outstanding:1210000, agingDays:38, status:"overdue", lastOrder:"Yesterday", salesmen:3, retailers:118 },
    { id:"DB-1026", name:"Suresh Enterprises", type:"primary", territory:"TR-CHN", state:"Tamil Nadu", gstin:"33AABCS9012D1Z4", contact:"Suresh Pillai", mobile:"9833344556", credit:1800000, used:1240000, outstanding:420000, agingDays:8, status:"active", lastOrder:"Today", salesmen:4, retailers:138 },
    { id:"DB-1027", name:"Patel Cool Drinks", type:"sub", territory:"TR-MUM", state:"Maharashtra", gstin:"27AABCP3456D1Z5", contact:"Vikas Patel", mobile:"9844455667", credit:2200000, used:2200000, outstanding:1580000, agingDays:62, status:"blocked", lastOrder:"8 Days Ago", salesmen:2, retailers:84 },
    { id:"DB-1028", name:"Bangalore Beverages Co", type:"primary", territory:"TR-BLR", state:"Karnataka", gstin:"29AABCB7890D1Z6", contact:"Sunil Nair", mobile:"9855566778", credit:3000000, used:2130000, outstanding:710000, agingDays:15, status:"active", lastOrder:"Today", salesmen:5, retailers:168 },
    { id:"DB-1029", name:"Hyderabad Fizz Ltd", type:"primary", territory:"TR-DLN", state:"Telangana", gstin:"36AABCH2345D1Z7", contact:"Arjun Reddy", mobile:"9866677889", credit:2800000, used:1480000, outstanding:390000, agingDays:6, status:"active", lastOrder:"Today", salesmen:5, retailers:184 },
    { id:"DB-1030", name:"North Star Trading", type:"sub", territory:"TR-DLS", state:"UP", gstin:"09AABCN6789D1Z8", contact:"Santosh Kumar", mobile:"9877788990", credit:1500000, used:1500000, outstanding:940000, agingDays:45, status:"blocked", lastOrder:"5 Days Ago", salesmen:2, retailers:72 },
    { id:"DB-1031", name:"Kolkata Cold Chain", type:"depot", territory:"TR-MUM", state:"West Bengal", gstin:"19AABCK0123D1Z9", contact:"Debashish Paul", mobile:"9888899001", credit:2000000, used:1120000, outstanding:530000, agingDays:18, status:"active", lastOrder:"Yesterday", salesmen:3, retailers:96 },
  ],

  // ── SKU Master ───────────────────────────────────────────────
  skus: [
    { id:"SKU001", code:"CC-750G", brand:"Coca-Cola", flavour:"Cola", pack:"Glass", vol:750, unit:"ml", returnable:true, hsn:"22021010", gst:12, mrp:40, ptr:32, ptd:28, caseQty:24 },
    { id:"SKU002", code:"TU-2LP", brand:"Thums Up", flavour:"Cola", pack:"PET", vol:2000, unit:"ml", returnable:false, hsn:"22021010", gst:12, mrp:115, ptr:92, ptd:82, caseQty:9 },
    { id:"SKU003", code:"LM-300P", brand:"Limca", flavour:"Lemon", pack:"PET", vol:300, unit:"ml", returnable:false, hsn:"22021010", gst:12, mrp:20, ptr:15, ptd:13, caseQty:24 },
    { id:"SKU004", code:"SP-125P", brand:"Sprite", flavour:"Lime", pack:"PET", vol:1250, unit:"ml", returnable:false, hsn:"22021010", gst:12, mrp:65, ptr:52, ptd:46, caseQty:12 },
    { id:"SKU005", code:"MZ-1LP", brand:"Maaza", flavour:"Mango", pack:"PET", vol:1000, unit:"ml", returnable:false, hsn:"22029010", gst:12, mrp:60, ptr:48, ptd:42, caseQty:12 },
    { id:"SKU006", code:"KW-1L", brand:"Kinley Water", flavour:"Water", pack:"PET", vol:1000, unit:"ml", returnable:false, hsn:"22011000", gst:18, mrp:20, ptr:12, ptd:10, caseQty:24 },
    { id:"SKU007", code:"CC-330C", brand:"Coca-Cola", flavour:"Cola", pack:"Can", vol:330, unit:"ml", returnable:false, hsn:"22021010", gst:12, mrp:40, ptr:32, ptd:28, caseQty:24 },
    { id:"SKU008", code:"MM-400P", brand:"Minute Maid", flavour:"Orange", pack:"PET", vol:400, unit:"ml", returnable:false, hsn:"22029010", gst:12, mrp:30, ptr:24, ptd:21, caseQty:24 },
    { id:"SKU009", code:"TU-500G", brand:"Thums Up", flavour:"Cola", pack:"Glass", vol:500, unit:"ml", returnable:true, hsn:"22021010", gst:12, mrp:30, ptr:24, ptd:21, caseQty:24 },
    { id:"SKU010", code:"FM-600P", brand:"Fanta", flavour:"Orange", pack:"PET", vol:600, unit:"ml", returnable:false, hsn:"22021010", gst:12, mrp:38, ptr:30, ptd:26, caseQty:24 },
  ],

  // ── Orders ───────────────────────────────────────────────────
  orders: [
    { id:"ORD-2025-084291", type:"secondary", dist:"DB-1024", retailer:"Sharma General Store", beat:"Beat-A1", salesman:"SM-441", items:[{sku:"SKU001",qty:5,price:28},{sku:"SKU004",qty:3,price:46}], gross:282, disc:0, cgst:16.92, sgst:16.92, total:315.84, status:"delivered", irn:"IRN-2025-1921", ewayBill:"EW-2025-4821", time:"09:14", date:"2025-02-26" },
    { id:"ORD-2025-084290", type:"secondary", dist:"DB-1028", retailer:"City Supermart", beat:"Beat-B3", salesman:"SM-444", items:[{sku:"SKU002",qty:4,price:82},{sku:"SKU007",qty:4,price:28}], gross:440, disc:22, cgst:25.08, sgst:25.08, total:468.16, status:"dispatched", irn:"IRN-2025-1920", ewayBill:null, time:"08:52", date:"2025-02-26" },
    { id:"ORD-2025-084289", type:"primary", dist:"DB-1025", retailer:"—", beat:"—", salesman:"—", items:[{sku:"SKU001",qty:200,price:28},{sku:"SKU002",qty:80,price:82}], gross:12160, disc:0, cgst:729.6, sgst:729.6, total:13619.2, status:"in-transit", irn:"IRN-2025-1919", ewayBill:"EW-2025-4820", time:"08:30", date:"2025-02-26" },
    { id:"ORD-2025-084288", type:"secondary", dist:"DB-1029", retailer:"Raj Kirana", beat:"Beat-C2", salesman:"SM-443", items:[{sku:"SKU003",qty:10,price:13},{sku:"SKU006",qty:6,price:10}], gross:190, disc:0, cgst:11.4, sgst:11.4, total:212.8, status:"confirmed", irn:null, ewayBill:null, time:"08:18", date:"2025-02-26" },
    { id:"ORD-2025-084287", type:"secondary", dist:"DB-1026", retailer:"Hotel Crown Plaza", beat:"Beat-D1", salesman:"SM-446", items:[{sku:"SKU007",qty:20,price:28},{sku:"SKU009",qty:10,price:21}], gross:770, disc:38.5, cgst:43.89, sgst:43.89, total:819.28, status:"delivered", irn:"IRN-2025-1918", ewayBill:null, time:"07:55", date:"2025-02-26" },
    { id:"ORD-2025-084286", type:"primary", dist:"DB-1027", retailer:"—", beat:"—", salesman:"—", items:[{sku:"SKU001",qty:150,price:28},{sku:"SKU003",qty:200,price:13}], gross:6800, disc:0, cgst:408, sgst:408, total:7616, status:"cancelled", irn:null, ewayBill:null, time:"07:30", date:"2025-02-26" },
    { id:"ORD-2025-084285", type:"secondary", dist:"DB-1030", retailer:"Lucky Mart", beat:"Beat-E4", salesman:"SM-445", items:[{sku:"SKU005",qty:8,price:42},{sku:"SKU008",qty:6,price:21}], gross:462, disc:0, cgst:27.72, sgst:27.72, total:517.44, status:"confirmed", irn:null, ewayBill:null, time:"07:12", date:"2025-02-26" },
    { id:"ORD-2025-084284", type:"secondary", dist:"DB-1031", retailer:"Fresh Mart", beat:"Beat-F2", salesman:"SM-442", items:[{sku:"SKU006",qty:24,price:10},{sku:"SKU010",qty:5,price:26}], gross:370, disc:18.5, cgst:20.97, sgst:20.97, total:393.44, status:"delivered", irn:"IRN-2025-1917", ewayBill:null, time:"06:48", date:"2025-02-26" },
  ],

  // ── Inventory ────────────────────────────────────────────────
  inventory: [
    { id:"INV001", sku:"SKU001", warehouse:"WH-DL-01", batch:"BT-20250118-A", mfgDate:"2025-01-18", expiryDate:"2025-07-18", qtyCases:4820, qtyUnits:115680, damaged:48, temp:"8°C", status:"good" },
    { id:"INV002", sku:"SKU002", warehouse:"WH-MH-01", batch:"BT-20250122-B", mfgDate:"2025-01-22", expiryDate:"2025-07-22", qtyCases:3140, qtyUnits:28260, damaged:22, temp:"6°C", status:"good" },
    { id:"INV003", sku:"SKU003", warehouse:"WH-TN-01", batch:"BT-20241215-C", mfgDate:"2024-12-15", expiryDate:"2025-03-15", qtyCases:842, qtyUnits:20208, damaged:12, temp:"7°C", status:"near_expiry" },
    { id:"INV004", sku:"SKU004", warehouse:"WH-DL-01", batch:"BT-20250105-D", mfgDate:"2025-01-05", expiryDate:"2025-07-05", qtyCases:2180, qtyUnits:26160, damaged:0, temp:"8°C", status:"good" },
    { id:"INV005", sku:"SKU005", warehouse:"WH-KA-01", batch:"BT-20241201-E", mfgDate:"2024-12-01", expiryDate:"2025-03-01", qtyCases:380, qtyUnits:4560, damaged:8, temp:"5°C", status:"near_expiry" },
    { id:"INV006", sku:"SKU006", warehouse:"WH-TS-01", batch:"BT-20250201-F", mfgDate:"2025-02-01", expiryDate:"2026-02-01", qtyCases:8920, qtyUnits:214080, damaged:0, temp:"ambient", status:"good" },
    { id:"INV007", sku:"SKU007", warehouse:"WH-DL-01", batch:"BT-20241120-G", mfgDate:"2024-11-20", expiryDate:"2025-02-20", qtyCases:124, qtyUnits:2976, damaged:14, temp:"4°C", status:"expired" },
    { id:"INV008", sku:"SKU008", warehouse:"WH-MH-01", batch:"BT-20250115-H", mfgDate:"2025-01-15", expiryDate:"2026-01-15", qtyCases:6240, qtyUnits:149760, damaged:0, temp:"8°C", status:"good" },
  ],

  // ── Beats ────────────────────────────────────────────────────
  beats: [
    { id:"Beat-A1", territory:"TR-DLN", name:"Karol Bagh Beat", day:"Mon,Thu", outlets:22, salesman:"SM-441", coverage:91 },
    { id:"Beat-A2", territory:"TR-DLN", name:"Paharganj Beat", day:"Tue,Fri", outlets:18, salesman:"SM-441", coverage:83 },
    { id:"Beat-B3", territory:"TR-BLR", name:"Indiranagar Beat", day:"Mon,Wed,Fri", outlets:26, salesman:"SM-444", coverage:88 },
    { id:"Beat-C2", territory:"TR-MUM", name:"Bandra West Beat", day:"Tue,Sat", outlets:30, salesman:"SM-443", coverage:77 },
    { id:"Beat-D1", territory:"TR-CHN", name:"Anna Nagar Beat", day:"Mon,Thu", outlets:24, salesman:"SM-446", coverage:96 },
  ],

  // ── Salesmen ─────────────────────────────────────────────────
  salesmen: [
    { id:"SM-441", name:"Ravi Kumar", dist:"DB-1024", territory:"TR-DLN", mobile:"9811100001", beats:["Beat-A1","Beat-A2"], visitsToday:18, visitTarget:22, ordersToday:15, valueToday:124800, collection:98400, attendance:"present", lat:28.6448, lng:77.2167, lastCheckin:"09:45 AM" },
    { id:"SM-442", name:"Priya Sharma", dist:"DB-1031", territory:"TR-MUM", mobile:"9822200002", beats:["Beat-F2"], visitsToday:14, visitTarget:18, ordersToday:12, valueToday:98200, collection:82100, attendance:"present", lat:19.0760, lng:72.8777, lastCheckin:"09:30 AM" },
    { id:"SM-443", name:"Arjun Krishnan", dist:"DB-1029", territory:"TR-DLS", mobile:"9833300003", beats:["Beat-C2"], visitsToday:20, visitTarget:20, ordersToday:18, valueToday:142600, collection:114800, attendance:"present", lat:17.3850, lng:78.4867, lastCheckin:"10:02 AM" },
    { id:"SM-444", name:"Suresh Menon", dist:"DB-1028", territory:"TR-BLR", mobile:"9844400004", beats:["Beat-B3"], visitsToday:10, visitTarget:20, ordersToday:8, valueToday:64200, collection:48600, attendance:"late", lat:12.9716, lng:77.5946, lastCheckin:"10:28 AM" },
    { id:"SM-445", name:"Amit Verma", dist:"DB-1030", territory:"TR-DLS", mobile:"9855500005", beats:["Beat-E4"], visitsToday:0, visitTarget:18, ordersToday:0, valueToday:0, collection:0, attendance:"absent", lat:null, lng:null, lastCheckin:"—" },
    { id:"SM-446", name:"Deepa Nair", dist:"DB-1026", territory:"TR-CHN", mobile:"9866600006", beats:["Beat-D1"], visitsToday:16, visitTarget:19, ordersToday:14, valueToday:108400, collection:94200, attendance:"present", lat:13.0827, lng:80.2707, lastCheckin:"09:58 AM" },
  ],

  // ── Schemes ──────────────────────────────────────────────────
  schemes: [
    { id:"SCH-001", name:"Summer Surge GT", type:"buy_x_get_y", channel:"GT", triggerSku:"SKU001", freeSku:"SKU001", buyQty:5, getQty:1, validFrom:"2025-03-01", validTo:"2025-05-31", budget:24000000, utilized:8200000, zones:["ZN-N","ZN-S","ZN-W","ZN-E","ZN-C"], status:"upcoming" },
    { id:"SCH-002", name:"MT Value Pack Feb", type:"volume_discount", channel:"MT", triggerSku:"ALL", discountPct:10, minOrderValue:50000, validFrom:"2025-02-01", validTo:"2025-02-28", budget:12000000, utilized:11400000, zones:["ZN-N","ZN-S","ZN-W"], status:"active" },
    { id:"SCH-003", name:"HORECA Premium Push", type:"free_sku", channel:"HORECA", triggerSku:"SKU002", freeSku:"SKU005", buyQty:10, getQty:2, validFrom:"2025-02-15", validTo:"2025-03-15", budget:8000000, utilized:2200000, zones:["ZN-S","ZN-W"], status:"active" },
    { id:"SCH-004", name:"Holi Special Slab", type:"slab_discount", channel:"GT", triggerSku:"SKU003,SKU004", slabs:[{min:5,max:10,disc:5},{min:11,max:20,disc:8},{min:21,max:999,disc:12}], validFrom:"2025-03-01", validTo:"2025-03-25", budget:18000000, utilized:0, zones:["ZN-N","ZN-C"], status:"upcoming" },
    { id:"SCH-005", name:"Water Loyalty Dec", type:"volume", channel:"ALL", triggerSku:"SKU006", discountPct:3, minCases:50, validFrom:"2024-12-01", validTo:"2024-12-31", budget:6000000, utilized:5800000, zones:["ZN-N","ZN-S","ZN-W","ZN-E","ZN-C"], status:"expired" },
  ],

  // ── Retailers (sample for mobile flow) ──────────────────────
  retailers: [
    { id:"RT-8821", name:"Sharma General Store", type:"Kirana", channel:"GT", segment:"A", dist:"DB-1024", beat:"Beat-A1", address:"42, Karol Bagh Market, Delhi", lat:28.6501, lng:77.1905, credit:15000, outstanding:4200, hasCooler:true, coolerModel:"Visi 220L", lastOrder:"Today", status:"active" },
    { id:"RT-8822", name:"City Supermart", type:"Supermarket", channel:"MT", segment:"A", dist:"DB-1028", beat:"Beat-B3", address:"18, 100 Feet Rd, Indiranagar, Bangalore", lat:12.9759, lng:77.6408, credit:50000, outstanding:12400, hasCooler:true, coolerModel:"Chest 300L", lastOrder:"Today", status:"active" },
    { id:"RT-8823", name:"Hotel Crown Plaza", type:"Hotel", channel:"HORECA", segment:"A", dist:"DB-1026", beat:"Beat-D1", address:"5, Anna Nagar, Chennai", lat:13.0862, lng:80.2101, credit:100000, outstanding:28600, hasCooler:true, coolerModel:"Commercial 480L", lastOrder:"Today", status:"active" },
    { id:"RT-8824", name:"Raj Kirana", type:"Kirana", channel:"GT", segment:"B", dist:"DB-1029", beat:"Beat-C2", address:"112, Secunderabad, Hyderabad", lat:17.4399, lng:78.4983, credit:8000, outstanding:1800, hasCooler:false, coolerModel:null, lastOrder:"Yesterday", status:"active" },
    { id:"RT-8825", name:"Lucky Mart", type:"Convenience", channel:"GT", segment:"B", dist:"DB-1030", beat:"Beat-E4", address:"34, Hazratganj, Lucknow", lat:26.8612, lng:80.9253, credit:10000, outstanding:0, hasCooler:true, coolerModel:"Visi 120L", lastOrder:"3 Days Ago", status:"active" },
  ],

  // ── Assets ───────────────────────────────────────────────────
  assets: [
    { id:"VC-8821", type:"Visi Cooler 220L", brand:"Coca-Cola Branded", qr:"QR8821", retailer:"RT-8821", dist:"DB-1024", territory:"TR-DLN", allocated:"2023-04-12", warranty:"2026-04-11", amc:"active", amcExpiry:"2025-12-31", lastService:"2025-01-15", temp:"6°C", status:"ok", kwh:1.8 },
    { id:"VC-8822", type:"Visi Cooler 120L", brand:"Coca-Cola Branded", qr:"QR8822", retailer:"RT-8822", dist:"DB-1028", territory:"TR-BLR", allocated:"2023-06-08", warranty:"2025-06-07", amc:"active", amcExpiry:"2025-06-07", lastService:"2025-01-20", temp:"8°C", status:"ok", kwh:1.2 },
    { id:"VC-8823", type:"Chest Cooler 300L", brand:"Coca-Cola Branded", qr:"QR8823", retailer:"RT-8823", dist:"DB-1026", territory:"TR-CHN", allocated:"2024-01-22", warranty:"2027-01-21", amc:"active", amcExpiry:"2025-12-31", lastService:"2025-02-10", temp:"4°C", status:"ok", kwh:2.4 },
    { id:"VC-8824", type:"Visi Cooler 220L", brand:"Coca-Cola Branded", qr:"QR8824", retailer:"RT-8824", dist:"DB-1029", territory:"TR-DLS", allocated:"2023-08-14", warranty:"2026-08-13", amc:"expired", amcExpiry:"2024-08-13", lastService:"2024-08-15", temp:"12°C", status:"warning", kwh:2.1 },
    { id:"VC-8825", type:"Visi Cooler 120L", brand:"Coca-Cola Branded", qr:"QR8825", retailer:"RT-8825", dist:"DB-1030", territory:"TR-DLS", allocated:"2023-03-01", warranty:"2026-02-28", amc:"active", amcExpiry:"2025-12-31", lastService:"—", temp:"fault", status:"fault", kwh:0 },
  ],

  // ── Analytics Data ───────────────────────────────────────────
  salesTrend: [
    { m:"Aug'24", primary:38.2, secondary:33.1, target:40, orders:41200 },
    { m:"Sep'24", primary:35.8, secondary:31.2, target:38, orders:38400 },
    { m:"Oct'24", primary:42.1, secondary:36.8, target:43, orders:44800 },
    { m:"Nov'24", primary:39.4, secondary:34.2, target:41, orders:42100 },
    { m:"Dec'24", primary:44.6, secondary:38.9, target:45, orders:47600 },
    { m:"Jan'25", primary:41.2, secondary:36.0, target:42, orders:43800 },
    { m:"Feb'25", primary:48.2, secondary:41.7, target:47, orders:52340 },
  ],
  channelMix:   [{ n:"General Trade",value:68,c:C.red },{ n:"Modern Trade",value:14,c:C.blue },{ n:"HORECA",value:11,c:C.orange },{ n:"Institutional",value:7,c:C.purple }],
  zoneKpis: [
    { z:"North", sales:12.4, fill:93.8, cov:82, prod:84, growth:11 },
    { z:"South", sales:11.8, fill:96.1, cov:91, prod:92, growth:15 },
    { z:"West",  sales:10.9, fill:92.4, cov:78, prod:78, growth:9 },
    { z:"East",  sales:8.6,  fill:91.2, cov:72, prod:71, growth:7 },
    { z:"Central",sales:5.0, fill:90.8, cov:68, prod:68, growth:4 },
  ],
  aiForecasts: [
    { day:"Mon", actual:48200, forecast:46800, low:44100, high:49500 },
    { day:"Tue", actual:51400, forecast:49200, low:46800, high:51600 },
    { day:"Wed", actual:46800, forecast:48100, low:45600, high:50600 },
    { day:"Thu", actual:53200, forecast:51400, low:48900, high:53900 },
    { day:"Fri", actual:58400, forecast:56800, low:54200, high:59400 },
    { day:"Sat", actual:null,  forecast:62100, low:59400, high:64800 },
    { day:"Sun", actual:null,  forecast:44200, low:41800, high:46600 },
  ],
  agingData: [
    { b:"0-30d", amt:18.4, cnt:542 },
    { b:"31-60d", amt:12.8, cnt:284 },
    { b:"61-90d", amt:7.2,  cnt:142 },
    { b:">90d",   amt:4.4,  cnt:68  },
  ],
};

/* ═══════════════════════════════════════════════════════════════════
   GLOBAL STATE HOOK
═══════════════════════════════════════════════════════════════════ */
function useAppState() {
  const [authUser, setAuthUser]     = useState(null);
  const [view, setView]             = useState("login");   // login | admin | mobile
  const [adminPage, setAdminPage]   = useState("dashboard");
  const [mobilePage, setMobilePage] = useState("home");
  const [mobileStep, setMobileStep] = useState(null);
  const [toast, setToast]           = useState(null);
  const [modal, setModal]           = useState(null);

  const showToast = useCallback((msg, type="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const login = useCallback((email, password) => {
    const user = DATA.users.find(u => u.email === email && u.password === password);
    if (user) {
      setAuthUser(user);
      setView(user.role === "Salesman" ? "mobile" : "admin");
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setAuthUser(null);
    setView("login");
    setAdminPage("dashboard");
    setMobilePage("home");
  }, []);

  return { authUser, view, setView, adminPage, setAdminPage, mobilePage, setMobilePage, mobileStep, setMobileStep, toast, modal, setModal, showToast, login, logout };
}

/* ═══════════════════════════════════════════════════════════════════
   SHARED UI COMPONENTS
═══════════════════════════════════════════════════════════════════ */

// ── Typography
const Mono = ({ children, color, size=11, bold }) => (
  <span style={{ fontFamily:C.mono, fontSize:size, color:color||C.text, fontWeight:bold?600:400, letterSpacing:"0.3px" }}>{children}</span>
);

// ── Badge
const Badge = ({ label, color="default", size="sm" }) => {
  const map = {
    default: { bg:"rgba(255,255,255,0.06)", c:C.text, b:`1px solid ${C.faint}` },
    red:     { bg:C.redGlow, c:C.red, b:`1px solid rgba(232,0,28,0.35)` },
    green:   { bg:C.greenDim, c:C.green, b:`1px solid rgba(0,201,122,0.3)` },
    blue:    { bg:C.blueDim, c:C.blue, b:`1px solid rgba(30,136,229,0.3)` },
    yellow:  { bg:C.yellowDim, c:C.yellow, b:`1px solid rgba(245,184,0,0.3)` },
    orange:  { bg:C.orangeDim, c:C.orange, b:`1px solid rgba(232,103,10,0.3)` },
    purple:  { bg:C.purpleDim, c:C.purple, b:`1px solid rgba(156,111,214,0.3)` },
    teal:    { bg:"rgba(0,184,160,0.12)", c:C.teal, b:`1px solid rgba(0,184,160,0.3)` },
  };
  const s = map[color] || map.default;
  const p = size==="sm" ? "2px 7px" : "3px 10px";
  return <span style={{ display:"inline-block", padding:p, borderRadius:3, fontSize:size==="sm"?10:11, fontWeight:700, letterSpacing:"0.8px", fontFamily:C.mono, background:s.bg, color:s.c, border:s.b }}>{label}</span>;
};

// ── Status badge
const S = ({ status }) => {
  const map = {
    active:"green", overdue:"yellow", blocked:"red", good:"green",
    near_expiry:"yellow", expired:"red", delivered:"green", dispatched:"blue",
    "in-transit":"orange", confirmed:"teal", cancelled:"red", ok:"green",
    warning:"yellow", fault:"red", upcoming:"purple", present:"green",
    late:"yellow", absent:"red", filed:"green", pending:"yellow",
    approved:"green", rejected:"red", "buy_x_get_y":"blue", volume_discount:"teal",
    free_sku:"orange", slab_discount:"purple", primary:"orange", sub:"blue", depot:"teal",
  };
  const labels = {
    "in-transit":"IN TRANSIT", near_expiry:"NEAR EXPIRY", buy_x_get_y:"BX+GY",
    volume_discount:"VOL DISC", free_sku:"FREE SKU", slab_discount:"SLAB",
  };
  return <Badge label={(labels[status]||status).toString().toUpperCase()} color={map[status]||"default"} />;
};

// ── Divider
const Div = ({ mb=12, mt=0 }) => <div style={{ height:1, background:C.divider, margin:`${mt}px 0 ${mb}px` }} />;

// ── Button
const Btn = ({ children, onClick, variant="default", size="md", disabled, full, icon }) => {
  const v = {
    default:  { bg:C.raised,  c:C.text,  border:`1px solid ${C.border}` },
    primary:  { bg:C.red,     c:"#fff",   border:"none" },
    ghost:    { bg:"transparent", c:C.muted, border:`1px solid ${C.faint}` },
    danger:   { bg:"rgba(232,0,28,0.12)", c:C.red, border:`1px solid rgba(232,0,28,0.3)` },
    success:  { bg:C.greenDim, c:C.green, border:`1px solid rgba(0,201,122,0.3)` },
  }[variant] || {};
  const p = { sm:"4px 10px", md:"7px 14px", lg:"10px 20px" }[size];
  const fs = { sm:10, md:11, lg:12 }[size];
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ display:"inline-flex", alignItems:"center", gap:6, padding:p, background:v.bg, color:v.c, border:v.border, borderRadius:4, fontFamily:C.mono, fontSize:fs, fontWeight:600, letterSpacing:"0.5px", cursor:disabled?"not-allowed":"pointer", opacity:disabled?0.5:1, width:full?"100%":"auto", justifyContent:full?"center":"flex-start", transition:"opacity 0.15s,background 0.15s", whiteSpace:"nowrap" }}
      onMouseEnter={e=>!disabled&&(e.currentTarget.style.opacity="0.78")}
      onMouseLeave={e=>!disabled&&(e.currentTarget.style.opacity="1")}
    >{icon&&<span style={{fontSize:fs+2}}>{icon}</span>}{children}</button>
  );
};

// ── Input
const Input = ({ label, type="text", value, onChange, placeholder, icon, style:st }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:5, ...st }}>
    {label && <label style={{ fontFamily:C.mono, fontSize:10, color:C.muted, letterSpacing:"0.8px", textTransform:"uppercase" }}>{label}</label>}
    <div style={{ position:"relative" }}>
      {icon && <span style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", fontSize:14, color:C.muted }}>{icon}</span>}
      <input type={type} value={value} onChange={onChange} placeholder={placeholder}
        style={{ width:"100%", background:C.panel, border:`1px solid ${C.border}`, color:C.white, fontFamily:C.mono, fontSize:12, padding:`8px ${icon?"36px":"12px"} 8px 12px`, borderRadius:4, outline:"none", boxSizing:"border-box", transition:"border-color 0.15s" }}
        onFocus={e=>e.target.style.borderColor=C.red} onBlur={e=>e.target.style.borderColor=C.border} />
    </div>
  </div>
);

// ── Card container
const Card = ({ children, p=20, mb=0, style:st }) => (
  <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:6, padding:p, marginBottom:mb, ...st }}>
    {children}
  </div>
);

// ── Section title
const SecTitle = ({ label, title, right }) => (
  <div style={{ display:"flex", alignItems:"flex-end", justifyContent:"space-between", marginBottom:16 }}>
    <div>
      <div style={{ fontFamily:C.mono, fontSize:10, color:C.red, letterSpacing:"2px", textTransform:"uppercase", marginBottom:3 }}>{label}</div>
      <div style={{ fontFamily:C.display, fontSize:17, fontWeight:700, color:C.white, letterSpacing:"-0.3px" }}>{title}</div>
    </div>
    {right && <div>{right}</div>}
  </div>
);

// ── KPI card
const KpiCard = ({ label, value, change, up, sub, color }) => (
  <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:6, padding:"16px 18px", position:"relative", overflow:"hidden" }}>
    <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:color||(up?C.green:C.red), opacity:0.8 }} />
    <div style={{ fontFamily:C.mono, fontSize:9, color:C.muted, letterSpacing:"1px", textTransform:"uppercase", marginBottom:6 }}>{label}</div>
    <div style={{ fontFamily:C.display, fontSize:22, fontWeight:700, color:C.white, lineHeight:1.1, marginBottom:4 }}>{value}</div>
    <div style={{ display:"flex", gap:8, alignItems:"center" }}>
      {change && <span style={{ fontFamily:C.mono, fontSize:10, color:up?C.green:C.red, fontWeight:600 }}>{change}</span>}
      {sub && <span style={{ fontFamily:C.mono, fontSize:9, color:C.muted }}>{sub}</span>}
    </div>
  </div>
);

// ── Data table
const DataTable = ({ headers, rows, renderRow, stickyHead=true }) => (
  <div style={{ overflowX:"auto" }}>
    <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:C.mono, fontSize:11 }}>
      <thead>
        <tr>
          {headers.map((h,i) => (
            <th key={i} style={{ padding:"9px 12px", textAlign:"left", background:C.surface, color:C.muted, fontWeight:600, letterSpacing:"0.8px", fontSize:10, textTransform:"uppercase", borderBottom:`1px solid ${C.border}`, whiteSpace:"nowrap", position:stickyHead?"sticky":"static", top:0, zIndex:1 }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row,i) => (
          <tr key={i} style={{ borderBottom:`1px solid ${C.divider}` }}
            onMouseEnter={e=>Array.from(e.currentTarget.cells).forEach(c=>c.style.background=C.hover)}
            onMouseLeave={e=>Array.from(e.currentTarget.cells).forEach(c=>c.style.background="transparent")}>
            {renderRow(row, i)}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
const Td = ({ children, mono, center, right, color }) => (
  <td style={{ padding:"10px 12px", color:color||(mono?C.text:C.white), fontFamily:mono?C.mono:C.body, fontSize:mono?11:12, textAlign:center?"center":right?"right":"left", whiteSpace:"nowrap", verticalAlign:"middle" }}>
    {children}
  </td>
);

// ── Progress bar
const ProgressBar = ({ pct, color, height=4, label }) => (
  <div>
    {label && <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
      <span style={{ fontFamily:C.mono, fontSize:10, color:C.text }}>{label}</span>
      <span style={{ fontFamily:C.mono, fontSize:10, color:color||C.muted }}>{pct}%</span>
    </div>}
    <div style={{ height, background:C.faint, borderRadius:height }}>
      <div style={{ height:"100%", width:`${Math.min(pct,100)}%`, background:color||(pct>80?C.red:pct>50?C.yellow:C.green), borderRadius:height, transition:"width 0.8s ease" }} />
    </div>
  </div>
);

// ── Tooltip customizer
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:C.raised, border:`1px solid ${C.border}`, borderRadius:4, padding:"10px 14px", fontFamily:C.mono, fontSize:11 }}>
      <div style={{ color:C.muted, marginBottom:6, fontSize:10 }}>{label}</div>
      {payload.map((p,i) => <div key={i} style={{ color:p.color, marginBottom:2 }}>{p.name}: <strong>{typeof p.value==="number"?p.value.toLocaleString():p.value}</strong></div>)}
    </div>
  );
};

// ── Rupee format
const rupee = v => v >= 10000000 ? `₹${(v/10000000).toFixed(1)} Cr` : v >= 100000 ? `₹${(v/100000).toFixed(1)} L` : `₹${v.toLocaleString()}`;

/* ═══════════════════════════════════════════════════════════════════
   LOGIN SCREEN
═══════════════════════════════════════════════════════════════════ */
function LoginScreen({ onLogin, showToast }) {
  const [email, setEmail]   = useState("");
  const [pass, setPass]     = useState("");
  const [err, setErr]       = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handle = () => {
    setLoading(true);
    setTimeout(() => {
      const ok = onLogin(email, pass);
      if (!ok) { setErr("Invalid credentials. Try admin123 / rsm123 / sm123"); }
      setLoading(false);
    }, 800);
  };

  const quickLogin = (u) => { setEmail(u.email); setPass(u.password); };

  return (
    <div style={{ minHeight:"100vh", background:C.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:"20px", position:"relative", overflow:"hidden" }}>
      {/* Grid background */}
      <div style={{ position:"absolute", inset:0, backgroundImage:`linear-gradient(${C.divider} 1px, transparent 1px), linear-gradient(90deg, ${C.divider} 1px, transparent 1px)`, backgroundSize:"48px 48px", opacity:0.6 }} />
      {/* Red accent blobs */}
      <div style={{ position:"absolute", top:"-20%", right:"-10%", width:500, height:500, background:`radial-gradient(circle, rgba(232,0,28,0.08) 0%, transparent 70%)`, pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:"-10%", left:"-5%", width:400, height:400, background:`radial-gradient(circle, rgba(232,0,28,0.05) 0%, transparent 70%)`, pointerEvents:"none" }} />

      <div style={{ display:"flex", gap:0, maxWidth:900, width:"100%", position:"relative", zIndex:1, boxShadow:"0 32px 80px rgba(0,0,0,0.6)", borderRadius:8, overflow:"hidden" }}>
        {/* Left — Brand Panel */}
        <div style={{ flex:"0 0 340px", background:`linear-gradient(145deg, ${C.panel} 0%, ${C.surface} 100%)`, borderRight:`1px solid ${C.border}`, padding:"48px 40px", display:"flex", flexDirection:"column", justifyContent:"space-between" }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:40 }}>
              <div style={{ width:42, height:42, borderRadius:"50%", background:C.red, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 0 24px ${C.redGlow}` }}>
                <span style={{ fontFamily:C.mono, fontSize:13, fontWeight:700, color:"#fff" }}>CC</span>
              </div>
              <div>
                <div style={{ fontFamily:C.display, fontSize:16, fontWeight:700, color:C.white, letterSpacing:"2px" }}>COCA-COLA</div>
                <div style={{ fontFamily:C.mono, fontSize:10, color:C.muted, letterSpacing:"1px" }}>INDIA · DMS</div>
              </div>
            </div>
            <div style={{ fontFamily:C.display, fontSize:34, fontWeight:800, color:C.white, lineHeight:1.1, marginBottom:16, letterSpacing:"-0.5px" }}>
              Distribution<br/>Management<br/><span style={{ color:C.red }}>System</span>
            </div>
            <p style={{ fontFamily:C.body, fontSize:13, color:C.muted, lineHeight:1.6 }}>
              Enterprise-grade FMCG distribution platform. Unified Admin + Mobile SFA. GST compliant. AI-powered.
            </p>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginTop:32 }}>
            {[["1,284","Distributors"],["94K+","Retailers"],["52K","Daily Orders"],["99.9%","Uptime"]].map(([v,l],i) => (
              <div key={i} style={{ borderLeft:`2px solid ${C.red}`, paddingLeft:10 }}>
                <div style={{ fontFamily:C.display, fontSize:20, fontWeight:700, color:C.white }}>{v}</div>
                <div style={{ fontFamily:C.mono, fontSize:9, color:C.muted, letterSpacing:"0.8px" }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — Login Form */}
        <div style={{ flex:1, background:C.surface, padding:"48px 40px", display:"flex", flexDirection:"column", justifyContent:"center" }}>
          <div style={{ fontFamily:C.display, fontSize:22, fontWeight:700, color:C.white, marginBottom:6 }}>Sign In</div>
          <div style={{ fontFamily:C.mono, fontSize:11, color:C.muted, marginBottom:32 }}>Enter your credentials to access the platform</div>

          <div style={{ display:"flex", flexDirection:"column", gap:16, marginBottom:24 }}>
            <Input label="Email Address" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@coke.in" icon="✉" />
            <div>
              <Input label="Password" type={showPass?"text":"password"} value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" icon="🔒" />
              <button onClick={()=>setShowPass(!showPass)} style={{ background:"none", border:"none", color:C.muted, fontFamily:C.mono, fontSize:10, cursor:"pointer", marginTop:4, padding:0 }}>
                {showPass ? "▲ Hide" : "▼ Show"} password
              </button>
            </div>
          </div>

          {err && <div style={{ background:"rgba(232,0,28,0.08)", border:`1px solid rgba(232,0,28,0.3)`, borderRadius:4, padding:"10px 12px", fontFamily:C.mono, fontSize:11, color:C.red, marginBottom:16 }}>{err}</div>}

          <Btn onClick={handle} variant="primary" size="lg" full disabled={loading}>
            {loading ? "⟳  Signing in..." : "→  Sign In"}
          </Btn>

          <Div mt={24} mb={16} />
          <div style={{ fontFamily:C.mono, fontSize:10, color:C.muted, letterSpacing:"0.8px", marginBottom:10 }}>QUICK ACCESS — DEMO ACCOUNTS</div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
            {DATA.users.map(u => (
              <button key={u.id} onClick={()=>quickLogin(u)} style={{ padding:"5px 10px", background:C.card, border:`1px solid ${C.border}`, borderRadius:3, fontFamily:C.mono, fontSize:10, color:C.text, cursor:"pointer", transition:"border-color 0.15s" }}
                onMouseEnter={e=>e.target.style.borderColor=C.red} onMouseLeave={e=>e.target.style.borderColor=C.border}>
                {u.role}: {u.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ADMIN APP
═══════════════════════════════════════════════════════════════════ */

// ── Dashboard Page
function DashboardPage() {
  const [range, setRange] = useState("MTD");
  return (
    <div>
      {/* KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:1, marginBottom:16, background:C.divider, border:`1px solid ${C.divider}` }}>
        <KpiCard label="Primary Sales" value="₹48.2 Cr" change="+12.4%" up sub="This Month" />
        <KpiCard label="Secondary Sales" value="₹41.7 Cr" change="+8.9%" up sub="This Month" />
        <KpiCard label="Today's Orders" value="52,340" change="+4,218" up sub="vs Yesterday" />
        <KpiCard label="Fill Rate" value="94.2%" change="+0.8%" up sub="Last 7 Days" color={C.blue} />
        <KpiCard label="Active Distributors" value="1,246" change="+23" up sub="All India" color={C.teal} />
        <KpiCard label="Retailers Covered" value="94,712" change="+1,840" up sub="Universe" color={C.purple} />
        <KpiCard label="Collection Due" value="₹8.4 Cr" change="31 accounts" sub="Overdue >30d" />
        <KpiCard label="Expiry Alerts" value="142 SKUs" change="+18" sub="Within 30d" />
      </div>

      {/* Charts row */}
      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:12, marginBottom:12 }}>
        <Card>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
            <SecTitle label="Trend" title="Primary vs Secondary Sales" />
            <div style={{ display:"flex", gap:3 }}>
              {["WTD","MTD","QTD","YTD"].map(r => (
                <button key={r} onClick={()=>setRange(r)} style={{ padding:"3px 9px", background:range===r?C.red:C.raised, color:range===r?"#fff":C.muted, border:`1px solid ${range===r?C.red:C.border}`, fontFamily:C.mono, fontSize:9, cursor:"pointer", borderRadius:3 }}>{r}</button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={210}>
            <AreaChart data={DATA.salesTrend}>
              <defs>
                <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.red} stopOpacity={0.25}/><stop offset="95%" stopColor={C.red} stopOpacity={0}/></linearGradient>
                <linearGradient id="gS" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.blue} stopOpacity={0.2}/><stop offset="95%" stopColor={C.blue} stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.divider} />
              <XAxis dataKey="m" tick={{ fill:C.muted, fontSize:9, fontFamily:C.mono }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill:C.muted, fontSize:9, fontFamily:C.mono }} axisLine={false} tickLine={false} tickFormatter={v=>`₹${v}Cr`} />
              <Tooltip content={<ChartTooltip/>} />
              <Area type="monotone" dataKey="primary" stroke={C.red} strokeWidth={2} fill="url(#gP)" name="Primary (₹Cr)" />
              <Area type="monotone" dataKey="secondary" stroke={C.blue} strokeWidth={2} fill="url(#gS)" name="Secondary (₹Cr)" />
              <Line type="monotone" dataKey="target" stroke={C.yellow} strokeWidth={1.5} strokeDasharray="4 3" dot={false} name="Target (₹Cr)" />
              <Legend wrapperStyle={{ fontFamily:C.mono, fontSize:10, color:C.muted }} />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <SecTitle label="Volume" title="Channel Mix" />
          <ResponsiveContainer width="100%" height={160}>
            <PieChart><Pie data={DATA.channelMix} dataKey="value" cx="50%" cy="50%" outerRadius={65} innerRadius={35} paddingAngle={2}>
              {DATA.channelMix.map((e,i) => <Cell key={i} fill={e.c} />)}
            </Pie><Tooltip contentStyle={{ background:C.raised, border:`1px solid ${C.border}`, fontFamily:C.mono, fontSize:10 }}/></PieChart>
          </ResponsiveContainer>
          <div style={{ display:"flex", flexDirection:"column", gap:5, marginTop:8 }}>
            {DATA.channelMix.map((c,i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                  <div style={{ width:8, height:8, background:c.c, borderRadius:1 }} />
                  <Mono size={10} color={C.muted}>{c.n}</Mono>
                </div>
                <Mono size={11} bold color={C.white}>{c.value}%</Mono>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Zone + Live Feed */}
      <div style={{ display:"grid", gridTemplateColumns:"3fr 2fr", gap:12 }}>
        <Card>
          <SecTitle label="Territory" title="Zone Performance — This Month" />
          <DataTable
            headers={["Zone","Sales","Fill Rate","Coverage","Productivity","Growth"]}
            rows={DATA.zoneKpis}
            renderRow={r => <>
              <Td><strong style={{ color:C.white, fontFamily:C.display, fontSize:14 }}>{r.z}</strong></Td>
              <Td mono>₹{r.sales} Cr</Td>
              <Td mono><span style={{ color:r.fill>94?C.green:C.yellow }}>{r.fill}%</span></Td>
              <Td><ProgressBar pct={r.cov} height={6} /></Td>
              <Td><ProgressBar pct={r.prod} height={6} color={C.blue} /></Td>
              <Td mono><span style={{ color:C.green }}>+{r.growth}%</span></Td>
            </>}
          />
        </Card>

        <Card>
          <SecTitle label="Live" title="Order Feed" />
          <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
            {DATA.orders.slice(0,6).map((o,i) => (
              <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:i<5?`1px solid ${C.divider}`:"none" }}>
                <div>
                  <Mono size={10} color={C.muted}>{o.id.slice(-8)}</Mono>
                  <div style={{ fontFamily:C.body, fontSize:12, color:C.white, margin:"2px 0" }}>{o.retailer==="—"?`→ ${DATA.distributors.find(d=>d.id===o.dist)?.name||o.dist}`:o.retailer}</div>
                  <Mono size={9} color={C.faint}>{o.time} · {o.type}</Mono>
                </div>
                <div style={{ textAlign:"right", display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 }}>
                  <Mono bold color={C.white}>{rupee(o.total)}</Mono>
                  <S status={o.status} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ── Org Hierarchy Page
function OrgPage() {
  const [expanded, setExpanded] = useState({ ZN_N:true });
  const toggle = k => setExpanded(p => ({ ...p, [k]:!p[k] }));

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:1, marginBottom:16, background:C.divider, border:`1px solid ${C.divider}` }}>
        <KpiCard label="Zones" value="5" sub="Pan India" color={C.purple} up />
        <KpiCard label="Regions" value="28" sub="All States + UTs" color={C.blue} up />
        <KpiCard label="Territories" value="184" sub="City/Town Clusters" color={C.teal} up />
        <KpiCard label="Distributors" value="1,284" change="+23 this month" up sub="Active Network" />
      </div>

      {/* Company Header */}
      <Card mb={12}>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <div style={{ width:52, height:52, borderRadius:"50%", background:C.red, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 0 20px ${C.redGlow}`, flexShrink:0 }}>
            <span style={{ fontFamily:C.mono, fontSize:14, fontWeight:700, color:"#fff" }}>CC</span>
          </div>
          <div>
            <div style={{ fontFamily:C.display, fontSize:18, fontWeight:700, color:C.white }}>{DATA.org.company.name}</div>
            <div style={{ display:"flex", gap:16, marginTop:4, flexWrap:"wrap" }}>
              <Mono size={11} color={C.muted}>GSTIN: {DATA.org.company.gstin}</Mono>
              <Mono size={11} color={C.muted}>HQ: {DATA.org.company.hq}</Mono>
              <Badge label="FMCG BEVERAGES" color="red" />
            </div>
          </div>
          <div style={{ flex:1 }} />
          <Btn variant="primary" size="sm" icon="⬇">Export Org Chart</Btn>
        </div>
      </Card>

      {/* Zone Tree */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
        {DATA.org.zones.map(z => (
          <Card key={z.id} style={{ borderLeft:`3px solid ${C.red}`, cursor:"pointer" }} p={16}>
            <div onClick={()=>toggle(z.id)} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:expanded[z.id]?12:0 }}>
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                <div style={{ width:32, height:32, background:C.redGlow, border:`1px solid rgba(232,0,28,0.3)`, borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontSize:14 }}>🗺</span>
                </div>
                <div>
                  <div style={{ fontFamily:C.display, fontSize:15, fontWeight:700, color:C.white }}>{z.name}</div>
                  <Mono size={10} color={C.muted}>{z.id} · Head: {z.head}</Mono>
                </div>
              </div>
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <Badge label={`${z.distributors} Dist`} color="blue" />
                <span style={{ color:C.muted, fontSize:16 }}>{expanded[z.id]?"▲":"▼"}</span>
              </div>
            </div>
            {expanded[z.id] && <>
              <Div mb={10} />
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:10 }}>
                {[["States",z.states.length],["Regions",z.regions],["Territories",z.territories]].map(([l,v],i) => (
                  <div key={i} style={{ background:C.surface, border:`1px solid ${C.divider}`, borderRadius:4, padding:"8px 10px", textAlign:"center" }}>
                    <div style={{ fontFamily:C.display, fontSize:16, color:C.white }}>{v}</div>
                    <Mono size={9} color={C.muted}>{l}</Mono>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:4 }}>
                {z.states.slice(0,6).map((s,i) => <Badge key={i} label={s} size="sm" />)}
                {z.states.length>6 && <Badge label={`+${z.states.length-6} more`} />}
              </div>
            </>}
          </Card>
        ))}
      </div>

      {/* Regions + Territories */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
        <Card>
          <SecTitle label="Level 3" title="Regions" right={<Btn size="sm" variant="ghost">+ Add Region</Btn>} />
          <DataTable headers={["Region ID","Name","Zone","Territories","Distributors"]}
            rows={DATA.org.regions}
            renderRow={r => <>
              <Td mono><span style={{color:C.red}}>{r.id}</span></Td>
              <Td>{r.name}</Td>
              <Td><Badge label={r.zone} color="blue" /></Td>
              <Td mono>{r.territories}</Td>
              <Td mono>{r.distributors}</Td>
            </>}
          />
        </Card>
        <Card>
          <SecTitle label="Level 4" title="Territories" right={<Btn size="sm" variant="ghost">+ Add Territory</Btn>} />
          <DataTable headers={["Territory ID","Name","Region","SO","Distributors","Retailers","Beats"]}
            rows={DATA.org.territories}
            renderRow={r => <>
              <Td mono><span style={{color:C.red}}>{r.id}</span></Td>
              <Td>{r.name}</Td>
              <Td mono>{r.region}</Td>
              <Td>{r.so}</Td>
              <Td mono>{r.distributors}</Td>
              <Td mono>{r.retailers.toLocaleString()}</Td>
              <Td mono>{r.beats}</Td>
            </>}
          />
        </Card>
      </div>
    </div>
  );
}

// ── Distributor Page
function DistributorPage({ showToast }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = DATA.distributors.filter(d =>
    (filter==="all"||d.status===filter) &&
    (d.name.toLowerCase().includes(search.toLowerCase()) || d.id.includes(search))
  );

  const creditPct = d => Math.round((d.used/d.credit)*100);

  if (selected) {
    const d = selected;
    const orders = DATA.orders.filter(o=>o.dist===d.id);
    return (
      <div>
        <div style={{display:"flex",gap:12,marginBottom:16,alignItems:"center"}}>
          <Btn onClick={()=>setSelected(null)} icon="←" variant="ghost">Back to List</Btn>
          <div style={{flex:1}} />
          <S status={d.status} />
          {d.status==="blocked" && <Btn variant="success" size="sm" onClick={()=>showToast("Distributor unblocked")}>Unblock</Btn>}
          <Btn variant="danger" size="sm">Credit Block</Btn>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:12}}>
          <Card style={{gridColumn:"span 2"}}>
            <div style={{display:"flex",gap:16,alignItems:"flex-start"}}>
              <div style={{width:52,height:52,borderRadius:6,background:C.redGlow,border:`1px solid rgba(232,0,28,0.3)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:22}}>🏭</div>
              <div style={{flex:1}}>
                <div style={{fontFamily:C.display,fontSize:20,fontWeight:700,color:C.white,marginBottom:2}}>{d.name}</div>
                <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:8}}>
                  <Mono size={11} color={C.muted}>ID: {d.id}</Mono>
                  <Mono size={11} color={C.muted}>GSTIN: {d.gstin}</Mono>
                  <S status={d.type} />
                </div>
                <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
                  {[["State",d.state],["Territory",d.territory],["Contact",d.contact],["Mobile",d.mobile],["Salesmen",d.salesmen],["Retailers",d.retailers]].map(([l,v],i) => (
                    <div key={i}><Mono size={9} color={C.muted}>{l}</Mono><div style={{fontFamily:C.body,fontSize:12,color:C.text,marginTop:1}}>{v}</div></div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
          <Card>
            <div style={{fontFamily:C.mono,fontSize:10,color:C.muted,letterSpacing:"0.8px",marginBottom:8}}>CREDIT STATUS</div>
            <div style={{fontFamily:C.display,fontSize:22,color:d.status==="blocked"?C.red:C.white,marginBottom:6}}>{rupee(d.credit)}</div>
            <ProgressBar pct={creditPct(d)} color={creditPct(d)>90?C.red:creditPct(d)>70?C.yellow:C.green} height={8} />
            <div style={{display:"flex",justifyContent:"space-between",marginTop:8}}>
              <Mono size={10} color={C.muted}>Used: {rupee(d.used)}</Mono>
              <Mono size={10} color={C.muted}>{creditPct(d)}%</Mono>
            </div>
            <Div mt={12} mb={10}/>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <div><Mono size={9} color={C.muted}>OUTSTANDING</Mono><div style={{color:C.red,fontFamily:C.display,fontSize:16}}>{rupee(d.outstanding)}</div></div>
              <div><Mono size={9} color={C.muted}>AGING</Mono><div style={{color:d.agingDays>30?C.red:C.yellow,fontFamily:C.display,fontSize:16}}>{d.agingDays} Days</div></div>
            </div>
          </Card>
        </div>

        <Card>
          <SecTitle label="Orders" title={`Recent Orders — ${d.name}`} />
          <DataTable headers={["Order ID","Type","Retailer","Items","Gross","Tax","Total","Status","Date"]}
            rows={orders.length?orders:[{id:"—",type:"—",retailer:"No orders found",items:[],gross:0,cgst:0,sgst:0,total:0,status:"confirmed",date:"—"}]}
            renderRow={o => <>
              <Td mono><span style={{color:C.red}}>{o.id}</span></Td>
              <Td><S status={o.type} /></Td>
              <Td>{o.retailer}</Td>
              <Td mono>{o.items?.length||0}</Td>
              <Td mono>{rupee(o.gross||0)}</Td>
              <Td mono>{rupee((o.cgst||0)+(o.sgst||0))}</Td>
              <Td mono><strong style={{color:C.white}}>{rupee(o.total||0)}</strong></Td>
              <Td><S status={o.status} /></Td>
              <Td mono>{o.date}</Td>
            </>}
          />
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,marginBottom:16,background:C.divider,border:`1px solid ${C.divider}`}}>
        <KpiCard label="Total Distributors" value="1,284" change="+23" up sub="This Month" />
        <KpiCard label="Active" value="1,182" change="92.1%" up sub="Operational" color={C.green} />
        <KpiCard label="Overdue (>30d)" value="64" change="↑8 vs last mo" sub="" />
        <KpiCard label="Credit Blocked" value="38" change="₹4.2 Cr frozen" sub="" />
      </div>

      <Card>
        <div style={{display:"flex",gap:10,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
          <Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by name or ID..." icon="🔍" style={{flex:1,minWidth:200,maxWidth:300}} />
          <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
            {["all","active","overdue","blocked"].map(f => (
              <button key={f} onClick={()=>setFilter(f)} style={{padding:"5px 11px",background:filter===f?C.red:C.raised,color:filter===f?"#fff":C.muted,border:`1px solid ${filter===f?C.red:C.border}`,fontFamily:C.mono,fontSize:9,cursor:"pointer",borderRadius:3,textTransform:"uppercase",letterSpacing:"0.5px"}}>{f}</button>
            ))}
          </div>
          <div style={{flex:1}}/>
          <Btn variant="primary" size="sm" icon="+" onClick={()=>showToast("Add Distributor form would open here")}>Add Distributor</Btn>
        </div>

        <DataTable
          headers={["ID","Name","Type","Territory","State","Credit Limit","Used","Outstanding","Aging","Salesmen","Status","Actions"]}
          rows={filtered}
          renderRow={d => <>
            <Td mono><span style={{color:C.red}}>{d.id}</span></Td>
            <Td><button onClick={()=>setSelected(d)} style={{background:"none",border:"none",color:C.white,fontFamily:C.body,fontSize:13,fontWeight:600,cursor:"pointer",padding:0,textAlign:"left"}}>{d.name}</button></Td>
            <Td><S status={d.type} /></Td>
            <Td mono>{d.territory}</Td>
            <Td mono>{d.state}</Td>
            <Td mono>{rupee(d.credit)}</Td>
            <Td><div style={{minWidth:80}}><ProgressBar pct={creditPct(d)} color={creditPct(d)>90?C.red:creditPct(d)>70?C.yellow:C.green} height={5} /></div></Td>
            <Td mono><span style={{color:d.status==="blocked"?C.red:d.agingDays>30?C.yellow:C.text}}>{rupee(d.outstanding)}</span></Td>
            <Td mono><span style={{color:d.agingDays>30?C.red:C.text}}>{d.agingDays}d</span></Td>
            <Td mono>{d.salesmen}</Td>
            <Td><S status={d.status}/></Td>
            <Td>
              <div style={{display:"flex",gap:4}}>
                <Btn size="sm" onClick={()=>setSelected(d)}>View</Btn>
                {d.status==="blocked"&&<Btn size="sm" variant="success" onClick={()=>showToast(`${d.name} unblocked`)}>Unblock</Btn>}
              </div>
            </Td>
          </>}
        />
      </Card>
    </div>
  );
}

// ── Order Management
function OrderPage({ showToast }) {
  const [tab, setTab] = useState("all");
  const [selected, setSelected] = useState(null);

  const tabs = ["all","primary","secondary","in-transit","delivered","cancelled"];
  const filtered = tab==="all" ? DATA.orders : DATA.orders.filter(o=>o.type===tab||o.status===tab);

  const InvoiceView = ({ order }) => {
    const dist = DATA.distributors.find(d=>d.id===order.dist) || { name:"HQ", gstin:"N/A" };
    const ret  = DATA.retailers.find(r=>r.name===order.retailer) || { address:"—", gstin:"N/A" };
    return (
      <Card style={{ maxWidth:640, margin:"0 auto" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16 }}>
          <div>
            <div style={{ fontFamily:C.display,fontSize:18,fontWeight:700,color:C.white,marginBottom:2 }}>TAX INVOICE</div>
            <Mono size={11} color={C.muted}>{order.irn ? `IRN: ${order.irn}` : "E-Invoice Pending"}</Mono>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontFamily:C.mono,fontSize:13,fontWeight:700,color:C.red }}>{order.id}</div>
            <Mono size={10} color={C.muted}>{order.date} · {order.time}</Mono>
            <div style={{ marginTop:4 }}><S status={order.status}/></div>
          </div>
        </div>
        <Div mb={12}/>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16 }}>
          <div>
            <Mono size={9} color={C.muted}>SOLD BY</Mono>
            <div style={{ fontFamily:C.body,fontSize:13,fontWeight:700,color:C.white,marginTop:3 }}>{dist.name}</div>
            <Mono size={10} color={C.muted}>GSTIN: {dist.gstin}</Mono>
          </div>
          <div>
            <Mono size={9} color={C.muted}>BILLED TO</Mono>
            <div style={{ fontFamily:C.body,fontSize:13,fontWeight:700,color:C.white,marginTop:3 }}>{order.retailer}</div>
            <Mono size={10} color={C.muted}>{ret.address}</Mono>
          </div>
        </div>
        <DataTable headers={["SKU","Brand","Qty","Rate","Disc","Amount"]}
          rows={order.items}
          renderRow={it => {
            const sku = DATA.skus.find(s=>s.id===it.sku)||{code:"N/A",brand:"—"};
            return <>
              <Td mono><span style={{color:C.blue}}>{sku.code}</span></Td>
              <Td>{sku.brand}</Td>
              <Td mono>{it.qty} cases</Td>
              <Td mono>₹{it.price}</Td>
              <Td mono>—</Td>
              <Td mono><strong style={{color:C.white}}>₹{(it.qty*it.price).toFixed(2)}</strong></Td>
            </>;
          }}
        />
        <Div mt={12} mb={12}/>
        <div style={{ display:"flex",justifyContent:"flex-end" }}>
          <div style={{ width:220 }}>
            {[["Gross Amount",rupee(order.gross)],["Discount",rupee(order.disc||0)],[`CGST @ 6%`,rupee(order.cgst)],[`SGST @ 6%`,rupee(order.sgst)],].map(([l,v],i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"3px 0"}}>
                <Mono size={11} color={C.muted}>{l}</Mono>
                <Mono size={11} color={C.text}>{v}</Mono>
              </div>
            ))}
            <Div mt={6} mb={6}/>
            <div style={{display:"flex",justifyContent:"space-between",padding:"5px 0",background:C.redGlow,margin:"0 -12px",padding:"8px 12px",borderRadius:3}}>
              <Mono size={13} bold color={C.white}>TOTAL</Mono>
              <Mono size={13} bold color={C.red}>{rupee(order.total)}</Mono>
            </div>
          </div>
        </div>
        {order.ewayBill && <div style={{marginTop:12}}><Badge label={`E-Way Bill: ${order.ewayBill}`} color="teal"/></div>}
        <div style={{display:"flex",gap:8,marginTop:16}}>
          <Btn variant="primary" onClick={()=>showToast("Invoice PDF downloaded")}>⬇ Download PDF</Btn>
          <Btn onClick={()=>showToast("Invoice shared on WhatsApp")}>📱 Share WhatsApp</Btn>
          <Btn onClick={()=>showToast("Sent via SMS")}>💬 Send SMS</Btn>
          <div style={{flex:1}}/>
          <Btn variant="ghost" onClick={()=>setSelected(null)}>✕ Close</Btn>
        </div>
      </Card>
    );
  };

  return (
    <div>
      {selected ? <InvoiceView order={selected}/> : <>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,marginBottom:16,background:C.divider,border:`1px solid ${C.divider}`}}>
          <KpiCard label="Today Orders" value="52,340" change="+4,218" up sub="vs Yesterday"/>
          <KpiCard label="Order Value" value="₹2.84 Cr" change="+9.2%" up sub="Today" color={C.blue}/>
          <KpiCard label="Pending Dispatch" value="1,842" change="12% of today" sub=""/>
          <KpiCard label="E-Invoices Generated" value="50,498" change="96.5%" up sub="of Today's Orders" color={C.teal}/>
        </div>

        {/* Pipeline bar */}
        <Card mb={12}>
          <SecTitle label="Status" title="Order Pipeline — Today"/>
          <div style={{display:"flex",gap:0,height:36,borderRadius:4,overflow:"hidden",marginBottom:8}}>
            {[["Confirmed",18,C.teal],["Dispatched",28,C.orange],["In Transit",22,C.yellow],["Delivered",24,C.green],["Cancelled",8,C.red]].map(([l,p,cl],i)=>(
              <div key={i} style={{flex:p,background:cl,opacity:0.85,display:"flex",alignItems:"center",justifyContent:"center"}} title={`${l}: ${p}%`}>
                <span style={{fontFamily:C.mono,fontSize:9,color:"#fff",fontWeight:700}}>{p}%</span>
              </div>
            ))}
          </div>
          <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
            {[["Confirmed",C.teal],["Dispatched",C.orange],["In Transit",C.yellow],["Delivered",C.green],["Cancelled",C.red]].map(([l,cl],i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:5}}>
                <div style={{width:8,height:8,background:cl,borderRadius:1}}/><Mono size={10} color={C.muted}>{l}</Mono>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div style={{display:"flex",gap:0,marginBottom:14,borderBottom:`1px solid ${C.border}`,flexWrap:"wrap"}}>
            {tabs.map(t => (
              <button key={t} onClick={()=>setTab(t)} style={{padding:"9px 15px",background:"transparent",color:tab===t?C.white:C.muted,border:"none",borderBottom:`2px solid ${tab===t?C.red:"transparent"}`,fontFamily:C.mono,fontSize:10,cursor:"pointer",letterSpacing:"0.5px",textTransform:"uppercase",transition:"color 0.15s"}}>
                {t.replace("-"," ")}
              </button>
            ))}
            <div style={{flex:1}}/>
            <Btn variant="primary" size="sm" onClick={()=>showToast("New order form would open")}>+ New Order</Btn>
          </div>

          <DataTable
            headers={["Order ID","Type","Distributor","Retailer","Items","Gross","Tax","Total","IRN","E-Way","Status","Actions"]}
            rows={filtered}
            renderRow={o => <>
              <Td mono><span style={{color:C.red,fontWeight:700}}>{o.id.slice(-8)}</span></Td>
              <Td><S status={o.type}/></Td>
              <Td>{DATA.distributors.find(d=>d.id===o.dist)?.name||o.dist}</Td>
              <Td>{o.retailer}</Td>
              <Td mono>{o.items.length}</Td>
              <Td mono>{rupee(o.gross)}</Td>
              <Td mono>{rupee(o.cgst+o.sgst)}</Td>
              <Td mono><strong style={{color:C.white}}>{rupee(o.total)}</strong></Td>
              <Td><div style={{maxWidth:80,overflow:"hidden",textOverflow:"ellipsis"}}>{o.irn?<Badge label="IRN ✓" color="green"/>:<Badge label="Pending" color="yellow"/>}</div></Td>
              <Td>{o.ewayBill?<Badge label={o.ewayBill.slice(-4)} color="teal"/>:<Mono size={10} color={C.faint}>—</Mono>}</Td>
              <Td><S status={o.status}/></Td>
              <Td>
                <div style={{display:"flex",gap:4}}>
                  <Btn size="sm" onClick={()=>setSelected(o)}>Invoice</Btn>
                </div>
              </Td>
            </>}
          />
        </Card>
      </>}
    </div>
  );
}

// ── Inventory Page
function InventoryPage({ showToast }) {
  const [wh, setWh] = useState("all");
  const warehouses = ["all","WH-DL-01","WH-MH-01","WH-TN-01","WH-KA-01","WH-TS-01"];

  const filtered = wh==="all" ? DATA.inventory : DATA.inventory.filter(i=>i.warehouse===wh);
  const daysToExpiry = exp => {
    const d = Math.floor((new Date(exp)-new Date())/(1000*60*60*24));
    return d;
  };

  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,marginBottom:16,background:C.divider,border:`1px solid ${C.divider}`}}>
        <KpiCard label="Total SKUs" value="248" sub="Across 5 Warehouses" color={C.purple} up/>
        <KpiCard label="Good Stock Batches" value="168" change="67.7%" up sub="FEFO Ready" color={C.green}/>
        <KpiCard label="Near Expiry" value="42 Batches" change="Within 30 Days" sub=""/>
        <KpiCard label="Expired / Write-off" value="₹8.4 L" change="Pending action" sub=""/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:12,marginBottom:12}}>
        <Card>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14,flexWrap:"wrap",gap:8}}>
            <SecTitle label="FEFO Batch View" title="Inventory — First Expiry First Out"/>
            <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
              {warehouses.map(w=>(
                <button key={w} onClick={()=>setWh(w)} style={{padding:"4px 8px",background:wh===w?C.red:C.raised,color:wh===w?"#fff":C.muted,border:`1px solid ${wh===w?C.red:C.border}`,fontFamily:C.mono,fontSize:9,cursor:"pointer",borderRadius:3}}>
                  {w==="all"?"ALL":w.slice(-2)}
                </button>
              ))}
            </div>
          </div>
          <DataTable
            headers={["SKU Code","Brand","Warehouse","Batch No.","Mfg Date","Expiry","Days Left","Cases","Temp","Status"]}
            rows={[...filtered].sort((a,b)=>new Date(a.expiryDate)-new Date(b.expiryDate))}
            renderRow={inv => {
              const sku = DATA.skus.find(s=>s.id===inv.sku)||{code:"?",brand:"?"};
              const days = daysToExpiry(inv.expiryDate);
              return <>
                <Td mono><span style={{color:C.blue}}>{sku.code}</span></Td>
                <Td>{sku.brand}</Td>
                <Td mono>{inv.warehouse}</Td>
                <Td mono><span style={{color:C.purple}}>{inv.batch}</span></Td>
                <Td mono>{inv.mfgDate}</Td>
                <Td mono><span style={{color:days<0?C.red:days<30?C.yellow:C.muted}}>{inv.expiryDate}</span></Td>
                <Td mono><span style={{color:days<0?C.red:days<30?C.yellow:C.green,fontWeight:700}}>{days<0?"EXPIRED":`${days}d`}</span></Td>
                <Td mono>{inv.qtyCases.toLocaleString()}</Td>
                <Td mono><span style={{color:inv.temp==="fault"?C.red:C.muted}}>{inv.temp}</span></Td>
                <Td><S status={inv.status}/></Td>
              </>;
            }}
          />
        </Card>

        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Card>
            <SecTitle label="Health" title="Stock Aging Distribution"/>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={DATA.agingData}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.divider}/>
                <XAxis dataKey="b" tick={{fill:C.muted,fontSize:9,fontFamily:C.mono}} axisLine={false} tickLine={false}/>
                <YAxis tick={{fill:C.muted,fontSize:9,fontFamily:C.mono}} axisLine={false} tickLine={false}/>
                <Tooltip content={<ChartTooltip/>}/>
                <Bar dataKey="amt" name="Outstanding (₹Cr)" radius={[3,3,0,0]}>
                  {[C.green,C.yellow,C.orange,C.red].map((c,i)=><Cell key={i} fill={c} opacity={0.8}/>)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <Card>
            <SecTitle label="Alerts" title="Expiry Warnings"/>
            {DATA.inventory.filter(i=>i.status!=="good").map((inv,i)=>{
              const sku=DATA.skus.find(s=>s.id===inv.sku)||{brand:"?",code:"?"};
              const days=daysToExpiry(inv.expiryDate);
              return(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"9px 0",borderBottom:i<2?`1px solid ${C.divider}`:"none"}}>
                  <div>
                    <div style={{fontFamily:C.body,fontSize:12,color:C.white,marginBottom:2}}>{sku.brand} · {sku.code}</div>
                    <Mono size={10} color={C.muted}>{inv.qtyCases} cases · WH: {inv.warehouse.slice(-2)}</Mono>
                  </div>
                  <div style={{textAlign:"right",display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3}}>
                    <S status={inv.status}/>
                    <Mono size={10} color={days<0?C.red:C.yellow}>{days<0?"EXPIRED":`${days}d`}</Mono>
                  </div>
                </div>
              );
            })}
            <div style={{marginTop:12}}>
              <Btn variant="danger" full onClick={()=>showToast("Expiry report emailed to supply chain team")}>⚠ Send Expiry Report</Btn>
            </div>
          </Card>
        </div>
      </div>

      {/* Reorder suggestions */}
      <Card>
        <SecTitle label="AI Reorder" title="Auto Replenishment Suggestions" right={<Btn variant="primary" size="sm" onClick={()=>showToast("4 Auto-POs created for approval")}>Generate 4 Auto-POs</Btn>}/>
        <DataTable
          headers={["SKU","Brand","Warehouse","Current (Cases)","Daily Demand","Days Left","Risk","Suggested PO"]}
          rows={[
            {sku:"SKU003",wh:"WH-TN-01",cur:842,demand:280,risk:"critical",po:"3,000 cases"},
            {sku:"SKU005",wh:"WH-KA-01",cur:380,demand:94,risk:"critical",po:"1,200 cases"},
            {sku:"SKU001",wh:"WH-TS-01",cur:1840,demand:342,risk:"high",po:"4,000 cases"},
            {sku:"SKU004",wh:"WH-DL-01",cur:2180,demand:312,risk:"medium",po:"2,500 cases"},
          ]}
          renderRow={r=>{
            const sku=DATA.skus.find(s=>s.id===r.sku)||{brand:"?",code:"?"};
            const days=(r.cur/r.demand).toFixed(1);
            return <>
              <Td mono><span style={{color:C.blue}}>{sku.code}</span></Td>
              <Td>{sku.brand}</Td>
              <Td mono>{r.wh}</Td>
              <Td mono>{r.cur.toLocaleString()}</Td>
              <Td mono>{r.demand}/day</Td>
              <Td mono><span style={{color:parseFloat(days)<4?C.red:parseFloat(days)<7?C.yellow:C.green,fontWeight:700}}>{days}d</span></Td>
              <Td><Badge label={r.risk.toUpperCase()} color={r.risk==="critical"?"red":r.risk==="high"?"yellow":"orange"}/></Td>
              <Td mono><span style={{color:C.blue}}>{r.po}</span></Td>
            </>;
          }}
        />
      </Card>
    </div>
  );
}

// ── Analytics Page
function AnalyticsPage() {
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,marginBottom:16,background:C.divider,border:`1px solid ${C.divider}`}}>
        <KpiCard label="Numeric Distribution" value="82.4%" change="+2.1%" up sub="Active Universe"/>
        <KpiCard label="Weighted Distribution" value="91.2%" change="+1.4%" up sub="Volume Weighted" color={C.blue}/>
        <KpiCard label="Salesman Productivity" value="18.4" change="+1.2" up sub="Avg Calls/Day" color={C.teal}/>
        <KpiCard label="Beat Efficiency Score" value="78.6%" change="-3.1% vs target" sub="" color={C.purple}/>
      </div>

      {/* AI Forecast Chart */}
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:12,marginBottom:12}}>
        <Card>
          <SecTitle label="AI Model" title="Demand Forecast — Coca-Cola 750ml (Weekly)" />
          <div style={{fontFamily:C.mono,fontSize:10,color:C.muted,marginBottom:10}}>Prophet + XGBoost · MAPE 4.8% · Updated daily 6 AM</div>
          <ResponsiveContainer width="100%" height={220}>
            <ComposedChart data={DATA.aiForecasts}>
              <defs>
                <linearGradient id="gFore" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.blue} stopOpacity={0.2}/><stop offset="95%" stopColor={C.blue} stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.divider}/>
              <XAxis dataKey="day" tick={{fill:C.muted,fontSize:9,fontFamily:C.mono}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:C.muted,fontSize:9,fontFamily:C.mono}} axisLine={false} tickLine={false} tickFormatter={v=>v?v.toLocaleString():""}/>
              <Tooltip content={<ChartTooltip/>}/>
              <Area type="monotone" dataKey="high" fill={C.blue} stroke="none" fillOpacity={0.06} name="Upper Bound"/>
              <Area type="monotone" dataKey="low" fill={C.bg} stroke="none" fillOpacity={1}/>
              <Line type="monotone" dataKey="forecast" stroke={C.blue} strokeWidth={2} strokeDasharray="5 3" dot={false} name="Forecast"/>
              <Line type="monotone" dataKey="actual" stroke={C.white} strokeWidth={2.5} dot={{fill:C.white,r:3}} connectNulls={false} name="Actual"/>
              <Legend wrapperStyle={{fontFamily:C.mono,fontSize:10}}/>
            </ComposedChart>
          </ResponsiveContainer>
        </Card>

        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Card>
            <SecTitle label="AI Models" title="ML Health"/>
            {[
              {m:"Demand Forecast",acc:"MAPE 4.8%",c:C.green},
              {m:"Stockout Predict",acc:"Acc 91.2%",c:C.green},
              {m:"Churn Model",acc:"Acc 87.4%",c:C.green},
              {m:"Anomaly Detect",acc:"Prec 94.1%",c:C.green},
              {m:"Auto Replenish",acc:"MAPE 6.2%",c:C.yellow},
            ].map((m,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:i<4?`1px solid ${C.divider}`:"none"}}>
                <Mono size={11}>{m.m}</Mono>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <Mono size={10} color={m.c} bold>{m.acc}</Mono>
                  <div style={{width:7,height:7,borderRadius:"50%",background:m.c}}/>
                </div>
              </div>
            ))}
          </Card>
          <Card>
            <SecTitle label="Churn" title="Retailer Risk"/>
            {[["High Risk","284 retailers",C.red,"12 new today"],["Medium Risk","842 retailers",C.yellow,"28 new today"],["Low Risk","93,586 retailers",C.green,"Stable"]].map(([l,v,c,s],i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:i<2?`1px solid ${C.divider}`:"none"}}>
                <div><div style={{fontFamily:C.body,fontSize:12,color:C.white}}>{v}</div><Mono size={9} color={C.muted}>{s}</Mono></div>
                <Badge label={l} color={c===C.red?"red":c===C.yellow?"yellow":"green"}/>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* Zone Radar */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:12}}>
        <Card>
          <SecTitle label="Radar" title="Zone Performance"/>
          <ResponsiveContainer width="100%" height={260}>
            <RadarChart data={DATA.zoneKpis}>
              <PolarGrid stroke={C.faint}/>
              <PolarAngleAxis dataKey="z" tick={{fill:C.muted,fontSize:10,fontFamily:C.mono}}/>
              <PolarRadiusAxis tick={{fill:C.faint,fontSize:8}} domain={[0,100]}/>
              <Radar name="Fill Rate" dataKey="fill" stroke={C.blue} fill={C.blue} fillOpacity={0.12}/>
              <Radar name="Coverage" dataKey="cov" stroke={C.red} fill={C.red} fillOpacity={0.12}/>
              <Legend wrapperStyle={{fontFamily:C.mono,fontSize:10}}/>
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <SecTitle label="KPIs" title="Sales Salesman Productivity by Zone"/>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={DATA.zoneKpis}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.divider}/>
              <XAxis dataKey="z" tick={{fill:C.muted,fontSize:10,fontFamily:C.mono}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:C.muted,fontSize:10,fontFamily:C.mono}} axisLine={false} tickLine={false}/>
              <Tooltip content={<ChartTooltip/>}/>
              <Bar dataKey="prod" name="Productivity %" fill={C.red} opacity={0.8} radius={[3,3,0,0]}/>
              <Bar dataKey="cov" name="Coverage %" fill={C.blue} opacity={0.6} radius={[3,3,0,0]}/>
              <Legend wrapperStyle={{fontFamily:C.mono,fontSize:10}}/>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

// ── Schemes Page
function SchemePage({ showToast }) {
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,marginBottom:16,background:C.divider,border:`1px solid ${C.divider}`}}>
        <KpiCard label="Active Schemes" value="14" sub="Across 4 Channels" color={C.purple} up/>
        <KpiCard label="Budget Allocated" value="₹12.4 Cr" sub="FY 2024-25 Q4" color={C.blue} up/>
        <KpiCard label="Budget Utilized" value="₹4.2 Cr" change="33.9%" sub="Consumed" color={C.orange}/>
        <KpiCard label="Avg Scheme ROI" value="3.2×" change="+0.4× vs last Q" up sub="Volume Lift" color={C.green}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:12,marginBottom:12}}>
        <Card>
          <SecTitle label="TPM" title="Trade Promotion Schemes" right={<Btn variant="primary" size="sm" onClick={()=>showToast("Scheme creation form would open")}>+ Create Scheme</Btn>}/>
          <DataTable
            headers={["ID","Name","Type","Channel","Trigger SKU","Mechanics","Valid Period","Budget","Utilized","Status"]}
            rows={DATA.schemes}
            renderRow={s => {
              const tsku=DATA.skus.find(sk=>sk.id===s.triggerSku);
              const mechanic = s.type==="buy_x_get_y"?`Buy ${s.buyQty} Get ${s.getQty}`:s.type==="volume_discount"?`${s.discountPct}% off >₹${(s.minOrderValue/1000).toFixed(0)}K`:s.type==="free_sku"?`Buy ${s.buyQty} → ${s.getQty} Free`:s.slabs?`3-slab discount`:"—";
              return <>
                <Td mono><span style={{color:C.red}}>{s.id}</span></Td>
                <Td><strong style={{color:C.white,fontFamily:C.body}}>{s.name}</strong></Td>
                <Td><S status={s.type}/></Td>
                <Td><Badge label={s.channel} color={s.channel==="GT"?"orange":s.channel==="MT"?"blue":s.channel==="HORECA"?"purple":"default"}/></Td>
                <Td mono>{tsku?tsku.code:s.triggerSku==="ALL"?"ALL":s.triggerSku}</Td>
                <Td mono>{mechanic}</Td>
                <Td mono><span style={{color:C.muted}}>{s.validFrom.slice(5)}→{s.validTo.slice(5)}</span></Td>
                <Td mono>{rupee(s.budget)}</Td>
                <Td><ProgressBar pct={Math.round(s.utilized/s.budget*100)} height={6}/></Td>
                <Td><S status={s.status}/></Td>
              </>;
            }}
          />
        </Card>

        <Card>
          <SecTitle label="Budget" title="Scheme Burn Rate"/>
          {DATA.schemes.filter(s=>s.status==="active").map((s,i)=>{
            const pct=Math.round(s.utilized/s.budget*100);
            return(
              <div key={i} style={{marginBottom:16}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <div style={{fontFamily:C.body,fontSize:12,color:C.white}}>{s.name}</div>
                  <Badge label={s.channel} color={s.channel==="MT"?"blue":s.channel==="HORECA"?"purple":"orange"}/>
                </div>
                <ProgressBar pct={pct} height={8} label={`${pct}% · ${rupee(s.utilized)} of ${rupee(s.budget)}`}/>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}

// ── SFA / Field Force Page
function SFAPage() {
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,marginBottom:16,background:C.divider,border:`1px solid ${C.divider}`}}>
        <KpiCard label="Present Today" value="841/940" change="89.5%" up sub="Attendance"/>
        <KpiCard label="Avg Beat Coverage" value="76.4%" change="-3.1% vs target" sub="Today"/>
        <KpiCard label="Orders Booked" value="14,284" change="By 2 PM" up sub="Today"/>
        <KpiCard label="Live on Field" value="738" change="87.8%" up sub="of Present" color={C.green}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:12,marginBottom:12}}>
        <Card>
          <SecTitle label="Salesmen" title="Productivity — Live"/>
          <DataTable
            headers={["ID","Name","Territory","Visits","Target","Orders","Value","Collection","Attendance","Last Checkin"]}
            rows={DATA.salesmen}
            renderRow={s=>(
              <>
                <Td mono><span style={{color:C.red}}>{s.id}</span></Td>
                <Td><strong style={{color:C.white,fontFamily:C.body}}>{s.name}</strong></Td>
                <Td mono>{s.territory}</Td>
                <Td mono>
                  <span style={{color:s.visitsToday>=s.visitTarget?C.green:s.visitsToday>s.visitTarget*0.7?C.yellow:C.red,fontWeight:700}}>{s.visitsToday}</span>
                  <span style={{color:C.faint}}>/{s.visitTarget}</span>
                </Td>
                <Td mono>{s.visitTarget}</Td>
                <Td mono>{s.ordersToday}</Td>
                <Td mono>{rupee(s.valueToday)}</Td>
                <Td mono>{rupee(s.collection)}</Td>
                <Td><S status={s.attendance}/></Td>
                <Td mono>{s.lastCheckin}</Td>
              </>
            )}
          />
        </Card>

        <Card>
          <SecTitle label="Beat" title="Coverage by Zone"/>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={DATA.zoneKpis}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.divider}/>
              <XAxis dataKey="z" tick={{fill:C.muted,fontSize:9,fontFamily:C.mono}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:C.muted,fontSize:9,fontFamily:C.mono}} axisLine={false} tickLine={false}/>
              <Tooltip content={<ChartTooltip/>}/>
              <Bar dataKey="cov" name="Coverage %" fill={C.red} opacity={0.8} radius={[3,3,0,0]}>
                {DATA.zoneKpis.map((_,i)=><Cell key={i} fill={DATA.zoneKpis[i].cov>85?C.green:DATA.zoneKpis[i].cov>75?C.yellow:C.red} opacity={0.8}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <Div mt={12} mb={10}/>
          <SecTitle label="Beats" title="Today's Beat Schedule"/>
          {DATA.beats.map((b,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"7px 0",borderBottom:i<4?`1px solid ${C.divider}`:"none"}}>
              <div>
                <div style={{fontFamily:C.body,fontSize:12,color:C.white}}>{b.name}</div>
                <Mono size={10} color={C.muted}>{b.outlets} outlets · {b.day}</Mono>
              </div>
              <ProgressBar pct={b.coverage} height={5} color={b.coverage>90?C.green:b.coverage>80?C.yellow:C.red}/>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ── Finance Page
function FinancePage({ showToast }) {
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,marginBottom:16,background:C.divider,border:`1px solid ${C.divider}`}}>
        <KpiCard label="Total Outstanding" value="₹42.8 Cr" change="-₹2.4 Cr" up sub="vs Last Week"/>
        <KpiCard label="Collection Today" value="₹8.4 Cr" change="82% of target" sub=""/>
        <KpiCard label="PDC Maturity" value="₹6.2 Cr" sub="14 cheques this week" color={C.yellow}/>
        <KpiCard label="Credit Blocked" value="38 Accounts" change="₹12.4 Cr frozen" sub="" color={C.red}/>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:12,marginBottom:12}}>
        <Card>
          <SecTitle label="Finance" title="Outstanding Aging Analysis"/>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={DATA.agingData}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.divider}/>
              <XAxis dataKey="b" tick={{fill:C.muted,fontSize:10,fontFamily:C.mono}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:C.muted,fontSize:10,fontFamily:C.mono}} axisLine={false} tickLine={false} tickFormatter={v=>`₹${v}Cr`}/>
              <Tooltip content={<ChartTooltip/>}/>
              <Bar dataKey="amt" name="Outstanding (₹Cr)" radius={[3,3,0,0]}>
                {[C.green,C.yellow,C.orange,C.red].map((c,i)=><Cell key={i} fill={c} opacity={0.8}/>)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <SecTitle label="GST" title="Compliance Overview"/>
          {[
            {period:"Feb 2025",outward:"₹15.8 Cr",gst:"₹5.6 Cr",irn:41240,eway:1102,status:"pending"},
            {period:"Jan 2025",outward:"₹14.2 Cr",gst:"₹4.4 Cr",irn:48240,eway:1284,status:"filed"},
            {period:"Dec 2024",outward:"₹16.8 Cr",gst:"₹5.4 Cr",irn:52180,eway:1412,status:"filed"},
          ].map((g,i)=>(
            <div key={i} style={{padding:"10px 0",borderBottom:i<2?`1px solid ${C.divider}`:"none"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <Mono bold color={C.white}>{g.period}</Mono>
                <S status={g.status}/>
              </div>
              <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                <div><Mono size={9} color={C.muted}>OUTWARD</Mono><Mono bold color={C.text}>{g.outward}</Mono></div>
                <div><Mono size={9} color={C.muted}>NET GST</Mono><Mono bold color={C.orange}>{g.gst}</Mono></div>
                <div><Mono size={9} color={C.muted}>E-INV</Mono><Mono bold color={C.blue}>{g.irn.toLocaleString()}</Mono></div>
              </div>
            </div>
          ))}
          <div style={{marginTop:12,display:"flex",gap:8}}>
            <Btn variant="primary" size="sm" full onClick={()=>showToast("GSTR-1 data exported")}>Export GSTR-1</Btn>
          </div>
        </Card>
      </div>

      <Card>
        <SecTitle label="Distributor Ledger" title="Credit & Collections Overview"
          right={<div style={{display:"flex",gap:6}}><Btn size="sm" onClick={()=>showToast("Collection statement downloaded")}>⬇ Download</Btn><Btn size="sm" variant="primary" onClick={()=>showToast("Collection entry form")}>+ Record Collection</Btn></div>}/>
        <DataTable
          headers={["Distributor","Credit Limit","Outstanding","Aging","Status","Collection Today","PDC Pending","Action"]}
          rows={DATA.distributors.slice(0,6)}
          renderRow={d=>(
            <>
              <Td><strong style={{color:C.white,fontFamily:C.body}}>{d.name}</strong></Td>
              <Td mono>{rupee(d.credit)}</Td>
              <Td mono><span style={{color:d.agingDays>30?C.red:d.agingDays>15?C.yellow:C.text}}>{rupee(d.outstanding)}</span></Td>
              <Td mono><span style={{color:d.agingDays>60?C.red:d.agingDays>30?C.yellow:C.green}}>{d.agingDays}d</span></Td>
              <Td><S status={d.status}/></Td>
              <Td mono>{rupee(Math.floor(d.outstanding*0.2))}</Td>
              <Td mono>{rupee(Math.floor(d.outstanding*0.15))}</Td>
              <Td><Btn size="sm" onClick={()=>showToast("Collection entry opened")}>Collect</Btn></Td>
            </>
          )}
        />
      </Card>
    </div>
  );
}

// ── Assets Page
function AssetPage({ showToast }) {
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,marginBottom:16,background:C.divider,border:`1px solid ${C.divider}`}}>
        <KpiCard label="Total Assets" value="42,840" sub="Visi + Chest Coolers" color={C.teal} up/>
        <KpiCard label="Deployed" value="38,412" change="89.7%" up sub="Utilization"/>
        <KpiCard label="AMC Expired" value="2,184" change="Renewal Required" sub=""/>
        <KpiCard label="Faulty Units" value="384" change="Service Tickets Open" sub=""/>
      </div>

      <Card>
        <SecTitle label="Assets" title="Visi-Cooler & Equipment Tracker"
          right={<div style={{display:"flex",gap:6}}><Btn size="sm" onClick={()=>showToast("Asset report generated")}>Report</Btn><Btn size="sm" variant="primary" onClick={()=>showToast("Register new asset")}>+ Register Asset</Btn></div>}/>
        <DataTable
          headers={["Asset ID","Type","Retailer","Territory","Allocated","Warranty","AMC","AMC Expiry","Last Service","Temp","Status","Action"]}
          rows={DATA.assets}
          renderRow={a=>{
            const ret=DATA.retailers.find(r=>r.id===a.retailer)||{name:"Unknown"};
            return <>
              <Td mono><span style={{color:C.red}}>{a.id}</span></Td>
              <Td>{a.type}</Td>
              <Td>{ret.name}</Td>
              <Td mono>{a.territory}</Td>
              <Td mono>{a.allocated}</Td>
              <Td mono>{a.warranty}</Td>
              <Td><Badge label={a.amc.toUpperCase()} color={a.amc==="active"?"green":"red"}/></Td>
              <Td mono><span style={{color:a.amc==="expired"?C.red:C.muted}}>{a.amcExpiry}</span></Td>
              <Td mono>{a.lastService}</Td>
              <Td mono><span style={{color:a.temp==="fault"?C.red:parseFloat(a.temp)>10?C.yellow:C.muted}}>{a.temp}</span></Td>
              <Td><S status={a.status}/></Td>
              <Td><div style={{display:"flex",gap:3}}>
                <Btn size="sm" onClick={()=>showToast(`QR: ${a.qr}`)}>QR</Btn>
                {a.status==="fault"&&<Btn size="sm" variant="danger" onClick={()=>showToast("Service ticket raised")}>Service</Btn>}
              </div></Td>
            </>;
          }}
        />
      </Card>
    </div>
  );
}

// ── Returns Page
function ReturnsPage({ showToast }) {
  const returns = [
    {id:"RET-4821",order:"ORD-2025-084108",dist:"DB-1025",type:"expiry",reason:"Limca batch expired",items:4,value:8640,status:"approved",cn:"CN-2841"},
    {id:"RET-4820",order:"ORD-2025-083942",dist:"DB-1024",type:"breakage",reason:"Glass bottles damaged transit",items:2,value:3200,status:"pending",cn:null},
    {id:"RET-4819",order:"ORD-2025-083814",dist:"DB-1028",type:"market_return",reason:"Retailer overstocked",items:8,value:14400,status:"rejected",cn:null},
    {id:"RET-4818",order:"ORD-2025-083720",dist:"DB-1029",type:"quality",reason:"Carbonation issue complaint",items:1,value:1800,status:"approved",cn:"CN-2840"},
    {id:"RET-4817",order:"ORD-2025-083641",dist:"DB-1026",type:"expiry",reason:"Maaza near expiry batch",items:12,value:15600,status:"pending",cn:null},
  ];
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,marginBottom:16,background:C.divider,border:`1px solid ${C.divider}`}}>
        <KpiCard label="Open Returns" value="284" change="+42 this week" sub=""/>
        <KpiCard label="Credit Notes Issued" value="₹18.4 L" up sub="This Month" color={C.green}/>
        <KpiCard label="Pending Approval" value="82" change="3+ days pending" sub=""/>
        <KpiCard label="Breakage Claims" value="₹4.2 L" sub="68 Claims Open" color={C.orange}/>
      </div>
      <Card>
        <SecTitle label="RMA" title="Return Orders & Claims"
          right={<Btn variant="primary" size="sm" onClick={()=>showToast("New return form opened")}>+ New Return</Btn>}/>
        <DataTable
          headers={["Return ID","Original Order","Distributor","Type","Reason","Items","Value","Status","Credit Note","Actions"]}
          rows={returns}
          renderRow={r=>{
            const dist=DATA.distributors.find(d=>d.id===r.dist)||{name:r.dist};
            const typeColors={expiry:"yellow",breakage:"orange",market_return:"blue",quality:"red"};
            return <>
              <Td mono><span style={{color:C.red}}>{r.id}</span></Td>
              <Td mono>{r.order.slice(-8)}</Td>
              <Td>{dist.name}</Td>
              <Td><Badge label={r.type.replace("_"," ").toUpperCase()} color={typeColors[r.type]||"default"}/></Td>
              <Td>{r.reason}</Td>
              <Td mono>{r.items} SKUs</Td>
              <Td mono>{rupee(r.value)}</Td>
              <Td><S status={r.status}/></Td>
              <Td>{r.cn?<Badge label={r.cn} color="green"/>:<Mono size={10} color={C.faint}>—</Mono>}</Td>
              <Td>
                <div style={{display:"flex",gap:3"}}>
                  {r.status==="pending"&&<><Btn size="sm" variant="success" onClick={()=>showToast("Return approved")}>Approve</Btn><Btn size="sm" variant="danger" onClick={()=>showToast("Return rejected")}>Reject</Btn></>}
                  {r.status==="approved"&&<Btn size="sm" onClick={()=>showToast("Credit note issued")}>Issue CN</Btn>}
                </div>
              </Td>
            </>;
          }}
        />
      </Card>
    </div>
  );
}

// ── SKU Master Page
function SKUPage({ showToast }) {
  return (
    <div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:1,marginBottom:16,background:C.divider,border:`1px solid ${C.divider}`}}>
        <KpiCard label="Total SKUs" value="248" sub="Active in System" color={C.blue} up/>
        <KpiCard label="Returnable Glass" value="42" sub="Deposit Tracked" color={C.teal} up/>
        <KpiCard label="New SKUs (FY25)" value="18" change="+6 this Q" up sub="Launched"/>
        <KpiCard label="Discontinued" value="7" sub="Archived" color={C.purple}/>
      </div>
      <Card>
        <SecTitle label="Master Data" title="SKU Master — All Products"
          right={<div style={{display:"flex",gap:6}}><Btn size="sm">Import</Btn><Btn size="sm" variant="primary" onClick={()=>showToast("New SKU form opened")}>+ Add SKU</Btn></div>}/>
        <DataTable
          headers={["SKU Code","Brand","Flavour","Pack","Volume","Returnable","HSN","GST","MRP","PTR","PTD","Case Qty","Actions"]}
          rows={DATA.skus}
          renderRow={s=>(
            <>
              <Td mono><span style={{color:C.blue,fontWeight:700}}>{s.code}</span></Td>
              <Td><strong style={{color:C.white}}>{s.brand}</strong></Td>
              <Td>{s.flavour}</Td>
              <Td><Badge label={s.pack} color={s.pack==="Glass"?"teal":s.pack==="Can"?"orange":"blue"}/></Td>
              <Td mono>{s.vol}{s.unit}</Td>
              <Td><Badge label={s.returnable?"YES":"NO"} color={s.returnable?"green":"default"}/></Td>
              <Td mono>{s.hsn}</Td>
              <Td mono>{s.gst}%</Td>
              <Td mono>₹{s.mrp}</Td>
              <Td mono>₹{s.ptr}</Td>
              <Td mono>₹{s.ptd}</Td>
              <Td mono>{s.caseQty}</Td>
              <Td><Btn size="sm" onClick={()=>showToast(`Editing ${s.code}`)}>Edit</Btn></Td>
            </>
          )}
        />
      </Card>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ADMIN APP SHELL
═══════════════════════════════════════════════════════════════════ */
const ADMIN_NAV = [
  { id:"dashboard",  label:"Dashboard",      icon:"⬡",  group:"main" },
  { id:"org",        label:"Org Hierarchy",  icon:"◈",  group:"main" },
  { id:"distributor",label:"Distributors",   icon:"🏭", group:"operations" },
  { id:"orders",     label:"Orders",         icon:"📋", group:"operations" },
  { id:"inventory",  label:"Inventory",      icon:"▦",  group:"operations" },
  { id:"sku",        label:"SKU Master",     icon:"◫",  group:"operations" },
  { id:"schemes",    label:"Schemes / TPM",  icon:"◑",  group:"commercial" },
  { id:"sfa",        label:"Field Force",    icon:"◉",  group:"commercial" },
  { id:"finance",    label:"Finance & GST",  icon:"◧",  group:"commercial" },
  { id:"assets",     label:"Assets",         icon:"▣",  group:"commercial" },
  { id:"analytics",  label:"Analytics & AI", icon:"◈",  group:"intelligence" },
  { id:"returns",    label:"Returns",        icon:"↺",  group:"intelligence" },
];

const PAGE_MAP = {
  dashboard: DashboardPage, org: OrgPage, distributor: DistributorPage,
  orders: OrderPage, inventory: InventoryPage, sku: SKUPage,
  schemes: SchemePage, sfa: SFAPage, finance: FinancePage,
  assets: AssetPage, analytics: AnalyticsPage, returns: ReturnsPage,
};

function AdminApp({ authUser, onLogout, activePage, setActivePage, switchToMobile, showToast }) {
  const [collapsed, setCollapsed] = useState(false);
  const [alerts] = useState(7);
  const PageComp = PAGE_MAP[activePage] || DashboardPage;
  const groups = [...new Set(ADMIN_NAV.map(n=>n.group))];

  return (
    <div style={{ display:"flex", height:"100vh", background:C.bg, overflow:"hidden" }}>
      {/* Sidebar */}
      <div style={{ width:collapsed?52:210, background:C.surface, borderRight:`1px solid ${C.border}`, display:"flex", flexDirection:"column", transition:"width 0.2s", flexShrink:0, overflow:"hidden" }}>
        {/* Brand */}
        <div style={{ height:54, borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", padding:`0 ${collapsed?"10px":"14px"}`, gap:10, flexShrink:0 }}>
          <div style={{ width:30, height:30, borderRadius:"50%", background:C.red, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 0 14px ${C.redGlow}`, flexShrink:0 }}>
            <span style={{ fontFamily:C.mono, fontSize:10, fontWeight:700, color:"#fff" }}>CC</span>
          </div>
          {!collapsed && <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontFamily:C.display, fontSize:13, fontWeight:800, color:C.white, letterSpacing:"1.5px", whiteSpace:"nowrap" }}>COCA-COLA</div>
            <div style={{ fontFamily:C.mono, fontSize:9, color:C.muted, letterSpacing:"1px" }}>DMS INDIA · ADMIN</div>
          </div>}
          <button onClick={()=>setCollapsed(!collapsed)} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:14, padding:4, flexShrink:0 }}>{collapsed?"›":"‹"}</button>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, overflowY:"auto", overflowX:"hidden", padding:"6px 0" }}>
          {groups.map(g => (
            <div key={g}>
              {!collapsed && <div style={{ fontFamily:C.mono, fontSize:8, color:C.faint, letterSpacing:"1.5px", textTransform:"uppercase", padding:"10px 14px 4px" }}>{g}</div>}
              {ADMIN_NAV.filter(n=>n.group===g).map(item => (
                <button key={item.id} onClick={()=>setActivePage(item.id)}
                  style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:`9px ${collapsed?"0":"14px"}`, justifyContent:collapsed?"center":"flex-start", background:activePage===item.id?C.redGlow:"transparent", borderLeft:`2px solid ${activePage===item.id?C.red:"transparent"}`, color:activePage===item.id?C.white:C.muted, border:"none", cursor:"pointer", fontFamily:C.body, fontSize:12, fontWeight:activePage===item.id?600:400, transition:"all 0.15s", borderRight:"none", borderTop:"none", borderBottom:"none", whiteSpace:"nowrap" }}
                  onMouseEnter={e=>{if(activePage!==item.id)e.currentTarget.style.background=C.panel; e.currentTarget.style.color=C.text;}}
                  onMouseLeave={e=>{if(activePage!==item.id)e.currentTarget.style.background="transparent"; if(activePage!==item.id)e.currentTarget.style.color=C.muted;}}>
                  <span style={{ fontSize:15, width:18, textAlign:"center", flexShrink:0 }}>{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </button>
              ))}
            </div>
          ))}
        </nav>

        {/* User + Mobile Switch */}
        <div style={{ borderTop:`1px solid ${C.border}`, flexShrink:0 }}>
          {!collapsed && <button onClick={switchToMobile} style={{ width:"100%", padding:"8px 14px", background:"transparent", border:"none", borderBottom:`1px solid ${C.border}`, color:C.muted, fontFamily:C.mono, fontSize:10, cursor:"pointer", display:"flex", alignItems:"center", gap:8, letterSpacing:"0.5px" }}
            onMouseEnter={e=>e.currentTarget.style.background=C.panel} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            <span>📱</span> Switch to Mobile SFA
          </button>}
          <div style={{ padding:`10px ${collapsed?"6px":"14px"}`, display:"flex", alignItems:"center", gap:10, justifyContent:collapsed?"center":"flex-start" }}>
            <div style={{ width:28, height:28, borderRadius:"50%", background:C.redGlow, border:`1px solid rgba(232,0,28,0.3)`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <span style={{ fontFamily:C.mono, fontSize:10, color:C.red }}>{authUser.avatar}</span>
            </div>
            {!collapsed && <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:C.body, fontSize:12, color:C.text, fontWeight:600, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{authUser.name}</div>
              <div style={{ fontFamily:C.mono, fontSize:9, color:C.muted }}>{authUser.role} · {authUser.zone}</div>
            </div>}
            {!collapsed && <button onClick={onLogout} style={{ background:"none", border:"none", color:C.muted, cursor:"pointer", fontSize:12 }} title="Logout">⇤</button>}
          </div>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        {/* Topbar */}
        <div style={{ height:54, background:C.surface, borderBottom:`1px solid ${C.border}`, display:"flex", alignItems:"center", padding:"0 20px", gap:14, flexShrink:0 }}>
          <div>
            <div style={{ fontFamily:C.display, fontSize:16, fontWeight:700, color:C.white }}>{ADMIN_NAV.find(n=>n.id===activePage)?.label||"Dashboard"}</div>
            <div style={{ fontFamily:C.mono, fontSize:9, color:C.muted, letterSpacing:"0.5px" }}>
              {new Date().toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"}).toUpperCase()}
            </div>
          </div>
          <div style={{ flex:1 }}/>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:C.green, animation:"pulse 2s infinite" }}/>
            <Mono size={10} color={C.green}>LIVE</Mono>
          </div>
          <div style={{ position:"relative" }}>
            <Btn variant="ghost" size="sm" onClick={()=>showToast("7 new alerts")}>🔔</Btn>
            <div style={{ position:"absolute", top:-3, right:-3, width:15, height:15, background:C.red, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:C.mono, fontSize:8, color:"#fff", fontWeight:700, pointerEvents:"none" }}>{alerts}</div>
          </div>
          <Btn variant="ghost" size="sm" onClick={()=>showToast("Settings panel")}>⚙</Btn>
          <Btn variant="ghost" size="sm" onClick={onLogout}>⇤ Logout</Btn>
        </div>

        {/* Page */}
        <div style={{ flex:1, overflowY:"auto", padding:"18px 20px" }}>
          <PageComp showToast={showToast} />
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   MOBILE SFA APP
═══════════════════════════════════════════════════════════════════ */
function MobileApp({ authUser, onLogout, activePage, setActivePage, switchToAdmin, showToast }) {
  const [orderStep, setOrderStep]   = useState(0);
  const [selectedRetailer, setSR]   = useState(null);
  const [cart, setCart]             = useState([]);
  const [checkedIn, setCheckedIn]   = useState(null);
  const [surveyDone, setSurveyDone] = useState(false);

  const sm = DATA.salesmen.find(s=>s.name===authUser.name) || DATA.salesmen[0];

  const W = 390; // mobile width
  const H = "100vh";

  // ── Home Screen
  const HomeScreen = () => (
    <div style={{ padding:"0 0 80px" }}>
      {/* Hero */}
      <div style={{ background:`linear-gradient(135deg, ${C.red} 0%, ${C.redDim} 100%)`, padding:"20px 16px 24px", marginBottom:16, position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", top:-20, right:-20, width:120, height:120, borderRadius:"50%", background:"rgba(255,255,255,0.06)" }}/>
        <div style={{ position:"absolute", bottom:-30, right:30, width:80, height:80, borderRadius:"50%", background:"rgba(255,255,255,0.04)" }}/>
        <div style={{ fontFamily:C.mono, fontSize:10, color:"rgba(255,255,255,0.6)", letterSpacing:"1px", marginBottom:8 }}>
          {new Date().toLocaleDateString("en-IN",{weekday:"long",day:"numeric",month:"short"})}
        </div>
        <div style={{ fontFamily:C.display, fontSize:20, fontWeight:800, color:"#fff", marginBottom:4 }}>Good Morning,</div>
        <div style={{ fontFamily:C.display, fontSize:26, fontWeight:800, color:"#fff", lineHeight:1 }}>{authUser.name.split(" ")[0]} 👋</div>
        <div style={{ fontFamily:C.mono, fontSize:11, color:"rgba(255,255,255,0.7)", marginTop:4 }}>{sm.territory} · {DATA.distributors.find(d=>d.id===sm.dist)?.name}</div>
        <div style={{ display:"flex", gap:12, marginTop:16 }}>
          {[["Visits",`${sm.visitsToday}/${sm.visitTarget}`],["Orders",sm.ordersToday],["Value",rupee(sm.valueToday)]].map(([l,v],i)=>(
            <div key={i} style={{ background:"rgba(0,0,0,0.25)", borderRadius:6, padding:"8px 12px", textAlign:"center" }}>
              <div style={{ fontFamily:C.display, fontSize:16, color:"#fff", fontWeight:700 }}>{v}</div>
              <div style={{ fontFamily:C.mono, fontSize:9, color:"rgba(255,255,255,0.6)" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Beat progress */}
      <div style={{ margin:"0 12px 12px", background:C.card, borderRadius:8, padding:"14px", border:`1px solid ${C.border}` }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
          <div style={{ fontFamily:C.display, fontSize:14, fontWeight:700, color:C.white }}>Today's Beat Progress</div>
          <Badge label={`${sm.visitsToday}/${sm.visitTarget} outlets`} color="green"/>
        </div>
        <ProgressBar pct={Math.round(sm.visitsToday/sm.visitTarget*100)} height={8} color={C.green}/>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:6 }}>
          <Mono size={10} color={C.muted}>Started 8:00 AM · Last checkin {sm.lastCheckin}</Mono>
          <Mono size={10} color={C.green}>{Math.round(sm.visitsToday/sm.visitTarget*100)}%</Mono>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ margin:"0 12px 12px" }}>
        <div style={{ fontFamily:C.mono, fontSize:10, color:C.muted, letterSpacing:"1px", marginBottom:8, textTransform:"uppercase" }}>Quick Actions</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
          {[
            { icon:"📍", label:"New Visit", sub:"Check into outlet", page:"beat", color:C.red },
            { icon:"📋", label:"Book Order", sub:"Take retailer order", page:"order", color:C.blue },
            { icon:"💰", label:"Collection", sub:"Record payment", page:"collection", color:C.green },
            { icon:"📷", label:"Market Intel", sub:"Log competitor data", page:"intel", color:C.orange },
          ].map((a,i) => (
            <button key={i} onClick={()=>setActivePage(a.page)} style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:8, padding:"14px 12px", cursor:"pointer", textAlign:"left", transition:"all 0.15s", borderTop:`2px solid ${a.color}` }}
              onMouseEnter={e=>e.currentTarget.style.background=C.hover} onMouseLeave={e=>e.currentTarget.style.background=C.card}>
              <div style={{ fontSize:22, marginBottom:6 }}>{a.icon}</div>
              <div style={{ fontFamily:C.body, fontSize:13, fontWeight:700, color:C.white, marginBottom:2 }}>{a.label}</div>
              <div style={{ fontFamily:C.mono, fontSize:10, color:C.muted }}>{a.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Today's Beat */}
      <div style={{ margin:"0 12px 12px" }}>
        <div style={{ fontFamily:C.mono, fontSize:10, color:C.muted, letterSpacing:"1px", marginBottom:8, textTransform:"uppercase" }}>Today's Beat — {sm.beats[0]}</div>
        <div style={{ background:C.card, border:`1px solid ${C.border}`, borderRadius:8, overflow:"hidden" }}>
          {DATA.retailers.map((r,i) => {
            const visited = i < sm.visitsToday;
            return (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 14px", borderBottom:i<4?`1px solid ${C.divider}`:"none", background:visited?"transparent":i===sm.visitsToday?`${C.redGlow}`:"transparent" }}>
                <div style={{ width:32, height:32, borderRadius:"50%", background:visited?C.greenDim:i===sm.visitsToday?C.redGlow:C.raised, border:`1px solid ${visited?C.green:i===sm.visitsToday?C.red:C.faint}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:14 }}>
                  {visited ? "✓" : i===sm.visitsToday ? "→" : String(i+1)}
                </div>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:C.body, fontSize:13, fontWeight:600, color:visited?C.muted:C.white }}>{r.name}</div>
                  <Mono size={10} color={C.muted}>{r.type} · {r.channel} · Seg {r.segment} {r.hasCooler?"❄":""}</Mono>
                </div>
                {i===sm.visitsToday && (
                  <Btn size="sm" variant="primary" onClick={()=>{setSR(r); setActivePage("visit");}}>Visit</Btn>
                )}
                {visited && <Badge label="DONE" color="green"/>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  // ── Visit Flow Screen
  const VisitScreen = () => {
    const r = selectedRetailer || DATA.retailers[sm.visitsToday] || DATA.retailers[0];
    const steps = ["Check In","Survey","Order","Invoice","Check Out"];

    return (
      <div style={{ padding:"0 0 80px" }}>
        {/* Header */}
        <div style={{ background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"12px 14px 14px" }}>
          <button onClick={()=>setActivePage("home")} style={{ background:"none", border:"none", color:C.muted, fontFamily:C.mono, fontSize:11, cursor:"pointer", padding:0, marginBottom:8, display:"flex", alignItems:"center", gap:4 }}>← Back to Beat</button>
          <div style={{ fontFamily:C.display, fontSize:16, fontWeight:700, color:C.white }}>{r.name}</div>
          <Mono size={10} color={C.muted}>{r.address}</Mono>
          <div style={{ display:"flex", gap:6, marginTop:6, flexWrap:"wrap" }}>
            <Badge label={r.channel} color={r.channel==="MT"?"blue":r.channel==="HORECA"?"purple":"orange"}/>
            <Badge label={`Seg ${r.segment}`} color="default"/>
            {r.hasCooler && <Badge label="❄ Cooler" color="teal"/>}
            {r.outstanding>0 && <Badge label={`Due: ${rupee(r.outstanding)}`} color="yellow"/>}
          </div>
        </div>

        {/* Step Progress */}
        <div style={{ padding:"12px 14px", background:C.panel, borderBottom:`1px solid ${C.border}` }}>
          <div style={{ display:"flex", gap:0 }}>
            {steps.map((s,i) => (
              <div key={i} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", position:"relative" }}>
                <div style={{ width:24, height:24, borderRadius:"50%", background:i<orderStep?C.green:i===orderStep?C.red:C.faint, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"#fff", fontWeight:700, fontFamily:C.mono, zIndex:1, transition:"background 0.3s" }}>
                  {i<orderStep?"✓":i+1}
                </div>
                {i<steps.length-1 && <div style={{ position:"absolute", top:12, left:"50%", width:"100%", height:2, background:i<orderStep?C.green:C.faint, transition:"background 0.3s", zIndex:0 }}/>}
                <Mono size={8} color={i===orderStep?C.red:i<orderStep?C.green:C.faint} style={{marginTop:4,textAlign:"center"}}>{s}</Mono>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div style={{ padding:"14px" }}>
          {orderStep === 0 && (
            <Card>
              <SecTitle label="Step 1" title="Geo-Fenced Check-In"/>
              <div style={{ background:C.surface, borderRadius:8, height:140, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:14, border:`1px solid ${C.border}`, flexDirection:"column", gap:8 }}>
                <div style={{ fontSize:32 }}>📍</div>
                <Mono size={11} color={C.muted}>Lat: {r.lat?.toFixed(4)} · Lng: {r.lng?.toFixed(4)}</Mono>
                <Badge label="Within Geofence ✓" color="green"/>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:14 }}>
                <div style={{ background:C.surface, borderRadius:6, padding:"10px", textAlign:"center" }}>
                  <div style={{ fontFamily:C.display, fontSize:18, color:C.white }}>{rupee(r.outstanding)}</div>
                  <Mono size={9} color={C.muted}>OUTSTANDING</Mono>
                </div>
                <div style={{ background:C.surface, borderRadius:6, padding:"10px", textAlign:"center" }}>
                  <div style={{ fontFamily:C.display, fontSize:18, color:C.white }}>{r.lastOrder}</div>
                  <Mono size={9} color={C.muted}>LAST ORDER</Mono>
                </div>
              </div>
              <Btn variant="primary" full onClick={()=>{setOrderStep(1);showToast("✓ Checked in at "+r.name);}}>📍 Check In Now</Btn>
            </Card>
          )}

          {orderStep === 1 && (
            <Card>
              <SecTitle label="Step 2" title="Outlet Survey"/>
              {[
                ["Cooler status?", r.hasCooler?"Operational":"No cooler",r.hasCooler?"green":"red"],
                ["Shelf facing?", "12 facings","green"],
                ["Competitors?", "PepsiCo 8 facings","yellow"],
                ["POSM displayed?", "2 danglers, 1 shelf strip","green"],
              ].map(([q,a,c],i) => (
                <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 0", borderBottom:i<3?`1px solid ${C.divider}`:"none" }}>
                  <Mono size={11}>{q}</Mono>
                  <Badge label={a} color={c}/>
                </div>
              ))}
              <div style={{ marginTop:14, display:"flex", gap:8 }}>
                <Btn variant="ghost" full onClick={()=>setOrderStep(0)}>← Back</Btn>
                <Btn variant="primary" full onClick={()=>{setOrderStep(2);setSurveyDone(true);showToast("Survey saved");}}>Save & Continue →</Btn>
              </div>
            </Card>
          )}

          {orderStep === 2 && (
            <div>
              <Card mb={10}>
                <SecTitle label="Step 3" title="Order Booking"/>
                <div style={{ display:"flex", flexDirection:"column", gap:0 }}>
                  {DATA.skus.slice(0,6).map((s,i) => {
                    const inCart = cart.find(c=>c.id===s.id);
                    return (
                      <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"10px 0", borderBottom:i<5?`1px solid ${C.divider}`:"none" }}>
                        <div style={{ flex:1 }}>
                          <div style={{ fontFamily:C.body, fontSize:12, fontWeight:600, color:C.white }}>{s.brand} {s.vol}{s.unit}</div>
                          <Mono size={10} color={C.muted}>{s.code} · ₹{s.ptd}/case · MRP ₹{s.mrp}</Mono>
                        </div>
                        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                          <button onClick={()=>setCart(p=>p.map(c=>c.id===s.id?{...c,qty:Math.max(0,c.qty-1)}:c).filter(c=>c.qty>0))} style={{ width:26,height:26,background:C.raised,border:`1px solid ${C.border}`,color:C.white,borderRadius:4,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center" }}>−</button>
                          <span style={{ fontFamily:C.mono, fontSize:13, color:C.white, minWidth:20, textAlign:"center" }}>{inCart?.qty||0}</span>
                          <button onClick={()=>setCart(p=>{const e=p.find(c=>c.id===s.id);return e?p.map(c=>c.id===s.id?{...c,qty:c.qty+1}:c):[...p,{...s,qty:1}];})} style={{ width:26,height:26,background:C.red,border:"none",color:"#fff",borderRadius:4,cursor:"pointer",fontSize:14,display:"flex",alignItems:"center",justifyContent:"center" }}>+</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>

              {/* Active scheme banner */}
              <div style={{ background:`linear-gradient(135deg, rgba(245,184,0,0.15), rgba(232,103,10,0.1))`, border:`1px solid rgba(245,184,0,0.3)`, borderRadius:8, padding:"10px 12px", marginBottom:10 }}>
                <div style={{ fontFamily:C.mono, fontSize:10, color:C.yellow, letterSpacing:"1px", marginBottom:3 }}>ACTIVE SCHEME</div>
                <div style={{ fontFamily:C.body, fontSize:12, color:C.white }}>Buy 5 cases Coca-Cola 750ml → Get 1 FREE 🎁</div>
              </div>

              {cart.length > 0 && (
                <Card style={{ borderTop:`2px solid ${C.red}` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <div>
                      <Mono size={10} color={C.muted}>CART TOTAL</Mono>
                      <div style={{ fontFamily:C.display, fontSize:20, fontWeight:700, color:C.white }}>
                        {rupee(cart.reduce((a,c)=>a+c.qty*c.ptd,0))}
                      </div>
                      <Mono size={10} color={C.muted}>{cart.length} SKUs · {cart.reduce((a,c)=>a+c.qty,0)} cases</Mono>
                    </div>
                    <Btn variant="primary" onClick={()=>{setOrderStep(3);showToast("Order placed! E-Invoice generating...");}} disabled={cart.length===0}>Confirm →</Btn>
                  </div>
                </Card>
              )}

              <div style={{ marginTop:10 }}>
                <Btn variant="ghost" full onClick={()=>setOrderStep(1)}>← Back to Survey</Btn>
              </div>
            </div>
          )}

          {orderStep === 3 && (
            <Card>
              <div style={{ textAlign:"center", padding:"10px 0 16px" }}>
                <div style={{ fontSize:40, marginBottom:8 }}>🧾</div>
                <div style={{ fontFamily:C.display, fontSize:18, fontWeight:700, color:C.white, marginBottom:4 }}>Invoice Generated!</div>
                <Mono size={11} color={C.green}>IRN: IRN-2025-{Math.floor(Math.random()*9000+1000)}</Mono>
              </div>
              <Div mb={12}/>
              {[["Gross Amount",rupee(cart.reduce((a,c)=>a+c.qty*c.ptd,0))],["Discount","—"],["CGST 6%",rupee(cart.reduce((a,c)=>a+c.qty*c.ptd,0)*0.06)],["SGST 6%",rupee(cart.reduce((a,c)=>a+c.qty*c.ptd,0)*0.06)],["Total",rupee(cart.reduce((a,c)=>a+c.qty*c.ptd,0)*1.12)]].map(([l,v],i)=>(
                <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"6px 0", borderBottom:i<4?`1px solid ${C.divider}`:"none" }}>
                  <Mono size={11} color={i===4?C.white:C.muted}>{l}</Mono>
                  <Mono size={11} bold={i===4} color={i===4?C.red:C.text}>{v}</Mono>
                </div>
              ))}
              <div style={{ display:"flex", gap:8, marginTop:14, flexWrap:"wrap" }}>
                <Btn variant="primary" onClick={()=>showToast("WhatsApp sent!")} size="sm">📱 WhatsApp</Btn>
                <Btn size="sm" onClick={()=>showToast("SMS sent!")}>💬 SMS</Btn>
                <Btn size="sm" onClick={()=>showToast("Printing...")}>🖨 Print</Btn>
                <Btn size="sm" variant="success" onClick={()=>setOrderStep(4)}>Next →</Btn>
              </div>
            </Card>
          )}

          {orderStep === 4 && (
            <Card>
              <div style={{ textAlign:"center", padding:"20px 0" }}>
                <div style={{ fontSize:48, marginBottom:12 }}>✅</div>
                <div style={{ fontFamily:C.display, fontSize:20, fontWeight:700, color:C.green, marginBottom:6 }}>Visit Complete!</div>
                <Mono size={11} color={C.muted}>Checked out at {new Date().toLocaleTimeString()}</Mono>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:14 }}>
                {[["Time Spent","18 min"],["Order Value",rupee(cart.reduce((a,c)=>a+c.qty*c.ptd,0)*1.12)],["Collection","₹0"],["Next Outlet",DATA.retailers[1]?.name||"Done"]].map(([l,v],i)=>(
                  <div key={i} style={{ background:C.surface, borderRadius:6, padding:"10px", textAlign:"center", border:`1px solid ${C.border}` }}>
                    <div style={{ fontFamily:C.display, fontSize:15, color:C.white, fontWeight:700 }}>{v}</div>
                    <Mono size={9} color={C.muted}>{l}</Mono>
                  </div>
                ))}
              </div>
              <Btn variant="primary" full onClick={()=>{setOrderStep(0);setCart([]);setSR(null);setActivePage("home");showToast("Moving to next outlet!");}}>
                → Next Outlet
              </Btn>
            </Card>
          )}
        </div>
      </div>
    );
  };

  // ── Collection Screen
  const CollectionScreen = () => {
    const [amount, setAmount] = useState("");
    const [mode, setMode]     = useState("upi");
    return (
      <div style={{ padding:"14px 14px 80px" }}>
        <button onClick={()=>setActivePage("home")} style={{ background:"none",border:"none",color:C.muted,fontFamily:C.mono,fontSize:11,cursor:"pointer",padding:"0 0 12px",display:"flex",alignItems:"center",gap:4 }}>← Back</button>
        <Card mb={12}>
          <SecTitle label="Collections" title="Record Payment"/>
          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            <div>
              <Mono size={10} color={C.muted}>SELECT DISTRIBUTOR / RETAILER</Mono>
              <select style={{ width:"100%",background:C.panel,border:`1px solid ${C.border}`,color:C.white,fontFamily:C.mono,fontSize:12,padding:"8px 10px",borderRadius:4,marginTop:4 }}>
                {DATA.distributors.filter(d=>d.outstanding>0).map(d=>(
                  <option key={d.id} value={d.id}>{d.name} · Due: {rupee(d.outstanding)}</option>
                ))}
              </select>
            </div>
            <Input label="Amount (₹)" type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Enter amount" icon="₹"/>
            <div>
              <Mono size={10} color={C.muted}>PAYMENT MODE</Mono>
              <div style={{ display:"flex", gap:6, marginTop:6, flexWrap:"wrap" }}>
                {[["upi","📱 UPI"],["cash","💵 Cash"],["cheque","🏦 Cheque"],["neft","🔄 NEFT"]].map(([v,l])=>(
                  <button key={v} onClick={()=>setMode(v)} style={{ padding:"6px 12px",background:mode===v?C.red:C.raised,color:mode===v?"#fff":C.muted,border:`1px solid ${mode===v?C.red:C.border}`,borderRadius:4,fontFamily:C.mono,fontSize:11,cursor:"pointer" }}>{l}</button>
                ))}
              </div>
            </div>
            {mode==="cheque"&&<Input label="Cheque No." placeholder="CHQXXXX"/>}
            <Btn variant="primary" full size="lg" onClick={()=>{showToast(`₹${amount||0} collected via ${mode.toUpperCase()}!`);setAmount("");}}>
              ✓ Confirm Collection
            </Btn>
          </div>
        </Card>
      </div>
    );
  };

  // ── Market Intel Screen
  const IntelScreen = () => (
    <div style={{ padding:"14px 14px 80px" }}>
      <button onClick={()=>setActivePage("home")} style={{ background:"none",border:"none",color:C.muted,fontFamily:C.mono,fontSize:11,cursor:"pointer",padding:"0 0 12px",display:"flex",alignItems:"center",gap:4 }}>← Back</button>
      <Card>
        <SecTitle label="Market Intelligence" title="Log Competitor Activity"/>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          <div>
            <Mono size={10} color={C.muted}>OUTLET</Mono>
            <select style={{ width:"100%",background:C.panel,border:`1px solid ${C.border}`,color:C.white,fontFamily:C.mono,fontSize:12,padding:"8px 10px",borderRadius:4,marginTop:4 }}>
              {DATA.retailers.map(r=><option key={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div>
            <Mono size={10} color={C.muted}>COMPETITOR</Mono>
            <div style={{ display:"flex",gap:6,marginTop:6 }}>
              {["PepsiCo","Parle Agro","Bisleri","Other"].map(c=>(
                <button key={c} style={{ padding:"5px 10px",background:C.raised,color:C.muted,border:`1px solid ${C.border}`,borderRadius:4,fontFamily:C.mono,fontSize:10,cursor:"pointer" }}>{c}</button>
              ))}
            </div>
          </div>
          <Input label="SKU Observed" placeholder="e.g. Pepsi 2L PET"/>
          <Input label="Price Observed (₹ MRP)" type="number" placeholder="115"/>
          <Input label="Facings / Shelf Space" type="number" placeholder="8"/>
          <div>
            <Mono size={10} color={C.muted} style={{display:"block",marginBottom:6}}>PHOTO EVIDENCE</Mono>
            <div style={{ background:C.surface,border:`2px dashed ${C.border}`,borderRadius:8,padding:"24px",textAlign:"center",cursor:"pointer" }} onClick={()=>showToast("Camera opened")}>
              <div style={{ fontSize:28,marginBottom:4 }}>📷</div>
              <Mono size={11} color={C.muted}>Tap to capture photo</Mono>
            </div>
          </div>
          <Btn variant="primary" full onClick={()=>showToast("Market intelligence logged!")}>Submit Report</Btn>
        </div>
      </Card>
    </div>
  );

  // ── Target Screen
  const TargetScreen = () => (
    <div style={{ padding:"14px 14px 80px" }}>
      <div style={{ fontFamily:C.display,fontSize:18,fontWeight:700,color:C.white,marginBottom:14 }}>My Targets — Today</div>
      {[
        {label:"Outlet Visits",current:sm.visitsToday,target:sm.visitTarget,unit:"outlets",c:C.blue},
        {label:"Orders Booked",current:sm.ordersToday,target:Math.floor(sm.visitTarget*0.75),unit:"orders",c:C.teal},
        {label:"Order Value",current:sm.valueToday/10000,target:150,unit:"₹ (×10K)",c:C.green},
        {label:"Collection",current:sm.collection/10000,target:120,unit:"₹ (×10K)",c:C.purple},
        {label:"Beat Coverage",current:82,target:90,unit:"%",c:C.yellow},
      ].map((t,i)=>(
        <Card key={i} mb={8}>
          <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
            <div style={{ fontFamily:C.body,fontSize:13,fontWeight:600,color:C.white }}>{t.label}</div>
            <div>
              <span style={{ fontFamily:C.display,fontSize:18,color:t.c }}>{t.current}</span>
              <span style={{ fontFamily:C.mono,fontSize:11,color:C.muted }}>/{t.target} {t.unit}</span>
            </div>
          </div>
          <ProgressBar pct={Math.round(t.current/t.target*100)} color={t.c} height={8}/>
          <Mono size={10} color={C.muted} style={{marginTop:4,display:"block"}}>{Math.round(t.current/t.target*100)}% achieved</Mono>
        </Card>
      ))}
    </div>
  );

  // ── Mobile Nav
  const MobileNav = () => {
    const items = [
      {id:"home",icon:"⬡",label:"Home"},
      {id:"beat",icon:"📍",label:"Beat"},
      {id:"order",icon:"📋",label:"Order"},
      {id:"collection",icon:"💰",label:"Collect"},
      {id:"targets",icon:"🎯",label:"Targets"},
    ];
    return (
      <div style={{ position:"fixed",bottom:0,left:0,right:0,width:W,maxWidth:W,margin:"0 auto",background:C.surface,borderTop:`1px solid ${C.border}`,display:"flex",height:64,zIndex:100 }}>
        {items.map(it=>(
          <button key={it.id} onClick={()=>setActivePage(it.id)} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:3,background:"transparent",border:"none",cursor:"pointer",borderTop:`2px solid ${activePage===it.id?C.red:"transparent"}`,transition:"all 0.15s" }}>
            <span style={{ fontSize:18,opacity:activePage===it.id?1:0.4 }}>{it.icon}</span>
            <Mono size={9} color={activePage===it.id?C.red:C.muted}>{it.label}</Mono>
          </button>
        ))}
      </div>
    );
  };

  // ── Mobile Top Bar
  const TopBar = () => (
    <div style={{ height:52,background:C.surface,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",padding:"0 14px",gap:10,flexShrink:0 }}>
      <div style={{ width:28,height:28,borderRadius:"50%",background:C.red,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 0 12px ${C.redGlow}` }}>
        <span style={{ fontFamily:C.mono,fontSize:9,fontWeight:700,color:"#fff" }}>CC</span>
      </div>
      <div style={{ flex:1 }}>
        <div style={{ fontFamily:C.display,fontSize:14,fontWeight:700,color:C.white }}>Coca-Cola DMS · SFA</div>
        <Mono size={9} color={C.muted}>{authUser.name} · {sm.territory}</Mono>
      </div>
      <div style={{ display:"flex",alignItems:"center",gap:6 }}>
        <div style={{ width:6,height:6,borderRadius:"50%",background:C.green,animation:"pulse 2s infinite" }}/>
        <Mono size={9} color={C.green}>LIVE</Mono>
      </div>
      <button onClick={()=>showToast("Syncing with server...")} style={{ background:"none",border:`1px solid ${C.border}`,color:C.muted,fontFamily:C.mono,fontSize:9,cursor:"pointer",padding:"3px 7px",borderRadius:3 }}>⟳ SYNC</button>
      <button onClick={switchToAdmin} style={{ background:"none",border:`1px solid ${C.border}`,color:C.muted,fontFamily:C.mono,fontSize:9,cursor:"pointer",padding:"3px 7px",borderRadius:3 }}>💻</button>
    </div>
  );

  const screens = {
    home: <HomeScreen/>,
    visit: <VisitScreen/>,
    beat: <VisitScreen/>,
    order: <VisitScreen/>,
    collection: <CollectionScreen/>,
    intel: <IntelScreen/>,
    targets: <TargetScreen/>,
  };

  return (
    <div style={{ display:"flex",alignItems:"center",justifyContent:"center",minHeight:"100vh",background:"#050504",padding:"20px" }}>
      {/* Mobile device frame */}
      <div style={{ width:W,height:H,maxHeight:812,background:C.bg,borderRadius:0,overflow:"hidden",display:"flex",flexDirection:"column",border:`1px solid ${C.border}`,boxShadow:"0 32px 80px rgba(0,0,0,0.8)",position:"relative" }}>
        <TopBar/>
        <div style={{ flex:1,overflowY:"auto",position:"relative" }}>
          {screens[activePage] || <HomeScreen/>}
        </div>
        <MobileNav/>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════════════ */
export default function App() {
  const app = useAppState();

  const switchToMobile = () => {
    app.setView("mobile");
    app.setMobilePage("home");
  };
  const switchToAdmin = () => {
    app.setView("admin");
    app.setAdminPage("dashboard");
  };

  return (
    <div>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${C.bg}; color: ${C.white}; font-family: ${C.body}; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.faint}; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: ${C.muted}; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        select option { background: ${C.card}; }
      `}</style>

      {/* Toast */}
      {app.toast && (
        <div style={{ position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",zIndex:9999,background:app.toast.type==="error"?C.red:C.green,color:"#fff",padding:"10px 20px",borderRadius:6,fontFamily:C.mono,fontSize:12,fontWeight:600,letterSpacing:"0.5px",boxShadow:"0 8px 24px rgba(0,0,0,0.4)",animation:"fadeIn 0.2s ease",whiteSpace:"nowrap",maxWidth:"90vw",textAlign:"center" }}>
          {app.toast.type!=="error"?"✓ ":""}{app.toast.msg}
        </div>
      )}

      {app.view === "login" && (
        <LoginScreen onLogin={app.login} showToast={app.showToast} />
      )}

      {app.view === "admin" && (
        <AdminApp
          authUser={app.authUser}
          onLogout={app.logout}
          activePage={app.adminPage}
          setActivePage={app.setAdminPage}
          switchToMobile={switchToMobile}
          showToast={app.showToast}
        />
      )}

      {app.view === "mobile" && (
        <MobileApp
          authUser={app.authUser}
          onLogout={app.logout}
          activePage={app.mobilePage}
          setActivePage={app.setMobilePage}
          switchToAdmin={switchToAdmin}
          showToast={app.showToast}
        />
      )}
    </div>
  );
}
