// ─── Nigeria Delivery Zones ─────────────────────────────────────────────────
// All prices in KOBO (naira × 100)
//
// Pricing based on 2025/2026 Nigerian logistics market rates:
// - Intra-city (Lagos, Abuja, PH): dispatch rider rates ₦1,200–₦3,500
// - Nearby states (Ogun, Oyo): ₦3,500–₦5,000
// - Mid-distance states (Rivers, Edo, Delta, Anambra, Enugu): ₦4,500–₦6,500
// - Far states (Kano, Kaduna, Plateau, Benue, Cross River): ₦6,500–₦9,500
// Sources: GIG Logistics Feb 2026 rates, Kwikpik 2025, VisCorner 2025

export const DELIVERY_ZONES = [
  {
    state: "Lagos",
    areas: [
      // Intra-Lagos — dispatch rider, same-day delivery
      { name: "Lagos Island / Victoria Island / Ikoyi",     price: 150000 }, // ₦1,500
      { name: "Lekki Phase 1",                              price: 180000 }, // ₦1,800
      { name: "Lekki Phase 2 / Ajah",                      price: 220000 }, // ₦2,200
      { name: "Yaba / Surulere / Sabo",                     price: 160000 }, // ₦1,600
      { name: "Ikeja / Maryland / Ojota",                   price: 200000 }, // ₦2,000
      { name: "Gbagada / Anthony / Palm Grove",             price: 190000 }, // ₦1,900
      { name: "Ikorodu",                                    price: 300000 }, // ₦3,000
      { name: "Badagry",                                    price: 400000 }, // ₦4,000
      { name: "Epe",                                        price: 450000 }, // ₦4,500
      { name: "Agege / Ogba / Ifako",                       price: 220000 }, // ₦2,200
      { name: "Oshodi / Isolo / Ejigbo",                    price: 200000 }, // ₦2,000
      { name: "Alimosho / Egbeda / Idimu",                  price: 250000 }, // ₦2,500
    ],
  },
  {
    state: "Abuja (FCT)",
    areas: [
      // Intra-Abuja — dispatch rider rates
      { name: "Central Business District (CBD)",            price: 200000 }, // ₦2,000
      { name: "Maitama / Asokoro",                          price: 200000 }, // ₦2,000
      { name: "Wuse / Wuse 2",                              price: 200000 }, // ₦2,000
      { name: "Garki / Garki 2",                            price: 200000 }, // ₦2,000
      { name: "Gwarinpa / Kubwa",                           price: 300000 }, // ₦3,000
      { name: "Lugbe / Dutse",                              price: 320000 }, // ₦3,200
      { name: "Kuje / Gwagwalada",                          price: 450000 }, // ₦4,500
      { name: "Nyanya / Karu",                              price: 300000 }, // ₦3,000
      { name: "Apo / Gudu",                                 price: 230000 }, // ₦2,300
    ],
  },
  {
    state: "Ogun",
    areas: [
      // Lagos-adjacent — courier 1–2 days, ~₦3,500–₦5,000
      { name: "Ota / Sango-Ota",                            price: 350000 }, // ₦3,500
      { name: "Sagamu / Remo North",                        price: 400000 }, // ₦4,000
      { name: "Abeokuta (State Capital)",                   price: 450000 }, // ₦4,500
      { name: "Ijebu-Ode",                                  price: 450000 }, // ₦4,500
    ],
  },
  {
    state: "Oyo",
    areas: [
      // Lagos to Ibadan ~₦4,000–₦5,000 (GIG Logistics 2026)
      { name: "Ibadan — Bodija / UI / Ring Road",           price: 450000 }, // ₦4,500
      { name: "Ibadan — Dugbe / Challenge",                 price: 450000 }, // ₦4,500
      { name: "Ibadan — Agodi / Iyaganku GRA",              price: 450000 }, // ₦4,500
      { name: "Ogbomosho",                                  price: 550000 }, // ₦5,500
      { name: "Oyo Town",                                   price: 550000 }, // ₦5,500
    ],
  },
  {
    state: "Rivers",
    areas: [
      // Lagos to PH ~₦4,500–₦6,000 (GIG Logistics 2026)
      { name: "Port Harcourt City / GRA",                   price: 500000 }, // ₦5,000
      { name: "Trans-Amadi / Rumuola",                      price: 500000 }, // ₦5,000
      { name: "Rumuomasi / Rumuokoro",                      price: 550000 }, // ₦5,500
      { name: "Obio-Akpor",                                 price: 600000 }, // ₦6,000
      { name: "Eleme / Oyigbo",                             price: 650000 }, // ₦6,500
    ],
  },
  {
    state: "Anambra",
    areas: [
      // South-East — ₦5,000–₦7,000
      { name: "Onitsha",                                    price: 500000 }, // ₦5,000
      { name: "Awka (State Capital)",                       price: 550000 }, // ₦5,500
      { name: "Nnewi",                                      price: 600000 }, // ₦6,000
    ],
  },
  {
    state: "Enugu",
    areas: [
      { name: "Enugu City / GRA / Independence Layout",     price: 550000 }, // ₦5,500
      { name: "Trans-Ekulu / Abakpa",                       price: 600000 }, // ₦6,000
    ],
  },
  {
    state: "Imo",
    areas: [
      { name: "Owerri — State Capital / GRA",               price: 550000 }, // ₦5,500
      { name: "Orlu / Okigwe",                              price: 650000 }, // ₦6,500
    ],
  },
  {
    state: "Abia",
    areas: [
      { name: "Aba",                                        price: 550000 }, // ₦5,500
      { name: "Umuahia (State Capital)",                    price: 600000 }, // ₦6,000
    ],
  },
  {
    state: "Delta",
    areas: [
      // South-South — ₦5,000–₦7,000
      { name: "Warri / Effurun",                            price: 550000 }, // ₦5,500
      { name: "Asaba",                                      price: 500000 }, // ₦5,000
      { name: "Sapele / Uvwie",                             price: 650000 }, // ₦6,500
    ],
  },
  {
    state: "Edo",
    areas: [
      { name: "Benin City — GRA / Sapele Road",             price: 500000 }, // ₦5,000
      { name: "Ekpoma / Auchi",                             price: 700000 }, // ₦7,000
    ],
  },
  {
    state: "Cross River",
    areas: [
      // Far South-South — ₦6,500–₦9,000
      { name: "Calabar (State Capital)",                    price: 650000 }, // ₦6,500
      { name: "Ikom",                                       price: 900000 }, // ₦9,000
    ],
  },
  {
    state: "Akwa Ibom",
    areas: [
      { name: "Uyo (State Capital)",                        price: 600000 }, // ₦6,000
      { name: "Eket / Ikot Ekpene",                         price: 700000 }, // ₦7,000
    ],
  },
  {
    state: "Kano",
    areas: [
      // Far North — Lagos to Kano ~₦7,000–₦9,500 (GIG Logistics 2026)
      { name: "Kano Central / Nasarawa GRA",                price: 750000 }, // ₦7,500
      { name: "Fagge / Sabon Gari",                         price: 750000 }, // ₦7,500
      { name: "Tarauni / Gwale",                            price: 800000 }, // ₦8,000
      { name: "Kumbotso / Dawakin Tofa",                    price: 850000 }, // ₦8,500
    ],
  },
  {
    state: "Kaduna",
    areas: [
      { name: "Kaduna South / Ungwan Rimi",                 price: 750000 }, // ₦7,500
      { name: "Zaria",                                      price: 800000 }, // ₦8,000
    ],
  },
  {
    state: "Kwara",
    areas: [
      // North-Central — ₦5,500–₦7,000
      { name: "Ilorin (State Capital)",                     price: 550000 }, // ₦5,500
      { name: "Offa / Erin-Ile",                            price: 700000 }, // ₦7,000
    ],
  },
  {
    state: "Kogi",
    areas: [
      { name: "Lokoja (State Capital)",                     price: 650000 }, // ₦6,500
    ],
  },
  {
    state: "Benue",
    areas: [
      { name: "Makurdi (State Capital)",                    price: 750000 }, // ₦7,500
    ],
  },
  {
    state: "Plateau",
    areas: [
      { name: "Jos (State Capital)",                        price: 750000 }, // ₦7,500
    ],
  },
  {
    state: "Ondo",
    areas: [
      { name: "Akure (State Capital)",                      price: 500000 }, // ₦5,000
      { name: "Ondo City",                                  price: 600000 }, // ₦6,000
    ],
  },
  {
    state: "Osun",
    areas: [
      { name: "Osogbo (State Capital)",                     price: 500000 }, // ₦5,000
      { name: "Ile-Ife / Ilesa",                            price: 550000 }, // ₦5,500
    ],
  },
  {
    state: "Ekiti",
    areas: [
      { name: "Ado-Ekiti (State Capital)",                  price: 550000 }, // ₦5,500
    ],
  },
];