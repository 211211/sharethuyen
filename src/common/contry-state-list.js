/* Ref: https://gist.github.com/keeguon/2310008 */
const COUNTRIES = [
  {
    name: "Afghanistan",
    code: "AF"
  },
  {
    name: "Åland Islands",
    code: "AX"
  },
  {
    name: "Albania",
    code: "AL"
  },
  {
    name: "Algeria",
    code: "DZ"
  },
  {
    name: "American Samoa",
    code: "AS"
  },
  {
    name: "AndorrA",
    code: "AD"
  },
  {
    name: "Angola",
    code: "AO"
  },
  {
    name: "Anguilla",
    code: "AI"
  },
  {
    name: "Antarctica",
    code: "AQ"
  },
  {
    name: "Antigua and Barbuda",
    code: "AG"
  },
  {
    name: "Argentina",
    code: "AR"
  },
  {
    name: "Armenia",
    code: "AM"
  },
  {
    name: "Aruba",
    code: "AW"
  },
  {
    name: "Australia",
    code: "AU"
  },
  {
    name: "Austria",
    code: "AT"
  },
  {
    name: "Azerbaijan",
    code: "AZ"
  },
  {
    name: "Bahamas",
    code: "BS"
  },
  {
    name: "Bahrain",
    code: "BH"
  },
  {
    name: "Bangladesh",
    code: "BD"
  },
  {
    name: "Barbados",
    code: "BB"
  },
  {
    name: "Belarus",
    code: "BY"
  },
  {
    name: "Belgium",
    code: "BE"
  },
  {
    name: "Belize",
    code: "BZ"
  },
  {
    name: "Benin",
    code: "BJ"
  },
  {
    name: "Bermuda",
    code: "BM"
  },
  {
    name: "Bhutan",
    code: "BT"
  },
  {
    name: "Bolivia",
    code: "BO"
  },
  {
    name: "Bosnia and Herzegovina",
    code: "BA"
  },
  {
    name: "Botswana",
    code: "BW"
  },
  {
    name: "Bouvet Island",
    code: "BV"
  },
  {
    name: "Brazil",
    code: "BR"
  },
  {
    name: "British Indian Ocean Territory",
    code: "IO"
  },
  {
    name: "Brunei Darussalam",
    code: "BN"
  },
  {
    name: "Bulgaria",
    code: "BG"
  },
  {
    name: "Burkina Faso",
    code: "BF"
  },
  {
    name: "Burundi",
    code: "BI"
  },
  {
    name: "Cambodia",
    code: "KH"
  },
  {
    name: "Cameroon",
    code: "CM"
  },
  {
    name: "Canada",
    code: "CA"
  },
  {
    name: "Cape Verde",
    code: "CV"
  },
  {
    name: "Cayman Islands",
    code: "KY"
  },
  {
    name: "Central African Republic",
    code: "CF"
  },
  {
    name: "Chad",
    code: "TD"
  },
  {
    name: "Chile",
    code: "CL"
  },
  {
    name: "China",
    code: "CN"
  },
  {
    name: "Christmas Island",
    code: "CX"
  },
  {
    name: "Cocos (Keeling) Islands",
    code: "CC"
  },
  {
    name: "Colombia",
    code: "CO"
  },
  {
    name: "Comoros",
    code: "KM"
  },
  {
    name: "Congo",
    code: "CG"
  },
  {
    name: "Congo, The Democratic Republic of the",
    code: "CD"
  },
  {
    name: "Cook Islands",
    code: "CK"
  },
  {
    name: "Costa Rica",
    code: "CR"
  },
  {
    name: 'Cote D"Ivoire',
    code: "CI"
  },
  {
    name: "Croatia",
    code: "HR"
  },
  {
    name: "Cuba",
    code: "CU"
  },
  {
    name: "Cyprus",
    code: "CY"
  },
  {
    name: "Czech Republic",
    code: "CZ"
  },
  {
    name: "Denmark",
    code: "DK"
  },
  {
    name: "Djibouti",
    code: "DJ"
  },
  {
    name: "Dominica",
    code: "DM"
  },
  {
    name: "Dominican Republic",
    code: "DO"
  },
  {
    name: "Ecuador",
    code: "EC"
  },
  {
    name: "Egypt",
    code: "EG"
  },
  {
    name: "El Salvador",
    code: "SV"
  },
  {
    name: "Equatorial Guinea",
    code: "GQ"
  },
  {
    name: "Eritrea",
    code: "ER"
  },
  {
    name: "Estonia",
    code: "EE"
  },
  {
    name: "Ethiopia",
    code: "ET"
  },
  {
    name: "Falkland Islands (Malvinas)",
    code: "FK"
  },
  {
    name: "Faroe Islands",
    code: "FO"
  },
  {
    name: "Fiji",
    code: "FJ"
  },
  {
    name: "Finland",
    code: "FI"
  },
  {
    name: "France",
    code: "FR"
  },
  {
    name: "French Guiana",
    code: "GF"
  },
  {
    name: "French Polynesia",
    code: "PF"
  },
  {
    name: "French Southern Territories",
    code: "TF"
  },
  {
    name: "Gabon",
    code: "GA"
  },
  {
    name: "Gambia",
    code: "GM"
  },
  {
    name: "Georgia",
    code: "GE"
  },
  {
    name: "Germany",
    code: "DE"
  },
  {
    name: "Ghana",
    code: "GH"
  },
  {
    name: "Gibraltar",
    code: "GI"
  },
  {
    name: "Greece",
    code: "GR"
  },
  {
    name: "Greenland",
    code: "GL"
  },
  {
    name: "Grenada",
    code: "GD"
  },
  {
    name: "Guadeloupe",
    code: "GP"
  },
  {
    name: "Guam",
    code: "GU"
  },
  {
    name: "Guatemala",
    code: "GT"
  },
  {
    name: "Guernsey",
    code: "GG"
  },
  {
    name: "Guinea",
    code: "GN"
  },
  {
    name: "Guinea-Bissau",
    code: "GW"
  },
  {
    name: "Guyana",
    code: "GY"
  },
  {
    name: "Haiti",
    code: "HT"
  },
  {
    name: "Heard Island and Mcdonald Islands",
    code: "HM"
  },
  {
    name: "Holy See (Vatican City State)",
    code: "VA"
  },
  {
    name: "Honduras",
    code: "HN"
  },
  {
    name: "Hong Kong",
    code: "HK"
  },
  {
    name: "Hungary",
    code: "HU"
  },
  {
    name: "Iceland",
    code: "IS"
  },
  {
    name: "India",
    code: "IN"
  },
  {
    name: "Indonesia",
    code: "ID"
  },
  {
    name: "Iran, Islamic Republic Of",
    code: "IR"
  },
  {
    name: "Iraq",
    code: "IQ"
  },
  {
    name: "Ireland",
    code: "IE"
  },
  {
    name: "Isle of Man",
    code: "IM"
  },
  {
    name: "Israel",
    code: "IL"
  },
  {
    name: "Italy",
    code: "IT"
  },
  {
    name: "Jamaica",
    code: "JM"
  },
  {
    name: "Japan",
    code: "JP"
  },
  {
    name: "Jersey",
    code: "JE"
  },
  {
    name: "Jordan",
    code: "JO"
  },
  {
    name: "Kazakhstan",
    code: "KZ"
  },
  {
    name: "Kenya",
    code: "KE"
  },
  {
    name: "Kiribati",
    code: "KI"
  },
  {
    name: 'Korea, Democratic People"S Republic of',
    code: "KP"
  },
  {
    name: "Korea, Republic of",
    code: "KR"
  },
  {
    name: "Kuwait",
    code: "KW"
  },
  {
    name: "Kyrgyzstan",
    code: "KG"
  },
  {
    name: 'Lao People"S Democratic Republic',
    code: "LA"
  },
  {
    name: "Latvia",
    code: "LV"
  },
  {
    name: "Lebanon",
    code: "LB"
  },
  {
    name: "Lesotho",
    code: "LS"
  },
  {
    name: "Liberia",
    code: "LR"
  },
  {
    name: "Libyan Arab Jamahiriya",
    code: "LY"
  },
  {
    name: "Liechtenstein",
    code: "LI"
  },
  {
    name: "Lithuania",
    code: "LT"
  },
  {
    name: "Luxembourg",
    code: "LU"
  },
  {
    name: "Macao",
    code: "MO"
  },
  {
    name: "Macedonia, The Former Yugoslav Republic of",
    code: "MK"
  },
  {
    name: "Madagascar",
    code: "MG"
  },
  {
    name: "Malawi",
    code: "MW"
  },
  {
    name: "Malaysia",
    code: "MY"
  },
  {
    name: "Maldives",
    code: "MV"
  },
  {
    name: "Mali",
    code: "ML"
  },
  {
    name: "Malta",
    code: "MT"
  },
  {
    name: "Marshall Islands",
    code: "MH"
  },
  {
    name: "Martinique",
    code: "MQ"
  },
  {
    name: "Mauritania",
    code: "MR"
  },
  {
    name: "Mauritius",
    code: "MU"
  },
  {
    name: "Mayotte",
    code: "YT"
  },
  {
    name: "Mexico",
    code: "MX"
  },
  {
    name: "Micronesia, Federated States of",
    code: "FM"
  },
  {
    name: "Moldova, Republic of",
    code: "MD"
  },
  {
    name: "Monaco",
    code: "MC"
  },
  {
    name: "Mongolia",
    code: "MN"
  },
  {
    name: "Montserrat",
    code: "MS"
  },
  {
    name: "Morocco",
    code: "MA"
  },
  {
    name: "Mozambique",
    code: "MZ"
  },
  {
    name: "Myanmar",
    code: "MM"
  },
  {
    name: "Namibia",
    code: "NA"
  },
  {
    name: "Nauru",
    code: "NR"
  },
  {
    name: "Nepal",
    code: "NP"
  },
  {
    name: "Netherlands",
    code: "NL"
  },
  {
    name: "Netherlands Antilles",
    code: "AN"
  },
  {
    name: "New Caledonia",
    code: "NC"
  },
  {
    name: "New Zealand",
    code: "NZ"
  },
  {
    name: "Nicaragua",
    code: "NI"
  },
  {
    name: "Niger",
    code: "NE"
  },
  {
    name: "Nigeria",
    code: "NG"
  },
  {
    name: "Niue",
    code: "NU"
  },
  {
    name: "Norfolk Island",
    code: "NF"
  },
  {
    name: "Northern Mariana Islands",
    code: "MP"
  },
  {
    name: "Norway",
    code: "NO"
  },
  {
    name: "Oman",
    code: "OM"
  },
  {
    name: "Pakistan",
    code: "PK"
  },
  {
    name: "Palau",
    code: "PW"
  },
  {
    name: "Palestinian Territory, Occupied",
    code: "PS"
  },
  {
    name: "Panama",
    code: "PA"
  },
  {
    name: "Papua New Guinea",
    code: "PG"
  },
  {
    name: "Paraguay",
    code: "PY"
  },
  {
    name: "Peru",
    code: "PE"
  },
  {
    name: "Philippines",
    code: "PH"
  },
  {
    name: "Pitcairn",
    code: "PN"
  },
  {
    name: "Poland",
    code: "PL"
  },
  {
    name: "Portugal",
    code: "PT"
  },
  {
    name: "Puerto Rico",
    code: "PR"
  },
  {
    name: "Qatar",
    code: "QA"
  },
  {
    name: "Reunion",
    code: "RE"
  },
  {
    name: "Romania",
    code: "RO"
  },
  {
    name: "Russian Federation",
    code: "RU"
  },
  {
    name: "RWANDA",
    code: "RW"
  },
  {
    name: "Saint Helena",
    code: "SH"
  },
  {
    name: "Saint Kitts and Nevis",
    code: "KN"
  },
  {
    name: "Saint Lucia",
    code: "LC"
  },
  {
    name: "Saint Pierre and Miquelon",
    code: "PM"
  },
  {
    name: "Saint Vincent and the Grenadines",
    code: "VC"
  },
  {
    name: "Samoa",
    code: "WS"
  },
  {
    name: "San Marino",
    code: "SM"
  },
  {
    name: "Sao Tome and Principe",
    code: "ST"
  },
  {
    name: "Saudi Arabia",
    code: "SA"
  },
  {
    name: "Senegal",
    code: "SN"
  },
  {
    name: "Serbia and Montenegro",
    code: "CS"
  },
  {
    name: "Seychelles",
    code: "SC"
  },
  {
    name: "Sierra Leone",
    code: "SL"
  },
  {
    name: "Singapore",
    code: "SG"
  },
  {
    name: "Slovakia",
    code: "SK"
  },
  {
    name: "Slovenia",
    code: "SI"
  },
  {
    name: "Solomon Islands",
    code: "SB"
  },
  {
    name: "Somalia",
    code: "SO"
  },
  {
    name: "South Africa",
    code: "ZA"
  },
  {
    name: "South Georgia and the South Sandwich Islands",
    code: "GS"
  },
  {
    name: "Spain",
    code: "ES"
  },
  {
    name: "Sri Lanka",
    code: "LK"
  },
  {
    name: "Sudan",
    code: "SD"
  },
  {
    name: "Suriname",
    code: "SR"
  },
  {
    name: "Svalbard and Jan Mayen",
    code: "SJ"
  },
  {
    name: "Swaziland",
    code: "SZ"
  },
  {
    name: "Sweden",
    code: "SE"
  },
  {
    name: "Switzerland",
    code: "CH"
  },
  {
    name: "Syrian Arab Republic",
    code: "SY"
  },
  {
    name: "Taiwan, Province of China",
    code: "TW"
  },
  {
    name: "Tajikistan",
    code: "TJ"
  },
  {
    name: "Tanzania, United Republic of",
    code: "TZ"
  },
  {
    name: "Thailand",
    code: "TH"
  },
  {
    name: "Timor-Leste",
    code: "TL"
  },
  {
    name: "Togo",
    code: "TG"
  },
  {
    name: "Tokelau",
    code: "TK"
  },
  {
    name: "Tonga",
    code: "TO"
  },
  {
    name: "Trinidad and Tobago",
    code: "TT"
  },
  {
    name: "Tunisia",
    code: "TN"
  },
  {
    name: "Turkey",
    code: "TR"
  },
  {
    name: "Turkmenistan",
    code: "TM"
  },
  {
    name: "Turks and Caicos Islands",
    code: "TC"
  },
  {
    name: "Tuvalu",
    code: "TV"
  },
  {
    name: "Uganda",
    code: "UG"
  },
  {
    name: "Ukraine",
    code: "UA"
  },
  {
    name: "United Arab Emirates",
    code: "AE"
  },
  {
    name: "United Kingdom",
    code: "GB"
  },
  {
    name: "United States",
    code: "US"
  },
  {
    name: "United States Minor Outlying Islands",
    code: "UM"
  },
  {
    name: "Uruguay",
    code: "UY"
  },
  {
    name: "Uzbekistan",
    code: "UZ"
  },
  {
    name: "Vanuatu",
    code: "VU"
  },
  {
    name: "Venezuela",
    code: "VE"
  },
  {
    name: "Viet Nam",
    code: "VN"
  },
  {
    name: "Virgin Islands, British",
    code: "VG"
  },
  {
    name: "Virgin Islands, U.S.",
    code: "VI"
  },
  {
    name: "Wallis and Futuna",
    code: "WF"
  },
  {
    name: "Western Sahara",
    code: "EH"
  },
  {
    name: "Yemen",
    code: "YE"
  },
  {
    name: "Zambia",
    code: "ZM"
  },
  {
    name: "Zimbabwe",
    code: "ZW"
  }
];

/* Ref: https://github.com/substack/provinces/blob/master/provinces.json */
const STATES = [
  {
    short: "AL",
    name: "Alabama",
    country: "US"
  },
  {
    short: "AK",
    name: "Alaska",
    country: "US"
  },
  {
    short: "AS",
    name: "American Samoa",
    country: "US"
  },
  {
    short: "AZ",
    name: "Arizona",
    country: "US"
  },
  {
    short: "AR",
    name: "Arkansas",
    country: "US"
  },
  {
    short: "CA",
    name: "California",
    country: "US"
  },
  {
    short: "CO",
    name: "Colorado",
    country: "US"
  },
  {
    short: "CT",
    name: "Connecticut",
    country: "US"
  },
  {
    short: "DE",
    name: "Delaware",
    country: "US"
  },
  {
    short: "DC",
    name: "District of Columbia",
    country: "US"
  },
  {
    short: "FL",
    name: "Florida",
    country: "US"
  },
  {
    short: "GA",
    name: "Georgia",
    country: "US"
  },
  {
    short: "GU",
    name: "Guam",
    country: "US"
  },
  {
    short: "HI",
    name: "Hawaii",
    country: "US"
  },
  {
    short: "ID",
    name: "Idaho",
    country: "US"
  },
  {
    short: "IL",
    name: "Illinois",
    country: "US"
  },
  {
    short: "IN",
    name: "Indiana",
    country: "US"
  },
  {
    short: "IA",
    name: "Iowa",
    country: "US"
  },
  {
    short: "KS",
    name: "Kansas",
    country: "US"
  },
  {
    short: "KY",
    name: "Kentucky",
    country: "US"
  },
  {
    short: "LA",
    name: "Louisiana",
    country: "US"
  },
  {
    short: "ME",
    name: "Maine",
    country: "US"
  },
  {
    short: "MD",
    name: "Maryland",
    country: "US"
  },
  {
    short: "MA",
    name: "Massachusetts",
    country: "US"
  },
  {
    short: "MI",
    name: "Michigan",
    country: "US"
  },
  {
    short: "MN",
    name: "Minnesota",
    country: "US"
  },
  {
    short: "MS",
    name: "Mississippi",
    country: "US"
  },
  {
    short: "MO",
    name: "Missouri",
    country: "US"
  },
  {
    short: "MT",
    name: "Montana",
    country: "US"
  },
  {
    short: "NE",
    name: "Nebraska",
    country: "US"
  },
  {
    short: "NV",
    name: "Nevada",
    country: "US"
  },
  {
    short: "NH",
    name: "New Hampshire",
    country: "US"
  },
  {
    short: "NJ",
    name: "New Jersey",
    country: "US"
  },
  {
    short: "NM",
    name: "New Mexico",
    country: "US"
  },
  {
    short: "NY",
    name: "New York",
    country: "US"
  },
  {
    short: "NC",
    name: "North Carolina",
    country: "US"
  },
  {
    short: "ND",
    name: "North Dakota",
    country: "US"
  },
  {
    short: "MP",
    name: "Northern Mariana Islands",
    country: "US"
  },
  {
    short: "OH",
    name: "Ohio",
    country: "US"
  },
  {
    short: "OK",
    name: "Oklahoma",
    country: "US"
  },
  {
    short: "OR",
    name: "Oregon",
    country: "US"
  },
  {
    short: "PA",
    name: "Pennsylvania",
    country: "US"
  },
  {
    short: "PR",
    name: "Puerto Rico",
    country: "US"
  },
  {
    short: "RI",
    name: "Rhode Island",
    country: "US"
  },
  {
    short: "SC",
    name: "South Carolina",
    country: "US"
  },
  {
    short: "SD",
    name: "South Dakota",
    country: "US"
  },
  {
    short: "TN",
    name: "Tennessee",
    country: "US"
  },
  {
    short: "TX",
    name: "Texas",
    country: "US"
  },
  {
    short: "UM",
    name: "United States Minor Outlying Islands",
    country: "US"
  },
  {
    short: "UT",
    name: "Utah",
    country: "US"
  },
  {
    short: "VT",
    name: "Vermont",
    country: "US"
  },
  {
    short: "VI",
    name: "Virgin Islands",
    country: "US"
  },
  {
    short: "VA",
    name: "Virginia",
    country: "US"
  },
  {
    short: "WA",
    name: "Washington",
    country: "US"
  },
  {
    short: "WV",
    name: "West Virginia",
    country: "US"
  },
  {
    short: "WI",
    name: "Wisconsin",
    country: "US"
  },
  {
    short: "WY",
    name: "Wyoming",
    country: "US"
  },
  {
    short: "AB",
    name: "Alberta",
    country: "CA"
  },
  {
    short: "BC",
    name: "British Columbia",
    country: "CA"
  },
  {
    short: "MB",
    name: "Manitoba",
    country: "CA"
  },
  {
    short: "NB",
    name: "New Brunswick",
    country: "CA"
  },
  {
    short: "NL",
    name: "Newfoundland and Labrador",
    country: "CA",
    alt: ["Newfoundland", "Labrador"]
  },
  {
    short: "NT",
    name: "Northwest Territories",
    country: "CA"
  },
  {
    short: "NS",
    name: "Nova Scotia",
    country: "CA"
  },
  {
    short: "NU",
    name: "Nunavut",
    country: "CA"
  },
  {
    short: "ON",
    name: "Ontario",
    country: "CA"
  },
  {
    short: "PE",
    name: "Prince Edward Island",
    country: "CA"
  },
  {
    short: "QC",
    name: "Quebec",
    country: "CA"
  },
  {
    short: "SK",
    name: "Saskatchewan",
    country: "CA"
  },
  {
    short: "YT",
    name: "Yukon",
    country: "CA"
  },
  {
    name: "Ashmore and Cartier Islands",
    country: "AU"
  },
  {
    name: "Australian Antarctic Territory",
    country: "AU"
  },
  {
    short: "ACT",
    name: "Australian Capital Territory",
    country: "AU"
  },
  {
    short: "CX",
    name: "Christmas Island",
    country: "AU"
  },
  {
    short: "CC",
    name: "Cocos Islands",
    alt: ["Keeling Islands"],
    country: "AU"
  },
  {
    name: "Coral Sea Islands",
    country: "AU"
  },
  {
    short: "HM",
    name: "Heard Island and McDonald Islands",
    country: "AU"
  },
  {
    short: "JBT",
    name: "Jervis Bay Territory",
    country: "AU"
  },
  {
    short: "NSW",
    name: "New South Wales",
    country: "AU"
  },
  {
    short: "NF",
    name: "Norfolk Island",
    country: "AU"
  },
  {
    short: "NT",
    name: "Northern Territory",
    country: "AU"
  },
  {
    short: "QLD",
    name: "Queensland",
    country: "AU"
  },
  {
    short: "SA",
    name: "South Australia",
    country: "AU"
  },
  {
    short: "TAS",
    name: "Tasmania",
    country: "AU"
  },
  {
    short: "VIC",
    name: "Victoria",
    country: "AU"
  },
  {
    short: "WA",
    name: "Western Australia",
    country: "AU"
  },
  {
    name: "Aguascalientes",
    short: "AG",
    alt: ["AGS"],
    country: "MX"
  },
  {
    name: "Baja California",
    short: "BC",
    alt: ["BCN"],
    country: "MX"
  },
  {
    name: "Baja California Sur",
    short: "BS",
    alt: ["BCS"],
    country: "MX"
  },
  {
    name: "Campeche",
    short: "CM",
    alt: ["Camp", "CAM"],
    country: "MX"
  },
  {
    name: "Chiapas",
    short: "CS",
    alt: ["Chis", "CHP"],
    country: "MX"
  },
  {
    name: "Chihuahua",
    short: "CH",
    alt: ["Chih", "CHH"],
    country: "MX"
  },
  {
    name: "Coahuila",
    short: "MX",
    alt: ["Coah", "COA"],
    country: "MX"
  },
  {
    name: "Colima",
    short: "CL",
    alt: ["COL"],
    country: "MX"
  },
  {
    name: "Durango",
    short: "DG",
    alt: ["Dgo", "DUR"],
    country: "MX"
  },
  {
    name: "Federal District",
    short: "DF",
    alt: ["DIF"],
    country: "MX"
  },
  {
    name: "Guanajuato",
    short: "GT",
    alt: ["Gto", "GUA"],
    country: "MX"
  },
  {
    name: "Guerrero",
    short: "GR",
    alt: ["Gro", "GRO"],
    country: "MX"
  },
  {
    name: "Hidalgo",
    short: "HG",
    alt: ["Hgo", "HID"],
    country: "MX"
  },
  {
    name: "Jalisco",
    short: "JA",
    alt: ["Jal", "JAL"],
    country: "MX"
  },
  {
    name: "Mexico",
    short: "ME",
    alt: ["Edomex", "MEX"],
    country: "MX"
  },
  {
    name: "Michoacán",
    short: "MI",
    alt: ["Mich", "MIC"],
    country: "MX"
  },
  {
    name: "Morelos",
    short: "MO",
    alt: ["Mor", "MOR"],
    country: "MX"
  },
  {
    name: "Nayarit",
    short: "NA",
    alt: ["Nay", "NAY"],
    country: "MX"
  },
  {
    name: "Nuevo León",
    short: "NL",
    alt: ["NLE"],
    country: "MX"
  },
  {
    name: "Oaxaca",
    short: "OA",
    alt: ["Oax", "OAX"],
    country: "MX"
  },
  {
    name: "Puebla",
    short: "PU",
    alt: ["Pue", "PUE"],
    country: "MX"
  },
  {
    name: "Querétaro",
    short: "QE",
    alt: ["Qro", "QUE"],
    country: "MX"
  },
  {
    name: "Quintana Roo",
    short: "QR",
    alt: ["Q Roo", "ROO"],
    country: "MX"
  },
  {
    name: "San Luis Potosí",
    short: "SL",
    alt: ["SLP"],
    country: "MX"
  },
  {
    name: "Sinaloa",
    short: "SI",
    alt: ["SIN"],
    country: "MX"
  },
  {
    name: "Sonora",
    short: "SO",
    alt: ["SON"],
    country: "MX"
  },
  {
    name: "Tabasco",
    short: "TB",
    alt: ["TAB"],
    country: "MX"
  },
  {
    name: "Tamaulipas",
    short: "TM",
    alt: ["Tamps", "TAM"],
    country: "MX"
  },
  {
    name: "Tlaxcala",
    short: "TL",
    alt: ["Tlax", "TLA"],
    country: "MX"
  },
  {
    name: "Veracruz",
    short: "VE",
    alt: ["VER"],
    country: "MX"
  },
  {
    name: "Yucatán",
    short: "YU",
    alt: ["YUC"],
    country: "MX"
  },
  {
    name: "Zacatecas",
    short: "ZA",
    alt: ["ZAC"],
    country: "MX"
  },
  {
    name: "上海",
    short: "沪",
    country: "CN"
  },
  {
    name: "云南",
    short: "滇",
    country: "CN"
  },
  {
    name: "内蒙古",
    short: "蒙",
    country: "CN"
  },
  {
    name: "北京",
    short: "京",
    country: "CN"
  },
  {
    name: "台湾",
    short: "台",
    country: "CN"
  },
  {
    name: "吉林",
    short: "吉",
    country: "CN"
  },
  {
    name: "四川",
    short: "川",
    country: "CN"
  },
  {
    name: "天津",
    short: "津",
    country: "CN"
  },
  {
    name: "宁夏",
    short: "宁",
    country: "CN"
  },
  {
    name: "安徽",
    short: "皖",
    country: "CN"
  },
  {
    name: "山东",
    short: "鲁",
    country: "CN"
  },
  {
    name: "山西",
    short: "晋",
    country: "CN"
  },
  {
    name: "广东",
    short: "粤",
    country: "CN"
  },
  {
    name: "广西",
    short: "桂",
    country: "CN"
  },
  {
    name: "新疆",
    short: "新",
    country: "CN"
  },
  {
    name: "江苏",
    short: "苏",
    country: "CN"
  },
  {
    name: "江西",
    short: "赣",
    country: "CN"
  },
  {
    name: "河北",
    short: "冀",
    country: "CN"
  },
  {
    name: "河南",
    short: "豫",
    country: "CN"
  },
  {
    name: "浙江",
    short: "浙",
    country: "CN"
  },
  {
    name: "海南",
    short: "琼",
    country: "CN"
  },
  {
    name: "湖北",
    short: "鄂",
    country: "CN"
  },
  {
    name: "湖南",
    short: "湘",
    country: "CN"
  },
  {
    name: "澳门",
    short: "澳",
    country: "CN"
  },
  {
    name: "甘肃",
    short: "甘",
    country: "CN"
  },
  {
    name: "福建",
    short: "闽",
    country: "CN"
  },
  {
    name: "西藏",
    short: "藏",
    country: "CN"
  },
  {
    name: "贵州",
    short: "黔",
    country: "CN"
  },
  {
    name: "辽宁",
    short: "辽",
    country: "CN"
  },
  {
    name: "重庆",
    short: "渝",
    country: "CN"
  },
  {
    name: "陕西",
    short: "陕",
    country: "CN"
  },
  {
    name: "青海",
    short: "青",
    country: "CN"
  },
  {
    name: "香港",
    short: "港",
    country: "CN"
  },
  {
    name: "黑龙江",
    short: "黑",
    country: "CN"
  },
  {
    name: "Aberdeen City",
    country: "GB",
    region: "Scotland"
  },
  {
    name: "Aberdeenshire",
    country: "GB",
    region: "Scotland"
  },
  {
    name: "Angus",
    country: "GB",
    region: "Scotland"
  },
  {
    name: "Antrim",
    country: "GB",
    region: "Northern Ireland"
  },
  {
    name: "Argyll and Bute",
    country: "GB",
    region: "Scotland"
  },
  {
    name: "Armagh",
    country: "GB",
    region: "Scotland"
  },
  {
    name: "Avon",
    country: "GB",
    region: "England"
  },
  {
    name: "Bedfordshire",
    country: "GB",
    region: "England"
  },
  {
    name: "Berkshire",
    country: "GB",
    region: "England"
  },
  {
    name: "Blaenau Gwent",
    country: "GB",
    region: "Wales"
  },
  {
    name: "Borders",
    country: "GB",
    region: "England"
  },
  {
    name: "Bridgend",
    country: "GB",
    region: "Wales"
  },
  {
    name: "Bristol",
    country: "GB",
    region: "England"
  },
  {
    name: "Buckinghamshire",
    country: "GB",
    region: "England"
  },
  {
    name: "Caerphilly",
    country: "GB",
    region: "Wales"
  },
  {
    name: "Cambridgeshire",
    country: "GB",
    region: "England"
  },
  {
    name: "Cardiff",
    country: "GB",
    region: "Wales"
  },
  {
    name: "Carmarthenshire",
    country: "GB",
    region: "Scotland"
  },
  {
    name: "Ceredigion",
    country: "GB",
    region: "Wales"
  },
  {
    name: "Channel Islands",
    country: "GB",
    region: "England"
  },
  {
    name: "Cheshire",
    country: "GB",
    region: "England"
  },
  {
    name: "Clackmannan",
    country: "GB",
    region: "Scotland"
  },
  {
    name: "Cleveland",
    country: "GB",
    region: "England"
  },
  {
    name: "Conwy",
    country: "GB",
    region: "Wales"
  },
  {
    name: "Cornwall",
    country: "GB",
    region: "England"
  },
  {
    name: "Cumbria",
    country: "GB",
    region: "England"
  },
  {
    name: "Denbighshire",
    country: "GB",
    region: "Wales"
  },
  {
    name: "Derbyshire",
    country: "GB",
    region: "England"
  },
  {
    name: "Devon",
    country: "GB",
    region: "England"
  },
  {
    name: "Dorset",
    country: "GB",
    region: "England"
  },
  {
    name: "Down",
    country: "GB",
    region: "Northern Ireland"
  },
  {
    name: "Dumfries and Galloway",
    country: "GB",
    region: "Scotland"
  },
  {
    name: "Durham",
    country: "GB",
    region: "England"
  },
  {
    name: "East Ayrshire",
    country: "GB",
    region: "Scotland"
  },
  {
    name: "East Dunbartonshire",
    country: "GB",
    region: "Scotland"
  },
  {
    name: "East Lothian",
    country: "GB",
    region: "Scotland"
  },
  {
    name: "East Renfrewshire",
    country: "GB",
    region: "Scotland"
  },
  {
    name: "East Riding of Yorkshire",
    country: "GB",
    region: "England"
  },
  {
    name: "East Sussex",
    country: "GB",
    region: "England"
  },
  {
    name: "Edinburgh City",
    country: "GB",
    region: "Scotland"
  },
  {
    name: "Essex",
    country: "GB",
    region: "England"
  },
  {
    name: "Falkirk",
    country: "GB",
    region: "Scotland"
  },
  {
    name: "Fermanagh",
    country: "GB",
    region: "Northern Ireland"
  },
  {
    name: "Fife",
    country: "GB",
    region: "Scotland"
  },
  {
    name: "Flintshire",
    country: "GB",
    region: "Wales"
  },
  {
    name: "Glasgow",
    country: "GB",
    region: "Scotland"
  },
  {
    name: "Gloucestershire",
    country: "GB",
    region: "England"
  },
  {
    name: "Greater Manchester",
    country: "GB",
    region: "England"
  },
  {
    name: "Gwynedd",
    country: "GB",
    region: "Wales"
  },
  {
    name: "Hampshire",
    country: "GB",
    region: "England"
  },
  {
    name: "Herefordshire",
    country: "GB",
    region: "England"
  },
  {
    name: "Hertfordshire",
    country: "GB",
    region: "England"
  },
  {
    name: "Highland",
    country: "GB",
    region: "Scotland"
  },
  {
    name: "Humberside",
    country: "GB",
    region: "England"
  },
  {
    name: "Inverclyde",
    country: "GB",
    region: "Scotland"
  },
  {
    name: "Isle of Anglesey",
    country: "GB",
    region: "Wales"
  },
  {
    name: "Isle of Man",
    country: "GB",
    region: "England"
  },
  {
    name: "Isle of Wight",
    country: "GB",
    region: "England"
  },
  {
    name: "Isles of Scilly",
    country: "GB",
    region: "England"
  },
  {
    name: "Kent",
    country: "GB",
    region: "England"
  },
  {
    name: "Lancashire",
    country: "GB",
    region: "England"
  },
  {
    name: "Leicestershire",
    country: "GB",
    region: "England"
  },
  {
    name: "Lincolnshire",
    country: "GB",
    region: "England"
  },
  {
    name: "London",
    country: "GB",
    region: "England"
  },
  {
    name: "Londonderry",
    country: "GB",
    region: "Northern Ireland"
  },
  {
    name: "Merseyside",
    country: "GB",
    region: "England"
  },
  {
    name: "Merthyr Tydfil",
    country: "GB",
    region: "Wales"
  },
  {
    name: "Middlesex",
    country: "GB",
    region: "England"
  },
  {
    name: "Midlothian",
    country: "GB",
    region: "Scotland"
  },
  {
    name: "Monmouthshire",
    country: "GB",
    region: "Wales"
  },
  {
    name: "Moray",
    country: "GB",
    region: "Scotland"
  },
  {
    name: "Neath Port Talbot",
    country: "GB",
    region: "Wales"
  },
  {
    name: "Newport",
    country: "GB",
    region: "Wales"
  },
  {
    name: "Norfolk",
    country: "GB",
    region: "England"
  },
  {
    name: "North Ayrshire",
    country: "GB",
    region: "Scotland"
  },
  {
    name: "North Lanarkshire",
    country: "GB",
    region: "Scotland"
  },
  {
    name: "North Yorkshire",
    country: "GB",
    region: "England"
  },
  {
    name: "Northamptonshire",
    country: "GB",
    region: "England"
  },
  {
    name: "Northumberland",
    country: "GB",
    region: "England"
  },
  {
    name: "Nottinghamshire",
    country: "GB",
    region: "England"
  },
  {
    name: "Orkney",
    country: "GB",
    region: "Scotland"
  },
  {
    name: "Oxfordshire",
    country: "GB",
    region: "England"
  },
  {
    name: "Pembrokeshire",
    country: "GB",
    region: "Wales"
  },
  {
    name: "Perthshire and Kinross",
    country: "GB",
    region: "Scotland"
  },
  {
    name: "Powys",
    country: "GB",
    region: "Wales"
  },
  {
    name: "Renfrewshire",
    country: "GB",
    region: "Scotland"
  },
  {
    name: "Rhondda Cynon Taff",
    country: "GB",
    region: "Wales"
  },
  {
    name: "Roxburghshire",
    country: "GB",
    region: "Scotland"
  },
  {
    name: "Rutland",
    country: "GB",
    region: "England"
  },
  {
    name: "Shetland",
    country: "GB",
    region: "Scotland"
  },
  {
    name: "Shropshire",
    country: "GB",
    region: "England"
  },
  {
    name: "Somerset",
    country: "GB",
    region: "England"
  },
  {
    name: "South Ayrshire",
    country: "GB",
    region: "Scotland"
  },
  {
    name: "South Lanarkshire",
    country: "GB",
    region: "Scotland"
  },
  {
    name: "South Yorkshire",
    country: "GB",
    region: "England"
  },
  {
    name: "Staffordshire",
    country: "GB",
    region: "England"
  },
  {
    name: "Stirling",
    country: "GB",
    region: "Scotland"
  },
  {
    name: "Suffolk",
    country: "GB",
    region: "England"
  },
  {
    name: "Surrey",
    country: "GB",
    region: "England"
  },
  {
    name: "Swansea",
    country: "GB",
    region: "Wales"
  },
  {
    name: "The Vale of Glamorgan",
    country: "GB",
    region: "Wales"
  },
  {
    name: "Torfaen",
    country: "GB",
    region: "Wales"
  },
  {
    name: "Tyne and Wear",
    country: "GB",
    region: "England"
  },
  {
    name: "Tyrone",
    country: "GB",
    region: "Northern Ireland"
  },
  {
    name: "Warwickshire",
    country: "GB",
    region: "England"
  },
  {
    name: "West Dunbartonshire",
    country: "GB",
    region: "Scotland"
  },
  {
    name: "West Lothian",
    country: "GB",
    region: "Scotland"
  },
  {
    name: "West Midlands",
    country: "GB",
    region: "England"
  },
  {
    name: "West Sussex",
    country: "GB",
    region: "England"
  },
  {
    name: "West Yorkshire",
    country: "GB",
    region: "England"
  },
  {
    name: "Western Isles",
    country: "GB",
    region: "Scotland"
  },
  {
    name: "Wiltshire",
    country: "GB",
    region: "England"
  },
  {
    name: "Worcestershire",
    country: "GB",
    region: "England"
  },
  {
    name: "Wrexham",
    country: "GB",
    region: "Wales"
  },
  {
    short: "BW",
    name: "Baden-Württemberg",
    country: "DE"
  },
  {
    short: "BY",
    name: "Bayern",
    country: "DE"
  },
  {
    short: "BE",
    name: "Berlin",
    country: "DE"
  },
  {
    short: "BB",
    name: "Brandenburg",
    country: "DE"
  },
  {
    short: "HB",
    name: "Bremen",
    country: "DE"
  },
  {
    short: "HH",
    name: "Hamburg",
    country: "DE"
  },
  {
    short: "HE",
    name: "Hessen",
    country: "DE"
  },
  {
    short: "MV",
    name: "Mecklenburg-Vorpommern",
    country: "DE"
  },
  {
    short: "NI",
    name: "Niedersachsen",
    country: "DE"
  },
  {
    short: "NW",
    name: "Nordrhein-Westfalen",
    country: "DE"
  },
  {
    short: "RP",
    name: "Rheinland-Pfalz",
    country: "DE"
  },
  {
    short: "SL",
    name: "Saarland",
    country: "DE"
  },
  {
    short: "SN",
    name: "Sachsen",
    country: "DE"
  },
  {
    short: "ST",
    name: "Sachsen-Anhalt",
    country: "DE"
  },
  {
    short: "SH",
    name: "Schleswig-Holstein",
    country: "DE"
  },
  {
    short: "TH",
    name: "Thüringen",
    country: "DE"
  },
  {
    short: "AW",
    name: "Aruba",
    country: "NL"
  },
  {
    short: "BQ",
    name: "Bonaire",
    country: "NL"
  },
  {
    short: "CW",
    name: "Curaçao",
    country: "NL"
  },
  {
    short: "DR",
    name: "Drenthe",
    country: "NL"
  },
  {
    short: "FL",
    name: "Flevoland",
    country: "NL"
  },
  {
    short: "FR",
    name: "Friesland",
    country: "NL"
  },
  {
    short: "GD",
    name: "Gelderland",
    country: "NL"
  },
  {
    short: "GR",
    name: "Groningen",
    country: "NL"
  },
  {
    short: "LB",
    name: "Limburg",
    country: "NL"
  },
  {
    short: "NB",
    name: "Noord-Brabant",
    country: "NL"
  },
  {
    short: "NH",
    name: "Noord-Holland",
    country: "NL"
  },
  {
    short: "OV",
    name: "Overijssel",
    country: "NL"
  },
  {
    short: "BQ2",
    name: "Saba",
    country: "NL"
  },
  {
    short: "BQ3",
    name: "Sint Eustatius",
    country: "NL"
  },
  {
    short: "SX",
    name: "Sint Maarten",
    country: "NL"
  },
  {
    short: "UT",
    name: "Utrecht",
    country: "NL"
  },
  {
    short: "ZL",
    name: "Zeeland",
    country: "NL"
  },
  {
    short: "ZH",
    name: "Zuid-Holland",
    country: "NL"
  },
  {
    short: "ANT",
    name: "Antwerpen",
    country: "BE"
  },
  {
    short: "HAI",
    name: "Henegouwen",
    country: "BE",
    alt: ["Hainaut"]
  },
  {
    short: "LIM",
    name: "Limburg",
    country: "BE"
  },
  {
    short: "LIE",
    name: "Luik",
    country: "BE",
    alt: ["Liège"]
  },
  {
    short: "LUX",
    name: "Luxemburg",
    country: "BE"
  },
  {
    short: "NAM",
    name: "Namen",
    country: "BE"
  },
  {
    short: "OVL",
    name: "Oost-Vlaanderen",
    country: "BE"
  },
  {
    short: "VBR",
    name: "Vlaams-Brabant",
    country: "BE"
  },
  {
    short: "WBR",
    name: "Waals-Brabant",
    country: "BE"
  },
  {
    short: "WVL",
    name: "West-Vlaanderen",
    country: "BE"
  },
  {
    name: "Hovedstaden",
    country: "DK"
  },
  {
    name: "Midtjylland",
    country: "DK"
  },
  {
    name: "Nordjylland",
    country: "DK"
  },
  {
    name: "Sjælland",
    country: "DK"
  },
  {
    name: "Syddanmark",
    country: "DK"
  },
  {
    name: "Adana",
    country: "TR"
  },
  {
    name: "Adıyaman",
    country: "TR"
  },
  {
    name: "Afyonkarahisar",
    country: "TR"
  },
  {
    name: "Aksaray",
    country: "TR"
  },
  {
    name: "Amasya",
    country: "TR"
  },
  {
    name: "Ankara",
    country: "TR"
  },
  {
    name: "Antalya",
    country: "TR"
  },
  {
    name: "Ardahan",
    country: "TR"
  },
  {
    name: "Artvin",
    country: "TR"
  },
  {
    name: "Aydın",
    country: "TR"
  },
  {
    name: "Ağrı",
    country: "TR"
  },
  {
    name: "Balıkesir",
    country: "TR"
  },
  {
    name: "Bartın",
    country: "TR"
  },
  {
    name: "Batman",
    country: "TR"
  },
  {
    name: "Bayburt",
    country: "TR"
  },
  {
    name: "Bilecik",
    country: "TR"
  },
  {
    name: "Bingöl",
    country: "TR"
  },
  {
    name: "Bitlis",
    country: "TR"
  },
  {
    name: "Bolu",
    country: "TR"
  },
  {
    name: "Burdur",
    country: "TR"
  },
  {
    name: "Bursa",
    country: "TR"
  },
  {
    name: "Denizli",
    country: "TR"
  },
  {
    name: "Diyarbakır",
    country: "TR"
  },
  {
    name: "Düzce",
    country: "TR"
  },
  {
    name: "Edirne",
    country: "TR"
  },
  {
    name: "Elazığ",
    country: "TR"
  },
  {
    name: "Erzincan",
    country: "TR"
  },
  {
    name: "Erzurum",
    country: "TR"
  },
  {
    name: "Eskişehir",
    country: "TR"
  },
  {
    name: "Gaziantep",
    country: "TR"
  },
  {
    name: "Giresun",
    country: "TR"
  },
  {
    name: "Gümüşhane",
    country: "TR"
  },
  {
    name: "Hakkâri",
    country: "TR"
  },
  {
    name: "Hatay",
    country: "TR"
  },
  {
    name: "Isparta",
    country: "TR"
  },
  {
    name: "Istanbul",
    country: "TR"
  },
  {
    name: "Iğdır",
    country: "TR"
  },
  {
    name: "Kahramanmaraş",
    country: "TR"
  },
  {
    name: "Karabük",
    country: "TR"
  },
  {
    name: "Karaman",
    country: "TR"
  },
  {
    name: "Kars",
    country: "TR"
  },
  {
    name: "Kastamonu",
    country: "TR"
  },
  {
    name: "Kayseri",
    country: "TR"
  },
  {
    name: "Kilis",
    country: "TR"
  },
  {
    name: "Kocaeli",
    country: "TR"
  },
  {
    name: "Konya",
    country: "TR"
  },
  {
    name: "Kütahya",
    country: "TR"
  },
  {
    name: "Kırklareli",
    country: "TR"
  },
  {
    name: "Kırıkkale",
    country: "TR"
  },
  {
    name: "Kırşehir",
    country: "TR"
  },
  {
    name: "Malatya",
    country: "TR"
  },
  {
    name: "Manisa",
    country: "TR"
  },
  {
    name: "Mardin",
    country: "TR"
  },
  {
    name: "Mersin",
    country: "TR"
  },
  {
    name: "Muğla",
    country: "TR"
  },
  {
    name: "Muş",
    country: "TR"
  },
  {
    name: "Nevşehir",
    country: "TR"
  },
  {
    name: "Niğde",
    country: "TR"
  },
  {
    name: "Ordu",
    country: "TR"
  },
  {
    name: "Osmaniye",
    country: "TR"
  },
  {
    name: "Rize",
    country: "TR"
  },
  {
    name: "Sakarya",
    country: "TR"
  },
  {
    name: "Samsun",
    country: "TR"
  },
  {
    name: "Siirt",
    country: "TR"
  },
  {
    name: "Sinop",
    country: "TR"
  },
  {
    name: "Sivas",
    country: "TR"
  },
  {
    name: "Tekirdağ",
    country: "TR"
  },
  {
    name: "Tokat",
    country: "TR"
  },
  {
    name: "Trabzon",
    country: "TR"
  },
  {
    name: "Tunceli",
    country: "TR"
  },
  {
    name: "Uşak",
    country: "TR"
  },
  {
    name: "Van",
    country: "TR"
  },
  {
    name: "Yalova",
    country: "TR"
  },
  {
    name: "Yozgat",
    country: "TR"
  },
  {
    name: "Zonguldak",
    country: "TR"
  },
  {
    name: "Çanakkale",
    country: "TR"
  },
  {
    name: "Çankırı",
    country: "TR"
  },
  {
    name: "Çorum",
    country: "TR"
  },
  {
    name: "İzmir",
    country: "TR"
  },
  {
    name: "Şanlıurfa",
    country: "TR"
  },
  {
    name: "Şırnak",
    country: "TR"
  },
  {
    short: "ID-BA",
    name: "Bali",
    country: "ID"
  },
  {
    short: "ID-BB",
    name: "Bangka–Belitung Islands",
    country: "ID"
  },
  {
    short: "ID-BT",
    name: "Banten",
    country: "ID"
  },
  {
    short: "ID-BE",
    name: "Bengkulu",
    country: "ID"
  },
  {
    short: "ID-JT",
    name: "Central Java",
    country: "ID"
  },
  {
    short: "ID-KT",
    name: "Central Kalimantan",
    country: "ID"
  },
  {
    short: "ID-ST",
    name: "Central Sulawesi",
    country: "ID"
  },
  {
    short: "ID-JI",
    name: "East Java",
    country: "ID"
  },
  {
    short: "ID-KI",
    name: "East Kalimantan",
    country: "ID"
  },
  {
    short: "ID-NT",
    name: "East Nusa Tenggara",
    country: "ID"
  },
  {
    short: "ID-GO",
    name: "Gorontalo",
    country: "ID"
  },
  {
    short: "ID-JK",
    name: "Jakarta Special Capital Region",
    country: "ID"
  },
  {
    short: "ID-JA",
    name: "Jambi",
    country: "ID"
  },
  {
    short: "ID-LA",
    name: "Lampung",
    country: "ID"
  },
  {
    short: "ID-MA",
    name: "Maluku",
    country: "ID"
  },
  {
    short: "ID-KU",
    name: "North Kalimantan",
    country: "ID"
  },
  {
    short: "ID-MU",
    name: "North Maluku",
    country: "ID"
  },
  {
    short: "ID-SA",
    name: "North Sulawesi",
    country: "ID"
  },
  {
    short: "ID-SU",
    name: "North Sumatra",
    country: "ID"
  },
  {
    short: "ID-RI",
    name: "Riau",
    country: "ID"
  },
  {
    short: "ID-KR",
    name: "Riau Islands",
    country: "ID"
  },
  {
    short: "ID-KS",
    name: "South Kalimantan",
    country: "ID"
  },
  {
    short: "ID-SN",
    name: "South Sulawesi",
    country: "ID"
  },
  {
    short: "ID-SS",
    name: "South Sumatra",
    country: "ID"
  },
  {
    short: "ID-SG",
    name: "Southeast Sulawesi",
    country: "ID"
  },
  {
    short: "ID-AC",
    name: "Special Region of Aceh",
    country: "ID"
  },
  {
    short: "ID-PA",
    name: "Special Region of Papua",
    country: "ID"
  },
  {
    short: "ID-PB",
    name: "Special Region of West Papua",
    country: "ID"
  },
  {
    short: "ID-YO",
    name: "Special Region of Yogyakarta",
    country: "ID"
  },
  {
    short: "ID-JB",
    name: "West Java",
    country: "ID"
  },
  {
    short: "ID-KB",
    name: "West Kalimantan",
    country: "ID"
  },
  {
    short: "ID-NB",
    name: "West Nusa Tenggara",
    country: "ID"
  },
  {
    short: "ID-SR",
    name: "West Sulawesi",
    country: "ID"
  },
  {
    short: "ID-SB",
    name: "West Sumatra",
    country: "ID"
  },
  {
    name: "Ajloun",
    country: "JO"
  },
  {
    name: "Amman",
    country: "JO"
  },
  {
    name: "Aqaba",
    country: "JO"
  },
  {
    name: "Balqa",
    country: "JO"
  },
  {
    name: "Irbid",
    country: "JO"
  },
  {
    name: "Jerash",
    country: "JO"
  },
  {
    name: "Karak",
    country: "JO"
  },
  {
    name: "Ma'an",
    country: "JO"
  },
  {
    name: "Madaba",
    country: "JO"
  },
  {
    name: "Mafraq",
    country: "JO"
  },
  {
    name: "Tafilah",
    country: "JO"
  },
  {
    name: "Zarqa",
    country: "JO"
  },
  {
    short: "AN",
    name: "Andaman and Nicobar Islands",
    country: "IN"
  },
  {
    short: "AP",
    name: "Andhra Pradesh",
    country: "IN"
  },
  {
    short: "AR",
    name: "Arunachal Pradesh",
    country: "IN"
  },
  {
    short: "AS",
    name: "Assam",
    country: "IN"
  },
  {
    short: "BR",
    name: "Bihar",
    country: "IN"
  },
  {
    short: "CH",
    name: "Chandigarh",
    country: "IN"
  },
  {
    short: "CT",
    name: "Chhattisgarh",
    country: "IN"
  },
  {
    short: "DN",
    name: "Dadra and Nagar Haveli",
    country: "IN"
  },
  {
    short: "DD",
    name: "Daman and Diu",
    country: "IN"
  },
  {
    short: "GA",
    name: "Goa",
    country: "IN"
  },
  {
    short: "GJ",
    name: "Gujarat",
    country: "IN"
  },
  {
    short: "HR",
    name: "Haryana",
    country: "IN"
  },
  {
    short: "HP",
    name: "Himachal Pradesh",
    country: "IN"
  },
  {
    short: "JK",
    name: "Jammu and Kashmir",
    country: "IN"
  },
  {
    short: "JH",
    name: "Jharkhand",
    country: "IN"
  },
  {
    short: "KA",
    name: "Karnataka",
    country: "IN"
  },
  {
    short: "KL",
    name: "Kerala",
    country: "IN"
  },
  {
    short: "LD",
    name: "Lakshadweep",
    country: "IN"
  },
  {
    short: "MP",
    name: "Madhya Pradesh",
    country: "IN"
  },
  {
    short: "MH",
    name: "Maharashtra",
    country: "IN"
  },
  {
    short: "MN",
    name: "Manipur",
    country: "IN"
  },
  {
    short: "ML",
    name: "Meghalaya",
    country: "IN"
  },
  {
    short: "MZ",
    name: "Mizoram",
    country: "IN"
  },
  {
    short: "NL",
    name: "Nagaland",
    country: "IN"
  },
  {
    short: "DL",
    name: "National Capital Territory of Delhi",
    country: "IN"
  },
  {
    short: "OR",
    name: "Odisha",
    country: "IN"
  },
  {
    short: "PY",
    name: "Puducherry",
    country: "IN"
  },
  {
    short: "PB",
    name: "Punjab",
    country: "IN"
  },
  {
    short: "RJ",
    name: "Rajasthan",
    country: "IN"
  },
  {
    short: "SK",
    name: "Sikkim",
    country: "IN"
  },
  {
    short: "TN",
    name: "Tamil Nadu",
    country: "IN"
  },
  {
    short: "TG",
    name: "Telangana",
    country: "IN"
  },
  {
    short: "TR",
    name: "Tripura",
    country: "IN"
  },
  {
    short: "UP",
    name: "Uttar Pradesh",
    country: "IN"
  },
  {
    short: "UT",
    name: "Uttarakhand",
    country: "IN"
  },
  {
    short: "WB",
    name: "West Bengal",
    country: "IN"
  },
  {
    name: "កណ្តាល",
    english: "Kandal",
    country: "KH"
  },
  {
    name: "កែប",
    english: "Kep",
    country: "KH"
  },
  {
    name: "កោះកុង",
    english: "Koh Kong",
    country: "KH"
  },
  {
    name: "កំពង់ចាម",
    english: "Kampong Cham",
    country: "KH"
  },
  {
    name: "កំពង់ឆ្នាំង",
    english: "Kampong Chhnang",
    country: "KH"
  },
  {
    name: "កំពង់ធំ",
    english: "Kampong Thom",
    country: "KH"
  },
  {
    name: "កំពង់ស្ពឺ",
    english: "Kampong Speu",
    country: "KH"
  },
  {
    name: "កំពត",
    english: "Kampot",
    country: "KH"
  },
  {
    name: "ក្រចេះ",
    english: "Kratié",
    country: "KH"
  },
  {
    name: "តាកែវ",
    english: "Takéo",
    country: "KH"
  },
  {
    name: "ត្បូងឃ្មុំ",
    english: "Tbong Khmum",
    country: "KH"
  },
  {
    name: "បន្ទាយមានជ័យ",
    english: "Banteay Meanchey",
    country: "KH"
  },
  {
    name: "បាត់ដំបង",
    english: "Battambang",
    country: "KH"
  },
  {
    name: "បៃលិន",
    english: "Pailin",
    country: "KH"
  },
  {
    name: "ពោធិ៍សាត់",
    english: "Pursat",
    country: "KH"
  },
  {
    name: "ព្រៃវែង",
    english: "Prey Veng",
    country: "KH"
  },
  {
    name: "ព្រះវិហារ",
    english: "Preah Vihear",
    country: "KH"
  },
  {
    name: "ព្រះសីហនុ",
    english: "Preah Sihanouk",
    country: "KH"
  },
  {
    name: "ភ្នំពេញ",
    english: "Phnom Penh Municipality",
    country: "KH"
  },
  {
    name: "មណ្ឌលគីរី",
    english: "Mondulkiri",
    country: "KH"
  },
  {
    name: "រតនគីរី",
    english: "Ratanakiri",
    country: "KH"
  },
  {
    name: "សៀមរាប",
    english: "Siem Reap",
    country: "KH"
  },
  {
    name: "ស្ទឹងត្រែង",
    english: "Stung Treng",
    country: "KH"
  },
  {
    name: "ស្វាយរៀង",
    english: "Svay Rieng",
    country: "KH"
  },
  {
    name: "ឧត្តរមានជ័យ",
    english: "Oddar Meanchey",
    country: "KH"
  },
  {
    name: "Addis Ababa",
    country: "ET"
  },
  {
    name: "Afar Region",
    country: "ET"
  },
  {
    name: "Amhara Region",
    country: "ET"
  },
  {
    name: "Benishangul-Gumuz",
    country: "ET"
  },
  {
    name: "Dire Dawa",
    country: "ET"
  },
  {
    name: "Gambela",
    country: "ET"
  },
  {
    name: "Harari",
    country: "ET"
  },
  {
    name: "Oromia",
    country: "ET"
  },
  {
    name: "Somali",
    country: "ET"
  },
  {
    name: "Southern Nations, Nationalities, and Peoples' Region",
    country: "ET"
  },
  {
    name: "Tigray Region",
    country: "ET"
  },
  {
    name: "Abancay",
    region: "Apurímac",
    country: "PE"
  },
  {
    name: "Acobamba",
    region: "Huancavelica",
    country: "PE"
  },
  {
    name: "Acomayo",
    region: "Cusco",
    country: "PE"
  },
  {
    name: "Aija",
    region: "Ancash",
    country: "PE"
  },
  {
    name: "Alto Amazonas",
    region: "Loreto",
    country: "PE"
  },
  {
    name: "Ambo",
    region: "Huánuco",
    country: "PE"
  },
  {
    name: "Andahuaylas",
    region: "Apurímac",
    country: "PE"
  },
  {
    name: "Angaraes",
    region: "Huancavelica",
    country: "PE"
  },
  {
    name: "Anta",
    region: "Cusco",
    country: "PE"
  },
  {
    name: "Antabamba",
    region: "Apurímac",
    country: "PE"
  },
  {
    name: "Antonio Raymondi",
    region: "Ancash",
    country: "PE"
  },
  {
    name: "Arequipa",
    region: "Arequipa",
    country: "PE"
  },
  {
    name: "Ascope",
    region: "La Libertad",
    country: "PE"
  },
  {
    name: "Asunción",
    region: "Ancash",
    country: "PE"
  },
  {
    name: "Atalaya",
    region: "Ucayali",
    country: "PE"
  },
  {
    name: "Ayabaca",
    region: "Piura",
    country: "PE"
  },
  {
    name: "Aymaraes",
    region: "Apurímac",
    country: "PE"
  },
  {
    name: "Azángaro",
    region: "Puno",
    country: "PE"
  },
  {
    name: "Bagua",
    region: "Amazonas",
    country: "PE"
  },
  {
    name: "Barranca",
    region: "Lima",
    country: "PE"
  },
  {
    name: "Bellavista",
    region: "San Martín",
    country: "PE"
  },
  {
    name: "Bolognesi",
    region: "Ancash",
    country: "PE"
  },
  {
    name: "Bolívar",
    region: "La Libertad",
    country: "PE"
  },
  {
    name: "Bongará",
    region: "Amazonas",
    country: "PE"
  },
  {
    name: "Cajabamba",
    region: "Cajamarca",
    country: "PE"
  },
  {
    name: "Cajamarca",
    region: "Cajamarca",
    country: "PE"
  },
  {
    name: "Cajatambo",
    region: "Lima",
    country: "PE"
  },
  {
    name: "Calca",
    region: "Cusco",
    country: "PE"
  },
  {
    name: "Callao",
    region: "Callao",
    country: "PE"
  },
  {
    name: "Camaná",
    region: "Arequipa",
    country: "PE"
  },
  {
    name: "Canas",
    region: "Cusco",
    country: "PE"
  },
  {
    name: "Canchis",
    region: "Cusco",
    country: "PE"
  },
  {
    name: "Candarave",
    region: "Tacna",
    country: "PE"
  },
  {
    name: "Cangallo",
    region: "Ayacucho",
    country: "PE"
  },
  {
    name: "Canta",
    region: "Lima",
    country: "PE"
  },
  {
    name: "Carabaya",
    region: "Puno",
    country: "PE"
  },
  {
    name: "Caravelí",
    region: "Arequipa",
    country: "PE"
  },
  {
    name: "Carhuaz",
    region: "Ancash",
    country: "PE"
  },
  {
    name: "Carlos Fermín Fitzcarrald",
    region: "Ancash",
    country: "PE"
  },
  {
    name: "Casma",
    region: "Ancash",
    country: "PE"
  },
  {
    name: "Castilla",
    region: "Arequipa",
    country: "PE"
  },
  {
    name: "Castrovirreyna",
    region: "Huancavelica",
    country: "PE"
  },
  {
    name: "Caylloma",
    region: "Arequipa",
    country: "PE"
  },
  {
    name: "Cañete",
    region: "Lima",
    country: "PE"
  },
  {
    name: "Celendín",
    region: "Cajamarca",
    country: "PE"
  },
  {
    name: "Chachapoyas",
    region: "Amazonas",
    country: "PE"
  },
  {
    name: "Chanchamayo",
    region: "Junín",
    country: "PE"
  },
  {
    name: "Chepén",
    region: "La Libertad",
    country: "PE"
  },
  {
    name: "Chiclayo",
    region: "Lambayeque",
    country: "PE"
  },
  {
    name: "Chincha",
    region: "Ica",
    country: "PE"
  },
  {
    name: "Chincheros",
    region: "Apurímac",
    country: "PE"
  },
  {
    name: "Chota",
    region: "Cajamarca",
    country: "PE"
  },
  {
    name: "Chucuito",
    region: "Puno",
    country: "PE"
  },
  {
    name: "Chumbivilcas",
    region: "Cusco",
    country: "PE"
  },
  {
    name: "Chupaca",
    region: "Junín",
    country: "PE"
  },
  {
    name: "Churcampa",
    region: "Huancavelica",
    country: "PE"
  },
  {
    name: "Concepción",
    region: "Junín",
    country: "PE"
  },
  {
    name: "Condesuyos",
    region: "Arequipa",
    country: "PE"
  },
  {
    name: "Condorcanqui",
    region: "Amazonas",
    country: "PE"
  },
  {
    name: "Contralmirante Villar",
    region: "Tumbes",
    country: "PE"
  },
  {
    name: "Contumazá",
    region: "Cajamarca",
    country: "PE"
  },
  {
    name: "Coronel Portillo",
    region: "Ucayali",
    country: "PE"
  },
  {
    name: "Corongo",
    region: "Ancash",
    country: "PE"
  },
  {
    name: "Cotabambas",
    region: "Apurímac",
    country: "PE"
  },
  {
    name: "Cusco",
    region: "Cusco",
    country: "PE"
  },
  {
    name: "Cutervo",
    region: "Cajamarca",
    country: "PE"
  },
  {
    name: "Daniel Alcídes Carrión",
    region: "Pasco",
    country: "PE"
  },
  {
    name: "Datem del Marañón",
    region: "Loreto",
    country: "PE"
  },
  {
    name: "Dos de Mayo",
    region: "Huánuco",
    country: "PE"
  },
  {
    name: "El Collao",
    region: "Puno",
    country: "PE"
  },
  {
    name: "El Dorado",
    region: "San Martín",
    country: "PE"
  },
  {
    name: "Espinar",
    region: "Cusco",
    country: "PE"
  },
  {
    name: "Ferreñafe",
    region: "Lambayeque",
    country: "PE"
  },
  {
    name: "General Sánchez Cerro",
    region: "Moquegua",
    country: "PE"
  },
  {
    name: "Gran Chimú",
    region: "La Libertad",
    country: "PE"
  },
  {
    name: "Grau",
    region: "Apurímac",
    country: "PE"
  },
  {
    name: "Huacaybamba",
    region: "Huánuco",
    country: "PE"
  },
  {
    name: "Hualgayoc",
    region: "Cajamarca",
    country: "PE"
  },
  {
    name: "Huallaga",
    region: "San Martín",
    country: "PE"
  },
  {
    name: "Huamalíes",
    region: "Huánuco",
    country: "PE"
  },
  {
    name: "Huamanga",
    region: "Ayacucho",
    country: "PE"
  },
  {
    name: "Huanca Sancos",
    region: "Ayacucho",
    country: "PE"
  },
  {
    name: "Huancabamba",
    region: "Piura",
    country: "PE"
  },
  {
    name: "Huancané",
    region: "Puno",
    country: "PE"
  },
  {
    name: "Huancavelica",
    region: "Huancavelica",
    country: "PE"
  },
  {
    name: "Huancayo",
    region: "Junín",
    country: "PE"
  },
  {
    name: "Huanta",
    region: "Ayacucho",
    country: "PE"
  },
  {
    name: "Huaral",
    region: "Lima",
    country: "PE"
  },
  {
    name: "Huaraz",
    region: "Ancash",
    country: "PE"
  },
  {
    name: "Huari",
    region: "Ancash",
    country: "PE"
  },
  {
    name: "Huarmey",
    region: "Ancash",
    country: "PE"
  },
  {
    name: "Huarochirí",
    region: "Lima",
    country: "PE"
  },
  {
    name: "Huaura",
    region: "Lima",
    country: "PE"
  },
  {
    name: "Huaylas",
    region: "Ancash",
    country: "PE"
  },
  {
    name: "Huaytará",
    region: "Huancavelica",
    country: "PE"
  },
  {
    name: "Huánuco",
    region: "Huánuco",
    country: "PE"
  },
  {
    name: "Ica",
    region: "Ica",
    country: "PE"
  },
  {
    name: "Ilo",
    region: "Moquegua",
    country: "PE"
  },
  {
    name: "Islay",
    region: "Arequipa",
    country: "PE"
  },
  {
    name: "Jauja",
    region: "Junín",
    country: "PE"
  },
  {
    name: "Jaén",
    region: "Cajamarca",
    country: "PE"
  },
  {
    name: "Jorge Basadre",
    region: "Tacna",
    country: "PE"
  },
  {
    name: "Julcán",
    region: "La Libertad",
    country: "PE"
  },
  {
    name: "Junín",
    region: "Junín",
    country: "PE"
  },
  {
    name: "La Convención",
    region: "Cusco",
    country: "PE"
  },
  {
    name: "La Mar",
    region: "Ayacucho",
    country: "PE"
  },
  {
    name: "La Unión",
    region: "Arequipa",
    country: "PE"
  },
  {
    name: "Lamas",
    region: "San Martín",
    country: "PE"
  },
  {
    name: "Lambayeque",
    region: "Lambayeque",
    country: "PE"
  },
  {
    name: "Lampa",
    region: "Puno",
    country: "PE"
  },
  {
    name: "Lauricocha",
    region: "Huánuco",
    country: "PE"
  },
  {
    name: "Leoncio Prado",
    region: "Huánuco",
    country: "PE"
  },
  {
    name: "Lima",
    region: "autonomous",
    country: "PE"
  },
  {
    name: "Loreto",
    region: "Loreto",
    country: "PE"
  },
  {
    name: "Lucanas",
    region: "Ayacucho",
    country: "PE"
  },
  {
    name: "Luya",
    region: "Amazonas",
    country: "PE"
  },
  {
    name: "Manú",
    region: "Madre de Dios",
    country: "PE"
  },
  {
    name: "Marañón",
    region: "Huánuco",
    country: "PE"
  },
  {
    name: "Mariscal Cáceres",
    region: "San Martín",
    country: "PE"
  },
  {
    name: "Mariscal Luzuriaga",
    region: "Ancash",
    country: "PE"
  },
  {
    name: "Mariscal Nieto",
    region: "Moquegua",
    country: "PE"
  },
  {
    name: "Mariscal Ramón Castilla",
    region: "Loreto",
    country: "PE"
  },
  {
    name: "Maynas",
    region: "Loreto",
    country: "PE"
  },
  {
    name: "Melgar",
    region: "Puno",
    country: "PE"
  },
  {
    name: "Moho",
    region: "Puno",
    country: "PE"
  },
  {
    name: "Morropón",
    region: "Piura",
    country: "PE"
  },
  {
    name: "Moyobamba",
    region: "San Martín",
    country: "PE"
  },
  {
    name: "Nazca",
    region: "Ica",
    country: "PE"
  },
  {
    name: "Ocros",
    region: "Ancash",
    country: "PE"
  },
  {
    name: "Otuzco",
    region: "La Libertad",
    country: "PE"
  },
  {
    name: "Oxapampa",
    region: "Pasco",
    country: "PE"
  },
  {
    name: "Oyón",
    region: "Lima",
    country: "PE"
  },
  {
    name: "Pacasmayo",
    region: "La Libertad",
    country: "PE"
  },
  {
    name: "Pachitea",
    region: "Huánuco",
    country: "PE"
  },
  {
    name: "Padre Abad",
    region: "Ucayali",
    country: "PE"
  },
  {
    name: "Paita",
    region: "Piura",
    country: "PE"
  },
  {
    name: "Pallasca",
    region: "Ancash",
    country: "PE"
  },
  {
    name: "Palpa",
    region: "Ica",
    country: "PE"
  },
  {
    name: "Parinacochas",
    region: "Ayacucho",
    country: "PE"
  },
  {
    name: "Paruro",
    region: "Cusco",
    country: "PE"
  },
  {
    name: "Pasco",
    region: "Pasco",
    country: "PE"
  },
  {
    name: "Pataz",
    region: "La Libertad",
    country: "PE"
  },
  {
    name: "Paucartambo",
    region: "Cusco",
    country: "PE"
  },
  {
    name: "Picota",
    region: "San Martín",
    country: "PE"
  },
  {
    name: "Pisco",
    region: "Ica",
    country: "PE"
  },
  {
    name: "Piura",
    region: "Piura",
    country: "PE"
  },
  {
    name: "Pomabamba",
    region: "Ancash",
    country: "PE"
  },
  {
    name: "Puerto Inca",
    region: "Huánuco",
    country: "PE"
  },
  {
    name: "Puno",
    region: "Puno",
    country: "PE"
  },
  {
    name: "Purús",
    region: "Ucayali",
    country: "PE"
  },
  {
    name: "Putumayo",
    region: "Loreto",
    country: "PE"
  },
  {
    name: "Páucar del Sara Sara",
    region: "Ayacucho",
    country: "PE"
  },
  {
    name: "Quispicanchi",
    region: "Cusco",
    country: "PE"
  },
  {
    name: "Recuay",
    region: "Ancash",
    country: "PE"
  },
  {
    name: "Requena",
    region: "Loreto",
    country: "PE"
  },
  {
    name: "Rioja",
    region: "San Martín",
    country: "PE"
  },
  {
    name: "Rodríguez de Mendoza",
    region: "Amazonas",
    country: "PE"
  },
  {
    name: "San Antonio de Putina",
    region: "Puno",
    country: "PE"
  },
  {
    name: "San Ignacio",
    region: "Cajamarca",
    country: "PE"
  },
  {
    name: "San Marcos",
    region: "Cajamarca",
    country: "PE"
  },
  {
    name: "San Martín",
    region: "San Martín",
    country: "PE"
  },
  {
    name: "San Miguel",
    region: "Cajamarca",
    country: "PE"
  },
  {
    name: "San Pablo",
    region: "Cajamarca",
    country: "PE"
  },
  {
    name: "San Román",
    region: "Puno",
    country: "PE"
  },
  {
    name: "Sandia",
    region: "Puno",
    country: "PE"
  },
  {
    name: "Santa",
    region: "Ancash",
    country: "PE"
  },
  {
    name: "Santa Cruz",
    region: "Cajamarca",
    country: "PE"
  },
  {
    name: "Santiago de Chuco",
    region: "La Libertad",
    country: "PE"
  },
  {
    name: "Satipo",
    region: "Junín",
    country: "PE"
  },
  {
    name: "Sechura",
    region: "Piura",
    country: "PE"
  },
  {
    name: "Sihuas",
    region: "Ancash",
    country: "PE"
  },
  {
    name: "Sucre",
    region: "Ayacucho",
    country: "PE"
  },
  {
    name: "Sullana",
    region: "Piura",
    country: "PE"
  },
  {
    name: "Sánchez Carrión",
    region: "La Libertad",
    country: "PE"
  },
  {
    name: "Tacna",
    region: "Tacna",
    country: "PE"
  },
  {
    name: "Tahuamanu",
    region: "Madre de Dios",
    country: "PE"
  },
  {
    name: "Talara",
    region: "Piura",
    country: "PE"
  },
  {
    name: "Tambopata",
    region: "Madre de Dios",
    country: "PE"
  },
  {
    name: "Tarata",
    region: "Tacna",
    country: "PE"
  },
  {
    name: "Tarma",
    region: "Junín",
    country: "PE"
  },
  {
    name: "Tayacaja",
    region: "Huancavelica",
    country: "PE"
  },
  {
    name: "Tocache",
    region: "San Martín",
    country: "PE"
  },
  {
    name: "Trujillo",
    region: "La Libertad",
    country: "PE"
  },
  {
    name: "Tumbes",
    region: "Tumbes",
    country: "PE"
  },
  {
    name: "Ucayali",
    region: "Loreto",
    country: "PE"
  },
  {
    name: "Urubamba",
    region: "Cusco",
    country: "PE"
  },
  {
    name: "Utcubamba",
    region: "Amazonas",
    country: "PE"
  },
  {
    name: "Vilcas Huamán",
    region: "Ayacucho",
    country: "PE"
  },
  {
    name: "Virú",
    region: "La Libertad",
    country: "PE"
  },
  {
    name: "Víctor Fajardo",
    region: "Ayacucho",
    country: "PE"
  },
  {
    name: "Yarowilca",
    region: "Huánuco",
    country: "PE"
  },
  {
    name: "Yauli",
    region: "Junín",
    country: "PE"
  },
  {
    name: "Yauyos",
    region: "Lima",
    country: "PE"
  },
  {
    name: "Yungay",
    region: "Ancash",
    country: "PE"
  },
  {
    name: "Yunguyo",
    region: "Puno",
    country: "PE"
  },
  {
    name: "Zarumilla",
    region: "Tumbes",
    country: "PE"
  },
  {
    name: "Artemisa",
    country: "CU"
  },
  {
    name: "Bayamo",
    country: "CU"
  },
  {
    name: "Camagüey",
    country: "CU"
  },
  {
    name: "Ciego de Ávila",
    country: "CU"
  },
  {
    name: "Cienfuegos",
    country: "CU"
  },
  {
    name: "Guantánamo",
    country: "CU"
  },
  {
    name: "Havana",
    country: "CU"
  },
  {
    name: "Holguín",
    country: "CU"
  },
  {
    name: "Las Tunas",
    country: "CU"
  },
  {
    name: "Matanzas",
    country: "CU"
  },
  {
    name: "Nueva Gerona",
    country: "CU"
  },
  {
    name: "Pinar del Río",
    country: "CU"
  },
  {
    name: "San José de las Lajas",
    country: "CU"
  },
  {
    name: "Sancti Spíritus",
    country: "CU"
  },
  {
    name: "Santa Clara",
    country: "CU"
  },
  {
    name: "Santiago de Cuba",
    country: "CU"
  },
  {
    name: "Buenos Aires",
    country: "AR"
  },
  {
    name: "Catamarca",
    country: "AR"
  },
  {
    name: "Chaco",
    country: "AR"
  },
  {
    name: "Chubut",
    country: "AR"
  },
  {
    name: "Ciudad Autónoma de Buenos Aires",
    country: "AR"
  },
  {
    name: "Corrientes",
    country: "AR"
  },
  {
    name: "Córdoba",
    country: "AR"
  },
  {
    name: "Entre Ríos",
    country: "AR"
  },
  {
    name: "Formosa",
    country: "AR"
  },
  {
    name: "Jujuy",
    country: "AR"
  },
  {
    name: "La Pampa",
    country: "AR"
  },
  {
    name: "La Rioja",
    country: "AR"
  },
  {
    name: "Mendoza",
    country: "AR"
  },
  {
    name: "Misiones",
    country: "AR"
  },
  {
    name: "Neuquén",
    country: "AR"
  },
  {
    name: "Río Negro",
    country: "AR"
  },
  {
    name: "Salta",
    country: "AR"
  },
  {
    name: "San Juan",
    country: "AR"
  },
  {
    name: "San Luis",
    country: "AR"
  },
  {
    name: "Santa Cruz",
    country: "AR"
  },
  {
    name: "Santa Fe",
    country: "AR"
  },
  {
    name: "Santiago del Estero",
    country: "AR"
  },
  {
    name: "Tierra del Fuego, Antártida e Islas del Atlántico Sur",
    country: "AR"
  },
  {
    name: "Tucumán",
    country: "AR"
  },
  {
    name: "Aisén",
    region: "XI Aisén",
    country: "CL"
  },
  {
    name: "Antofagasta",
    region: "II Antofagasta",
    country: "CL"
  },
  {
    name: "Antártica Chilena",
    region: "XII Magallanes",
    country: "CL"
  },
  {
    name: "Arauco",
    region: "VIII Biobío",
    country: "CL"
  },
  {
    name: "Arica",
    region: "XV Arica and Parinacota",
    country: "CL"
  },
  {
    name: "Biobío",
    region: "VIII Biobío",
    country: "CL"
  },
  {
    name: "Cachapoal",
    region: "VI O'Higgins",
    country: "CL"
  },
  {
    name: "Capitan Prat",
    region: "XI Aisén",
    country: "CL"
  },
  {
    name: "Cardenal Caro",
    region: "VI O'Higgins",
    country: "CL"
  },
  {
    name: "Cauquenes",
    region: "VII Maule",
    country: "CL"
  },
  {
    name: "Cautin",
    region: "IX Araucanía",
    country: "CL"
  },
  {
    name: "Chacabuco",
    region: "RM Santiago Metropolitan",
    country: "CL"
  },
  {
    name: "Chañaral",
    region: "III Atacama",
    country: "CL"
  },
  {
    name: "Chiloe",
    region: "X Los Lagos",
    country: "CL"
  },
  {
    name: "Choapa",
    region: "IV Coquimbo",
    country: "CL"
  },
  {
    name: "Coihaique",
    region: "XI Aisén",
    country: "CL"
  },
  {
    name: "Colchagua",
    region: "VI O'Higgins",
    country: "CL"
  },
  {
    name: "Concepción",
    region: "VIII Biobío",
    country: "CL"
  },
  {
    name: "Copiapó",
    region: "III Atacama",
    country: "CL"
  },
  {
    name: "Cordillera",
    region: "RM Santiago Metropolitan",
    country: "CL"
  },
  {
    name: "Curicó",
    region: "VII Maule",
    country: "CL"
  },
  {
    name: "El Loa",
    region: "II Antofagasta",
    country: "CL"
  },
  {
    name: "Elqui",
    region: "IV Coquimbo",
    country: "CL"
  },
  {
    name: "General Carrera",
    region: "XI Aisén",
    country: "CL"
  },
  {
    name: "Huasco",
    region: "III Atacama",
    country: "CL"
  },
  {
    name: "Iquique",
    region: "I Tarapacá",
    country: "CL"
  },
  {
    name: "Isla de Pascua",
    region: "V Valparaíso",
    country: "CL"
  },
  {
    name: "Limarí",
    region: "IV Coquimbo",
    country: "CL"
  },
  {
    name: "Linares",
    region: "VII Maule",
    country: "CL"
  },
  {
    name: "Llanquihue",
    region: "X Los Lagos",
    country: "CL"
  },
  {
    name: "Los Andes",
    region: "V Valparaíso",
    country: "CL"
  },
  {
    name: "Magallanes",
    region: "XII Magallanes",
    country: "CL"
  },
  {
    name: "Maipo",
    region: "RM Santiago Metropolitan",
    country: "CL"
  },
  {
    name: "Malleco",
    region: "IX Araucanía",
    country: "CL"
  },
  {
    name: "Marga Marga",
    region: "V Valparaíso",
    country: "CL"
  },
  {
    name: "Melipilla",
    region: "RM Santiago Metropolitan",
    country: "CL"
  },
  {
    name: "Osorno",
    region: "X Los Lagos",
    country: "CL"
  },
  {
    name: "Palena",
    region: "X Los Lagos",
    country: "CL"
  },
  {
    name: "Parinacota",
    region: "XV Arica and Parinacota",
    country: "CL"
  },
  {
    name: "Petorca",
    region: "V Valparaíso",
    country: "CL"
  },
  {
    name: "Quillota",
    region: "V Valparaíso",
    country: "CL"
  },
  {
    name: "Ranco",
    region: "XIV Los Ríos",
    country: "CL"
  },
  {
    name: "San Antonio",
    region: "V Valparaíso",
    country: "CL"
  },
  {
    name: "San Felipe de Aconcagua",
    region: "V Valparaíso",
    country: "CL"
  },
  {
    name: "Santiago",
    region: "RM Santiago Metropolitan",
    country: "CL"
  },
  {
    name: "Talagante",
    region: "RM Santiago Metropolitan",
    country: "CL"
  },
  {
    name: "Talca",
    region: "VII Maule",
    country: "CL"
  },
  {
    name: "Tamarugal",
    region: "I Tarapacá",
    country: "CL"
  },
  {
    name: "Tierra del Fuego",
    region: "XII Magallanes",
    country: "CL"
  },
  {
    name: "Tocopilla",
    region: "II Antofagasta",
    country: "CL"
  },
  {
    name: "Ultima Esperanza",
    region: "XII Magallanes",
    country: "CL"
  },
  {
    name: "Valdivia",
    region: "XIV Los Ríos",
    country: "CL"
  },
  {
    name: "Valparaíso",
    region: "V Valparaíso",
    country: "CL"
  },
  {
    name: "Ñuble",
    region: "VIII Biobío",
    country: "CL"
  },
  {
    name: "Abel Iturralde",
    region: "La Paz",
    country: "BO"
  },
  {
    name: "Abuná",
    region: "Pando",
    country: "BO"
  },
  {
    name: "Alonso de Ibáñez",
    region: "Potosí",
    country: "BO"
  },
  {
    name: "Andrés Ibáñez",
    region: "Santa Cruz",
    country: "BO"
  },
  {
    name: "Aniceto Arce",
    region: "Tarija",
    country: "BO"
  },
  {
    name: "Antonio Quijarro",
    region: "Potosí",
    country: "BO"
  },
  {
    name: "Arani",
    region: "Cochabamba",
    country: "BO"
  },
  {
    name: "Aroma",
    region: "La Paz",
    country: "BO"
  },
  {
    name: "Arque",
    region: "Cochabamba",
    country: "BO"
  },
  {
    name: "Atahuallpa",
    region: "Oruro",
    country: "BO"
  },
  {
    name: "Ayopaya",
    region: "Cochabamba",
    country: "BO"
  },
  {
    name: "Azurduy",
    region: "Chuquisaca",
    country: "BO"
  },
  {
    name: "Bautista Saavedra",
    region: "La Paz",
    country: "BO"
  },
  {
    name: "Belisario Boeto",
    region: "Chuquisaca",
    country: "BO"
  },
  {
    name: "Bernardino Bilbao",
    region: "Potosí",
    country: "BO"
  },
  {
    name: "Bolívar",
    region: "Cochabamba",
    country: "BO"
  },
  {
    name: "Burnet O'Connor",
    region: "Tarija",
    country: "BO"
  },
  {
    name: "Campero",
    region: "Cochabamba",
    country: "BO"
  },
  {
    name: "Capinota",
    region: "Cochabamba",
    country: "BO"
  },
  {
    name: "Caranavi",
    region: "La Paz",
    country: "BO"
  },
  {
    name: "Carangas",
    region: "Oruro",
    country: "BO"
  },
  {
    name: "Carrasco",
    region: "Cochabamba",
    country: "BO"
  },
  {
    name: "Cercado",
    region: "Beni",
    country: "BO"
  },
  {
    name: "Cercado",
    region: "Cochabamba",
    country: "BO"
  },
  {
    name: "Cercado",
    region: "Oruro",
    country: "BO"
  },
  {
    name: "Cercado",
    region: "Tarija",
    country: "BO"
  },
  {
    name: "Chapare",
    region: "Cochabamba",
    country: "BO"
  },
  {
    name: "Charcas",
    region: "Potosí",
    country: "BO"
  },
  {
    name: "Chayanta",
    region: "Potosí",
    country: "BO"
  },
  {
    name: "Chiquitos",
    region: "Santa Cruz",
    country: "BO"
  },
  {
    name: "Cordillera",
    region: "Santa Cruz",
    country: "BO"
  },
  {
    name: "Cornelio Saavedra",
    region: "Potosí",
    country: "BO"
  },
  {
    name: "Daniel Campos",
    region: "Potosí",
    country: "BO"
  },
  {
    name: "Eduardo Avaroa",
    region: "Oruro",
    country: "BO"
  },
  {
    name: "Eliodoro Camacho",
    region: "La Paz",
    country: "BO"
  },
  {
    name: "Enrique Baldivieso",
    region: "Potosí",
    country: "BO"
  },
  {
    name: "Esteban Arce",
    region: "Cochabamba",
    country: "BO"
  },
  {
    name: "Eustaquio Méndez",
    region: "Tarija",
    country: "BO"
  },
  {
    name: "Federico Román",
    region: "Pando",
    country: "BO"
  },
  {
    name: "Florida",
    region: "Santa Cruz",
    country: "BO"
  },
  {
    name: "Franz Tamayo",
    region: "La Paz",
    country: "BO"
  },
  {
    name: "Germán Busch",
    region: "Santa Cruz",
    country: "BO"
  },
  {
    name: "Germán Jordán",
    region: "Cochabamba",
    country: "BO"
  },
  {
    name: "Gran Chaco",
    region: "Tarija",
    country: "BO"
  },
  {
    name: "Gualberto Villarroel",
    region: "La Paz",
    country: "BO"
  },
  {
    name: "Guarayos",
    region: "Santa Cruz",
    country: "BO"
  },
  {
    name: "Hernando Siles",
    region: "Chuquisaca",
    country: "BO"
  },
  {
    name: "Ichilo",
    region: "Santa Cruz",
    country: "BO"
  },
  {
    name: "Ignacio Warnes",
    region: "Santa Cruz",
    country: "BO"
  },
  {
    name: "Ingavi",
    region: "La Paz",
    country: "BO"
  },
  {
    name: "Inquisivi",
    region: "La Paz",
    country: "BO"
  },
  {
    name: "Iténez",
    region: "Beni",
    country: "BO"
  },
  {
    name: "Jaime Zudáñez",
    region: "Chuquisaca",
    country: "BO"
  },
  {
    name: "José Ballivián",
    region: "Beni",
    country: "BO"
  },
  {
    name: "José Manuel Pando",
    region: "La Paz",
    country: "BO"
  },
  {
    name: "José María Avilés",
    region: "Tarija",
    country: "BO"
  },
  {
    name: "José María Linares",
    region: "Potosí",
    country: "BO"
  },
  {
    name: "José Miguel de Velasco",
    region: "Santa Cruz",
    country: "BO"
  },
  {
    name: "Ladislao Cabrera",
    region: "Oruro",
    country: "BO"
  },
  {
    name: "Larecaja",
    region: "La Paz",
    country: "BO"
  },
  {
    name: "Litoral",
    region: "Oruro",
    country: "BO"
  },
  {
    name: "Loayza",
    region: "La Paz",
    country: "BO"
  },
  {
    name: "Los Andes",
    region: "La Paz",
    country: "BO"
  },
  {
    name: "Luis Calvo",
    region: "Chuquisaca",
    country: "BO"
  },
  {
    name: "Madre de Dios",
    region: "Pando",
    country: "BO"
  },
  {
    name: "Mamoré",
    region: "Beni",
    country: "BO"
  },
  {
    name: "Manco Kapac",
    region: "La Paz",
    country: "BO"
  },
  {
    name: "Manuel María Caballero",
    region: "Santa Cruz",
    country: "BO"
  },
  {
    name: "Manuripi",
    region: "Pando",
    country: "BO"
  },
  {
    name: "Marbán",
    region: "Beni",
    country: "BO"
  },
  {
    name: "Mizque",
    region: "Cochabamba",
    country: "BO"
  },
  {
    name: "Modesto Omiste",
    region: "Potosí",
    country: "BO"
  },
  {
    name: "Moxos",
    region: "Beni",
    country: "BO"
  },
  {
    name: "Murillo",
    region: "La Paz",
    country: "BO"
  },
  {
    name: "Muñecas",
    region: "La Paz",
    country: "BO"
  },
  {
    name: "Nicolás Suárez",
    region: "Pando",
    country: "BO"
  },
  {
    name: "Nor Carangas",
    region: "Oruro",
    country: "BO"
  },
  {
    name: "Nor Chichas",
    region: "Potosí",
    country: "BO"
  },
  {
    name: "Nor Cinti",
    region: "Chuquisaca",
    country: "BO"
  },
  {
    name: "Nor Lípez",
    region: "Potosí",
    country: "BO"
  },
  {
    name: "Nor Yungas",
    region: "La Paz",
    country: "BO"
  },
  {
    name: "Obispo Santistevan",
    region: "Santa Cruz",
    country: "BO"
  },
  {
    name: "Omasuyos",
    region: "La Paz",
    country: "BO"
  },
  {
    name: "Oropeza",
    region: "Chuquisaca",
    country: "BO"
  },
  {
    name: "Pacajes",
    region: "La Paz",
    country: "BO"
  },
  {
    name: "Pantaléon Dalence",
    region: "Oruro",
    country: "BO"
  },
  {
    name: "Poopó",
    region: "Oruro",
    country: "BO"
  },
  {
    name: "Puerto de Mejillones",
    region: "Oruro",
    country: "BO"
  },
  {
    name: "Punata",
    region: "Cochabamba",
    country: "BO"
  },
  {
    name: "Quillacollo",
    region: "Cochabamba",
    country: "BO"
  },
  {
    name: "Rafael Bustillo",
    region: "Potosí",
    country: "BO"
  },
  {
    name: "Sajama",
    region: "Oruro",
    country: "BO"
  },
  {
    name: "San Pedro de Totora",
    region: "Oruro",
    country: "BO"
  },
  {
    name: "Sara",
    region: "Santa Cruz",
    country: "BO"
  },
  {
    name: "Saucarí",
    region: "Oruro",
    country: "BO"
  },
  {
    name: "Sebastián Pagador",
    region: "Oruro",
    country: "BO"
  },
  {
    name: "Sud Carangas",
    region: "Oruro",
    country: "BO"
  },
  {
    name: "Sud Cinti",
    region: "Chuquisaca",
    country: "BO"
  },
  {
    name: "Sud Yungas",
    region: "La Paz",
    country: "BO"
  },
  {
    name: "Sur Chichas",
    region: "Potosí",
    country: "BO"
  },
  {
    name: "Sur Lípez",
    region: "Potosí",
    country: "BO"
  },
  {
    name: "Tapacarí",
    region: "Cochabamba",
    country: "BO"
  },
  {
    name: "Tiraque",
    region: "Cochabamba",
    country: "BO"
  },
  {
    name: "Tomas Barrón",
    region: "Oruro",
    country: "BO"
  },
  {
    name: "Tomina",
    region: "Chuquisaca",
    country: "BO"
  },
  {
    name: "Tomás Frías",
    region: "Potosí",
    country: "BO"
  },
  {
    name: "Vaca Díez",
    region: "Beni",
    country: "BO"
  },
  {
    name: "Vallegrande",
    region: "Santa Cruz",
    country: "BO"
  },
  {
    name: "Yacuma",
    region: "Beni",
    country: "BO"
  },
  {
    name: "Yamparáez",
    region: "Chuquisaca",
    country: "BO"
  },
  {
    name: "Ángel Sandoval",
    region: "Santa Cruz",
    country: "BO"
  },
  {
    name: "Ñuflo de Chávez",
    region: "Santa Cruz",
    country: "BO"
  },
  {
    name: "Albacete",
    short: "AB",
    country: "ES"
  },
  {
    name: "Alicante",
    short: "A",
    country: "ES"
  },
  {
    name: "Almeria",
    short: "AL",
    country: "ES"
  },
  {
    name: "Badajoz",
    short: "BA",
    country: "ES"
  },
  {
    name: "Barcelona",
    short: "B",
    country: "ES"
  },
  {
    name: "Burgos",
    short: "BU",
    country: "ES"
  },
  {
    name: "Castellón",
    short: "CS",
    country: "ES"
  },
  {
    name: "Ciudad Real",
    short: "CR",
    country: "ES"
  },
  {
    name: "Cuenca",
    short: "CU",
    country: "ES"
  },
  {
    name: "Cáceres",
    short: "CC",
    country: "ES"
  },
  {
    name: "Cádiz",
    short: "CA",
    country: "ES"
  },
  {
    name: "Córdoba",
    short: "CO",
    country: "ES"
  },
  {
    name: "Gerona",
    short: "GI",
    country: "ES"
  },
  {
    name: "Granada",
    short: "GR",
    country: "ES"
  },
  {
    name: "Guadalajara",
    short: "GU",
    country: "ES"
  },
  {
    name: "Guipúzcoa",
    short: "SS",
    country: "ES"
  },
  {
    name: "Huelva",
    short: "H",
    country: "ES"
  },
  {
    name: "Huesca",
    short: "HU",
    country: "ES"
  },
  {
    name: "Jaén",
    short: "J",
    country: "ES"
  },
  {
    name: "La Coruña",
    short: "C",
    country: "ES"
  },
  {
    name: "La Rioja",
    short: "LO",
    country: "ES"
  },
  {
    name: "Las Palmas",
    short: "GC",
    country: "ES"
  },
  {
    name: "León",
    short: "LE",
    country: "ES"
  },
  {
    name: "Lugo",
    short: "LU",
    country: "ES"
  },
  {
    name: "Lérida",
    short: "L",
    country: "ES"
  },
  {
    name: "Madrid",
    short: "M",
    country: "ES"
  },
  {
    name: "Murcia",
    short: "MU",
    country: "ES"
  },
  {
    name: "Málaga",
    short: "MA",
    country: "ES"
  },
  {
    name: "Orense",
    short: "OU",
    country: "ES"
  },
  {
    name: "Palencia",
    short: "P",
    country: "ES"
  },
  {
    name: "Pontevedra",
    short: "PO",
    country: "ES"
  },
  {
    name: "Salamanca",
    short: "SA",
    country: "ES"
  },
  {
    name: "Segovia",
    short: "SG",
    country: "ES"
  },
  {
    name: "Sevilla",
    short: "SE",
    country: "ES"
  },
  {
    name: "Soria",
    short: "SO",
    country: "ES"
  },
  {
    name: "Tarragona",
    short: "T",
    country: "ES"
  },
  {
    name: "Tenerife",
    short: "TF",
    country: "ES"
  },
  {
    name: "Teruel",
    short: "TE",
    country: "ES"
  },
  {
    name: "Toledo",
    short: "TO",
    country: "ES"
  },
  {
    name: "Valencia",
    short: "V",
    country: "ES"
  },
  {
    name: "Valladolid",
    short: "VA",
    country: "ES"
  },
  {
    name: "Vizcaya",
    short: "BI",
    country: "ES"
  },
  {
    name: "Zamora",
    short: "ZA",
    country: "ES"
  },
  {
    name: "Zaragoza",
    short: "Z",
    country: "ES"
  },
  {
    name: "Álava",
    short: "VI",
    country: "ES"
  },
  {
    name: "Ávila",
    short: "AV",
    country: "ES"
  },
  {
    name: "কক্সবাজার",
    english: "Cox's Bazar",
    region: "Chittagong",
    country: "BD"
  },
  {
    name: "কিশোরগঞ্জ",
    english: "Kishoreganj",
    region: "Dhaka",
    country: "BD"
  },
  {
    name: "কুড়িগ্রাম",
    english: "Kurigram",
    region: "Rangpur",
    country: "BD"
  },
  {
    name: "কুমিল্লা",
    english: "Comilla",
    region: "Chittagong",
    country: "BD"
  },
  {
    name: "কুষ্টিয়া",
    english: "Kushtia",
    region: "Khulna",
    country: "BD"
  },
  {
    name: "খাগড়াছড়ি",
    english: "Khagrachhari",
    region: "Chittagong",
    country: "BD"
  },
  {
    name: "খুলনা",
    english: "Khulna",
    region: "Khulna",
    country: "BD"
  },
  {
    name: "গাইবান্ধা",
    english: "Gaibandha",
    region: "Rangpur",
    country: "BD"
  },
  {
    name: "গাজীপুর",
    english: "Gazipur",
    region: "Dhaka",
    country: "BD"
  },
  {
    name: "গোপালগঞ্জ",
    english: "Gopalganj",
    region: "Dhaka",
    country: "BD"
  },
  {
    name: "চট্টগ্রাম",
    english: "Chittagong",
    region: "Chittagong",
    country: "BD"
  },
  {
    name: "চাঁদপুর",
    english: "Chandpur",
    region: "Chittagong",
    country: "BD"
  },
  {
    name: "চুয়াডাঙ্গা",
    english: "Chuadanga",
    region: "Khulna",
    country: "BD"
  },
  {
    name: "জয়পুরহাট",
    english: "Joypurhat",
    region: "Rajshahi",
    country: "BD"
  },
  {
    name: "জামালপুর",
    english: "Jamalpur",
    region: "Dhaka",
    country: "BD"
  },
  {
    name: "ঝালকাঠি",
    english: "Jhalokati",
    region: "Barisal",
    country: "BD"
  },
  {
    name: "ঝিনাইদহ",
    english: "Jhenaidah",
    region: "Khulna",
    country: "BD"
  },
  {
    name: "টাঙ্গাইল",
    english: "Tangail",
    region: "Dhaka",
    country: "BD"
  },
  {
    name: "ঠাকুরগাঁ",
    english: "Thakurgaon",
    region: "Rangpur",
    country: "BD"
  },
  {
    name: "ঢাকা",
    english: "Dhaka",
    region: "Dhaka",
    country: "BD"
  },
  {
    name: "দিনাজপুর",
    english: "Dinajpur",
    region: "Rangpur",
    country: "BD"
  },
  {
    name: "নওগাঁ",
    english: "Naogaon",
    region: "Rajshahi",
    country: "BD"
  },
  {
    name: "নওয়াবগঞ্জ",
    english: "Chapainawabganj",
    region: "Rajshahi",
    country: "BD"
  },
  {
    name: "নড়াইল",
    english: "Narail",
    region: "Khulna",
    country: "BD"
  },
  {
    name: "নরসিংদী",
    english: "Narsingdi",
    region: "Dhaka",
    country: "BD"
  },
  {
    name: "নাটোর",
    english: "Natore",
    region: "Rajshahi",
    country: "BD"
  },
  {
    name: "নারায়ণগঞ্জ",
    english: "Narayanganj",
    region: "Dhaka",
    country: "BD"
  },
  {
    name: "নীলফামারী",
    english: "Nilphamari",
    region: "Rangpur",
    country: "BD"
  },
  {
    name: "নেত্রকোনা",
    english: "Netrakona",
    region: "Dhaka",
    country: "BD"
  },
  {
    name: "নোয়াখালী",
    english: "Noakhali",
    region: "Chittagong",
    country: "BD"
  },
  {
    name: "পঞ্চগড়",
    english: "Panchagarh",
    region: "Rangpur",
    country: "BD"
  },
  {
    name: "পটুয়াখালী",
    english: "Patuakhali",
    region: "Barisal",
    country: "BD"
  },
  {
    name: "পাবনা",
    english: "Pabna",
    region: "Rajshahi",
    country: "BD"
  },
  {
    name: "পিরোজপুর",
    english: "Pirojpur",
    region: "Barisal",
    country: "BD"
  },
  {
    name: "ফরিদপুর",
    english: "Faridpur",
    region: "Dhaka",
    country: "BD"
  },
  {
    name: "ফেনী",
    english: "Feni",
    region: "Chittagong",
    country: "BD"
  },
  {
    name: "বগুড়া",
    english: "Bogra",
    region: "Rajshahi",
    country: "BD"
  },
  {
    name: "বরগুনা",
    english: "Barguna",
    region: "Barisal",
    country: "BD"
  },
  {
    name: "বরিশাল",
    english: "Barisal",
    region: "Barisal",
    country: "BD"
  },
  {
    name: "বাগেরহাট",
    english: "Bagerhat",
    region: "Khulna",
    country: "BD"
  },
  {
    name: "বান্দরবান",
    english: "Bandarban",
    region: "Chittagong",
    country: "BD"
  },
  {
    name: "ব্রাহ্মণবাড়ীয়া",
    english: "Brahmanbaria",
    region: "Chittagong",
    country: "BD"
  },
  {
    name: "ভোলা",
    english: "Bhola",
    region: "Barisal",
    country: "BD"
  },
  {
    name: "ময়মনসিংহ",
    english: "Mymensingh",
    region: "Dhaka",
    country: "BD"
  },
  {
    name: "মাগুরা",
    english: "Magura",
    region: "Khulna",
    country: "BD"
  },
  {
    name: "মাদারীপুর",
    english: "Madaripur",
    region: "Dhaka",
    country: "BD"
  },
  {
    name: "মানিকগঞ্জ",
    english: "Manikganj",
    region: "Dhaka",
    country: "BD"
  },
  {
    name: "মুন্সীগঞ্জ",
    english: "Munshiganj",
    region: "Dhaka",
    country: "BD"
  },
  {
    name: "মেহেরপুর",
    english: "Meherpur",
    region: "Khulna",
    country: "BD"
  },
  {
    name: "মৌলভীবাজার",
    english: "Moulvibazar",
    region: "Sylhet",
    country: "BD"
  },
  {
    name: "যশোর",
    english: "Jessore",
    region: "Khulna",
    country: "BD"
  },
  {
    name: "রংপুর",
    english: "Rangpur",
    region: "Rangpur",
    country: "BD"
  },
  {
    name: "রাঙ্গামাটি",
    english: "Rangamati",
    region: "Chittagong",
    country: "BD"
  },
  {
    name: "রাজবাড়ী",
    english: "Rajbari",
    region: "Dhaka",
    country: "BD"
  },
  {
    name: "রাজশাহী",
    english: "Rajshahi",
    region: "Rajshahi",
    country: "BD"
  },
  {
    name: "লক্ষীপুর",
    english: "Lakshmipur",
    region: "Chittagong",
    country: "BD"
  },
  {
    name: "লালমনিরহাট",
    english: "Lalmonirhat",
    region: "Rangpur",
    country: "BD"
  },
  {
    name: "শরীয়তপুর",
    english: "Shariatpur",
    region: "Dhaka",
    country: "BD"
  },
  {
    name: "শেরপুর",
    english: "Sherpur",
    region: "Dhaka",
    country: "BD"
  },
  {
    name: "সাতক্ষিরা",
    english: "Satkhira",
    region: "Khulna",
    country: "BD"
  },
  {
    name: "সিরাজগঞ্জ",
    english: "Sirajganj",
    region: "Rajshahi",
    country: "BD"
  },
  {
    name: "সিলেট",
    english: "Sylhet",
    region: "Sylhet",
    country: "BD"
  },
  {
    name: "সুনামগঞ্জ",
    english: "Sunamganj",
    region: "Sylhet",
    country: "BD"
  },
  {
    name: "হবিগঞ্জ",
    english: "Habiganj",
    region: "Sylhet",
    country: "BD"
  },
  {
    name: "Azad Kashmir",
    country: "PK"
  },
  {
    name: "Bahawalpur",
    country: "PK"
  },
  {
    name: "Bannu",
    country: "PK"
  },
  {
    name: "Dera Ghazi Khan",
    country: "PK"
  },
  {
    name: "Dera Ismail Khan",
    country: "PK"
  },
  {
    name: "F.A.T.A.",
    country: "PK"
  },
  {
    name: "Faisalabad",
    country: "PK"
  },
  {
    name: "Gujranwala",
    country: "PK"
  },
  {
    name: "Hazara",
    country: "PK"
  },
  {
    name: "Hyderabad",
    country: "PK"
  },
  {
    name: "Islamabad",
    country: "PK"
  },
  {
    name: "Kalat",
    country: "PK"
  },
  {
    name: "Karachi",
    country: "PK"
  },
  {
    name: "Kohat",
    country: "PK"
  },
  {
    name: "Lahore",
    country: "PK"
  },
  {
    name: "Larkana",
    country: "PK"
  },
  {
    name: "Makran",
    country: "PK"
  },
  {
    name: "Malakand",
    country: "PK"
  },
  {
    name: "Mardan",
    country: "PK"
  },
  {
    name: "Mirpur Khas",
    country: "PK"
  },
  {
    name: "Multan",
    country: "PK"
  },
  {
    name: "Nasirabad",
    country: "PK"
  },
  {
    name: "Northern Areas",
    country: "PK"
  },
  {
    name: "Peshawar",
    country: "PK"
  },
  {
    name: "Quetta",
    country: "PK"
  },
  {
    name: "Rawalpindi",
    country: "PK"
  },
  {
    name: "Sahiwal",
    country: "PK"
  },
  {
    name: "Sargodha",
    country: "PK"
  },
  {
    name: "Sibi",
    country: "PK"
  },
  {
    name: "Sukkur",
    country: "PK"
  },
  {
    name: "Zhob",
    country: "PK"
  },
  {
    name: "Abia",
    country: "NG"
  },
  {
    name: "Adamawa",
    country: "NG"
  },
  {
    name: "Akwa Ibom",
    country: "NG"
  },
  {
    name: "Anambra",
    country: "NG"
  },
  {
    name: "Bauchi",
    country: "NG"
  },
  {
    name: "Bayelsa",
    country: "NG"
  },
  {
    name: "Benue",
    country: "NG"
  },
  {
    name: "Borno",
    country: "NG"
  },
  {
    name: "Cross River",
    country: "NG"
  },
  {
    name: "Delta",
    country: "NG"
  },
  {
    name: "Ebonyi",
    country: "NG"
  },
  {
    name: "Enugu",
    country: "NG"
  },
  {
    name: "三重県",
    english: "Mie",
    country: "JP"
  },
  {
    name: "京都府",
    english: "Kyōto",
    country: "JP"
  },
  {
    name: "佐賀県",
    english: "Saga",
    country: "JP"
  },
  {
    name: "兵庫県",
    english: "Hyōgo",
    country: "JP"
  },
  {
    name: "北海道",
    english: "Hokkaidō",
    country: "JP"
  },
  {
    name: "千葉県",
    english: "Chiba",
    country: "JP"
  },
  {
    name: "和歌山県",
    english: "Wakayama",
    country: "JP"
  },
  {
    name: "埼玉県",
    english: "Saitama",
    country: "JP"
  },
  {
    name: "大分県",
    english: "Ōita",
    country: "JP"
  },
  {
    name: "大阪府",
    english: "Ōsaka",
    country: "JP"
  },
  {
    name: "奈良県",
    english: "Nara",
    country: "JP"
  },
  {
    name: "宮城県",
    english: "Miyagi",
    country: "JP"
  },
  {
    name: "宮崎県",
    english: "Miyazaki",
    country: "JP"
  },
  {
    name: "富山県",
    english: "Toyama",
    country: "JP"
  },
  {
    name: "山口県",
    english: "Yamaguchi",
    country: "JP"
  },
  {
    name: "山形県",
    english: "Yamagata",
    country: "JP"
  },
  {
    name: "山梨県",
    english: "Yamanashi",
    country: "JP"
  },
  {
    name: "岐阜県",
    english: "Gifu",
    country: "JP"
  },
  {
    name: "岡山県",
    english: "Okayama",
    country: "JP"
  },
  {
    name: "岩手県",
    english: "Iwate",
    country: "JP"
  },
  {
    name: "島根県",
    english: "Shimane",
    country: "JP"
  },
  {
    name: "広島県",
    english: "Hiroshima",
    country: "JP"
  },
  {
    name: "徳島県",
    english: "Tokushima",
    country: "JP"
  },
  {
    name: "愛媛県",
    english: "Ehime",
    country: "JP"
  },
  {
    name: "愛知県",
    english: "Aichi",
    country: "JP"
  },
  {
    name: "新潟県",
    english: "Niigata",
    country: "JP"
  },
  {
    name: "東京都",
    english: "Tōkyō",
    country: "JP"
  },
  {
    name: "栃木県",
    english: "Tochigi",
    country: "JP"
  },
  {
    name: "沖縄県",
    english: "Okinawa",
    country: "JP"
  },
  {
    name: "滋賀県",
    english: "Shiga",
    country: "JP"
  },
  {
    name: "熊本県",
    english: "Kumamoto",
    country: "JP"
  },
  {
    name: "石川県",
    english: "Ishikawa",
    country: "JP"
  },
  {
    name: "神奈川県",
    english: "Kanagawa",
    country: "JP"
  },
  {
    name: "福井県",
    english: "Fukui",
    country: "JP"
  },
  {
    name: "福岡県",
    english: "Fukuoka",
    country: "JP"
  },
  {
    name: "福島県",
    english: "Fukushima",
    country: "JP"
  },
  {
    name: "秋田県",
    english: "Akita",
    country: "JP"
  },
  {
    name: "群馬県",
    english: "Gunma",
    country: "JP"
  },
  {
    name: "茨城県",
    english: "Ibaraki",
    country: "JP"
  },
  {
    name: "長崎県",
    english: "Nagasaki",
    country: "JP"
  },
  {
    name: "長野県",
    english: "Nagano",
    country: "JP"
  },
  {
    name: "青森県",
    english: "Aomori",
    country: "JP"
  },
  {
    name: "静岡県",
    english: "Shizuoka",
    country: "JP"
  },
  {
    name: "香川県",
    english: "Kagawa",
    country: "JP"
  },
  {
    name: "高知県",
    english: "Kōchi",
    country: "JP"
  },
  {
    name: "鳥取県",
    english: "Tottori",
    country: "JP"
  },
  {
    name: "鹿児島県",
    english: "Kagoshima",
    country: "JP"
  },
  {
    short: "B",
    name: "Burgenland",
    country: "AT"
  },
  {
    short: "K",
    name: "Kärnten",
    country: "AT"
  },
  {
    short: "NÖ",
    name: "Niederösterreich",
    country: "AT"
  },
  {
    short: "OÖ",
    name: "Oberösterreich",
    country: "AT"
  },
  {
    short: "S",
    name: "Salzburg",
    country: "AT"
  },
  {
    short: "ST",
    name: "Steiermark",
    country: "AT"
  },
  {
    short: "T",
    name: "Tirol",
    country: "AT"
  },
  {
    short: "V",
    name: "Vorarlberg",
    country: "AT"
  },
  {
    short: "W",
    name: "Wien",
    country: "AT"
  },
  {
    short: "AC",
    name: "Acre",
    country: "BR"
  },
  {
    short: "AL",
    name: "Alagoas",
    country: "BR"
  },
  {
    short: "AP",
    name: "Amapá",
    country: "BR"
  },
  {
    short: "AM",
    name: "Amazonas",
    country: "BR"
  },
  {
    short: "BA",
    name: "Bahia",
    country: "BR"
  },
  {
    short: "CE",
    name: "Ceará",
    country: "BR"
  },
  {
    short: "DF",
    name: "Distrito Federal",
    country: "BR"
  },
  {
    short: "ES",
    name: "Espírito Santo",
    country: "BR"
  },
  {
    short: "GO",
    name: "Goiás",
    country: "BR"
  },
  {
    short: "MA",
    name: "Maranhão",
    country: "BR"
  },
  {
    short: "MT",
    name: "Mato Grosso",
    country: "BR"
  },
  {
    short: "MS",
    name: "Mato Grosso do Sul",
    country: "BR"
  },
  {
    short: "MG",
    name: "Minas Gerais",
    country: "BR"
  },
  {
    short: "PR",
    name: "Paraná",
    country: "BR"
  },
  {
    short: "PB",
    name: "Paraíba",
    country: "BR"
  },
  {
    short: "PA",
    name: "Pará",
    country: "BR"
  },
  {
    short: "PE",
    name: "Pernambuco",
    country: "BR"
  },
  {
    short: "PI",
    name: "Piauí",
    country: "BR"
  },
  {
    short: "RN",
    name: "Rio Grande do Norte",
    country: "BR"
  },
  {
    short: "RS",
    name: "Rio Grande do Sul",
    country: "BR"
  },
  {
    short: "RJ",
    name: "Rio de Janeiro",
    country: "BR"
  },
  {
    short: "RO",
    name: "Rondônia",
    country: "BR"
  },
  {
    short: "RR",
    name: "Roraima",
    country: "BR"
  },
  {
    short: "SC",
    name: "Santa Catarina",
    country: "BR"
  },
  {
    short: "SE",
    name: "Sergipe",
    country: "BR"
  },
  {
    short: "SP",
    name: "São Paulo",
    country: "BR"
  },
  {
    short: "TO",
    name: "Tocantins",
    country: "BR"
  },
  {
    name: "Abra",
    country: "PH"
  },
  {
    name: "Agusan del Norte",
    country: "PH"
  },
  {
    name: "Agusan del Sur",
    country: "PH"
  },
  {
    name: "Aklan",
    country: "PH"
  },
  {
    name: "Albay",
    country: "PH"
  },
  {
    name: "Antique",
    country: "PH"
  },
  {
    name: "Apayao",
    country: "PH"
  },
  {
    name: "Aurora",
    country: "PH"
  },
  {
    name: "Basilan",
    country: "PH"
  },
  {
    name: "Bataan",
    country: "PH"
  },
  {
    name: "Batanes",
    country: "PH"
  },
  {
    name: "Batangas",
    country: "PH"
  },
  {
    name: "Benguet",
    country: "PH"
  },
  {
    name: "Biliran",
    country: "PH"
  },
  {
    name: "Bohol",
    country: "PH"
  },
  {
    name: "Bukidnon",
    country: "PH"
  },
  {
    name: "Bulacan",
    country: "PH"
  },
  {
    name: "Cagayan",
    country: "PH"
  },
  {
    name: "Camarines Norte",
    country: "PH"
  },
  {
    name: "Camarines Sur",
    country: "PH"
  },
  {
    name: "Camiguin",
    country: "PH"
  },
  {
    name: "Capiz",
    country: "PH"
  },
  {
    name: "Catanduanes",
    country: "PH"
  },
  {
    name: "Cavite",
    country: "PH"
  },
  {
    name: "Cebu",
    country: "PH"
  },
  {
    name: "Compostela Valley",
    country: "PH"
  },
  {
    name: "Cotabato",
    country: "PH"
  },
  {
    name: "Davao Occidental",
    country: "PH"
  },
  {
    name: "Davao Oriental",
    country: "PH"
  },
  {
    name: "Davao del Norte",
    country: "PH"
  },
  {
    name: "Davao del Sur",
    country: "PH"
  },
  {
    name: "Dinagat Islands",
    country: "PH"
  },
  {
    name: "Eastern Samar",
    country: "PH"
  },
  {
    name: "Guimaras",
    country: "PH"
  },
  {
    name: "Ifugao",
    country: "PH"
  },
  {
    name: "Ilocos Norte",
    country: "PH"
  },
  {
    name: "Ilocos Sur",
    country: "PH"
  },
  {
    name: "Iloilo",
    country: "PH"
  },
  {
    name: "Isabela",
    country: "PH"
  },
  {
    name: "Kalinga",
    country: "PH"
  },
  {
    name: "La Union",
    country: "PH"
  },
  {
    name: "Laguna",
    country: "PH"
  },
  {
    name: "Lanao del Norte",
    country: "PH"
  },
  {
    name: "Lanao del Sur",
    country: "PH"
  },
  {
    name: "Leyte",
    country: "PH"
  },
  {
    name: "Maguindanao",
    country: "PH"
  },
  {
    name: "Marinduque",
    country: "PH"
  },
  {
    name: "Masbate",
    country: "PH"
  },
  {
    name: "Metro Manila",
    country: "PH"
  },
  {
    name: "Misamis Occidental",
    country: "PH"
  },
  {
    name: "Misamis Oriental",
    country: "PH"
  },
  {
    name: "Mountain Province",
    country: "PH"
  },
  {
    name: "Negros Occidental",
    country: "PH"
  },
  {
    name: "Negros Oriental",
    country: "PH"
  },
  {
    name: "Northern Samar",
    country: "PH"
  },
  {
    name: "Nueva Ecija",
    country: "PH"
  },
  {
    name: "Nueva Vizcaya",
    country: "PH"
  },
  {
    name: "Occidental Mindoro",
    country: "PH"
  },
  {
    name: "Oriental Mindoro",
    country: "PH"
  },
  {
    name: "Palawan",
    country: "PH"
  },
  {
    name: "Pampanga",
    country: "PH"
  },
  {
    name: "Pangasinan",
    country: "PH"
  },
  {
    name: "Quezon",
    country: "PH"
  },
  {
    name: "Quirino",
    country: "PH"
  },
  {
    name: "Rizal",
    country: "PH"
  },
  {
    name: "Romblon",
    country: "PH"
  },
  {
    name: "Samar",
    country: "PH"
  },
  {
    name: "Sarangani",
    country: "PH"
  },
  {
    name: "Siquijor",
    country: "PH"
  },
  {
    name: "Sorsogon",
    country: "PH"
  },
  {
    name: "South Cotabato",
    country: "PH"
  },
  {
    name: "Southern Leyte",
    country: "PH"
  },
  {
    name: "Sultan Kudarat",
    country: "PH"
  },
  {
    name: "Sulu",
    country: "PH"
  },
  {
    name: "Surigao del Norte",
    country: "PH"
  },
  {
    name: "Surigao del Sur",
    country: "PH"
  },
  {
    name: "Tarlac",
    country: "PH"
  },
  {
    name: "Tawi-Tawi",
    country: "PH"
  },
  {
    name: "Zambales",
    country: "PH"
  },
  {
    name: "Zamboanga Sibugay",
    country: "PH"
  },
  {
    name: "Zamboanga del Norte",
    country: "PH"
  },
  {
    name: "Zamboanga del Sur",
    country: "PH"
  },
  {
    name: "An Giang",
    country: "VN"
  },
  {
    name: "Bà Rịa–Vũng Tàu",
    country: "VN"
  },
  {
    name: "Bình Dương",
    country: "VN"
  },
  {
    name: "Bình Phước",
    country: "VN"
  },
  {
    name: "Bình Thuận",
    country: "VN"
  },
  {
    name: "Bình Định",
    country: "VN"
  },
  {
    name: "Bạc Liêu",
    country: "VN"
  },
  {
    name: "Bắc Giang",
    country: "VN"
  },
  {
    name: "Bắc Kạn",
    country: "VN"
  },
  {
    name: "Bắc Ninh",
    country: "VN"
  },
  {
    name: "Bến Tre",
    country: "VN"
  },
  {
    name: "Cao Bằng",
    country: "VN"
  },
  {
    name: "Cà Mau",
    country: "VN"
  },
  {
    name: "Cần Thơ",
    country: "VN"
  },
  {
    name: "Gia Lai",
    country: "VN"
  },
  {
    name: "Hà Giang",
    country: "VN"
  },
  {
    name: "Hà Nam",
    country: "VN"
  },
  {
    name: "Hà Nội",
    country: "VN"
  },
  {
    name: "Hà Tĩnh",
    country: "VN"
  },
  {
    name: "Hòa Bình",
    country: "VN"
  },
  {
    name: "Hưng Yên",
    country: "VN"
  },
  {
    name: "Hải Dương",
    country: "VN"
  },
  {
    name: "Hải Phòng",
    country: "VN"
  },
  {
    name: "Hậu Giang",
    country: "VN"
  },
  {
    name: "Khánh Hòa",
    country: "VN"
  },
  {
    name: "Kiên Giang",
    country: "VN"
  },
  {
    name: "Kon Tum",
    country: "VN"
  },
  {
    name: "Lai Châu",
    country: "VN"
  },
  {
    name: "Long An",
    country: "VN"
  },
  {
    name: "Lào Cai",
    country: "VN"
  },
  {
    name: "Lâm Đồng",
    country: "VN"
  },
  {
    name: "Lạng Sơn",
    country: "VN"
  },
  {
    name: "Nam Định",
    country: "VN"
  },
  {
    name: "Nghệ An",
    country: "VN"
  },
  {
    name: "Ninh Bình",
    country: "VN"
  },
  {
    name: "Ninh Thuận",
    country: "VN"
  },
  {
    name: "Phú Thọ",
    country: "VN"
  },
  {
    name: "Phú Yên",
    country: "VN"
  },
  {
    name: "Quảng Bình",
    country: "VN"
  },
  {
    name: "Quảng Nam",
    country: "VN"
  },
  {
    name: "Quảng Ngãi",
    country: "VN"
  },
  {
    name: "Quảng Ninh",
    country: "VN"
  },
  {
    name: "Quảng Trị",
    country: "VN"
  },
  {
    name: "Sóc Trăng",
    country: "VN"
  },
  {
    name: "Sơn La",
    country: "VN"
  },
  {
    name: "Thanh Hóa",
    country: "VN"
  },
  {
    name: "Thành phố Hồ Chí Minh",
    country: "VN"
  },
  {
    name: "Thái Bình",
    country: "VN"
  },
  {
    name: "Thái Nguyên",
    country: "VN"
  },
  {
    name: "Thừa Thiên–Huế",
    country: "VN"
  },
  {
    name: "Tiền Giang",
    country: "VN"
  },
  {
    name: "Trà Vinh",
    country: "VN"
  },
  {
    name: "Tuyên Quang",
    country: "VN"
  },
  {
    name: "Tây Ninh",
    country: "VN"
  },
  {
    name: "Vĩnh Long",
    country: "VN"
  },
  {
    name: "Vĩnh Phúc",
    country: "VN"
  },
  {
    name: "Yên Bái",
    country: "VN"
  },
  {
    name: "Điện Biên",
    country: "VN"
  },
  {
    name: "Đà Nẵng",
    country: "VN"
  },
  {
    name: "Đắk Lắk",
    country: "VN"
  },
  {
    name: "Đắk Nông",
    country: "VN"
  },
  {
    name: "Đồng Nai",
    country: "VN"
  },
  {
    name: "Đồng Tháp",
    country: "VN"
  }
];

/*
 * Code sorting state

var countryGrouped = _.groupBy(states, function(item) {
  return item.country;
})

_.keys(countryGrouped).forEach(function(countryKey) {

  countryGrouped[countryKey] = _.sortBy(countryGrouped[countryKey], "name");
});

var result = [];
_.values(countryGrouped).forEach(function(listResult) {
  result = result.concat(listResult);
});
console.log(JSON.stringify(result));

 */

export { COUNTRIES, STATES };
