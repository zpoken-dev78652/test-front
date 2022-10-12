export const curencyForSelect = [
  { label: "USDC", value: "USDC" },
  { label: "XNL", value: "XNL" },
];

export const category = [
  { label: "Cartoons", value: "Cartoons" },
  { label: "Movies", value: "Movies" },
  { label: "Games", value: "Games" },
  { label: "Music", value: "Music" },
  { label: "Pop Culture", value: "Pop Culture" },
  { label: "Other", value: "Other" },
];

export const itemTypes = [
  { label: "Cards", value: "Cards" },
  { label: "Stickers", value: "Stickers" },
  { label: "Figures", value: "Figures" },
  { label: "Other", value: "Other" },
];

export const rangePrice = [
  {
    label: "Under $10",
    value: "1",
    id: 1,
    max: 10,
  },
  {
    label: "$10 - $50",
    value: "2",
    id: 2,
    min: 10,
    max: 50,
  },
  {
    label: "$50 - $100",
    value: "3",
    id: 3,
    min: 50,
    max: 100,
  },
  {
    label: "$100 - $200",
    value: "4",
    id: 4,
    min: 100,
    max: 200,
  },
  {
    label: "$200 - $500",
    value: "5",
    id: 5,
    min: 200,
    max: 500,
  },
  {
    label: "$500 - $1000",
    value: "6",
    id: 6,
    min: 500,
    max: 1000,
  },
  {
    label: "$1000 and over",
    value: "7",
    id: 7,
    min: 1000,
  },
];

export const sortsInFilterinPage = [
  {
    value: "New to Old",
    text: "New to Old",
    label: "New to Old",
    sortDirection: "desc",
    sortField: "release_datetime_",
  },
  {
    value: "Old to New",
    text: "Old to New",
    label: "Old to New",
    sortDirection: "asc",
    sortField: "release_datetime_",
  },
  {
    value: "Low to high price",
    text: "Low to high price",
    label: "Low to high price",
    sortDirection: "asc",
    sortField: "price_",
  },
  {
    value: "High to low price",
    text: "High to low price",
    label: "High to low price",
    sortDirection: "desc",
    sortField: "price_",
  },
  {
    value: "Low to high circulation",
    text: "Low to high circulation",
    label: "Low to high circulation",
    sortDirection: "asc",
    sortField: "quantity_",
  },
  {
    value: "High to low circulation",
    text: "High to low circulation",
    label: "High to low circulation",
    sortDirection: "desc",
    sortField: "quantity_",
  },
  {
    value: "Low to high rarity",
    text: "Low to high rarity",
    label: "Low to high rarity",
    sortDirection: "asc",
    sortField: "rarity_",
  },
  {
    value: "High to low rarity",
    text: "High to low rarity",
    label: "High to low rarity",
    sortDirection: "desc",
    sortField: "rarity_",
  },
];

export const usCyti = [
  {
    label: "United States of America",
    value: "US",
  },
];

export const ibanCity = [
  {
    label: "Andorra",
    value: "AD",
  },
  {
    label: "Austria",
    value: "AT",
  },
  {
    label: "Azerbaijan",
    value: "AZ",
  },
  {
    label: "Belgium",
    value: "BE",
  },
  {
    label: "Bulgaria",
    value: "BG",
  },
  {
    label: "Croatia",
    value: "HR",
  },
  {
    label: "Denmark",
    value: "DK",
  },
  {
    label: "Estonia",
    value: "EE",
  },
  {
    label: "Finland",
    value: "FI",
  },
  {
    label: "France",
    value: "FR",
  },
  {
    label: "Germany",
    value: "DE",
  },
  {
    label: "Gibraltar",
    value: "GI",
  },
  {
    label: "Greece",
    value: "GR",
  },
  {
    label: "Guatemala",
    value: "GT",
  },
  {
    label: "Holy See",
    value: "VA",
  },
  {
    label: "Hungary",
    value: "HU",
  },
  {
    label: "Iceland",
    value: "IS",
  },
  {
    label: "Ireland",
    value: "IE",
  },
  {
    label: "Israel",
    value: "IL",
  },
  {
    label: "Italy",
    value: "IT",
  },
  {
    label: "Jordan",
    value: "JO",
  },
  {
    label: "Latvia",
    value: "LV",
  },
  {
    label: "Liechtenstein",
    value: "LI",
  },
  {
    label: "Lithuania",
    value: "LT",
  },
  {
    label: "Luxembourg",
    value: "LU",
  },
  {
    label: "Malta",
    value: "MT",
  },
  {
    label: "Monaco",
    value: "MC",
  },
  {
    label: "Netherlands",
    value: "NL",
  },
  {
    label: "Norway",
    value: "NO",
  },
  {
    label: "Poland",
    value: "PL",
  },
  {
    label: "Portugal",
    value: "PT",
  },
  {
    label: "Romania",
    value: "RO",
  },
  {
    label: "San Marino",
    value: "SM",
  },
  {
    label: "Slovakia",
    value: "SK",
  },
  {
    label: "Slovenia",
    value: "SI",
  },
  {
    label: "Spain",
    value: "ES",
  },
  {
    label: "Sweden",
    value: "SE",
  },
  {
    label: "Switzerland",
    value: "CH",
  },
  {
    label: "Turkey",
    value: "TR",
  },
  {
    label: "United Arab Emirates",
    value: "AE",
  },
  {
    label: "United Kingdom",
    value: "GB",
  },
  {
    label: "Virgin Islands (British)",
    value: "VG",
  },
];

export const swiftCity = [
  {
    label: "Angola",
    value: "AO",
  },
  {
    label: "Anguilla",
    value: "AI",
  },
  {
    label: "Argentina",
    value: "AR",
  },
  {
    label: "Australia",
    value: "AU",
  },
  {
    label: "Benin",
    value: "BJ",
  },
  {
    label: "Bermuda",
    value: "BM",
  },
  {
    label: "Brazil",
    value: "BR",
  },
  {
    label: "Burkina Faso",
    value: "BF",
  },
  {
    label: "Cambodia",
    value: "KH",
  },
  {
    label: "Cameroon",
    value: "CM",
  },
  {
    label: "Canada",
    value: "CA",
  },
  {
    label: "Cayman Islands",
    value: "KY",
  },
  {
    label: "Chad",
    value: "TD",
  },
  {
    label: "Chile",
    value: "CL",
  },
  {
    label: "Guam",
    value: "GU",
  },
  {
    label: "Guernsey",
    value: "GG",
  },
  {
    label: "Hong Kong",
    value: "HK",
  },
  {
    label: "India",
    value: "IN",
  },
  {
    label: "Indonesia",
    value: "ID",
  },
  {
    label: "Isle of Man",
    value: "IM",
  },
  {
    label: "Japan",
    value: "JP",
  },
  {
    label: "Jersey",
    value: "JE",
  },
  {
    label: "Kenya",
    value: "KE",
  },
  {
    label: "Korea",
    value: "KR",
  },
  {
    label: "Madagascar",
    value: "MG",
  },
  {
    label: "Malawi",
    value: "MW",
  },
  {
    label: "Malaysia",
    value: "MY",
  },
  {
    label: "Mexico",
    value: "MX",
  },
  {
    label: "Mozambique",
    value: "MZ",
  },
  {
    label: "New Zealand",
    value: "NZ",
  },
  {
    label: "Niger",
    value: "NE",
  },
  {
    label: "Peru",
    value: "PE",
  },
  {
    label: "Philippines",
    value: "PH",
  },
  {
    label: "Puerto Rico",
    value: "PR",
  },
  {
    label: "Senegal",
    value: "SN",
  },
  {
    label: "Singapore",
    value: "SG",
  },
  {
    label: "South Africa",
    value: "ZA",
  },
  {
    label: "Taiwan",
    value: "TW",
  },
  {
    label: "Tanzania",
    value: "TZ",
  },
  {
    label: "Thailand",
    value: "TH",
  },
  {
    label: "United States Outlying Islands",
    value: "UM",
  },
  {
    label: "Uzbekistan",
    value: "UZ",
  },
  {
    label: "Viet Nam",
    value: "VN",
  },
  {
    label: "Virgin Islands (U.S.)",
    value: "VI",
  },
];
