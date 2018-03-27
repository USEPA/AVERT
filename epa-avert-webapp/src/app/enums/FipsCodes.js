// @flow

type Code = {
  FIPS: number,
  State: string,
  County: string,
};

const FipsCodes: Array<Code> = [
  {
    "FIPS": 1001,
    "State": "Alabama",
    "County": "Autauga"
  },
  {
    "FIPS": 1003,
    "State": "Alabama",
    "County": "Baldwin"
  },
  {
    "FIPS": 1005,
    "State": "Alabama",
    "County": "Barbour"
  },
  {
    "FIPS": 1007,
    "State": "Alabama",
    "County": "Bibb"
  },
  {
    "FIPS": 1009,
    "State": "Alabama",
    "County": "Blount"
  },
  {
    "FIPS": 1011,
    "State": "Alabama",
    "County": "Bullock"
  },
  {
    "FIPS": 1013,
    "State": "Alabama",
    "County": "Butler"
  },
  {
    "FIPS": 1015,
    "State": "Alabama",
    "County": "Calhoun"
  },
  {
    "FIPS": 1017,
    "State": "Alabama",
    "County": "Chambers"
  },
  {
    "FIPS": 1019,
    "State": "Alabama",
    "County": "Cherokee"
  },
  {
    "FIPS": 1021,
    "State": "Alabama",
    "County": "Chilton"
  },
  {
    "FIPS": 1023,
    "State": "Alabama",
    "County": "Choctaw"
  },
  {
    "FIPS": 1025,
    "State": "Alabama",
    "County": "Clarke"
  },
  {
    "FIPS": 1027,
    "State": "Alabama",
    "County": "Clay"
  },
  {
    "FIPS": 1029,
    "State": "Alabama",
    "County": "Cleburne"
  },
  {
    "FIPS": 1031,
    "State": "Alabama",
    "County": "Coffee"
  },
  {
    "FIPS": 1033,
    "State": "Alabama",
    "County": "Colbert"
  },
  {
    "FIPS": 1035,
    "State": "Alabama",
    "County": "Conecuh"
  },
  {
    "FIPS": 1037,
    "State": "Alabama",
    "County": "Coosa"
  },
  {
    "FIPS": 1039,
    "State": "Alabama",
    "County": "Covington"
  },
  {
    "FIPS": 1041,
    "State": "Alabama",
    "County": "Crenshaw"
  },
  {
    "FIPS": 1043,
    "State": "Alabama",
    "County": "Cullman"
  },
  {
    "FIPS": 1045,
    "State": "Alabama",
    "County": "Dale"
  },
  {
    "FIPS": 1047,
    "State": "Alabama",
    "County": "Dallas"
  },
  {
    "FIPS": 1049,
    "State": "Alabama",
    "County": "DeKalb"
  },
  {
    "FIPS": 1051,
    "State": "Alabama",
    "County": "Elmore"
  },
  {
    "FIPS": 1053,
    "State": "Alabama",
    "County": "Escambia"
  },
  {
    "FIPS": 1055,
    "State": "Alabama",
    "County": "Etowah"
  },
  {
    "FIPS": 1057,
    "State": "Alabama",
    "County": "Fayette"
  },
  {
    "FIPS": 1059,
    "State": "Alabama",
    "County": "Franklin"
  },
  {
    "FIPS": 1061,
    "State": "Alabama",
    "County": "Geneva"
  },
  {
    "FIPS": 1063,
    "State": "Alabama",
    "County": "Greene"
  },
  {
    "FIPS": 1065,
    "State": "Alabama",
    "County": "Hale"
  },
  {
    "FIPS": 1067,
    "State": "Alabama",
    "County": "Henry"
  },
  {
    "FIPS": 1069,
    "State": "Alabama",
    "County": "Houston"
  },
  {
    "FIPS": 1071,
    "State": "Alabama",
    "County": "Jackson"
  },
  {
    "FIPS": 1073,
    "State": "Alabama",
    "County": "Jefferson"
  },
  {
    "FIPS": 1075,
    "State": "Alabama",
    "County": "Lamar"
  },
  {
    "FIPS": 1077,
    "State": "Alabama",
    "County": "Lauderdale"
  },
  {
    "FIPS": 1079,
    "State": "Alabama",
    "County": "Lawrence"
  },
  {
    "FIPS": 1081,
    "State": "Alabama",
    "County": "Lee"
  },
  {
    "FIPS": 1083,
    "State": "Alabama",
    "County": "Limestone"
  },
  {
    "FIPS": 1085,
    "State": "Alabama",
    "County": "Lowndes"
  },
  {
    "FIPS": 1087,
    "State": "Alabama",
    "County": "Macon"
  },
  {
    "FIPS": 1089,
    "State": "Alabama",
    "County": "Madison"
  },
  {
    "FIPS": 1091,
    "State": "Alabama",
    "County": "Marengo"
  },
  {
    "FIPS": 1093,
    "State": "Alabama",
    "County": "Marion"
  },
  {
    "FIPS": 1095,
    "State": "Alabama",
    "County": "Marshall"
  },
  {
    "FIPS": 1097,
    "State": "Alabama",
    "County": "Mobile"
  },
  {
    "FIPS": 1099,
    "State": "Alabama",
    "County": "Monroe"
  },
  {
    "FIPS": 1101,
    "State": "Alabama",
    "County": "Montgomery"
  },
  {
    "FIPS": 1103,
    "State": "Alabama",
    "County": "Morgan"
  },
  {
    "FIPS": 1105,
    "State": "Alabama",
    "County": "Perry"
  },
  {
    "FIPS": 1107,
    "State": "Alabama",
    "County": "Pickens"
  },
  {
    "FIPS": 1109,
    "State": "Alabama",
    "County": "Pike"
  },
  {
    "FIPS": 1111,
    "State": "Alabama",
    "County": "Randolph"
  },
  {
    "FIPS": 1113,
    "State": "Alabama",
    "County": "Russell"
  },
  {
    "FIPS": 1115,
    "State": "Alabama",
    "County": "St. Clair"
  },
  {
    "FIPS": 1117,
    "State": "Alabama",
    "County": "Shelby"
  },
  {
    "FIPS": 1119,
    "State": "Alabama",
    "County": "Sumter"
  },
  {
    "FIPS": 1121,
    "State": "Alabama",
    "County": "Talladega"
  },
  {
    "FIPS": 1123,
    "State": "Alabama",
    "County": "Tallapoosa"
  },
  {
    "FIPS": 1125,
    "State": "Alabama",
    "County": "Tuscaloosa"
  },
  {
    "FIPS": 1127,
    "State": "Alabama",
    "County": "Walker"
  },
  {
    "FIPS": 1129,
    "State": "Alabama",
    "County": "Washington"
  },
  {
    "FIPS": 1131,
    "State": "Alabama",
    "County": "Wilcox"
  },
  {
    "FIPS": 1133,
    "State": "Alabama",
    "County": "Winston"
  },
  {
    "FIPS": 2013,
    "State": "Alaska",
    "County": "Aleutians East"
  },
  {
    "FIPS": 2016,
    "State": "Alaska",
    "County": "Aleutians West"
  },
  {
    "FIPS": 2020,
    "State": "Alaska",
    "County": "Anchorage"
  },
  {
    "FIPS": 2050,
    "State": "Alaska",
    "County": "Bethel"
  },
  {
    "FIPS": 2060,
    "State": "Alaska",
    "County": "Bristol Bay"
  },
  {
    "FIPS": 2068,
    "State": "Alaska",
    "County": "Denali"
  },
  {
    "FIPS": 2070,
    "State": "Alaska",
    "County": "Dillingham"
  },
  {
    "FIPS": 2090,
    "State": "Alaska",
    "County": "Fairbanks North Star"
  },
  {
    "FIPS": 2100,
    "State": "Alaska",
    "County": "Haines"
  },
  {
    "FIPS": 2105,
    "State": "Alaska",
    "County": "Hoonah-Angoon"
  },
  {
    "FIPS": 2110,
    "State": "Alaska",
    "County": "Juneau"
  },
  {
    "FIPS": 2122,
    "State": "Alaska",
    "County": "Kenai Peninsula"
  },
  {
    "FIPS": 2130,
    "State": "Alaska",
    "County": "Ketchikan Gateway"
  },
  {
    "FIPS": 2150,
    "State": "Alaska",
    "County": "Kodiak Island"
  },
  {
    "FIPS": 2164,
    "State": "Alaska",
    "County": "Lake and Peninsula"
  },
  {
    "FIPS": 2170,
    "State": "Alaska",
    "County": "Matanuska-Susitna"
  },
  {
    "FIPS": 2180,
    "State": "Alaska",
    "County": "Nome"
  },
  {
    "FIPS": 2185,
    "State": "Alaska",
    "County": "North Slope"
  },
  {
    "FIPS": 2188,
    "State": "Alaska",
    "County": "Northwest Arctic"
  },
  {
    "FIPS": 2195,
    "State": "Alaska",
    "County": "Petersburg"
  },
  {
    "FIPS": 2198,
    "State": "Alaska",
    "County": "Prince of Wales-Hyder"
  },
  {
    "FIPS": 2220,
    "State": "Alaska",
    "County": "Sitka"
  },
  {
    "FIPS": 2230,
    "State": "Alaska",
    "County": "Skagway"
  },
  {
    "FIPS": 2240,
    "State": "Alaska",
    "County": "Southeast Fairbanks"
  },
  {
    "FIPS": 2261,
    "State": "Alaska",
    "County": "Valdez-Cordova"
  },
  {
    "FIPS": 2270,
    "State": "Alaska",
    "County": "Wade Hampton"
  },
  {
    "FIPS": 2275,
    "State": "Alaska",
    "County": "Wrangell"
  },
  {
    "FIPS": 2282,
    "State": "Alaska",
    "County": "Yakutat"
  },
  {
    "FIPS": 2290,
    "State": "Alaska",
    "County": "Yukon-Koyukuk"
  },
  {
    "FIPS": 4001,
    "State": "Arizona",
    "County": "Apache"
  },
  {
    "FIPS": 4003,
    "State": "Arizona",
    "County": "Cochise"
  },
  {
    "FIPS": 4005,
    "State": "Arizona",
    "County": "Coconino"
  },
  {
    "FIPS": 4007,
    "State": "Arizona",
    "County": "Gila"
  },
  {
    "FIPS": 4009,
    "State": "Arizona",
    "County": "Graham"
  },
  {
    "FIPS": 4011,
    "State": "Arizona",
    "County": "Greenlee"
  },
  {
    "FIPS": 4012,
    "State": "Arizona",
    "County": "La Paz"
  },
  {
    "FIPS": 4013,
    "State": "Arizona",
    "County": "Maricopa"
  },
  {
    "FIPS": 4015,
    "State": "Arizona",
    "County": "Mohave"
  },
  {
    "FIPS": 4017,
    "State": "Arizona",
    "County": "Navajo"
  },
  {
    "FIPS": 4019,
    "State": "Arizona",
    "County": "Pima"
  },
  {
    "FIPS": 4021,
    "State": "Arizona",
    "County": "Pinal"
  },
  {
    "FIPS": 4023,
    "State": "Arizona",
    "County": "Santa Cruz"
  },
  {
    "FIPS": 4025,
    "State": "Arizona",
    "County": "Yavapai"
  },
  {
    "FIPS": 4027,
    "State": "Arizona",
    "County": "Yuma"
  },
  {
    "FIPS": 5001,
    "State": "Arkansas",
    "County": "Arkansas"
  },
  {
    "FIPS": 5003,
    "State": "Arkansas",
    "County": "Ashley"
  },
  {
    "FIPS": 5005,
    "State": "Arkansas",
    "County": "Baxter"
  },
  {
    "FIPS": 5007,
    "State": "Arkansas",
    "County": "Benton"
  },
  {
    "FIPS": 5009,
    "State": "Arkansas",
    "County": "Boone"
  },
  {
    "FIPS": 5011,
    "State": "Arkansas",
    "County": "Bradley"
  },
  {
    "FIPS": 5013,
    "State": "Arkansas",
    "County": "Calhoun"
  },
  {
    "FIPS": 5015,
    "State": "Arkansas",
    "County": "Carroll"
  },
  {
    "FIPS": 5017,
    "State": "Arkansas",
    "County": "Chicot"
  },
  {
    "FIPS": 5019,
    "State": "Arkansas",
    "County": "Clark"
  },
  {
    "FIPS": 5021,
    "State": "Arkansas",
    "County": "Clay"
  },
  {
    "FIPS": 5023,
    "State": "Arkansas",
    "County": "Cleburne"
  },
  {
    "FIPS": 5025,
    "State": "Arkansas",
    "County": "Cleveland"
  },
  {
    "FIPS": 5027,
    "State": "Arkansas",
    "County": "Columbia"
  },
  {
    "FIPS": 5029,
    "State": "Arkansas",
    "County": "Conway"
  },
  {
    "FIPS": 5031,
    "State": "Arkansas",
    "County": "Craighead"
  },
  {
    "FIPS": 5033,
    "State": "Arkansas",
    "County": "Crawford"
  },
  {
    "FIPS": 5035,
    "State": "Arkansas",
    "County": "Crittenden"
  },
  {
    "FIPS": 5037,
    "State": "Arkansas",
    "County": "Cross"
  },
  {
    "FIPS": 5039,
    "State": "Arkansas",
    "County": "Dallas"
  },
  {
    "FIPS": 5041,
    "State": "Arkansas",
    "County": "Desha"
  },
  {
    "FIPS": 5043,
    "State": "Arkansas",
    "County": "Drew"
  },
  {
    "FIPS": 5045,
    "State": "Arkansas",
    "County": "Faulkner"
  },
  {
    "FIPS": 5047,
    "State": "Arkansas",
    "County": "Franklin"
  },
  {
    "FIPS": 5049,
    "State": "Arkansas",
    "County": "Fulton"
  },
  {
    "FIPS": 5051,
    "State": "Arkansas",
    "County": "Garland"
  },
  {
    "FIPS": 5053,
    "State": "Arkansas",
    "County": "Grant"
  },
  {
    "FIPS": 5055,
    "State": "Arkansas",
    "County": "Greene"
  },
  {
    "FIPS": 5057,
    "State": "Arkansas",
    "County": "Hempstead"
  },
  {
    "FIPS": 5059,
    "State": "Arkansas",
    "County": "Hot Spring"
  },
  {
    "FIPS": 5061,
    "State": "Arkansas",
    "County": "Howard"
  },
  {
    "FIPS": 5063,
    "State": "Arkansas",
    "County": "Independence"
  },
  {
    "FIPS": 5065,
    "State": "Arkansas",
    "County": "Izard"
  },
  {
    "FIPS": 5067,
    "State": "Arkansas",
    "County": "Jackson"
  },
  {
    "FIPS": 5069,
    "State": "Arkansas",
    "County": "Jefferson"
  },
  {
    "FIPS": 5071,
    "State": "Arkansas",
    "County": "Johnson"
  },
  {
    "FIPS": 5073,
    "State": "Arkansas",
    "County": "Lafayette"
  },
  {
    "FIPS": 5075,
    "State": "Arkansas",
    "County": "Lawrence"
  },
  {
    "FIPS": 5077,
    "State": "Arkansas",
    "County": "Lee"
  },
  {
    "FIPS": 5079,
    "State": "Arkansas",
    "County": "Lincoln"
  },
  {
    "FIPS": 5081,
    "State": "Arkansas",
    "County": "Little River"
  },
  {
    "FIPS": 5083,
    "State": "Arkansas",
    "County": "Logan"
  },
  {
    "FIPS": 5085,
    "State": "Arkansas",
    "County": "Lonoke"
  },
  {
    "FIPS": 5087,
    "State": "Arkansas",
    "County": "Madison"
  },
  {
    "FIPS": 5089,
    "State": "Arkansas",
    "County": "Marion"
  },
  {
    "FIPS": 5091,
    "State": "Arkansas",
    "County": "Miller"
  },
  {
    "FIPS": 5093,
    "State": "Arkansas",
    "County": "Mississippi"
  },
  {
    "FIPS": 5095,
    "State": "Arkansas",
    "County": "Monroe"
  },
  {
    "FIPS": 5097,
    "State": "Arkansas",
    "County": "Montgomery"
  },
  {
    "FIPS": 5099,
    "State": "Arkansas",
    "County": "Nevada"
  },
  {
    "FIPS": 5101,
    "State": "Arkansas",
    "County": "Newton"
  },
  {
    "FIPS": 5103,
    "State": "Arkansas",
    "County": "Ouachita"
  },
  {
    "FIPS": 5105,
    "State": "Arkansas",
    "County": "Perry"
  },
  {
    "FIPS": 5107,
    "State": "Arkansas",
    "County": "Phillips"
  },
  {
    "FIPS": 5109,
    "State": "Arkansas",
    "County": "Pike"
  },
  {
    "FIPS": 5111,
    "State": "Arkansas",
    "County": "Poinsett"
  },
  {
    "FIPS": 5113,
    "State": "Arkansas",
    "County": "Polk"
  },
  {
    "FIPS": 5115,
    "State": "Arkansas",
    "County": "Pope"
  },
  {
    "FIPS": 5117,
    "State": "Arkansas",
    "County": "Prairie"
  },
  {
    "FIPS": 5119,
    "State": "Arkansas",
    "County": "Pulaski"
  },
  {
    "FIPS": 5121,
    "State": "Arkansas",
    "County": "Randolph"
  },
  {
    "FIPS": 5123,
    "State": "Arkansas",
    "County": "St. Francis"
  },
  {
    "FIPS": 5125,
    "State": "Arkansas",
    "County": "Saline"
  },
  {
    "FIPS": 5127,
    "State": "Arkansas",
    "County": "Scott"
  },
  {
    "FIPS": 5129,
    "State": "Arkansas",
    "County": "Searcy"
  },
  {
    "FIPS": 5131,
    "State": "Arkansas",
    "County": "Sebastian"
  },
  {
    "FIPS": 5133,
    "State": "Arkansas",
    "County": "Sevier"
  },
  {
    "FIPS": 5135,
    "State": "Arkansas",
    "County": "Sharp"
  },
  {
    "FIPS": 5137,
    "State": "Arkansas",
    "County": "Stone"
  },
  {
    "FIPS": 5139,
    "State": "Arkansas",
    "County": "Union"
  },
  {
    "FIPS": 5141,
    "State": "Arkansas",
    "County": "Van Buren"
  },
  {
    "FIPS": 5143,
    "State": "Arkansas",
    "County": "Washington"
  },
  {
    "FIPS": 5145,
    "State": "Arkansas",
    "County": "White"
  },
  {
    "FIPS": 5147,
    "State": "Arkansas",
    "County": "Woodruff"
  },
  {
    "FIPS": 5149,
    "State": "Arkansas",
    "County": "Yell"
  },
  {
    "FIPS": 6001,
    "State": "California",
    "County": "Alameda"
  },
  {
    "FIPS": 6003,
    "State": "California",
    "County": "Alpine"
  },
  {
    "FIPS": 6005,
    "State": "California",
    "County": "Amador"
  },
  {
    "FIPS": 6007,
    "State": "California",
    "County": "Butte"
  },
  {
    "FIPS": 6009,
    "State": "California",
    "County": "Calaveras"
  },
  {
    "FIPS": 6011,
    "State": "California",
    "County": "Colusa"
  },
  {
    "FIPS": 6013,
    "State": "California",
    "County": "Contra Costa"
  },
  {
    "FIPS": 6015,
    "State": "California",
    "County": "Del Norte"
  },
  {
    "FIPS": 6017,
    "State": "California",
    "County": "El Dorado"
  },
  {
    "FIPS": 6019,
    "State": "California",
    "County": "Fresno"
  },
  {
    "FIPS": 6021,
    "State": "California",
    "County": "Glenn"
  },
  {
    "FIPS": 6023,
    "State": "California",
    "County": "Humboldt"
  },
  {
    "FIPS": 6025,
    "State": "California",
    "County": "Imperial"
  },
  {
    "FIPS": 6027,
    "State": "California",
    "County": "Inyo"
  },
  {
    "FIPS": 6029,
    "State": "California",
    "County": "Kern"
  },
  {
    "FIPS": 6031,
    "State": "California",
    "County": "Kings"
  },
  {
    "FIPS": 6033,
    "State": "California",
    "County": "Lake"
  },
  {
    "FIPS": 6035,
    "State": "California",
    "County": "Lassen"
  },
  {
    "FIPS": 6037,
    "State": "California",
    "County": "Los Angeles"
  },
  {
    "FIPS": 6039,
    "State": "California",
    "County": "Madera"
  },
  {
    "FIPS": 6041,
    "State": "California",
    "County": "Marin"
  },
  {
    "FIPS": 6043,
    "State": "California",
    "County": "Mariposa"
  },
  {
    "FIPS": 6045,
    "State": "California",
    "County": "Mendocino"
  },
  {
    "FIPS": 6047,
    "State": "California",
    "County": "Merced"
  },
  {
    "FIPS": 6049,
    "State": "California",
    "County": "Modoc"
  },
  {
    "FIPS": 6051,
    "State": "California",
    "County": "Mono"
  },
  {
    "FIPS": 6053,
    "State": "California",
    "County": "Monterey"
  },
  {
    "FIPS": 6055,
    "State": "California",
    "County": "Napa"
  },
  {
    "FIPS": 6057,
    "State": "California",
    "County": "Nevada"
  },
  {
    "FIPS": 6059,
    "State": "California",
    "County": "Orange"
  },
  {
    "FIPS": 6061,
    "State": "California",
    "County": "Placer"
  },
  {
    "FIPS": 6063,
    "State": "California",
    "County": "Plumas"
  },
  {
    "FIPS": 6065,
    "State": "California",
    "County": "Riverside"
  },
  {
    "FIPS": 6067,
    "State": "California",
    "County": "Sacramento"
  },
  {
    "FIPS": 6069,
    "State": "California",
    "County": "San Benito"
  },
  {
    "FIPS": 6071,
    "State": "California",
    "County": "San Bernardino"
  },
  {
    "FIPS": 6073,
    "State": "California",
    "County": "San Diego"
  },
  {
    "FIPS": 6075,
    "State": "California",
    "County": "San Francisco"
  },
  {
    "FIPS": 6077,
    "State": "California",
    "County": "San Joaquin"
  },
  {
    "FIPS": 6079,
    "State": "California",
    "County": "San Luis Obispo"
  },
  {
    "FIPS": 6081,
    "State": "California",
    "County": "San Mateo"
  },
  {
    "FIPS": 6083,
    "State": "California",
    "County": "Santa Barbara"
  },
  {
    "FIPS": 6085,
    "State": "California",
    "County": "Santa Clara"
  },
  {
    "FIPS": 6087,
    "State": "California",
    "County": "Santa Cruz"
  },
  {
    "FIPS": 6089,
    "State": "California",
    "County": "Shasta"
  },
  {
    "FIPS": 6091,
    "State": "California",
    "County": "Sierra"
  },
  {
    "FIPS": 6093,
    "State": "California",
    "County": "Siskiyou"
  },
  {
    "FIPS": 6095,
    "State": "California",
    "County": "Solano"
  },
  {
    "FIPS": 6097,
    "State": "California",
    "County": "Sonoma"
  },
  {
    "FIPS": 6099,
    "State": "California",
    "County": "Stanislaus"
  },
  {
    "FIPS": 6101,
    "State": "California",
    "County": "Sutter"
  },
  {
    "FIPS": 6103,
    "State": "California",
    "County": "Tehama"
  },
  {
    "FIPS": 6105,
    "State": "California",
    "County": "Trinity"
  },
  {
    "FIPS": 6107,
    "State": "California",
    "County": "Tulare"
  },
  {
    "FIPS": 6109,
    "State": "California",
    "County": "Tuolumne"
  },
  {
    "FIPS": 6111,
    "State": "California",
    "County": "Ventura"
  },
  {
    "FIPS": 6113,
    "State": "California",
    "County": "Yolo"
  },
  {
    "FIPS": 6115,
    "State": "California",
    "County": "Yuba"
  },
  {
    "FIPS": 8001,
    "State": "Colorado",
    "County": "Adams"
  },
  {
    "FIPS": 8003,
    "State": "Colorado",
    "County": "Alamosa"
  },
  {
    "FIPS": 8005,
    "State": "Colorado",
    "County": "Arapahoe"
  },
  {
    "FIPS": 8007,
    "State": "Colorado",
    "County": "Archuleta"
  },
  {
    "FIPS": 8009,
    "State": "Colorado",
    "County": "Baca"
  },
  {
    "FIPS": 8011,
    "State": "Colorado",
    "County": "Bent"
  },
  {
    "FIPS": 8013,
    "State": "Colorado",
    "County": "Boulder"
  },
  {
    "FIPS": 8014,
    "State": "Colorado",
    "County": "Broomfield"
  },
  {
    "FIPS": 8015,
    "State": "Colorado",
    "County": "Chaffee"
  },
  {
    "FIPS": 8017,
    "State": "Colorado",
    "County": "Cheyenne"
  },
  {
    "FIPS": 8019,
    "State": "Colorado",
    "County": "Clear Creek"
  },
  {
    "FIPS": 8021,
    "State": "Colorado",
    "County": "Conejos"
  },
  {
    "FIPS": 8023,
    "State": "Colorado",
    "County": "Costilla"
  },
  {
    "FIPS": 8025,
    "State": "Colorado",
    "County": "Crowley"
  },
  {
    "FIPS": 8027,
    "State": "Colorado",
    "County": "Custer"
  },
  {
    "FIPS": 8029,
    "State": "Colorado",
    "County": "Delta"
  },
  {
    "FIPS": 8031,
    "State": "Colorado",
    "County": "Denver"
  },
  {
    "FIPS": 8033,
    "State": "Colorado",
    "County": "Dolores"
  },
  {
    "FIPS": 8035,
    "State": "Colorado",
    "County": "Douglas"
  },
  {
    "FIPS": 8037,
    "State": "Colorado",
    "County": "Eagle"
  },
  {
    "FIPS": 8039,
    "State": "Colorado",
    "County": "Elbert"
  },
  {
    "FIPS": 8041,
    "State": "Colorado",
    "County": "El Paso"
  },
  {
    "FIPS": 8043,
    "State": "Colorado",
    "County": "Fremont"
  },
  {
    "FIPS": 8045,
    "State": "Colorado",
    "County": "Garfield"
  },
  {
    "FIPS": 8047,
    "State": "Colorado",
    "County": "Gilpin"
  },
  {
    "FIPS": 8049,
    "State": "Colorado",
    "County": "Grand"
  },
  {
    "FIPS": 8051,
    "State": "Colorado",
    "County": "Gunnison"
  },
  {
    "FIPS": 8053,
    "State": "Colorado",
    "County": "Hinsdale"
  },
  {
    "FIPS": 8055,
    "State": "Colorado",
    "County": "Huerfano"
  },
  {
    "FIPS": 8057,
    "State": "Colorado",
    "County": "Jackson"
  },
  {
    "FIPS": 8059,
    "State": "Colorado",
    "County": "Jefferson"
  },
  {
    "FIPS": 8061,
    "State": "Colorado",
    "County": "Kiowa"
  },
  {
    "FIPS": 8063,
    "State": "Colorado",
    "County": "Kit Carson"
  },
  {
    "FIPS": 8065,
    "State": "Colorado",
    "County": "Lake"
  },
  {
    "FIPS": 8067,
    "State": "Colorado",
    "County": "La Plata"
  },
  {
    "FIPS": 8069,
    "State": "Colorado",
    "County": "Larimer"
  },
  {
    "FIPS": 8071,
    "State": "Colorado",
    "County": "Las Animas"
  },
  {
    "FIPS": 8073,
    "State": "Colorado",
    "County": "Lincoln"
  },
  {
    "FIPS": 8075,
    "State": "Colorado",
    "County": "Logan"
  },
  {
    "FIPS": 8077,
    "State": "Colorado",
    "County": "Mesa"
  },
  {
    "FIPS": 8079,
    "State": "Colorado",
    "County": "Mineral"
  },
  {
    "FIPS": 8081,
    "State": "Colorado",
    "County": "Moffat"
  },
  {
    "FIPS": 8083,
    "State": "Colorado",
    "County": "Montezuma"
  },
  {
    "FIPS": 8085,
    "State": "Colorado",
    "County": "Montrose"
  },
  {
    "FIPS": 8087,
    "State": "Colorado",
    "County": "Morgan"
  },
  {
    "FIPS": 8089,
    "State": "Colorado",
    "County": "Otero"
  },
  {
    "FIPS": 8091,
    "State": "Colorado",
    "County": "Ouray"
  },
  {
    "FIPS": 8093,
    "State": "Colorado",
    "County": "Park"
  },
  {
    "FIPS": 8095,
    "State": "Colorado",
    "County": "Phillips"
  },
  {
    "FIPS": 8097,
    "State": "Colorado",
    "County": "Pitkin"
  },
  {
    "FIPS": 8099,
    "State": "Colorado",
    "County": "Prowers"
  },
  {
    "FIPS": 8101,
    "State": "Colorado",
    "County": "Pueblo"
  },
  {
    "FIPS": 8103,
    "State": "Colorado",
    "County": "Rio Blanco"
  },
  {
    "FIPS": 8105,
    "State": "Colorado",
    "County": "Rio Grande"
  },
  {
    "FIPS": 8107,
    "State": "Colorado",
    "County": "Routt"
  },
  {
    "FIPS": 8109,
    "State": "Colorado",
    "County": "Saguache"
  },
  {
    "FIPS": 8111,
    "State": "Colorado",
    "County": "San Juan"
  },
  {
    "FIPS": 8113,
    "State": "Colorado",
    "County": "San Miguel"
  },
  {
    "FIPS": 8115,
    "State": "Colorado",
    "County": "Sedgwick"
  },
  {
    "FIPS": 8117,
    "State": "Colorado",
    "County": "Summit"
  },
  {
    "FIPS": 8119,
    "State": "Colorado",
    "County": "Teller"
  },
  {
    "FIPS": 8121,
    "State": "Colorado",
    "County": "Washington"
  },
  {
    "FIPS": 8123,
    "State": "Colorado",
    "County": "Weld"
  },
  {
    "FIPS": 8125,
    "State": "Colorado",
    "County": "Yuma"
  },
  {
    "FIPS": 9001,
    "State": "Connecticut",
    "County": "Fairfield"
  },
  {
    "FIPS": 9003,
    "State": "Connecticut",
    "County": "Hartford"
  },
  {
    "FIPS": 9005,
    "State": "Connecticut",
    "County": "Litchfield"
  },
  {
    "FIPS": 9007,
    "State": "Connecticut",
    "County": "Middlesex"
  },
  {
    "FIPS": 9009,
    "State": "Connecticut",
    "County": "New Haven"
  },
  {
    "FIPS": 9011,
    "State": "Connecticut",
    "County": "New London"
  },
  {
    "FIPS": 9013,
    "State": "Connecticut",
    "County": "Tolland"
  },
  {
    "FIPS": 9015,
    "State": "Connecticut",
    "County": "Windham"
  },
  {
    "FIPS": 10001,
    "State": "Delaware",
    "County": "Kent"
  },
  {
    "FIPS": 10003,
    "State": "Delaware",
    "County": "New Castle"
  },
  {
    "FIPS": 10005,
    "State": "Delaware",
    "County": "Sussex"
  },
  {
    "FIPS": 11001,
    "State": "District of Columbia",
    "County": "District of Columbia"
  },
  {
    "FIPS": 12001,
    "State": "Florida",
    "County": "Alachua"
  },
  {
    "FIPS": 12003,
    "State": "Florida",
    "County": "Baker"
  },
  {
    "FIPS": 12005,
    "State": "Florida",
    "County": "Bay"
  },
  {
    "FIPS": 12007,
    "State": "Florida",
    "County": "Bradford"
  },
  {
    "FIPS": 12009,
    "State": "Florida",
    "County": "Brevard"
  },
  {
    "FIPS": 12011,
    "State": "Florida",
    "County": "Broward"
  },
  {
    "FIPS": 12013,
    "State": "Florida",
    "County": "Calhoun"
  },
  {
    "FIPS": 12015,
    "State": "Florida",
    "County": "Charlotte"
  },
  {
    "FIPS": 12017,
    "State": "Florida",
    "County": "Citrus"
  },
  {
    "FIPS": 12019,
    "State": "Florida",
    "County": "Clay"
  },
  {
    "FIPS": 12021,
    "State": "Florida",
    "County": "Collier"
  },
  {
    "FIPS": 12023,
    "State": "Florida",
    "County": "Columbia"
  },
  {
    "FIPS": 12027,
    "State": "Florida",
    "County": "DeSoto"
  },
  {
    "FIPS": 12029,
    "State": "Florida",
    "County": "Dixie"
  },
  {
    "FIPS": 12031,
    "State": "Florida",
    "County": "Duval"
  },
  {
    "FIPS": 12033,
    "State": "Florida",
    "County": "Escambia"
  },
  {
    "FIPS": 12035,
    "State": "Florida",
    "County": "Flagler"
  },
  {
    "FIPS": 12037,
    "State": "Florida",
    "County": "Franklin"
  },
  {
    "FIPS": 12039,
    "State": "Florida",
    "County": "Gadsden"
  },
  {
    "FIPS": 12041,
    "State": "Florida",
    "County": "Gilchrist"
  },
  {
    "FIPS": 12043,
    "State": "Florida",
    "County": "Glades"
  },
  {
    "FIPS": 12045,
    "State": "Florida",
    "County": "Gulf"
  },
  {
    "FIPS": 12047,
    "State": "Florida",
    "County": "Hamilton"
  },
  {
    "FIPS": 12049,
    "State": "Florida",
    "County": "Hardee"
  },
  {
    "FIPS": 12051,
    "State": "Florida",
    "County": "Hendry"
  },
  {
    "FIPS": 12053,
    "State": "Florida",
    "County": "Hernando"
  },
  {
    "FIPS": 12055,
    "State": "Florida",
    "County": "Highlands"
  },
  {
    "FIPS": 12057,
    "State": "Florida",
    "County": "Hillsborough"
  },
  {
    "FIPS": 12059,
    "State": "Florida",
    "County": "Holmes"
  },
  {
    "FIPS": 12061,
    "State": "Florida",
    "County": "Indian River"
  },
  {
    "FIPS": 12063,
    "State": "Florida",
    "County": "Jackson"
  },
  {
    "FIPS": 12065,
    "State": "Florida",
    "County": "Jefferson"
  },
  {
    "FIPS": 12067,
    "State": "Florida",
    "County": "Lafayette"
  },
  {
    "FIPS": 12069,
    "State": "Florida",
    "County": "Lake"
  },
  {
    "FIPS": 12071,
    "State": "Florida",
    "County": "Lee"
  },
  {
    "FIPS": 12073,
    "State": "Florida",
    "County": "Leon"
  },
  {
    "FIPS": 12075,
    "State": "Florida",
    "County": "Levy"
  },
  {
    "FIPS": 12077,
    "State": "Florida",
    "County": "Liberty"
  },
  {
    "FIPS": 12079,
    "State": "Florida",
    "County": "Madison"
  },
  {
    "FIPS": 12081,
    "State": "Florida",
    "County": "Manatee"
  },
  {
    "FIPS": 12083,
    "State": "Florida",
    "County": "Marion"
  },
  {
    "FIPS": 12085,
    "State": "Florida",
    "County": "Martin"
  },
  {
    "FIPS": 12086,
    "State": "Florida",
    "County": "Miami-Dade"
  },
  {
    "FIPS": 12087,
    "State": "Florida",
    "County": "Monroe"
  },
  {
    "FIPS": 12089,
    "State": "Florida",
    "County": "Nassau"
  },
  {
    "FIPS": 12091,
    "State": "Florida",
    "County": "Okaloosa"
  },
  {
    "FIPS": 12093,
    "State": "Florida",
    "County": "Okeechobee"
  },
  {
    "FIPS": 12095,
    "State": "Florida",
    "County": "Orange"
  },
  {
    "FIPS": 12097,
    "State": "Florida",
    "County": "Osceola"
  },
  {
    "FIPS": 12099,
    "State": "Florida",
    "County": "Palm Beach"
  },
  {
    "FIPS": 12101,
    "State": "Florida",
    "County": "Pasco"
  },
  {
    "FIPS": 12103,
    "State": "Florida",
    "County": "Pinellas"
  },
  {
    "FIPS": 12105,
    "State": "Florida",
    "County": "Polk"
  },
  {
    "FIPS": 12107,
    "State": "Florida",
    "County": "Putnam"
  },
  {
    "FIPS": 12109,
    "State": "Florida",
    "County": "St. Johns"
  },
  {
    "FIPS": 12111,
    "State": "Florida",
    "County": "St. Lucie"
  },
  {
    "FIPS": 12113,
    "State": "Florida",
    "County": "Santa Rosa"
  },
  {
    "FIPS": 12115,
    "State": "Florida",
    "County": "Sarasota"
  },
  {
    "FIPS": 12117,
    "State": "Florida",
    "County": "Seminole"
  },
  {
    "FIPS": 12119,
    "State": "Florida",
    "County": "Sumter"
  },
  {
    "FIPS": 12121,
    "State": "Florida",
    "County": "Suwannee"
  },
  {
    "FIPS": 12123,
    "State": "Florida",
    "County": "Taylor"
  },
  {
    "FIPS": 12125,
    "State": "Florida",
    "County": "Union"
  },
  {
    "FIPS": 12127,
    "State": "Florida",
    "County": "Volusia"
  },
  {
    "FIPS": 12129,
    "State": "Florida",
    "County": "Wakulla"
  },
  {
    "FIPS": 12131,
    "State": "Florida",
    "County": "Walton"
  },
  {
    "FIPS": 12133,
    "State": "Florida",
    "County": "Washington"
  },
  {
    "FIPS": 13001,
    "State": "Georgia",
    "County": "Appling"
  },
  {
    "FIPS": 13003,
    "State": "Georgia",
    "County": "Atkinson"
  },
  {
    "FIPS": 13005,
    "State": "Georgia",
    "County": "Bacon"
  },
  {
    "FIPS": 13007,
    "State": "Georgia",
    "County": "Baker"
  },
  {
    "FIPS": 13009,
    "State": "Georgia",
    "County": "Baldwin"
  },
  {
    "FIPS": 13011,
    "State": "Georgia",
    "County": "Banks"
  },
  {
    "FIPS": 13013,
    "State": "Georgia",
    "County": "Barrow"
  },
  {
    "FIPS": 13015,
    "State": "Georgia",
    "County": "Bartow"
  },
  {
    "FIPS": 13017,
    "State": "Georgia",
    "County": "Ben Hill"
  },
  {
    "FIPS": 13019,
    "State": "Georgia",
    "County": "Berrien"
  },
  {
    "FIPS": 13021,
    "State": "Georgia",
    "County": "Bibb"
  },
  {
    "FIPS": 13023,
    "State": "Georgia",
    "County": "Bleckley"
  },
  {
    "FIPS": 13025,
    "State": "Georgia",
    "County": "Brantley"
  },
  {
    "FIPS": 13027,
    "State": "Georgia",
    "County": "Brooks"
  },
  {
    "FIPS": 13029,
    "State": "Georgia",
    "County": "Bryan"
  },
  {
    "FIPS": 13031,
    "State": "Georgia",
    "County": "Bulloch"
  },
  {
    "FIPS": 13033,
    "State": "Georgia",
    "County": "Burke"
  },
  {
    "FIPS": 13035,
    "State": "Georgia",
    "County": "Butts"
  },
  {
    "FIPS": 13037,
    "State": "Georgia",
    "County": "Calhoun"
  },
  {
    "FIPS": 13039,
    "State": "Georgia",
    "County": "Camden"
  },
  {
    "FIPS": 13043,
    "State": "Georgia",
    "County": "Candler"
  },
  {
    "FIPS": 13045,
    "State": "Georgia",
    "County": "Carroll"
  },
  {
    "FIPS": 13047,
    "State": "Georgia",
    "County": "Catoosa"
  },
  {
    "FIPS": 13049,
    "State": "Georgia",
    "County": "Charlton"
  },
  {
    "FIPS": 13051,
    "State": "Georgia",
    "County": "Chatham"
  },
  {
    "FIPS": 13053,
    "State": "Georgia",
    "County": "Chattahoochee"
  },
  {
    "FIPS": 13055,
    "State": "Georgia",
    "County": "Chattooga"
  },
  {
    "FIPS": 13057,
    "State": "Georgia",
    "County": "Cherokee"
  },
  {
    "FIPS": 13059,
    "State": "Georgia",
    "County": "Clarke"
  },
  {
    "FIPS": 13061,
    "State": "Georgia",
    "County": "Clay"
  },
  {
    "FIPS": 13063,
    "State": "Georgia",
    "County": "Clayton"
  },
  {
    "FIPS": 13065,
    "State": "Georgia",
    "County": "Clinch"
  },
  {
    "FIPS": 13067,
    "State": "Georgia",
    "County": "Cobb"
  },
  {
    "FIPS": 13069,
    "State": "Georgia",
    "County": "Coffee"
  },
  {
    "FIPS": 13071,
    "State": "Georgia",
    "County": "Colquitt"
  },
  {
    "FIPS": 13073,
    "State": "Georgia",
    "County": "Columbia"
  },
  {
    "FIPS": 13075,
    "State": "Georgia",
    "County": "Cook"
  },
  {
    "FIPS": 13077,
    "State": "Georgia",
    "County": "Coweta"
  },
  {
    "FIPS": 13079,
    "State": "Georgia",
    "County": "Crawford"
  },
  {
    "FIPS": 13081,
    "State": "Georgia",
    "County": "Crisp"
  },
  {
    "FIPS": 13083,
    "State": "Georgia",
    "County": "Dade"
  },
  {
    "FIPS": 13085,
    "State": "Georgia",
    "County": "Dawson"
  },
  {
    "FIPS": 13087,
    "State": "Georgia",
    "County": "Decatur"
  },
  {
    "FIPS": 13089,
    "State": "Georgia",
    "County": "DeKalb"
  },
  {
    "FIPS": 13091,
    "State": "Georgia",
    "County": "Dodge"
  },
  {
    "FIPS": 13093,
    "State": "Georgia",
    "County": "Dooly"
  },
  {
    "FIPS": 13095,
    "State": "Georgia",
    "County": "Dougherty"
  },
  {
    "FIPS": 13097,
    "State": "Georgia",
    "County": "Douglas"
  },
  {
    "FIPS": 13099,
    "State": "Georgia",
    "County": "Early"
  },
  {
    "FIPS": 13101,
    "State": "Georgia",
    "County": "Echols"
  },
  {
    "FIPS": 13103,
    "State": "Georgia",
    "County": "Effingham"
  },
  {
    "FIPS": 13105,
    "State": "Georgia",
    "County": "Elbert"
  },
  {
    "FIPS": 13107,
    "State": "Georgia",
    "County": "Emanuel"
  },
  {
    "FIPS": 13109,
    "State": "Georgia",
    "County": "Evans"
  },
  {
    "FIPS": 13111,
    "State": "Georgia",
    "County": "Fannin"
  },
  {
    "FIPS": 13113,
    "State": "Georgia",
    "County": "Fayette"
  },
  {
    "FIPS": 13115,
    "State": "Georgia",
    "County": "Floyd"
  },
  {
    "FIPS": 13117,
    "State": "Georgia",
    "County": "Forsyth"
  },
  {
    "FIPS": 13119,
    "State": "Georgia",
    "County": "Franklin"
  },
  {
    "FIPS": 13121,
    "State": "Georgia",
    "County": "Fulton"
  },
  {
    "FIPS": 13123,
    "State": "Georgia",
    "County": "Gilmer"
  },
  {
    "FIPS": 13125,
    "State": "Georgia",
    "County": "Glascock"
  },
  {
    "FIPS": 13127,
    "State": "Georgia",
    "County": "Glynn"
  },
  {
    "FIPS": 13129,
    "State": "Georgia",
    "County": "Gordon"
  },
  {
    "FIPS": 13131,
    "State": "Georgia",
    "County": "Grady"
  },
  {
    "FIPS": 13133,
    "State": "Georgia",
    "County": "Greene"
  },
  {
    "FIPS": 13135,
    "State": "Georgia",
    "County": "Gwinnett"
  },
  {
    "FIPS": 13137,
    "State": "Georgia",
    "County": "Habersham"
  },
  {
    "FIPS": 13139,
    "State": "Georgia",
    "County": "Hall"
  },
  {
    "FIPS": 13141,
    "State": "Georgia",
    "County": "Hancock"
  },
  {
    "FIPS": 13143,
    "State": "Georgia",
    "County": "Haralson"
  },
  {
    "FIPS": 13145,
    "State": "Georgia",
    "County": "Harris"
  },
  {
    "FIPS": 13147,
    "State": "Georgia",
    "County": "Hart"
  },
  {
    "FIPS": 13149,
    "State": "Georgia",
    "County": "Heard"
  },
  {
    "FIPS": 13151,
    "State": "Georgia",
    "County": "Henry"
  },
  {
    "FIPS": 13153,
    "State": "Georgia",
    "County": "Houston"
  },
  {
    "FIPS": 13155,
    "State": "Georgia",
    "County": "Irwin"
  },
  {
    "FIPS": 13157,
    "State": "Georgia",
    "County": "Jackson"
  },
  {
    "FIPS": 13159,
    "State": "Georgia",
    "County": "Jasper"
  },
  {
    "FIPS": 13161,
    "State": "Georgia",
    "County": "Jeff Davis"
  },
  {
    "FIPS": 13163,
    "State": "Georgia",
    "County": "Jefferson"
  },
  {
    "FIPS": 13165,
    "State": "Georgia",
    "County": "Jenkins"
  },
  {
    "FIPS": 13167,
    "State": "Georgia",
    "County": "Johnson"
  },
  {
    "FIPS": 13169,
    "State": "Georgia",
    "County": "Jones"
  },
  {
    "FIPS": 13171,
    "State": "Georgia",
    "County": "Lamar"
  },
  {
    "FIPS": 13173,
    "State": "Georgia",
    "County": "Lanier"
  },
  {
    "FIPS": 13175,
    "State": "Georgia",
    "County": "Laurens"
  },
  {
    "FIPS": 13177,
    "State": "Georgia",
    "County": "Lee"
  },
  {
    "FIPS": 13179,
    "State": "Georgia",
    "County": "Liberty"
  },
  {
    "FIPS": 13181,
    "State": "Georgia",
    "County": "Lincoln"
  },
  {
    "FIPS": 13183,
    "State": "Georgia",
    "County": "Long"
  },
  {
    "FIPS": 13185,
    "State": "Georgia",
    "County": "Lowndes"
  },
  {
    "FIPS": 13187,
    "State": "Georgia",
    "County": "Lumpkin"
  },
  {
    "FIPS": 13189,
    "State": "Georgia",
    "County": "McDuffie"
  },
  {
    "FIPS": 13191,
    "State": "Georgia",
    "County": "McIntosh"
  },
  {
    "FIPS": 13193,
    "State": "Georgia",
    "County": "Macon"
  },
  {
    "FIPS": 13195,
    "State": "Georgia",
    "County": "Madison"
  },
  {
    "FIPS": 13197,
    "State": "Georgia",
    "County": "Marion"
  },
  {
    "FIPS": 13199,
    "State": "Georgia",
    "County": "Meriwether"
  },
  {
    "FIPS": 13201,
    "State": "Georgia",
    "County": "Miller"
  },
  {
    "FIPS": 13205,
    "State": "Georgia",
    "County": "Mitchell"
  },
  {
    "FIPS": 13207,
    "State": "Georgia",
    "County": "Monroe"
  },
  {
    "FIPS": 13209,
    "State": "Georgia",
    "County": "Montgomery"
  },
  {
    "FIPS": 13211,
    "State": "Georgia",
    "County": "Morgan"
  },
  {
    "FIPS": 13213,
    "State": "Georgia",
    "County": "Murray"
  },
  {
    "FIPS": 13215,
    "State": "Georgia",
    "County": "Muscogee"
  },
  {
    "FIPS": 13217,
    "State": "Georgia",
    "County": "Newton"
  },
  {
    "FIPS": 13219,
    "State": "Georgia",
    "County": "Oconee"
  },
  {
    "FIPS": 13221,
    "State": "Georgia",
    "County": "Oglethorpe"
  },
  {
    "FIPS": 13223,
    "State": "Georgia",
    "County": "Paulding"
  },
  {
    "FIPS": 13225,
    "State": "Georgia",
    "County": "Peach"
  },
  {
    "FIPS": 13227,
    "State": "Georgia",
    "County": "Pickens"
  },
  {
    "FIPS": 13229,
    "State": "Georgia",
    "County": "Pierce"
  },
  {
    "FIPS": 13231,
    "State": "Georgia",
    "County": "Pike"
  },
  {
    "FIPS": 13233,
    "State": "Georgia",
    "County": "Polk"
  },
  {
    "FIPS": 13235,
    "State": "Georgia",
    "County": "Pulaski"
  },
  {
    "FIPS": 13237,
    "State": "Georgia",
    "County": "Putnam"
  },
  {
    "FIPS": 13239,
    "State": "Georgia",
    "County": "Quitman"
  },
  {
    "FIPS": 13241,
    "State": "Georgia",
    "County": "Rabun"
  },
  {
    "FIPS": 13243,
    "State": "Georgia",
    "County": "Randolph"
  },
  {
    "FIPS": 13245,
    "State": "Georgia",
    "County": "Richmond"
  },
  {
    "FIPS": 13247,
    "State": "Georgia",
    "County": "Rockdale"
  },
  {
    "FIPS": 13249,
    "State": "Georgia",
    "County": "Schley"
  },
  {
    "FIPS": 13251,
    "State": "Georgia",
    "County": "Screven"
  },
  {
    "FIPS": 13253,
    "State": "Georgia",
    "County": "Seminole"
  },
  {
    "FIPS": 13255,
    "State": "Georgia",
    "County": "Spalding"
  },
  {
    "FIPS": 13257,
    "State": "Georgia",
    "County": "Stephens"
  },
  {
    "FIPS": 13259,
    "State": "Georgia",
    "County": "Stewart"
  },
  {
    "FIPS": 13261,
    "State": "Georgia",
    "County": "Sumter"
  },
  {
    "FIPS": 13263,
    "State": "Georgia",
    "County": "Talbot"
  },
  {
    "FIPS": 13265,
    "State": "Georgia",
    "County": "Taliaferro"
  },
  {
    "FIPS": 13267,
    "State": "Georgia",
    "County": "Tattnall"
  },
  {
    "FIPS": 13269,
    "State": "Georgia",
    "County": "Taylor"
  },
  {
    "FIPS": 13271,
    "State": "Georgia",
    "County": "Telfair"
  },
  {
    "FIPS": 13273,
    "State": "Georgia",
    "County": "Terrell"
  },
  {
    "FIPS": 13275,
    "State": "Georgia",
    "County": "Thomas"
  },
  {
    "FIPS": 13277,
    "State": "Georgia",
    "County": "Tift"
  },
  {
    "FIPS": 13279,
    "State": "Georgia",
    "County": "Toombs"
  },
  {
    "FIPS": 13281,
    "State": "Georgia",
    "County": "Towns"
  },
  {
    "FIPS": 13283,
    "State": "Georgia",
    "County": "Treutlen"
  },
  {
    "FIPS": 13285,
    "State": "Georgia",
    "County": "Troup"
  },
  {
    "FIPS": 13287,
    "State": "Georgia",
    "County": "Turner"
  },
  {
    "FIPS": 13289,
    "State": "Georgia",
    "County": "Twiggs"
  },
  {
    "FIPS": 13291,
    "State": "Georgia",
    "County": "Union"
  },
  {
    "FIPS": 13293,
    "State": "Georgia",
    "County": "Upson"
  },
  {
    "FIPS": 13295,
    "State": "Georgia",
    "County": "Walker"
  },
  {
    "FIPS": 13297,
    "State": "Georgia",
    "County": "Walton"
  },
  {
    "FIPS": 13299,
    "State": "Georgia",
    "County": "Ware"
  },
  {
    "FIPS": 13301,
    "State": "Georgia",
    "County": "Warren"
  },
  {
    "FIPS": 13303,
    "State": "Georgia",
    "County": "Washington"
  },
  {
    "FIPS": 13305,
    "State": "Georgia",
    "County": "Wayne"
  },
  {
    "FIPS": 13307,
    "State": "Georgia",
    "County": "Webster"
  },
  {
    "FIPS": 13309,
    "State": "Georgia",
    "County": "Wheeler"
  },
  {
    "FIPS": 13311,
    "State": "Georgia",
    "County": "White"
  },
  {
    "FIPS": 13313,
    "State": "Georgia",
    "County": "Whitfield"
  },
  {
    "FIPS": 13315,
    "State": "Georgia",
    "County": "Wilcox"
  },
  {
    "FIPS": 13317,
    "State": "Georgia",
    "County": "Wilkes"
  },
  {
    "FIPS": 13319,
    "State": "Georgia",
    "County": "Wilkinson"
  },
  {
    "FIPS": 13321,
    "State": "Georgia",
    "County": "Worth"
  },
  {
    "FIPS": 15001,
    "State": "Hawaii",
    "County": "Hawaii"
  },
  {
    "FIPS": 15003,
    "State": "Hawaii",
    "County": "Honolulu"
  },
  {
    "FIPS": 15005,
    "State": "Hawaii",
    "County": "Kalawao"
  },
  {
    "FIPS": 15007,
    "State": "Hawaii",
    "County": "Kauai"
  },
  {
    "FIPS": 15009,
    "State": "Hawaii",
    "County": "Maui"
  },
  {
    "FIPS": 16001,
    "State": "Idaho",
    "County": "Ada"
  },
  {
    "FIPS": 16003,
    "State": "Idaho",
    "County": "Adams"
  },
  {
    "FIPS": 16005,
    "State": "Idaho",
    "County": "Bannock"
  },
  {
    "FIPS": 16007,
    "State": "Idaho",
    "County": "Bear Lake"
  },
  {
    "FIPS": 16009,
    "State": "Idaho",
    "County": "Benewah"
  },
  {
    "FIPS": 16011,
    "State": "Idaho",
    "County": "Bingham"
  },
  {
    "FIPS": 16013,
    "State": "Idaho",
    "County": "Blaine"
  },
  {
    "FIPS": 16015,
    "State": "Idaho",
    "County": "Boise"
  },
  {
    "FIPS": 16017,
    "State": "Idaho",
    "County": "Bonner"
  },
  {
    "FIPS": 16019,
    "State": "Idaho",
    "County": "Bonneville"
  },
  {
    "FIPS": 16021,
    "State": "Idaho",
    "County": "Boundary"
  },
  {
    "FIPS": 16023,
    "State": "Idaho",
    "County": "Butte"
  },
  {
    "FIPS": 16025,
    "State": "Idaho",
    "County": "Camas"
  },
  {
    "FIPS": 16027,
    "State": "Idaho",
    "County": "Canyon"
  },
  {
    "FIPS": 16029,
    "State": "Idaho",
    "County": "Caribou"
  },
  {
    "FIPS": 16031,
    "State": "Idaho",
    "County": "Cassia"
  },
  {
    "FIPS": 16033,
    "State": "Idaho",
    "County": "Clark"
  },
  {
    "FIPS": 16035,
    "State": "Idaho",
    "County": "Clearwater"
  },
  {
    "FIPS": 16037,
    "State": "Idaho",
    "County": "Custer"
  },
  {
    "FIPS": 16039,
    "State": "Idaho",
    "County": "Elmore"
  },
  {
    "FIPS": 16041,
    "State": "Idaho",
    "County": "Franklin"
  },
  {
    "FIPS": 16043,
    "State": "Idaho",
    "County": "Fremont"
  },
  {
    "FIPS": 16045,
    "State": "Idaho",
    "County": "Gem"
  },
  {
    "FIPS": 16047,
    "State": "Idaho",
    "County": "Gooding"
  },
  {
    "FIPS": 16049,
    "State": "Idaho",
    "County": "Idaho"
  },
  {
    "FIPS": 16051,
    "State": "Idaho",
    "County": "Jefferson"
  },
  {
    "FIPS": 16053,
    "State": "Idaho",
    "County": "Jerome"
  },
  {
    "FIPS": 16055,
    "State": "Idaho",
    "County": "Kootenai"
  },
  {
    "FIPS": 16057,
    "State": "Idaho",
    "County": "Latah"
  },
  {
    "FIPS": 16059,
    "State": "Idaho",
    "County": "Lemhi"
  },
  {
    "FIPS": 16061,
    "State": "Idaho",
    "County": "Lewis"
  },
  {
    "FIPS": 16063,
    "State": "Idaho",
    "County": "Lincoln"
  },
  {
    "FIPS": 16065,
    "State": "Idaho",
    "County": "Madison"
  },
  {
    "FIPS": 16067,
    "State": "Idaho",
    "County": "Minidoka"
  },
  {
    "FIPS": 16069,
    "State": "Idaho",
    "County": "Nez Perce"
  },
  {
    "FIPS": 16071,
    "State": "Idaho",
    "County": "Oneida"
  },
  {
    "FIPS": 16073,
    "State": "Idaho",
    "County": "Owyhee"
  },
  {
    "FIPS": 16075,
    "State": "Idaho",
    "County": "Payette"
  },
  {
    "FIPS": 16077,
    "State": "Idaho",
    "County": "Power"
  },
  {
    "FIPS": 16079,
    "State": "Idaho",
    "County": "Shoshone"
  },
  {
    "FIPS": 16081,
    "State": "Idaho",
    "County": "Teton"
  },
  {
    "FIPS": 16083,
    "State": "Idaho",
    "County": "Twin Falls"
  },
  {
    "FIPS": 16085,
    "State": "Idaho",
    "County": "Valley"
  },
  {
    "FIPS": 16087,
    "State": "Idaho",
    "County": "Washington"
  },
  {
    "FIPS": 17001,
    "State": "Illinois",
    "County": "Adams"
  },
  {
    "FIPS": 17003,
    "State": "Illinois",
    "County": "Alexander"
  },
  {
    "FIPS": 17005,
    "State": "Illinois",
    "County": "Bond"
  },
  {
    "FIPS": 17007,
    "State": "Illinois",
    "County": "Boone"
  },
  {
    "FIPS": 17009,
    "State": "Illinois",
    "County": "Brown"
  },
  {
    "FIPS": 17011,
    "State": "Illinois",
    "County": "Bureau"
  },
  {
    "FIPS": 17013,
    "State": "Illinois",
    "County": "Calhoun"
  },
  {
    "FIPS": 17015,
    "State": "Illinois",
    "County": "Carroll"
  },
  {
    "FIPS": 17017,
    "State": "Illinois",
    "County": "Cass"
  },
  {
    "FIPS": 17019,
    "State": "Illinois",
    "County": "Champaign"
  },
  {
    "FIPS": 17021,
    "State": "Illinois",
    "County": "Christian"
  },
  {
    "FIPS": 17023,
    "State": "Illinois",
    "County": "Clark"
  },
  {
    "FIPS": 17025,
    "State": "Illinois",
    "County": "Clay"
  },
  {
    "FIPS": 17027,
    "State": "Illinois",
    "County": "Clinton"
  },
  {
    "FIPS": 17029,
    "State": "Illinois",
    "County": "Coles"
  },
  {
    "FIPS": 17031,
    "State": "Illinois",
    "County": "Cook"
  },
  {
    "FIPS": 17033,
    "State": "Illinois",
    "County": "Crawford"
  },
  {
    "FIPS": 17035,
    "State": "Illinois",
    "County": "Cumberland"
  },
  {
    "FIPS": 17037,
    "State": "Illinois",
    "County": "DeKalb"
  },
  {
    "FIPS": 17039,
    "State": "Illinois",
    "County": "De Witt"
  },
  {
    "FIPS": 17041,
    "State": "Illinois",
    "County": "Douglas"
  },
  {
    "FIPS": 17043,
    "State": "Illinois",
    "County": "DuPage"
  },
  {
    "FIPS": 17045,
    "State": "Illinois",
    "County": "Edgar"
  },
  {
    "FIPS": 17047,
    "State": "Illinois",
    "County": "Edwards"
  },
  {
    "FIPS": 17049,
    "State": "Illinois",
    "County": "Effingham"
  },
  {
    "FIPS": 17051,
    "State": "Illinois",
    "County": "Fayette"
  },
  {
    "FIPS": 17053,
    "State": "Illinois",
    "County": "Ford"
  },
  {
    "FIPS": 17055,
    "State": "Illinois",
    "County": "Franklin"
  },
  {
    "FIPS": 17057,
    "State": "Illinois",
    "County": "Fulton"
  },
  {
    "FIPS": 17059,
    "State": "Illinois",
    "County": "Gallatin"
  },
  {
    "FIPS": 17061,
    "State": "Illinois",
    "County": "Greene"
  },
  {
    "FIPS": 17063,
    "State": "Illinois",
    "County": "Grundy"
  },
  {
    "FIPS": 17065,
    "State": "Illinois",
    "County": "Hamilton"
  },
  {
    "FIPS": 17067,
    "State": "Illinois",
    "County": "Hancock"
  },
  {
    "FIPS": 17069,
    "State": "Illinois",
    "County": "Hardin"
  },
  {
    "FIPS": 17071,
    "State": "Illinois",
    "County": "Henderson"
  },
  {
    "FIPS": 17073,
    "State": "Illinois",
    "County": "Henry"
  },
  {
    "FIPS": 17075,
    "State": "Illinois",
    "County": "Iroquois"
  },
  {
    "FIPS": 17077,
    "State": "Illinois",
    "County": "Jackson"
  },
  {
    "FIPS": 17079,
    "State": "Illinois",
    "County": "Jasper"
  },
  {
    "FIPS": 17081,
    "State": "Illinois",
    "County": "Jefferson"
  },
  {
    "FIPS": 17083,
    "State": "Illinois",
    "County": "Jersey"
  },
  {
    "FIPS": 17085,
    "State": "Illinois",
    "County": "Jo Daviess"
  },
  {
    "FIPS": 17087,
    "State": "Illinois",
    "County": "Johnson"
  },
  {
    "FIPS": 17089,
    "State": "Illinois",
    "County": "Kane"
  },
  {
    "FIPS": 17091,
    "State": "Illinois",
    "County": "Kankakee"
  },
  {
    "FIPS": 17093,
    "State": "Illinois",
    "County": "Kendall"
  },
  {
    "FIPS": 17095,
    "State": "Illinois",
    "County": "Knox"
  },
  {
    "FIPS": 17097,
    "State": "Illinois",
    "County": "Lake"
  },
  {
    "FIPS": 17099,
    "State": "Illinois",
    "County": "La Salle"
  },
  {
    "FIPS": 17101,
    "State": "Illinois",
    "County": "Lawrence"
  },
  {
    "FIPS": 17103,
    "State": "Illinois",
    "County": "Lee"
  },
  {
    "FIPS": 17105,
    "State": "Illinois",
    "County": "Livingston"
  },
  {
    "FIPS": 17107,
    "State": "Illinois",
    "County": "Logan"
  },
  {
    "FIPS": 17109,
    "State": "Illinois",
    "County": "McDonough"
  },
  {
    "FIPS": 17111,
    "State": "Illinois",
    "County": "McHenry"
  },
  {
    "FIPS": 17113,
    "State": "Illinois",
    "County": "McLean"
  },
  {
    "FIPS": 17115,
    "State": "Illinois",
    "County": "Macon"
  },
  {
    "FIPS": 17117,
    "State": "Illinois",
    "County": "Macoupin"
  },
  {
    "FIPS": 17119,
    "State": "Illinois",
    "County": "Madison"
  },
  {
    "FIPS": 17121,
    "State": "Illinois",
    "County": "Marion"
  },
  {
    "FIPS": 17123,
    "State": "Illinois",
    "County": "Marshall"
  },
  {
    "FIPS": 17125,
    "State": "Illinois",
    "County": "Mason"
  },
  {
    "FIPS": 17127,
    "State": "Illinois",
    "County": "Massac"
  },
  {
    "FIPS": 17129,
    "State": "Illinois",
    "County": "Menard"
  },
  {
    "FIPS": 17131,
    "State": "Illinois",
    "County": "Mercer"
  },
  {
    "FIPS": 17133,
    "State": "Illinois",
    "County": "Monroe"
  },
  {
    "FIPS": 17135,
    "State": "Illinois",
    "County": "Montgomery"
  },
  {
    "FIPS": 17137,
    "State": "Illinois",
    "County": "Morgan"
  },
  {
    "FIPS": 17139,
    "State": "Illinois",
    "County": "Moultrie"
  },
  {
    "FIPS": 17141,
    "State": "Illinois",
    "County": "Ogle"
  },
  {
    "FIPS": 17143,
    "State": "Illinois",
    "County": "Peoria"
  },
  {
    "FIPS": 17145,
    "State": "Illinois",
    "County": "Perry"
  },
  {
    "FIPS": 17147,
    "State": "Illinois",
    "County": "Piatt"
  },
  {
    "FIPS": 17149,
    "State": "Illinois",
    "County": "Pike"
  },
  {
    "FIPS": 17151,
    "State": "Illinois",
    "County": "Pope"
  },
  {
    "FIPS": 17153,
    "State": "Illinois",
    "County": "Pulaski"
  },
  {
    "FIPS": 17155,
    "State": "Illinois",
    "County": "Putnam"
  },
  {
    "FIPS": 17157,
    "State": "Illinois",
    "County": "Randolph"
  },
  {
    "FIPS": 17159,
    "State": "Illinois",
    "County": "Richland"
  },
  {
    "FIPS": 17161,
    "State": "Illinois",
    "County": "Rock Island"
  },
  {
    "FIPS": 17163,
    "State": "Illinois",
    "County": "St. Clair"
  },
  {
    "FIPS": 17165,
    "State": "Illinois",
    "County": "Saline"
  },
  {
    "FIPS": 17167,
    "State": "Illinois",
    "County": "Sangamon"
  },
  {
    "FIPS": 17169,
    "State": "Illinois",
    "County": "Schuyler"
  },
  {
    "FIPS": 17171,
    "State": "Illinois",
    "County": "Scott"
  },
  {
    "FIPS": 17173,
    "State": "Illinois",
    "County": "Shelby"
  },
  {
    "FIPS": 17175,
    "State": "Illinois",
    "County": "Stark"
  },
  {
    "FIPS": 17177,
    "State": "Illinois",
    "County": "Stephenson"
  },
  {
    "FIPS": 17179,
    "State": "Illinois",
    "County": "Tazewell"
  },
  {
    "FIPS": 17181,
    "State": "Illinois",
    "County": "Union"
  },
  {
    "FIPS": 17183,
    "State": "Illinois",
    "County": "Vermilion"
  },
  {
    "FIPS": 17185,
    "State": "Illinois",
    "County": "Wabash"
  },
  {
    "FIPS": 17187,
    "State": "Illinois",
    "County": "Warren"
  },
  {
    "FIPS": 17189,
    "State": "Illinois",
    "County": "Washington"
  },
  {
    "FIPS": 17191,
    "State": "Illinois",
    "County": "Wayne"
  },
  {
    "FIPS": 17193,
    "State": "Illinois",
    "County": "White"
  },
  {
    "FIPS": 17195,
    "State": "Illinois",
    "County": "Whiteside"
  },
  {
    "FIPS": 17197,
    "State": "Illinois",
    "County": "Will"
  },
  {
    "FIPS": 17199,
    "State": "Illinois",
    "County": "Williamson"
  },
  {
    "FIPS": 17201,
    "State": "Illinois",
    "County": "Winnebago"
  },
  {
    "FIPS": 17203,
    "State": "Illinois",
    "County": "Woodford"
  },
  {
    "FIPS": 18001,
    "State": "Indiana",
    "County": "Adams"
  },
  {
    "FIPS": 18003,
    "State": "Indiana",
    "County": "Allen"
  },
  {
    "FIPS": 18005,
    "State": "Indiana",
    "County": "Bartholomew"
  },
  {
    "FIPS": 18007,
    "State": "Indiana",
    "County": "Benton"
  },
  {
    "FIPS": 18009,
    "State": "Indiana",
    "County": "Blackford"
  },
  {
    "FIPS": 18011,
    "State": "Indiana",
    "County": "Boone"
  },
  {
    "FIPS": 18013,
    "State": "Indiana",
    "County": "Brown"
  },
  {
    "FIPS": 18015,
    "State": "Indiana",
    "County": "Carroll"
  },
  {
    "FIPS": 18017,
    "State": "Indiana",
    "County": "Cass"
  },
  {
    "FIPS": 18019,
    "State": "Indiana",
    "County": "Clark"
  },
  {
    "FIPS": 18021,
    "State": "Indiana",
    "County": "Clay"
  },
  {
    "FIPS": 18023,
    "State": "Indiana",
    "County": "Clinton"
  },
  {
    "FIPS": 18025,
    "State": "Indiana",
    "County": "Crawford"
  },
  {
    "FIPS": 18027,
    "State": "Indiana",
    "County": "Daviess"
  },
  {
    "FIPS": 18029,
    "State": "Indiana",
    "County": "Dearborn"
  },
  {
    "FIPS": 18031,
    "State": "Indiana",
    "County": "Decatur"
  },
  {
    "FIPS": 18033,
    "State": "Indiana",
    "County": "De Kalb"
  },
  {
    "FIPS": 18035,
    "State": "Indiana",
    "County": "Delaware"
  },
  {
    "FIPS": 18037,
    "State": "Indiana",
    "County": "Dubois"
  },
  {
    "FIPS": 18039,
    "State": "Indiana",
    "County": "Elkhart"
  },
  {
    "FIPS": 18041,
    "State": "Indiana",
    "County": "Fayette"
  },
  {
    "FIPS": 18043,
    "State": "Indiana",
    "County": "Floyd"
  },
  {
    "FIPS": 18045,
    "State": "Indiana",
    "County": "Fountain"
  },
  {
    "FIPS": 18047,
    "State": "Indiana",
    "County": "Franklin"
  },
  {
    "FIPS": 18049,
    "State": "Indiana",
    "County": "Fulton"
  },
  {
    "FIPS": 18051,
    "State": "Indiana",
    "County": "Gibson"
  },
  {
    "FIPS": 18053,
    "State": "Indiana",
    "County": "Grant"
  },
  {
    "FIPS": 18055,
    "State": "Indiana",
    "County": "Greene"
  },
  {
    "FIPS": 18057,
    "State": "Indiana",
    "County": "Hamilton"
  },
  {
    "FIPS": 18059,
    "State": "Indiana",
    "County": "Hancock"
  },
  {
    "FIPS": 18061,
    "State": "Indiana",
    "County": "Harrison"
  },
  {
    "FIPS": 18063,
    "State": "Indiana",
    "County": "Hendricks"
  },
  {
    "FIPS": 18065,
    "State": "Indiana",
    "County": "Henry"
  },
  {
    "FIPS": 18067,
    "State": "Indiana",
    "County": "Howard"
  },
  {
    "FIPS": 18069,
    "State": "Indiana",
    "County": "Huntington"
  },
  {
    "FIPS": 18071,
    "State": "Indiana",
    "County": "Jackson"
  },
  {
    "FIPS": 18073,
    "State": "Indiana",
    "County": "Jasper"
  },
  {
    "FIPS": 18075,
    "State": "Indiana",
    "County": "Jay"
  },
  {
    "FIPS": 18077,
    "State": "Indiana",
    "County": "Jefferson"
  },
  {
    "FIPS": 18079,
    "State": "Indiana",
    "County": "Jennings"
  },
  {
    "FIPS": 18081,
    "State": "Indiana",
    "County": "Johnson"
  },
  {
    "FIPS": 18083,
    "State": "Indiana",
    "County": "Knox"
  },
  {
    "FIPS": 18085,
    "State": "Indiana",
    "County": "Kosciusko"
  },
  {
    "FIPS": 18087,
    "State": "Indiana",
    "County": "Lagrange"
  },
  {
    "FIPS": 18089,
    "State": "Indiana",
    "County": "Lake"
  },
  {
    "FIPS": 18091,
    "State": "Indiana",
    "County": "La Porte"
  },
  {
    "FIPS": 18093,
    "State": "Indiana",
    "County": "Lawrence"
  },
  {
    "FIPS": 18095,
    "State": "Indiana",
    "County": "Madison"
  },
  {
    "FIPS": 18097,
    "State": "Indiana",
    "County": "Marion"
  },
  {
    "FIPS": 18099,
    "State": "Indiana",
    "County": "Marshall"
  },
  {
    "FIPS": 18101,
    "State": "Indiana",
    "County": "Martin"
  },
  {
    "FIPS": 18103,
    "State": "Indiana",
    "County": "Miami"
  },
  {
    "FIPS": 18105,
    "State": "Indiana",
    "County": "Monroe"
  },
  {
    "FIPS": 18107,
    "State": "Indiana",
    "County": "Montgomery"
  },
  {
    "FIPS": 18109,
    "State": "Indiana",
    "County": "Morgan"
  },
  {
    "FIPS": 18111,
    "State": "Indiana",
    "County": "Newton"
  },
  {
    "FIPS": 18113,
    "State": "Indiana",
    "County": "Noble"
  },
  {
    "FIPS": 18115,
    "State": "Indiana",
    "County": "Ohio"
  },
  {
    "FIPS": 18117,
    "State": "Indiana",
    "County": "Orange"
  },
  {
    "FIPS": 18119,
    "State": "Indiana",
    "County": "Owen"
  },
  {
    "FIPS": 18121,
    "State": "Indiana",
    "County": "Parke"
  },
  {
    "FIPS": 18123,
    "State": "Indiana",
    "County": "Perry"
  },
  {
    "FIPS": 18125,
    "State": "Indiana",
    "County": "Pike"
  },
  {
    "FIPS": 18127,
    "State": "Indiana",
    "County": "Porter"
  },
  {
    "FIPS": 18129,
    "State": "Indiana",
    "County": "Posey"
  },
  {
    "FIPS": 18131,
    "State": "Indiana",
    "County": "Pulaski"
  },
  {
    "FIPS": 18133,
    "State": "Indiana",
    "County": "Putnam"
  },
  {
    "FIPS": 18135,
    "State": "Indiana",
    "County": "Randolph"
  },
  {
    "FIPS": 18137,
    "State": "Indiana",
    "County": "Ripley"
  },
  {
    "FIPS": 18139,
    "State": "Indiana",
    "County": "Rush"
  },
  {
    "FIPS": 18141,
    "State": "Indiana",
    "County": "St. Joseph"
  },
  {
    "FIPS": 18143,
    "State": "Indiana",
    "County": "Scott"
  },
  {
    "FIPS": 18145,
    "State": "Indiana",
    "County": "Shelby"
  },
  {
    "FIPS": 18147,
    "State": "Indiana",
    "County": "Spencer"
  },
  {
    "FIPS": 18149,
    "State": "Indiana",
    "County": "Starke"
  },
  {
    "FIPS": 18151,
    "State": "Indiana",
    "County": "Steuben"
  },
  {
    "FIPS": 18153,
    "State": "Indiana",
    "County": "Sullivan"
  },
  {
    "FIPS": 18155,
    "State": "Indiana",
    "County": "Switzerland"
  },
  {
    "FIPS": 18157,
    "State": "Indiana",
    "County": "Tippecanoe"
  },
  {
    "FIPS": 18159,
    "State": "Indiana",
    "County": "Tipton"
  },
  {
    "FIPS": 18161,
    "State": "Indiana",
    "County": "Union"
  },
  {
    "FIPS": 18163,
    "State": "Indiana",
    "County": "Vanderburgh"
  },
  {
    "FIPS": 18165,
    "State": "Indiana",
    "County": "Vermillion"
  },
  {
    "FIPS": 18167,
    "State": "Indiana",
    "County": "Vigo"
  },
  {
    "FIPS": 18169,
    "State": "Indiana",
    "County": "Wabash"
  },
  {
    "FIPS": 18171,
    "State": "Indiana",
    "County": "Warren"
  },
  {
    "FIPS": 18173,
    "State": "Indiana",
    "County": "Warrick"
  },
  {
    "FIPS": 18175,
    "State": "Indiana",
    "County": "Washington"
  },
  {
    "FIPS": 18177,
    "State": "Indiana",
    "County": "Wayne"
  },
  {
    "FIPS": 18179,
    "State": "Indiana",
    "County": "Wells"
  },
  {
    "FIPS": 18181,
    "State": "Indiana",
    "County": "White"
  },
  {
    "FIPS": 18183,
    "State": "Indiana",
    "County": "Whitley"
  },
  {
    "FIPS": 19001,
    "State": "Iowa",
    "County": "Adair"
  },
  {
    "FIPS": 19003,
    "State": "Iowa",
    "County": "Adams"
  },
  {
    "FIPS": 19005,
    "State": "Iowa",
    "County": "Allamakee"
  },
  {
    "FIPS": 19007,
    "State": "Iowa",
    "County": "Appanoose"
  },
  {
    "FIPS": 19009,
    "State": "Iowa",
    "County": "Audubon"
  },
  {
    "FIPS": 19011,
    "State": "Iowa",
    "County": "Benton"
  },
  {
    "FIPS": 19013,
    "State": "Iowa",
    "County": "Black Hawk"
  },
  {
    "FIPS": 19015,
    "State": "Iowa",
    "County": "Boone"
  },
  {
    "FIPS": 19017,
    "State": "Iowa",
    "County": "Bremer"
  },
  {
    "FIPS": 19019,
    "State": "Iowa",
    "County": "Buchanan"
  },
  {
    "FIPS": 19021,
    "State": "Iowa",
    "County": "Buena Vista"
  },
  {
    "FIPS": 19023,
    "State": "Iowa",
    "County": "Butler"
  },
  {
    "FIPS": 19025,
    "State": "Iowa",
    "County": "Calhoun"
  },
  {
    "FIPS": 19027,
    "State": "Iowa",
    "County": "Carroll"
  },
  {
    "FIPS": 19029,
    "State": "Iowa",
    "County": "Cass"
  },
  {
    "FIPS": 19031,
    "State": "Iowa",
    "County": "Cedar"
  },
  {
    "FIPS": 19033,
    "State": "Iowa",
    "County": "Cerro Gordo"
  },
  {
    "FIPS": 19035,
    "State": "Iowa",
    "County": "Cherokee"
  },
  {
    "FIPS": 19037,
    "State": "Iowa",
    "County": "Chickasaw"
  },
  {
    "FIPS": 19039,
    "State": "Iowa",
    "County": "Clarke"
  },
  {
    "FIPS": 19041,
    "State": "Iowa",
    "County": "Clay"
  },
  {
    "FIPS": 19043,
    "State": "Iowa",
    "County": "Clayton"
  },
  {
    "FIPS": 19045,
    "State": "Iowa",
    "County": "Clinton"
  },
  {
    "FIPS": 19047,
    "State": "Iowa",
    "County": "Crawford"
  },
  {
    "FIPS": 19049,
    "State": "Iowa",
    "County": "Dallas"
  },
  {
    "FIPS": 19051,
    "State": "Iowa",
    "County": "Davis"
  },
  {
    "FIPS": 19053,
    "State": "Iowa",
    "County": "Decatur"
  },
  {
    "FIPS": 19055,
    "State": "Iowa",
    "County": "Delaware"
  },
  {
    "FIPS": 19057,
    "State": "Iowa",
    "County": "Des Moines"
  },
  {
    "FIPS": 19059,
    "State": "Iowa",
    "County": "Dickinson"
  },
  {
    "FIPS": 19061,
    "State": "Iowa",
    "County": "Dubuque"
  },
  {
    "FIPS": 19063,
    "State": "Iowa",
    "County": "Emmet"
  },
  {
    "FIPS": 19065,
    "State": "Iowa",
    "County": "Fayette"
  },
  {
    "FIPS": 19067,
    "State": "Iowa",
    "County": "Floyd"
  },
  {
    "FIPS": 19069,
    "State": "Iowa",
    "County": "Franklin"
  },
  {
    "FIPS": 19071,
    "State": "Iowa",
    "County": "Fremont"
  },
  {
    "FIPS": 19073,
    "State": "Iowa",
    "County": "Greene"
  },
  {
    "FIPS": 19075,
    "State": "Iowa",
    "County": "Grundy"
  },
  {
    "FIPS": 19077,
    "State": "Iowa",
    "County": "Guthrie"
  },
  {
    "FIPS": 19079,
    "State": "Iowa",
    "County": "Hamilton"
  },
  {
    "FIPS": 19081,
    "State": "Iowa",
    "County": "Hancock"
  },
  {
    "FIPS": 19083,
    "State": "Iowa",
    "County": "Hardin"
  },
  {
    "FIPS": 19085,
    "State": "Iowa",
    "County": "Harrison"
  },
  {
    "FIPS": 19087,
    "State": "Iowa",
    "County": "Henry"
  },
  {
    "FIPS": 19089,
    "State": "Iowa",
    "County": "Howard"
  },
  {
    "FIPS": 19091,
    "State": "Iowa",
    "County": "Humboldt"
  },
  {
    "FIPS": 19093,
    "State": "Iowa",
    "County": "Ida"
  },
  {
    "FIPS": 19095,
    "State": "Iowa",
    "County": "Iowa"
  },
  {
    "FIPS": 19097,
    "State": "Iowa",
    "County": "Jackson"
  },
  {
    "FIPS": 19099,
    "State": "Iowa",
    "County": "Jasper"
  },
  {
    "FIPS": 19101,
    "State": "Iowa",
    "County": "Jefferson"
  },
  {
    "FIPS": 19103,
    "State": "Iowa",
    "County": "Johnson"
  },
  {
    "FIPS": 19105,
    "State": "Iowa",
    "County": "Jones"
  },
  {
    "FIPS": 19107,
    "State": "Iowa",
    "County": "Keokuk"
  },
  {
    "FIPS": 19109,
    "State": "Iowa",
    "County": "Kossuth"
  },
  {
    "FIPS": 19111,
    "State": "Iowa",
    "County": "Lee"
  },
  {
    "FIPS": 19113,
    "State": "Iowa",
    "County": "Linn"
  },
  {
    "FIPS": 19115,
    "State": "Iowa",
    "County": "Louisa"
  },
  {
    "FIPS": 19117,
    "State": "Iowa",
    "County": "Lucas"
  },
  {
    "FIPS": 19119,
    "State": "Iowa",
    "County": "Lyon"
  },
  {
    "FIPS": 19121,
    "State": "Iowa",
    "County": "Madison"
  },
  {
    "FIPS": 19123,
    "State": "Iowa",
    "County": "Mahaska"
  },
  {
    "FIPS": 19125,
    "State": "Iowa",
    "County": "Marion"
  },
  {
    "FIPS": 19127,
    "State": "Iowa",
    "County": "Marshall"
  },
  {
    "FIPS": 19129,
    "State": "Iowa",
    "County": "Mills"
  },
  {
    "FIPS": 19131,
    "State": "Iowa",
    "County": "Mitchell"
  },
  {
    "FIPS": 19133,
    "State": "Iowa",
    "County": "Monona"
  },
  {
    "FIPS": 19135,
    "State": "Iowa",
    "County": "Monroe"
  },
  {
    "FIPS": 19137,
    "State": "Iowa",
    "County": "Montgomery"
  },
  {
    "FIPS": 19139,
    "State": "Iowa",
    "County": "Muscatine"
  },
  {
    "FIPS": 19141,
    "State": "Iowa",
    "County": "O'Brien"
  },
  {
    "FIPS": 19143,
    "State": "Iowa",
    "County": "Osceola"
  },
  {
    "FIPS": 19145,
    "State": "Iowa",
    "County": "Page"
  },
  {
    "FIPS": 19147,
    "State": "Iowa",
    "County": "Palo Alto"
  },
  {
    "FIPS": 19149,
    "State": "Iowa",
    "County": "Plymouth"
  },
  {
    "FIPS": 19151,
    "State": "Iowa",
    "County": "Pocahontas"
  },
  {
    "FIPS": 19153,
    "State": "Iowa",
    "County": "Polk"
  },
  {
    "FIPS": 19155,
    "State": "Iowa",
    "County": "Pottawattamie"
  },
  {
    "FIPS": 19157,
    "State": "Iowa",
    "County": "Poweshiek"
  },
  {
    "FIPS": 19159,
    "State": "Iowa",
    "County": "Ringgold"
  },
  {
    "FIPS": 19161,
    "State": "Iowa",
    "County": "Sac"
  },
  {
    "FIPS": 19163,
    "State": "Iowa",
    "County": "Scott"
  },
  {
    "FIPS": 19165,
    "State": "Iowa",
    "County": "Shelby"
  },
  {
    "FIPS": 19167,
    "State": "Iowa",
    "County": "Sioux"
  },
  {
    "FIPS": 19169,
    "State": "Iowa",
    "County": "Story"
  },
  {
    "FIPS": 19171,
    "State": "Iowa",
    "County": "Tama"
  },
  {
    "FIPS": 19173,
    "State": "Iowa",
    "County": "Taylor"
  },
  {
    "FIPS": 19175,
    "State": "Iowa",
    "County": "Union"
  },
  {
    "FIPS": 19177,
    "State": "Iowa",
    "County": "Van Buren"
  },
  {
    "FIPS": 19179,
    "State": "Iowa",
    "County": "Wapello"
  },
  {
    "FIPS": 19181,
    "State": "Iowa",
    "County": "Warren"
  },
  {
    "FIPS": 19183,
    "State": "Iowa",
    "County": "Washington"
  },
  {
    "FIPS": 19185,
    "State": "Iowa",
    "County": "Wayne"
  },
  {
    "FIPS": 19187,
    "State": "Iowa",
    "County": "Webster"
  },
  {
    "FIPS": 19189,
    "State": "Iowa",
    "County": "Winnebago"
  },
  {
    "FIPS": 19191,
    "State": "Iowa",
    "County": "Winneshiek"
  },
  {
    "FIPS": 19193,
    "State": "Iowa",
    "County": "Woodbury"
  },
  {
    "FIPS": 19195,
    "State": "Iowa",
    "County": "Worth"
  },
  {
    "FIPS": 19197,
    "State": "Iowa",
    "County": "Wright"
  },
  {
    "FIPS": 20001,
    "State": "Kansas",
    "County": "Allen"
  },
  {
    "FIPS": 20003,
    "State": "Kansas",
    "County": "Anderson"
  },
  {
    "FIPS": 20005,
    "State": "Kansas",
    "County": "Atchison"
  },
  {
    "FIPS": 20007,
    "State": "Kansas",
    "County": "Barber"
  },
  {
    "FIPS": 20009,
    "State": "Kansas",
    "County": "Barton"
  },
  {
    "FIPS": 20011,
    "State": "Kansas",
    "County": "Bourbon"
  },
  {
    "FIPS": 20013,
    "State": "Kansas",
    "County": "Brown"
  },
  {
    "FIPS": 20015,
    "State": "Kansas",
    "County": "Butler"
  },
  {
    "FIPS": 20017,
    "State": "Kansas",
    "County": "Chase"
  },
  {
    "FIPS": 20019,
    "State": "Kansas",
    "County": "Chautauqua"
  },
  {
    "FIPS": 20021,
    "State": "Kansas",
    "County": "Cherokee"
  },
  {
    "FIPS": 20023,
    "State": "Kansas",
    "County": "Cheyenne"
  },
  {
    "FIPS": 20025,
    "State": "Kansas",
    "County": "Clark"
  },
  {
    "FIPS": 20027,
    "State": "Kansas",
    "County": "Clay"
  },
  {
    "FIPS": 20029,
    "State": "Kansas",
    "County": "Cloud"
  },
  {
    "FIPS": 20031,
    "State": "Kansas",
    "County": "Coffey"
  },
  {
    "FIPS": 20033,
    "State": "Kansas",
    "County": "Comanche"
  },
  {
    "FIPS": 20035,
    "State": "Kansas",
    "County": "Cowley"
  },
  {
    "FIPS": 20037,
    "State": "Kansas",
    "County": "Crawford"
  },
  {
    "FIPS": 20039,
    "State": "Kansas",
    "County": "Decatur"
  },
  {
    "FIPS": 20041,
    "State": "Kansas",
    "County": "Dickinson"
  },
  {
    "FIPS": 20043,
    "State": "Kansas",
    "County": "Doniphan"
  },
  {
    "FIPS": 20045,
    "State": "Kansas",
    "County": "Douglas"
  },
  {
    "FIPS": 20047,
    "State": "Kansas",
    "County": "Edwards"
  },
  {
    "FIPS": 20049,
    "State": "Kansas",
    "County": "Elk"
  },
  {
    "FIPS": 20051,
    "State": "Kansas",
    "County": "Ellis"
  },
  {
    "FIPS": 20053,
    "State": "Kansas",
    "County": "Ellsworth"
  },
  {
    "FIPS": 20055,
    "State": "Kansas",
    "County": "Finney"
  },
  {
    "FIPS": 20057,
    "State": "Kansas",
    "County": "Ford"
  },
  {
    "FIPS": 20059,
    "State": "Kansas",
    "County": "Franklin"
  },
  {
    "FIPS": 20061,
    "State": "Kansas",
    "County": "Geary"
  },
  {
    "FIPS": 20063,
    "State": "Kansas",
    "County": "Gove"
  },
  {
    "FIPS": 20065,
    "State": "Kansas",
    "County": "Graham"
  },
  {
    "FIPS": 20067,
    "State": "Kansas",
    "County": "Grant"
  },
  {
    "FIPS": 20069,
    "State": "Kansas",
    "County": "Gray"
  },
  {
    "FIPS": 20071,
    "State": "Kansas",
    "County": "Greeley"
  },
  {
    "FIPS": 20073,
    "State": "Kansas",
    "County": "Greenwood"
  },
  {
    "FIPS": 20075,
    "State": "Kansas",
    "County": "Hamilton"
  },
  {
    "FIPS": 20077,
    "State": "Kansas",
    "County": "Harper"
  },
  {
    "FIPS": 20079,
    "State": "Kansas",
    "County": "Harvey"
  },
  {
    "FIPS": 20081,
    "State": "Kansas",
    "County": "Haskell"
  },
  {
    "FIPS": 20083,
    "State": "Kansas",
    "County": "Hodgeman"
  },
  {
    "FIPS": 20085,
    "State": "Kansas",
    "County": "Jackson"
  },
  {
    "FIPS": 20087,
    "State": "Kansas",
    "County": "Jefferson"
  },
  {
    "FIPS": 20089,
    "State": "Kansas",
    "County": "Jewell"
  },
  {
    "FIPS": 20091,
    "State": "Kansas",
    "County": "Johnson"
  },
  {
    "FIPS": 20093,
    "State": "Kansas",
    "County": "Kearny"
  },
  {
    "FIPS": 20095,
    "State": "Kansas",
    "County": "Kingman"
  },
  {
    "FIPS": 20097,
    "State": "Kansas",
    "County": "Kiowa"
  },
  {
    "FIPS": 20099,
    "State": "Kansas",
    "County": "Labette"
  },
  {
    "FIPS": 20101,
    "State": "Kansas",
    "County": "Lane"
  },
  {
    "FIPS": 20103,
    "State": "Kansas",
    "County": "Leavenworth"
  },
  {
    "FIPS": 20105,
    "State": "Kansas",
    "County": "Lincoln"
  },
  {
    "FIPS": 20107,
    "State": "Kansas",
    "County": "Linn"
  },
  {
    "FIPS": 20109,
    "State": "Kansas",
    "County": "Logan"
  },
  {
    "FIPS": 20111,
    "State": "Kansas",
    "County": "Lyon"
  },
  {
    "FIPS": 20113,
    "State": "Kansas",
    "County": "McPherson"
  },
  {
    "FIPS": 20115,
    "State": "Kansas",
    "County": "Marion"
  },
  {
    "FIPS": 20117,
    "State": "Kansas",
    "County": "Marshall"
  },
  {
    "FIPS": 20119,
    "State": "Kansas",
    "County": "Meade"
  },
  {
    "FIPS": 20121,
    "State": "Kansas",
    "County": "Miami"
  },
  {
    "FIPS": 20123,
    "State": "Kansas",
    "County": "Mitchell"
  },
  {
    "FIPS": 20125,
    "State": "Kansas",
    "County": "Montgomery"
  },
  {
    "FIPS": 20127,
    "State": "Kansas",
    "County": "Morris"
  },
  {
    "FIPS": 20129,
    "State": "Kansas",
    "County": "Morton"
  },
  {
    "FIPS": 20131,
    "State": "Kansas",
    "County": "Nemaha"
  },
  {
    "FIPS": 20133,
    "State": "Kansas",
    "County": "Neosho"
  },
  {
    "FIPS": 20135,
    "State": "Kansas",
    "County": "Ness"
  },
  {
    "FIPS": 20137,
    "State": "Kansas",
    "County": "Norton"
  },
  {
    "FIPS": 20139,
    "State": "Kansas",
    "County": "Osage"
  },
  {
    "FIPS": 20141,
    "State": "Kansas",
    "County": "Osborne"
  },
  {
    "FIPS": 20143,
    "State": "Kansas",
    "County": "Ottawa"
  },
  {
    "FIPS": 20145,
    "State": "Kansas",
    "County": "Pawnee"
  },
  {
    "FIPS": 20147,
    "State": "Kansas",
    "County": "Phillips"
  },
  {
    "FIPS": 20149,
    "State": "Kansas",
    "County": "Pottawatomie"
  },
  {
    "FIPS": 20151,
    "State": "Kansas",
    "County": "Pratt"
  },
  {
    "FIPS": 20153,
    "State": "Kansas",
    "County": "Rawlins"
  },
  {
    "FIPS": 20155,
    "State": "Kansas",
    "County": "Reno"
  },
  {
    "FIPS": 20157,
    "State": "Kansas",
    "County": "Republic"
  },
  {
    "FIPS": 20159,
    "State": "Kansas",
    "County": "Rice"
  },
  {
    "FIPS": 20161,
    "State": "Kansas",
    "County": "Riley"
  },
  {
    "FIPS": 20163,
    "State": "Kansas",
    "County": "Rooks"
  },
  {
    "FIPS": 20165,
    "State": "Kansas",
    "County": "Rush"
  },
  {
    "FIPS": 20167,
    "State": "Kansas",
    "County": "Russell"
  },
  {
    "FIPS": 20169,
    "State": "Kansas",
    "County": "Saline"
  },
  {
    "FIPS": 20171,
    "State": "Kansas",
    "County": "Scott"
  },
  {
    "FIPS": 20173,
    "State": "Kansas",
    "County": "Sedgwick"
  },
  {
    "FIPS": 20175,
    "State": "Kansas",
    "County": "Seward"
  },
  {
    "FIPS": 20177,
    "State": "Kansas",
    "County": "Shawnee"
  },
  {
    "FIPS": 20179,
    "State": "Kansas",
    "County": "Sheridan"
  },
  {
    "FIPS": 20181,
    "State": "Kansas",
    "County": "Sherman"
  },
  {
    "FIPS": 20183,
    "State": "Kansas",
    "County": "Smith"
  },
  {
    "FIPS": 20185,
    "State": "Kansas",
    "County": "Stafford"
  },
  {
    "FIPS": 20187,
    "State": "Kansas",
    "County": "Stanton"
  },
  {
    "FIPS": 20189,
    "State": "Kansas",
    "County": "Stevens"
  },
  {
    "FIPS": 20191,
    "State": "Kansas",
    "County": "Sumner"
  },
  {
    "FIPS": 20193,
    "State": "Kansas",
    "County": "Thomas"
  },
  {
    "FIPS": 20195,
    "State": "Kansas",
    "County": "Trego"
  },
  {
    "FIPS": 20197,
    "State": "Kansas",
    "County": "Wabaunsee"
  },
  {
    "FIPS": 20199,
    "State": "Kansas",
    "County": "Wallace"
  },
  {
    "FIPS": 20201,
    "State": "Kansas",
    "County": "Washington"
  },
  {
    "FIPS": 20203,
    "State": "Kansas",
    "County": "Wichita"
  },
  {
    "FIPS": 20205,
    "State": "Kansas",
    "County": "Wilson"
  },
  {
    "FIPS": 20207,
    "State": "Kansas",
    "County": "Woodson"
  },
  {
    "FIPS": 20209,
    "State": "Kansas",
    "County": "Wyandotte"
  },
  {
    "FIPS": 21001,
    "State": "Kentucky",
    "County": "Adair"
  },
  {
    "FIPS": 21003,
    "State": "Kentucky",
    "County": "Allen"
  },
  {
    "FIPS": 21005,
    "State": "Kentucky",
    "County": "Anderson"
  },
  {
    "FIPS": 21007,
    "State": "Kentucky",
    "County": "Ballard"
  },
  {
    "FIPS": 21009,
    "State": "Kentucky",
    "County": "Barren"
  },
  {
    "FIPS": 21011,
    "State": "Kentucky",
    "County": "Bath"
  },
  {
    "FIPS": 21013,
    "State": "Kentucky",
    "County": "Bell"
  },
  {
    "FIPS": 21015,
    "State": "Kentucky",
    "County": "Boone"
  },
  {
    "FIPS": 21017,
    "State": "Kentucky",
    "County": "Bourbon"
  },
  {
    "FIPS": 21019,
    "State": "Kentucky",
    "County": "Boyd"
  },
  {
    "FIPS": 21021,
    "State": "Kentucky",
    "County": "Boyle"
  },
  {
    "FIPS": 21023,
    "State": "Kentucky",
    "County": "Bracken"
  },
  {
    "FIPS": 21025,
    "State": "Kentucky",
    "County": "Breathitt"
  },
  {
    "FIPS": 21027,
    "State": "Kentucky",
    "County": "Breckinridge"
  },
  {
    "FIPS": 21029,
    "State": "Kentucky",
    "County": "Bullitt"
  },
  {
    "FIPS": 21031,
    "State": "Kentucky",
    "County": "Butler"
  },
  {
    "FIPS": 21033,
    "State": "Kentucky",
    "County": "Caldwell"
  },
  {
    "FIPS": 21035,
    "State": "Kentucky",
    "County": "Calloway"
  },
  {
    "FIPS": 21037,
    "State": "Kentucky",
    "County": "Campbell"
  },
  {
    "FIPS": 21039,
    "State": "Kentucky",
    "County": "Carlisle"
  },
  {
    "FIPS": 21041,
    "State": "Kentucky",
    "County": "Carroll"
  },
  {
    "FIPS": 21043,
    "State": "Kentucky",
    "County": "Carter"
  },
  {
    "FIPS": 21045,
    "State": "Kentucky",
    "County": "Casey"
  },
  {
    "FIPS": 21047,
    "State": "Kentucky",
    "County": "Christian"
  },
  {
    "FIPS": 21049,
    "State": "Kentucky",
    "County": "Clark"
  },
  {
    "FIPS": 21051,
    "State": "Kentucky",
    "County": "Clay"
  },
  {
    "FIPS": 21053,
    "State": "Kentucky",
    "County": "Clinton"
  },
  {
    "FIPS": 21055,
    "State": "Kentucky",
    "County": "Crittenden"
  },
  {
    "FIPS": 21057,
    "State": "Kentucky",
    "County": "Cumberland"
  },
  {
    "FIPS": 21059,
    "State": "Kentucky",
    "County": "Daviess"
  },
  {
    "FIPS": 21061,
    "State": "Kentucky",
    "County": "Edmonson"
  },
  {
    "FIPS": 21063,
    "State": "Kentucky",
    "County": "Elliott"
  },
  {
    "FIPS": 21065,
    "State": "Kentucky",
    "County": "Estill"
  },
  {
    "FIPS": 21067,
    "State": "Kentucky",
    "County": "Fayette"
  },
  {
    "FIPS": 21069,
    "State": "Kentucky",
    "County": "Fleming"
  },
  {
    "FIPS": 21071,
    "State": "Kentucky",
    "County": "Floyd"
  },
  {
    "FIPS": 21073,
    "State": "Kentucky",
    "County": "Franklin"
  },
  {
    "FIPS": 21075,
    "State": "Kentucky",
    "County": "Fulton"
  },
  {
    "FIPS": 21077,
    "State": "Kentucky",
    "County": "Gallatin"
  },
  {
    "FIPS": 21079,
    "State": "Kentucky",
    "County": "Garrard"
  },
  {
    "FIPS": 21081,
    "State": "Kentucky",
    "County": "Grant"
  },
  {
    "FIPS": 21083,
    "State": "Kentucky",
    "County": "Graves"
  },
  {
    "FIPS": 21085,
    "State": "Kentucky",
    "County": "Grayson"
  },
  {
    "FIPS": 21087,
    "State": "Kentucky",
    "County": "Green"
  },
  {
    "FIPS": 21089,
    "State": "Kentucky",
    "County": "Greenup"
  },
  {
    "FIPS": 21091,
    "State": "Kentucky",
    "County": "Hancock"
  },
  {
    "FIPS": 21093,
    "State": "Kentucky",
    "County": "Hardin"
  },
  {
    "FIPS": 21095,
    "State": "Kentucky",
    "County": "Harlan"
  },
  {
    "FIPS": 21097,
    "State": "Kentucky",
    "County": "Harrison"
  },
  {
    "FIPS": 21099,
    "State": "Kentucky",
    "County": "Hart"
  },
  {
    "FIPS": 21101,
    "State": "Kentucky",
    "County": "Henderson"
  },
  {
    "FIPS": 21103,
    "State": "Kentucky",
    "County": "Henry"
  },
  {
    "FIPS": 21105,
    "State": "Kentucky",
    "County": "Hickman"
  },
  {
    "FIPS": 21107,
    "State": "Kentucky",
    "County": "Hopkins"
  },
  {
    "FIPS": 21109,
    "State": "Kentucky",
    "County": "Jackson"
  },
  {
    "FIPS": 21111,
    "State": "Kentucky",
    "County": "Jefferson"
  },
  {
    "FIPS": 21113,
    "State": "Kentucky",
    "County": "Jessamine"
  },
  {
    "FIPS": 21115,
    "State": "Kentucky",
    "County": "Johnson"
  },
  {
    "FIPS": 21117,
    "State": "Kentucky",
    "County": "Kenton"
  },
  {
    "FIPS": 21119,
    "State": "Kentucky",
    "County": "Knott"
  },
  {
    "FIPS": 21121,
    "State": "Kentucky",
    "County": "Knox"
  },
  {
    "FIPS": 21123,
    "State": "Kentucky",
    "County": "Larue"
  },
  {
    "FIPS": 21125,
    "State": "Kentucky",
    "County": "Laurel"
  },
  {
    "FIPS": 21127,
    "State": "Kentucky",
    "County": "Lawrence"
  },
  {
    "FIPS": 21129,
    "State": "Kentucky",
    "County": "Lee"
  },
  {
    "FIPS": 21131,
    "State": "Kentucky",
    "County": "Leslie"
  },
  {
    "FIPS": 21133,
    "State": "Kentucky",
    "County": "Letcher"
  },
  {
    "FIPS": 21135,
    "State": "Kentucky",
    "County": "Lewis"
  },
  {
    "FIPS": 21137,
    "State": "Kentucky",
    "County": "Lincoln"
  },
  {
    "FIPS": 21139,
    "State": "Kentucky",
    "County": "Livingston"
  },
  {
    "FIPS": 21141,
    "State": "Kentucky",
    "County": "Logan"
  },
  {
    "FIPS": 21143,
    "State": "Kentucky",
    "County": "Lyon"
  },
  {
    "FIPS": 21145,
    "State": "Kentucky",
    "County": "McCracken"
  },
  {
    "FIPS": 21147,
    "State": "Kentucky",
    "County": "McCreary"
  },
  {
    "FIPS": 21149,
    "State": "Kentucky",
    "County": "McLean"
  },
  {
    "FIPS": 21151,
    "State": "Kentucky",
    "County": "Madison"
  },
  {
    "FIPS": 21153,
    "State": "Kentucky",
    "County": "Magoffin"
  },
  {
    "FIPS": 21155,
    "State": "Kentucky",
    "County": "Marion"
  },
  {
    "FIPS": 21157,
    "State": "Kentucky",
    "County": "Marshall"
  },
  {
    "FIPS": 21159,
    "State": "Kentucky",
    "County": "Martin"
  },
  {
    "FIPS": 21161,
    "State": "Kentucky",
    "County": "Mason"
  },
  {
    "FIPS": 21163,
    "State": "Kentucky",
    "County": "Meade"
  },
  {
    "FIPS": 21165,
    "State": "Kentucky",
    "County": "Menifee"
  },
  {
    "FIPS": 21167,
    "State": "Kentucky",
    "County": "Mercer"
  },
  {
    "FIPS": 21169,
    "State": "Kentucky",
    "County": "Metcalfe"
  },
  {
    "FIPS": 21171,
    "State": "Kentucky",
    "County": "Monroe"
  },
  {
    "FIPS": 21173,
    "State": "Kentucky",
    "County": "Montgomery"
  },
  {
    "FIPS": 21175,
    "State": "Kentucky",
    "County": "Morgan"
  },
  {
    "FIPS": 21177,
    "State": "Kentucky",
    "County": "Muhlenberg"
  },
  {
    "FIPS": 21179,
    "State": "Kentucky",
    "County": "Nelson"
  },
  {
    "FIPS": 21181,
    "State": "Kentucky",
    "County": "Nicholas"
  },
  {
    "FIPS": 21183,
    "State": "Kentucky",
    "County": "Ohio"
  },
  {
    "FIPS": 21185,
    "State": "Kentucky",
    "County": "Oldham"
  },
  {
    "FIPS": 21187,
    "State": "Kentucky",
    "County": "Owen"
  },
  {
    "FIPS": 21189,
    "State": "Kentucky",
    "County": "Owsley"
  },
  {
    "FIPS": 21191,
    "State": "Kentucky",
    "County": "Pendleton"
  },
  {
    "FIPS": 21193,
    "State": "Kentucky",
    "County": "Perry"
  },
  {
    "FIPS": 21195,
    "State": "Kentucky",
    "County": "Pike"
  },
  {
    "FIPS": 21197,
    "State": "Kentucky",
    "County": "Powell"
  },
  {
    "FIPS": 21199,
    "State": "Kentucky",
    "County": "Pulaski"
  },
  {
    "FIPS": 21201,
    "State": "Kentucky",
    "County": "Robertson"
  },
  {
    "FIPS": 21203,
    "State": "Kentucky",
    "County": "Rockcastle"
  },
  {
    "FIPS": 21205,
    "State": "Kentucky",
    "County": "Rowan"
  },
  {
    "FIPS": 21207,
    "State": "Kentucky",
    "County": "Russell"
  },
  {
    "FIPS": 21209,
    "State": "Kentucky",
    "County": "Scott"
  },
  {
    "FIPS": 21211,
    "State": "Kentucky",
    "County": "Shelby"
  },
  {
    "FIPS": 21213,
    "State": "Kentucky",
    "County": "Simpson"
  },
  {
    "FIPS": 21215,
    "State": "Kentucky",
    "County": "Spencer"
  },
  {
    "FIPS": 21217,
    "State": "Kentucky",
    "County": "Taylor"
  },
  {
    "FIPS": 21219,
    "State": "Kentucky",
    "County": "Todd"
  },
  {
    "FIPS": 21221,
    "State": "Kentucky",
    "County": "Trigg"
  },
  {
    "FIPS": 21223,
    "State": "Kentucky",
    "County": "Trimble"
  },
  {
    "FIPS": 21225,
    "State": "Kentucky",
    "County": "Union"
  },
  {
    "FIPS": 21227,
    "State": "Kentucky",
    "County": "Warren"
  },
  {
    "FIPS": 21229,
    "State": "Kentucky",
    "County": "Washington"
  },
  {
    "FIPS": 21231,
    "State": "Kentucky",
    "County": "Wayne"
  },
  {
    "FIPS": 21233,
    "State": "Kentucky",
    "County": "Webster"
  },
  {
    "FIPS": 21235,
    "State": "Kentucky",
    "County": "Whitley"
  },
  {
    "FIPS": 21237,
    "State": "Kentucky",
    "County": "Wolfe"
  },
  {
    "FIPS": 21239,
    "State": "Kentucky",
    "County": "Woodford"
  },
  {
    "FIPS": 22001,
    "State": "Louisiana",
    "County": "Acadia"
  },
  {
    "FIPS": 22003,
    "State": "Louisiana",
    "County": "Allen"
  },
  {
    "FIPS": 22005,
    "State": "Louisiana",
    "County": "Ascension"
  },
  {
    "FIPS": 22007,
    "State": "Louisiana",
    "County": "Assumption"
  },
  {
    "FIPS": 22009,
    "State": "Louisiana",
    "County": "Avoyelles"
  },
  {
    "FIPS": 22011,
    "State": "Louisiana",
    "County": "Beauregard"
  },
  {
    "FIPS": 22013,
    "State": "Louisiana",
    "County": "Bienville"
  },
  {
    "FIPS": 22015,
    "State": "Louisiana",
    "County": "Bossier"
  },
  {
    "FIPS": 22017,
    "State": "Louisiana",
    "County": "Caddo"
  },
  {
    "FIPS": 22019,
    "State": "Louisiana",
    "County": "Calcasieu"
  },
  {
    "FIPS": 22021,
    "State": "Louisiana",
    "County": "Caldwell"
  },
  {
    "FIPS": 22023,
    "State": "Louisiana",
    "County": "Cameron"
  },
  {
    "FIPS": 22025,
    "State": "Louisiana",
    "County": "Catahoula"
  },
  {
    "FIPS": 22027,
    "State": "Louisiana",
    "County": "Claiborne"
  },
  {
    "FIPS": 22029,
    "State": "Louisiana",
    "County": "Concordia"
  },
  {
    "FIPS": 22031,
    "State": "Louisiana",
    "County": "De Soto"
  },
  {
    "FIPS": 22033,
    "State": "Louisiana",
    "County": "East Baton Rouge"
  },
  {
    "FIPS": 22035,
    "State": "Louisiana",
    "County": "East Carroll"
  },
  {
    "FIPS": 22037,
    "State": "Louisiana",
    "County": "East Feliciana"
  },
  {
    "FIPS": 22039,
    "State": "Louisiana",
    "County": "Evangeline"
  },
  {
    "FIPS": 22041,
    "State": "Louisiana",
    "County": "Franklin"
  },
  {
    "FIPS": 22043,
    "State": "Louisiana",
    "County": "Grant"
  },
  {
    "FIPS": 22045,
    "State": "Louisiana",
    "County": "Iberia"
  },
  {
    "FIPS": 22047,
    "State": "Louisiana",
    "County": "Iberville"
  },
  {
    "FIPS": 22049,
    "State": "Louisiana",
    "County": "Jackson"
  },
  {
    "FIPS": 22051,
    "State": "Louisiana",
    "County": "Jefferson"
  },
  {
    "FIPS": 22053,
    "State": "Louisiana",
    "County": "Jefferson Davis"
  },
  {
    "FIPS": 22055,
    "State": "Louisiana",
    "County": "Lafayette"
  },
  {
    "FIPS": 22057,
    "State": "Louisiana",
    "County": "Lafourche"
  },
  {
    "FIPS": 22059,
    "State": "Louisiana",
    "County": "La Salle"
  },
  {
    "FIPS": 22061,
    "State": "Louisiana",
    "County": "Lincoln"
  },
  {
    "FIPS": 22063,
    "State": "Louisiana",
    "County": "Livingston"
  },
  {
    "FIPS": 22065,
    "State": "Louisiana",
    "County": "Madison"
  },
  {
    "FIPS": 22067,
    "State": "Louisiana",
    "County": "Morehouse"
  },
  {
    "FIPS": 22069,
    "State": "Louisiana",
    "County": "Natchitoches"
  },
  {
    "FIPS": 22071,
    "State": "Louisiana",
    "County": "Orleans"
  },
  {
    "FIPS": 22073,
    "State": "Louisiana",
    "County": "Ouachita"
  },
  {
    "FIPS": 22075,
    "State": "Louisiana",
    "County": "Plaquemines"
  },
  {
    "FIPS": 22077,
    "State": "Louisiana",
    "County": "Pointe Coupee"
  },
  {
    "FIPS": 22079,
    "State": "Louisiana",
    "County": "Rapides"
  },
  {
    "FIPS": 22081,
    "State": "Louisiana",
    "County": "Red River"
  },
  {
    "FIPS": 22083,
    "State": "Louisiana",
    "County": "Richland"
  },
  {
    "FIPS": 22085,
    "State": "Louisiana",
    "County": "Sabine"
  },
  {
    "FIPS": 22087,
    "State": "Louisiana",
    "County": "St. Bernard"
  },
  {
    "FIPS": 22089,
    "State": "Louisiana",
    "County": "St. Charles"
  },
  {
    "FIPS": 22091,
    "State": "Louisiana",
    "County": "St. Helena"
  },
  {
    "FIPS": 22093,
    "State": "Louisiana",
    "County": "St. James"
  },
  {
    "FIPS": 22095,
    "State": "Louisiana",
    "County": "St. John the Baptist"
  },
  {
    "FIPS": 22097,
    "State": "Louisiana",
    "County": "St. Landry"
  },
  {
    "FIPS": 22099,
    "State": "Louisiana",
    "County": "St. Martin"
  },
  {
    "FIPS": 22101,
    "State": "Louisiana",
    "County": "St. Mary"
  },
  {
    "FIPS": 22103,
    "State": "Louisiana",
    "County": "St. Tammany"
  },
  {
    "FIPS": 22105,
    "State": "Louisiana",
    "County": "Tangipahoa"
  },
  {
    "FIPS": 22107,
    "State": "Louisiana",
    "County": "Tensas"
  },
  {
    "FIPS": 22109,
    "State": "Louisiana",
    "County": "Terrebonne"
  },
  {
    "FIPS": 22111,
    "State": "Louisiana",
    "County": "Union"
  },
  {
    "FIPS": 22113,
    "State": "Louisiana",
    "County": "Vermilion"
  },
  {
    "FIPS": 22115,
    "State": "Louisiana",
    "County": "Vernon"
  },
  {
    "FIPS": 22117,
    "State": "Louisiana",
    "County": "Washington"
  },
  {
    "FIPS": 22119,
    "State": "Louisiana",
    "County": "Webster"
  },
  {
    "FIPS": 22121,
    "State": "Louisiana",
    "County": "West Baton Rouge"
  },
  {
    "FIPS": 22123,
    "State": "Louisiana",
    "County": "West Carroll"
  },
  {
    "FIPS": 22125,
    "State": "Louisiana",
    "County": "West Feliciana"
  },
  {
    "FIPS": 22127,
    "State": "Louisiana",
    "County": "Winn"
  },
  {
    "FIPS": 23001,
    "State": "Maine",
    "County": "Androscoggin"
  },
  {
    "FIPS": 23003,
    "State": "Maine",
    "County": "Aroostook"
  },
  {
    "FIPS": 23005,
    "State": "Maine",
    "County": "Cumberland"
  },
  {
    "FIPS": 23007,
    "State": "Maine",
    "County": "Franklin"
  },
  {
    "FIPS": 23009,
    "State": "Maine",
    "County": "Hancock"
  },
  {
    "FIPS": 23011,
    "State": "Maine",
    "County": "Kennebec"
  },
  {
    "FIPS": 23013,
    "State": "Maine",
    "County": "Knox"
  },
  {
    "FIPS": 23015,
    "State": "Maine",
    "County": "Lincoln"
  },
  {
    "FIPS": 23017,
    "State": "Maine",
    "County": "Oxford"
  },
  {
    "FIPS": 23019,
    "State": "Maine",
    "County": "Penobscot"
  },
  {
    "FIPS": 23021,
    "State": "Maine",
    "County": "Piscataquis"
  },
  {
    "FIPS": 23023,
    "State": "Maine",
    "County": "Sagadahoc"
  },
  {
    "FIPS": 23025,
    "State": "Maine",
    "County": "Somerset"
  },
  {
    "FIPS": 23027,
    "State": "Maine",
    "County": "Waldo"
  },
  {
    "FIPS": 23029,
    "State": "Maine",
    "County": "Washington"
  },
  {
    "FIPS": 23031,
    "State": "Maine",
    "County": "York"
  },
  {
    "FIPS": 24001,
    "State": "Maryland",
    "County": "Allegany"
  },
  {
    "FIPS": 24003,
    "State": "Maryland",
    "County": "Anne Arundel"
  },
  {
    "FIPS": 24005,
    "State": "Maryland",
    "County": "Baltimore"
  },
  {
    "FIPS": 24009,
    "State": "Maryland",
    "County": "Calvert"
  },
  {
    "FIPS": 24011,
    "State": "Maryland",
    "County": "Caroline"
  },
  {
    "FIPS": 24013,
    "State": "Maryland",
    "County": "Carroll"
  },
  {
    "FIPS": 24015,
    "State": "Maryland",
    "County": "Cecil"
  },
  {
    "FIPS": 24017,
    "State": "Maryland",
    "County": "Charles"
  },
  {
    "FIPS": 24019,
    "State": "Maryland",
    "County": "Dorchester"
  },
  {
    "FIPS": 24021,
    "State": "Maryland",
    "County": "Frederick"
  },
  {
    "FIPS": 24023,
    "State": "Maryland",
    "County": "Garrett"
  },
  {
    "FIPS": 24025,
    "State": "Maryland",
    "County": "Harford"
  },
  {
    "FIPS": 24027,
    "State": "Maryland",
    "County": "Howard"
  },
  {
    "FIPS": 24029,
    "State": "Maryland",
    "County": "Kent"
  },
  {
    "FIPS": 24031,
    "State": "Maryland",
    "County": "Montgomery"
  },
  {
    "FIPS": 24033,
    "State": "Maryland",
    "County": "Prince George's"
  },
  {
    "FIPS": 24035,
    "State": "Maryland",
    "County": "Queen Anne's"
  },
  {
    "FIPS": 24037,
    "State": "Maryland",
    "County": "St. Mary's"
  },
  {
    "FIPS": 24039,
    "State": "Maryland",
    "County": "Somerset"
  },
  {
    "FIPS": 24041,
    "State": "Maryland",
    "County": "Talbot"
  },
  {
    "FIPS": 24043,
    "State": "Maryland",
    "County": "Washington"
  },
  {
    "FIPS": 24045,
    "State": "Maryland",
    "County": "Wicomico"
  },
  {
    "FIPS": 24047,
    "State": "Maryland",
    "County": "Worcester"
  },
  {
    "FIPS": 24510,
    "State": "Maryland",
    "County": "Baltimore city"
  },
  {
    "FIPS": 25001,
    "State": "Massachusetts",
    "County": "Barnstable"
  },
  {
    "FIPS": 25003,
    "State": "Massachusetts",
    "County": "Berkshire"
  },
  {
    "FIPS": 25005,
    "State": "Massachusetts",
    "County": "Bristol"
  },
  {
    "FIPS": 25007,
    "State": "Massachusetts",
    "County": "Dukes"
  },
  {
    "FIPS": 25009,
    "State": "Massachusetts",
    "County": "Essex"
  },
  {
    "FIPS": 25011,
    "State": "Massachusetts",
    "County": "Franklin"
  },
  {
    "FIPS": 25013,
    "State": "Massachusetts",
    "County": "Hampden"
  },
  {
    "FIPS": 25015,
    "State": "Massachusetts",
    "County": "Hampshire"
  },
  {
    "FIPS": 25017,
    "State": "Massachusetts",
    "County": "Middlesex"
  },
  {
    "FIPS": 25019,
    "State": "Massachusetts",
    "County": "Nantucket"
  },
  {
    "FIPS": 25021,
    "State": "Massachusetts",
    "County": "Norfolk"
  },
  {
    "FIPS": 25023,
    "State": "Massachusetts",
    "County": "Plymouth"
  },
  {
    "FIPS": 25025,
    "State": "Massachusetts",
    "County": "Suffolk"
  },
  {
    "FIPS": 25027,
    "State": "Massachusetts",
    "County": "Worcester"
  },
  {
    "FIPS": 26001,
    "State": "Michigan",
    "County": "Alcona"
  },
  {
    "FIPS": 26003,
    "State": "Michigan",
    "County": "Alger"
  },
  {
    "FIPS": 26005,
    "State": "Michigan",
    "County": "Allegan"
  },
  {
    "FIPS": 26007,
    "State": "Michigan",
    "County": "Alpena"
  },
  {
    "FIPS": 26009,
    "State": "Michigan",
    "County": "Antrim"
  },
  {
    "FIPS": 26011,
    "State": "Michigan",
    "County": "Arenac"
  },
  {
    "FIPS": 26013,
    "State": "Michigan",
    "County": "Baraga"
  },
  {
    "FIPS": 26015,
    "State": "Michigan",
    "County": "Barry"
  },
  {
    "FIPS": 26017,
    "State": "Michigan",
    "County": "Bay"
  },
  {
    "FIPS": 26019,
    "State": "Michigan",
    "County": "Benzie"
  },
  {
    "FIPS": 26021,
    "State": "Michigan",
    "County": "Berrien"
  },
  {
    "FIPS": 26023,
    "State": "Michigan",
    "County": "Branch"
  },
  {
    "FIPS": 26025,
    "State": "Michigan",
    "County": "Calhoun"
  },
  {
    "FIPS": 26027,
    "State": "Michigan",
    "County": "Cass"
  },
  {
    "FIPS": 26029,
    "State": "Michigan",
    "County": "Charlevoix"
  },
  {
    "FIPS": 26031,
    "State": "Michigan",
    "County": "Cheboygan"
  },
  {
    "FIPS": 26033,
    "State": "Michigan",
    "County": "Chippewa"
  },
  {
    "FIPS": 26035,
    "State": "Michigan",
    "County": "Clare"
  },
  {
    "FIPS": 26037,
    "State": "Michigan",
    "County": "Clinton"
  },
  {
    "FIPS": 26039,
    "State": "Michigan",
    "County": "Crawford"
  },
  {
    "FIPS": 26041,
    "State": "Michigan",
    "County": "Delta"
  },
  {
    "FIPS": 26043,
    "State": "Michigan",
    "County": "Dickinson"
  },
  {
    "FIPS": 26045,
    "State": "Michigan",
    "County": "Eaton"
  },
  {
    "FIPS": 26047,
    "State": "Michigan",
    "County": "Emmet"
  },
  {
    "FIPS": 26049,
    "State": "Michigan",
    "County": "Genesee"
  },
  {
    "FIPS": 26051,
    "State": "Michigan",
    "County": "Gladwin"
  },
  {
    "FIPS": 26053,
    "State": "Michigan",
    "County": "Gogebic"
  },
  {
    "FIPS": 26055,
    "State": "Michigan",
    "County": "Grand Traverse"
  },
  {
    "FIPS": 26057,
    "State": "Michigan",
    "County": "Gratiot"
  },
  {
    "FIPS": 26059,
    "State": "Michigan",
    "County": "Hillsdale"
  },
  {
    "FIPS": 26061,
    "State": "Michigan",
    "County": "Houghton"
  },
  {
    "FIPS": 26063,
    "State": "Michigan",
    "County": "Huron"
  },
  {
    "FIPS": 26065,
    "State": "Michigan",
    "County": "Ingham"
  },
  {
    "FIPS": 26067,
    "State": "Michigan",
    "County": "Ionia"
  },
  {
    "FIPS": 26069,
    "State": "Michigan",
    "County": "Iosco"
  },
  {
    "FIPS": 26071,
    "State": "Michigan",
    "County": "Iron"
  },
  {
    "FIPS": 26073,
    "State": "Michigan",
    "County": "Isabella"
  },
  {
    "FIPS": 26075,
    "State": "Michigan",
    "County": "Jackson"
  },
  {
    "FIPS": 26077,
    "State": "Michigan",
    "County": "Kalamazoo"
  },
  {
    "FIPS": 26079,
    "State": "Michigan",
    "County": "Kalkaska"
  },
  {
    "FIPS": 26081,
    "State": "Michigan",
    "County": "Kent"
  },
  {
    "FIPS": 26083,
    "State": "Michigan",
    "County": "Keweenaw"
  },
  {
    "FIPS": 26085,
    "State": "Michigan",
    "County": "Lake"
  },
  {
    "FIPS": 26087,
    "State": "Michigan",
    "County": "Lapeer"
  },
  {
    "FIPS": 26089,
    "State": "Michigan",
    "County": "Leelanau"
  },
  {
    "FIPS": 26091,
    "State": "Michigan",
    "County": "Lenawee"
  },
  {
    "FIPS": 26093,
    "State": "Michigan",
    "County": "Livingston"
  },
  {
    "FIPS": 26095,
    "State": "Michigan",
    "County": "Luce"
  },
  {
    "FIPS": 26097,
    "State": "Michigan",
    "County": "Mackinac"
  },
  {
    "FIPS": 26099,
    "State": "Michigan",
    "County": "Macomb"
  },
  {
    "FIPS": 26101,
    "State": "Michigan",
    "County": "Manistee"
  },
  {
    "FIPS": 26103,
    "State": "Michigan",
    "County": "Marquette"
  },
  {
    "FIPS": 26105,
    "State": "Michigan",
    "County": "Mason"
  },
  {
    "FIPS": 26107,
    "State": "Michigan",
    "County": "Mecosta"
  },
  {
    "FIPS": 26109,
    "State": "Michigan",
    "County": "Menominee"
  },
  {
    "FIPS": 26111,
    "State": "Michigan",
    "County": "Midland"
  },
  {
    "FIPS": 26113,
    "State": "Michigan",
    "County": "Missaukee"
  },
  {
    "FIPS": 26115,
    "State": "Michigan",
    "County": "Monroe"
  },
  {
    "FIPS": 26117,
    "State": "Michigan",
    "County": "Montcalm"
  },
  {
    "FIPS": 26119,
    "State": "Michigan",
    "County": "Montmorency"
  },
  {
    "FIPS": 26121,
    "State": "Michigan",
    "County": "Muskegon"
  },
  {
    "FIPS": 26123,
    "State": "Michigan",
    "County": "Newaygo"
  },
  {
    "FIPS": 26125,
    "State": "Michigan",
    "County": "Oakland"
  },
  {
    "FIPS": 26127,
    "State": "Michigan",
    "County": "Oceana"
  },
  {
    "FIPS": 26129,
    "State": "Michigan",
    "County": "Ogemaw"
  },
  {
    "FIPS": 26131,
    "State": "Michigan",
    "County": "Ontonagon"
  },
  {
    "FIPS": 26133,
    "State": "Michigan",
    "County": "Osceola"
  },
  {
    "FIPS": 26135,
    "State": "Michigan",
    "County": "Oscoda"
  },
  {
    "FIPS": 26137,
    "State": "Michigan",
    "County": "Otsego"
  },
  {
    "FIPS": 26139,
    "State": "Michigan",
    "County": "Ottawa"
  },
  {
    "FIPS": 26141,
    "State": "Michigan",
    "County": "Presque Isle"
  },
  {
    "FIPS": 26143,
    "State": "Michigan",
    "County": "Roscommon"
  },
  {
    "FIPS": 26145,
    "State": "Michigan",
    "County": "Saginaw"
  },
  {
    "FIPS": 26147,
    "State": "Michigan",
    "County": "St. Clair"
  },
  {
    "FIPS": 26149,
    "State": "Michigan",
    "County": "St. Joseph"
  },
  {
    "FIPS": 26151,
    "State": "Michigan",
    "County": "Sanilac"
  },
  {
    "FIPS": 26153,
    "State": "Michigan",
    "County": "Schoolcraft"
  },
  {
    "FIPS": 26155,
    "State": "Michigan",
    "County": "Shiawassee"
  },
  {
    "FIPS": 26157,
    "State": "Michigan",
    "County": "Tuscola"
  },
  {
    "FIPS": 26159,
    "State": "Michigan",
    "County": "Van Buren"
  },
  {
    "FIPS": 26161,
    "State": "Michigan",
    "County": "Washtenaw"
  },
  {
    "FIPS": 26163,
    "State": "Michigan",
    "County": "Wayne"
  },
  {
    "FIPS": 26165,
    "State": "Michigan",
    "County": "Wexford"
  },
  {
    "FIPS": 27001,
    "State": "Minnesota",
    "County": "Aitkin"
  },
  {
    "FIPS": 27003,
    "State": "Minnesota",
    "County": "Anoka"
  },
  {
    "FIPS": 27005,
    "State": "Minnesota",
    "County": "Becker"
  },
  {
    "FIPS": 27007,
    "State": "Minnesota",
    "County": "Beltrami"
  },
  {
    "FIPS": 27009,
    "State": "Minnesota",
    "County": "Benton"
  },
  {
    "FIPS": 27011,
    "State": "Minnesota",
    "County": "Big Stone"
  },
  {
    "FIPS": 27013,
    "State": "Minnesota",
    "County": "Blue Earth"
  },
  {
    "FIPS": 27015,
    "State": "Minnesota",
    "County": "Brown"
  },
  {
    "FIPS": 27017,
    "State": "Minnesota",
    "County": "Carlton"
  },
  {
    "FIPS": 27019,
    "State": "Minnesota",
    "County": "Carver"
  },
  {
    "FIPS": 27021,
    "State": "Minnesota",
    "County": "Cass"
  },
  {
    "FIPS": 27023,
    "State": "Minnesota",
    "County": "Chippewa"
  },
  {
    "FIPS": 27025,
    "State": "Minnesota",
    "County": "Chisago"
  },
  {
    "FIPS": 27027,
    "State": "Minnesota",
    "County": "Clay"
  },
  {
    "FIPS": 27029,
    "State": "Minnesota",
    "County": "Clearwater"
  },
  {
    "FIPS": 27031,
    "State": "Minnesota",
    "County": "Cook"
  },
  {
    "FIPS": 27033,
    "State": "Minnesota",
    "County": "Cottonwood"
  },
  {
    "FIPS": 27035,
    "State": "Minnesota",
    "County": "Crow Wing"
  },
  {
    "FIPS": 27037,
    "State": "Minnesota",
    "County": "Dakota"
  },
  {
    "FIPS": 27039,
    "State": "Minnesota",
    "County": "Dodge"
  },
  {
    "FIPS": 27041,
    "State": "Minnesota",
    "County": "Douglas"
  },
  {
    "FIPS": 27043,
    "State": "Minnesota",
    "County": "Faribault"
  },
  {
    "FIPS": 27045,
    "State": "Minnesota",
    "County": "Fillmore"
  },
  {
    "FIPS": 27047,
    "State": "Minnesota",
    "County": "Freeborn"
  },
  {
    "FIPS": 27049,
    "State": "Minnesota",
    "County": "Goodhue"
  },
  {
    "FIPS": 27051,
    "State": "Minnesota",
    "County": "Grant"
  },
  {
    "FIPS": 27053,
    "State": "Minnesota",
    "County": "Hennepin"
  },
  {
    "FIPS": 27055,
    "State": "Minnesota",
    "County": "Houston"
  },
  {
    "FIPS": 27057,
    "State": "Minnesota",
    "County": "Hubbard"
  },
  {
    "FIPS": 27059,
    "State": "Minnesota",
    "County": "Isanti"
  },
  {
    "FIPS": 27061,
    "State": "Minnesota",
    "County": "Itasca"
  },
  {
    "FIPS": 27063,
    "State": "Minnesota",
    "County": "Jackson"
  },
  {
    "FIPS": 27065,
    "State": "Minnesota",
    "County": "Kanabec"
  },
  {
    "FIPS": 27067,
    "State": "Minnesota",
    "County": "Kandiyohi"
  },
  {
    "FIPS": 27069,
    "State": "Minnesota",
    "County": "Kittson"
  },
  {
    "FIPS": 27071,
    "State": "Minnesota",
    "County": "Koochiching"
  },
  {
    "FIPS": 27073,
    "State": "Minnesota",
    "County": "Lac qui Parle"
  },
  {
    "FIPS": 27075,
    "State": "Minnesota",
    "County": "Lake"
  },
  {
    "FIPS": 27077,
    "State": "Minnesota",
    "County": "Lake of the Woods"
  },
  {
    "FIPS": 27079,
    "State": "Minnesota",
    "County": "Le Sueur"
  },
  {
    "FIPS": 27081,
    "State": "Minnesota",
    "County": "Lincoln"
  },
  {
    "FIPS": 27083,
    "State": "Minnesota",
    "County": "Lyon"
  },
  {
    "FIPS": 27085,
    "State": "Minnesota",
    "County": "McLeod"
  },
  {
    "FIPS": 27087,
    "State": "Minnesota",
    "County": "Mahnomen"
  },
  {
    "FIPS": 27089,
    "State": "Minnesota",
    "County": "Marshall"
  },
  {
    "FIPS": 27091,
    "State": "Minnesota",
    "County": "Martin"
  },
  {
    "FIPS": 27093,
    "State": "Minnesota",
    "County": "Meeker"
  },
  {
    "FIPS": 27095,
    "State": "Minnesota",
    "County": "Mille Lacs"
  },
  {
    "FIPS": 27097,
    "State": "Minnesota",
    "County": "Morrison"
  },
  {
    "FIPS": 27099,
    "State": "Minnesota",
    "County": "Mower"
  },
  {
    "FIPS": 27101,
    "State": "Minnesota",
    "County": "Murray"
  },
  {
    "FIPS": 27103,
    "State": "Minnesota",
    "County": "Nicollet"
  },
  {
    "FIPS": 27105,
    "State": "Minnesota",
    "County": "Nobles"
  },
  {
    "FIPS": 27107,
    "State": "Minnesota",
    "County": "Norman"
  },
  {
    "FIPS": 27109,
    "State": "Minnesota",
    "County": "Olmsted"
  },
  {
    "FIPS": 27111,
    "State": "Minnesota",
    "County": "Otter Tail"
  },
  {
    "FIPS": 27113,
    "State": "Minnesota",
    "County": "Pennington"
  },
  {
    "FIPS": 27115,
    "State": "Minnesota",
    "County": "Pine"
  },
  {
    "FIPS": 27117,
    "State": "Minnesota",
    "County": "Pipestone"
  },
  {
    "FIPS": 27119,
    "State": "Minnesota",
    "County": "Polk"
  },
  {
    "FIPS": 27121,
    "State": "Minnesota",
    "County": "Pope"
  },
  {
    "FIPS": 27123,
    "State": "Minnesota",
    "County": "Ramsey"
  },
  {
    "FIPS": 27125,
    "State": "Minnesota",
    "County": "Red Lake"
  },
  {
    "FIPS": 27127,
    "State": "Minnesota",
    "County": "Redwood"
  },
  {
    "FIPS": 27129,
    "State": "Minnesota",
    "County": "Renville"
  },
  {
    "FIPS": 27131,
    "State": "Minnesota",
    "County": "Rice"
  },
  {
    "FIPS": 27133,
    "State": "Minnesota",
    "County": "Rock"
  },
  {
    "FIPS": 27135,
    "State": "Minnesota",
    "County": "Roseau"
  },
  {
    "FIPS": 27137,
    "State": "Minnesota",
    "County": "St. Louis"
  },
  {
    "FIPS": 27139,
    "State": "Minnesota",
    "County": "Scott"
  },
  {
    "FIPS": 27141,
    "State": "Minnesota",
    "County": "Sherburne"
  },
  {
    "FIPS": 27143,
    "State": "Minnesota",
    "County": "Sibley"
  },
  {
    "FIPS": 27145,
    "State": "Minnesota",
    "County": "Stearns"
  },
  {
    "FIPS": 27147,
    "State": "Minnesota",
    "County": "Steele"
  },
  {
    "FIPS": 27149,
    "State": "Minnesota",
    "County": "Stevens"
  },
  {
    "FIPS": 27151,
    "State": "Minnesota",
    "County": "Swift"
  },
  {
    "FIPS": 27153,
    "State": "Minnesota",
    "County": "Todd"
  },
  {
    "FIPS": 27155,
    "State": "Minnesota",
    "County": "Traverse"
  },
  {
    "FIPS": 27157,
    "State": "Minnesota",
    "County": "Wabasha"
  },
  {
    "FIPS": 27159,
    "State": "Minnesota",
    "County": "Wadena"
  },
  {
    "FIPS": 27161,
    "State": "Minnesota",
    "County": "Waseca"
  },
  {
    "FIPS": 27163,
    "State": "Minnesota",
    "County": "Washington"
  },
  {
    "FIPS": 27165,
    "State": "Minnesota",
    "County": "Watonwan"
  },
  {
    "FIPS": 27167,
    "State": "Minnesota",
    "County": "Wilkin"
  },
  {
    "FIPS": 27169,
    "State": "Minnesota",
    "County": "Winona"
  },
  {
    "FIPS": 27171,
    "State": "Minnesota",
    "County": "Wright"
  },
  {
    "FIPS": 27173,
    "State": "Minnesota",
    "County": "Yellow Medicine"
  },
  {
    "FIPS": 28001,
    "State": "Mississippi",
    "County": "Adams"
  },
  {
    "FIPS": 28003,
    "State": "Mississippi",
    "County": "Alcorn"
  },
  {
    "FIPS": 28005,
    "State": "Mississippi",
    "County": "Amite"
  },
  {
    "FIPS": 28007,
    "State": "Mississippi",
    "County": "Attala"
  },
  {
    "FIPS": 28009,
    "State": "Mississippi",
    "County": "Benton"
  },
  {
    "FIPS": 28011,
    "State": "Mississippi",
    "County": "Bolivar"
  },
  {
    "FIPS": 28013,
    "State": "Mississippi",
    "County": "Calhoun"
  },
  {
    "FIPS": 28015,
    "State": "Mississippi",
    "County": "Carroll"
  },
  {
    "FIPS": 28017,
    "State": "Mississippi",
    "County": "Chickasaw"
  },
  {
    "FIPS": 28019,
    "State": "Mississippi",
    "County": "Choctaw"
  },
  {
    "FIPS": 28021,
    "State": "Mississippi",
    "County": "Claiborne"
  },
  {
    "FIPS": 28023,
    "State": "Mississippi",
    "County": "Clarke"
  },
  {
    "FIPS": 28025,
    "State": "Mississippi",
    "County": "Clay"
  },
  {
    "FIPS": 28027,
    "State": "Mississippi",
    "County": "Coahoma"
  },
  {
    "FIPS": 28029,
    "State": "Mississippi",
    "County": "Copiah"
  },
  {
    "FIPS": 28031,
    "State": "Mississippi",
    "County": "Covington"
  },
  {
    "FIPS": 28033,
    "State": "Mississippi",
    "County": "DeSoto"
  },
  {
    "FIPS": 28035,
    "State": "Mississippi",
    "County": "Forrest"
  },
  {
    "FIPS": 28037,
    "State": "Mississippi",
    "County": "Franklin"
  },
  {
    "FIPS": 28039,
    "State": "Mississippi",
    "County": "George"
  },
  {
    "FIPS": 28041,
    "State": "Mississippi",
    "County": "Greene"
  },
  {
    "FIPS": 28043,
    "State": "Mississippi",
    "County": "Grenada"
  },
  {
    "FIPS": 28045,
    "State": "Mississippi",
    "County": "Hancock"
  },
  {
    "FIPS": 28047,
    "State": "Mississippi",
    "County": "Harrison"
  },
  {
    "FIPS": 28049,
    "State": "Mississippi",
    "County": "Hinds"
  },
  {
    "FIPS": 28051,
    "State": "Mississippi",
    "County": "Holmes"
  },
  {
    "FIPS": 28053,
    "State": "Mississippi",
    "County": "Humphreys"
  },
  {
    "FIPS": 28055,
    "State": "Mississippi",
    "County": "Issaquena"
  },
  {
    "FIPS": 28057,
    "State": "Mississippi",
    "County": "Itawamba"
  },
  {
    "FIPS": 28059,
    "State": "Mississippi",
    "County": "Jackson"
  },
  {
    "FIPS": 28061,
    "State": "Mississippi",
    "County": "Jasper"
  },
  {
    "FIPS": 28063,
    "State": "Mississippi",
    "County": "Jefferson"
  },
  {
    "FIPS": 28065,
    "State": "Mississippi",
    "County": "Jefferson Davis"
  },
  {
    "FIPS": 28067,
    "State": "Mississippi",
    "County": "Jones"
  },
  {
    "FIPS": 28069,
    "State": "Mississippi",
    "County": "Kemper"
  },
  {
    "FIPS": 28071,
    "State": "Mississippi",
    "County": "Lafayette"
  },
  {
    "FIPS": 28073,
    "State": "Mississippi",
    "County": "Lamar"
  },
  {
    "FIPS": 28075,
    "State": "Mississippi",
    "County": "Lauderdale"
  },
  {
    "FIPS": 28077,
    "State": "Mississippi",
    "County": "Lawrence"
  },
  {
    "FIPS": 28079,
    "State": "Mississippi",
    "County": "Leake"
  },
  {
    "FIPS": 28081,
    "State": "Mississippi",
    "County": "Lee"
  },
  {
    "FIPS": 28083,
    "State": "Mississippi",
    "County": "Leflore"
  },
  {
    "FIPS": 28085,
    "State": "Mississippi",
    "County": "Lincoln"
  },
  {
    "FIPS": 28087,
    "State": "Mississippi",
    "County": "Lowndes"
  },
  {
    "FIPS": 28089,
    "State": "Mississippi",
    "County": "Madison"
  },
  {
    "FIPS": 28091,
    "State": "Mississippi",
    "County": "Marion"
  },
  {
    "FIPS": 28093,
    "State": "Mississippi",
    "County": "Marshall"
  },
  {
    "FIPS": 28095,
    "State": "Mississippi",
    "County": "Monroe"
  },
  {
    "FIPS": 28097,
    "State": "Mississippi",
    "County": "Montgomery"
  },
  {
    "FIPS": 28099,
    "State": "Mississippi",
    "County": "Neshoba"
  },
  {
    "FIPS": 28101,
    "State": "Mississippi",
    "County": "Newton"
  },
  {
    "FIPS": 28103,
    "State": "Mississippi",
    "County": "Noxubee"
  },
  {
    "FIPS": 28105,
    "State": "Mississippi",
    "County": "Oktibbeha"
  },
  {
    "FIPS": 28107,
    "State": "Mississippi",
    "County": "Panola"
  },
  {
    "FIPS": 28109,
    "State": "Mississippi",
    "County": "Pearl River"
  },
  {
    "FIPS": 28111,
    "State": "Mississippi",
    "County": "Perry"
  },
  {
    "FIPS": 28113,
    "State": "Mississippi",
    "County": "Pike"
  },
  {
    "FIPS": 28115,
    "State": "Mississippi",
    "County": "Pontotoc"
  },
  {
    "FIPS": 28117,
    "State": "Mississippi",
    "County": "Prentiss"
  },
  {
    "FIPS": 28119,
    "State": "Mississippi",
    "County": "Quitman"
  },
  {
    "FIPS": 28121,
    "State": "Mississippi",
    "County": "Rankin"
  },
  {
    "FIPS": 28123,
    "State": "Mississippi",
    "County": "Scott"
  },
  {
    "FIPS": 28125,
    "State": "Mississippi",
    "County": "Sharkey"
  },
  {
    "FIPS": 28127,
    "State": "Mississippi",
    "County": "Simpson"
  },
  {
    "FIPS": 28129,
    "State": "Mississippi",
    "County": "Smith"
  },
  {
    "FIPS": 28131,
    "State": "Mississippi",
    "County": "Stone"
  },
  {
    "FIPS": 28133,
    "State": "Mississippi",
    "County": "Sunflower"
  },
  {
    "FIPS": 28135,
    "State": "Mississippi",
    "County": "Tallahatchie"
  },
  {
    "FIPS": 28137,
    "State": "Mississippi",
    "County": "Tate"
  },
  {
    "FIPS": 28139,
    "State": "Mississippi",
    "County": "Tippah"
  },
  {
    "FIPS": 28141,
    "State": "Mississippi",
    "County": "Tishomingo"
  },
  {
    "FIPS": 28143,
    "State": "Mississippi",
    "County": "Tunica"
  },
  {
    "FIPS": 28145,
    "State": "Mississippi",
    "County": "Union"
  },
  {
    "FIPS": 28147,
    "State": "Mississippi",
    "County": "Walthall"
  },
  {
    "FIPS": 28149,
    "State": "Mississippi",
    "County": "Warren"
  },
  {
    "FIPS": 28151,
    "State": "Mississippi",
    "County": "Washington"
  },
  {
    "FIPS": 28153,
    "State": "Mississippi",
    "County": "Wayne"
  },
  {
    "FIPS": 28155,
    "State": "Mississippi",
    "County": "Webster"
  },
  {
    "FIPS": 28157,
    "State": "Mississippi",
    "County": "Wilkinson"
  },
  {
    "FIPS": 28159,
    "State": "Mississippi",
    "County": "Winston"
  },
  {
    "FIPS": 28161,
    "State": "Mississippi",
    "County": "Yalobusha"
  },
  {
    "FIPS": 28163,
    "State": "Mississippi",
    "County": "Yazoo"
  },
  {
    "FIPS": 29001,
    "State": "Missouri",
    "County": "Adair"
  },
  {
    "FIPS": 29003,
    "State": "Missouri",
    "County": "Andrew"
  },
  {
    "FIPS": 29005,
    "State": "Missouri",
    "County": "Atchison"
  },
  {
    "FIPS": 29007,
    "State": "Missouri",
    "County": "Audrain"
  },
  {
    "FIPS": 29009,
    "State": "Missouri",
    "County": "Barry"
  },
  {
    "FIPS": 29011,
    "State": "Missouri",
    "County": "Barton"
  },
  {
    "FIPS": 29013,
    "State": "Missouri",
    "County": "Bates"
  },
  {
    "FIPS": 29015,
    "State": "Missouri",
    "County": "Benton"
  },
  {
    "FIPS": 29017,
    "State": "Missouri",
    "County": "Bollinger"
  },
  {
    "FIPS": 29019,
    "State": "Missouri",
    "County": "Boone"
  },
  {
    "FIPS": 29021,
    "State": "Missouri",
    "County": "Buchanan"
  },
  {
    "FIPS": 29023,
    "State": "Missouri",
    "County": "Butler"
  },
  {
    "FIPS": 29025,
    "State": "Missouri",
    "County": "Caldwell"
  },
  {
    "FIPS": 29027,
    "State": "Missouri",
    "County": "Callaway"
  },
  {
    "FIPS": 29029,
    "State": "Missouri",
    "County": "Camden"
  },
  {
    "FIPS": 29031,
    "State": "Missouri",
    "County": "Cape Girardeau"
  },
  {
    "FIPS": 29033,
    "State": "Missouri",
    "County": "Carroll"
  },
  {
    "FIPS": 29035,
    "State": "Missouri",
    "County": "Carter"
  },
  {
    "FIPS": 29037,
    "State": "Missouri",
    "County": "Cass"
  },
  {
    "FIPS": 29039,
    "State": "Missouri",
    "County": "Cedar"
  },
  {
    "FIPS": 29041,
    "State": "Missouri",
    "County": "Chariton"
  },
  {
    "FIPS": 29043,
    "State": "Missouri",
    "County": "Christian"
  },
  {
    "FIPS": 29045,
    "State": "Missouri",
    "County": "Clark"
  },
  {
    "FIPS": 29047,
    "State": "Missouri",
    "County": "Clay"
  },
  {
    "FIPS": 29049,
    "State": "Missouri",
    "County": "Clinton"
  },
  {
    "FIPS": 29051,
    "State": "Missouri",
    "County": "Cole"
  },
  {
    "FIPS": 29053,
    "State": "Missouri",
    "County": "Cooper"
  },
  {
    "FIPS": 29055,
    "State": "Missouri",
    "County": "Crawford"
  },
  {
    "FIPS": 29057,
    "State": "Missouri",
    "County": "Dade"
  },
  {
    "FIPS": 29059,
    "State": "Missouri",
    "County": "Dallas"
  },
  {
    "FIPS": 29061,
    "State": "Missouri",
    "County": "Daviess"
  },
  {
    "FIPS": 29063,
    "State": "Missouri",
    "County": "DeKalb"
  },
  {
    "FIPS": 29065,
    "State": "Missouri",
    "County": "Dent"
  },
  {
    "FIPS": 29067,
    "State": "Missouri",
    "County": "Douglas"
  },
  {
    "FIPS": 29069,
    "State": "Missouri",
    "County": "Dunklin"
  },
  {
    "FIPS": 29071,
    "State": "Missouri",
    "County": "Franklin"
  },
  {
    "FIPS": 29073,
    "State": "Missouri",
    "County": "Gasconade"
  },
  {
    "FIPS": 29075,
    "State": "Missouri",
    "County": "Gentry"
  },
  {
    "FIPS": 29077,
    "State": "Missouri",
    "County": "Greene"
  },
  {
    "FIPS": 29079,
    "State": "Missouri",
    "County": "Grundy"
  },
  {
    "FIPS": 29081,
    "State": "Missouri",
    "County": "Harrison"
  },
  {
    "FIPS": 29083,
    "State": "Missouri",
    "County": "Henry"
  },
  {
    "FIPS": 29085,
    "State": "Missouri",
    "County": "Hickory"
  },
  {
    "FIPS": 29087,
    "State": "Missouri",
    "County": "Holt"
  },
  {
    "FIPS": 29089,
    "State": "Missouri",
    "County": "Howard"
  },
  {
    "FIPS": 29091,
    "State": "Missouri",
    "County": "Howell"
  },
  {
    "FIPS": 29093,
    "State": "Missouri",
    "County": "Iron"
  },
  {
    "FIPS": 29095,
    "State": "Missouri",
    "County": "Jackson"
  },
  {
    "FIPS": 29097,
    "State": "Missouri",
    "County": "Jasper"
  },
  {
    "FIPS": 29099,
    "State": "Missouri",
    "County": "Jefferson"
  },
  {
    "FIPS": 29101,
    "State": "Missouri",
    "County": "Johnson"
  },
  {
    "FIPS": 29103,
    "State": "Missouri",
    "County": "Knox"
  },
  {
    "FIPS": 29105,
    "State": "Missouri",
    "County": "Laclede"
  },
  {
    "FIPS": 29107,
    "State": "Missouri",
    "County": "Lafayette"
  },
  {
    "FIPS": 29109,
    "State": "Missouri",
    "County": "Lawrence"
  },
  {
    "FIPS": 29111,
    "State": "Missouri",
    "County": "Lewis"
  },
  {
    "FIPS": 29113,
    "State": "Missouri",
    "County": "Lincoln"
  },
  {
    "FIPS": 29115,
    "State": "Missouri",
    "County": "Linn"
  },
  {
    "FIPS": 29117,
    "State": "Missouri",
    "County": "Livingston"
  },
  {
    "FIPS": 29119,
    "State": "Missouri",
    "County": "McDonald"
  },
  {
    "FIPS": 29121,
    "State": "Missouri",
    "County": "Macon"
  },
  {
    "FIPS": 29123,
    "State": "Missouri",
    "County": "Madison"
  },
  {
    "FIPS": 29125,
    "State": "Missouri",
    "County": "Maries"
  },
  {
    "FIPS": 29127,
    "State": "Missouri",
    "County": "Marion"
  },
  {
    "FIPS": 29129,
    "State": "Missouri",
    "County": "Mercer"
  },
  {
    "FIPS": 29131,
    "State": "Missouri",
    "County": "Miller"
  },
  {
    "FIPS": 29133,
    "State": "Missouri",
    "County": "Mississippi"
  },
  {
    "FIPS": 29135,
    "State": "Missouri",
    "County": "Moniteau"
  },
  {
    "FIPS": 29137,
    "State": "Missouri",
    "County": "Monroe"
  },
  {
    "FIPS": 29139,
    "State": "Missouri",
    "County": "Montgomery"
  },
  {
    "FIPS": 29141,
    "State": "Missouri",
    "County": "Morgan"
  },
  {
    "FIPS": 29143,
    "State": "Missouri",
    "County": "New Madrid"
  },
  {
    "FIPS": 29145,
    "State": "Missouri",
    "County": "Newton"
  },
  {
    "FIPS": 29147,
    "State": "Missouri",
    "County": "Nodaway"
  },
  {
    "FIPS": 29149,
    "State": "Missouri",
    "County": "Oregon"
  },
  {
    "FIPS": 29151,
    "State": "Missouri",
    "County": "Osage"
  },
  {
    "FIPS": 29153,
    "State": "Missouri",
    "County": "Ozark"
  },
  {
    "FIPS": 29155,
    "State": "Missouri",
    "County": "Pemiscot"
  },
  {
    "FIPS": 29157,
    "State": "Missouri",
    "County": "Perry"
  },
  {
    "FIPS": 29159,
    "State": "Missouri",
    "County": "Pettis"
  },
  {
    "FIPS": 29161,
    "State": "Missouri",
    "County": "Phelps"
  },
  {
    "FIPS": 29163,
    "State": "Missouri",
    "County": "Pike"
  },
  {
    "FIPS": 29165,
    "State": "Missouri",
    "County": "Platte"
  },
  {
    "FIPS": 29167,
    "State": "Missouri",
    "County": "Polk"
  },
  {
    "FIPS": 29169,
    "State": "Missouri",
    "County": "Pulaski"
  },
  {
    "FIPS": 29171,
    "State": "Missouri",
    "County": "Putnam"
  },
  {
    "FIPS": 29173,
    "State": "Missouri",
    "County": "Ralls"
  },
  {
    "FIPS": 29175,
    "State": "Missouri",
    "County": "Randolph"
  },
  {
    "FIPS": 29177,
    "State": "Missouri",
    "County": "Ray"
  },
  {
    "FIPS": 29179,
    "State": "Missouri",
    "County": "Reynolds"
  },
  {
    "FIPS": 29181,
    "State": "Missouri",
    "County": "Ripley"
  },
  {
    "FIPS": 29183,
    "State": "Missouri",
    "County": "St. Charles"
  },
  {
    "FIPS": 29185,
    "State": "Missouri",
    "County": "St. Clair"
  },
  {
    "FIPS": 29186,
    "State": "Missouri",
    "County": "Ste. Genevieve"
  },
  {
    "FIPS": 29187,
    "State": "Missouri",
    "County": "St. Francois"
  },
  {
    "FIPS": 29189,
    "State": "Missouri",
    "County": "St. Louis"
  },
  {
    "FIPS": 29195,
    "State": "Missouri",
    "County": "Saline"
  },
  {
    "FIPS": 29197,
    "State": "Missouri",
    "County": "Schuyler"
  },
  {
    "FIPS": 29199,
    "State": "Missouri",
    "County": "Scotland"
  },
  {
    "FIPS": 29201,
    "State": "Missouri",
    "County": "Scott"
  },
  {
    "FIPS": 29203,
    "State": "Missouri",
    "County": "Shannon"
  },
  {
    "FIPS": 29205,
    "State": "Missouri",
    "County": "Shelby"
  },
  {
    "FIPS": 29207,
    "State": "Missouri",
    "County": "Stoddard"
  },
  {
    "FIPS": 29209,
    "State": "Missouri",
    "County": "Stone"
  },
  {
    "FIPS": 29211,
    "State": "Missouri",
    "County": "Sullivan"
  },
  {
    "FIPS": 29213,
    "State": "Missouri",
    "County": "Taney"
  },
  {
    "FIPS": 29215,
    "State": "Missouri",
    "County": "Texas"
  },
  {
    "FIPS": 29217,
    "State": "Missouri",
    "County": "Vernon"
  },
  {
    "FIPS": 29219,
    "State": "Missouri",
    "County": "Warren"
  },
  {
    "FIPS": 29221,
    "State": "Missouri",
    "County": "Washington"
  },
  {
    "FIPS": 29223,
    "State": "Missouri",
    "County": "Wayne"
  },
  {
    "FIPS": 29225,
    "State": "Missouri",
    "County": "Webster"
  },
  {
    "FIPS": 29227,
    "State": "Missouri",
    "County": "Worth"
  },
  {
    "FIPS": 29229,
    "State": "Missouri",
    "County": "Wright"
  },
  {
    "FIPS": 29510,
    "State": "Missouri",
    "County": "St. Louis city"
  },
  {
    "FIPS": 30001,
    "State": "Montana",
    "County": "Beaverhead"
  },
  {
    "FIPS": 30003,
    "State": "Montana",
    "County": "Big Horn"
  },
  {
    "FIPS": 30005,
    "State": "Montana",
    "County": "Blaine"
  },
  {
    "FIPS": 30007,
    "State": "Montana",
    "County": "Broadwater"
  },
  {
    "FIPS": 30009,
    "State": "Montana",
    "County": "Carbon"
  },
  {
    "FIPS": 30011,
    "State": "Montana",
    "County": "Carter"
  },
  {
    "FIPS": 30013,
    "State": "Montana",
    "County": "Cascade"
  },
  {
    "FIPS": 30015,
    "State": "Montana",
    "County": "Chouteau"
  },
  {
    "FIPS": 30017,
    "State": "Montana",
    "County": "Custer"
  },
  {
    "FIPS": 30019,
    "State": "Montana",
    "County": "Daniels"
  },
  {
    "FIPS": 30021,
    "State": "Montana",
    "County": "Dawson"
  },
  {
    "FIPS": 30023,
    "State": "Montana",
    "County": "Deer Lodge"
  },
  {
    "FIPS": 30025,
    "State": "Montana",
    "County": "Fallon"
  },
  {
    "FIPS": 30027,
    "State": "Montana",
    "County": "Fergus"
  },
  {
    "FIPS": 30029,
    "State": "Montana",
    "County": "Flathead"
  },
  {
    "FIPS": 30031,
    "State": "Montana",
    "County": "Gallatin"
  },
  {
    "FIPS": 30033,
    "State": "Montana",
    "County": "Garfield"
  },
  {
    "FIPS": 30035,
    "State": "Montana",
    "County": "Glacier"
  },
  {
    "FIPS": 30037,
    "State": "Montana",
    "County": "Golden Valley"
  },
  {
    "FIPS": 30039,
    "State": "Montana",
    "County": "Granite"
  },
  {
    "FIPS": 30041,
    "State": "Montana",
    "County": "Hill"
  },
  {
    "FIPS": 30043,
    "State": "Montana",
    "County": "Jefferson"
  },
  {
    "FIPS": 30045,
    "State": "Montana",
    "County": "Judith Basin"
  },
  {
    "FIPS": 30047,
    "State": "Montana",
    "County": "Lake"
  },
  {
    "FIPS": 30049,
    "State": "Montana",
    "County": "Lewis and Clark"
  },
  {
    "FIPS": 30051,
    "State": "Montana",
    "County": "Liberty"
  },
  {
    "FIPS": 30053,
    "State": "Montana",
    "County": "Lincoln"
  },
  {
    "FIPS": 30055,
    "State": "Montana",
    "County": "McCone"
  },
  {
    "FIPS": 30057,
    "State": "Montana",
    "County": "Madison"
  },
  {
    "FIPS": 30059,
    "State": "Montana",
    "County": "Meagher"
  },
  {
    "FIPS": 30061,
    "State": "Montana",
    "County": "Mineral"
  },
  {
    "FIPS": 30063,
    "State": "Montana",
    "County": "Missoula"
  },
  {
    "FIPS": 30065,
    "State": "Montana",
    "County": "Musselshell"
  },
  {
    "FIPS": 30067,
    "State": "Montana",
    "County": "Park"
  },
  {
    "FIPS": 30069,
    "State": "Montana",
    "County": "Petroleum"
  },
  {
    "FIPS": 30071,
    "State": "Montana",
    "County": "Phillips"
  },
  {
    "FIPS": 30073,
    "State": "Montana",
    "County": "Pondera"
  },
  {
    "FIPS": 30075,
    "State": "Montana",
    "County": "Powder River"
  },
  {
    "FIPS": 30077,
    "State": "Montana",
    "County": "Powell"
  },
  {
    "FIPS": 30079,
    "State": "Montana",
    "County": "Prairie"
  },
  {
    "FIPS": 30081,
    "State": "Montana",
    "County": "Ravalli"
  },
  {
    "FIPS": 30083,
    "State": "Montana",
    "County": "Richland"
  },
  {
    "FIPS": 30085,
    "State": "Montana",
    "County": "Roosevelt"
  },
  {
    "FIPS": 30087,
    "State": "Montana",
    "County": "Rosebud"
  },
  {
    "FIPS": 30089,
    "State": "Montana",
    "County": "Sanders"
  },
  {
    "FIPS": 30091,
    "State": "Montana",
    "County": "Sheridan"
  },
  {
    "FIPS": 30093,
    "State": "Montana",
    "County": "Silver Bow"
  },
  {
    "FIPS": 30095,
    "State": "Montana",
    "County": "Stillwater"
  },
  {
    "FIPS": 30097,
    "State": "Montana",
    "County": "Sweet Grass"
  },
  {
    "FIPS": 30099,
    "State": "Montana",
    "County": "Teton"
  },
  {
    "FIPS": 30101,
    "State": "Montana",
    "County": "Toole"
  },
  {
    "FIPS": 30103,
    "State": "Montana",
    "County": "Treasure"
  },
  {
    "FIPS": 30105,
    "State": "Montana",
    "County": "Valley"
  },
  {
    "FIPS": 30107,
    "State": "Montana",
    "County": "Wheatland"
  },
  {
    "FIPS": 30109,
    "State": "Montana",
    "County": "Wibaux"
  },
  {
    "FIPS": 30111,
    "State": "Montana",
    "County": "Yellowstone"
  },
  {
    "FIPS": 31001,
    "State": "Nebraska",
    "County": "Adams"
  },
  {
    "FIPS": 31003,
    "State": "Nebraska",
    "County": "Antelope"
  },
  {
    "FIPS": 31005,
    "State": "Nebraska",
    "County": "Arthur"
  },
  {
    "FIPS": 31007,
    "State": "Nebraska",
    "County": "Banner"
  },
  {
    "FIPS": 31009,
    "State": "Nebraska",
    "County": "Blaine"
  },
  {
    "FIPS": 31011,
    "State": "Nebraska",
    "County": "Boone"
  },
  {
    "FIPS": 31013,
    "State": "Nebraska",
    "County": "Box Butte"
  },
  {
    "FIPS": 31015,
    "State": "Nebraska",
    "County": "Boyd"
  },
  {
    "FIPS": 31017,
    "State": "Nebraska",
    "County": "Brown"
  },
  {
    "FIPS": 31019,
    "State": "Nebraska",
    "County": "Buffalo"
  },
  {
    "FIPS": 31021,
    "State": "Nebraska",
    "County": "Burt"
  },
  {
    "FIPS": 31023,
    "State": "Nebraska",
    "County": "Butler"
  },
  {
    "FIPS": 31025,
    "State": "Nebraska",
    "County": "Cass"
  },
  {
    "FIPS": 31027,
    "State": "Nebraska",
    "County": "Cedar"
  },
  {
    "FIPS": 31029,
    "State": "Nebraska",
    "County": "Chase"
  },
  {
    "FIPS": 31031,
    "State": "Nebraska",
    "County": "Cherry"
  },
  {
    "FIPS": 31033,
    "State": "Nebraska",
    "County": "Cheyenne"
  },
  {
    "FIPS": 31035,
    "State": "Nebraska",
    "County": "Clay"
  },
  {
    "FIPS": 31037,
    "State": "Nebraska",
    "County": "Colfax"
  },
  {
    "FIPS": 31039,
    "State": "Nebraska",
    "County": "Cuming"
  },
  {
    "FIPS": 31041,
    "State": "Nebraska",
    "County": "Custer"
  },
  {
    "FIPS": 31043,
    "State": "Nebraska",
    "County": "Dakota"
  },
  {
    "FIPS": 31045,
    "State": "Nebraska",
    "County": "Dawes"
  },
  {
    "FIPS": 31047,
    "State": "Nebraska",
    "County": "Dawson"
  },
  {
    "FIPS": 31049,
    "State": "Nebraska",
    "County": "Deuel"
  },
  {
    "FIPS": 31051,
    "State": "Nebraska",
    "County": "Dixon"
  },
  {
    "FIPS": 31053,
    "State": "Nebraska",
    "County": "Dodge"
  },
  {
    "FIPS": 31055,
    "State": "Nebraska",
    "County": "Douglas"
  },
  {
    "FIPS": 31057,
    "State": "Nebraska",
    "County": "Dundy"
  },
  {
    "FIPS": 31059,
    "State": "Nebraska",
    "County": "Fillmore"
  },
  {
    "FIPS": 31061,
    "State": "Nebraska",
    "County": "Franklin"
  },
  {
    "FIPS": 31063,
    "State": "Nebraska",
    "County": "Frontier"
  },
  {
    "FIPS": 31065,
    "State": "Nebraska",
    "County": "Furnas"
  },
  {
    "FIPS": 31067,
    "State": "Nebraska",
    "County": "Gage"
  },
  {
    "FIPS": 31069,
    "State": "Nebraska",
    "County": "Garden"
  },
  {
    "FIPS": 31071,
    "State": "Nebraska",
    "County": "Garfield"
  },
  {
    "FIPS": 31073,
    "State": "Nebraska",
    "County": "Gosper"
  },
  {
    "FIPS": 31075,
    "State": "Nebraska",
    "County": "Grant"
  },
  {
    "FIPS": 31077,
    "State": "Nebraska",
    "County": "Greeley"
  },
  {
    "FIPS": 31079,
    "State": "Nebraska",
    "County": "Hall"
  },
  {
    "FIPS": 31081,
    "State": "Nebraska",
    "County": "Hamilton"
  },
  {
    "FIPS": 31083,
    "State": "Nebraska",
    "County": "Harlan"
  },
  {
    "FIPS": 31085,
    "State": "Nebraska",
    "County": "Hayes"
  },
  {
    "FIPS": 31087,
    "State": "Nebraska",
    "County": "Hitchcock"
  },
  {
    "FIPS": 31089,
    "State": "Nebraska",
    "County": "Holt"
  },
  {
    "FIPS": 31091,
    "State": "Nebraska",
    "County": "Hooker"
  },
  {
    "FIPS": 31093,
    "State": "Nebraska",
    "County": "Howard"
  },
  {
    "FIPS": 31095,
    "State": "Nebraska",
    "County": "Jefferson"
  },
  {
    "FIPS": 31097,
    "State": "Nebraska",
    "County": "Johnson"
  },
  {
    "FIPS": 31099,
    "State": "Nebraska",
    "County": "Kearney"
  },
  {
    "FIPS": 31101,
    "State": "Nebraska",
    "County": "Keith"
  },
  {
    "FIPS": 31103,
    "State": "Nebraska",
    "County": "Keya Paha"
  },
  {
    "FIPS": 31105,
    "State": "Nebraska",
    "County": "Kimball"
  },
  {
    "FIPS": 31107,
    "State": "Nebraska",
    "County": "Knox"
  },
  {
    "FIPS": 31109,
    "State": "Nebraska",
    "County": "Lancaster"
  },
  {
    "FIPS": 31111,
    "State": "Nebraska",
    "County": "Lincoln"
  },
  {
    "FIPS": 31113,
    "State": "Nebraska",
    "County": "Logan"
  },
  {
    "FIPS": 31115,
    "State": "Nebraska",
    "County": "Loup"
  },
  {
    "FIPS": 31117,
    "State": "Nebraska",
    "County": "McPherson"
  },
  {
    "FIPS": 31119,
    "State": "Nebraska",
    "County": "Madison"
  },
  {
    "FIPS": 31121,
    "State": "Nebraska",
    "County": "Merrick"
  },
  {
    "FIPS": 31123,
    "State": "Nebraska",
    "County": "Morrill"
  },
  {
    "FIPS": 31125,
    "State": "Nebraska",
    "County": "Nance"
  },
  {
    "FIPS": 31127,
    "State": "Nebraska",
    "County": "Nemaha"
  },
  {
    "FIPS": 31129,
    "State": "Nebraska",
    "County": "Nuckolls"
  },
  {
    "FIPS": 31131,
    "State": "Nebraska",
    "County": "Otoe"
  },
  {
    "FIPS": 31133,
    "State": "Nebraska",
    "County": "Pawnee"
  },
  {
    "FIPS": 31135,
    "State": "Nebraska",
    "County": "Perkins"
  },
  {
    "FIPS": 31137,
    "State": "Nebraska",
    "County": "Phelps"
  },
  {
    "FIPS": 31139,
    "State": "Nebraska",
    "County": "Pierce"
  },
  {
    "FIPS": 31141,
    "State": "Nebraska",
    "County": "Platte"
  },
  {
    "FIPS": 31143,
    "State": "Nebraska",
    "County": "Polk"
  },
  {
    "FIPS": 31145,
    "State": "Nebraska",
    "County": "Red Willow"
  },
  {
    "FIPS": 31147,
    "State": "Nebraska",
    "County": "Richardson"
  },
  {
    "FIPS": 31149,
    "State": "Nebraska",
    "County": "Rock"
  },
  {
    "FIPS": 31151,
    "State": "Nebraska",
    "County": "Saline"
  },
  {
    "FIPS": 31153,
    "State": "Nebraska",
    "County": "Sarpy"
  },
  {
    "FIPS": 31155,
    "State": "Nebraska",
    "County": "Saunders"
  },
  {
    "FIPS": 31157,
    "State": "Nebraska",
    "County": "Scotts Bluff"
  },
  {
    "FIPS": 31159,
    "State": "Nebraska",
    "County": "Seward"
  },
  {
    "FIPS": 31161,
    "State": "Nebraska",
    "County": "Sheridan"
  },
  {
    "FIPS": 31163,
    "State": "Nebraska",
    "County": "Sherman"
  },
  {
    "FIPS": 31165,
    "State": "Nebraska",
    "County": "Sioux"
  },
  {
    "FIPS": 31167,
    "State": "Nebraska",
    "County": "Stanton"
  },
  {
    "FIPS": 31169,
    "State": "Nebraska",
    "County": "Thayer"
  },
  {
    "FIPS": 31171,
    "State": "Nebraska",
    "County": "Thomas"
  },
  {
    "FIPS": 31173,
    "State": "Nebraska",
    "County": "Thurston"
  },
  {
    "FIPS": 31175,
    "State": "Nebraska",
    "County": "Valley"
  },
  {
    "FIPS": 31177,
    "State": "Nebraska",
    "County": "Washington"
  },
  {
    "FIPS": 31179,
    "State": "Nebraska",
    "County": "Wayne"
  },
  {
    "FIPS": 31181,
    "State": "Nebraska",
    "County": "Webster"
  },
  {
    "FIPS": 31183,
    "State": "Nebraska",
    "County": "Wheeler"
  },
  {
    "FIPS": 31185,
    "State": "Nebraska",
    "County": "York"
  },
  {
    "FIPS": 32001,
    "State": "Nevada",
    "County": "Churchill"
  },
  {
    "FIPS": 32003,
    "State": "Nevada",
    "County": "Clark"
  },
  {
    "FIPS": 32005,
    "State": "Nevada",
    "County": "Douglas"
  },
  {
    "FIPS": 32007,
    "State": "Nevada",
    "County": "Elko"
  },
  {
    "FIPS": 32009,
    "State": "Nevada",
    "County": "Esmeralda"
  },
  {
    "FIPS": 32011,
    "State": "Nevada",
    "County": "Eureka"
  },
  {
    "FIPS": 32013,
    "State": "Nevada",
    "County": "Humboldt"
  },
  {
    "FIPS": 32015,
    "State": "Nevada",
    "County": "Lander"
  },
  {
    "FIPS": 32017,
    "State": "Nevada",
    "County": "Lincoln"
  },
  {
    "FIPS": 32019,
    "State": "Nevada",
    "County": "Lyon"
  },
  {
    "FIPS": 32021,
    "State": "Nevada",
    "County": "Mineral"
  },
  {
    "FIPS": 32023,
    "State": "Nevada",
    "County": "Nye"
  },
  {
    "FIPS": 32027,
    "State": "Nevada",
    "County": "Pershing"
  },
  {
    "FIPS": 32029,
    "State": "Nevada",
    "County": "Storey"
  },
  {
    "FIPS": 32031,
    "State": "Nevada",
    "County": "Washoe"
  },
  {
    "FIPS": 32033,
    "State": "Nevada",
    "County": "White Pine"
  },
  {
    "FIPS": 32510,
    "State": "Nevada",
    "County": "Carson city"
  },
  {
    "FIPS": 33001,
    "State": "New Hampshire",
    "County": "Belknap"
  },
  {
    "FIPS": 33003,
    "State": "New Hampshire",
    "County": "Carroll"
  },
  {
    "FIPS": 33005,
    "State": "New Hampshire",
    "County": "Cheshire"
  },
  {
    "FIPS": 33007,
    "State": "New Hampshire",
    "County": "Coos"
  },
  {
    "FIPS": 33009,
    "State": "New Hampshire",
    "County": "Grafton"
  },
  {
    "FIPS": 33011,
    "State": "New Hampshire",
    "County": "Hillsborough"
  },
  {
    "FIPS": 33013,
    "State": "New Hampshire",
    "County": "Merrimack"
  },
  {
    "FIPS": 33015,
    "State": "New Hampshire",
    "County": "Rockingham"
  },
  {
    "FIPS": 33017,
    "State": "New Hampshire",
    "County": "Strafford"
  },
  {
    "FIPS": 33019,
    "State": "New Hampshire",
    "County": "Sullivan"
  },
  {
    "FIPS": 34001,
    "State": "New Jersey",
    "County": "Atlantic"
  },
  {
    "FIPS": 34003,
    "State": "New Jersey",
    "County": "Bergen"
  },
  {
    "FIPS": 34005,
    "State": "New Jersey",
    "County": "Burlington"
  },
  {
    "FIPS": 34007,
    "State": "New Jersey",
    "County": "Camden"
  },
  {
    "FIPS": 34009,
    "State": "New Jersey",
    "County": "Cape May"
  },
  {
    "FIPS": 34011,
    "State": "New Jersey",
    "County": "Cumberland"
  },
  {
    "FIPS": 34013,
    "State": "New Jersey",
    "County": "Essex"
  },
  {
    "FIPS": 34015,
    "State": "New Jersey",
    "County": "Gloucester"
  },
  {
    "FIPS": 34017,
    "State": "New Jersey",
    "County": "Hudson"
  },
  {
    "FIPS": 34019,
    "State": "New Jersey",
    "County": "Hunterdon"
  },
  {
    "FIPS": 34021,
    "State": "New Jersey",
    "County": "Mercer"
  },
  {
    "FIPS": 34023,
    "State": "New Jersey",
    "County": "Middlesex"
  },
  {
    "FIPS": 34025,
    "State": "New Jersey",
    "County": "Monmouth"
  },
  {
    "FIPS": 34027,
    "State": "New Jersey",
    "County": "Morris"
  },
  {
    "FIPS": 34029,
    "State": "New Jersey",
    "County": "Ocean"
  },
  {
    "FIPS": 34031,
    "State": "New Jersey",
    "County": "Passaic"
  },
  {
    "FIPS": 34033,
    "State": "New Jersey",
    "County": "Salem"
  },
  {
    "FIPS": 34035,
    "State": "New Jersey",
    "County": "Somerset"
  },
  {
    "FIPS": 34037,
    "State": "New Jersey",
    "County": "Sussex"
  },
  {
    "FIPS": 34039,
    "State": "New Jersey",
    "County": "Union"
  },
  {
    "FIPS": 34041,
    "State": "New Jersey",
    "County": "Warren"
  },
  {
    "FIPS": 35001,
    "State": "New Mexico",
    "County": "Bernalillo"
  },
  {
    "FIPS": 35003,
    "State": "New Mexico",
    "County": "Catron"
  },
  {
    "FIPS": 35005,
    "State": "New Mexico",
    "County": "Chaves"
  },
  {
    "FIPS": 35006,
    "State": "New Mexico",
    "County": "Cibola"
  },
  {
    "FIPS": 35007,
    "State": "New Mexico",
    "County": "Colfax"
  },
  {
    "FIPS": 35009,
    "State": "New Mexico",
    "County": "Curry"
  },
  {
    "FIPS": 35011,
    "State": "New Mexico",
    "County": "De Baca"
  },
  {
    "FIPS": 35013,
    "State": "New Mexico",
    "County": "Dona Ana"
  },
  {
    "FIPS": 35015,
    "State": "New Mexico",
    "County": "Eddy"
  },
  {
    "FIPS": 35017,
    "State": "New Mexico",
    "County": "Grant"
  },
  {
    "FIPS": 35019,
    "State": "New Mexico",
    "County": "Guadalupe"
  },
  {
    "FIPS": 35021,
    "State": "New Mexico",
    "County": "Harding"
  },
  {
    "FIPS": 35023,
    "State": "New Mexico",
    "County": "Hidalgo"
  },
  {
    "FIPS": 35025,
    "State": "New Mexico",
    "County": "Lea"
  },
  {
    "FIPS": 35027,
    "State": "New Mexico",
    "County": "Lincoln"
  },
  {
    "FIPS": 35028,
    "State": "New Mexico",
    "County": "Los Alamos"
  },
  {
    "FIPS": 35029,
    "State": "New Mexico",
    "County": "Luna"
  },
  {
    "FIPS": 35031,
    "State": "New Mexico",
    "County": "McKinley"
  },
  {
    "FIPS": 35033,
    "State": "New Mexico",
    "County": "Mora"
  },
  {
    "FIPS": 35035,
    "State": "New Mexico",
    "County": "Otero"
  },
  {
    "FIPS": 35037,
    "State": "New Mexico",
    "County": "Quay"
  },
  {
    "FIPS": 35039,
    "State": "New Mexico",
    "County": "Rio Arriba"
  },
  {
    "FIPS": 35041,
    "State": "New Mexico",
    "County": "Roosevelt"
  },
  {
    "FIPS": 35043,
    "State": "New Mexico",
    "County": "Sandoval"
  },
  {
    "FIPS": 35045,
    "State": "New Mexico",
    "County": "San Juan"
  },
  {
    "FIPS": 35047,
    "State": "New Mexico",
    "County": "San Miguel"
  },
  {
    "FIPS": 35049,
    "State": "New Mexico",
    "County": "Santa Fe"
  },
  {
    "FIPS": 35051,
    "State": "New Mexico",
    "County": "Sierra"
  },
  {
    "FIPS": 35053,
    "State": "New Mexico",
    "County": "Socorro"
  },
  {
    "FIPS": 35055,
    "State": "New Mexico",
    "County": "Taos"
  },
  {
    "FIPS": 35057,
    "State": "New Mexico",
    "County": "Torrance"
  },
  {
    "FIPS": 35059,
    "State": "New Mexico",
    "County": "Union"
  },
  {
    "FIPS": 35061,
    "State": "New Mexico",
    "County": "Valencia"
  },
  {
    "FIPS": 36001,
    "State": "New York",
    "County": "Albany"
  },
  {
    "FIPS": 36003,
    "State": "New York",
    "County": "Allegany"
  },
  {
    "FIPS": 36005,
    "State": "New York",
    "County": "Bronx"
  },
  {
    "FIPS": 36007,
    "State": "New York",
    "County": "Broome"
  },
  {
    "FIPS": 36009,
    "State": "New York",
    "County": "Cattaraugus"
  },
  {
    "FIPS": 36011,
    "State": "New York",
    "County": "Cayuga"
  },
  {
    "FIPS": 36013,
    "State": "New York",
    "County": "Chautauqua"
  },
  {
    "FIPS": 36015,
    "State": "New York",
    "County": "Chemung"
  },
  {
    "FIPS": 36017,
    "State": "New York",
    "County": "Chenango"
  },
  {
    "FIPS": 36019,
    "State": "New York",
    "County": "Clinton"
  },
  {
    "FIPS": 36021,
    "State": "New York",
    "County": "Columbia"
  },
  {
    "FIPS": 36023,
    "State": "New York",
    "County": "Cortland"
  },
  {
    "FIPS": 36025,
    "State": "New York",
    "County": "Delaware"
  },
  {
    "FIPS": 36027,
    "State": "New York",
    "County": "Dutchess"
  },
  {
    "FIPS": 36029,
    "State": "New York",
    "County": "Erie"
  },
  {
    "FIPS": 36031,
    "State": "New York",
    "County": "Essex"
  },
  {
    "FIPS": 36033,
    "State": "New York",
    "County": "Franklin"
  },
  {
    "FIPS": 36035,
    "State": "New York",
    "County": "Fulton"
  },
  {
    "FIPS": 36037,
    "State": "New York",
    "County": "Genesee"
  },
  {
    "FIPS": 36039,
    "State": "New York",
    "County": "Greene"
  },
  {
    "FIPS": 36041,
    "State": "New York",
    "County": "Hamilton"
  },
  {
    "FIPS": 36043,
    "State": "New York",
    "County": "Herkimer"
  },
  {
    "FIPS": 36045,
    "State": "New York",
    "County": "Jefferson"
  },
  {
    "FIPS": 36047,
    "State": "New York",
    "County": "Kings"
  },
  {
    "FIPS": 36049,
    "State": "New York",
    "County": "Lewis"
  },
  {
    "FIPS": 36051,
    "State": "New York",
    "County": "Livingston"
  },
  {
    "FIPS": 36053,
    "State": "New York",
    "County": "Madison"
  },
  {
    "FIPS": 36055,
    "State": "New York",
    "County": "Monroe"
  },
  {
    "FIPS": 36057,
    "State": "New York",
    "County": "Montgomery"
  },
  {
    "FIPS": 36059,
    "State": "New York",
    "County": "Nassau"
  },
  {
    "FIPS": 36061,
    "State": "New York",
    "County": "New York"
  },
  {
    "FIPS": 36063,
    "State": "New York",
    "County": "Niagara"
  },
  {
    "FIPS": 36065,
    "State": "New York",
    "County": "Oneida"
  },
  {
    "FIPS": 36067,
    "State": "New York",
    "County": "Onondaga"
  },
  {
    "FIPS": 36069,
    "State": "New York",
    "County": "Ontario"
  },
  {
    "FIPS": 36071,
    "State": "New York",
    "County": "Orange"
  },
  {
    "FIPS": 36073,
    "State": "New York",
    "County": "Orleans"
  },
  {
    "FIPS": 36075,
    "State": "New York",
    "County": "Oswego"
  },
  {
    "FIPS": 36077,
    "State": "New York",
    "County": "Otsego"
  },
  {
    "FIPS": 36079,
    "State": "New York",
    "County": "Putnam"
  },
  {
    "FIPS": 36081,
    "State": "New York",
    "County": "Queens"
  },
  {
    "FIPS": 36083,
    "State": "New York",
    "County": "Rensselaer"
  },
  {
    "FIPS": 36085,
    "State": "New York",
    "County": "Richmond"
  },
  {
    "FIPS": 36087,
    "State": "New York",
    "County": "Rockland"
  },
  {
    "FIPS": 36089,
    "State": "New York",
    "County": "St. Lawrence"
  },
  {
    "FIPS": 36091,
    "State": "New York",
    "County": "Saratoga"
  },
  {
    "FIPS": 36093,
    "State": "New York",
    "County": "Schenectady"
  },
  {
    "FIPS": 36095,
    "State": "New York",
    "County": "Schoharie"
  },
  {
    "FIPS": 36097,
    "State": "New York",
    "County": "Schuyler"
  },
  {
    "FIPS": 36099,
    "State": "New York",
    "County": "Seneca"
  },
  {
    "FIPS": 36101,
    "State": "New York",
    "County": "Steuben"
  },
  {
    "FIPS": 36103,
    "State": "New York",
    "County": "Suffolk"
  },
  {
    "FIPS": 36105,
    "State": "New York",
    "County": "Sullivan"
  },
  {
    "FIPS": 36107,
    "State": "New York",
    "County": "Tioga"
  },
  {
    "FIPS": 36109,
    "State": "New York",
    "County": "Tompkins"
  },
  {
    "FIPS": 36111,
    "State": "New York",
    "County": "Ulster"
  },
  {
    "FIPS": 36113,
    "State": "New York",
    "County": "Warren"
  },
  {
    "FIPS": 36115,
    "State": "New York",
    "County": "Washington"
  },
  {
    "FIPS": 36117,
    "State": "New York",
    "County": "Wayne"
  },
  {
    "FIPS": 36119,
    "State": "New York",
    "County": "Westchester"
  },
  {
    "FIPS": 36121,
    "State": "New York",
    "County": "Wyoming"
  },
  {
    "FIPS": 36123,
    "State": "New York",
    "County": "Yates"
  },
  {
    "FIPS": 37001,
    "State": "North Carolina",
    "County": "Alamance"
  },
  {
    "FIPS": 37003,
    "State": "North Carolina",
    "County": "Alexander"
  },
  {
    "FIPS": 37005,
    "State": "North Carolina",
    "County": "Alleghany"
  },
  {
    "FIPS": 37007,
    "State": "North Carolina",
    "County": "Anson"
  },
  {
    "FIPS": 37009,
    "State": "North Carolina",
    "County": "Ashe"
  },
  {
    "FIPS": 37011,
    "State": "North Carolina",
    "County": "Avery"
  },
  {
    "FIPS": 37013,
    "State": "North Carolina",
    "County": "Beaufort"
  },
  {
    "FIPS": 37015,
    "State": "North Carolina",
    "County": "Bertie"
  },
  {
    "FIPS": 37017,
    "State": "North Carolina",
    "County": "Bladen"
  },
  {
    "FIPS": 37019,
    "State": "North Carolina",
    "County": "Brunswick"
  },
  {
    "FIPS": 37021,
    "State": "North Carolina",
    "County": "Buncombe"
  },
  {
    "FIPS": 37023,
    "State": "North Carolina",
    "County": "Burke"
  },
  {
    "FIPS": 37025,
    "State": "North Carolina",
    "County": "Cabarrus"
  },
  {
    "FIPS": 37027,
    "State": "North Carolina",
    "County": "Caldwell"
  },
  {
    "FIPS": 37029,
    "State": "North Carolina",
    "County": "Camden"
  },
  {
    "FIPS": 37031,
    "State": "North Carolina",
    "County": "Carteret"
  },
  {
    "FIPS": 37033,
    "State": "North Carolina",
    "County": "Caswell"
  },
  {
    "FIPS": 37035,
    "State": "North Carolina",
    "County": "Catawba"
  },
  {
    "FIPS": 37037,
    "State": "North Carolina",
    "County": "Chatham"
  },
  {
    "FIPS": 37039,
    "State": "North Carolina",
    "County": "Cherokee"
  },
  {
    "FIPS": 37041,
    "State": "North Carolina",
    "County": "Chowan"
  },
  {
    "FIPS": 37043,
    "State": "North Carolina",
    "County": "Clay"
  },
  {
    "FIPS": 37045,
    "State": "North Carolina",
    "County": "Cleveland"
  },
  {
    "FIPS": 37047,
    "State": "North Carolina",
    "County": "Columbus"
  },
  {
    "FIPS": 37049,
    "State": "North Carolina",
    "County": "Craven"
  },
  {
    "FIPS": 37051,
    "State": "North Carolina",
    "County": "Cumberland"
  },
  {
    "FIPS": 37053,
    "State": "North Carolina",
    "County": "Currituck"
  },
  {
    "FIPS": 37055,
    "State": "North Carolina",
    "County": "Dare"
  },
  {
    "FIPS": 37057,
    "State": "North Carolina",
    "County": "Davidson"
  },
  {
    "FIPS": 37059,
    "State": "North Carolina",
    "County": "Davie"
  },
  {
    "FIPS": 37061,
    "State": "North Carolina",
    "County": "Duplin"
  },
  {
    "FIPS": 37063,
    "State": "North Carolina",
    "County": "Durham"
  },
  {
    "FIPS": 37065,
    "State": "North Carolina",
    "County": "Edgecombe"
  },
  {
    "FIPS": 37067,
    "State": "North Carolina",
    "County": "Forsyth"
  },
  {
    "FIPS": 37069,
    "State": "North Carolina",
    "County": "Franklin"
  },
  {
    "FIPS": 37071,
    "State": "North Carolina",
    "County": "Gaston"
  },
  {
    "FIPS": 37073,
    "State": "North Carolina",
    "County": "Gates"
  },
  {
    "FIPS": 37075,
    "State": "North Carolina",
    "County": "Graham"
  },
  {
    "FIPS": 37077,
    "State": "North Carolina",
    "County": "Granville"
  },
  {
    "FIPS": 37079,
    "State": "North Carolina",
    "County": "Greene"
  },
  {
    "FIPS": 37081,
    "State": "North Carolina",
    "County": "Guilford"
  },
  {
    "FIPS": 37083,
    "State": "North Carolina",
    "County": "Halifax"
  },
  {
    "FIPS": 37085,
    "State": "North Carolina",
    "County": "Harnett"
  },
  {
    "FIPS": 37087,
    "State": "North Carolina",
    "County": "Haywood"
  },
  {
    "FIPS": 37089,
    "State": "North Carolina",
    "County": "Henderson"
  },
  {
    "FIPS": 37091,
    "State": "North Carolina",
    "County": "Hertford"
  },
  {
    "FIPS": 37093,
    "State": "North Carolina",
    "County": "Hoke"
  },
  {
    "FIPS": 37095,
    "State": "North Carolina",
    "County": "Hyde"
  },
  {
    "FIPS": 37097,
    "State": "North Carolina",
    "County": "Iredell"
  },
  {
    "FIPS": 37099,
    "State": "North Carolina",
    "County": "Jackson"
  },
  {
    "FIPS": 37101,
    "State": "North Carolina",
    "County": "Johnston"
  },
  {
    "FIPS": 37103,
    "State": "North Carolina",
    "County": "Jones"
  },
  {
    "FIPS": 37105,
    "State": "North Carolina",
    "County": "Lee"
  },
  {
    "FIPS": 37107,
    "State": "North Carolina",
    "County": "Lenoir"
  },
  {
    "FIPS": 37109,
    "State": "North Carolina",
    "County": "Lincoln"
  },
  {
    "FIPS": 37111,
    "State": "North Carolina",
    "County": "McDowell"
  },
  {
    "FIPS": 37113,
    "State": "North Carolina",
    "County": "Macon"
  },
  {
    "FIPS": 37115,
    "State": "North Carolina",
    "County": "Madison"
  },
  {
    "FIPS": 37117,
    "State": "North Carolina",
    "County": "Martin"
  },
  {
    "FIPS": 37119,
    "State": "North Carolina",
    "County": "Mecklenburg"
  },
  {
    "FIPS": 37121,
    "State": "North Carolina",
    "County": "Mitchell"
  },
  {
    "FIPS": 37123,
    "State": "North Carolina",
    "County": "Montgomery"
  },
  {
    "FIPS": 37125,
    "State": "North Carolina",
    "County": "Moore"
  },
  {
    "FIPS": 37127,
    "State": "North Carolina",
    "County": "Nash"
  },
  {
    "FIPS": 37129,
    "State": "North Carolina",
    "County": "New Hanover"
  },
  {
    "FIPS": 37131,
    "State": "North Carolina",
    "County": "Northampton"
  },
  {
    "FIPS": 37133,
    "State": "North Carolina",
    "County": "Onslow"
  },
  {
    "FIPS": 37135,
    "State": "North Carolina",
    "County": "Orange"
  },
  {
    "FIPS": 37137,
    "State": "North Carolina",
    "County": "Pamlico"
  },
  {
    "FIPS": 37139,
    "State": "North Carolina",
    "County": "Pasquotank"
  },
  {
    "FIPS": 37141,
    "State": "North Carolina",
    "County": "Pender"
  },
  {
    "FIPS": 37143,
    "State": "North Carolina",
    "County": "Perquimans"
  },
  {
    "FIPS": 37145,
    "State": "North Carolina",
    "County": "Person"
  },
  {
    "FIPS": 37147,
    "State": "North Carolina",
    "County": "Pitt"
  },
  {
    "FIPS": 37149,
    "State": "North Carolina",
    "County": "Polk"
  },
  {
    "FIPS": 37151,
    "State": "North Carolina",
    "County": "Randolph"
  },
  {
    "FIPS": 37153,
    "State": "North Carolina",
    "County": "Richmond"
  },
  {
    "FIPS": 37155,
    "State": "North Carolina",
    "County": "Robeson"
  },
  {
    "FIPS": 37157,
    "State": "North Carolina",
    "County": "Rockingham"
  },
  {
    "FIPS": 37159,
    "State": "North Carolina",
    "County": "Rowan"
  },
  {
    "FIPS": 37161,
    "State": "North Carolina",
    "County": "Rutherford"
  },
  {
    "FIPS": 37163,
    "State": "North Carolina",
    "County": "Sampson"
  },
  {
    "FIPS": 37165,
    "State": "North Carolina",
    "County": "Scotland"
  },
  {
    "FIPS": 37167,
    "State": "North Carolina",
    "County": "Stanly"
  },
  {
    "FIPS": 37169,
    "State": "North Carolina",
    "County": "Stokes"
  },
  {
    "FIPS": 37171,
    "State": "North Carolina",
    "County": "Surry"
  },
  {
    "FIPS": 37173,
    "State": "North Carolina",
    "County": "Swain"
  },
  {
    "FIPS": 37175,
    "State": "North Carolina",
    "County": "Transylvania"
  },
  {
    "FIPS": 37177,
    "State": "North Carolina",
    "County": "Tyrrell"
  },
  {
    "FIPS": 37179,
    "State": "North Carolina",
    "County": "Union"
  },
  {
    "FIPS": 37181,
    "State": "North Carolina",
    "County": "Vance"
  },
  {
    "FIPS": 37183,
    "State": "North Carolina",
    "County": "Wake"
  },
  {
    "FIPS": 37185,
    "State": "North Carolina",
    "County": "Warren"
  },
  {
    "FIPS": 37187,
    "State": "North Carolina",
    "County": "Washington"
  },
  {
    "FIPS": 37189,
    "State": "North Carolina",
    "County": "Watauga"
  },
  {
    "FIPS": 37191,
    "State": "North Carolina",
    "County": "Wayne"
  },
  {
    "FIPS": 37193,
    "State": "North Carolina",
    "County": "Wilkes"
  },
  {
    "FIPS": 37195,
    "State": "North Carolina",
    "County": "Wilson"
  },
  {
    "FIPS": 37197,
    "State": "North Carolina",
    "County": "Yadkin"
  },
  {
    "FIPS": 37199,
    "State": "North Carolina",
    "County": "Yancey"
  },
  {
    "FIPS": 38001,
    "State": "North Dakota",
    "County": "Adams"
  },
  {
    "FIPS": 38003,
    "State": "North Dakota",
    "County": "Barnes"
  },
  {
    "FIPS": 38005,
    "State": "North Dakota",
    "County": "Benson"
  },
  {
    "FIPS": 38007,
    "State": "North Dakota",
    "County": "Billings"
  },
  {
    "FIPS": 38009,
    "State": "North Dakota",
    "County": "Bottineau"
  },
  {
    "FIPS": 38011,
    "State": "North Dakota",
    "County": "Bowman"
  },
  {
    "FIPS": 38013,
    "State": "North Dakota",
    "County": "Burke"
  },
  {
    "FIPS": 38015,
    "State": "North Dakota",
    "County": "Burleigh"
  },
  {
    "FIPS": 38017,
    "State": "North Dakota",
    "County": "Cass"
  },
  {
    "FIPS": 38019,
    "State": "North Dakota",
    "County": "Cavalier"
  },
  {
    "FIPS": 38021,
    "State": "North Dakota",
    "County": "Dickey"
  },
  {
    "FIPS": 38023,
    "State": "North Dakota",
    "County": "Divide"
  },
  {
    "FIPS": 38025,
    "State": "North Dakota",
    "County": "Dunn"
  },
  {
    "FIPS": 38027,
    "State": "North Dakota",
    "County": "Eddy"
  },
  {
    "FIPS": 38029,
    "State": "North Dakota",
    "County": "Emmons"
  },
  {
    "FIPS": 38031,
    "State": "North Dakota",
    "County": "Foster"
  },
  {
    "FIPS": 38033,
    "State": "North Dakota",
    "County": "Golden Valley"
  },
  {
    "FIPS": 38035,
    "State": "North Dakota",
    "County": "Grand Forks"
  },
  {
    "FIPS": 38037,
    "State": "North Dakota",
    "County": "Grant"
  },
  {
    "FIPS": 38039,
    "State": "North Dakota",
    "County": "Griggs"
  },
  {
    "FIPS": 38041,
    "State": "North Dakota",
    "County": "Hettinger"
  },
  {
    "FIPS": 38043,
    "State": "North Dakota",
    "County": "Kidder"
  },
  {
    "FIPS": 38045,
    "State": "North Dakota",
    "County": "LaMoure"
  },
  {
    "FIPS": 38047,
    "State": "North Dakota",
    "County": "Logan"
  },
  {
    "FIPS": 38049,
    "State": "North Dakota",
    "County": "McHenry"
  },
  {
    "FIPS": 38051,
    "State": "North Dakota",
    "County": "McIntosh"
  },
  {
    "FIPS": 38053,
    "State": "North Dakota",
    "County": "McKenzie"
  },
  {
    "FIPS": 38055,
    "State": "North Dakota",
    "County": "McLean"
  },
  {
    "FIPS": 38057,
    "State": "North Dakota",
    "County": "Mercer"
  },
  {
    "FIPS": 38059,
    "State": "North Dakota",
    "County": "Morton"
  },
  {
    "FIPS": 38061,
    "State": "North Dakota",
    "County": "Mountrail"
  },
  {
    "FIPS": 38063,
    "State": "North Dakota",
    "County": "Nelson"
  },
  {
    "FIPS": 38065,
    "State": "North Dakota",
    "County": "Oliver"
  },
  {
    "FIPS": 38067,
    "State": "North Dakota",
    "County": "Pembina"
  },
  {
    "FIPS": 38069,
    "State": "North Dakota",
    "County": "Pierce"
  },
  {
    "FIPS": 38071,
    "State": "North Dakota",
    "County": "Ramsey"
  },
  {
    "FIPS": 38073,
    "State": "North Dakota",
    "County": "Ransom"
  },
  {
    "FIPS": 38075,
    "State": "North Dakota",
    "County": "Renville"
  },
  {
    "FIPS": 38077,
    "State": "North Dakota",
    "County": "Richland"
  },
  {
    "FIPS": 38079,
    "State": "North Dakota",
    "County": "Rolette"
  },
  {
    "FIPS": 38081,
    "State": "North Dakota",
    "County": "Sargent"
  },
  {
    "FIPS": 38083,
    "State": "North Dakota",
    "County": "Sheridan"
  },
  {
    "FIPS": 38085,
    "State": "North Dakota",
    "County": "Sioux"
  },
  {
    "FIPS": 38087,
    "State": "North Dakota",
    "County": "Slope"
  },
  {
    "FIPS": 38089,
    "State": "North Dakota",
    "County": "Stark"
  },
  {
    "FIPS": 38091,
    "State": "North Dakota",
    "County": "Steele"
  },
  {
    "FIPS": 38093,
    "State": "North Dakota",
    "County": "Stutsman"
  },
  {
    "FIPS": 38095,
    "State": "North Dakota",
    "County": "Towner"
  },
  {
    "FIPS": 38097,
    "State": "North Dakota",
    "County": "Traill"
  },
  {
    "FIPS": 38099,
    "State": "North Dakota",
    "County": "Walsh"
  },
  {
    "FIPS": 38101,
    "State": "North Dakota",
    "County": "Ward"
  },
  {
    "FIPS": 38103,
    "State": "North Dakota",
    "County": "Wells"
  },
  {
    "FIPS": 38105,
    "State": "North Dakota",
    "County": "Williams"
  },
  {
    "FIPS": 39001,
    "State": "Ohio",
    "County": "Adams"
  },
  {
    "FIPS": 39003,
    "State": "Ohio",
    "County": "Allen"
  },
  {
    "FIPS": 39005,
    "State": "Ohio",
    "County": "Ashland"
  },
  {
    "FIPS": 39007,
    "State": "Ohio",
    "County": "Ashtabula"
  },
  {
    "FIPS": 39009,
    "State": "Ohio",
    "County": "Athens"
  },
  {
    "FIPS": 39011,
    "State": "Ohio",
    "County": "Auglaize"
  },
  {
    "FIPS": 39013,
    "State": "Ohio",
    "County": "Belmont"
  },
  {
    "FIPS": 39015,
    "State": "Ohio",
    "County": "Brown"
  },
  {
    "FIPS": 39017,
    "State": "Ohio",
    "County": "Butler"
  },
  {
    "FIPS": 39019,
    "State": "Ohio",
    "County": "Carroll"
  },
  {
    "FIPS": 39021,
    "State": "Ohio",
    "County": "Champaign"
  },
  {
    "FIPS": 39023,
    "State": "Ohio",
    "County": "Clark"
  },
  {
    "FIPS": 39025,
    "State": "Ohio",
    "County": "Clermont"
  },
  {
    "FIPS": 39027,
    "State": "Ohio",
    "County": "Clinton"
  },
  {
    "FIPS": 39029,
    "State": "Ohio",
    "County": "Columbiana"
  },
  {
    "FIPS": 39031,
    "State": "Ohio",
    "County": "Coshocton"
  },
  {
    "FIPS": 39033,
    "State": "Ohio",
    "County": "Crawford"
  },
  {
    "FIPS": 39035,
    "State": "Ohio",
    "County": "Cuyahoga"
  },
  {
    "FIPS": 39037,
    "State": "Ohio",
    "County": "Darke"
  },
  {
    "FIPS": 39039,
    "State": "Ohio",
    "County": "Defiance"
  },
  {
    "FIPS": 39041,
    "State": "Ohio",
    "County": "Delaware"
  },
  {
    "FIPS": 39043,
    "State": "Ohio",
    "County": "Erie"
  },
  {
    "FIPS": 39045,
    "State": "Ohio",
    "County": "Fairfield"
  },
  {
    "FIPS": 39047,
    "State": "Ohio",
    "County": "Fayette"
  },
  {
    "FIPS": 39049,
    "State": "Ohio",
    "County": "Franklin"
  },
  {
    "FIPS": 39051,
    "State": "Ohio",
    "County": "Fulton"
  },
  {
    "FIPS": 39053,
    "State": "Ohio",
    "County": "Gallia"
  },
  {
    "FIPS": 39055,
    "State": "Ohio",
    "County": "Geauga"
  },
  {
    "FIPS": 39057,
    "State": "Ohio",
    "County": "Greene"
  },
  {
    "FIPS": 39059,
    "State": "Ohio",
    "County": "Guernsey"
  },
  {
    "FIPS": 39061,
    "State": "Ohio",
    "County": "Hamilton"
  },
  {
    "FIPS": 39063,
    "State": "Ohio",
    "County": "Hancock"
  },
  {
    "FIPS": 39065,
    "State": "Ohio",
    "County": "Hardin"
  },
  {
    "FIPS": 39067,
    "State": "Ohio",
    "County": "Harrison"
  },
  {
    "FIPS": 39069,
    "State": "Ohio",
    "County": "Henry"
  },
  {
    "FIPS": 39071,
    "State": "Ohio",
    "County": "Highland"
  },
  {
    "FIPS": 39073,
    "State": "Ohio",
    "County": "Hocking"
  },
  {
    "FIPS": 39075,
    "State": "Ohio",
    "County": "Holmes"
  },
  {
    "FIPS": 39077,
    "State": "Ohio",
    "County": "Huron"
  },
  {
    "FIPS": 39079,
    "State": "Ohio",
    "County": "Jackson"
  },
  {
    "FIPS": 39081,
    "State": "Ohio",
    "County": "Jefferson"
  },
  {
    "FIPS": 39083,
    "State": "Ohio",
    "County": "Knox"
  },
  {
    "FIPS": 39085,
    "State": "Ohio",
    "County": "Lake"
  },
  {
    "FIPS": 39087,
    "State": "Ohio",
    "County": "Lawrence"
  },
  {
    "FIPS": 39089,
    "State": "Ohio",
    "County": "Licking"
  },
  {
    "FIPS": 39091,
    "State": "Ohio",
    "County": "Logan"
  },
  {
    "FIPS": 39093,
    "State": "Ohio",
    "County": "Lorain"
  },
  {
    "FIPS": 39095,
    "State": "Ohio",
    "County": "Lucas"
  },
  {
    "FIPS": 39097,
    "State": "Ohio",
    "County": "Madison"
  },
  {
    "FIPS": 39099,
    "State": "Ohio",
    "County": "Mahoning"
  },
  {
    "FIPS": 39101,
    "State": "Ohio",
    "County": "Marion"
  },
  {
    "FIPS": 39103,
    "State": "Ohio",
    "County": "Medina"
  },
  {
    "FIPS": 39105,
    "State": "Ohio",
    "County": "Meigs"
  },
  {
    "FIPS": 39107,
    "State": "Ohio",
    "County": "Mercer"
  },
  {
    "FIPS": 39109,
    "State": "Ohio",
    "County": "Miami"
  },
  {
    "FIPS": 39111,
    "State": "Ohio",
    "County": "Monroe"
  },
  {
    "FIPS": 39113,
    "State": "Ohio",
    "County": "Montgomery"
  },
  {
    "FIPS": 39115,
    "State": "Ohio",
    "County": "Morgan"
  },
  {
    "FIPS": 39117,
    "State": "Ohio",
    "County": "Morrow"
  },
  {
    "FIPS": 39119,
    "State": "Ohio",
    "County": "Muskingum"
  },
  {
    "FIPS": 39121,
    "State": "Ohio",
    "County": "Noble"
  },
  {
    "FIPS": 39123,
    "State": "Ohio",
    "County": "Ottawa"
  },
  {
    "FIPS": 39125,
    "State": "Ohio",
    "County": "Paulding"
  },
  {
    "FIPS": 39127,
    "State": "Ohio",
    "County": "Perry"
  },
  {
    "FIPS": 39129,
    "State": "Ohio",
    "County": "Pickaway"
  },
  {
    "FIPS": 39131,
    "State": "Ohio",
    "County": "Pike"
  },
  {
    "FIPS": 39133,
    "State": "Ohio",
    "County": "Portage"
  },
  {
    "FIPS": 39135,
    "State": "Ohio",
    "County": "Preble"
  },
  {
    "FIPS": 39137,
    "State": "Ohio",
    "County": "Putnam"
  },
  {
    "FIPS": 39139,
    "State": "Ohio",
    "County": "Richland"
  },
  {
    "FIPS": 39141,
    "State": "Ohio",
    "County": "Ross"
  },
  {
    "FIPS": 39143,
    "State": "Ohio",
    "County": "Sandusky"
  },
  {
    "FIPS": 39145,
    "State": "Ohio",
    "County": "Scioto"
  },
  {
    "FIPS": 39147,
    "State": "Ohio",
    "County": "Seneca"
  },
  {
    "FIPS": 39149,
    "State": "Ohio",
    "County": "Shelby"
  },
  {
    "FIPS": 39151,
    "State": "Ohio",
    "County": "Stark"
  },
  {
    "FIPS": 39153,
    "State": "Ohio",
    "County": "Summit"
  },
  {
    "FIPS": 39155,
    "State": "Ohio",
    "County": "Trumbull"
  },
  {
    "FIPS": 39157,
    "State": "Ohio",
    "County": "Tuscarawas"
  },
  {
    "FIPS": 39159,
    "State": "Ohio",
    "County": "Union"
  },
  {
    "FIPS": 39161,
    "State": "Ohio",
    "County": "Van Wert"
  },
  {
    "FIPS": 39163,
    "State": "Ohio",
    "County": "Vinton"
  },
  {
    "FIPS": 39165,
    "State": "Ohio",
    "County": "Warren"
  },
  {
    "FIPS": 39167,
    "State": "Ohio",
    "County": "Washington"
  },
  {
    "FIPS": 39169,
    "State": "Ohio",
    "County": "Wayne"
  },
  {
    "FIPS": 39171,
    "State": "Ohio",
    "County": "Williams"
  },
  {
    "FIPS": 39173,
    "State": "Ohio",
    "County": "Wood"
  },
  {
    "FIPS": 39175,
    "State": "Ohio",
    "County": "Wyandot"
  },
  {
    "FIPS": 40001,
    "State": "Oklahoma",
    "County": "Adair"
  },
  {
    "FIPS": 40003,
    "State": "Oklahoma",
    "County": "Alfalfa"
  },
  {
    "FIPS": 40005,
    "State": "Oklahoma",
    "County": "Atoka"
  },
  {
    "FIPS": 40007,
    "State": "Oklahoma",
    "County": "Beaver"
  },
  {
    "FIPS": 40009,
    "State": "Oklahoma",
    "County": "Beckham"
  },
  {
    "FIPS": 40011,
    "State": "Oklahoma",
    "County": "Blaine"
  },
  {
    "FIPS": 40013,
    "State": "Oklahoma",
    "County": "Bryan"
  },
  {
    "FIPS": 40015,
    "State": "Oklahoma",
    "County": "Caddo"
  },
  {
    "FIPS": 40017,
    "State": "Oklahoma",
    "County": "Canadian"
  },
  {
    "FIPS": 40019,
    "State": "Oklahoma",
    "County": "Carter"
  },
  {
    "FIPS": 40021,
    "State": "Oklahoma",
    "County": "Cherokee"
  },
  {
    "FIPS": 40023,
    "State": "Oklahoma",
    "County": "Choctaw"
  },
  {
    "FIPS": 40025,
    "State": "Oklahoma",
    "County": "Cimarron"
  },
  {
    "FIPS": 40027,
    "State": "Oklahoma",
    "County": "Cleveland"
  },
  {
    "FIPS": 40029,
    "State": "Oklahoma",
    "County": "Coal"
  },
  {
    "FIPS": 40031,
    "State": "Oklahoma",
    "County": "Comanche"
  },
  {
    "FIPS": 40033,
    "State": "Oklahoma",
    "County": "Cotton"
  },
  {
    "FIPS": 40035,
    "State": "Oklahoma",
    "County": "Craig"
  },
  {
    "FIPS": 40037,
    "State": "Oklahoma",
    "County": "Creek"
  },
  {
    "FIPS": 40039,
    "State": "Oklahoma",
    "County": "Custer"
  },
  {
    "FIPS": 40041,
    "State": "Oklahoma",
    "County": "Delaware"
  },
  {
    "FIPS": 40043,
    "State": "Oklahoma",
    "County": "Dewey"
  },
  {
    "FIPS": 40045,
    "State": "Oklahoma",
    "County": "Ellis"
  },
  {
    "FIPS": 40047,
    "State": "Oklahoma",
    "County": "Garfield"
  },
  {
    "FIPS": 40049,
    "State": "Oklahoma",
    "County": "Garvin"
  },
  {
    "FIPS": 40051,
    "State": "Oklahoma",
    "County": "Grady"
  },
  {
    "FIPS": 40053,
    "State": "Oklahoma",
    "County": "Grant"
  },
  {
    "FIPS": 40055,
    "State": "Oklahoma",
    "County": "Greer"
  },
  {
    "FIPS": 40057,
    "State": "Oklahoma",
    "County": "Harmon"
  },
  {
    "FIPS": 40059,
    "State": "Oklahoma",
    "County": "Harper"
  },
  {
    "FIPS": 40061,
    "State": "Oklahoma",
    "County": "Haskell"
  },
  {
    "FIPS": 40063,
    "State": "Oklahoma",
    "County": "Hughes"
  },
  {
    "FIPS": 40065,
    "State": "Oklahoma",
    "County": "Jackson"
  },
  {
    "FIPS": 40067,
    "State": "Oklahoma",
    "County": "Jefferson"
  },
  {
    "FIPS": 40069,
    "State": "Oklahoma",
    "County": "Johnston"
  },
  {
    "FIPS": 40071,
    "State": "Oklahoma",
    "County": "Kay"
  },
  {
    "FIPS": 40073,
    "State": "Oklahoma",
    "County": "Kingfisher"
  },
  {
    "FIPS": 40075,
    "State": "Oklahoma",
    "County": "Kiowa"
  },
  {
    "FIPS": 40077,
    "State": "Oklahoma",
    "County": "Latimer"
  },
  {
    "FIPS": 40079,
    "State": "Oklahoma",
    "County": "Le Flore"
  },
  {
    "FIPS": 40081,
    "State": "Oklahoma",
    "County": "Lincoln"
  },
  {
    "FIPS": 40083,
    "State": "Oklahoma",
    "County": "Logan"
  },
  {
    "FIPS": 40085,
    "State": "Oklahoma",
    "County": "Love"
  },
  {
    "FIPS": 40087,
    "State": "Oklahoma",
    "County": "McClain"
  },
  {
    "FIPS": 40089,
    "State": "Oklahoma",
    "County": "McCurtain"
  },
  {
    "FIPS": 40091,
    "State": "Oklahoma",
    "County": "McIntosh"
  },
  {
    "FIPS": 40093,
    "State": "Oklahoma",
    "County": "Major"
  },
  {
    "FIPS": 40095,
    "State": "Oklahoma",
    "County": "Marshall"
  },
  {
    "FIPS": 40097,
    "State": "Oklahoma",
    "County": "Mayes"
  },
  {
    "FIPS": 40099,
    "State": "Oklahoma",
    "County": "Murray"
  },
  {
    "FIPS": 40101,
    "State": "Oklahoma",
    "County": "Muskogee"
  },
  {
    "FIPS": 40103,
    "State": "Oklahoma",
    "County": "Noble"
  },
  {
    "FIPS": 40105,
    "State": "Oklahoma",
    "County": "Nowata"
  },
  {
    "FIPS": 40107,
    "State": "Oklahoma",
    "County": "Okfuskee"
  },
  {
    "FIPS": 40109,
    "State": "Oklahoma",
    "County": "Oklahoma"
  },
  {
    "FIPS": 40111,
    "State": "Oklahoma",
    "County": "Okmulgee"
  },
  {
    "FIPS": 40113,
    "State": "Oklahoma",
    "County": "Osage"
  },
  {
    "FIPS": 40115,
    "State": "Oklahoma",
    "County": "Ottawa"
  },
  {
    "FIPS": 40117,
    "State": "Oklahoma",
    "County": "Pawnee"
  },
  {
    "FIPS": 40119,
    "State": "Oklahoma",
    "County": "Payne"
  },
  {
    "FIPS": 40121,
    "State": "Oklahoma",
    "County": "Pittsburg"
  },
  {
    "FIPS": 40123,
    "State": "Oklahoma",
    "County": "Pontotoc"
  },
  {
    "FIPS": 40125,
    "State": "Oklahoma",
    "County": "Pottawatomie"
  },
  {
    "FIPS": 40127,
    "State": "Oklahoma",
    "County": "Pushmataha"
  },
  {
    "FIPS": 40129,
    "State": "Oklahoma",
    "County": "Roger Mills"
  },
  {
    "FIPS": 40131,
    "State": "Oklahoma",
    "County": "Rogers"
  },
  {
    "FIPS": 40133,
    "State": "Oklahoma",
    "County": "Seminole"
  },
  {
    "FIPS": 40135,
    "State": "Oklahoma",
    "County": "Sequoyah"
  },
  {
    "FIPS": 40137,
    "State": "Oklahoma",
    "County": "Stephens"
  },
  {
    "FIPS": 40139,
    "State": "Oklahoma",
    "County": "Texas"
  },
  {
    "FIPS": 40141,
    "State": "Oklahoma",
    "County": "Tillman"
  },
  {
    "FIPS": 40143,
    "State": "Oklahoma",
    "County": "Tulsa"
  },
  {
    "FIPS": 40145,
    "State": "Oklahoma",
    "County": "Wagoner"
  },
  {
    "FIPS": 40147,
    "State": "Oklahoma",
    "County": "Washington"
  },
  {
    "FIPS": 40149,
    "State": "Oklahoma",
    "County": "Washita"
  },
  {
    "FIPS": 40151,
    "State": "Oklahoma",
    "County": "Woods"
  },
  {
    "FIPS": 40153,
    "State": "Oklahoma",
    "County": "Woodward"
  },
  {
    "FIPS": 41001,
    "State": "Oregon",
    "County": "Baker"
  },
  {
    "FIPS": 41003,
    "State": "Oregon",
    "County": "Benton"
  },
  {
    "FIPS": 41005,
    "State": "Oregon",
    "County": "Clackamas"
  },
  {
    "FIPS": 41007,
    "State": "Oregon",
    "County": "Clatsop"
  },
  {
    "FIPS": 41009,
    "State": "Oregon",
    "County": "Columbia"
  },
  {
    "FIPS": 41011,
    "State": "Oregon",
    "County": "Coos"
  },
  {
    "FIPS": 41013,
    "State": "Oregon",
    "County": "Crook"
  },
  {
    "FIPS": 41015,
    "State": "Oregon",
    "County": "Curry"
  },
  {
    "FIPS": 41017,
    "State": "Oregon",
    "County": "Deschutes"
  },
  {
    "FIPS": 41019,
    "State": "Oregon",
    "County": "Douglas"
  },
  {
    "FIPS": 41021,
    "State": "Oregon",
    "County": "Gilliam"
  },
  {
    "FIPS": 41023,
    "State": "Oregon",
    "County": "Grant"
  },
  {
    "FIPS": 41025,
    "State": "Oregon",
    "County": "Harney"
  },
  {
    "FIPS": 41027,
    "State": "Oregon",
    "County": "Hood River"
  },
  {
    "FIPS": 41029,
    "State": "Oregon",
    "County": "Jackson"
  },
  {
    "FIPS": 41031,
    "State": "Oregon",
    "County": "Jefferson"
  },
  {
    "FIPS": 41033,
    "State": "Oregon",
    "County": "Josephine"
  },
  {
    "FIPS": 41035,
    "State": "Oregon",
    "County": "Klamath"
  },
  {
    "FIPS": 41037,
    "State": "Oregon",
    "County": "Lake"
  },
  {
    "FIPS": 41039,
    "State": "Oregon",
    "County": "Lane"
  },
  {
    "FIPS": 41041,
    "State": "Oregon",
    "County": "Lincoln"
  },
  {
    "FIPS": 41043,
    "State": "Oregon",
    "County": "Linn"
  },
  {
    "FIPS": 41045,
    "State": "Oregon",
    "County": "Malheur"
  },
  {
    "FIPS": 41047,
    "State": "Oregon",
    "County": "Marion"
  },
  {
    "FIPS": 41049,
    "State": "Oregon",
    "County": "Morrow"
  },
  {
    "FIPS": 41051,
    "State": "Oregon",
    "County": "Multnomah"
  },
  {
    "FIPS": 41053,
    "State": "Oregon",
    "County": "Polk"
  },
  {
    "FIPS": 41055,
    "State": "Oregon",
    "County": "Sherman"
  },
  {
    "FIPS": 41057,
    "State": "Oregon",
    "County": "Tillamook"
  },
  {
    "FIPS": 41059,
    "State": "Oregon",
    "County": "Umatilla"
  },
  {
    "FIPS": 41061,
    "State": "Oregon",
    "County": "Union"
  },
  {
    "FIPS": 41063,
    "State": "Oregon",
    "County": "Wallowa"
  },
  {
    "FIPS": 41065,
    "State": "Oregon",
    "County": "Wasco"
  },
  {
    "FIPS": 41067,
    "State": "Oregon",
    "County": "Washington"
  },
  {
    "FIPS": 41069,
    "State": "Oregon",
    "County": "Wheeler"
  },
  {
    "FIPS": 41071,
    "State": "Oregon",
    "County": "Yamhill"
  },
  {
    "FIPS": 42001,
    "State": "Pennsylvania",
    "County": "Adams"
  },
  {
    "FIPS": 42003,
    "State": "Pennsylvania",
    "County": "Allegheny"
  },
  {
    "FIPS": 42005,
    "State": "Pennsylvania",
    "County": "Armstrong"
  },
  {
    "FIPS": 42007,
    "State": "Pennsylvania",
    "County": "Beaver"
  },
  {
    "FIPS": 42009,
    "State": "Pennsylvania",
    "County": "Bedford"
  },
  {
    "FIPS": 42011,
    "State": "Pennsylvania",
    "County": "Berks"
  },
  {
    "FIPS": 42013,
    "State": "Pennsylvania",
    "County": "Blair"
  },
  {
    "FIPS": 42015,
    "State": "Pennsylvania",
    "County": "Bradford"
  },
  {
    "FIPS": 42017,
    "State": "Pennsylvania",
    "County": "Bucks"
  },
  {
    "FIPS": 42019,
    "State": "Pennsylvania",
    "County": "Butler"
  },
  {
    "FIPS": 42021,
    "State": "Pennsylvania",
    "County": "Cambria"
  },
  {
    "FIPS": 42023,
    "State": "Pennsylvania",
    "County": "Cameron"
  },
  {
    "FIPS": 42025,
    "State": "Pennsylvania",
    "County": "Carbon"
  },
  {
    "FIPS": 42027,
    "State": "Pennsylvania",
    "County": "Centre"
  },
  {
    "FIPS": 42029,
    "State": "Pennsylvania",
    "County": "Chester"
  },
  {
    "FIPS": 42031,
    "State": "Pennsylvania",
    "County": "Clarion"
  },
  {
    "FIPS": 42033,
    "State": "Pennsylvania",
    "County": "Clearfield"
  },
  {
    "FIPS": 42035,
    "State": "Pennsylvania",
    "County": "Clinton"
  },
  {
    "FIPS": 42037,
    "State": "Pennsylvania",
    "County": "Columbia"
  },
  {
    "FIPS": 42039,
    "State": "Pennsylvania",
    "County": "Crawford"
  },
  {
    "FIPS": 42041,
    "State": "Pennsylvania",
    "County": "Cumberland"
  },
  {
    "FIPS": 42043,
    "State": "Pennsylvania",
    "County": "Dauphin"
  },
  {
    "FIPS": 42045,
    "State": "Pennsylvania",
    "County": "Delaware"
  },
  {
    "FIPS": 42047,
    "State": "Pennsylvania",
    "County": "Elk"
  },
  {
    "FIPS": 42049,
    "State": "Pennsylvania",
    "County": "Erie"
  },
  {
    "FIPS": 42051,
    "State": "Pennsylvania",
    "County": "Fayette"
  },
  {
    "FIPS": 42053,
    "State": "Pennsylvania",
    "County": "Forest"
  },
  {
    "FIPS": 42055,
    "State": "Pennsylvania",
    "County": "Franklin"
  },
  {
    "FIPS": 42057,
    "State": "Pennsylvania",
    "County": "Fulton"
  },
  {
    "FIPS": 42059,
    "State": "Pennsylvania",
    "County": "Greene"
  },
  {
    "FIPS": 42061,
    "State": "Pennsylvania",
    "County": "Huntingdon"
  },
  {
    "FIPS": 42063,
    "State": "Pennsylvania",
    "County": "Indiana"
  },
  {
    "FIPS": 42065,
    "State": "Pennsylvania",
    "County": "Jefferson"
  },
  {
    "FIPS": 42067,
    "State": "Pennsylvania",
    "County": "Juniata"
  },
  {
    "FIPS": 42069,
    "State": "Pennsylvania",
    "County": "Lackawanna"
  },
  {
    "FIPS": 42071,
    "State": "Pennsylvania",
    "County": "Lancaster"
  },
  {
    "FIPS": 42073,
    "State": "Pennsylvania",
    "County": "Lawrence"
  },
  {
    "FIPS": 42075,
    "State": "Pennsylvania",
    "County": "Lebanon"
  },
  {
    "FIPS": 42077,
    "State": "Pennsylvania",
    "County": "Lehigh"
  },
  {
    "FIPS": 42079,
    "State": "Pennsylvania",
    "County": "Luzerne"
  },
  {
    "FIPS": 42081,
    "State": "Pennsylvania",
    "County": "Lycoming"
  },
  {
    "FIPS": 42083,
    "State": "Pennsylvania",
    "County": "McKean"
  },
  {
    "FIPS": 42085,
    "State": "Pennsylvania",
    "County": "Mercer"
  },
  {
    "FIPS": 42087,
    "State": "Pennsylvania",
    "County": "Mifflin"
  },
  {
    "FIPS": 42089,
    "State": "Pennsylvania",
    "County": "Monroe"
  },
  {
    "FIPS": 42091,
    "State": "Pennsylvania",
    "County": "Montgomery"
  },
  {
    "FIPS": 42093,
    "State": "Pennsylvania",
    "County": "Montour"
  },
  {
    "FIPS": 42095,
    "State": "Pennsylvania",
    "County": "Northampton"
  },
  {
    "FIPS": 42097,
    "State": "Pennsylvania",
    "County": "Northumberland"
  },
  {
    "FIPS": 42099,
    "State": "Pennsylvania",
    "County": "Perry"
  },
  {
    "FIPS": 42101,
    "State": "Pennsylvania",
    "County": "Philadelphia"
  },
  {
    "FIPS": 42103,
    "State": "Pennsylvania",
    "County": "Pike"
  },
  {
    "FIPS": 42105,
    "State": "Pennsylvania",
    "County": "Potter"
  },
  {
    "FIPS": 42107,
    "State": "Pennsylvania",
    "County": "Schuylkill"
  },
  {
    "FIPS": 42109,
    "State": "Pennsylvania",
    "County": "Snyder"
  },
  {
    "FIPS": 42111,
    "State": "Pennsylvania",
    "County": "Somerset"
  },
  {
    "FIPS": 42113,
    "State": "Pennsylvania",
    "County": "Sullivan"
  },
  {
    "FIPS": 42115,
    "State": "Pennsylvania",
    "County": "Susquehanna"
  },
  {
    "FIPS": 42117,
    "State": "Pennsylvania",
    "County": "Tioga"
  },
  {
    "FIPS": 42119,
    "State": "Pennsylvania",
    "County": "Union"
  },
  {
    "FIPS": 42121,
    "State": "Pennsylvania",
    "County": "Venango"
  },
  {
    "FIPS": 42123,
    "State": "Pennsylvania",
    "County": "Warren"
  },
  {
    "FIPS": 42125,
    "State": "Pennsylvania",
    "County": "Washington"
  },
  {
    "FIPS": 42127,
    "State": "Pennsylvania",
    "County": "Wayne"
  },
  {
    "FIPS": 42129,
    "State": "Pennsylvania",
    "County": "Westmoreland"
  },
  {
    "FIPS": 42131,
    "State": "Pennsylvania",
    "County": "Wyoming"
  },
  {
    "FIPS": 42133,
    "State": "Pennsylvania",
    "County": "York"
  },
  {
    "FIPS": 44001,
    "State": "Rhode Island",
    "County": "Bristol"
  },
  {
    "FIPS": 44003,
    "State": "Rhode Island",
    "County": "Kent"
  },
  {
    "FIPS": 44005,
    "State": "Rhode Island",
    "County": "Newport"
  },
  {
    "FIPS": 44007,
    "State": "Rhode Island",
    "County": "Providence"
  },
  {
    "FIPS": 44009,
    "State": "Rhode Island",
    "County": "Washington"
  },
  {
    "FIPS": 45001,
    "State": "South Carolina",
    "County": "Abbeville"
  },
  {
    "FIPS": 45003,
    "State": "South Carolina",
    "County": "Aiken"
  },
  {
    "FIPS": 45005,
    "State": "South Carolina",
    "County": "Allendale"
  },
  {
    "FIPS": 45007,
    "State": "South Carolina",
    "County": "Anderson"
  },
  {
    "FIPS": 45009,
    "State": "South Carolina",
    "County": "Bamberg"
  },
  {
    "FIPS": 45011,
    "State": "South Carolina",
    "County": "Barnwell"
  },
  {
    "FIPS": 45013,
    "State": "South Carolina",
    "County": "Beaufort"
  },
  {
    "FIPS": 45015,
    "State": "South Carolina",
    "County": "Berkeley"
  },
  {
    "FIPS": 45017,
    "State": "South Carolina",
    "County": "Calhoun"
  },
  {
    "FIPS": 45019,
    "State": "South Carolina",
    "County": "Charleston"
  },
  {
    "FIPS": 45021,
    "State": "South Carolina",
    "County": "Cherokee"
  },
  {
    "FIPS": 45023,
    "State": "South Carolina",
    "County": "Chester"
  },
  {
    "FIPS": 45025,
    "State": "South Carolina",
    "County": "Chesterfield"
  },
  {
    "FIPS": 45027,
    "State": "South Carolina",
    "County": "Clarendon"
  },
  {
    "FIPS": 45029,
    "State": "South Carolina",
    "County": "Colleton"
  },
  {
    "FIPS": 45031,
    "State": "South Carolina",
    "County": "Darlington"
  },
  {
    "FIPS": 45033,
    "State": "South Carolina",
    "County": "Dillon"
  },
  {
    "FIPS": 45035,
    "State": "South Carolina",
    "County": "Dorchester"
  },
  {
    "FIPS": 45037,
    "State": "South Carolina",
    "County": "Edgefield"
  },
  {
    "FIPS": 45039,
    "State": "South Carolina",
    "County": "Fairfield"
  },
  {
    "FIPS": 45041,
    "State": "South Carolina",
    "County": "Florence"
  },
  {
    "FIPS": 45043,
    "State": "South Carolina",
    "County": "Georgetown"
  },
  {
    "FIPS": 45045,
    "State": "South Carolina",
    "County": "Greenville"
  },
  {
    "FIPS": 45047,
    "State": "South Carolina",
    "County": "Greenwood"
  },
  {
    "FIPS": 45049,
    "State": "South Carolina",
    "County": "Hampton"
  },
  {
    "FIPS": 45051,
    "State": "South Carolina",
    "County": "Horry"
  },
  {
    "FIPS": 45053,
    "State": "South Carolina",
    "County": "Jasper"
  },
  {
    "FIPS": 45055,
    "State": "South Carolina",
    "County": "Kershaw"
  },
  {
    "FIPS": 45057,
    "State": "South Carolina",
    "County": "Lancaster"
  },
  {
    "FIPS": 45059,
    "State": "South Carolina",
    "County": "Laurens"
  },
  {
    "FIPS": 45061,
    "State": "South Carolina",
    "County": "Lee"
  },
  {
    "FIPS": 45063,
    "State": "South Carolina",
    "County": "Lexington"
  },
  {
    "FIPS": 45065,
    "State": "South Carolina",
    "County": "McCormick"
  },
  {
    "FIPS": 45067,
    "State": "South Carolina",
    "County": "Marion"
  },
  {
    "FIPS": 45069,
    "State": "South Carolina",
    "County": "Marlboro"
  },
  {
    "FIPS": 45071,
    "State": "South Carolina",
    "County": "Newberry"
  },
  {
    "FIPS": 45073,
    "State": "South Carolina",
    "County": "Oconee"
  },
  {
    "FIPS": 45075,
    "State": "South Carolina",
    "County": "Orangeburg"
  },
  {
    "FIPS": 45077,
    "State": "South Carolina",
    "County": "Pickens"
  },
  {
    "FIPS": 45079,
    "State": "South Carolina",
    "County": "Richland"
  },
  {
    "FIPS": 45081,
    "State": "South Carolina",
    "County": "Saluda"
  },
  {
    "FIPS": 45083,
    "State": "South Carolina",
    "County": "Spartanburg"
  },
  {
    "FIPS": 45085,
    "State": "South Carolina",
    "County": "Sumter"
  },
  {
    "FIPS": 45087,
    "State": "South Carolina",
    "County": "Union"
  },
  {
    "FIPS": 45089,
    "State": "South Carolina",
    "County": "Williamsburg"
  },
  {
    "FIPS": 45091,
    "State": "South Carolina",
    "County": "York"
  },
  {
    "FIPS": 46003,
    "State": "South Dakota",
    "County": "Aurora"
  },
  {
    "FIPS": 46005,
    "State": "South Dakota",
    "County": "Beadle"
  },
  {
    "FIPS": 46007,
    "State": "South Dakota",
    "County": "Bennett"
  },
  {
    "FIPS": 46009,
    "State": "South Dakota",
    "County": "Bon Homme"
  },
  {
    "FIPS": 46011,
    "State": "South Dakota",
    "County": "Brookings"
  },
  {
    "FIPS": 46013,
    "State": "South Dakota",
    "County": "Brown"
  },
  {
    "FIPS": 46015,
    "State": "South Dakota",
    "County": "Brule"
  },
  {
    "FIPS": 46017,
    "State": "South Dakota",
    "County": "Buffalo"
  },
  {
    "FIPS": 46019,
    "State": "South Dakota",
    "County": "Butte"
  },
  {
    "FIPS": 46021,
    "State": "South Dakota",
    "County": "Campbell"
  },
  {
    "FIPS": 46023,
    "State": "South Dakota",
    "County": "Charles Mix"
  },
  {
    "FIPS": 46025,
    "State": "South Dakota",
    "County": "Clark"
  },
  {
    "FIPS": 46027,
    "State": "South Dakota",
    "County": "Clay"
  },
  {
    "FIPS": 46029,
    "State": "South Dakota",
    "County": "Codington"
  },
  {
    "FIPS": 46031,
    "State": "South Dakota",
    "County": "Corson"
  },
  {
    "FIPS": 46033,
    "State": "South Dakota",
    "County": "Custer"
  },
  {
    "FIPS": 46035,
    "State": "South Dakota",
    "County": "Davison"
  },
  {
    "FIPS": 46037,
    "State": "South Dakota",
    "County": "Day"
  },
  {
    "FIPS": 46039,
    "State": "South Dakota",
    "County": "Deuel"
  },
  {
    "FIPS": 46041,
    "State": "South Dakota",
    "County": "Dewey"
  },
  {
    "FIPS": 46043,
    "State": "South Dakota",
    "County": "Douglas"
  },
  {
    "FIPS": 46045,
    "State": "South Dakota",
    "County": "Edmunds"
  },
  {
    "FIPS": 46047,
    "State": "South Dakota",
    "County": "Fall River"
  },
  {
    "FIPS": 46049,
    "State": "South Dakota",
    "County": "Faulk"
  },
  {
    "FIPS": 46051,
    "State": "South Dakota",
    "County": "Grant"
  },
  {
    "FIPS": 46053,
    "State": "South Dakota",
    "County": "Gregory"
  },
  {
    "FIPS": 46055,
    "State": "South Dakota",
    "County": "Haakon"
  },
  {
    "FIPS": 46057,
    "State": "South Dakota",
    "County": "Hamlin"
  },
  {
    "FIPS": 46059,
    "State": "South Dakota",
    "County": "Hand"
  },
  {
    "FIPS": 46061,
    "State": "South Dakota",
    "County": "Hanson"
  },
  {
    "FIPS": 46063,
    "State": "South Dakota",
    "County": "Harding"
  },
  {
    "FIPS": 46065,
    "State": "South Dakota",
    "County": "Hughes"
  },
  {
    "FIPS": 46067,
    "State": "South Dakota",
    "County": "Hutchinson"
  },
  {
    "FIPS": 46069,
    "State": "South Dakota",
    "County": "Hyde"
  },
  {
    "FIPS": 46071,
    "State": "South Dakota",
    "County": "Jackson"
  },
  {
    "FIPS": 46073,
    "State": "South Dakota",
    "County": "Jerauld"
  },
  {
    "FIPS": 46075,
    "State": "South Dakota",
    "County": "Jones"
  },
  {
    "FIPS": 46077,
    "State": "South Dakota",
    "County": "Kingsbury"
  },
  {
    "FIPS": 46079,
    "State": "South Dakota",
    "County": "Lake"
  },
  {
    "FIPS": 46081,
    "State": "South Dakota",
    "County": "Lawrence"
  },
  {
    "FIPS": 46083,
    "State": "South Dakota",
    "County": "Lincoln"
  },
  {
    "FIPS": 46085,
    "State": "South Dakota",
    "County": "Lyman"
  },
  {
    "FIPS": 46087,
    "State": "South Dakota",
    "County": "McCook"
  },
  {
    "FIPS": 46089,
    "State": "South Dakota",
    "County": "McPherson"
  },
  {
    "FIPS": 46091,
    "State": "South Dakota",
    "County": "Marshall"
  },
  {
    "FIPS": 46093,
    "State": "South Dakota",
    "County": "Meade"
  },
  {
    "FIPS": 46095,
    "State": "South Dakota",
    "County": "Mellette"
  },
  {
    "FIPS": 46097,
    "State": "South Dakota",
    "County": "Miner"
  },
  {
    "FIPS": 46099,
    "State": "South Dakota",
    "County": "Minnehaha"
  },
  {
    "FIPS": 46101,
    "State": "South Dakota",
    "County": "Moody"
  },
  {
    "FIPS": 46103,
    "State": "South Dakota",
    "County": "Pennington"
  },
  {
    "FIPS": 46105,
    "State": "South Dakota",
    "County": "Perkins"
  },
  {
    "FIPS": 46107,
    "State": "South Dakota",
    "County": "Potter"
  },
  {
    "FIPS": 46109,
    "State": "South Dakota",
    "County": "Roberts"
  },
  {
    "FIPS": 46111,
    "State": "South Dakota",
    "County": "Sanborn"
  },
  {
    "FIPS": 46113,
    "State": "South Dakota",
    "County": "Shannon"
  },
  {
    "FIPS": 46115,
    "State": "South Dakota",
    "County": "Spink"
  },
  {
    "FIPS": 46117,
    "State": "South Dakota",
    "County": "Stanley"
  },
  {
    "FIPS": 46119,
    "State": "South Dakota",
    "County": "Sully"
  },
  {
    "FIPS": 46121,
    "State": "South Dakota",
    "County": "Todd"
  },
  {
    "FIPS": 46123,
    "State": "South Dakota",
    "County": "Tripp"
  },
  {
    "FIPS": 46125,
    "State": "South Dakota",
    "County": "Turner"
  },
  {
    "FIPS": 46127,
    "State": "South Dakota",
    "County": "Union"
  },
  {
    "FIPS": 46129,
    "State": "South Dakota",
    "County": "Walworth"
  },
  {
    "FIPS": 46135,
    "State": "South Dakota",
    "County": "Yankton"
  },
  {
    "FIPS": 46137,
    "State": "South Dakota",
    "County": "Ziebach"
  },
  {
    "FIPS": 47001,
    "State": "Tennessee",
    "County": "Anderson"
  },
  {
    "FIPS": 47003,
    "State": "Tennessee",
    "County": "Bedford"
  },
  {
    "FIPS": 47005,
    "State": "Tennessee",
    "County": "Benton"
  },
  {
    "FIPS": 47007,
    "State": "Tennessee",
    "County": "Bledsoe"
  },
  {
    "FIPS": 47009,
    "State": "Tennessee",
    "County": "Blount"
  },
  {
    "FIPS": 47011,
    "State": "Tennessee",
    "County": "Bradley"
  },
  {
    "FIPS": 47013,
    "State": "Tennessee",
    "County": "Campbell"
  },
  {
    "FIPS": 47015,
    "State": "Tennessee",
    "County": "Cannon"
  },
  {
    "FIPS": 47017,
    "State": "Tennessee",
    "County": "Carroll"
  },
  {
    "FIPS": 47019,
    "State": "Tennessee",
    "County": "Carter"
  },
  {
    "FIPS": 47021,
    "State": "Tennessee",
    "County": "Cheatham"
  },
  {
    "FIPS": 47023,
    "State": "Tennessee",
    "County": "Chester"
  },
  {
    "FIPS": 47025,
    "State": "Tennessee",
    "County": "Claiborne"
  },
  {
    "FIPS": 47027,
    "State": "Tennessee",
    "County": "Clay"
  },
  {
    "FIPS": 47029,
    "State": "Tennessee",
    "County": "Cocke"
  },
  {
    "FIPS": 47031,
    "State": "Tennessee",
    "County": "Coffee"
  },
  {
    "FIPS": 47033,
    "State": "Tennessee",
    "County": "Crockett"
  },
  {
    "FIPS": 47035,
    "State": "Tennessee",
    "County": "Cumberland"
  },
  {
    "FIPS": 47037,
    "State": "Tennessee",
    "County": "Davidson"
  },
  {
    "FIPS": 47039,
    "State": "Tennessee",
    "County": "Decatur"
  },
  {
    "FIPS": 47041,
    "State": "Tennessee",
    "County": "DeKalb"
  },
  {
    "FIPS": 47043,
    "State": "Tennessee",
    "County": "Dickson"
  },
  {
    "FIPS": 47045,
    "State": "Tennessee",
    "County": "Dyer"
  },
  {
    "FIPS": 47047,
    "State": "Tennessee",
    "County": "Fayette"
  },
  {
    "FIPS": 47049,
    "State": "Tennessee",
    "County": "Fentress"
  },
  {
    "FIPS": 47051,
    "State": "Tennessee",
    "County": "Franklin"
  },
  {
    "FIPS": 47053,
    "State": "Tennessee",
    "County": "Gibson"
  },
  {
    "FIPS": 47055,
    "State": "Tennessee",
    "County": "Giles"
  },
  {
    "FIPS": 47057,
    "State": "Tennessee",
    "County": "Grainger"
  },
  {
    "FIPS": 47059,
    "State": "Tennessee",
    "County": "Greene"
  },
  {
    "FIPS": 47061,
    "State": "Tennessee",
    "County": "Grundy"
  },
  {
    "FIPS": 47063,
    "State": "Tennessee",
    "County": "Hamblen"
  },
  {
    "FIPS": 47065,
    "State": "Tennessee",
    "County": "Hamilton"
  },
  {
    "FIPS": 47067,
    "State": "Tennessee",
    "County": "Hancock"
  },
  {
    "FIPS": 47069,
    "State": "Tennessee",
    "County": "Hardeman"
  },
  {
    "FIPS": 47071,
    "State": "Tennessee",
    "County": "Hardin"
  },
  {
    "FIPS": 47073,
    "State": "Tennessee",
    "County": "Hawkins"
  },
  {
    "FIPS": 47075,
    "State": "Tennessee",
    "County": "Haywood"
  },
  {
    "FIPS": 47077,
    "State": "Tennessee",
    "County": "Henderson"
  },
  {
    "FIPS": 47079,
    "State": "Tennessee",
    "County": "Henry"
  },
  {
    "FIPS": 47081,
    "State": "Tennessee",
    "County": "Hickman"
  },
  {
    "FIPS": 47083,
    "State": "Tennessee",
    "County": "Houston"
  },
  {
    "FIPS": 47085,
    "State": "Tennessee",
    "County": "Humphreys"
  },
  {
    "FIPS": 47087,
    "State": "Tennessee",
    "County": "Jackson"
  },
  {
    "FIPS": 47089,
    "State": "Tennessee",
    "County": "Jefferson"
  },
  {
    "FIPS": 47091,
    "State": "Tennessee",
    "County": "Johnson"
  },
  {
    "FIPS": 47093,
    "State": "Tennessee",
    "County": "Knox"
  },
  {
    "FIPS": 47095,
    "State": "Tennessee",
    "County": "Lake"
  },
  {
    "FIPS": 47097,
    "State": "Tennessee",
    "County": "Lauderdale"
  },
  {
    "FIPS": 47099,
    "State": "Tennessee",
    "County": "Lawrence"
  },
  {
    "FIPS": 47101,
    "State": "Tennessee",
    "County": "Lewis"
  },
  {
    "FIPS": 47103,
    "State": "Tennessee",
    "County": "Lincoln"
  },
  {
    "FIPS": 47105,
    "State": "Tennessee",
    "County": "Loudon"
  },
  {
    "FIPS": 47107,
    "State": "Tennessee",
    "County": "McMinn"
  },
  {
    "FIPS": 47109,
    "State": "Tennessee",
    "County": "McNairy"
  },
  {
    "FIPS": 47111,
    "State": "Tennessee",
    "County": "Macon"
  },
  {
    "FIPS": 47113,
    "State": "Tennessee",
    "County": "Madison"
  },
  {
    "FIPS": 47115,
    "State": "Tennessee",
    "County": "Marion"
  },
  {
    "FIPS": 47117,
    "State": "Tennessee",
    "County": "Marshall"
  },
  {
    "FIPS": 47119,
    "State": "Tennessee",
    "County": "Maury"
  },
  {
    "FIPS": 47121,
    "State": "Tennessee",
    "County": "Meigs"
  },
  {
    "FIPS": 47123,
    "State": "Tennessee",
    "County": "Monroe"
  },
  {
    "FIPS": 47125,
    "State": "Tennessee",
    "County": "Montgomery"
  },
  {
    "FIPS": 47127,
    "State": "Tennessee",
    "County": "Moore"
  },
  {
    "FIPS": 47129,
    "State": "Tennessee",
    "County": "Morgan"
  },
  {
    "FIPS": 47131,
    "State": "Tennessee",
    "County": "Obion"
  },
  {
    "FIPS": 47133,
    "State": "Tennessee",
    "County": "Overton"
  },
  {
    "FIPS": 47135,
    "State": "Tennessee",
    "County": "Perry"
  },
  {
    "FIPS": 47137,
    "State": "Tennessee",
    "County": "Pickett"
  },
  {
    "FIPS": 47139,
    "State": "Tennessee",
    "County": "Polk"
  },
  {
    "FIPS": 47141,
    "State": "Tennessee",
    "County": "Putnam"
  },
  {
    "FIPS": 47143,
    "State": "Tennessee",
    "County": "Rhea"
  },
  {
    "FIPS": 47145,
    "State": "Tennessee",
    "County": "Roane"
  },
  {
    "FIPS": 47147,
    "State": "Tennessee",
    "County": "Robertson"
  },
  {
    "FIPS": 47149,
    "State": "Tennessee",
    "County": "Rutherford"
  },
  {
    "FIPS": 47151,
    "State": "Tennessee",
    "County": "Scott"
  },
  {
    "FIPS": 47153,
    "State": "Tennessee",
    "County": "Sequatchie"
  },
  {
    "FIPS": 47155,
    "State": "Tennessee",
    "County": "Sevier"
  },
  {
    "FIPS": 47157,
    "State": "Tennessee",
    "County": "Shelby"
  },
  {
    "FIPS": 47159,
    "State": "Tennessee",
    "County": "Smith"
  },
  {
    "FIPS": 47161,
    "State": "Tennessee",
    "County": "Stewart"
  },
  {
    "FIPS": 47163,
    "State": "Tennessee",
    "County": "Sullivan"
  },
  {
    "FIPS": 47165,
    "State": "Tennessee",
    "County": "Sumner"
  },
  {
    "FIPS": 47167,
    "State": "Tennessee",
    "County": "Tipton"
  },
  {
    "FIPS": 47169,
    "State": "Tennessee",
    "County": "Trousdale"
  },
  {
    "FIPS": 47171,
    "State": "Tennessee",
    "County": "Unicoi"
  },
  {
    "FIPS": 47173,
    "State": "Tennessee",
    "County": "Union"
  },
  {
    "FIPS": 47175,
    "State": "Tennessee",
    "County": "Van Buren"
  },
  {
    "FIPS": 47177,
    "State": "Tennessee",
    "County": "Warren"
  },
  {
    "FIPS": 47179,
    "State": "Tennessee",
    "County": "Washington"
  },
  {
    "FIPS": 47181,
    "State": "Tennessee",
    "County": "Wayne"
  },
  {
    "FIPS": 47183,
    "State": "Tennessee",
    "County": "Weakley"
  },
  {
    "FIPS": 47185,
    "State": "Tennessee",
    "County": "White"
  },
  {
    "FIPS": 47187,
    "State": "Tennessee",
    "County": "Williamson"
  },
  {
    "FIPS": 47189,
    "State": "Tennessee",
    "County": "Wilson"
  },
  {
    "FIPS": 48001,
    "State": "Texas",
    "County": "Anderson"
  },
  {
    "FIPS": 48003,
    "State": "Texas",
    "County": "Andrews"
  },
  {
    "FIPS": 48005,
    "State": "Texas",
    "County": "Angelina"
  },
  {
    "FIPS": 48007,
    "State": "Texas",
    "County": "Aransas"
  },
  {
    "FIPS": 48009,
    "State": "Texas",
    "County": "Archer"
  },
  {
    "FIPS": 48011,
    "State": "Texas",
    "County": "Armstrong"
  },
  {
    "FIPS": 48013,
    "State": "Texas",
    "County": "Atascosa"
  },
  {
    "FIPS": 48015,
    "State": "Texas",
    "County": "Austin"
  },
  {
    "FIPS": 48017,
    "State": "Texas",
    "County": "Bailey"
  },
  {
    "FIPS": 48019,
    "State": "Texas",
    "County": "Bandera"
  },
  {
    "FIPS": 48021,
    "State": "Texas",
    "County": "Bastrop"
  },
  {
    "FIPS": 48023,
    "State": "Texas",
    "County": "Baylor"
  },
  {
    "FIPS": 48025,
    "State": "Texas",
    "County": "Bee"
  },
  {
    "FIPS": 48027,
    "State": "Texas",
    "County": "Bell"
  },
  {
    "FIPS": 48029,
    "State": "Texas",
    "County": "Bexar"
  },
  {
    "FIPS": 48031,
    "State": "Texas",
    "County": "Blanco"
  },
  {
    "FIPS": 48033,
    "State": "Texas",
    "County": "Borden"
  },
  {
    "FIPS": 48035,
    "State": "Texas",
    "County": "Bosque"
  },
  {
    "FIPS": 48037,
    "State": "Texas",
    "County": "Bowie"
  },
  {
    "FIPS": 48039,
    "State": "Texas",
    "County": "Brazoria"
  },
  {
    "FIPS": 48041,
    "State": "Texas",
    "County": "Brazos"
  },
  {
    "FIPS": 48043,
    "State": "Texas",
    "County": "Brewster"
  },
  {
    "FIPS": 48045,
    "State": "Texas",
    "County": "Briscoe"
  },
  {
    "FIPS": 48047,
    "State": "Texas",
    "County": "Brooks"
  },
  {
    "FIPS": 48049,
    "State": "Texas",
    "County": "Brown"
  },
  {
    "FIPS": 48051,
    "State": "Texas",
    "County": "Burleson"
  },
  {
    "FIPS": 48053,
    "State": "Texas",
    "County": "Burnet"
  },
  {
    "FIPS": 48055,
    "State": "Texas",
    "County": "Caldwell"
  },
  {
    "FIPS": 48057,
    "State": "Texas",
    "County": "Calhoun"
  },
  {
    "FIPS": 48059,
    "State": "Texas",
    "County": "Callahan"
  },
  {
    "FIPS": 48061,
    "State": "Texas",
    "County": "Cameron"
  },
  {
    "FIPS": 48063,
    "State": "Texas",
    "County": "Camp"
  },
  {
    "FIPS": 48065,
    "State": "Texas",
    "County": "Carson"
  },
  {
    "FIPS": 48067,
    "State": "Texas",
    "County": "Cass"
  },
  {
    "FIPS": 48069,
    "State": "Texas",
    "County": "Castro"
  },
  {
    "FIPS": 48071,
    "State": "Texas",
    "County": "Chambers"
  },
  {
    "FIPS": 48073,
    "State": "Texas",
    "County": "Cherokee"
  },
  {
    "FIPS": 48075,
    "State": "Texas",
    "County": "Childress"
  },
  {
    "FIPS": 48077,
    "State": "Texas",
    "County": "Clay"
  },
  {
    "FIPS": 48079,
    "State": "Texas",
    "County": "Cochran"
  },
  {
    "FIPS": 48081,
    "State": "Texas",
    "County": "Coke"
  },
  {
    "FIPS": 48083,
    "State": "Texas",
    "County": "Coleman"
  },
  {
    "FIPS": 48085,
    "State": "Texas",
    "County": "Collin"
  },
  {
    "FIPS": 48087,
    "State": "Texas",
    "County": "Collingsworth"
  },
  {
    "FIPS": 48089,
    "State": "Texas",
    "County": "Colorado"
  },
  {
    "FIPS": 48091,
    "State": "Texas",
    "County": "Comal"
  },
  {
    "FIPS": 48093,
    "State": "Texas",
    "County": "Comanche"
  },
  {
    "FIPS": 48095,
    "State": "Texas",
    "County": "Concho"
  },
  {
    "FIPS": 48097,
    "State": "Texas",
    "County": "Cooke"
  },
  {
    "FIPS": 48099,
    "State": "Texas",
    "County": "Coryell"
  },
  {
    "FIPS": 48101,
    "State": "Texas",
    "County": "Cottle"
  },
  {
    "FIPS": 48103,
    "State": "Texas",
    "County": "Crane"
  },
  {
    "FIPS": 48105,
    "State": "Texas",
    "County": "Crockett"
  },
  {
    "FIPS": 48107,
    "State": "Texas",
    "County": "Crosby"
  },
  {
    "FIPS": 48109,
    "State": "Texas",
    "County": "Culberson"
  },
  {
    "FIPS": 48111,
    "State": "Texas",
    "County": "Dallam"
  },
  {
    "FIPS": 48113,
    "State": "Texas",
    "County": "Dallas"
  },
  {
    "FIPS": 48115,
    "State": "Texas",
    "County": "Dawson"
  },
  {
    "FIPS": 48117,
    "State": "Texas",
    "County": "Deaf Smith"
  },
  {
    "FIPS": 48119,
    "State": "Texas",
    "County": "Delta"
  },
  {
    "FIPS": 48121,
    "State": "Texas",
    "County": "Denton"
  },
  {
    "FIPS": 48123,
    "State": "Texas",
    "County": "DeWitt"
  },
  {
    "FIPS": 48125,
    "State": "Texas",
    "County": "Dickens"
  },
  {
    "FIPS": 48127,
    "State": "Texas",
    "County": "Dimmit"
  },
  {
    "FIPS": 48129,
    "State": "Texas",
    "County": "Donley"
  },
  {
    "FIPS": 48131,
    "State": "Texas",
    "County": "Duval"
  },
  {
    "FIPS": 48133,
    "State": "Texas",
    "County": "Eastland"
  },
  {
    "FIPS": 48135,
    "State": "Texas",
    "County": "Ector"
  },
  {
    "FIPS": 48137,
    "State": "Texas",
    "County": "Edwards"
  },
  {
    "FIPS": 48139,
    "State": "Texas",
    "County": "Ellis"
  },
  {
    "FIPS": 48141,
    "State": "Texas",
    "County": "El Paso"
  },
  {
    "FIPS": 48143,
    "State": "Texas",
    "County": "Erath"
  },
  {
    "FIPS": 48145,
    "State": "Texas",
    "County": "Falls"
  },
  {
    "FIPS": 48147,
    "State": "Texas",
    "County": "Fannin"
  },
  {
    "FIPS": 48149,
    "State": "Texas",
    "County": "Fayette"
  },
  {
    "FIPS": 48151,
    "State": "Texas",
    "County": "Fisher"
  },
  {
    "FIPS": 48153,
    "State": "Texas",
    "County": "Floyd"
  },
  {
    "FIPS": 48155,
    "State": "Texas",
    "County": "Foard"
  },
  {
    "FIPS": 48157,
    "State": "Texas",
    "County": "Fort Bend"
  },
  {
    "FIPS": 48159,
    "State": "Texas",
    "County": "Franklin"
  },
  {
    "FIPS": 48161,
    "State": "Texas",
    "County": "Freestone"
  },
  {
    "FIPS": 48163,
    "State": "Texas",
    "County": "Frio"
  },
  {
    "FIPS": 48165,
    "State": "Texas",
    "County": "Gaines"
  },
  {
    "FIPS": 48167,
    "State": "Texas",
    "County": "Galveston"
  },
  {
    "FIPS": 48169,
    "State": "Texas",
    "County": "Garza"
  },
  {
    "FIPS": 48171,
    "State": "Texas",
    "County": "Gillespie"
  },
  {
    "FIPS": 48173,
    "State": "Texas",
    "County": "Glasscock"
  },
  {
    "FIPS": 48175,
    "State": "Texas",
    "County": "Goliad"
  },
  {
    "FIPS": 48177,
    "State": "Texas",
    "County": "Gonzales"
  },
  {
    "FIPS": 48179,
    "State": "Texas",
    "County": "Gray"
  },
  {
    "FIPS": 48181,
    "State": "Texas",
    "County": "Grayson"
  },
  {
    "FIPS": 48183,
    "State": "Texas",
    "County": "Gregg"
  },
  {
    "FIPS": 48185,
    "State": "Texas",
    "County": "Grimes"
  },
  {
    "FIPS": 48187,
    "State": "Texas",
    "County": "Guadalupe"
  },
  {
    "FIPS": 48189,
    "State": "Texas",
    "County": "Hale"
  },
  {
    "FIPS": 48191,
    "State": "Texas",
    "County": "Hall"
  },
  {
    "FIPS": 48193,
    "State": "Texas",
    "County": "Hamilton"
  },
  {
    "FIPS": 48195,
    "State": "Texas",
    "County": "Hansford"
  },
  {
    "FIPS": 48197,
    "State": "Texas",
    "County": "Hardeman"
  },
  {
    "FIPS": 48199,
    "State": "Texas",
    "County": "Hardin"
  },
  {
    "FIPS": 48201,
    "State": "Texas",
    "County": "Harris"
  },
  {
    "FIPS": 48203,
    "State": "Texas",
    "County": "Harrison"
  },
  {
    "FIPS": 48205,
    "State": "Texas",
    "County": "Hartley"
  },
  {
    "FIPS": 48207,
    "State": "Texas",
    "County": "Haskell"
  },
  {
    "FIPS": 48209,
    "State": "Texas",
    "County": "Hays"
  },
  {
    "FIPS": 48211,
    "State": "Texas",
    "County": "Hemphill"
  },
  {
    "FIPS": 48213,
    "State": "Texas",
    "County": "Henderson"
  },
  {
    "FIPS": 48215,
    "State": "Texas",
    "County": "Hidalgo"
  },
  {
    "FIPS": 48217,
    "State": "Texas",
    "County": "Hill"
  },
  {
    "FIPS": 48219,
    "State": "Texas",
    "County": "Hockley"
  },
  {
    "FIPS": 48221,
    "State": "Texas",
    "County": "Hood"
  },
  {
    "FIPS": 48223,
    "State": "Texas",
    "County": "Hopkins"
  },
  {
    "FIPS": 48225,
    "State": "Texas",
    "County": "Houston"
  },
  {
    "FIPS": 48227,
    "State": "Texas",
    "County": "Howard"
  },
  {
    "FIPS": 48229,
    "State": "Texas",
    "County": "Hudspeth"
  },
  {
    "FIPS": 48231,
    "State": "Texas",
    "County": "Hunt"
  },
  {
    "FIPS": 48233,
    "State": "Texas",
    "County": "Hutchinson"
  },
  {
    "FIPS": 48235,
    "State": "Texas",
    "County": "Irion"
  },
  {
    "FIPS": 48237,
    "State": "Texas",
    "County": "Jack"
  },
  {
    "FIPS": 48239,
    "State": "Texas",
    "County": "Jackson"
  },
  {
    "FIPS": 48241,
    "State": "Texas",
    "County": "Jasper"
  },
  {
    "FIPS": 48243,
    "State": "Texas",
    "County": "Jeff Davis"
  },
  {
    "FIPS": 48245,
    "State": "Texas",
    "County": "Jefferson"
  },
  {
    "FIPS": 48247,
    "State": "Texas",
    "County": "Jim Hogg"
  },
  {
    "FIPS": 48249,
    "State": "Texas",
    "County": "Jim Wells"
  },
  {
    "FIPS": 48251,
    "State": "Texas",
    "County": "Johnson"
  },
  {
    "FIPS": 48253,
    "State": "Texas",
    "County": "Jones"
  },
  {
    "FIPS": 48255,
    "State": "Texas",
    "County": "Karnes"
  },
  {
    "FIPS": 48257,
    "State": "Texas",
    "County": "Kaufman"
  },
  {
    "FIPS": 48259,
    "State": "Texas",
    "County": "Kendall"
  },
  {
    "FIPS": 48261,
    "State": "Texas",
    "County": "Kenedy"
  },
  {
    "FIPS": 48263,
    "State": "Texas",
    "County": "Kent"
  },
  {
    "FIPS": 48265,
    "State": "Texas",
    "County": "Kerr"
  },
  {
    "FIPS": 48267,
    "State": "Texas",
    "County": "Kimble"
  },
  {
    "FIPS": 48269,
    "State": "Texas",
    "County": "King"
  },
  {
    "FIPS": 48271,
    "State": "Texas",
    "County": "Kinney"
  },
  {
    "FIPS": 48273,
    "State": "Texas",
    "County": "Kleberg"
  },
  {
    "FIPS": 48275,
    "State": "Texas",
    "County": "Knox"
  },
  {
    "FIPS": 48277,
    "State": "Texas",
    "County": "Lamar"
  },
  {
    "FIPS": 48279,
    "State": "Texas",
    "County": "Lamb"
  },
  {
    "FIPS": 48281,
    "State": "Texas",
    "County": "Lampasas"
  },
  {
    "FIPS": 48283,
    "State": "Texas",
    "County": "La Salle"
  },
  {
    "FIPS": 48285,
    "State": "Texas",
    "County": "Lavaca"
  },
  {
    "FIPS": 48287,
    "State": "Texas",
    "County": "Lee"
  },
  {
    "FIPS": 48289,
    "State": "Texas",
    "County": "Leon"
  },
  {
    "FIPS": 48291,
    "State": "Texas",
    "County": "Liberty"
  },
  {
    "FIPS": 48293,
    "State": "Texas",
    "County": "Limestone"
  },
  {
    "FIPS": 48295,
    "State": "Texas",
    "County": "Lipscomb"
  },
  {
    "FIPS": 48297,
    "State": "Texas",
    "County": "Live Oak"
  },
  {
    "FIPS": 48299,
    "State": "Texas",
    "County": "Llano"
  },
  {
    "FIPS": 48301,
    "State": "Texas",
    "County": "Loving"
  },
  {
    "FIPS": 48303,
    "State": "Texas",
    "County": "Lubbock"
  },
  {
    "FIPS": 48305,
    "State": "Texas",
    "County": "Lynn"
  },
  {
    "FIPS": 48307,
    "State": "Texas",
    "County": "McCulloch"
  },
  {
    "FIPS": 48309,
    "State": "Texas",
    "County": "McLennan"
  },
  {
    "FIPS": 48311,
    "State": "Texas",
    "County": "McMullen"
  },
  {
    "FIPS": 48313,
    "State": "Texas",
    "County": "Madison"
  },
  {
    "FIPS": 48315,
    "State": "Texas",
    "County": "Marion"
  },
  {
    "FIPS": 48317,
    "State": "Texas",
    "County": "Martin"
  },
  {
    "FIPS": 48319,
    "State": "Texas",
    "County": "Mason"
  },
  {
    "FIPS": 48321,
    "State": "Texas",
    "County": "Matagorda"
  },
  {
    "FIPS": 48323,
    "State": "Texas",
    "County": "Maverick"
  },
  {
    "FIPS": 48325,
    "State": "Texas",
    "County": "Medina"
  },
  {
    "FIPS": 48327,
    "State": "Texas",
    "County": "Menard"
  },
  {
    "FIPS": 48329,
    "State": "Texas",
    "County": "Midland"
  },
  {
    "FIPS": 48331,
    "State": "Texas",
    "County": "Milam"
  },
  {
    "FIPS": 48333,
    "State": "Texas",
    "County": "Mills"
  },
  {
    "FIPS": 48335,
    "State": "Texas",
    "County": "Mitchell"
  },
  {
    "FIPS": 48337,
    "State": "Texas",
    "County": "Montague"
  },
  {
    "FIPS": 48339,
    "State": "Texas",
    "County": "Montgomery"
  },
  {
    "FIPS": 48341,
    "State": "Texas",
    "County": "Moore"
  },
  {
    "FIPS": 48343,
    "State": "Texas",
    "County": "Morris"
  },
  {
    "FIPS": 48345,
    "State": "Texas",
    "County": "Motley"
  },
  {
    "FIPS": 48347,
    "State": "Texas",
    "County": "Nacogdoches"
  },
  {
    "FIPS": 48349,
    "State": "Texas",
    "County": "Navarro"
  },
  {
    "FIPS": 48351,
    "State": "Texas",
    "County": "Newton"
  },
  {
    "FIPS": 48353,
    "State": "Texas",
    "County": "Nolan"
  },
  {
    "FIPS": 48355,
    "State": "Texas",
    "County": "Nueces"
  },
  {
    "FIPS": 48357,
    "State": "Texas",
    "County": "Ochiltree"
  },
  {
    "FIPS": 48359,
    "State": "Texas",
    "County": "Oldham"
  },
  {
    "FIPS": 48361,
    "State": "Texas",
    "County": "Orange"
  },
  {
    "FIPS": 48363,
    "State": "Texas",
    "County": "Palo Pinto"
  },
  {
    "FIPS": 48365,
    "State": "Texas",
    "County": "Panola"
  },
  {
    "FIPS": 48367,
    "State": "Texas",
    "County": "Parker"
  },
  {
    "FIPS": 48369,
    "State": "Texas",
    "County": "Parmer"
  },
  {
    "FIPS": 48371,
    "State": "Texas",
    "County": "Pecos"
  },
  {
    "FIPS": 48373,
    "State": "Texas",
    "County": "Polk"
  },
  {
    "FIPS": 48375,
    "State": "Texas",
    "County": "Potter"
  },
  {
    "FIPS": 48377,
    "State": "Texas",
    "County": "Presidio"
  },
  {
    "FIPS": 48379,
    "State": "Texas",
    "County": "Rains"
  },
  {
    "FIPS": 48381,
    "State": "Texas",
    "County": "Randall"
  },
  {
    "FIPS": 48383,
    "State": "Texas",
    "County": "Reagan"
  },
  {
    "FIPS": 48385,
    "State": "Texas",
    "County": "Real"
  },
  {
    "FIPS": 48387,
    "State": "Texas",
    "County": "Red River"
  },
  {
    "FIPS": 48389,
    "State": "Texas",
    "County": "Reeves"
  },
  {
    "FIPS": 48391,
    "State": "Texas",
    "County": "Refugio"
  },
  {
    "FIPS": 48393,
    "State": "Texas",
    "County": "Roberts"
  },
  {
    "FIPS": 48395,
    "State": "Texas",
    "County": "Robertson"
  },
  {
    "FIPS": 48397,
    "State": "Texas",
    "County": "Rockwall"
  },
  {
    "FIPS": 48399,
    "State": "Texas",
    "County": "Runnels"
  },
  {
    "FIPS": 48401,
    "State": "Texas",
    "County": "Rusk"
  },
  {
    "FIPS": 48403,
    "State": "Texas",
    "County": "Sabine"
  },
  {
    "FIPS": 48405,
    "State": "Texas",
    "County": "San Augustine"
  },
  {
    "FIPS": 48407,
    "State": "Texas",
    "County": "San Jacinto"
  },
  {
    "FIPS": 48409,
    "State": "Texas",
    "County": "San Patricio"
  },
  {
    "FIPS": 48411,
    "State": "Texas",
    "County": "San Saba"
  },
  {
    "FIPS": 48413,
    "State": "Texas",
    "County": "Schleicher"
  },
  {
    "FIPS": 48415,
    "State": "Texas",
    "County": "Scurry"
  },
  {
    "FIPS": 48417,
    "State": "Texas",
    "County": "Shackelford"
  },
  {
    "FIPS": 48419,
    "State": "Texas",
    "County": "Shelby"
  },
  {
    "FIPS": 48421,
    "State": "Texas",
    "County": "Sherman"
  },
  {
    "FIPS": 48423,
    "State": "Texas",
    "County": "Smith"
  },
  {
    "FIPS": 48425,
    "State": "Texas",
    "County": "Somervell"
  },
  {
    "FIPS": 48427,
    "State": "Texas",
    "County": "Starr"
  },
  {
    "FIPS": 48429,
    "State": "Texas",
    "County": "Stephens"
  },
  {
    "FIPS": 48431,
    "State": "Texas",
    "County": "Sterling"
  },
  {
    "FIPS": 48433,
    "State": "Texas",
    "County": "Stonewall"
  },
  {
    "FIPS": 48435,
    "State": "Texas",
    "County": "Sutton"
  },
  {
    "FIPS": 48437,
    "State": "Texas",
    "County": "Swisher"
  },
  {
    "FIPS": 48439,
    "State": "Texas",
    "County": "Tarrant"
  },
  {
    "FIPS": 48441,
    "State": "Texas",
    "County": "Taylor"
  },
  {
    "FIPS": 48443,
    "State": "Texas",
    "County": "Terrell"
  },
  {
    "FIPS": 48445,
    "State": "Texas",
    "County": "Terry"
  },
  {
    "FIPS": 48447,
    "State": "Texas",
    "County": "Throckmorton"
  },
  {
    "FIPS": 48449,
    "State": "Texas",
    "County": "Titus"
  },
  {
    "FIPS": 48451,
    "State": "Texas",
    "County": "Tom Green"
  },
  {
    "FIPS": 48453,
    "State": "Texas",
    "County": "Travis"
  },
  {
    "FIPS": 48455,
    "State": "Texas",
    "County": "Trinity"
  },
  {
    "FIPS": 48457,
    "State": "Texas",
    "County": "Tyler"
  },
  {
    "FIPS": 48459,
    "State": "Texas",
    "County": "Upshur"
  },
  {
    "FIPS": 48461,
    "State": "Texas",
    "County": "Upton"
  },
  {
    "FIPS": 48463,
    "State": "Texas",
    "County": "Uvalde"
  },
  {
    "FIPS": 48465,
    "State": "Texas",
    "County": "Val Verde"
  },
  {
    "FIPS": 48467,
    "State": "Texas",
    "County": "Van Zandt"
  },
  {
    "FIPS": 48469,
    "State": "Texas",
    "County": "Victoria"
  },
  {
    "FIPS": 48471,
    "State": "Texas",
    "County": "Walker"
  },
  {
    "FIPS": 48473,
    "State": "Texas",
    "County": "Waller"
  },
  {
    "FIPS": 48475,
    "State": "Texas",
    "County": "Ward"
  },
  {
    "FIPS": 48477,
    "State": "Texas",
    "County": "Washington"
  },
  {
    "FIPS": 48479,
    "State": "Texas",
    "County": "Webb"
  },
  {
    "FIPS": 48481,
    "State": "Texas",
    "County": "Wharton"
  },
  {
    "FIPS": 48483,
    "State": "Texas",
    "County": "Wheeler"
  },
  {
    "FIPS": 48485,
    "State": "Texas",
    "County": "Wichita"
  },
  {
    "FIPS": 48487,
    "State": "Texas",
    "County": "Wilbarger"
  },
  {
    "FIPS": 48489,
    "State": "Texas",
    "County": "Willacy"
  },
  {
    "FIPS": 48491,
    "State": "Texas",
    "County": "Williamson"
  },
  {
    "FIPS": 48493,
    "State": "Texas",
    "County": "Wilson"
  },
  {
    "FIPS": 48495,
    "State": "Texas",
    "County": "Winkler"
  },
  {
    "FIPS": 48497,
    "State": "Texas",
    "County": "Wise"
  },
  {
    "FIPS": 48499,
    "State": "Texas",
    "County": "Wood"
  },
  {
    "FIPS": 48501,
    "State": "Texas",
    "County": "Yoakum"
  },
  {
    "FIPS": 48503,
    "State": "Texas",
    "County": "Young"
  },
  {
    "FIPS": 48505,
    "State": "Texas",
    "County": "Zapata"
  },
  {
    "FIPS": 48507,
    "State": "Texas",
    "County": "Zavala"
  },
  {
    "FIPS": 49001,
    "State": "Utah",
    "County": "Beaver"
  },
  {
    "FIPS": 49003,
    "State": "Utah",
    "County": "Box Elder"
  },
  {
    "FIPS": 49005,
    "State": "Utah",
    "County": "Cache"
  },
  {
    "FIPS": 49007,
    "State": "Utah",
    "County": "Carbon"
  },
  {
    "FIPS": 49009,
    "State": "Utah",
    "County": "Daggett"
  },
  {
    "FIPS": 49011,
    "State": "Utah",
    "County": "Davis"
  },
  {
    "FIPS": 49013,
    "State": "Utah",
    "County": "Duchesne"
  },
  {
    "FIPS": 49015,
    "State": "Utah",
    "County": "Emery"
  },
  {
    "FIPS": 49017,
    "State": "Utah",
    "County": "Garfield"
  },
  {
    "FIPS": 49019,
    "State": "Utah",
    "County": "Grand"
  },
  {
    "FIPS": 49021,
    "State": "Utah",
    "County": "Iron"
  },
  {
    "FIPS": 49023,
    "State": "Utah",
    "County": "Juab"
  },
  {
    "FIPS": 49025,
    "State": "Utah",
    "County": "Kane"
  },
  {
    "FIPS": 49027,
    "State": "Utah",
    "County": "Millard"
  },
  {
    "FIPS": 49029,
    "State": "Utah",
    "County": "Morgan"
  },
  {
    "FIPS": 49031,
    "State": "Utah",
    "County": "Piute"
  },
  {
    "FIPS": 49033,
    "State": "Utah",
    "County": "Rich"
  },
  {
    "FIPS": 49035,
    "State": "Utah",
    "County": "Salt Lake"
  },
  {
    "FIPS": 49037,
    "State": "Utah",
    "County": "San Juan"
  },
  {
    "FIPS": 49039,
    "State": "Utah",
    "County": "Sanpete"
  },
  {
    "FIPS": 49041,
    "State": "Utah",
    "County": "Sevier"
  },
  {
    "FIPS": 49043,
    "State": "Utah",
    "County": "Summit"
  },
  {
    "FIPS": 49045,
    "State": "Utah",
    "County": "Tooele"
  },
  {
    "FIPS": 49047,
    "State": "Utah",
    "County": "Uintah"
  },
  {
    "FIPS": 49049,
    "State": "Utah",
    "County": "Utah"
  },
  {
    "FIPS": 49051,
    "State": "Utah",
    "County": "Wasatch"
  },
  {
    "FIPS": 49053,
    "State": "Utah",
    "County": "Washington"
  },
  {
    "FIPS": 49055,
    "State": "Utah",
    "County": "Wayne"
  },
  {
    "FIPS": 49057,
    "State": "Utah",
    "County": "Weber"
  },
  {
    "FIPS": 50001,
    "State": "Vermont",
    "County": "Addison"
  },
  {
    "FIPS": 50003,
    "State": "Vermont",
    "County": "Bennington"
  },
  {
    "FIPS": 50005,
    "State": "Vermont",
    "County": "Caledonia"
  },
  {
    "FIPS": 50007,
    "State": "Vermont",
    "County": "Chittenden"
  },
  {
    "FIPS": 50009,
    "State": "Vermont",
    "County": "Essex"
  },
  {
    "FIPS": 50011,
    "State": "Vermont",
    "County": "Franklin"
  },
  {
    "FIPS": 50013,
    "State": "Vermont",
    "County": "Grand Isle"
  },
  {
    "FIPS": 50015,
    "State": "Vermont",
    "County": "Lamoille"
  },
  {
    "FIPS": 50017,
    "State": "Vermont",
    "County": "Orange"
  },
  {
    "FIPS": 50019,
    "State": "Vermont",
    "County": "Orleans"
  },
  {
    "FIPS": 50021,
    "State": "Vermont",
    "County": "Rutland"
  },
  {
    "FIPS": 50023,
    "State": "Vermont",
    "County": "Washington"
  },
  {
    "FIPS": 50025,
    "State": "Vermont",
    "County": "Windham"
  },
  {
    "FIPS": 50027,
    "State": "Vermont",
    "County": "Windsor"
  },
  {
    "FIPS": 51001,
    "State": "Virginia",
    "County": "Accomack"
  },
  {
    "FIPS": 51003,
    "State": "Virginia",
    "County": "Albemarle"
  },
  {
    "FIPS": 51005,
    "State": "Virginia",
    "County": "Alleghany"
  },
  {
    "FIPS": 51007,
    "State": "Virginia",
    "County": "Amelia"
  },
  {
    "FIPS": 51009,
    "State": "Virginia",
    "County": "Amherst"
  },
  {
    "FIPS": 51011,
    "State": "Virginia",
    "County": "Appomattox"
  },
  {
    "FIPS": 51013,
    "State": "Virginia",
    "County": "Arlington"
  },
  {
    "FIPS": 51015,
    "State": "Virginia",
    "County": "Augusta"
  },
  {
    "FIPS": 51017,
    "State": "Virginia",
    "County": "Bath"
  },
  {
    "FIPS": 51019,
    "State": "Virginia",
    "County": "Bedford"
  },
  {
    "FIPS": 51021,
    "State": "Virginia",
    "County": "Bland"
  },
  {
    "FIPS": 51023,
    "State": "Virginia",
    "County": "Botetourt"
  },
  {
    "FIPS": 51025,
    "State": "Virginia",
    "County": "Brunswick"
  },
  {
    "FIPS": 51027,
    "State": "Virginia",
    "County": "Buchanan"
  },
  {
    "FIPS": 51029,
    "State": "Virginia",
    "County": "Buckingham"
  },
  {
    "FIPS": 51031,
    "State": "Virginia",
    "County": "Campbell"
  },
  {
    "FIPS": 51033,
    "State": "Virginia",
    "County": "Caroline"
  },
  {
    "FIPS": 51035,
    "State": "Virginia",
    "County": "Carroll"
  },
  {
    "FIPS": 51036,
    "State": "Virginia",
    "County": "Charles city"
  },
  {
    "FIPS": 51037,
    "State": "Virginia",
    "County": "Charlotte"
  },
  {
    "FIPS": 51041,
    "State": "Virginia",
    "County": "Chesterfield"
  },
  {
    "FIPS": 51043,
    "State": "Virginia",
    "County": "Clarke"
  },
  {
    "FIPS": 51045,
    "State": "Virginia",
    "County": "Craig"
  },
  {
    "FIPS": 51047,
    "State": "Virginia",
    "County": "Culpeper"
  },
  {
    "FIPS": 51049,
    "State": "Virginia",
    "County": "Cumberland"
  },
  {
    "FIPS": 51051,
    "State": "Virginia",
    "County": "Dickenson"
  },
  {
    "FIPS": 51053,
    "State": "Virginia",
    "County": "Dinwiddie"
  },
  {
    "FIPS": 51057,
    "State": "Virginia",
    "County": "Essex"
  },
  {
    "FIPS": 51059,
    "State": "Virginia",
    "County": "Fairfax"
  },
  {
    "FIPS": 51061,
    "State": "Virginia",
    "County": "Fauquier"
  },
  {
    "FIPS": 51063,
    "State": "Virginia",
    "County": "Floyd"
  },
  {
    "FIPS": 51065,
    "State": "Virginia",
    "County": "Fluvanna"
  },
  {
    "FIPS": 51067,
    "State": "Virginia",
    "County": "Franklin"
  },
  {
    "FIPS": 51069,
    "State": "Virginia",
    "County": "Frederick"
  },
  {
    "FIPS": 51071,
    "State": "Virginia",
    "County": "Giles"
  },
  {
    "FIPS": 51073,
    "State": "Virginia",
    "County": "Gloucester"
  },
  {
    "FIPS": 51075,
    "State": "Virginia",
    "County": "Goochland"
  },
  {
    "FIPS": 51077,
    "State": "Virginia",
    "County": "Grayson"
  },
  {
    "FIPS": 51079,
    "State": "Virginia",
    "County": "Greene"
  },
  {
    "FIPS": 51081,
    "State": "Virginia",
    "County": "Greensville"
  },
  {
    "FIPS": 51083,
    "State": "Virginia",
    "County": "Halifax"
  },
  {
    "FIPS": 51085,
    "State": "Virginia",
    "County": "Hanover"
  },
  {
    "FIPS": 51087,
    "State": "Virginia",
    "County": "Henrico"
  },
  {
    "FIPS": 51089,
    "State": "Virginia",
    "County": "Henry"
  },
  {
    "FIPS": 51091,
    "State": "Virginia",
    "County": "Highland"
  },
  {
    "FIPS": 51093,
    "State": "Virginia",
    "County": "Isle of Wight"
  },
  {
    "FIPS": 51095,
    "State": "Virginia",
    "County": "James city"
  },
  {
    "FIPS": 51097,
    "State": "Virginia",
    "County": "King and Queen"
  },
  {
    "FIPS": 51099,
    "State": "Virginia",
    "County": "King George"
  },
  {
    "FIPS": 51101,
    "State": "Virginia",
    "County": "King William"
  },
  {
    "FIPS": 51103,
    "State": "Virginia",
    "County": "Lancaster"
  },
  {
    "FIPS": 51105,
    "State": "Virginia",
    "County": "Lee"
  },
  {
    "FIPS": 51107,
    "State": "Virginia",
    "County": "Loudoun"
  },
  {
    "FIPS": 51109,
    "State": "Virginia",
    "County": "Louisa"
  },
  {
    "FIPS": 51111,
    "State": "Virginia",
    "County": "Lunenburg"
  },
  {
    "FIPS": 51113,
    "State": "Virginia",
    "County": "Madison"
  },
  {
    "FIPS": 51115,
    "State": "Virginia",
    "County": "Mathews"
  },
  {
    "FIPS": 51117,
    "State": "Virginia",
    "County": "Mecklenburg"
  },
  {
    "FIPS": 51119,
    "State": "Virginia",
    "County": "Middlesex"
  },
  {
    "FIPS": 51121,
    "State": "Virginia",
    "County": "Montgomery"
  },
  {
    "FIPS": 51125,
    "State": "Virginia",
    "County": "Nelson"
  },
  {
    "FIPS": 51127,
    "State": "Virginia",
    "County": "New Kent"
  },
  {
    "FIPS": 51131,
    "State": "Virginia",
    "County": "Northampton"
  },
  {
    "FIPS": 51133,
    "State": "Virginia",
    "County": "Northumberland"
  },
  {
    "FIPS": 51135,
    "State": "Virginia",
    "County": "Nottoway"
  },
  {
    "FIPS": 51137,
    "State": "Virginia",
    "County": "Orange"
  },
  {
    "FIPS": 51139,
    "State": "Virginia",
    "County": "Page"
  },
  {
    "FIPS": 51141,
    "State": "Virginia",
    "County": "Patrick"
  },
  {
    "FIPS": 51143,
    "State": "Virginia",
    "County": "Pittsylvania"
  },
  {
    "FIPS": 51145,
    "State": "Virginia",
    "County": "Powhatan"
  },
  {
    "FIPS": 51147,
    "State": "Virginia",
    "County": "Prince Edward"
  },
  {
    "FIPS": 51149,
    "State": "Virginia",
    "County": "Prince George"
  },
  {
    "FIPS": 51153,
    "State": "Virginia",
    "County": "Prince William"
  },
  {
    "FIPS": 51155,
    "State": "Virginia",
    "County": "Pulaski"
  },
  {
    "FIPS": 51157,
    "State": "Virginia",
    "County": "Rappahannock"
  },
  {
    "FIPS": 51159,
    "State": "Virginia",
    "County": "Richmond"
  },
  {
    "FIPS": 51161,
    "State": "Virginia",
    "County": "Roanoke"
  },
  {
    "FIPS": 51163,
    "State": "Virginia",
    "County": "Rockbridge"
  },
  {
    "FIPS": 51165,
    "State": "Virginia",
    "County": "Rockingham"
  },
  {
    "FIPS": 51167,
    "State": "Virginia",
    "County": "Russell"
  },
  {
    "FIPS": 51169,
    "State": "Virginia",
    "County": "Scott"
  },
  {
    "FIPS": 51171,
    "State": "Virginia",
    "County": "Shenandoah"
  },
  {
    "FIPS": 51173,
    "State": "Virginia",
    "County": "Smyth"
  },
  {
    "FIPS": 51175,
    "State": "Virginia",
    "County": "Southampton"
  },
  {
    "FIPS": 51177,
    "State": "Virginia",
    "County": "Spotsylvania"
  },
  {
    "FIPS": 51179,
    "State": "Virginia",
    "County": "Stafford"
  },
  {
    "FIPS": 51181,
    "State": "Virginia",
    "County": "Surry"
  },
  {
    "FIPS": 51183,
    "State": "Virginia",
    "County": "Sussex"
  },
  {
    "FIPS": 51185,
    "State": "Virginia",
    "County": "Tazewell"
  },
  {
    "FIPS": 51187,
    "State": "Virginia",
    "County": "Warren"
  },
  {
    "FIPS": 51191,
    "State": "Virginia",
    "County": "Washington"
  },
  {
    "FIPS": 51193,
    "State": "Virginia",
    "County": "Westmoreland"
  },
  {
    "FIPS": 51195,
    "State": "Virginia",
    "County": "Wise"
  },
  {
    "FIPS": 51197,
    "State": "Virginia",
    "County": "Wythe"
  },
  {
    "FIPS": 51199,
    "State": "Virginia",
    "County": "York"
  },
  {
    "FIPS": 51510,
    "State": "Virginia",
    "County": "Alexandria city"
  },
  {
    "FIPS": 51515,
    "State": "Virginia",
    "County": "Bedford city"
  },
  {
    "FIPS": 51520,
    "State": "Virginia",
    "County": "Bristol city"
  },
  {
    "FIPS": 51530,
    "State": "Virginia",
    "County": "Buena Vista city"
  },
  {
    "FIPS": 51540,
    "State": "Virginia",
    "County": "Charlottesville city"
  },
  {
    "FIPS": 51550,
    "State": "Virginia",
    "County": "Chesapeake city"
  },
  {
    "FIPS": 51570,
    "State": "Virginia",
    "County": "Colonial Heights city"
  },
  {
    "FIPS": 51580,
    "State": "Virginia",
    "County": "Covington city"
  },
  {
    "FIPS": 51590,
    "State": "Virginia",
    "County": "Danville city"
  },
  {
    "FIPS": 51595,
    "State": "Virginia",
    "County": "Emporia city"
  },
  {
    "FIPS": 51600,
    "State": "Virginia",
    "County": "Fairfax city"
  },
  {
    "FIPS": 51610,
    "State": "Virginia",
    "County": "Falls Church city"
  },
  {
    "FIPS": 51620,
    "State": "Virginia",
    "County": "Franklin city"
  },
  {
    "FIPS": 51630,
    "State": "Virginia",
    "County": "Fredericksburg city"
  },
  {
    "FIPS": 51640,
    "State": "Virginia",
    "County": "Galax city"
  },
  {
    "FIPS": 51650,
    "State": "Virginia",
    "County": "Hampton city"
  },
  {
    "FIPS": 51660,
    "State": "Virginia",
    "County": "Harrisonburg city"
  },
  {
    "FIPS": 51670,
    "State": "Virginia",
    "County": "Hopewell city"
  },
  {
    "FIPS": 51678,
    "State": "Virginia",
    "County": "Lexington city"
  },
  {
    "FIPS": 51680,
    "State": "Virginia",
    "County": "Lynchburg city"
  },
  {
    "FIPS": 51683,
    "State": "Virginia",
    "County": "Manassas city"
  },
  {
    "FIPS": 51685,
    "State": "Virginia",
    "County": "Manassas Park city"
  },
  {
    "FIPS": 51690,
    "State": "Virginia",
    "County": "Martinsville city"
  },
  {
    "FIPS": 51700,
    "State": "Virginia",
    "County": "Newport News city"
  },
  {
    "FIPS": 51710,
    "State": "Virginia",
    "County": "Norfolk city"
  },
  {
    "FIPS": 51720,
    "State": "Virginia",
    "County": "Norton city"
  },
  {
    "FIPS": 51730,
    "State": "Virginia",
    "County": "Petersburg city"
  },
  {
    "FIPS": 51735,
    "State": "Virginia",
    "County": "Poquoson city"
  },
  {
    "FIPS": 51740,
    "State": "Virginia",
    "County": "Portsmouth city"
  },
  {
    "FIPS": 51750,
    "State": "Virginia",
    "County": "Radford city"
  },
  {
    "FIPS": 51760,
    "State": "Virginia",
    "County": "Richmond city"
  },
  {
    "FIPS": 51770,
    "State": "Virginia",
    "County": "Roanoke city"
  },
  {
    "FIPS": 51775,
    "State": "Virginia",
    "County": "Salem city"
  },
  {
    "FIPS": 51790,
    "State": "Virginia",
    "County": "Staunton city"
  },
  {
    "FIPS": 51800,
    "State": "Virginia",
    "County": "Suffolk city"
  },
  {
    "FIPS": 51810,
    "State": "Virginia",
    "County": "Virginia Beach city"
  },
  {
    "FIPS": 51820,
    "State": "Virginia",
    "County": "Waynesboro city"
  },
  {
    "FIPS": 51830,
    "State": "Virginia",
    "County": "Williamsburg city"
  },
  {
    "FIPS": 51840,
    "State": "Virginia",
    "County": "Winchester city"
  },
  {
    "FIPS": 53001,
    "State": "Washington",
    "County": "Adams"
  },
  {
    "FIPS": 53003,
    "State": "Washington",
    "County": "Asotin"
  },
  {
    "FIPS": 53005,
    "State": "Washington",
    "County": "Benton"
  },
  {
    "FIPS": 53007,
    "State": "Washington",
    "County": "Chelan"
  },
  {
    "FIPS": 53009,
    "State": "Washington",
    "County": "Clallam"
  },
  {
    "FIPS": 53011,
    "State": "Washington",
    "County": "Clark"
  },
  {
    "FIPS": 53013,
    "State": "Washington",
    "County": "Columbia"
  },
  {
    "FIPS": 53015,
    "State": "Washington",
    "County": "Cowlitz"
  },
  {
    "FIPS": 53017,
    "State": "Washington",
    "County": "Douglas"
  },
  {
    "FIPS": 53019,
    "State": "Washington",
    "County": "Ferry"
  },
  {
    "FIPS": 53021,
    "State": "Washington",
    "County": "Franklin"
  },
  {
    "FIPS": 53023,
    "State": "Washington",
    "County": "Garfield"
  },
  {
    "FIPS": 53025,
    "State": "Washington",
    "County": "Grant"
  },
  {
    "FIPS": 53027,
    "State": "Washington",
    "County": "Grays Harbor"
  },
  {
    "FIPS": 53029,
    "State": "Washington",
    "County": "Island"
  },
  {
    "FIPS": 53031,
    "State": "Washington",
    "County": "Jefferson"
  },
  {
    "FIPS": 53033,
    "State": "Washington",
    "County": "King"
  },
  {
    "FIPS": 53035,
    "State": "Washington",
    "County": "Kitsap"
  },
  {
    "FIPS": 53037,
    "State": "Washington",
    "County": "Kittitas"
  },
  {
    "FIPS": 53039,
    "State": "Washington",
    "County": "Klickitat"
  },
  {
    "FIPS": 53041,
    "State": "Washington",
    "County": "Lewis"
  },
  {
    "FIPS": 53043,
    "State": "Washington",
    "County": "Lincoln"
  },
  {
    "FIPS": 53045,
    "State": "Washington",
    "County": "Mason"
  },
  {
    "FIPS": 53047,
    "State": "Washington",
    "County": "Okanogan"
  },
  {
    "FIPS": 53049,
    "State": "Washington",
    "County": "Pacific"
  },
  {
    "FIPS": 53051,
    "State": "Washington",
    "County": "Pend Oreille"
  },
  {
    "FIPS": 53053,
    "State": "Washington",
    "County": "Pierce"
  },
  {
    "FIPS": 53055,
    "State": "Washington",
    "County": "San Juan"
  },
  {
    "FIPS": 53057,
    "State": "Washington",
    "County": "Skagit"
  },
  {
    "FIPS": 53059,
    "State": "Washington",
    "County": "Skamania"
  },
  {
    "FIPS": 53061,
    "State": "Washington",
    "County": "Snohomish"
  },
  {
    "FIPS": 53063,
    "State": "Washington",
    "County": "Spokane"
  },
  {
    "FIPS": 53065,
    "State": "Washington",
    "County": "Stevens"
  },
  {
    "FIPS": 53067,
    "State": "Washington",
    "County": "Thurston"
  },
  {
    "FIPS": 53069,
    "State": "Washington",
    "County": "Wahkiakum"
  },
  {
    "FIPS": 53071,
    "State": "Washington",
    "County": "Walla Walla"
  },
  {
    "FIPS": 53073,
    "State": "Washington",
    "County": "Whatcom"
  },
  {
    "FIPS": 53075,
    "State": "Washington",
    "County": "Whitman"
  },
  {
    "FIPS": 53077,
    "State": "Washington",
    "County": "Yakima"
  },
  {
    "FIPS": 54001,
    "State": "West Virginia",
    "County": "Barbour"
  },
  {
    "FIPS": 54003,
    "State": "West Virginia",
    "County": "Berkeley"
  },
  {
    "FIPS": 54005,
    "State": "West Virginia",
    "County": "Boone"
  },
  {
    "FIPS": 54007,
    "State": "West Virginia",
    "County": "Braxton"
  },
  {
    "FIPS": 54009,
    "State": "West Virginia",
    "County": "Brooke"
  },
  {
    "FIPS": 54011,
    "State": "West Virginia",
    "County": "Cabell"
  },
  {
    "FIPS": 54013,
    "State": "West Virginia",
    "County": "Calhoun"
  },
  {
    "FIPS": 54015,
    "State": "West Virginia",
    "County": "Clay"
  },
  {
    "FIPS": 54017,
    "State": "West Virginia",
    "County": "Doddridge"
  },
  {
    "FIPS": 54019,
    "State": "West Virginia",
    "County": "Fayette"
  },
  {
    "FIPS": 54021,
    "State": "West Virginia",
    "County": "Gilmer"
  },
  {
    "FIPS": 54023,
    "State": "West Virginia",
    "County": "Grant"
  },
  {
    "FIPS": 54025,
    "State": "West Virginia",
    "County": "Greenbrier"
  },
  {
    "FIPS": 54027,
    "State": "West Virginia",
    "County": "Hampshire"
  },
  {
    "FIPS": 54029,
    "State": "West Virginia",
    "County": "Hancock"
  },
  {
    "FIPS": 54031,
    "State": "West Virginia",
    "County": "Hardy"
  },
  {
    "FIPS": 54033,
    "State": "West Virginia",
    "County": "Harrison"
  },
  {
    "FIPS": 54035,
    "State": "West Virginia",
    "County": "Jackson"
  },
  {
    "FIPS": 54037,
    "State": "West Virginia",
    "County": "Jefferson"
  },
  {
    "FIPS": 54039,
    "State": "West Virginia",
    "County": "Kanawha"
  },
  {
    "FIPS": 54041,
    "State": "West Virginia",
    "County": "Lewis"
  },
  {
    "FIPS": 54043,
    "State": "West Virginia",
    "County": "Lincoln"
  },
  {
    "FIPS": 54045,
    "State": "West Virginia",
    "County": "Logan"
  },
  {
    "FIPS": 54047,
    "State": "West Virginia",
    "County": "McDowell"
  },
  {
    "FIPS": 54049,
    "State": "West Virginia",
    "County": "Marion"
  },
  {
    "FIPS": 54051,
    "State": "West Virginia",
    "County": "Marshall"
  },
  {
    "FIPS": 54053,
    "State": "West Virginia",
    "County": "Mason"
  },
  {
    "FIPS": 54055,
    "State": "West Virginia",
    "County": "Mercer"
  },
  {
    "FIPS": 54057,
    "State": "West Virginia",
    "County": "Mineral"
  },
  {
    "FIPS": 54059,
    "State": "West Virginia",
    "County": "Mingo"
  },
  {
    "FIPS": 54061,
    "State": "West Virginia",
    "County": "Monongalia"
  },
  {
    "FIPS": 54063,
    "State": "West Virginia",
    "County": "Monroe"
  },
  {
    "FIPS": 54065,
    "State": "West Virginia",
    "County": "Morgan"
  },
  {
    "FIPS": 54067,
    "State": "West Virginia",
    "County": "Nicholas"
  },
  {
    "FIPS": 54069,
    "State": "West Virginia",
    "County": "Ohio"
  },
  {
    "FIPS": 54071,
    "State": "West Virginia",
    "County": "Pendleton"
  },
  {
    "FIPS": 54073,
    "State": "West Virginia",
    "County": "Pleasants"
  },
  {
    "FIPS": 54075,
    "State": "West Virginia",
    "County": "Pocahontas"
  },
  {
    "FIPS": 54077,
    "State": "West Virginia",
    "County": "Preston"
  },
  {
    "FIPS": 54079,
    "State": "West Virginia",
    "County": "Putnam"
  },
  {
    "FIPS": 54081,
    "State": "West Virginia",
    "County": "Raleigh"
  },
  {
    "FIPS": 54083,
    "State": "West Virginia",
    "County": "Randolph"
  },
  {
    "FIPS": 54085,
    "State": "West Virginia",
    "County": "Ritchie"
  },
  {
    "FIPS": 54087,
    "State": "West Virginia",
    "County": "Roane"
  },
  {
    "FIPS": 54089,
    "State": "West Virginia",
    "County": "Summers"
  },
  {
    "FIPS": 54091,
    "State": "West Virginia",
    "County": "Taylor"
  },
  {
    "FIPS": 54093,
    "State": "West Virginia",
    "County": "Tucker"
  },
  {
    "FIPS": 54095,
    "State": "West Virginia",
    "County": "Tyler"
  },
  {
    "FIPS": 54097,
    "State": "West Virginia",
    "County": "Upshur"
  },
  {
    "FIPS": 54099,
    "State": "West Virginia",
    "County": "Wayne"
  },
  {
    "FIPS": 54101,
    "State": "West Virginia",
    "County": "Webster"
  },
  {
    "FIPS": 54103,
    "State": "West Virginia",
    "County": "Wetzel"
  },
  {
    "FIPS": 54105,
    "State": "West Virginia",
    "County": "Wirt"
  },
  {
    "FIPS": 54107,
    "State": "West Virginia",
    "County": "Wood"
  },
  {
    "FIPS": 54109,
    "State": "West Virginia",
    "County": "Wyoming"
  },
  {
    "FIPS": 55001,
    "State": "Wisconsin",
    "County": "Adams"
  },
  {
    "FIPS": 55003,
    "State": "Wisconsin",
    "County": "Ashland"
  },
  {
    "FIPS": 55005,
    "State": "Wisconsin",
    "County": "Barron"
  },
  {
    "FIPS": 55007,
    "State": "Wisconsin",
    "County": "Bayfield"
  },
  {
    "FIPS": 55009,
    "State": "Wisconsin",
    "County": "Brown"
  },
  {
    "FIPS": 55011,
    "State": "Wisconsin",
    "County": "Buffalo"
  },
  {
    "FIPS": 55013,
    "State": "Wisconsin",
    "County": "Burnett"
  },
  {
    "FIPS": 55015,
    "State": "Wisconsin",
    "County": "Calumet"
  },
  {
    "FIPS": 55017,
    "State": "Wisconsin",
    "County": "Chippewa"
  },
  {
    "FIPS": 55019,
    "State": "Wisconsin",
    "County": "Clark"
  },
  {
    "FIPS": 55021,
    "State": "Wisconsin",
    "County": "Columbia"
  },
  {
    "FIPS": 55023,
    "State": "Wisconsin",
    "County": "Crawford"
  },
  {
    "FIPS": 55025,
    "State": "Wisconsin",
    "County": "Dane"
  },
  {
    "FIPS": 55027,
    "State": "Wisconsin",
    "County": "Dodge"
  },
  {
    "FIPS": 55029,
    "State": "Wisconsin",
    "County": "Door"
  },
  {
    "FIPS": 55031,
    "State": "Wisconsin",
    "County": "Douglas"
  },
  {
    "FIPS": 55033,
    "State": "Wisconsin",
    "County": "Dunn"
  },
  {
    "FIPS": 55035,
    "State": "Wisconsin",
    "County": "Eau Claire"
  },
  {
    "FIPS": 55037,
    "State": "Wisconsin",
    "County": "Florence"
  },
  {
    "FIPS": 55039,
    "State": "Wisconsin",
    "County": "Fond du Lac"
  },
  {
    "FIPS": 55041,
    "State": "Wisconsin",
    "County": "Forest"
  },
  {
    "FIPS": 55043,
    "State": "Wisconsin",
    "County": "Grant"
  },
  {
    "FIPS": 55045,
    "State": "Wisconsin",
    "County": "Green"
  },
  {
    "FIPS": 55047,
    "State": "Wisconsin",
    "County": "Green Lake"
  },
  {
    "FIPS": 55049,
    "State": "Wisconsin",
    "County": "Iowa"
  },
  {
    "FIPS": 55051,
    "State": "Wisconsin",
    "County": "Iron"
  },
  {
    "FIPS": 55053,
    "State": "Wisconsin",
    "County": "Jackson"
  },
  {
    "FIPS": 55055,
    "State": "Wisconsin",
    "County": "Jefferson"
  },
  {
    "FIPS": 55057,
    "State": "Wisconsin",
    "County": "Juneau"
  },
  {
    "FIPS": 55059,
    "State": "Wisconsin",
    "County": "Kenosha"
  },
  {
    "FIPS": 55061,
    "State": "Wisconsin",
    "County": "Kewaunee"
  },
  {
    "FIPS": 55063,
    "State": "Wisconsin",
    "County": "La Crosse"
  },
  {
    "FIPS": 55065,
    "State": "Wisconsin",
    "County": "Lafayette"
  },
  {
    "FIPS": 55067,
    "State": "Wisconsin",
    "County": "Langlade"
  },
  {
    "FIPS": 55069,
    "State": "Wisconsin",
    "County": "Lincoln"
  },
  {
    "FIPS": 55071,
    "State": "Wisconsin",
    "County": "Manitowoc"
  },
  {
    "FIPS": 55073,
    "State": "Wisconsin",
    "County": "Marathon"
  },
  {
    "FIPS": 55075,
    "State": "Wisconsin",
    "County": "Marinette"
  },
  {
    "FIPS": 55077,
    "State": "Wisconsin",
    "County": "Marquette"
  },
  {
    "FIPS": 55078,
    "State": "Wisconsin",
    "County": "Menominee"
  },
  {
    "FIPS": 55079,
    "State": "Wisconsin",
    "County": "Milwaukee"
  },
  {
    "FIPS": 55081,
    "State": "Wisconsin",
    "County": "Monroe"
  },
  {
    "FIPS": 55083,
    "State": "Wisconsin",
    "County": "Oconto"
  },
  {
    "FIPS": 55085,
    "State": "Wisconsin",
    "County": "Oneida"
  },
  {
    "FIPS": 55087,
    "State": "Wisconsin",
    "County": "Outagamie"
  },
  {
    "FIPS": 55089,
    "State": "Wisconsin",
    "County": "Ozaukee"
  },
  {
    "FIPS": 55091,
    "State": "Wisconsin",
    "County": "Pepin"
  },
  {
    "FIPS": 55093,
    "State": "Wisconsin",
    "County": "Pierce"
  },
  {
    "FIPS": 55095,
    "State": "Wisconsin",
    "County": "Polk"
  },
  {
    "FIPS": 55097,
    "State": "Wisconsin",
    "County": "Portage"
  },
  {
    "FIPS": 55099,
    "State": "Wisconsin",
    "County": "Price"
  },
  {
    "FIPS": 55101,
    "State": "Wisconsin",
    "County": "Racine"
  },
  {
    "FIPS": 55103,
    "State": "Wisconsin",
    "County": "Richland"
  },
  {
    "FIPS": 55105,
    "State": "Wisconsin",
    "County": "Rock"
  },
  {
    "FIPS": 55107,
    "State": "Wisconsin",
    "County": "Rusk"
  },
  {
    "FIPS": 55109,
    "State": "Wisconsin",
    "County": "St. Croix"
  },
  {
    "FIPS": 55111,
    "State": "Wisconsin",
    "County": "Sauk"
  },
  {
    "FIPS": 55113,
    "State": "Wisconsin",
    "County": "Sawyer"
  },
  {
    "FIPS": 55115,
    "State": "Wisconsin",
    "County": "Shawano"
  },
  {
    "FIPS": 55117,
    "State": "Wisconsin",
    "County": "Sheboygan"
  },
  {
    "FIPS": 55119,
    "State": "Wisconsin",
    "County": "Taylor"
  },
  {
    "FIPS": 55121,
    "State": "Wisconsin",
    "County": "Trempealeau"
  },
  {
    "FIPS": 55123,
    "State": "Wisconsin",
    "County": "Vernon"
  },
  {
    "FIPS": 55125,
    "State": "Wisconsin",
    "County": "Vilas"
  },
  {
    "FIPS": 55127,
    "State": "Wisconsin",
    "County": "Walworth"
  },
  {
    "FIPS": 55129,
    "State": "Wisconsin",
    "County": "Washburn"
  },
  {
    "FIPS": 55131,
    "State": "Wisconsin",
    "County": "Washington"
  },
  {
    "FIPS": 55133,
    "State": "Wisconsin",
    "County": "Waukesha"
  },
  {
    "FIPS": 55135,
    "State": "Wisconsin",
    "County": "Waupaca"
  },
  {
    "FIPS": 55137,
    "State": "Wisconsin",
    "County": "Waushara"
  },
  {
    "FIPS": 55139,
    "State": "Wisconsin",
    "County": "Winnebago"
  },
  {
    "FIPS": 55141,
    "State": "Wisconsin",
    "County": "Wood"
  },
  {
    "FIPS": 56001,
    "State": "Wyoming",
    "County": "Albany"
  },
  {
    "FIPS": 56003,
    "State": "Wyoming",
    "County": "Big Horn"
  },
  {
    "FIPS": 56005,
    "State": "Wyoming",
    "County": "Campbell"
  },
  {
    "FIPS": 56007,
    "State": "Wyoming",
    "County": "Carbon"
  },
  {
    "FIPS": 56009,
    "State": "Wyoming",
    "County": "Converse"
  },
  {
    "FIPS": 56011,
    "State": "Wyoming",
    "County": "Crook"
  },
  {
    "FIPS": 56013,
    "State": "Wyoming",
    "County": "Fremont"
  },
  {
    "FIPS": 56015,
    "State": "Wyoming",
    "County": "Goshen"
  },
  {
    "FIPS": 56017,
    "State": "Wyoming",
    "County": "Hot Springs"
  },
  {
    "FIPS": 56019,
    "State": "Wyoming",
    "County": "Johnson"
  },
  {
    "FIPS": 56021,
    "State": "Wyoming",
    "County": "Laramie"
  },
  {
    "FIPS": 56023,
    "State": "Wyoming",
    "County": "Lincoln"
  },
  {
    "FIPS": 56025,
    "State": "Wyoming",
    "County": "Natrona"
  },
  {
    "FIPS": 56027,
    "State": "Wyoming",
    "County": "Niobrara"
  },
  {
    "FIPS": 56029,
    "State": "Wyoming",
    "County": "Park"
  },
  {
    "FIPS": 56031,
    "State": "Wyoming",
    "County": "Platte"
  },
  {
    "FIPS": 56033,
    "State": "Wyoming",
    "County": "Sheridan"
  },
  {
    "FIPS": 56035,
    "State": "Wyoming",
    "County": "Sublette"
  },
  {
    "FIPS": 56037,
    "State": "Wyoming",
    "County": "Sweetwater"
  },
  {
    "FIPS": 56039,
    "State": "Wyoming",
    "County": "Teton"
  },
  {
    "FIPS": 56041,
    "State": "Wyoming",
    "County": "Uinta"
  },
  {
    "FIPS": 56043,
    "State": "Wyoming",
    "County": "Washakie"
  },
  {
    "FIPS": 56045,
    "State": "Wyoming",
    "County": "Washakie"
  }
];

export default FipsCodes;
