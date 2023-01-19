export type RdfDataKey =
  | 'generation'
  | 'so2'
  | 'so2_not'
  | 'nox'
  | 'nox_not'
  | 'co2'
  | 'co2_not'
  | 'heat'
  | 'heat_not';

export type Pollutant = 'so2' | 'nox' | 'co2' | 'pm25' | 'vocs' | 'nh3';

export type RegionId =
  | 'CA'
  | 'CENT'
  | 'FL'
  | 'MIDA'
  | 'MIDW'
  | 'NCSC'
  | 'NE'
  | 'NW'
  | 'NY'
  | 'RM'
  | 'SE'
  | 'SW'
  | 'TE'
  | 'TN';

export type RegionName =
  | 'California'
  | 'Central'
  | 'Florida'
  | 'Mid-Atlantic'
  | 'Midwest'
  | 'Carolinas'
  | 'New England'
  | 'Northwest'
  | 'New York'
  | 'Rocky Mountains'
  | 'Southeast'
  | 'Southwest'
  | 'Texas'
  | 'Tennessee';

/**
 * NOTE: actual emissions for each region stored in the "Table 3: EGUs with
 * infrequent SO2 emission events" found in the "Library" sheet of the Excel
 * workbook. Even though we're only dealing with SO2 for now, this data
 * structure was set up to be flexible enough to handle a future scenario where
 * any of the other pollutants AVERT deals with have "infrequent emissions
 * events."
 *
 * NOTE: each region's percentage by state isn't stored in the Excel workbook,
 * but are stored in a separate Excel file titled:
 * "apportionment percentages for web AVERT.xlsx"
 */
export type Region = {
  id: RegionId;
  name: RegionName;
  lineLoss: number;
  offshoreWind: boolean;
  percentageByState: Partial<{ [key in StateId]: number }>;
  actualEmissions: Partial<{ [key in RdfDataKey]: number }>;
};

/**
 * NOTE: line loss values stored in "Table 2: T&D losses" found in the "Library"
 * sheet of the Excel workbook.
 */
const lineLoss = {
  texas: 0.0495352907853342,
  eastern: 0.0750240831578937,
  western: 0.0838715063900653,
};

export const regions: { [key in RegionId]: Region } = {
  CA: {
    id: 'CA',
    name: 'California',
    lineLoss: lineLoss.western,
    offshoreWind: true,
    percentageByState: {
      CA: 100,
    },
    actualEmissions: {},
  },
  CENT: {
    id: 'CENT',
    name: 'Central',
    lineLoss: lineLoss.eastern,
    offshoreWind: false,
    percentageByState: {
      AR: 5.361,
      IA: 1.2499,
      KS: 17.305,
      LA: 2.8219,
      MN: 0.3663,
      MO: 11.7665,
      MT: 0.454,
      ND: 3.9954,
      NE: 12.2171,
      NM: 3.4604,
      OK: 25.3741,
      SD: 2.6437,
      TX: 12.9846,
    },
    actualEmissions: {},
  },
  FL: {
    id: 'FL',
    name: 'Florida',
    lineLoss: lineLoss.eastern,
    offshoreWind: false,
    percentageByState: {
      FL: 100,
    },
    actualEmissions: {
      so2: 32_186_626,
    },
  },
  MIDA: {
    id: 'MIDA',
    name: 'Mid-Atlantic',
    lineLoss: lineLoss.eastern,
    offshoreWind: true,
    percentageByState: {
      DC: 1.4882,
      DE: 1.5426,
      IL: 12.1879,
      IN: 2.9095,
      KY: 2.9954,
      MD: 8.1352,
      MI: 0.5324,
      NC: 0.7545,
      NJ: 9.9218,
      OH: 20.0366,
      PA: 19.5105,
      TN: 0.2736,
      VA: 15.3029,
      WV: 4.4088,
    },
    actualEmissions: {},
  },
  MIDW: {
    id: 'MIDW',
    name: 'Midwest',
    lineLoss: lineLoss.eastern,
    offshoreWind: false,
    percentageByState: {
      AR: 5.2128,
      IA: 6.8647,
      IL: 7.0728,
      IN: 11.6854,
      KY: 6.0317,
      LA: 12.4436,
      MI: 14.3632,
      MN: 9.666,
      MO: 7.621,
      MS: 3.188,
      ND: 1.5628,
      OK: 0.422,
      SD: 0.4669,
      TX: 3.2878,
      WI: 10.1114,
    },
    actualEmissions: {},
  },
  NCSC: {
    id: 'NCSC',
    name: 'Carolinas',
    lineLoss: lineLoss.eastern,
    offshoreWind: true,
    percentageByState: {
      NC: 61.6987,
      SC: 38.3013,
    },
    actualEmissions: {},
  },
  NE: {
    id: 'NE',
    name: 'New England',
    lineLoss: lineLoss.eastern,
    offshoreWind: true,
    percentageByState: {
      CT: 24.3049,
      MA: 44.9153,
      ME: 10.4142,
      NH: 9.3112,
      RI: 6.3922,
      VT: 4.6622,
    },
    actualEmissions: {},
  },
  NY: {
    id: 'NY',
    name: 'New York',
    lineLoss: lineLoss.eastern,
    offshoreWind: true,
    percentageByState: {
      NY: 100,
    },
    actualEmissions: {
      so2: 3_060_272,
    },
  },
  NW: {
    id: 'NW',
    name: 'Northwest',
    lineLoss: lineLoss.western,
    offshoreWind: true,
    percentageByState: {
      ID: 9.3141,
      MT: 5.2909,
      NV: 14.7335,
      OR: 19.3499,
      UT: 11.9026,
      WA: 35.2925,
      WY: 4.1165,
    },
    actualEmissions: {},
  },
  RM: {
    id: 'RM',
    name: 'Rocky Mountains',
    lineLoss: lineLoss.western,
    offshoreWind: false,
    percentageByState: {
      CO: 81.2855,
      MT: 0.3505,
      NE: 1.8371,
      NM: 1.5781,
      SD: 4.5674,
      UT: 1.206,
      WY: 9.1754,
    },
    actualEmissions: {},
  },
  SE: {
    id: 'SE',
    name: 'Southeast',
    lineLoss: lineLoss.eastern,
    offshoreWind: false,
    percentageByState: {
      AL: 29.2135,
      FL: 5.8078,
      GA: 59.8372,
      MS: 5.1415,
    },
    actualEmissions: {},
  },
  SW: {
    id: 'SW',
    name: 'Southwest',
    lineLoss: lineLoss.western,
    offshoreWind: false,
    percentageByState: {
      AZ: 78.9209,
      NM: 14.6254,
      TX: 6.4536,
    },
    actualEmissions: {},
  },
  TE: {
    id: 'TE',
    name: 'Texas',
    lineLoss: lineLoss.texas,
    offshoreWind: false,
    percentageByState: {
      TX: 100,
    },
    actualEmissions: {},
  },
  TN: {
    id: 'TN',
    name: 'Tennessee',
    lineLoss: lineLoss.eastern,
    offshoreWind: false,
    percentageByState: {
      AL: 15.2087,
      GA: 2.1857,
      KY: 7.3385,
      MS: 10.4702,
      TN: 64.7969,
    },
    actualEmissions: {},
  },
};

export type StateId =
  | 'AL'
  | 'AR'
  | 'AZ'
  | 'CA'
  | 'CO'
  | 'CT'
  | 'DC'
  | 'DE'
  | 'FL'
  | 'GA'
  | 'IA'
  | 'ID'
  | 'IL'
  | 'IN'
  | 'KS'
  | 'KY'
  | 'LA'
  | 'MA'
  | 'MD'
  | 'ME'
  | 'MI'
  | 'MN'
  | 'MO'
  | 'MS'
  | 'MT'
  | 'NC'
  | 'ND'
  | 'NE'
  | 'NH'
  | 'NJ'
  | 'NM'
  | 'NV'
  | 'NY'
  | 'OH'
  | 'OK'
  | 'OR'
  | 'PA'
  | 'RI'
  | 'SC'
  | 'SD'
  | 'TN'
  | 'TX'
  | 'UT'
  | 'VA'
  | 'VT'
  | 'WA'
  | 'WI'
  | 'WV'
  | 'WY';

export type State = {
  id: StateId;
  name: string;
  percentageByRegion: Partial<{ [key in RegionId]: number }>;
};

/**
 * NOTE: each state's percentage by region stored in "Table 1: Percent of state
 * in each AVERT region" found in the "Library" sheet of the Excel workbook.
 */
export const states: { [key in StateId]: State } = {
  AL: {
    id: 'AL',
    name: 'Alabama',
    percentageByRegion: {
      SE: 74,
      TN: 26,
    },
  },
  AR: {
    id: 'AR',
    name: 'Arkansas',
    percentageByRegion: {
      MIDW: 74,
      CENT: 26,
    },
  },
  AZ: {
    id: 'AZ',
    name: 'Arizona',
    percentageByRegion: {
      SW: 100,
    },
  },
  CA: {
    id: 'CA',
    name: 'California',
    percentageByRegion: {
      CA: 100,
    },
  },
  CO: {
    id: 'CO',
    name: 'Colorado',
    percentageByRegion: {
      RM: 100,
    },
  },
  CT: {
    id: 'CT',
    name: 'Connecticut',
    percentageByRegion: {
      NE: 100,
    },
  },
  DC: {
    id: 'DC',
    name: 'District of Columbia',
    percentageByRegion: {
      MIDA: 100,
    },
  },
  DE: {
    id: 'DE',
    name: 'Delaware',
    percentageByRegion: {
      MIDA: 100,
    },
  },
  FL: {
    id: 'FL',
    name: 'Florida',
    percentageByRegion: {
      SE: 6,
      FL: 94,
    },
  },
  GA: {
    id: 'GA',
    name: 'Georgia',
    percentageByRegion: {
      SE: 98,
      TN: 2,
    },
  },
  IA: {
    id: 'IA',
    name: 'Iowa',
    percentageByRegion: {
      MIDW: 94,
      CENT: 6,
    },
  },
  ID: {
    id: 'ID',
    name: 'Idaho',
    percentageByRegion: {
      NW: 100,
    },
  },
  IL: {
    id: 'IL',
    name: 'Illinois',
    percentageByRegion: {
      MIDA: 65,
      MIDW: 35,
    },
  },
  IN: {
    id: 'IN',
    name: 'Indiana',
    percentageByRegion: {
      MIDA: 21,
      MIDW: 79,
    },
  },
  KS: {
    id: 'KS',
    name: 'Kansas',
    percentageByRegion: {
      CENT: 100,
    },
  },
  KY: {
    id: 'KY',
    name: 'Kentucky',
    percentageByRegion: {
      TN: 15,
      MIDA: 30,
      MIDW: 55,
    },
  },
  LA: {
    id: 'LA',
    name: 'Louisiana',
    percentageByRegion: {
      MIDW: 93,
      CENT: 7,
    },
  },
  MA: {
    id: 'MA',
    name: 'Massachusetts',
    percentageByRegion: {
      NE: 100,
    },
  },
  MD: {
    id: 'MD',
    name: 'Maryland',
    percentageByRegion: {
      MIDA: 100,
    },
  },
  ME: {
    id: 'ME',
    name: 'Maine',
    percentageByRegion: {
      NE: 100,
    },
  },
  MI: {
    id: 'MI',
    name: 'Michigan',
    percentageByRegion: {
      MIDA: 4,
      MIDW: 96,
    },
  },
  MN: {
    id: 'MN',
    name: 'Minnesota',
    percentageByRegion: {
      MIDW: 99,
      CENT: 1,
    },
  },
  MO: {
    id: 'MO',
    name: 'Missouri',
    percentageByRegion: {
      MIDW: 65,
      CENT: 35,
    },
  },
  MS: {
    id: 'MS',
    name: 'Mississippi',
    percentageByRegion: {
      SE: 23,
      TN: 32,
      MIDW: 44,
    },
  },
  MT: {
    id: 'MT',
    name: 'Montana',
    percentageByRegion: {
      NW: 91,
      RM: 2,
      CENT: 7,
    },
  },
  NC: {
    id: 'NC',
    name: 'North Carolina',
    percentageByRegion: {
      NCSC: 96,
      MIDA: 4,
    },
  },
  ND: {
    id: 'ND',
    name: 'North Dakota',
    percentageByRegion: {
      MIDW: 53,
      CENT: 47,
    },
  },
  NE: {
    id: 'NE',
    name: 'Nebraska',
    percentageByRegion: {
      RM: 4,
      CENT: 96,
    },
  },
  NH: {
    id: 'NH',
    name: 'New Hampshire',
    percentageByRegion: {
      NE: 100,
    },
  },
  NJ: {
    id: 'NJ',
    name: 'New Jersey',
    percentageByRegion: {
      MIDA: 100,
    },
  },
  NM: {
    id: 'NM',
    name: 'New Mexico',
    percentageByRegion: {
      RM: 5,
      SW: 60,
      CENT: 35,
    },
  },
  NV: {
    id: 'NV',
    name: 'Nevada',
    percentageByRegion: {
      NW: 100,
    },
  },
  NY: {
    id: 'NY',
    name: 'New York',
    percentageByRegion: {
      NY: 100,
    },
  },
  OH: {
    id: 'OH',
    name: 'Ohio',
    percentageByRegion: {
      MIDA: 100,
    },
  },
  OK: {
    id: 'OK',
    name: 'Oklahoma',
    percentageByRegion: {
      MIDW: 5,
      CENT: 95,
    },
  },
  OR: {
    id: 'OR',
    name: 'Oregon',
    percentageByRegion: {
      NW: 100,
    },
  },
  PA: {
    id: 'PA',
    name: 'Pennsylvania',
    percentageByRegion: {
      MIDA: 100,
    },
  },
  RI: {
    id: 'RI',
    name: 'Rhode Island',
    percentageByRegion: {
      NE: 100,
    },
  },
  SC: {
    id: 'SC',
    name: 'South Carolina',
    percentageByRegion: {
      NCSC: 100,
    },
  },
  SD: {
    id: 'SD',
    name: 'South Dakota',
    percentageByRegion: {
      RM: 25,
      MIDW: 25,
      CENT: 50,
    },
  },
  TN: {
    id: 'TN',
    name: 'Tennessee',
    percentageByRegion: {
      TN: 98,
      MIDA: 2,
    },
  },
  TX: {
    id: 'TX',
    name: 'Texas',
    percentageByRegion: {
      SW: 1,
      TE: 86,
      MIDW: 5,
      CENT: 7,
    },
  },
  UT: {
    id: 'UT',
    name: 'Utah',
    percentageByRegion: {
      NW: 97,
      RM: 3,
    },
  },
  VA: {
    id: 'VA',
    name: 'Virginia',
    percentageByRegion: {
      MIDA: 100,
    },
  },
  VT: {
    id: 'VT',
    name: 'Vermont',
    percentageByRegion: {
      NE: 100,
    },
  },
  WA: {
    id: 'WA',
    name: 'Washington',
    percentageByRegion: {
      NW: 100,
    },
  },
  WI: {
    id: 'WI',
    name: 'Wisconsin',
    percentageByRegion: {
      MIDW: 100,
    },
  },
  WV: {
    id: 'WV',
    name: 'West Virginia',
    percentageByRegion: {
      MIDA: 100,
    },
  },
  WY: {
    id: 'WY',
    name: 'Wyoming',
    percentageByRegion: {
      NW: 62,
      RM: 38,
    },
  },
};

/**
 * TODO
 */
export const evModelYearOptions = [
  { id: '2020', name: '2020' },
  { id: '2021', name: '2021' },
  { id: '2022', name: '2022' },
  { id: '2023', name: '2023' },
  { id: '2024', name: '2024' },
  { id: '2025', name: '2025' },
];

/**
 * TODO
 */
export const iceReplacementVehicleOptions = [
  { id: 'new', name: 'New' },
  { id: 'existing', name: 'Existing' },
];
