/**
 * Excel: "A. State-level VMT per vehicle" table in the "MOVESsupplement" sheet
 * (B6:E720).
 */
import stateLevelVMT from "@/data/state-level-vmt.json";
/**
 * Excel: "B. State-Level Sales" table in the "MOVESsupplement" sheet (J6:M516).
 */
import stateLevelSales from "@/data/state-level-sales.json";
/**
 * Excel: "C. FHWA LDV State-Level VMT" table in the "MOVESsupplement" sheet
 * (O6:P57).
 */
import fhwaLDVStateLevelVMT from "@/data/fhwa-ldv-state-level-vmt.json";
/**
 * Excel: "Table 13: First-Year ICE to EV PM2.5 brakewear and tirewear emissions
 * rate conversion factors" table in the "Library" sheet (B990:G1130).
 */
import pm25BreakwearTirewearEVICERatios from "@/data/pm25-breakwear-tirewear-ev-ice-ratios.json";
/**
 * Excel: "Table 9: Default EV load profiles and related values from EVI-Pro
 * Lite" table in the "Library" sheet (B782:N807).
 */
import defaultEVLoadProfiles from "@/data/default-ev-load-profiles.json";
/**
 * Excel: "Table 5: EV efficiency assumptions" table in the "Library" sheet
 * (E201:J217).
 */
import evEfficiencyAssumptions from "@/data/ev-efficiency-assumptions.json";
/**
 * Excel: "Table 11: Historical renewable and energy efficiency addition data"
 * table in the "Library" sheet (B882:J895).
 */
import historicalRegionEEREData from "@/data/historical-region-eere-data.json";
/**
 * Excel: "Table 11: Historical renewable and energy efficiency addition data"
 * table in the "Library" sheet (B902:H950).
 */
import historicalStateEEREData from "@/data/historical-state-eere-data.json";

/**
 * NOTE: Normally we'd import 'app/data/county-fips.json' (Excel: "CountyFIPS"
 * sheet) and export the typeof the imported JSON file, but TypeScript isn't
 * able to infer types from large JSON files
 * (https://github.com/microsoft/TypeScript/issues/42761), so that exported
 * type would just be `{}`, so we need to explicitly declare the type of the
 * MOVES emissions rates data.
 */
export type CountyFIPS = {
  "State and County FIPS Code": string;
  "State Name": string;
  "County Name": string;
  "AVERT Region": string;
  "Postal State Code": string;
  "County Name Long": string;
  Key: string;
  VMT: {
    "Passenger cars": number;
    "Passenger trucks": number;
    "Medium-duty transit buses": number;
    "Heavy-duty transit buses": number;
    "Medium-duty school buses": number;
    "Heavy-duty school buses": number;
    "Medium-duty other buses": number;
    "Heavy-duty other buses": number;
    "Light-duty single unit trucks": number;
    "Medium-duty single unit trucks": number;
    "Heavy-duty combination trucks": number;
    "Combination long-haul trucks": number;
    "Medium-duty refuse trucks": number;
    "Heavy-duty refuse trucks": number;
  };
  "Share of State VMT": {
    "Passenger cars": number;
    "Passenger trucks": number;
    "Medium-duty transit buses": number;
    "Heavy-duty transit buses": number;
    "Medium-duty school buses": number;
    "Heavy-duty school buses": number;
    "Medium-duty other buses": number;
    "Heavy-duty other buses": number;
    "Light-duty single unit trucks": number;
    "Medium-duty single unit trucks": number;
    "Heavy-duty combination trucks": number;
    "Combination long-haul trucks": number;
    "Medium-duty refuse trucks": number;
    "Heavy-duty refuse trucks": number;
  };
  "VMT - Collapsed": {
    "Transit buses": number;
    "School buses": number;
    "Other buses": number;
    "Short-haul trucks": number;
    "Refuse trucks": number;
  };
  "Share of State VMT - Collapsed": {
    "Transit buses": number;
    "School buses": number;
    "Other buses": number;
    "Short-haul trucks": number;
    "Refuse trucks": number;
  };
}[];

/**
 * NOTE: Normally we'd import 'app/data/moves-emission-rates.json' (Excel:
 * "MOVESEmissionRates" sheet) and export the typeof the imported JSON file,
 * but TypeScript isn't able to infer types from large JSON files
 * (https://github.com/microsoft/TypeScript/issues/42761), so that exported
 * type would just be `{}`, so we need to explicitly declare the type of the
 * MOVES emissions rates data.
 */
export type MOVESEmissionRates = {
  year: number;
  month: number;
  state: string;
  vehicleCategory: string;
  vehicleType: string;
  fuelType: string;
  firstYear: {
    vmt: number;
    co2: number;
    nox: number;
    so2: number;
    pm25Exhaust: number;
    pm25Brakewear: number;
    pm25Tirewear: number;
    vocs: number;
    nh3: number;
    vmtElectric: number;
  };
  fleetAverage: {
    vmt: number;
    co2: number;
    nox: number;
    so2: number;
    pm25Exhaust: number;
    pm25Brakewear: number;
    pm25Tirewear: number;
    vocs: number;
    nh3: number;
    vmtElectric: number;
  };
}[];

export type StateLevelVMT = typeof stateLevelVMT;

export type StateLevelSales = typeof stateLevelSales;

export type FHWALDVStateLevelVMT = typeof fhwaLDVStateLevelVMT;

export type PM25BreakwearTirewearEVICERatios =
  typeof pm25BreakwearTirewearEVICERatios;

export type DefaultEVLoadProfiles = typeof defaultEVLoadProfiles;

export type EVEfficiencyAssumptions = typeof evEfficiencyAssumptions;

export type PercentageHybridEVMilesDrivenOnElectricity =
  typeof percentageHybridEVMilesDrivenOnElectricity;

export type SchoolBusMonthlyVMTPercentages =
  typeof schoolBusMonthlyVMTPercentages;

export type WeekendToWeekdayEVConsumption =
  typeof weekendToWeekdayEVConsumption;

export type RegionAverageTemperatures = typeof regionAverageTemperatures;

export type LDVsPercentagesByVehicleCategory =
  typeof ldvsPercentagesByVehicleCategory;

export type RegionEVHourlyLimits = typeof regionEVHourlyLimits;

export type HistoricalRegionEEREData = typeof historicalRegionEEREData;

export type HistoricalStateEEREData = typeof historicalStateEEREData;

/**
 * Excel: "Table 5: EV efficiency assumptions" table in the "Library" sheet
 * (E219).
 */
export const percentageHybridEVMilesDrivenOnElectricity = 8000 / 13500;

/**
 * Excel: "Table 6: Monthly VMT and efficiency adjustments" table in the
 * "Library" sheet (E272:P274)
 */
export const schoolBusMonthlyVMTPercentages = {
  "1": 0.103225721256179,
  "2": 0.103225721256179,
  "3": 0.103225721256179,
  "4": 0.103225721256179,
  "5": 0.103225721256179,
  "6": 0.0236561695647958,
  "7": 0.0236561695647958,
  "8": 0.0236561695647958,
  "9": 0.103225721256179,
  "10": 0.103225721256179,
  "11": 0.103225721256179,
  "12": 0.103225721256179,
};

/**
 * Ratio of typical weekend energy consumption as a share of typical weekday
 * energy consumption.
 *
 * Excel: "Table 9: Default EV load profiles and related values from EVI-Pro
 * Lite" table in the "Library" sheet – "Weekend energy consumption as a share
 * of weekday energy consumption (ISO-NE 2024)" (D819:D824)
 */
export const weekendToWeekdayEVConsumption = {
  LDVs: 0.972479619166432,
  "Transit buses": 1,
  "School buses": 0.12,
  "Short-haul trucks": 0.174070360467419,
  "Long-haul trucks": 0.174070360467419,
  "Refuse trucks": 0.174070360467419,
};

/**
 * Additional energy consumed in climates with +/-18F differential from
 * St. Louis, MO
 *
 * Excel: "Table 9: Default EV load profiles and related values from EVI-Pro
 * Lite" table in the "Library" sheet – "Additional energy consumed in climates
 * with +/-18F differential from St. Louis, MO" (D827)
 */
export const percentageAdditionalEnergyConsumedFactor = 0.0766194804959222;

/**
 * Average temperatures for each region
 *
 * Excel: "Table 9: Default EV load profiles and related values from EVI-Pro
 * Lite" table in the "Library" sheet – "Climate Adjustments to Energy
 * Consumption" (B432:C445)
 */
export const regionAverageTemperatures = {
  CA: 68,
  NCSC: 68,
  CENT: 50 / 68,
  FL: 68 / 86,
  MIDA: 50,
  MIDW: 50 / 68,
  NE: 50,
  NY: 50,
  NW: 50 / 68,
  RM: 50,
  SE: 68,
  SW: 68,
  TN: 68,
  TE: 68,
};

/**
 * Percentage/share of the total vehicle sales/stock Passenger cars and
 * Passenger trucks make up of Battery EVs and Plug-in Hybrid EVs.
 *
 * Excel: "Table 12: Vehicle sales by type" table in the "Library" sheet
 * (D966:D967 and D969:D970).
 */
export const ldvsPercentagesByVehicleCategory = {
  "Battery EVs": {
    "Passenger cars": 0.726758263799148,
    "Passenger trucks": 0.273241736200852,
  },
  "Plug-in Hybrid EVs": {
    "Passenger cars": 0.106267047645846,
    "Passenger trucks": 0.893732952354154,
  },
};

/**
 * EV hourly limits by region (RDF max values)
 *
 * NOTE: not in Excel file, but sent by Synapse with the list of annual updates
 * in the "Detailed list of changes in AVERT 4.4" document (emailed 04/11/25)
 */
export const regionEVHourlyLimits = {
  CA: 31090,
  NCSC: 29064,
  CENT: 48429,
  FL: 45407,
  MIDA: 129390,
  MIDW: 122268,
  NE: 19101,
  NY: 25660,
  NW: 24618,
  RM: 11840,
  SE: 47346,
  SW: 19102,
  TN: 21868,
  TE: 68009,
};

/**
 * Excel: "Table 14: Lithium Ion Storage Defaults" table in the "Library" sheet
 * (D1138)
 */
export const batteryRoundTripEfficiency = 0.85;

/**
 * Excel: Total battery storage duration in hours "CalculateEERE" sheet (AM34)
 */
export const batteryStorageDuration = 4;

/**
 * Average annual electricity use (in kWh) for each home in the U.S.
 *
 * Source: "Home electricy use" section of
 * "Calculations and References_GHGEC_2024 Update.docx".
 */
export const averageAnnualElectricityUsePerUSHome = 12_154;

export type RdfDataKey =
  | "generation"
  | "so2"
  | "so2_not"
  | "nox"
  | "nox_not"
  | "co2"
  | "co2_not"
  | "heat"
  | "heat_not";

export type Pollutant = "so2" | "nox" | "co2" | "pm25" | "vocs" | "nh3";

export type RegionId =
  | "CA"
  | "CENT"
  | "FL"
  | "MIDA"
  | "MIDW"
  | "NCSC"
  | "NE"
  | "NY"
  | "NW"
  | "RM"
  | "SE"
  | "SW"
  | "TE"
  | "TN";

export type RegionName =
  | "California"
  | "Central"
  | "Florida"
  | "Mid-Atlantic"
  | "Midwest"
  | "Carolinas"
  | "New England"
  | "New York"
  | "Northwest"
  | "Rocky Mountains"
  | "Southeast"
  | "Southwest"
  | "Texas"
  | "Tennessee";

/**
 * NOTE: actual emissions for each region stored in the "Table 3: EGUs with
 * infrequent SO2 emission events" found in the "Library" sheet of the Excel
 * workbook. Even though we're only dealing with SO2 for now, this data
 * structure was set up to be flexible enough to handle a future scenario where
 * any of the other pollutants AVERT deals with have "infrequent emissions
 * events" and are stored in each region's `actualEmissions` field. These
 * `actualEmissions` values were last updated to use the 2024 data found in the
 * Excel workbook.
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
  percentageByState: Partial<{ [stateId in StateId]: number }>;
  actualEmissions: Partial<{ [field in RdfDataKey]: number }>;
};

/**
 * NOTE: 2024 line loss values stored in "Table 2: Transmission & Distributuion
 * (T&D) losses" found in the "Library" sheet of the Excel workbook (C85:E85).
 */
const lineLoss = {
  texas: 0.0457913819880058,
  eastern: 0.0723064644134105,
  western: 0.0866994954028822,
};

export const regions: { [regionId in RegionId]: Region } = {
  CA: {
    id: "CA",
    name: "California",
    lineLoss: lineLoss.western,
    offshoreWind: true,
    percentageByState: {
      CA: 100,
    },
    actualEmissions: {},
  },
  CENT: {
    id: "CENT",
    name: "Central",
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
    id: "FL",
    name: "Florida",
    lineLoss: lineLoss.eastern,
    offshoreWind: false,
    percentageByState: {
      FL: 100,
    },
    actualEmissions: {
      so2: 13_987_388,
    },
  },
  MIDA: {
    id: "MIDA",
    name: "Mid-Atlantic",
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
    actualEmissions: {
      so2: 216_297_528,
    },
  },
  MIDW: {
    id: "MIDW",
    name: "Midwest",
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
    id: "NCSC",
    name: "Carolinas",
    lineLoss: lineLoss.eastern,
    offshoreWind: true,
    percentageByState: {
      NC: 61.6987,
      SC: 38.3013,
    },
    actualEmissions: {
      so2: 29_306_406,
    },
  },
  NE: {
    id: "NE",
    name: "New England",
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
  NW: {
    id: "NW",
    name: "Northwest",
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
  NY: {
    id: "NY",
    name: "New York",
    lineLoss: lineLoss.eastern,
    offshoreWind: true,
    percentageByState: {
      NY: 100,
    },
    actualEmissions: {
      so2: 1_390_608,
    },
  },
  RM: {
    id: "RM",
    name: "Rocky Mountains",
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
    id: "SE",
    name: "Southeast",
    lineLoss: lineLoss.eastern,
    offshoreWind: false,
    percentageByState: {
      AL: 29.2135,
      FL: 5.8078,
      GA: 59.8372,
      MS: 5.1415,
    },
    actualEmissions: {
      so2: 24_202_830,
    },
  },
  SW: {
    id: "SW",
    name: "Southwest",
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
    id: "TE",
    name: "Texas",
    lineLoss: lineLoss.texas,
    offshoreWind: false,
    percentageByState: {
      TX: 100,
    },
    actualEmissions: {},
  },
  TN: {
    id: "TN",
    name: "Tennessee",
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
  | "AL"
  | "AR"
  | "AZ"
  | "CA"
  | "CO"
  | "CT"
  | "DC"
  | "DE"
  | "FL"
  | "GA"
  | "IA"
  | "ID"
  | "IL"
  | "IN"
  | "KS"
  | "KY"
  | "LA"
  | "MA"
  | "MD"
  | "ME"
  | "MI"
  | "MN"
  | "MO"
  | "MS"
  | "MT"
  | "NC"
  | "ND"
  | "NE"
  | "NH"
  | "NJ"
  | "NM"
  | "NV"
  | "NY"
  | "OH"
  | "OK"
  | "OR"
  | "PA"
  | "RI"
  | "SC"
  | "SD"
  | "TN"
  | "TX"
  | "UT"
  | "VA"
  | "VT"
  | "WA"
  | "WI"
  | "WV"
  | "WY";

export type State = {
  id: StateId;
  name: string;
  percentageByRegion: Partial<{ [regionId in RegionId]: number }>;
};

/**
 * NOTE: each state's percentage by region stored in "Table 1: Percent of state
 * in each AVERT region" found in the "Library" sheet of the Excel workbook.
 */
export const states: { [stateId in StateId]: State } = {
  AL: {
    id: "AL",
    name: "Alabama",
    percentageByRegion: {
      SE: 73.791629656774,
      TN: 26.208370343226,
    },
  },
  AR: {
    id: "AR",
    name: "Arkansas",
    percentageByRegion: {
      MIDW: 73.757031571744,
      CENT: 26.242968428256,
    },
  },
  AZ: {
    id: "AZ",
    name: "Arizona",
    percentageByRegion: {
      SW: 100,
    },
  },
  CA: {
    id: "CA",
    name: "California",
    percentageByRegion: {
      CA: 100,
    },
  },
  CO: {
    id: "CO",
    name: "Colorado",
    percentageByRegion: {
      RM: 100,
    },
  },
  CT: {
    id: "CT",
    name: "Connecticut",
    percentageByRegion: {
      NE: 100,
    },
  },
  DC: {
    id: "DC",
    name: "District of Columbia",
    percentageByRegion: {
      MIDA: 100,
    },
  },
  DE: {
    id: "DE",
    name: "Delaware",
    percentageByRegion: {
      MIDA: 100,
    },
  },
  FL: {
    id: "FL",
    name: "Florida",
    percentageByRegion: {
      SE: 5.54204561120175,
      FL: 94.4579543887982,
    },
  },
  GA: {
    id: "GA",
    name: "Georgia",
    percentageByRegion: {
      SE: 97.5685884564487,
      TN: 2.43141154355125,
    },
  },
  IA: {
    id: "IA",
    name: "Iowa",
    percentageByRegion: {
      MIDW: 94.0739868582707,
      CENT: 5.92601314172933,
    },
  },
  ID: {
    id: "ID",
    name: "Idaho",
    percentageByRegion: {
      NW: 100,
    },
  },
  IL: {
    id: "IL",
    name: "Illinois",
    percentageByRegion: {
      MIDA: 65.2031111352377,
      MIDW: 34.7968888647623,
    },
  },
  IN: {
    id: "IN",
    name: "Indiana",
    percentageByRegion: {
      MIDA: 21.306124107215,
      MIDW: 78.693875892785,
    },
  },
  KS: {
    id: "KS",
    name: "Kansas",
    percentageByRegion: {
      CENT: 100,
    },
  },
  KY: {
    id: "KY",
    name: "Kentucky",
    percentageByRegion: {
      TN: 14.9033170798895,
      MIDA: 29.8395825874621,
      MIDW: 55.2571003326483,
    },
  },
  LA: {
    id: "LA",
    name: "Louisiana",
    percentageByRegion: {
      MIDW: 92.7251993267115,
      CENT: 7.27480067328851,
    },
  },
  MA: {
    id: "MA",
    name: "Massachusetts",
    percentageByRegion: {
      NE: 100,
    },
  },
  MD: {
    id: "MD",
    name: "Maryland",
    percentageByRegion: {
      MIDA: 100,
    },
  },
  ME: {
    id: "ME",
    name: "Maine",
    percentageByRegion: {
      NE: 100,
    },
  },
  MI: {
    id: "MI",
    name: "Michigan",
    percentageByRegion: {
      MIDA: 3.87442312109519,
      MIDW: 96.1255768789048,
    },
  },
  MN: {
    id: "MN",
    name: "Minnesota",
    percentageByRegion: {
      MIDW: 98.7057353946334,
      CENT: 1.29426460536664,
    },
  },
  MO: {
    id: "MO",
    name: "Missouri",
    percentageByRegion: {
      MIDW: 65.1822776582235,
      CENT: 34.8177223417765,
    },
  },
  MS: {
    id: "MS",
    name: "Mississippi",
    percentageByRegion: {
      SE: 23.2693176758563,
      TN: 32.3277059280809,
      MIDW: 44.4029763960628,
    },
  },
  MT: {
    id: "MT",
    name: "Montana",
    percentageByRegion: {
      NW: 90.9322053030408,
      RM: 1.63910331296,
      CENT: 7.42869138399923,
    },
  },
  NC: {
    id: "NC",
    name: "North Carolina",
    percentageByRegion: {
      NCSC: 95.8122354967843,
      MIDA: 4.18776450321575,
    },
  },
  ND: {
    id: "ND",
    name: "North Dakota",
    percentageByRegion: {
      MIDW: 53.0639532459073,
      CENT: 46.9360467540927,
    },
  },
  NE: {
    id: "NE",
    name: "Nebraska",
    percentageByRegion: {
      RM: 4.12001916514984,
      CENT: 95.8799808348502,
    },
  },
  NH: {
    id: "NH",
    name: "New Hampshire",
    percentageByRegion: {
      NE: 100,
    },
  },
  NJ: {
    id: "NJ",
    name: "New Jersey",
    percentageByRegion: {
      MIDA: 100,
    },
  },
  NM: {
    id: "NM",
    name: "New Mexico",
    percentageByRegion: {
      RM: 4.57850916915244,
      SW: 60.2887390314291,
      CENT: 35.1327517994185,
    },
  },
  NV: {
    id: "NV",
    name: "Nevada",
    percentageByRegion: {
      NW: 100,
    },
  },
  NY: {
    id: "NY",
    name: "New York",
    percentageByRegion: {
      NY: 100,
    },
  },
  OH: {
    id: "OH",
    name: "Ohio",
    percentageByRegion: {
      MIDA: 100,
    },
  },
  OK: {
    id: "OK",
    name: "Oklahoma",
    percentageByRegion: {
      MIDW: 4.58716009767985,
      CENT: 95.4128399023201,
    },
  },
  OR: {
    id: "OR",
    name: "Oregon",
    percentageByRegion: {
      NW: 100,
    },
  },
  PA: {
    id: "PA",
    name: "Pennsylvania",
    percentageByRegion: {
      MIDA: 100,
    },
  },
  RI: {
    id: "RI",
    name: "Rhode Island",
    percentageByRegion: {
      NE: 100,
    },
  },
  SC: {
    id: "SC",
    name: "South Carolina",
    percentageByRegion: {
      NCSC: 100,
    },
  },
  SD: {
    id: "SD",
    name: "South Dakota",
    percentageByRegion: {
      RM: 24.6328808233089,
      MIDW: 25.4722557633138,
      CENT: 49.8948634133772,
    },
  },
  TN: {
    id: "TN",
    name: "Tennessee",
    percentageByRegion: {
      TN: 97.9705292162893,
      MIDA: 2.02947078371074,
    },
  },
  TX: {
    id: "TX",
    name: "Texas",
    percentageByRegion: {
      SW: 1.49870155100264,
      TE: 85.6392226594376,
      MIDW: 5.43542315832571,
      CENT: 7.42665263123409,
    },
  },
  UT: {
    id: "UT",
    name: "Utah",
    percentageByRegion: {
      NW: 97.3172662009813,
      RM: 2.68273379901869,
    },
  },
  VA: {
    id: "VA",
    name: "Virginia",
    percentageByRegion: {
      MIDA: 100,
    },
  },
  VT: {
    id: "VT",
    name: "Vermont",
    percentageByRegion: {
      NE: 100,
    },
  },
  WA: {
    id: "WA",
    name: "Washington",
    percentageByRegion: {
      NW: 100,
    },
  },
  WI: {
    id: "WI",
    name: "Wisconsin",
    percentageByRegion: {
      MIDW: 100,
    },
  },
  WV: {
    id: "WV",
    name: "West Virginia",
    percentageByRegion: {
      MIDA: 100,
    },
  },
  WY: {
    id: "WY",
    name: "Wyoming",
    percentageByRegion: {
      NW: 62.2496676189133,
      RM: 37.7503323810867,
    },
  },
};

/**
 * Options determined for the web version. In the Excel version, user can set
 * the value in the "Part II. Charging Characteristics" section in the
 * "ES_Detail" sheet (D61).
 */
export const maxAnnualDischargeCyclesOptions = [
  { id: "75", name: "75" },
  { id: "100", name: "100" },
  { id: "150", name: "150" },
];

/**
 * Excel: "EV model year" select options from the "Part III. Model Year and ICE
 * Replacement" section in the "EV_Detail" sheet (F108).
 */
export const evModelYearOptions = [
  { id: "2024", name: "2024" },
  { id: "2025", name: "2025" },
  { id: "2026", name: "2026" },
  { id: "2027", name: "2027" },
  { id: "2028", name: "2028" },
  { id: "2029", name: "2029" },
];

/**
 * Excel: "ICE vehicle being replaced" select options from the "Part III. Model
 * Year and ICE Replacement" section in the "EV_Detail" sheet (F109).
 */
export const iceReplacementVehicleOptions = [
  { id: "new", name: "New" },
  { id: "existing", name: "Existing" },
];
