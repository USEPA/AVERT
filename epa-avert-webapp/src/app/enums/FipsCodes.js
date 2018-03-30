// @flow

type Code = {
  code: number,
  state: string,
  county: string,
};

const FipsCodes: Array<Code> = [
  {
    code: '01001',
    state: 'Alabama',
    county: 'Autauga',
  },
  {
    code: '01003',
    state: 'Alabama',
    county: 'Baldwin',
  },
  {
    code: '01005',
    state: 'Alabama',
    county: 'Barbour',
  },
  {
    code: '01007',
    state: 'Alabama',
    county: 'Bibb',
  },
  {
    code: '01009',
    state: 'Alabama',
    county: 'Blount',
  },
  {
    code: '01011',
    state: 'Alabama',
    county: 'Bullock',
  },
  {
    code: '01013',
    state: 'Alabama',
    county: 'Butler',
  },
  {
    code: '01015',
    state: 'Alabama',
    county: 'Calhoun',
  },
  {
    code: '01017',
    state: 'Alabama',
    county: 'Chambers',
  },
  {
    code: '01019',
    state: 'Alabama',
    county: 'Cherokee',
  },
  {
    code: '01021',
    state: 'Alabama',
    county: 'Chilton',
  },
  {
    code: '01023',
    state: 'Alabama',
    county: 'Choctaw',
  },
  {
    code: '01025',
    state: 'Alabama',
    county: 'Clarke',
  },
  {
    code: '01027',
    state: 'Alabama',
    county: 'Clay',
  },
  {
    code: '01029',
    state: 'Alabama',
    county: 'Cleburne',
  },
  {
    code: '01031',
    state: 'Alabama',
    county: 'Coffee',
  },
  {
    code: '01033',
    state: 'Alabama',
    county: 'Colbert',
  },
  {
    code: '01035',
    state: 'Alabama',
    county: 'Conecuh',
  },
  {
    code: '01037',
    state: 'Alabama',
    county: 'Coosa',
  },
  {
    code: '01039',
    state: 'Alabama',
    county: 'Covington',
  },
  {
    code: '01041',
    state: 'Alabama',
    county: 'Crenshaw',
  },
  {
    code: '01043',
    state: 'Alabama',
    county: 'Cullman',
  },
  {
    code: '01045',
    state: 'Alabama',
    county: 'Dale',
  },
  {
    code: '01047',
    state: 'Alabama',
    county: 'Dallas',
  },
  {
    code: '01049',
    state: 'Alabama',
    county: 'DeKalb',
  },
  {
    code: '01051',
    state: 'Alabama',
    county: 'Elmore',
  },
  {
    code: '01053',
    state: 'Alabama',
    county: 'Escambia',
  },
  {
    code: '01055',
    state: 'Alabama',
    county: 'Etowah',
  },
  {
    code: '01057',
    state: 'Alabama',
    county: 'Fayette',
  },
  {
    code: '01059',
    state: 'Alabama',
    county: 'Franklin',
  },
  {
    code: '01061',
    state: 'Alabama',
    county: 'Geneva',
  },
  {
    code: '01063',
    state: 'Alabama',
    county: 'Greene',
  },
  {
    code: '01065',
    state: 'Alabama',
    county: 'Hale',
  },
  {
    code: '01067',
    state: 'Alabama',
    county: 'Henry',
  },
  {
    code: '01069',
    state: 'Alabama',
    county: 'Houston',
  },
  {
    code: '01071',
    state: 'Alabama',
    county: 'Jackson',
  },
  {
    code: '01073',
    state: 'Alabama',
    county: 'Jefferson',
  },
  {
    code: '01075',
    state: 'Alabama',
    county: 'Lamar',
  },
  {
    code: '01077',
    state: 'Alabama',
    county: 'Lauderdale',
  },
  {
    code: '01079',
    state: 'Alabama',
    county: 'Lawrence',
  },
  {
    code: '01081',
    state: 'Alabama',
    county: 'Lee',
  },
  {
    code: '01083',
    state: 'Alabama',
    county: 'Limestone',
  },
  {
    code: '01085',
    state: 'Alabama',
    county: 'Lowndes',
  },
  {
    code: '01087',
    state: 'Alabama',
    county: 'Macon',
  },
  {
    code: '01089',
    state: 'Alabama',
    county: 'Madison',
  },
  {
    code: '01091',
    state: 'Alabama',
    county: 'Marengo',
  },
  {
    code: '01093',
    state: 'Alabama',
    county: 'Marion',
  },
  {
    code: '01095',
    state: 'Alabama',
    county: 'Marshall',
  },
  {
    code: '01097',
    state: 'Alabama',
    county: 'Mobile',
  },
  {
    code: '01099',
    state: 'Alabama',
    county: 'Monroe',
  },
  {
    code: '01101',
    state: 'Alabama',
    county: 'Montgomery',
  },
  {
    code: '01103',
    state: 'Alabama',
    county: 'Morgan',
  },
  {
    code: '01105',
    state: 'Alabama',
    county: 'Perry',
  },
  {
    code: '01107',
    state: 'Alabama',
    county: 'Pickens',
  },
  {
    code: '01109',
    state: 'Alabama',
    county: 'Pike',
  },
  {
    code: '01111',
    state: 'Alabama',
    county: 'Randolph',
  },
  {
    code: '01113',
    state: 'Alabama',
    county: 'Russell',
  },
  {
    code: '01115',
    state: 'Alabama',
    county: 'St. Clair',
  },
  {
    code: '01117',
    state: 'Alabama',
    county: 'Shelby',
  },
  {
    code: '01119',
    state: 'Alabama',
    county: 'Sumter',
  },
  {
    code: '01121',
    state: 'Alabama',
    county: 'Talladega',
  },
  {
    code: '01123',
    state: 'Alabama',
    county: 'Tallapoosa',
  },
  {
    code: '01125',
    state: 'Alabama',
    county: 'Tuscaloosa',
  },
  {
    code: '01127',
    state: 'Alabama',
    county: 'Walker',
  },
  {
    code: '01129',
    state: 'Alabama',
    county: 'Washington',
  },
  {
    code: '01131',
    state: 'Alabama',
    county: 'Wilcox',
  },
  {
    code: '01133',
    state: 'Alabama',
    county: 'Winston',
  },
  {
    code: '02013',
    state: 'Alaska',
    county: 'Aleutians East',
  },
  {
    code: '02016',
    state: 'Alaska',
    county: 'Aleutians West',
  },
  {
    code: '02020',
    state: 'Alaska',
    county: 'Anchorage',
  },
  {
    code: '02050',
    state: 'Alaska',
    county: 'Bethel',
  },
  {
    code: '02060',
    state: 'Alaska',
    county: 'Bristol Bay',
  },
  {
    code: '02068',
    state: 'Alaska',
    county: 'Denali',
  },
  {
    code: '02070',
    state: 'Alaska',
    county: 'Dillingham',
  },
  {
    code: '02090',
    state: 'Alaska',
    county: 'Fairbanks North Star',
  },
  {
    code: '02100',
    state: 'Alaska',
    county: 'Haines',
  },
  {
    code: '02105',
    state: 'Alaska',
    county: 'Hoonah-Angoon',
  },
  {
    code: '02110',
    state: 'Alaska',
    county: 'Juneau',
  },
  {
    code: '02122',
    state: 'Alaska',
    county: 'Kenai Peninsula',
  },
  {
    code: '02130',
    state: 'Alaska',
    county: 'Ketchikan Gateway',
  },
  {
    code: '02150',
    state: 'Alaska',
    county: 'Kodiak Island',
  },
  {
    code: '02164',
    state: 'Alaska',
    county: 'Lake and Peninsula',
  },
  {
    code: '02170',
    state: 'Alaska',
    county: 'Matanuska-Susitna',
  },
  {
    code: '02180',
    state: 'Alaska',
    county: 'Nome',
  },
  {
    code: '02185',
    state: 'Alaska',
    county: 'North Slope',
  },
  {
    code: '02188',
    state: 'Alaska',
    county: 'Northwest Arctic',
  },
  {
    code: '02195',
    state: 'Alaska',
    county: 'Petersburg',
  },
  {
    code: '02198',
    state: 'Alaska',
    county: 'Prince of Wales-Hyder',
  },
  {
    code: '02220',
    state: 'Alaska',
    county: 'Sitka',
  },
  {
    code: '02230',
    state: 'Alaska',
    county: 'Skagway',
  },
  {
    code: '02240',
    state: 'Alaska',
    county: 'Southeast Fairbanks',
  },
  {
    code: '02261',
    state: 'Alaska',
    county: 'Valdez-Cordova',
  },
  {
    code: '02270',
    state: 'Alaska',
    county: 'Wade Hampton',
  },
  {
    code: '02275',
    state: 'Alaska',
    county: 'Wrangell',
  },
  {
    code: '02282',
    state: 'Alaska',
    county: 'Yakutat',
  },
  {
    code: '02290',
    state: 'Alaska',
    county: 'Yukon-Koyukuk',
  },
  {
    code: '04001',
    state: 'Arizona',
    county: 'Apache',
  },
  {
    code: '04003',
    state: 'Arizona',
    county: 'Cochise',
  },
  {
    code: '04005',
    state: 'Arizona',
    county: 'Coconino',
  },
  {
    code: '04007',
    state: 'Arizona',
    county: 'Gila',
  },
  {
    code: '04009',
    state: 'Arizona',
    county: 'Graham',
  },
  {
    code: '04011',
    state: 'Arizona',
    county: 'Greenlee',
  },
  {
    code: '04012',
    state: 'Arizona',
    county: 'La Paz',
  },
  {
    code: '04013',
    state: 'Arizona',
    county: 'Maricopa',
  },
  {
    code: '04015',
    state: 'Arizona',
    county: 'Mohave',
  },
  {
    code: '04017',
    state: 'Arizona',
    county: 'Navajo',
  },
  {
    code: '04019',
    state: 'Arizona',
    county: 'Pima',
  },
  {
    code: '04021',
    state: 'Arizona',
    county: 'Pinal',
  },
  {
    code: '04023',
    state: 'Arizona',
    county: 'Santa Cruz',
  },
  {
    code: '04025',
    state: 'Arizona',
    county: 'Yavapai',
  },
  {
    code: '04027',
    state: 'Arizona',
    county: 'Yuma',
  },
  {
    code: '05001',
    state: 'Arkansas',
    county: 'Arkansas',
  },
  {
    code: '05003',
    state: 'Arkansas',
    county: 'Ashley',
  },
  {
    code: '05005',
    state: 'Arkansas',
    county: 'Baxter',
  },
  {
    code: '05007',
    state: 'Arkansas',
    county: 'Benton',
  },
  {
    code: '05009',
    state: 'Arkansas',
    county: 'Boone',
  },
  {
    code: '05011',
    state: 'Arkansas',
    county: 'Bradley',
  },
  {
    code: '05013',
    state: 'Arkansas',
    county: 'Calhoun',
  },
  {
    code: '05015',
    state: 'Arkansas',
    county: 'Carroll',
  },
  {
    code: '05017',
    state: 'Arkansas',
    county: 'Chicot',
  },
  {
    code: '05019',
    state: 'Arkansas',
    county: 'Clark',
  },
  {
    code: '05021',
    state: 'Arkansas',
    county: 'Clay',
  },
  {
    code: '05023',
    state: 'Arkansas',
    county: 'Cleburne',
  },
  {
    code: '05025',
    state: 'Arkansas',
    county: 'Cleveland',
  },
  {
    code: '05027',
    state: 'Arkansas',
    county: 'Columbia',
  },
  {
    code: '05029',
    state: 'Arkansas',
    county: 'Conway',
  },
  {
    code: '05031',
    state: 'Arkansas',
    county: 'Craighead',
  },
  {
    code: '05033',
    state: 'Arkansas',
    county: 'Crawford',
  },
  {
    code: '05035',
    state: 'Arkansas',
    county: 'Crittenden',
  },
  {
    code: '05037',
    state: 'Arkansas',
    county: 'Cross',
  },
  {
    code: '05039',
    state: 'Arkansas',
    county: 'Dallas',
  },
  {
    code: '05041',
    state: 'Arkansas',
    county: 'Desha',
  },
  {
    code: '05043',
    state: 'Arkansas',
    county: 'Drew',
  },
  {
    code: '05045',
    state: 'Arkansas',
    county: 'Faulkner',
  },
  {
    code: '05047',
    state: 'Arkansas',
    county: 'Franklin',
  },
  {
    code: '05049',
    state: 'Arkansas',
    county: 'Fulton',
  },
  {
    code: '05051',
    state: 'Arkansas',
    county: 'Garland',
  },
  {
    code: '05053',
    state: 'Arkansas',
    county: 'Grant',
  },
  {
    code: '05055',
    state: 'Arkansas',
    county: 'Greene',
  },
  {
    code: '05057',
    state: 'Arkansas',
    county: 'Hempstead',
  },
  {
    code: '05059',
    state: 'Arkansas',
    county: 'Hot Spring',
  },
  {
    code: '05061',
    state: 'Arkansas',
    county: 'Howard',
  },
  {
    code: '05063',
    state: 'Arkansas',
    county: 'Independence',
  },
  {
    code: '05065',
    state: 'Arkansas',
    county: 'Izard',
  },
  {
    code: '05067',
    state: 'Arkansas',
    county: 'Jackson',
  },
  {
    code: '05069',
    state: 'Arkansas',
    county: 'Jefferson',
  },
  {
    code: '05071',
    state: 'Arkansas',
    county: 'Johnson',
  },
  {
    code: '05073',
    state: 'Arkansas',
    county: 'Lafayette',
  },
  {
    code: '05075',
    state: 'Arkansas',
    county: 'Lawrence',
  },
  {
    code: '05077',
    state: 'Arkansas',
    county: 'Lee',
  },
  {
    code: '05079',
    state: 'Arkansas',
    county: 'Lincoln',
  },
  {
    code: '05081',
    state: 'Arkansas',
    county: 'Little River',
  },
  {
    code: '05083',
    state: 'Arkansas',
    county: 'Logan',
  },
  {
    code: '05085',
    state: 'Arkansas',
    county: 'Lonoke',
  },
  {
    code: '05087',
    state: 'Arkansas',
    county: 'Madison',
  },
  {
    code: '05089',
    state: 'Arkansas',
    county: 'Marion',
  },
  {
    code: '05091',
    state: 'Arkansas',
    county: 'Miller',
  },
  {
    code: '05093',
    state: 'Arkansas',
    county: 'Mississippi',
  },
  {
    code: '05095',
    state: 'Arkansas',
    county: 'Monroe',
  },
  {
    code: '05097',
    state: 'Arkansas',
    county: 'Montgomery',
  },
  {
    code: '05099',
    state: 'Arkansas',
    county: 'Nevada',
  },
  {
    code: '05101',
    state: 'Arkansas',
    county: 'Newton',
  },
  {
    code: '05103',
    state: 'Arkansas',
    county: 'Ouachita',
  },
  {
    code: '05105',
    state: 'Arkansas',
    county: 'Perry',
  },
  {
    code: '05107',
    state: 'Arkansas',
    county: 'Phillips',
  },
  {
    code: '05109',
    state: 'Arkansas',
    county: 'Pike',
  },
  {
    code: '05111',
    state: 'Arkansas',
    county: 'Poinsett',
  },
  {
    code: '05113',
    state: 'Arkansas',
    county: 'Polk',
  },
  {
    code: '05115',
    state: 'Arkansas',
    county: 'Pope',
  },
  {
    code: '05117',
    state: 'Arkansas',
    county: 'Prairie',
  },
  {
    code: '05119',
    state: 'Arkansas',
    county: 'Pulaski',
  },
  {
    code: '05121',
    state: 'Arkansas',
    county: 'Randolph',
  },
  {
    code: '05123',
    state: 'Arkansas',
    county: 'St. Francis',
  },
  {
    code: '05125',
    state: 'Arkansas',
    county: 'Saline',
  },
  {
    code: '05127',
    state: 'Arkansas',
    county: 'Scott',
  },
  {
    code: '05129',
    state: 'Arkansas',
    county: 'Searcy',
  },
  {
    code: '05131',
    state: 'Arkansas',
    county: 'Sebastian',
  },
  {
    code: '05133',
    state: 'Arkansas',
    county: 'Sevier',
  },
  {
    code: '05135',
    state: 'Arkansas',
    county: 'Sharp',
  },
  {
    code: '05137',
    state: 'Arkansas',
    county: 'Stone',
  },
  {
    code: '05139',
    state: 'Arkansas',
    county: 'Union',
  },
  {
    code: '05141',
    state: 'Arkansas',
    county: 'Van Buren',
  },
  {
    code: '05143',
    state: 'Arkansas',
    county: 'Washington',
  },
  {
    code: '05145',
    state: 'Arkansas',
    county: 'White',
  },
  {
    code: '05147',
    state: 'Arkansas',
    county: 'Woodruff',
  },
  {
    code: '05149',
    state: 'Arkansas',
    county: 'Yell',
  },
  {
    code: '06001',
    state: 'California',
    county: 'Alameda',
  },
  {
    code: '06003',
    state: 'California',
    county: 'Alpine',
  },
  {
    code: '06005',
    state: 'California',
    county: 'Amador',
  },
  {
    code: '06007',
    state: 'California',
    county: 'Butte',
  },
  {
    code: '06009',
    state: 'California',
    county: 'Calaveras',
  },
  {
    code: '06011',
    state: 'California',
    county: 'Colusa',
  },
  {
    code: '06013',
    state: 'California',
    county: 'Contra Costa',
  },
  {
    code: '06015',
    state: 'California',
    county: 'Del Norte',
  },
  {
    code: '06017',
    state: 'California',
    county: 'El Dorado',
  },
  {
    code: '06019',
    state: 'California',
    county: 'Fresno',
  },
  {
    code: '06021',
    state: 'California',
    county: 'Glenn',
  },
  {
    code: '06023',
    state: 'California',
    county: 'Humboldt',
  },
  {
    code: '06025',
    state: 'California',
    county: 'Imperial',
  },
  {
    code: '06027',
    state: 'California',
    county: 'Inyo',
  },
  {
    code: '06029',
    state: 'California',
    county: 'Kern',
  },
  {
    code: '06031',
    state: 'California',
    county: 'Kings',
  },
  {
    code: '06033',
    state: 'California',
    county: 'Lake',
  },
  {
    code: '06035',
    state: 'California',
    county: 'Lassen',
  },
  {
    code: '06037',
    state: 'California',
    county: 'Los Angeles',
  },
  {
    code: '06039',
    state: 'California',
    county: 'Madera',
  },
  {
    code: '06041',
    state: 'California',
    county: 'Marin',
  },
  {
    code: '06043',
    state: 'California',
    county: 'Mariposa',
  },
  {
    code: '06045',
    state: 'California',
    county: 'Mendocino',
  },
  {
    code: '06047',
    state: 'California',
    county: 'Merced',
  },
  {
    code: '06049',
    state: 'California',
    county: 'Modoc',
  },
  {
    code: '06051',
    state: 'California',
    county: 'Mono',
  },
  {
    code: '06053',
    state: 'California',
    county: 'Monterey',
  },
  {
    code: '06055',
    state: 'California',
    county: 'Napa',
  },
  {
    code: '06057',
    state: 'California',
    county: 'Nevada',
  },
  {
    code: '06059',
    state: 'California',
    county: 'Orange',
  },
  {
    code: '06061',
    state: 'California',
    county: 'Placer',
  },
  {
    code: '06063',
    state: 'California',
    county: 'Plumas',
  },
  {
    code: '06065',
    state: 'California',
    county: 'Riverside',
  },
  {
    code: '06067',
    state: 'California',
    county: 'Sacramento',
  },
  {
    code: '06069',
    state: 'California',
    county: 'San Benito',
  },
  {
    code: '06071',
    state: 'California',
    county: 'San Bernardino',
  },
  {
    code: '06073',
    state: 'California',
    county: 'San Diego',
  },
  {
    code: '06075',
    state: 'California',
    county: 'San Francisco',
  },
  {
    code: '06077',
    state: 'California',
    county: 'San Joaquin',
  },
  {
    code: '06079',
    state: 'California',
    county: 'San Luis Obispo',
  },
  {
    code: '06081',
    state: 'California',
    county: 'San Mateo',
  },
  {
    code: '06083',
    state: 'California',
    county: 'Santa Barbara',
  },
  {
    code: '06085',
    state: 'California',
    county: 'Santa Clara',
  },
  {
    code: '06087',
    state: 'California',
    county: 'Santa Cruz',
  },
  {
    code: '06089',
    state: 'California',
    county: 'Shasta',
  },
  {
    code: '06091',
    state: 'California',
    county: 'Sierra',
  },
  {
    code: '06093',
    state: 'California',
    county: 'Siskiyou',
  },
  {
    code: '06095',
    state: 'California',
    county: 'Solano',
  },
  {
    code: '06097',
    state: 'California',
    county: 'Sonoma',
  },
  {
    code: '06099',
    state: 'California',
    county: 'Stanislaus',
  },
  {
    code: '06101',
    state: 'California',
    county: 'Sutter',
  },
  {
    code: '06103',
    state: 'California',
    county: 'Tehama',
  },
  {
    code: '06105',
    state: 'California',
    county: 'Trinity',
  },
  {
    code: '06107',
    state: 'California',
    county: 'Tulare',
  },
  {
    code: '06109',
    state: 'California',
    county: 'Tuolumne',
  },
  {
    code: '06111',
    state: 'California',
    county: 'Ventura',
  },
  {
    code: '06113',
    state: 'California',
    county: 'Yolo',
  },
  {
    code: '06115',
    state: 'California',
    county: 'Yuba',
  },
  {
    code: '08001',
    state: 'Colorado',
    county: 'Adams',
  },
  {
    code: '08003',
    state: 'Colorado',
    county: 'Alamosa',
  },
  {
    code: '08005',
    state: 'Colorado',
    county: 'Arapahoe',
  },
  {
    code: '08007',
    state: 'Colorado',
    county: 'Archuleta',
  },
  {
    code: '08009',
    state: 'Colorado',
    county: 'Baca',
  },
  {
    code: '08011',
    state: 'Colorado',
    county: 'Bent',
  },
  {
    code: '08013',
    state: 'Colorado',
    county: 'Boulder',
  },
  {
    code: '08014',
    state: 'Colorado',
    county: 'Broomfield',
  },
  {
    code: '08015',
    state: 'Colorado',
    county: 'Chaffee',
  },
  {
    code: '08017',
    state: 'Colorado',
    county: 'Cheyenne',
  },
  {
    code: '08019',
    state: 'Colorado',
    county: 'Clear Creek',
  },
  {
    code: '08021',
    state: 'Colorado',
    county: 'Conejos',
  },
  {
    code: '08023',
    state: 'Colorado',
    county: 'Costilla',
  },
  {
    code: '08025',
    state: 'Colorado',
    county: 'Crowley',
  },
  {
    code: '08027',
    state: 'Colorado',
    county: 'Custer',
  },
  {
    code: '08029',
    state: 'Colorado',
    county: 'Delta',
  },
  {
    code: '08031',
    state: 'Colorado',
    county: 'Denver',
  },
  {
    code: '08033',
    state: 'Colorado',
    county: 'Dolores',
  },
  {
    code: '08035',
    state: 'Colorado',
    county: 'Douglas',
  },
  {
    code: '08037',
    state: 'Colorado',
    county: 'Eagle',
  },
  {
    code: '08039',
    state: 'Colorado',
    county: 'Elbert',
  },
  {
    code: '08041',
    state: 'Colorado',
    county: 'El Paso',
  },
  {
    code: '08043',
    state: 'Colorado',
    county: 'Fremont',
  },
  {
    code: '08045',
    state: 'Colorado',
    county: 'Garfield',
  },
  {
    code: '08047',
    state: 'Colorado',
    county: 'Gilpin',
  },
  {
    code: '08049',
    state: 'Colorado',
    county: 'Grand',
  },
  {
    code: '08051',
    state: 'Colorado',
    county: 'Gunnison',
  },
  {
    code: '08053',
    state: 'Colorado',
    county: 'Hinsdale',
  },
  {
    code: '08055',
    state: 'Colorado',
    county: 'Huerfano',
  },
  {
    code: '08057',
    state: 'Colorado',
    county: 'Jackson',
  },
  {
    code: '08059',
    state: 'Colorado',
    county: 'Jefferson',
  },
  {
    code: '08061',
    state: 'Colorado',
    county: 'Kiowa',
  },
  {
    code: '08063',
    state: 'Colorado',
    county: 'Kit Carson',
  },
  {
    code: '08065',
    state: 'Colorado',
    county: 'Lake',
  },
  {
    code: '08067',
    state: 'Colorado',
    county: 'La Plata',
  },
  {
    code: '08069',
    state: 'Colorado',
    county: 'Larimer',
  },
  {
    code: '08071',
    state: 'Colorado',
    county: 'Las Animas',
  },
  {
    code: '08073',
    state: 'Colorado',
    county: 'Lincoln',
  },
  {
    code: '08075',
    state: 'Colorado',
    county: 'Logan',
  },
  {
    code: '08077',
    state: 'Colorado',
    county: 'Mesa',
  },
  {
    code: '08079',
    state: 'Colorado',
    county: 'Mineral',
  },
  {
    code: '08081',
    state: 'Colorado',
    county: 'Moffat',
  },
  {
    code: '08083',
    state: 'Colorado',
    county: 'Montezuma',
  },
  {
    code: '08085',
    state: 'Colorado',
    county: 'Montrose',
  },
  {
    code: '08087',
    state: 'Colorado',
    county: 'Morgan',
  },
  {
    code: '08089',
    state: 'Colorado',
    county: 'Otero',
  },
  {
    code: '08091',
    state: 'Colorado',
    county: 'Ouray',
  },
  {
    code: '08093',
    state: 'Colorado',
    county: 'Park',
  },
  {
    code: '08095',
    state: 'Colorado',
    county: 'Phillips',
  },
  {
    code: '08097',
    state: 'Colorado',
    county: 'Pitkin',
  },
  {
    code: '08099',
    state: 'Colorado',
    county: 'Prowers',
  },
  {
    code: '08101',
    state: 'Colorado',
    county: 'Pueblo',
  },
  {
    code: '08103',
    state: 'Colorado',
    county: 'Rio Blanco',
  },
  {
    code: '08105',
    state: 'Colorado',
    county: 'Rio Grande',
  },
  {
    code: '08107',
    state: 'Colorado',
    county: 'Routt',
  },
  {
    code: '08109',
    state: 'Colorado',
    county: 'Saguache',
  },
  {
    code: '08111',
    state: 'Colorado',
    county: 'San Juan',
  },
  {
    code: '08113',
    state: 'Colorado',
    county: 'San Miguel',
  },
  {
    code: '08115',
    state: 'Colorado',
    county: 'Sedgwick',
  },
  {
    code: '08117',
    state: 'Colorado',
    county: 'Summit',
  },
  {
    code: '08119',
    state: 'Colorado',
    county: 'Teller',
  },
  {
    code: '08121',
    state: 'Colorado',
    county: 'Washington',
  },
  {
    code: '08123',
    state: 'Colorado',
    county: 'Weld',
  },
  {
    code: '08125',
    state: 'Colorado',
    county: 'Yuma',
  },
  {
    code: '09001',
    state: 'Connecticut',
    county: 'Fairfield',
  },
  {
    code: '09003',
    state: 'Connecticut',
    county: 'Hartford',
  },
  {
    code: '09005',
    state: 'Connecticut',
    county: 'Litchfield',
  },
  {
    code: '09007',
    state: 'Connecticut',
    county: 'Middlesex',
  },
  {
    code: '09009',
    state: 'Connecticut',
    county: 'New Haven',
  },
  {
    code: '09011',
    state: 'Connecticut',
    county: 'New London',
  },
  {
    code: '09013',
    state: 'Connecticut',
    county: 'Tolland',
  },
  {
    code: '09015',
    state: 'Connecticut',
    county: 'Windham',
  },
  {
    code: '10001',
    state: 'Delaware',
    county: 'Kent',
  },
  {
    code: '10003',
    state: 'Delaware',
    county: 'New Castle',
  },
  {
    code: '10005',
    state: 'Delaware',
    county: 'Sussex',
  },
  {
    code: '11001',
    state: 'District of Columbia',
    county: 'District of Columbia',
  },
  {
    code: '12001',
    state: 'Florida',
    county: 'Alachua',
  },
  {
    code: '12003',
    state: 'Florida',
    county: 'Baker',
  },
  {
    code: '12005',
    state: 'Florida',
    county: 'Bay',
  },
  {
    code: '12007',
    state: 'Florida',
    county: 'Bradford',
  },
  {
    code: '12009',
    state: 'Florida',
    county: 'Brevard',
  },
  {
    code: '12011',
    state: 'Florida',
    county: 'Broward',
  },
  {
    code: '12013',
    state: 'Florida',
    county: 'Calhoun',
  },
  {
    code: '12015',
    state: 'Florida',
    county: 'Charlotte',
  },
  {
    code: '12017',
    state: 'Florida',
    county: 'Citrus',
  },
  {
    code: '12019',
    state: 'Florida',
    county: 'Clay',
  },
  {
    code: '12021',
    state: 'Florida',
    county: 'Collier',
  },
  {
    code: '12023',
    state: 'Florida',
    county: 'Columbia',
  },
  {
    code: '12027',
    state: 'Florida',
    county: 'DeSoto',
  },
  {
    code: '12029',
    state: 'Florida',
    county: 'Dixie',
  },
  {
    code: '12031',
    state: 'Florida',
    county: 'Duval',
  },
  {
    code: '12033',
    state: 'Florida',
    county: 'Escambia',
  },
  {
    code: '12035',
    state: 'Florida',
    county: 'Flagler',
  },
  {
    code: '12037',
    state: 'Florida',
    county: 'Franklin',
  },
  {
    code: '12039',
    state: 'Florida',
    county: 'Gadsden',
  },
  {
    code: '12041',
    state: 'Florida',
    county: 'Gilchrist',
  },
  {
    code: '12043',
    state: 'Florida',
    county: 'Glades',
  },
  {
    code: '12045',
    state: 'Florida',
    county: 'Gulf',
  },
  {
    code: '12047',
    state: 'Florida',
    county: 'Hamilton',
  },
  {
    code: '12049',
    state: 'Florida',
    county: 'Hardee',
  },
  {
    code: '12051',
    state: 'Florida',
    county: 'Hendry',
  },
  {
    code: '12053',
    state: 'Florida',
    county: 'Hernando',
  },
  {
    code: '12055',
    state: 'Florida',
    county: 'Highlands',
  },
  {
    code: '12057',
    state: 'Florida',
    county: 'Hillsborough',
  },
  {
    code: '12059',
    state: 'Florida',
    county: 'Holmes',
  },
  {
    code: '12061',
    state: 'Florida',
    county: 'Indian River',
  },
  {
    code: '12063',
    state: 'Florida',
    county: 'Jackson',
  },
  {
    code: '12065',
    state: 'Florida',
    county: 'Jefferson',
  },
  {
    code: '12067',
    state: 'Florida',
    county: 'Lafayette',
  },
  {
    code: '12069',
    state: 'Florida',
    county: 'Lake',
  },
  {
    code: '12071',
    state: 'Florida',
    county: 'Lee',
  },
  {
    code: '12073',
    state: 'Florida',
    county: 'Leon',
  },
  {
    code: '12075',
    state: 'Florida',
    county: 'Levy',
  },
  {
    code: '12077',
    state: 'Florida',
    county: 'Liberty',
  },
  {
    code: '12079',
    state: 'Florida',
    county: 'Madison',
  },
  {
    code: '12081',
    state: 'Florida',
    county: 'Manatee',
  },
  {
    code: '12083',
    state: 'Florida',
    county: 'Marion',
  },
  {
    code: '12085',
    state: 'Florida',
    county: 'Martin',
  },
  {
    code: '12086',
    state: 'Florida',
    county: 'Miami-Dade',
  },
  {
    code: '12087',
    state: 'Florida',
    county: 'Monroe',
  },
  {
    code: '12089',
    state: 'Florida',
    county: 'Nassau',
  },
  {
    code: '12091',
    state: 'Florida',
    county: 'Okaloosa',
  },
  {
    code: '12093',
    state: 'Florida',
    county: 'Okeechobee',
  },
  {
    code: '12095',
    state: 'Florida',
    county: 'Orange',
  },
  {
    code: '12097',
    state: 'Florida',
    county: 'Osceola',
  },
  {
    code: '12099',
    state: 'Florida',
    county: 'Palm Beach',
  },
  {
    code: '12101',
    state: 'Florida',
    county: 'Pasco',
  },
  {
    code: '12103',
    state: 'Florida',
    county: 'Pinellas',
  },
  {
    code: '12105',
    state: 'Florida',
    county: 'Polk',
  },
  {
    code: '12107',
    state: 'Florida',
    county: 'Putnam',
  },
  {
    code: '12109',
    state: 'Florida',
    county: 'St. Johns',
  },
  {
    code: '12111',
    state: 'Florida',
    county: 'St. Lucie',
  },
  {
    code: '12113',
    state: 'Florida',
    county: 'Santa Rosa',
  },
  {
    code: '12115',
    state: 'Florida',
    county: 'Sarasota',
  },
  {
    code: '12117',
    state: 'Florida',
    county: 'Seminole',
  },
  {
    code: '12119',
    state: 'Florida',
    county: 'Sumter',
  },
  {
    code: '12121',
    state: 'Florida',
    county: 'Suwannee',
  },
  {
    code: '12123',
    state: 'Florida',
    county: 'Taylor',
  },
  {
    code: '12125',
    state: 'Florida',
    county: 'Union',
  },
  {
    code: '12127',
    state: 'Florida',
    county: 'Volusia',
  },
  {
    code: '12129',
    state: 'Florida',
    county: 'Wakulla',
  },
  {
    code: '12131',
    state: 'Florida',
    county: 'Walton',
  },
  {
    code: '12133',
    state: 'Florida',
    county: 'Washington',
  },
  {
    code: '13001',
    state: 'Georgia',
    county: 'Appling',
  },
  {
    code: '13003',
    state: 'Georgia',
    county: 'Atkinson',
  },
  {
    code: '13005',
    state: 'Georgia',
    county: 'Bacon',
  },
  {
    code: '13007',
    state: 'Georgia',
    county: 'Baker',
  },
  {
    code: '13009',
    state: 'Georgia',
    county: 'Baldwin',
  },
  {
    code: '13011',
    state: 'Georgia',
    county: 'Banks',
  },
  {
    code: '13013',
    state: 'Georgia',
    county: 'Barrow',
  },
  {
    code: '13015',
    state: 'Georgia',
    county: 'Bartow',
  },
  {
    code: '13017',
    state: 'Georgia',
    county: 'Ben Hill',
  },
  {
    code: '13019',
    state: 'Georgia',
    county: 'Berrien',
  },
  {
    code: '13021',
    state: 'Georgia',
    county: 'Bibb',
  },
  {
    code: '13023',
    state: 'Georgia',
    county: 'Bleckley',
  },
  {
    code: '13025',
    state: 'Georgia',
    county: 'Brantley',
  },
  {
    code: '13027',
    state: 'Georgia',
    county: 'Brooks',
  },
  {
    code: '13029',
    state: 'Georgia',
    county: 'Bryan',
  },
  {
    code: '13031',
    state: 'Georgia',
    county: 'Bulloch',
  },
  {
    code: '13033',
    state: 'Georgia',
    county: 'Burke',
  },
  {
    code: '13035',
    state: 'Georgia',
    county: 'Butts',
  },
  {
    code: '13037',
    state: 'Georgia',
    county: 'Calhoun',
  },
  {
    code: '13039',
    state: 'Georgia',
    county: 'Camden',
  },
  {
    code: '13043',
    state: 'Georgia',
    county: 'Candler',
  },
  {
    code: '13045',
    state: 'Georgia',
    county: 'Carroll',
  },
  {
    code: '13047',
    state: 'Georgia',
    county: 'Catoosa',
  },
  {
    code: '13049',
    state: 'Georgia',
    county: 'Charlton',
  },
  {
    code: '13051',
    state: 'Georgia',
    county: 'Chatham',
  },
  {
    code: '13053',
    state: 'Georgia',
    county: 'Chattahoochee',
  },
  {
    code: '13055',
    state: 'Georgia',
    county: 'Chattooga',
  },
  {
    code: '13057',
    state: 'Georgia',
    county: 'Cherokee',
  },
  {
    code: '13059',
    state: 'Georgia',
    county: 'Clarke',
  },
  {
    code: '13061',
    state: 'Georgia',
    county: 'Clay',
  },
  {
    code: '13063',
    state: 'Georgia',
    county: 'Clayton',
  },
  {
    code: '13065',
    state: 'Georgia',
    county: 'Clinch',
  },
  {
    code: '13067',
    state: 'Georgia',
    county: 'Cobb',
  },
  {
    code: '13069',
    state: 'Georgia',
    county: 'Coffee',
  },
  {
    code: '13071',
    state: 'Georgia',
    county: 'Colquitt',
  },
  {
    code: '13073',
    state: 'Georgia',
    county: 'Columbia',
  },
  {
    code: '13075',
    state: 'Georgia',
    county: 'Cook',
  },
  {
    code: '13077',
    state: 'Georgia',
    county: 'Coweta',
  },
  {
    code: '13079',
    state: 'Georgia',
    county: 'Crawford',
  },
  {
    code: '13081',
    state: 'Georgia',
    county: 'Crisp',
  },
  {
    code: '13083',
    state: 'Georgia',
    county: 'Dade',
  },
  {
    code: '13085',
    state: 'Georgia',
    county: 'Dawson',
  },
  {
    code: '13087',
    state: 'Georgia',
    county: 'Decatur',
  },
  {
    code: '13089',
    state: 'Georgia',
    county: 'DeKalb',
  },
  {
    code: '13091',
    state: 'Georgia',
    county: 'Dodge',
  },
  {
    code: '13093',
    state: 'Georgia',
    county: 'Dooly',
  },
  {
    code: '13095',
    state: 'Georgia',
    county: 'Dougherty',
  },
  {
    code: '13097',
    state: 'Georgia',
    county: 'Douglas',
  },
  {
    code: '13099',
    state: 'Georgia',
    county: 'Early',
  },
  {
    code: '13101',
    state: 'Georgia',
    county: 'Echols',
  },
  {
    code: '13103',
    state: 'Georgia',
    county: 'Effingham',
  },
  {
    code: '13105',
    state: 'Georgia',
    county: 'Elbert',
  },
  {
    code: '13107',
    state: 'Georgia',
    county: 'Emanuel',
  },
  {
    code: '13109',
    state: 'Georgia',
    county: 'Evans',
  },
  {
    code: '13111',
    state: 'Georgia',
    county: 'Fannin',
  },
  {
    code: '13113',
    state: 'Georgia',
    county: 'Fayette',
  },
  {
    code: '13115',
    state: 'Georgia',
    county: 'Floyd',
  },
  {
    code: '13117',
    state: 'Georgia',
    county: 'Forsyth',
  },
  {
    code: '13119',
    state: 'Georgia',
    county: 'Franklin',
  },
  {
    code: '13121',
    state: 'Georgia',
    county: 'Fulton',
  },
  {
    code: '13123',
    state: 'Georgia',
    county: 'Gilmer',
  },
  {
    code: '13125',
    state: 'Georgia',
    county: 'Glascock',
  },
  {
    code: '13127',
    state: 'Georgia',
    county: 'Glynn',
  },
  {
    code: '13129',
    state: 'Georgia',
    county: 'Gordon',
  },
  {
    code: '13131',
    state: 'Georgia',
    county: 'Grady',
  },
  {
    code: '13133',
    state: 'Georgia',
    county: 'Greene',
  },
  {
    code: '13135',
    state: 'Georgia',
    county: 'Gwinnett',
  },
  {
    code: '13137',
    state: 'Georgia',
    county: 'Habersham',
  },
  {
    code: '13139',
    state: 'Georgia',
    county: 'Hall',
  },
  {
    code: '13141',
    state: 'Georgia',
    county: 'Hancock',
  },
  {
    code: '13143',
    state: 'Georgia',
    county: 'Haralson',
  },
  {
    code: '13145',
    state: 'Georgia',
    county: 'Harris',
  },
  {
    code: '13147',
    state: 'Georgia',
    county: 'Hart',
  },
  {
    code: '13149',
    state: 'Georgia',
    county: 'Heard',
  },
  {
    code: '13151',
    state: 'Georgia',
    county: 'Henry',
  },
  {
    code: '13153',
    state: 'Georgia',
    county: 'Houston',
  },
  {
    code: '13155',
    state: 'Georgia',
    county: 'Irwin',
  },
  {
    code: '13157',
    state: 'Georgia',
    county: 'Jackson',
  },
  {
    code: '13159',
    state: 'Georgia',
    county: 'Jasper',
  },
  {
    code: '13161',
    state: 'Georgia',
    county: 'Jeff Davis',
  },
  {
    code: '13163',
    state: 'Georgia',
    county: 'Jefferson',
  },
  {
    code: '13165',
    state: 'Georgia',
    county: 'Jenkins',
  },
  {
    code: '13167',
    state: 'Georgia',
    county: 'Johnson',
  },
  {
    code: '13169',
    state: 'Georgia',
    county: 'Jones',
  },
  {
    code: '13171',
    state: 'Georgia',
    county: 'Lamar',
  },
  {
    code: '13173',
    state: 'Georgia',
    county: 'Lanier',
  },
  {
    code: '13175',
    state: 'Georgia',
    county: 'Laurens',
  },
  {
    code: '13177',
    state: 'Georgia',
    county: 'Lee',
  },
  {
    code: '13179',
    state: 'Georgia',
    county: 'Liberty',
  },
  {
    code: '13181',
    state: 'Georgia',
    county: 'Lincoln',
  },
  {
    code: '13183',
    state: 'Georgia',
    county: 'Long',
  },
  {
    code: '13185',
    state: 'Georgia',
    county: 'Lowndes',
  },
  {
    code: '13187',
    state: 'Georgia',
    county: 'Lumpkin',
  },
  {
    code: '13189',
    state: 'Georgia',
    county: 'McDuffie',
  },
  {
    code: '13191',
    state: 'Georgia',
    county: 'McIntosh',
  },
  {
    code: '13193',
    state: 'Georgia',
    county: 'Macon',
  },
  {
    code: '13195',
    state: 'Georgia',
    county: 'Madison',
  },
  {
    code: '13197',
    state: 'Georgia',
    county: 'Marion',
  },
  {
    code: '13199',
    state: 'Georgia',
    county: 'Meriwether',
  },
  {
    code: '13201',
    state: 'Georgia',
    county: 'Miller',
  },
  {
    code: '13205',
    state: 'Georgia',
    county: 'Mitchell',
  },
  {
    code: '13207',
    state: 'Georgia',
    county: 'Monroe',
  },
  {
    code: '13209',
    state: 'Georgia',
    county: 'Montgomery',
  },
  {
    code: '13211',
    state: 'Georgia',
    county: 'Morgan',
  },
  {
    code: '13213',
    state: 'Georgia',
    county: 'Murray',
  },
  {
    code: '13215',
    state: 'Georgia',
    county: 'Muscogee',
  },
  {
    code: '13217',
    state: 'Georgia',
    county: 'Newton',
  },
  {
    code: '13219',
    state: 'Georgia',
    county: 'Oconee',
  },
  {
    code: '13221',
    state: 'Georgia',
    county: 'Oglethorpe',
  },
  {
    code: '13223',
    state: 'Georgia',
    county: 'Paulding',
  },
  {
    code: '13225',
    state: 'Georgia',
    county: 'Peach',
  },
  {
    code: '13227',
    state: 'Georgia',
    county: 'Pickens',
  },
  {
    code: '13229',
    state: 'Georgia',
    county: 'Pierce',
  },
  {
    code: '13231',
    state: 'Georgia',
    county: 'Pike',
  },
  {
    code: '13233',
    state: 'Georgia',
    county: 'Polk',
  },
  {
    code: '13235',
    state: 'Georgia',
    county: 'Pulaski',
  },
  {
    code: '13237',
    state: 'Georgia',
    county: 'Putnam',
  },
  {
    code: '13239',
    state: 'Georgia',
    county: 'Quitman',
  },
  {
    code: '13241',
    state: 'Georgia',
    county: 'Rabun',
  },
  {
    code: '13243',
    state: 'Georgia',
    county: 'Randolph',
  },
  {
    code: '13245',
    state: 'Georgia',
    county: 'Richmond',
  },
  {
    code: '13247',
    state: 'Georgia',
    county: 'Rockdale',
  },
  {
    code: '13249',
    state: 'Georgia',
    county: 'Schley',
  },
  {
    code: '13251',
    state: 'Georgia',
    county: 'Screven',
  },
  {
    code: '13253',
    state: 'Georgia',
    county: 'Seminole',
  },
  {
    code: '13255',
    state: 'Georgia',
    county: 'Spalding',
  },
  {
    code: '13257',
    state: 'Georgia',
    county: 'Stephens',
  },
  {
    code: '13259',
    state: 'Georgia',
    county: 'Stewart',
  },
  {
    code: '13261',
    state: 'Georgia',
    county: 'Sumter',
  },
  {
    code: '13263',
    state: 'Georgia',
    county: 'Talbot',
  },
  {
    code: '13265',
    state: 'Georgia',
    county: 'Taliaferro',
  },
  {
    code: '13267',
    state: 'Georgia',
    county: 'Tattnall',
  },
  {
    code: '13269',
    state: 'Georgia',
    county: 'Taylor',
  },
  {
    code: '13271',
    state: 'Georgia',
    county: 'Telfair',
  },
  {
    code: '13273',
    state: 'Georgia',
    county: 'Terrell',
  },
  {
    code: '13275',
    state: 'Georgia',
    county: 'Thomas',
  },
  {
    code: '13277',
    state: 'Georgia',
    county: 'Tift',
  },
  {
    code: '13279',
    state: 'Georgia',
    county: 'Toombs',
  },
  {
    code: '13281',
    state: 'Georgia',
    county: 'Towns',
  },
  {
    code: '13283',
    state: 'Georgia',
    county: 'Treutlen',
  },
  {
    code: '13285',
    state: 'Georgia',
    county: 'Troup',
  },
  {
    code: '13287',
    state: 'Georgia',
    county: 'Turner',
  },
  {
    code: '13289',
    state: 'Georgia',
    county: 'Twiggs',
  },
  {
    code: '13291',
    state: 'Georgia',
    county: 'Union',
  },
  {
    code: '13293',
    state: 'Georgia',
    county: 'Upson',
  },
  {
    code: '13295',
    state: 'Georgia',
    county: 'Walker',
  },
  {
    code: '13297',
    state: 'Georgia',
    county: 'Walton',
  },
  {
    code: '13299',
    state: 'Georgia',
    county: 'Ware',
  },
  {
    code: '13301',
    state: 'Georgia',
    county: 'Warren',
  },
  {
    code: '13303',
    state: 'Georgia',
    county: 'Washington',
  },
  {
    code: '13305',
    state: 'Georgia',
    county: 'Wayne',
  },
  {
    code: '13307',
    state: 'Georgia',
    county: 'Webster',
  },
  {
    code: '13309',
    state: 'Georgia',
    county: 'Wheeler',
  },
  {
    code: '13311',
    state: 'Georgia',
    county: 'White',
  },
  {
    code: '13313',
    state: 'Georgia',
    county: 'Whitfield',
  },
  {
    code: '13315',
    state: 'Georgia',
    county: 'Wilcox',
  },
  {
    code: '13317',
    state: 'Georgia',
    county: 'Wilkes',
  },
  {
    code: '13319',
    state: 'Georgia',
    county: 'Wilkinson',
  },
  {
    code: '13321',
    state: 'Georgia',
    county: 'Worth',
  },
  {
    code: '15001',
    state: 'Hawaii',
    county: 'Hawaii',
  },
  {
    code: '15003',
    state: 'Hawaii',
    county: 'Honolulu',
  },
  {
    code: '15005',
    state: 'Hawaii',
    county: 'Kalawao',
  },
  {
    code: '15007',
    state: 'Hawaii',
    county: 'Kauai',
  },
  {
    code: '15009',
    state: 'Hawaii',
    county: 'Maui',
  },
  {
    code: '16001',
    state: 'Idaho',
    county: 'Ada',
  },
  {
    code: '16003',
    state: 'Idaho',
    county: 'Adams',
  },
  {
    code: '16005',
    state: 'Idaho',
    county: 'Bannock',
  },
  {
    code: '16007',
    state: 'Idaho',
    county: 'Bear Lake',
  },
  {
    code: '16009',
    state: 'Idaho',
    county: 'Benewah',
  },
  {
    code: '16011',
    state: 'Idaho',
    county: 'Bingham',
  },
  {
    code: '16013',
    state: 'Idaho',
    county: 'Blaine',
  },
  {
    code: '16015',
    state: 'Idaho',
    county: 'Boise',
  },
  {
    code: '16017',
    state: 'Idaho',
    county: 'Bonner',
  },
  {
    code: '16019',
    state: 'Idaho',
    county: 'Bonneville',
  },
  {
    code: '16021',
    state: 'Idaho',
    county: 'Boundary',
  },
  {
    code: '16023',
    state: 'Idaho',
    county: 'Butte',
  },
  {
    code: '16025',
    state: 'Idaho',
    county: 'Camas',
  },
  {
    code: '16027',
    state: 'Idaho',
    county: 'Canyon',
  },
  {
    code: '16029',
    state: 'Idaho',
    county: 'Caribou',
  },
  {
    code: '16031',
    state: 'Idaho',
    county: 'Cassia',
  },
  {
    code: '16033',
    state: 'Idaho',
    county: 'Clark',
  },
  {
    code: '16035',
    state: 'Idaho',
    county: 'Clearwater',
  },
  {
    code: '16037',
    state: 'Idaho',
    county: 'Custer',
  },
  {
    code: '16039',
    state: 'Idaho',
    county: 'Elmore',
  },
  {
    code: '16041',
    state: 'Idaho',
    county: 'Franklin',
  },
  {
    code: '16043',
    state: 'Idaho',
    county: 'Fremont',
  },
  {
    code: '16045',
    state: 'Idaho',
    county: 'Gem',
  },
  {
    code: '16047',
    state: 'Idaho',
    county: 'Gooding',
  },
  {
    code: '16049',
    state: 'Idaho',
    county: 'Idaho',
  },
  {
    code: '16051',
    state: 'Idaho',
    county: 'Jefferson',
  },
  {
    code: '16053',
    state: 'Idaho',
    county: 'Jerome',
  },
  {
    code: '16055',
    state: 'Idaho',
    county: 'Kootenai',
  },
  {
    code: '16057',
    state: 'Idaho',
    county: 'Latah',
  },
  {
    code: '16059',
    state: 'Idaho',
    county: 'Lemhi',
  },
  {
    code: '16061',
    state: 'Idaho',
    county: 'Lewis',
  },
  {
    code: '16063',
    state: 'Idaho',
    county: 'Lincoln',
  },
  {
    code: '16065',
    state: 'Idaho',
    county: 'Madison',
  },
  {
    code: '16067',
    state: 'Idaho',
    county: 'Minidoka',
  },
  {
    code: '16069',
    state: 'Idaho',
    county: 'Nez Perce',
  },
  {
    code: '16071',
    state: 'Idaho',
    county: 'Oneida',
  },
  {
    code: '16073',
    state: 'Idaho',
    county: 'Owyhee',
  },
  {
    code: '16075',
    state: 'Idaho',
    county: 'Payette',
  },
  {
    code: '16077',
    state: 'Idaho',
    county: 'Power',
  },
  {
    code: '16079',
    state: 'Idaho',
    county: 'Shoshone',
  },
  {
    code: '16081',
    state: 'Idaho',
    county: 'Teton',
  },
  {
    code: '16083',
    state: 'Idaho',
    county: 'Twin Falls',
  },
  {
    code: '16085',
    state: 'Idaho',
    county: 'Valley',
  },
  {
    code: '16087',
    state: 'Idaho',
    county: 'Washington',
  },
  {
    code: '17001',
    state: 'Illinois',
    county: 'Adams',
  },
  {
    code: '17003',
    state: 'Illinois',
    county: 'Alexander',
  },
  {
    code: '17005',
    state: 'Illinois',
    county: 'Bond',
  },
  {
    code: '17007',
    state: 'Illinois',
    county: 'Boone',
  },
  {
    code: '17009',
    state: 'Illinois',
    county: 'Brown',
  },
  {
    code: '17011',
    state: 'Illinois',
    county: 'Bureau',
  },
  {
    code: '17013',
    state: 'Illinois',
    county: 'Calhoun',
  },
  {
    code: '17015',
    state: 'Illinois',
    county: 'Carroll',
  },
  {
    code: '17017',
    state: 'Illinois',
    county: 'Cass',
  },
  {
    code: '17019',
    state: 'Illinois',
    county: 'Champaign',
  },
  {
    code: '17021',
    state: 'Illinois',
    county: 'Christian',
  },
  {
    code: '17023',
    state: 'Illinois',
    county: 'Clark',
  },
  {
    code: '17025',
    state: 'Illinois',
    county: 'Clay',
  },
  {
    code: '17027',
    state: 'Illinois',
    county: 'Clinton',
  },
  {
    code: '17029',
    state: 'Illinois',
    county: 'Coles',
  },
  {
    code: '17031',
    state: 'Illinois',
    county: 'Cook',
  },
  {
    code: '17033',
    state: 'Illinois',
    county: 'Crawford',
  },
  {
    code: '17035',
    state: 'Illinois',
    county: 'Cumberland',
  },
  {
    code: '17037',
    state: 'Illinois',
    county: 'DeKalb',
  },
  {
    code: '17039',
    state: 'Illinois',
    county: 'De Witt',
  },
  {
    code: '17041',
    state: 'Illinois',
    county: 'Douglas',
  },
  {
    code: '17043',
    state: 'Illinois',
    county: 'DuPage',
  },
  {
    code: '17045',
    state: 'Illinois',
    county: 'Edgar',
  },
  {
    code: '17047',
    state: 'Illinois',
    county: 'Edwards',
  },
  {
    code: '17049',
    state: 'Illinois',
    county: 'Effingham',
  },
  {
    code: '17051',
    state: 'Illinois',
    county: 'Fayette',
  },
  {
    code: '17053',
    state: 'Illinois',
    county: 'Ford',
  },
  {
    code: '17055',
    state: 'Illinois',
    county: 'Franklin',
  },
  {
    code: '17057',
    state: 'Illinois',
    county: 'Fulton',
  },
  {
    code: '17059',
    state: 'Illinois',
    county: 'Gallatin',
  },
  {
    code: '17061',
    state: 'Illinois',
    county: 'Greene',
  },
  {
    code: '17063',
    state: 'Illinois',
    county: 'Grundy',
  },
  {
    code: '17065',
    state: 'Illinois',
    county: 'Hamilton',
  },
  {
    code: '17067',
    state: 'Illinois',
    county: 'Hancock',
  },
  {
    code: '17069',
    state: 'Illinois',
    county: 'Hardin',
  },
  {
    code: '17071',
    state: 'Illinois',
    county: 'Henderson',
  },
  {
    code: '17073',
    state: 'Illinois',
    county: 'Henry',
  },
  {
    code: '17075',
    state: 'Illinois',
    county: 'Iroquois',
  },
  {
    code: '17077',
    state: 'Illinois',
    county: 'Jackson',
  },
  {
    code: '17079',
    state: 'Illinois',
    county: 'Jasper',
  },
  {
    code: '17081',
    state: 'Illinois',
    county: 'Jefferson',
  },
  {
    code: '17083',
    state: 'Illinois',
    county: 'Jersey',
  },
  {
    code: '17085',
    state: 'Illinois',
    county: 'Jo Daviess',
  },
  {
    code: '17087',
    state: 'Illinois',
    county: 'Johnson',
  },
  {
    code: '17089',
    state: 'Illinois',
    county: 'Kane',
  },
  {
    code: '17091',
    state: 'Illinois',
    county: 'Kankakee',
  },
  {
    code: '17093',
    state: 'Illinois',
    county: 'Kendall',
  },
  {
    code: '17095',
    state: 'Illinois',
    county: 'Knox',
  },
  {
    code: '17097',
    state: 'Illinois',
    county: 'Lake',
  },
  {
    code: '17099',
    state: 'Illinois',
    county: 'La Salle',
  },
  {
    code: '17101',
    state: 'Illinois',
    county: 'Lawrence',
  },
  {
    code: '17103',
    state: 'Illinois',
    county: 'Lee',
  },
  {
    code: '17105',
    state: 'Illinois',
    county: 'Livingston',
  },
  {
    code: '17107',
    state: 'Illinois',
    county: 'Logan',
  },
  {
    code: '17109',
    state: 'Illinois',
    county: 'McDonough',
  },
  {
    code: '17111',
    state: 'Illinois',
    county: 'McHenry',
  },
  {
    code: '17113',
    state: 'Illinois',
    county: 'McLean',
  },
  {
    code: '17115',
    state: 'Illinois',
    county: 'Macon',
  },
  {
    code: '17117',
    state: 'Illinois',
    county: 'Macoupin',
  },
  {
    code: '17119',
    state: 'Illinois',
    county: 'Madison',
  },
  {
    code: '17121',
    state: 'Illinois',
    county: 'Marion',
  },
  {
    code: '17123',
    state: 'Illinois',
    county: 'Marshall',
  },
  {
    code: '17125',
    state: 'Illinois',
    county: 'Mason',
  },
  {
    code: '17127',
    state: 'Illinois',
    county: 'Massac',
  },
  {
    code: '17129',
    state: 'Illinois',
    county: 'Menard',
  },
  {
    code: '17131',
    state: 'Illinois',
    county: 'Mercer',
  },
  {
    code: '17133',
    state: 'Illinois',
    county: 'Monroe',
  },
  {
    code: '17135',
    state: 'Illinois',
    county: 'Montgomery',
  },
  {
    code: '17137',
    state: 'Illinois',
    county: 'Morgan',
  },
  {
    code: '17139',
    state: 'Illinois',
    county: 'Moultrie',
  },
  {
    code: '17141',
    state: 'Illinois',
    county: 'Ogle',
  },
  {
    code: '17143',
    state: 'Illinois',
    county: 'Peoria',
  },
  {
    code: '17145',
    state: 'Illinois',
    county: 'Perry',
  },
  {
    code: '17147',
    state: 'Illinois',
    county: 'Piatt',
  },
  {
    code: '17149',
    state: 'Illinois',
    county: 'Pike',
  },
  {
    code: '17151',
    state: 'Illinois',
    county: 'Pope',
  },
  {
    code: '17153',
    state: 'Illinois',
    county: 'Pulaski',
  },
  {
    code: '17155',
    state: 'Illinois',
    county: 'Putnam',
  },
  {
    code: '17157',
    state: 'Illinois',
    county: 'Randolph',
  },
  {
    code: '17159',
    state: 'Illinois',
    county: 'Richland',
  },
  {
    code: '17161',
    state: 'Illinois',
    county: 'Rock Island',
  },
  {
    code: '17163',
    state: 'Illinois',
    county: 'St. Clair',
  },
  {
    code: '17165',
    state: 'Illinois',
    county: 'Saline',
  },
  {
    code: '17167',
    state: 'Illinois',
    county: 'Sangamon',
  },
  {
    code: '17169',
    state: 'Illinois',
    county: 'Schuyler',
  },
  {
    code: '17171',
    state: 'Illinois',
    county: 'Scott',
  },
  {
    code: '17173',
    state: 'Illinois',
    county: 'Shelby',
  },
  {
    code: '17175',
    state: 'Illinois',
    county: 'Stark',
  },
  {
    code: '17177',
    state: 'Illinois',
    county: 'Stephenson',
  },
  {
    code: '17179',
    state: 'Illinois',
    county: 'Tazewell',
  },
  {
    code: '17181',
    state: 'Illinois',
    county: 'Union',
  },
  {
    code: '17183',
    state: 'Illinois',
    county: 'Vermilion',
  },
  {
    code: '17185',
    state: 'Illinois',
    county: 'Wabash',
  },
  {
    code: '17187',
    state: 'Illinois',
    county: 'Warren',
  },
  {
    code: '17189',
    state: 'Illinois',
    county: 'Washington',
  },
  {
    code: '17191',
    state: 'Illinois',
    county: 'Wayne',
  },
  {
    code: '17193',
    state: 'Illinois',
    county: 'White',
  },
  {
    code: '17195',
    state: 'Illinois',
    county: 'Whiteside',
  },
  {
    code: '17197',
    state: 'Illinois',
    county: 'Will',
  },
  {
    code: '17199',
    state: 'Illinois',
    county: 'Williamson',
  },
  {
    code: '17201',
    state: 'Illinois',
    county: 'Winnebago',
  },
  {
    code: '17203',
    state: 'Illinois',
    county: 'Woodford',
  },
  {
    code: '18001',
    state: 'Indiana',
    county: 'Adams',
  },
  {
    code: '18003',
    state: 'Indiana',
    county: 'Allen',
  },
  {
    code: '18005',
    state: 'Indiana',
    county: 'Bartholomew',
  },
  {
    code: '18007',
    state: 'Indiana',
    county: 'Benton',
  },
  {
    code: '18009',
    state: 'Indiana',
    county: 'Blackford',
  },
  {
    code: '18011',
    state: 'Indiana',
    county: 'Boone',
  },
  {
    code: '18013',
    state: 'Indiana',
    county: 'Brown',
  },
  {
    code: '18015',
    state: 'Indiana',
    county: 'Carroll',
  },
  {
    code: '18017',
    state: 'Indiana',
    county: 'Cass',
  },
  {
    code: '18019',
    state: 'Indiana',
    county: 'Clark',
  },
  {
    code: '18021',
    state: 'Indiana',
    county: 'Clay',
  },
  {
    code: '18023',
    state: 'Indiana',
    county: 'Clinton',
  },
  {
    code: '18025',
    state: 'Indiana',
    county: 'Crawford',
  },
  {
    code: '18027',
    state: 'Indiana',
    county: 'Daviess',
  },
  {
    code: '18029',
    state: 'Indiana',
    county: 'Dearborn',
  },
  {
    code: '18031',
    state: 'Indiana',
    county: 'Decatur',
  },
  {
    code: '18033',
    state: 'Indiana',
    county: 'De Kalb',
  },
  {
    code: '18035',
    state: 'Indiana',
    county: 'Delaware',
  },
  {
    code: '18037',
    state: 'Indiana',
    county: 'Dubois',
  },
  {
    code: '18039',
    state: 'Indiana',
    county: 'Elkhart',
  },
  {
    code: '18041',
    state: 'Indiana',
    county: 'Fayette',
  },
  {
    code: '18043',
    state: 'Indiana',
    county: 'Floyd',
  },
  {
    code: '18045',
    state: 'Indiana',
    county: 'Fountain',
  },
  {
    code: '18047',
    state: 'Indiana',
    county: 'Franklin',
  },
  {
    code: '18049',
    state: 'Indiana',
    county: 'Fulton',
  },
  {
    code: '18051',
    state: 'Indiana',
    county: 'Gibson',
  },
  {
    code: '18053',
    state: 'Indiana',
    county: 'Grant',
  },
  {
    code: '18055',
    state: 'Indiana',
    county: 'Greene',
  },
  {
    code: '18057',
    state: 'Indiana',
    county: 'Hamilton',
  },
  {
    code: '18059',
    state: 'Indiana',
    county: 'Hancock',
  },
  {
    code: '18061',
    state: 'Indiana',
    county: 'Harrison',
  },
  {
    code: '18063',
    state: 'Indiana',
    county: 'Hendricks',
  },
  {
    code: '18065',
    state: 'Indiana',
    county: 'Henry',
  },
  {
    code: '18067',
    state: 'Indiana',
    county: 'Howard',
  },
  {
    code: '18069',
    state: 'Indiana',
    county: 'Huntington',
  },
  {
    code: '18071',
    state: 'Indiana',
    county: 'Jackson',
  },
  {
    code: '18073',
    state: 'Indiana',
    county: 'Jasper',
  },
  {
    code: '18075',
    state: 'Indiana',
    county: 'Jay',
  },
  {
    code: '18077',
    state: 'Indiana',
    county: 'Jefferson',
  },
  {
    code: '18079',
    state: 'Indiana',
    county: 'Jennings',
  },
  {
    code: '18081',
    state: 'Indiana',
    county: 'Johnson',
  },
  {
    code: '18083',
    state: 'Indiana',
    county: 'Knox',
  },
  {
    code: '18085',
    state: 'Indiana',
    county: 'Kosciusko',
  },
  {
    code: '18087',
    state: 'Indiana',
    county: 'Lagrange',
  },
  {
    code: '18089',
    state: 'Indiana',
    county: 'Lake',
  },
  {
    code: '18091',
    state: 'Indiana',
    county: 'La Porte',
  },
  {
    code: '18093',
    state: 'Indiana',
    county: 'Lawrence',
  },
  {
    code: '18095',
    state: 'Indiana',
    county: 'Madison',
  },
  {
    code: '18097',
    state: 'Indiana',
    county: 'Marion',
  },
  {
    code: '18099',
    state: 'Indiana',
    county: 'Marshall',
  },
  {
    code: '18101',
    state: 'Indiana',
    county: 'Martin',
  },
  {
    code: '18103',
    state: 'Indiana',
    county: 'Miami',
  },
  {
    code: '18105',
    state: 'Indiana',
    county: 'Monroe',
  },
  {
    code: '18107',
    state: 'Indiana',
    county: 'Montgomery',
  },
  {
    code: '18109',
    state: 'Indiana',
    county: 'Morgan',
  },
  {
    code: '18111',
    state: 'Indiana',
    county: 'Newton',
  },
  {
    code: '18113',
    state: 'Indiana',
    county: 'Noble',
  },
  {
    code: '18115',
    state: 'Indiana',
    county: 'Ohio',
  },
  {
    code: '18117',
    state: 'Indiana',
    county: 'Orange',
  },
  {
    code: '18119',
    state: 'Indiana',
    county: 'Owen',
  },
  {
    code: '18121',
    state: 'Indiana',
    county: 'Parke',
  },
  {
    code: '18123',
    state: 'Indiana',
    county: 'Perry',
  },
  {
    code: '18125',
    state: 'Indiana',
    county: 'Pike',
  },
  {
    code: '18127',
    state: 'Indiana',
    county: 'Porter',
  },
  {
    code: '18129',
    state: 'Indiana',
    county: 'Posey',
  },
  {
    code: '18131',
    state: 'Indiana',
    county: 'Pulaski',
  },
  {
    code: '18133',
    state: 'Indiana',
    county: 'Putnam',
  },
  {
    code: '18135',
    state: 'Indiana',
    county: 'Randolph',
  },
  {
    code: '18137',
    state: 'Indiana',
    county: 'Ripley',
  },
  {
    code: '18139',
    state: 'Indiana',
    county: 'Rush',
  },
  {
    code: '18141',
    state: 'Indiana',
    county: 'St. Joseph',
  },
  {
    code: '18143',
    state: 'Indiana',
    county: 'Scott',
  },
  {
    code: '18145',
    state: 'Indiana',
    county: 'Shelby',
  },
  {
    code: '18147',
    state: 'Indiana',
    county: 'Spencer',
  },
  {
    code: '18149',
    state: 'Indiana',
    county: 'Starke',
  },
  {
    code: '18151',
    state: 'Indiana',
    county: 'Steuben',
  },
  {
    code: '18153',
    state: 'Indiana',
    county: 'Sullivan',
  },
  {
    code: '18155',
    state: 'Indiana',
    county: 'Switzerland',
  },
  {
    code: '18157',
    state: 'Indiana',
    county: 'Tippecanoe',
  },
  {
    code: '18159',
    state: 'Indiana',
    county: 'Tipton',
  },
  {
    code: '18161',
    state: 'Indiana',
    county: 'Union',
  },
  {
    code: '18163',
    state: 'Indiana',
    county: 'Vanderburgh',
  },
  {
    code: '18165',
    state: 'Indiana',
    county: 'Vermillion',
  },
  {
    code: '18167',
    state: 'Indiana',
    county: 'Vigo',
  },
  {
    code: '18169',
    state: 'Indiana',
    county: 'Wabash',
  },
  {
    code: '18171',
    state: 'Indiana',
    county: 'Warren',
  },
  {
    code: '18173',
    state: 'Indiana',
    county: 'Warrick',
  },
  {
    code: '18175',
    state: 'Indiana',
    county: 'Washington',
  },
  {
    code: '18177',
    state: 'Indiana',
    county: 'Wayne',
  },
  {
    code: '18179',
    state: 'Indiana',
    county: 'Wells',
  },
  {
    code: '18181',
    state: 'Indiana',
    county: 'White',
  },
  {
    code: '18183',
    state: 'Indiana',
    county: 'Whitley',
  },
  {
    code: '19001',
    state: 'Iowa',
    county: 'Adair',
  },
  {
    code: '19003',
    state: 'Iowa',
    county: 'Adams',
  },
  {
    code: '19005',
    state: 'Iowa',
    county: 'Allamakee',
  },
  {
    code: '19007',
    state: 'Iowa',
    county: 'Appanoose',
  },
  {
    code: '19009',
    state: 'Iowa',
    county: 'Audubon',
  },
  {
    code: '19011',
    state: 'Iowa',
    county: 'Benton',
  },
  {
    code: '19013',
    state: 'Iowa',
    county: 'Black Hawk',
  },
  {
    code: '19015',
    state: 'Iowa',
    county: 'Boone',
  },
  {
    code: '19017',
    state: 'Iowa',
    county: 'Bremer',
  },
  {
    code: '19019',
    state: 'Iowa',
    county: 'Buchanan',
  },
  {
    code: '19021',
    state: 'Iowa',
    county: 'Buena Vista',
  },
  {
    code: '19023',
    state: 'Iowa',
    county: 'Butler',
  },
  {
    code: '19025',
    state: 'Iowa',
    county: 'Calhoun',
  },
  {
    code: '19027',
    state: 'Iowa',
    county: 'Carroll',
  },
  {
    code: '19029',
    state: 'Iowa',
    county: 'Cass',
  },
  {
    code: '19031',
    state: 'Iowa',
    county: 'Cedar',
  },
  {
    code: '19033',
    state: 'Iowa',
    county: 'Cerro Gordo',
  },
  {
    code: '19035',
    state: 'Iowa',
    county: 'Cherokee',
  },
  {
    code: '19037',
    state: 'Iowa',
    county: 'Chickasaw',
  },
  {
    code: '19039',
    state: 'Iowa',
    county: 'Clarke',
  },
  {
    code: '19041',
    state: 'Iowa',
    county: 'Clay',
  },
  {
    code: '19043',
    state: 'Iowa',
    county: 'Clayton',
  },
  {
    code: '19045',
    state: 'Iowa',
    county: 'Clinton',
  },
  {
    code: '19047',
    state: 'Iowa',
    county: 'Crawford',
  },
  {
    code: '19049',
    state: 'Iowa',
    county: 'Dallas',
  },
  {
    code: '19051',
    state: 'Iowa',
    county: 'Davis',
  },
  {
    code: '19053',
    state: 'Iowa',
    county: 'Decatur',
  },
  {
    code: '19055',
    state: 'Iowa',
    county: 'Delaware',
  },
  {
    code: '19057',
    state: 'Iowa',
    county: 'Des Moines',
  },
  {
    code: '19059',
    state: 'Iowa',
    county: 'Dickinson',
  },
  {
    code: '19061',
    state: 'Iowa',
    county: 'Dubuque',
  },
  {
    code: '19063',
    state: 'Iowa',
    county: 'Emmet',
  },
  {
    code: '19065',
    state: 'Iowa',
    county: 'Fayette',
  },
  {
    code: '19067',
    state: 'Iowa',
    county: 'Floyd',
  },
  {
    code: '19069',
    state: 'Iowa',
    county: 'Franklin',
  },
  {
    code: '19071',
    state: 'Iowa',
    county: 'Fremont',
  },
  {
    code: '19073',
    state: 'Iowa',
    county: 'Greene',
  },
  {
    code: '19075',
    state: 'Iowa',
    county: 'Grundy',
  },
  {
    code: '19077',
    state: 'Iowa',
    county: 'Guthrie',
  },
  {
    code: '19079',
    state: 'Iowa',
    county: 'Hamilton',
  },
  {
    code: '19081',
    state: 'Iowa',
    county: 'Hancock',
  },
  {
    code: '19083',
    state: 'Iowa',
    county: 'Hardin',
  },
  {
    code: '19085',
    state: 'Iowa',
    county: 'Harrison',
  },
  {
    code: '19087',
    state: 'Iowa',
    county: 'Henry',
  },
  {
    code: '19089',
    state: 'Iowa',
    county: 'Howard',
  },
  {
    code: '19091',
    state: 'Iowa',
    county: 'Humboldt',
  },
  {
    code: '19093',
    state: 'Iowa',
    county: 'Ida',
  },
  {
    code: '19095',
    state: 'Iowa',
    county: 'Iowa',
  },
  {
    code: '19097',
    state: 'Iowa',
    county: 'Jackson',
  },
  {
    code: '19099',
    state: 'Iowa',
    county: 'Jasper',
  },
  {
    code: '19101',
    state: 'Iowa',
    county: 'Jefferson',
  },
  {
    code: '19103',
    state: 'Iowa',
    county: 'Johnson',
  },
  {
    code: '19105',
    state: 'Iowa',
    county: 'Jones',
  },
  {
    code: '19107',
    state: 'Iowa',
    county: 'Keokuk',
  },
  {
    code: '19109',
    state: 'Iowa',
    county: 'Kossuth',
  },
  {
    code: '19111',
    state: 'Iowa',
    county: 'Lee',
  },
  {
    code: '19113',
    state: 'Iowa',
    county: 'Linn',
  },
  {
    code: '19115',
    state: 'Iowa',
    county: 'Louisa',
  },
  {
    code: '19117',
    state: 'Iowa',
    county: 'Lucas',
  },
  {
    code: '19119',
    state: 'Iowa',
    county: 'Lyon',
  },
  {
    code: '19121',
    state: 'Iowa',
    county: 'Madison',
  },
  {
    code: '19123',
    state: 'Iowa',
    county: 'Mahaska',
  },
  {
    code: '19125',
    state: 'Iowa',
    county: 'Marion',
  },
  {
    code: '19127',
    state: 'Iowa',
    county: 'Marshall',
  },
  {
    code: '19129',
    state: 'Iowa',
    county: 'Mills',
  },
  {
    code: '19131',
    state: 'Iowa',
    county: 'Mitchell',
  },
  {
    code: '19133',
    state: 'Iowa',
    county: 'Monona',
  },
  {
    code: '19135',
    state: 'Iowa',
    county: 'Monroe',
  },
  {
    code: '19137',
    state: 'Iowa',
    county: 'Montgomery',
  },
  {
    code: '19139',
    state: 'Iowa',
    county: 'Muscatine',
  },
  {
    code: '19141',
    state: 'Iowa',
    county: 'O'Brien',
  },
  {
    code: '19143',
    state: 'Iowa',
    county: 'Osceola',
  },
  {
    code: '19145',
    state: 'Iowa',
    county: 'Page',
  },
  {
    code: '19147',
    state: 'Iowa',
    county: 'Palo Alto',
  },
  {
    code: '19149',
    state: 'Iowa',
    county: 'Plymouth',
  },
  {
    code: '19151',
    state: 'Iowa',
    county: 'Pocahontas',
  },
  {
    code: '19153',
    state: 'Iowa',
    county: 'Polk',
  },
  {
    code: '19155',
    state: 'Iowa',
    county: 'Pottawattamie',
  },
  {
    code: '19157',
    state: 'Iowa',
    county: 'Poweshiek',
  },
  {
    code: '19159',
    state: 'Iowa',
    county: 'Ringgold',
  },
  {
    code: '19161',
    state: 'Iowa',
    county: 'Sac',
  },
  {
    code: '19163',
    state: 'Iowa',
    county: 'Scott',
  },
  {
    code: '19165',
    state: 'Iowa',
    county: 'Shelby',
  },
  {
    code: '19167',
    state: 'Iowa',
    county: 'Sioux',
  },
  {
    code: '19169',
    state: 'Iowa',
    county: 'Story',
  },
  {
    code: '19171',
    state: 'Iowa',
    county: 'Tama',
  },
  {
    code: '19173',
    state: 'Iowa',
    county: 'Taylor',
  },
  {
    code: '19175',
    state: 'Iowa',
    county: 'Union',
  },
  {
    code: '19177',
    state: 'Iowa',
    county: 'Van Buren',
  },
  {
    code: '19179',
    state: 'Iowa',
    county: 'Wapello',
  },
  {
    code: '19181',
    state: 'Iowa',
    county: 'Warren',
  },
  {
    code: '19183',
    state: 'Iowa',
    county: 'Washington',
  },
  {
    code: '19185',
    state: 'Iowa',
    county: 'Wayne',
  },
  {
    code: '19187',
    state: 'Iowa',
    county: 'Webster',
  },
  {
    code: '19189',
    state: 'Iowa',
    county: 'Winnebago',
  },
  {
    code: '19191',
    state: 'Iowa',
    county: 'Winneshiek',
  },
  {
    code: '19193',
    state: 'Iowa',
    county: 'Woodbury',
  },
  {
    code: '19195',
    state: 'Iowa',
    county: 'Worth',
  },
  {
    code: '19197',
    state: 'Iowa',
    county: 'Wright',
  },
  {
    code: '20001',
    state: 'Kansas',
    county: 'Allen',
  },
  {
    code: '20003',
    state: 'Kansas',
    county: 'Anderson',
  },
  {
    code: '20005',
    state: 'Kansas',
    county: 'Atchison',
  },
  {
    code: '20007',
    state: 'Kansas',
    county: 'Barber',
  },
  {
    code: '20009',
    state: 'Kansas',
    county: 'Barton',
  },
  {
    code: '20011',
    state: 'Kansas',
    county: 'Bourbon',
  },
  {
    code: '20013',
    state: 'Kansas',
    county: 'Brown',
  },
  {
    code: '20015',
    state: 'Kansas',
    county: 'Butler',
  },
  {
    code: '20017',
    state: 'Kansas',
    county: 'Chase',
  },
  {
    code: '20019',
    state: 'Kansas',
    county: 'Chautauqua',
  },
  {
    code: '20021',
    state: 'Kansas',
    county: 'Cherokee',
  },
  {
    code: '20023',
    state: 'Kansas',
    county: 'Cheyenne',
  },
  {
    code: '20025',
    state: 'Kansas',
    county: 'Clark',
  },
  {
    code: '20027',
    state: 'Kansas',
    county: 'Clay',
  },
  {
    code: '20029',
    state: 'Kansas',
    county: 'Cloud',
  },
  {
    code: '20031',
    state: 'Kansas',
    county: 'Coffey',
  },
  {
    code: '20033',
    state: 'Kansas',
    county: 'Comanche',
  },
  {
    code: '20035',
    state: 'Kansas',
    county: 'Cowley',
  },
  {
    code: '20037',
    state: 'Kansas',
    county: 'Crawford',
  },
  {
    code: '20039',
    state: 'Kansas',
    county: 'Decatur',
  },
  {
    code: '20041',
    state: 'Kansas',
    county: 'Dickinson',
  },
  {
    code: '20043',
    state: 'Kansas',
    county: 'Doniphan',
  },
  {
    code: '20045',
    state: 'Kansas',
    county: 'Douglas',
  },
  {
    code: '20047',
    state: 'Kansas',
    county: 'Edwards',
  },
  {
    code: '20049',
    state: 'Kansas',
    county: 'Elk',
  },
  {
    code: '20051',
    state: 'Kansas',
    county: 'Ellis',
  },
  {
    code: '20053',
    state: 'Kansas',
    county: 'Ellsworth',
  },
  {
    code: '20055',
    state: 'Kansas',
    county: 'Finney',
  },
  {
    code: '20057',
    state: 'Kansas',
    county: 'Ford',
  },
  {
    code: '20059',
    state: 'Kansas',
    county: 'Franklin',
  },
  {
    code: '20061',
    state: 'Kansas',
    county: 'Geary',
  },
  {
    code: '20063',
    state: 'Kansas',
    county: 'Gove',
  },
  {
    code: '20065',
    state: 'Kansas',
    county: 'Graham',
  },
  {
    code: '20067',
    state: 'Kansas',
    county: 'Grant',
  },
  {
    code: '20069',
    state: 'Kansas',
    county: 'Gray',
  },
  {
    code: '20071',
    state: 'Kansas',
    county: 'Greeley',
  },
  {
    code: '20073',
    state: 'Kansas',
    county: 'Greenwood',
  },
  {
    code: '20075',
    state: 'Kansas',
    county: 'Hamilton',
  },
  {
    code: '20077',
    state: 'Kansas',
    county: 'Harper',
  },
  {
    code: '20079',
    state: 'Kansas',
    county: 'Harvey',
  },
  {
    code: '20081',
    state: 'Kansas',
    county: 'Haskell',
  },
  {
    code: '20083',
    state: 'Kansas',
    county: 'Hodgeman',
  },
  {
    code: '20085',
    state: 'Kansas',
    county: 'Jackson',
  },
  {
    code: '20087',
    state: 'Kansas',
    county: 'Jefferson',
  },
  {
    code: '20089',
    state: 'Kansas',
    county: 'Jewell',
  },
  {
    code: '20091',
    state: 'Kansas',
    county: 'Johnson',
  },
  {
    code: '20093',
    state: 'Kansas',
    county: 'Kearny',
  },
  {
    code: '20095',
    state: 'Kansas',
    county: 'Kingman',
  },
  {
    code: '20097',
    state: 'Kansas',
    county: 'Kiowa',
  },
  {
    code: '20099',
    state: 'Kansas',
    county: 'Labette',
  },
  {
    code: '20101',
    state: 'Kansas',
    county: 'Lane',
  },
  {
    code: '20103',
    state: 'Kansas',
    county: 'Leavenworth',
  },
  {
    code: '20105',
    state: 'Kansas',
    county: 'Lincoln',
  },
  {
    code: '20107',
    state: 'Kansas',
    county: 'Linn',
  },
  {
    code: '20109',
    state: 'Kansas',
    county: 'Logan',
  },
  {
    code: '20111',
    state: 'Kansas',
    county: 'Lyon',
  },
  {
    code: '20113',
    state: 'Kansas',
    county: 'McPherson',
  },
  {
    code: '20115',
    state: 'Kansas',
    county: 'Marion',
  },
  {
    code: '20117',
    state: 'Kansas',
    county: 'Marshall',
  },
  {
    code: '20119',
    state: 'Kansas',
    county: 'Meade',
  },
  {
    code: '20121',
    state: 'Kansas',
    county: 'Miami',
  },
  {
    code: '20123',
    state: 'Kansas',
    county: 'Mitchell',
  },
  {
    code: '20125',
    state: 'Kansas',
    county: 'Montgomery',
  },
  {
    code: '20127',
    state: 'Kansas',
    county: 'Morris',
  },
  {
    code: '20129',
    state: 'Kansas',
    county: 'Morton',
  },
  {
    code: '20131',
    state: 'Kansas',
    county: 'Nemaha',
  },
  {
    code: '20133',
    state: 'Kansas',
    county: 'Neosho',
  },
  {
    code: '20135',
    state: 'Kansas',
    county: 'Ness',
  },
  {
    code: '20137',
    state: 'Kansas',
    county: 'Norton',
  },
  {
    code: '20139',
    state: 'Kansas',
    county: 'Osage',
  },
  {
    code: '20141',
    state: 'Kansas',
    county: 'Osborne',
  },
  {
    code: '20143',
    state: 'Kansas',
    county: 'Ottawa',
  },
  {
    code: '20145',
    state: 'Kansas',
    county: 'Pawnee',
  },
  {
    code: '20147',
    state: 'Kansas',
    county: 'Phillips',
  },
  {
    code: '20149',
    state: 'Kansas',
    county: 'Pottawatomie',
  },
  {
    code: '20151',
    state: 'Kansas',
    county: 'Pratt',
  },
  {
    code: '20153',
    state: 'Kansas',
    county: 'Rawlins',
  },
  {
    code: '20155',
    state: 'Kansas',
    county: 'Reno',
  },
  {
    code: '20157',
    state: 'Kansas',
    county: 'Republic',
  },
  {
    code: '20159',
    state: 'Kansas',
    county: 'Rice',
  },
  {
    code: '20161',
    state: 'Kansas',
    county: 'Riley',
  },
  {
    code: '20163',
    state: 'Kansas',
    county: 'Rooks',
  },
  {
    code: '20165',
    state: 'Kansas',
    county: 'Rush',
  },
  {
    code: '20167',
    state: 'Kansas',
    county: 'Russell',
  },
  {
    code: '20169',
    state: 'Kansas',
    county: 'Saline',
  },
  {
    code: '20171',
    state: 'Kansas',
    county: 'Scott',
  },
  {
    code: '20173',
    state: 'Kansas',
    county: 'Sedgwick',
  },
  {
    code: '20175',
    state: 'Kansas',
    county: 'Seward',
  },
  {
    code: '20177',
    state: 'Kansas',
    county: 'Shawnee',
  },
  {
    code: '20179',
    state: 'Kansas',
    county: 'Sheridan',
  },
  {
    code: '20181',
    state: 'Kansas',
    county: 'Sherman',
  },
  {
    code: '20183',
    state: 'Kansas',
    county: 'Smith',
  },
  {
    code: '20185',
    state: 'Kansas',
    county: 'Stafford',
  },
  {
    code: '20187',
    state: 'Kansas',
    county: 'Stanton',
  },
  {
    code: '20189',
    state: 'Kansas',
    county: 'Stevens',
  },
  {
    code: '20191',
    state: 'Kansas',
    county: 'Sumner',
  },
  {
    code: '20193',
    state: 'Kansas',
    county: 'Thomas',
  },
  {
    code: '20195',
    state: 'Kansas',
    county: 'Trego',
  },
  {
    code: '20197',
    state: 'Kansas',
    county: 'Wabaunsee',
  },
  {
    code: '20199',
    state: 'Kansas',
    county: 'Wallace',
  },
  {
    code: '20201',
    state: 'Kansas',
    county: 'Washington',
  },
  {
    code: '20203',
    state: 'Kansas',
    county: 'Wichita',
  },
  {
    code: '20205',
    state: 'Kansas',
    county: 'Wilson',
  },
  {
    code: '20207',
    state: 'Kansas',
    county: 'Woodson',
  },
  {
    code: '20209',
    state: 'Kansas',
    county: 'Wyandotte',
  },
  {
    code: '21001',
    state: 'Kentucky',
    county: 'Adair',
  },
  {
    code: '21003',
    state: 'Kentucky',
    county: 'Allen',
  },
  {
    code: '21005',
    state: 'Kentucky',
    county: 'Anderson',
  },
  {
    code: '21007',
    state: 'Kentucky',
    county: 'Ballard',
  },
  {
    code: '21009',
    state: 'Kentucky',
    county: 'Barren',
  },
  {
    code: '21011',
    state: 'Kentucky',
    county: 'Bath',
  },
  {
    code: '21013',
    state: 'Kentucky',
    county: 'Bell',
  },
  {
    code: '21015',
    state: 'Kentucky',
    county: 'Boone',
  },
  {
    code: '21017',
    state: 'Kentucky',
    county: 'Bourbon',
  },
  {
    code: '21019',
    state: 'Kentucky',
    county: 'Boyd',
  },
  {
    code: '21021',
    state: 'Kentucky',
    county: 'Boyle',
  },
  {
    code: '21023',
    state: 'Kentucky',
    county: 'Bracken',
  },
  {
    code: '21025',
    state: 'Kentucky',
    county: 'Breathitt',
  },
  {
    code: '21027',
    state: 'Kentucky',
    county: 'Breckinridge',
  },
  {
    code: '21029',
    state: 'Kentucky',
    county: 'Bullitt',
  },
  {
    code: '21031',
    state: 'Kentucky',
    county: 'Butler',
  },
  {
    code: '21033',
    state: 'Kentucky',
    county: 'Caldwell',
  },
  {
    code: '21035',
    state: 'Kentucky',
    county: 'Calloway',
  },
  {
    code: '21037',
    state: 'Kentucky',
    county: 'Campbell',
  },
  {
    code: '21039',
    state: 'Kentucky',
    county: 'Carlisle',
  },
  {
    code: '21041',
    state: 'Kentucky',
    county: 'Carroll',
  },
  {
    code: '21043',
    state: 'Kentucky',
    county: 'Carter',
  },
  {
    code: '21045',
    state: 'Kentucky',
    county: 'Casey',
  },
  {
    code: '21047',
    state: 'Kentucky',
    county: 'Christian',
  },
  {
    code: '21049',
    state: 'Kentucky',
    county: 'Clark',
  },
  {
    code: '21051',
    state: 'Kentucky',
    county: 'Clay',
  },
  {
    code: '21053',
    state: 'Kentucky',
    county: 'Clinton',
  },
  {
    code: '21055',
    state: 'Kentucky',
    county: 'Crittenden',
  },
  {
    code: '21057',
    state: 'Kentucky',
    county: 'Cumberland',
  },
  {
    code: '21059',
    state: 'Kentucky',
    county: 'Daviess',
  },
  {
    code: '21061',
    state: 'Kentucky',
    county: 'Edmonson',
  },
  {
    code: '21063',
    state: 'Kentucky',
    county: 'Elliott',
  },
  {
    code: '21065',
    state: 'Kentucky',
    county: 'Estill',
  },
  {
    code: '21067',
    state: 'Kentucky',
    county: 'Fayette',
  },
  {
    code: '21069',
    state: 'Kentucky',
    county: 'Fleming',
  },
  {
    code: '21071',
    state: 'Kentucky',
    county: 'Floyd',
  },
  {
    code: '21073',
    state: 'Kentucky',
    county: 'Franklin',
  },
  {
    code: '21075',
    state: 'Kentucky',
    county: 'Fulton',
  },
  {
    code: '21077',
    state: 'Kentucky',
    county: 'Gallatin',
  },
  {
    code: '21079',
    state: 'Kentucky',
    county: 'Garrard',
  },
  {
    code: '21081',
    state: 'Kentucky',
    county: 'Grant',
  },
  {
    code: '21083',
    state: 'Kentucky',
    county: 'Graves',
  },
  {
    code: '21085',
    state: 'Kentucky',
    county: 'Grayson',
  },
  {
    code: '21087',
    state: 'Kentucky',
    county: 'Green',
  },
  {
    code: '21089',
    state: 'Kentucky',
    county: 'Greenup',
  },
  {
    code: '21091',
    state: 'Kentucky',
    county: 'Hancock',
  },
  {
    code: '21093',
    state: 'Kentucky',
    county: 'Hardin',
  },
  {
    code: '21095',
    state: 'Kentucky',
    county: 'Harlan',
  },
  {
    code: '21097',
    state: 'Kentucky',
    county: 'Harrison',
  },
  {
    code: '21099',
    state: 'Kentucky',
    county: 'Hart',
  },
  {
    code: '21101',
    state: 'Kentucky',
    county: 'Henderson',
  },
  {
    code: '21103',
    state: 'Kentucky',
    county: 'Henry',
  },
  {
    code: '21105',
    state: 'Kentucky',
    county: 'Hickman',
  },
  {
    code: '21107',
    state: 'Kentucky',
    county: 'Hopkins',
  },
  {
    code: '21109',
    state: 'Kentucky',
    county: 'Jackson',
  },
  {
    code: '21111',
    state: 'Kentucky',
    county: 'Jefferson',
  },
  {
    code: '21113',
    state: 'Kentucky',
    county: 'Jessamine',
  },
  {
    code: '21115',
    state: 'Kentucky',
    county: 'Johnson',
  },
  {
    code: '21117',
    state: 'Kentucky',
    county: 'Kenton',
  },
  {
    code: '21119',
    state: 'Kentucky',
    county: 'Knott',
  },
  {
    code: '21121',
    state: 'Kentucky',
    county: 'Knox',
  },
  {
    code: '21123',
    state: 'Kentucky',
    county: 'Larue',
  },
  {
    code: '21125',
    state: 'Kentucky',
    county: 'Laurel',
  },
  {
    code: '21127',
    state: 'Kentucky',
    county: 'Lawrence',
  },
  {
    code: '21129',
    state: 'Kentucky',
    county: 'Lee',
  },
  {
    code: '21131',
    state: 'Kentucky',
    county: 'Leslie',
  },
  {
    code: '21133',
    state: 'Kentucky',
    county: 'Letcher',
  },
  {
    code: '21135',
    state: 'Kentucky',
    county: 'Lewis',
  },
  {
    code: '21137',
    state: 'Kentucky',
    county: 'Lincoln',
  },
  {
    code: '21139',
    state: 'Kentucky',
    county: 'Livingston',
  },
  {
    code: '21141',
    state: 'Kentucky',
    county: 'Logan',
  },
  {
    code: '21143',
    state: 'Kentucky',
    county: 'Lyon',
  },
  {
    code: '21145',
    state: 'Kentucky',
    county: 'McCracken',
  },
  {
    code: '21147',
    state: 'Kentucky',
    county: 'McCreary',
  },
  {
    code: '21149',
    state: 'Kentucky',
    county: 'McLean',
  },
  {
    code: '21151',
    state: 'Kentucky',
    county: 'Madison',
  },
  {
    code: '21153',
    state: 'Kentucky',
    county: 'Magoffin',
  },
  {
    code: '21155',
    state: 'Kentucky',
    county: 'Marion',
  },
  {
    code: '21157',
    state: 'Kentucky',
    county: 'Marshall',
  },
  {
    code: '21159',
    state: 'Kentucky',
    county: 'Martin',
  },
  {
    code: '21161',
    state: 'Kentucky',
    county: 'Mason',
  },
  {
    code: '21163',
    state: 'Kentucky',
    county: 'Meade',
  },
  {
    code: '21165',
    state: 'Kentucky',
    county: 'Menifee',
  },
  {
    code: '21167',
    state: 'Kentucky',
    county: 'Mercer',
  },
  {
    code: '21169',
    state: 'Kentucky',
    county: 'Metcalfe',
  },
  {
    code: '21171',
    state: 'Kentucky',
    county: 'Monroe',
  },
  {
    code: '21173',
    state: 'Kentucky',
    county: 'Montgomery',
  },
  {
    code: '21175',
    state: 'Kentucky',
    county: 'Morgan',
  },
  {
    code: '21177',
    state: 'Kentucky',
    county: 'Muhlenberg',
  },
  {
    code: '21179',
    state: 'Kentucky',
    county: 'Nelson',
  },
  {
    code: '21181',
    state: 'Kentucky',
    county: 'Nicholas',
  },
  {
    code: '21183',
    state: 'Kentucky',
    county: 'Ohio',
  },
  {
    code: '21185',
    state: 'Kentucky',
    county: 'Oldham',
  },
  {
    code: '21187',
    state: 'Kentucky',
    county: 'Owen',
  },
  {
    code: '21189',
    state: 'Kentucky',
    county: 'Owsley',
  },
  {
    code: '21191',
    state: 'Kentucky',
    county: 'Pendleton',
  },
  {
    code: '21193',
    state: 'Kentucky',
    county: 'Perry',
  },
  {
    code: '21195',
    state: 'Kentucky',
    county: 'Pike',
  },
  {
    code: '21197',
    state: 'Kentucky',
    county: 'Powell',
  },
  {
    code: '21199',
    state: 'Kentucky',
    county: 'Pulaski',
  },
  {
    code: '21201',
    state: 'Kentucky',
    county: 'Robertson',
  },
  {
    code: '21203',
    state: 'Kentucky',
    county: 'Rockcastle',
  },
  {
    code: '21205',
    state: 'Kentucky',
    county: 'Rowan',
  },
  {
    code: '21207',
    state: 'Kentucky',
    county: 'Russell',
  },
  {
    code: '21209',
    state: 'Kentucky',
    county: 'Scott',
  },
  {
    code: '21211',
    state: 'Kentucky',
    county: 'Shelby',
  },
  {
    code: '21213',
    state: 'Kentucky',
    county: 'Simpson',
  },
  {
    code: '21215',
    state: 'Kentucky',
    county: 'Spencer',
  },
  {
    code: '21217',
    state: 'Kentucky',
    county: 'Taylor',
  },
  {
    code: '21219',
    state: 'Kentucky',
    county: 'Todd',
  },
  {
    code: '21221',
    state: 'Kentucky',
    county: 'Trigg',
  },
  {
    code: '21223',
    state: 'Kentucky',
    county: 'Trimble',
  },
  {
    code: '21225',
    state: 'Kentucky',
    county: 'Union',
  },
  {
    code: '21227',
    state: 'Kentucky',
    county: 'Warren',
  },
  {
    code: '21229',
    state: 'Kentucky',
    county: 'Washington',
  },
  {
    code: '21231',
    state: 'Kentucky',
    county: 'Wayne',
  },
  {
    code: '21233',
    state: 'Kentucky',
    county: 'Webster',
  },
  {
    code: '21235',
    state: 'Kentucky',
    county: 'Whitley',
  },
  {
    code: '21237',
    state: 'Kentucky',
    county: 'Wolfe',
  },
  {
    code: '21239',
    state: 'Kentucky',
    county: 'Woodford',
  },
  {
    code: '22001',
    state: 'Louisiana',
    county: 'Acadia',
  },
  {
    code: '22003',
    state: 'Louisiana',
    county: 'Allen',
  },
  {
    code: '22005',
    state: 'Louisiana',
    county: 'Ascension',
  },
  {
    code: '22007',
    state: 'Louisiana',
    county: 'Assumption',
  },
  {
    code: '22009',
    state: 'Louisiana',
    county: 'Avoyelles',
  },
  {
    code: '22011',
    state: 'Louisiana',
    county: 'Beauregard',
  },
  {
    code: '22013',
    state: 'Louisiana',
    county: 'Bienville',
  },
  {
    code: '22015',
    state: 'Louisiana',
    county: 'Bossier',
  },
  {
    code: '22017',
    state: 'Louisiana',
    county: 'Caddo',
  },
  {
    code: '22019',
    state: 'Louisiana',
    county: 'Calcasieu',
  },
  {
    code: '22021',
    state: 'Louisiana',
    county: 'Caldwell',
  },
  {
    code: '22023',
    state: 'Louisiana',
    county: 'Cameron',
  },
  {
    code: '22025',
    state: 'Louisiana',
    county: 'Catahoula',
  },
  {
    code: '22027',
    state: 'Louisiana',
    county: 'Claiborne',
  },
  {
    code: '22029',
    state: 'Louisiana',
    county: 'Concordia',
  },
  {
    code: '22031',
    state: 'Louisiana',
    county: 'De Soto',
  },
  {
    code: '22033',
    state: 'Louisiana',
    county: 'East Baton Rouge',
  },
  {
    code: '22035',
    state: 'Louisiana',
    county: 'East Carroll',
  },
  {
    code: '22037',
    state: 'Louisiana',
    county: 'East Feliciana',
  },
  {
    code: '22039',
    state: 'Louisiana',
    county: 'Evangeline',
  },
  {
    code: '22041',
    state: 'Louisiana',
    county: 'Franklin',
  },
  {
    code: '22043',
    state: 'Louisiana',
    county: 'Grant',
  },
  {
    code: '22045',
    state: 'Louisiana',
    county: 'Iberia',
  },
  {
    code: '22047',
    state: 'Louisiana',
    county: 'Iberville',
  },
  {
    code: '22049',
    state: 'Louisiana',
    county: 'Jackson',
  },
  {
    code: '22051',
    state: 'Louisiana',
    county: 'Jefferson',
  },
  {
    code: '22053',
    state: 'Louisiana',
    county: 'Jefferson Davis',
  },
  {
    code: '22055',
    state: 'Louisiana',
    county: 'Lafayette',
  },
  {
    code: '22057',
    state: 'Louisiana',
    county: 'Lafourche',
  },
  {
    code: '22059',
    state: 'Louisiana',
    county: 'La Salle',
  },
  {
    code: '22061',
    state: 'Louisiana',
    county: 'Lincoln',
  },
  {
    code: '22063',
    state: 'Louisiana',
    county: 'Livingston',
  },
  {
    code: '22065',
    state: 'Louisiana',
    county: 'Madison',
  },
  {
    code: '22067',
    state: 'Louisiana',
    county: 'Morehouse',
  },
  {
    code: '22069',
    state: 'Louisiana',
    county: 'Natchitoches',
  },
  {
    code: '22071',
    state: 'Louisiana',
    county: 'Orleans',
  },
  {
    code: '22073',
    state: 'Louisiana',
    county: 'Ouachita',
  },
  {
    code: '22075',
    state: 'Louisiana',
    county: 'Plaquemines',
  },
  {
    code: '22077',
    state: 'Louisiana',
    county: 'Pointe Coupee',
  },
  {
    code: '22079',
    state: 'Louisiana',
    county: 'Rapides',
  },
  {
    code: '22081',
    state: 'Louisiana',
    county: 'Red River',
  },
  {
    code: '22083',
    state: 'Louisiana',
    county: 'Richland',
  },
  {
    code: '22085',
    state: 'Louisiana',
    county: 'Sabine',
  },
  {
    code: '22087',
    state: 'Louisiana',
    county: 'St. Bernard',
  },
  {
    code: '22089',
    state: 'Louisiana',
    county: 'St. Charles',
  },
  {
    code: '22091',
    state: 'Louisiana',
    county: 'St. Helena',
  },
  {
    code: '22093',
    state: 'Louisiana',
    county: 'St. James',
  },
  {
    code: '22095',
    state: 'Louisiana',
    county: 'St. John the Baptist',
  },
  {
    code: '22097',
    state: 'Louisiana',
    county: 'St. Landry',
  },
  {
    code: '22099',
    state: 'Louisiana',
    county: 'St. Martin',
  },
  {
    code: '22101',
    state: 'Louisiana',
    county: 'St. Mary',
  },
  {
    code: '22103',
    state: 'Louisiana',
    county: 'St. Tammany',
  },
  {
    code: '22105',
    state: 'Louisiana',
    county: 'Tangipahoa',
  },
  {
    code: '22107',
    state: 'Louisiana',
    county: 'Tensas',
  },
  {
    code: '22109',
    state: 'Louisiana',
    county: 'Terrebonne',
  },
  {
    code: '22111',
    state: 'Louisiana',
    county: 'Union',
  },
  {
    code: '22113',
    state: 'Louisiana',
    county: 'Vermilion',
  },
  {
    code: '22115',
    state: 'Louisiana',
    county: 'Vernon',
  },
  {
    code: '22117',
    state: 'Louisiana',
    county: 'Washington',
  },
  {
    code: '22119',
    state: 'Louisiana',
    county: 'Webster',
  },
  {
    code: '22121',
    state: 'Louisiana',
    county: 'West Baton Rouge',
  },
  {
    code: '22123',
    state: 'Louisiana',
    county: 'West Carroll',
  },
  {
    code: '22125',
    state: 'Louisiana',
    county: 'West Feliciana',
  },
  {
    code: '22127',
    state: 'Louisiana',
    county: 'Winn',
  },
  {
    code: '23001',
    state: 'Maine',
    county: 'Androscoggin',
  },
  {
    code: '23003',
    state: 'Maine',
    county: 'Aroostook',
  },
  {
    code: '23005',
    state: 'Maine',
    county: 'Cumberland',
  },
  {
    code: '23007',
    state: 'Maine',
    county: 'Franklin',
  },
  {
    code: '23009',
    state: 'Maine',
    county: 'Hancock',
  },
  {
    code: '23011',
    state: 'Maine',
    county: 'Kennebec',
  },
  {
    code: '23013',
    state: 'Maine',
    county: 'Knox',
  },
  {
    code: '23015',
    state: 'Maine',
    county: 'Lincoln',
  },
  {
    code: '23017',
    state: 'Maine',
    county: 'Oxford',
  },
  {
    code: '23019',
    state: 'Maine',
    county: 'Penobscot',
  },
  {
    code: '23021',
    state: 'Maine',
    county: 'Piscataquis',
  },
  {
    code: '23023',
    state: 'Maine',
    county: 'Sagadahoc',
  },
  {
    code: '23025',
    state: 'Maine',
    county: 'Somerset',
  },
  {
    code: '23027',
    state: 'Maine',
    county: 'Waldo',
  },
  {
    code: '23029',
    state: 'Maine',
    county: 'Washington',
  },
  {
    code: '23031',
    state: 'Maine',
    county: 'York',
  },
  {
    code: '24001',
    state: 'Maryland',
    county: 'Allegany',
  },
  {
    code: '24003',
    state: 'Maryland',
    county: 'Anne Arundel',
  },
  {
    code: '24005',
    state: 'Maryland',
    county: 'Baltimore',
  },
  {
    code: '24009',
    state: 'Maryland',
    county: 'Calvert',
  },
  {
    code: '24011',
    state: 'Maryland',
    county: 'Caroline',
  },
  {
    code: '24013',
    state: 'Maryland',
    county: 'Carroll',
  },
  {
    code: '24015',
    state: 'Maryland',
    county: 'Cecil',
  },
  {
    code: '24017',
    state: 'Maryland',
    county: 'Charles',
  },
  {
    code: '24019',
    state: 'Maryland',
    county: 'Dorchester',
  },
  {
    code: '24021',
    state: 'Maryland',
    county: 'Frederick',
  },
  {
    code: '24023',
    state: 'Maryland',
    county: 'Garrett',
  },
  {
    code: '24025',
    state: 'Maryland',
    county: 'Harford',
  },
  {
    code: '24027',
    state: 'Maryland',
    county: 'Howard',
  },
  {
    code: '24029',
    state: 'Maryland',
    county: 'Kent',
  },
  {
    code: '24031',
    state: 'Maryland',
    county: 'Montgomery',
  },
  {
    code: '24033',
    state: 'Maryland',
    county: 'Prince George's',
  },
  {
    code: '24035',
    state: 'Maryland',
    county: 'Queen Anne's',
  },
  {
    code: '24037',
    state: 'Maryland',
    county: 'St. Mary's',
  },
  {
    code: '24039',
    state: 'Maryland',
    county: 'Somerset',
  },
  {
    code: '24041',
    state: 'Maryland',
    county: 'Talbot',
  },
  {
    code: '24043',
    state: 'Maryland',
    county: 'Washington',
  },
  {
    code: '24045',
    state: 'Maryland',
    county: 'Wicomico',
  },
  {
    code: '24047',
    state: 'Maryland',
    county: 'Worcester',
  },
  {
    code: '24510',
    state: 'Maryland',
    county: 'Baltimore city',
  },
  {
    code: '25001',
    state: 'Massachusetts',
    county: 'Barnstable',
  },
  {
    code: '25003',
    state: 'Massachusetts',
    county: 'Berkshire',
  },
  {
    code: '25005',
    state: 'Massachusetts',
    county: 'Bristol',
  },
  {
    code: '25007',
    state: 'Massachusetts',
    county: 'Dukes',
  },
  {
    code: '25009',
    state: 'Massachusetts',
    county: 'Essex',
  },
  {
    code: '25011',
    state: 'Massachusetts',
    county: 'Franklin',
  },
  {
    code: '25013',
    state: 'Massachusetts',
    county: 'Hampden',
  },
  {
    code: '25015',
    state: 'Massachusetts',
    county: 'Hampshire',
  },
  {
    code: '25017',
    state: 'Massachusetts',
    county: 'Middlesex',
  },
  {
    code: '25019',
    state: 'Massachusetts',
    county: 'Nantucket',
  },
  {
    code: '25021',
    state: 'Massachusetts',
    county: 'Norfolk',
  },
  {
    code: '25023',
    state: 'Massachusetts',
    county: 'Plymouth',
  },
  {
    code: '25025',
    state: 'Massachusetts',
    county: 'Suffolk',
  },
  {
    code: '25027',
    state: 'Massachusetts',
    county: 'Worcester',
  },
  {
    code: '26001',
    state: 'Michigan',
    county: 'Alcona',
  },
  {
    code: '26003',
    state: 'Michigan',
    county: 'Alger',
  },
  {
    code: '26005',
    state: 'Michigan',
    county: 'Allegan',
  },
  {
    code: '26007',
    state: 'Michigan',
    county: 'Alpena',
  },
  {
    code: '26009',
    state: 'Michigan',
    county: 'Antrim',
  },
  {
    code: '26011',
    state: 'Michigan',
    county: 'Arenac',
  },
  {
    code: '26013',
    state: 'Michigan',
    county: 'Baraga',
  },
  {
    code: '26015',
    state: 'Michigan',
    county: 'Barry',
  },
  {
    code: '26017',
    state: 'Michigan',
    county: 'Bay',
  },
  {
    code: '26019',
    state: 'Michigan',
    county: 'Benzie',
  },
  {
    code: '26021',
    state: 'Michigan',
    county: 'Berrien',
  },
  {
    code: '26023',
    state: 'Michigan',
    county: 'Branch',
  },
  {
    code: '26025',
    state: 'Michigan',
    county: 'Calhoun',
  },
  {
    code: '26027',
    state: 'Michigan',
    county: 'Cass',
  },
  {
    code: '26029',
    state: 'Michigan',
    county: 'Charlevoix',
  },
  {
    code: '26031',
    state: 'Michigan',
    county: 'Cheboygan',
  },
  {
    code: '26033',
    state: 'Michigan',
    county: 'Chippewa',
  },
  {
    code: '26035',
    state: 'Michigan',
    county: 'Clare',
  },
  {
    code: '26037',
    state: 'Michigan',
    county: 'Clinton',
  },
  {
    code: '26039',
    state: 'Michigan',
    county: 'Crawford',
  },
  {
    code: '26041',
    state: 'Michigan',
    county: 'Delta',
  },
  {
    code: '26043',
    state: 'Michigan',
    county: 'Dickinson',
  },
  {
    code: '26045',
    state: 'Michigan',
    county: 'Eaton',
  },
  {
    code: '26047',
    state: 'Michigan',
    county: 'Emmet',
  },
  {
    code: '26049',
    state: 'Michigan',
    county: 'Genesee',
  },
  {
    code: '26051',
    state: 'Michigan',
    county: 'Gladwin',
  },
  {
    code: '26053',
    state: 'Michigan',
    county: 'Gogebic',
  },
  {
    code: '26055',
    state: 'Michigan',
    county: 'Grand Traverse',
  },
  {
    code: '26057',
    state: 'Michigan',
    county: 'Gratiot',
  },
  {
    code: '26059',
    state: 'Michigan',
    county: 'Hillsdale',
  },
  {
    code: '26061',
    state: 'Michigan',
    county: 'Houghton',
  },
  {
    code: '26063',
    state: 'Michigan',
    county: 'Huron',
  },
  {
    code: '26065',
    state: 'Michigan',
    county: 'Ingham',
  },
  {
    code: '26067',
    state: 'Michigan',
    county: 'Ionia',
  },
  {
    code: '26069',
    state: 'Michigan',
    county: 'Iosco',
  },
  {
    code: '26071',
    state: 'Michigan',
    county: 'Iron',
  },
  {
    code: '26073',
    state: 'Michigan',
    county: 'Isabella',
  },
  {
    code: '26075',
    state: 'Michigan',
    county: 'Jackson',
  },
  {
    code: '26077',
    state: 'Michigan',
    county: 'Kalamazoo',
  },
  {
    code: '26079',
    state: 'Michigan',
    county: 'Kalkaska',
  },
  {
    code: '26081',
    state: 'Michigan',
    county: 'Kent',
  },
  {
    code: '26083',
    state: 'Michigan',
    county: 'Keweenaw',
  },
  {
    code: '26085',
    state: 'Michigan',
    county: 'Lake',
  },
  {
    code: '26087',
    state: 'Michigan',
    county: 'Lapeer',
  },
  {
    code: '26089',
    state: 'Michigan',
    county: 'Leelanau',
  },
  {
    code: '26091',
    state: 'Michigan',
    county: 'Lenawee',
  },
  {
    code: '26093',
    state: 'Michigan',
    county: 'Livingston',
  },
  {
    code: '26095',
    state: 'Michigan',
    county: 'Luce',
  },
  {
    code: '26097',
    state: 'Michigan',
    county: 'Mackinac',
  },
  {
    code: '26099',
    state: 'Michigan',
    county: 'Macomb',
  },
  {
    code: '26101',
    state: 'Michigan',
    county: 'Manistee',
  },
  {
    code: '26103',
    state: 'Michigan',
    county: 'Marquette',
  },
  {
    code: '26105',
    state: 'Michigan',
    county: 'Mason',
  },
  {
    code: '26107',
    state: 'Michigan',
    county: 'Mecosta',
  },
  {
    code: '26109',
    state: 'Michigan',
    county: 'Menominee',
  },
  {
    code: '26111',
    state: 'Michigan',
    county: 'Midland',
  },
  {
    code: '26113',
    state: 'Michigan',
    county: 'Missaukee',
  },
  {
    code: '26115',
    state: 'Michigan',
    county: 'Monroe',
  },
  {
    code: '26117',
    state: 'Michigan',
    county: 'Montcalm',
  },
  {
    code: '26119',
    state: 'Michigan',
    county: 'Montmorency',
  },
  {
    code: '26121',
    state: 'Michigan',
    county: 'Muskegon',
  },
  {
    code: '26123',
    state: 'Michigan',
    county: 'Newaygo',
  },
  {
    code: '26125',
    state: 'Michigan',
    county: 'Oakland',
  },
  {
    code: '26127',
    state: 'Michigan',
    county: 'Oceana',
  },
  {
    code: '26129',
    state: 'Michigan',
    county: 'Ogemaw',
  },
  {
    code: '26131',
    state: 'Michigan',
    county: 'Ontonagon',
  },
  {
    code: '26133',
    state: 'Michigan',
    county: 'Osceola',
  },
  {
    code: '26135',
    state: 'Michigan',
    county: 'Oscoda',
  },
  {
    code: '26137',
    state: 'Michigan',
    county: 'Otsego',
  },
  {
    code: '26139',
    state: 'Michigan',
    county: 'Ottawa',
  },
  {
    code: '26141',
    state: 'Michigan',
    county: 'Presque Isle',
  },
  {
    code: '26143',
    state: 'Michigan',
    county: 'Roscommon',
  },
  {
    code: '26145',
    state: 'Michigan',
    county: 'Saginaw',
  },
  {
    code: '26147',
    state: 'Michigan',
    county: 'St. Clair',
  },
  {
    code: '26149',
    state: 'Michigan',
    county: 'St. Joseph',
  },
  {
    code: '26151',
    state: 'Michigan',
    county: 'Sanilac',
  },
  {
    code: '26153',
    state: 'Michigan',
    county: 'Schoolcraft',
  },
  {
    code: '26155',
    state: 'Michigan',
    county: 'Shiawassee',
  },
  {
    code: '26157',
    state: 'Michigan',
    county: 'Tuscola',
  },
  {
    code: '26159',
    state: 'Michigan',
    county: 'Van Buren',
  },
  {
    code: '26161',
    state: 'Michigan',
    county: 'Washtenaw',
  },
  {
    code: '26163',
    state: 'Michigan',
    county: 'Wayne',
  },
  {
    code: '26165',
    state: 'Michigan',
    county: 'Wexford',
  },
  {
    code: '27001',
    state: 'Minnesota',
    county: 'Aitkin',
  },
  {
    code: '27003',
    state: 'Minnesota',
    county: 'Anoka',
  },
  {
    code: '27005',
    state: 'Minnesota',
    county: 'Becker',
  },
  {
    code: '27007',
    state: 'Minnesota',
    county: 'Beltrami',
  },
  {
    code: '27009',
    state: 'Minnesota',
    county: 'Benton',
  },
  {
    code: '27011',
    state: 'Minnesota',
    county: 'Big Stone',
  },
  {
    code: '27013',
    state: 'Minnesota',
    county: 'Blue Earth',
  },
  {
    code: '27015',
    state: 'Minnesota',
    county: 'Brown',
  },
  {
    code: '27017',
    state: 'Minnesota',
    county: 'Carlton',
  },
  {
    code: '27019',
    state: 'Minnesota',
    county: 'Carver',
  },
  {
    code: '27021',
    state: 'Minnesota',
    county: 'Cass',
  },
  {
    code: '27023',
    state: 'Minnesota',
    county: 'Chippewa',
  },
  {
    code: '27025',
    state: 'Minnesota',
    county: 'Chisago',
  },
  {
    code: '27027',
    state: 'Minnesota',
    county: 'Clay',
  },
  {
    code: '27029',
    state: 'Minnesota',
    county: 'Clearwater',
  },
  {
    code: '27031',
    state: 'Minnesota',
    county: 'Cook',
  },
  {
    code: '27033',
    state: 'Minnesota',
    county: 'Cottonwood',
  },
  {
    code: '27035',
    state: 'Minnesota',
    county: 'Crow Wing',
  },
  {
    code: '27037',
    state: 'Minnesota',
    county: 'Dakota',
  },
  {
    code: '27039',
    state: 'Minnesota',
    county: 'Dodge',
  },
  {
    code: '27041',
    state: 'Minnesota',
    county: 'Douglas',
  },
  {
    code: '27043',
    state: 'Minnesota',
    county: 'Faribault',
  },
  {
    code: '27045',
    state: 'Minnesota',
    county: 'Fillmore',
  },
  {
    code: '27047',
    state: 'Minnesota',
    county: 'Freeborn',
  },
  {
    code: '27049',
    state: 'Minnesota',
    county: 'Goodhue',
  },
  {
    code: '27051',
    state: 'Minnesota',
    county: 'Grant',
  },
  {
    code: '27053',
    state: 'Minnesota',
    county: 'Hennepin',
  },
  {
    code: '27055',
    state: 'Minnesota',
    county: 'Houston',
  },
  {
    code: '27057',
    state: 'Minnesota',
    county: 'Hubbard',
  },
  {
    code: '27059',
    state: 'Minnesota',
    county: 'Isanti',
  },
  {
    code: '27061',
    state: 'Minnesota',
    county: 'Itasca',
  },
  {
    code: '27063',
    state: 'Minnesota',
    county: 'Jackson',
  },
  {
    code: '27065',
    state: 'Minnesota',
    county: 'Kanabec',
  },
  {
    code: '27067',
    state: 'Minnesota',
    county: 'Kandiyohi',
  },
  {
    code: '27069',
    state: 'Minnesota',
    county: 'Kittson',
  },
  {
    code: '27071',
    state: 'Minnesota',
    county: 'Koochiching',
  },
  {
    code: '27073',
    state: 'Minnesota',
    county: 'Lac qui Parle',
  },
  {
    code: '27075',
    state: 'Minnesota',
    county: 'Lake',
  },
  {
    code: '27077',
    state: 'Minnesota',
    county: 'Lake of the Woods',
  },
  {
    code: '27079',
    state: 'Minnesota',
    county: 'Le Sueur',
  },
  {
    code: '27081',
    state: 'Minnesota',
    county: 'Lincoln',
  },
  {
    code: '27083',
    state: 'Minnesota',
    county: 'Lyon',
  },
  {
    code: '27085',
    state: 'Minnesota',
    county: 'McLeod',
  },
  {
    code: '27087',
    state: 'Minnesota',
    county: 'Mahnomen',
  },
  {
    code: '27089',
    state: 'Minnesota',
    county: 'Marshall',
  },
  {
    code: '27091',
    state: 'Minnesota',
    county: 'Martin',
  },
  {
    code: '27093',
    state: 'Minnesota',
    county: 'Meeker',
  },
  {
    code: '27095',
    state: 'Minnesota',
    county: 'Mille Lacs',
  },
  {
    code: '27097',
    state: 'Minnesota',
    county: 'Morrison',
  },
  {
    code: '27099',
    state: 'Minnesota',
    county: 'Mower',
  },
  {
    code: '27101',
    state: 'Minnesota',
    county: 'Murray',
  },
  {
    code: '27103',
    state: 'Minnesota',
    county: 'Nicollet',
  },
  {
    code: '27105',
    state: 'Minnesota',
    county: 'Nobles',
  },
  {
    code: '27107',
    state: 'Minnesota',
    county: 'Norman',
  },
  {
    code: '27109',
    state: 'Minnesota',
    county: 'Olmsted',
  },
  {
    code: '27111',
    state: 'Minnesota',
    county: 'Otter Tail',
  },
  {
    code: '27113',
    state: 'Minnesota',
    county: 'Pennington',
  },
  {
    code: '27115',
    state: 'Minnesota',
    county: 'Pine',
  },
  {
    code: '27117',
    state: 'Minnesota',
    county: 'Pipestone',
  },
  {
    code: '27119',
    state: 'Minnesota',
    county: 'Polk',
  },
  {
    code: '27121',
    state: 'Minnesota',
    county: 'Pope',
  },
  {
    code: '27123',
    state: 'Minnesota',
    county: 'Ramsey',
  },
  {
    code: '27125',
    state: 'Minnesota',
    county: 'Red Lake',
  },
  {
    code: '27127',
    state: 'Minnesota',
    county: 'Redwood',
  },
  {
    code: '27129',
    state: 'Minnesota',
    county: 'Renville',
  },
  {
    code: '27131',
    state: 'Minnesota',
    county: 'Rice',
  },
  {
    code: '27133',
    state: 'Minnesota',
    county: 'Rock',
  },
  {
    code: '27135',
    state: 'Minnesota',
    county: 'Roseau',
  },
  {
    code: '27137',
    state: 'Minnesota',
    county: 'St. Louis',
  },
  {
    code: '27139',
    state: 'Minnesota',
    county: 'Scott',
  },
  {
    code: '27141',
    state: 'Minnesota',
    county: 'Sherburne',
  },
  {
    code: '27143',
    state: 'Minnesota',
    county: 'Sibley',
  },
  {
    code: '27145',
    state: 'Minnesota',
    county: 'Stearns',
  },
  {
    code: '27147',
    state: 'Minnesota',
    county: 'Steele',
  },
  {
    code: '27149',
    state: 'Minnesota',
    county: 'Stevens',
  },
  {
    code: '27151',
    state: 'Minnesota',
    county: 'Swift',
  },
  {
    code: '27153',
    state: 'Minnesota',
    county: 'Todd',
  },
  {
    code: '27155',
    state: 'Minnesota',
    county: 'Traverse',
  },
  {
    code: '27157',
    state: 'Minnesota',
    county: 'Wabasha',
  },
  {
    code: '27159',
    state: 'Minnesota',
    county: 'Wadena',
  },
  {
    code: '27161',
    state: 'Minnesota',
    county: 'Waseca',
  },
  {
    code: '27163',
    state: 'Minnesota',
    county: 'Washington',
  },
  {
    code: '27165',
    state: 'Minnesota',
    county: 'Watonwan',
  },
  {
    code: '27167',
    state: 'Minnesota',
    county: 'Wilkin',
  },
  {
    code: '27169',
    state: 'Minnesota',
    county: 'Winona',
  },
  {
    code: '27171',
    state: 'Minnesota',
    county: 'Wright',
  },
  {
    code: '27173',
    state: 'Minnesota',
    county: 'Yellow Medicine',
  },
  {
    code: '28001',
    state: 'Mississippi',
    county: 'Adams',
  },
  {
    code: '28003',
    state: 'Mississippi',
    county: 'Alcorn',
  },
  {
    code: '28005',
    state: 'Mississippi',
    county: 'Amite',
  },
  {
    code: '28007',
    state: 'Mississippi',
    county: 'Attala',
  },
  {
    code: '28009',
    state: 'Mississippi',
    county: 'Benton',
  },
  {
    code: '28011',
    state: 'Mississippi',
    county: 'Bolivar',
  },
  {
    code: '28013',
    state: 'Mississippi',
    county: 'Calhoun',
  },
  {
    code: '28015',
    state: 'Mississippi',
    county: 'Carroll',
  },
  {
    code: '28017',
    state: 'Mississippi',
    county: 'Chickasaw',
  },
  {
    code: '28019',
    state: 'Mississippi',
    county: 'Choctaw',
  },
  {
    code: '28021',
    state: 'Mississippi',
    county: 'Claiborne',
  },
  {
    code: '28023',
    state: 'Mississippi',
    county: 'Clarke',
  },
  {
    code: '28025',
    state: 'Mississippi',
    county: 'Clay',
  },
  {
    code: '28027',
    state: 'Mississippi',
    county: 'Coahoma',
  },
  {
    code: '28029',
    state: 'Mississippi',
    county: 'Copiah',
  },
  {
    code: '28031',
    state: 'Mississippi',
    county: 'Covington',
  },
  {
    code: '28033',
    state: 'Mississippi',
    county: 'DeSoto',
  },
  {
    code: '28035',
    state: 'Mississippi',
    county: 'Forrest',
  },
  {
    code: '28037',
    state: 'Mississippi',
    county: 'Franklin',
  },
  {
    code: '28039',
    state: 'Mississippi',
    county: 'George',
  },
  {
    code: '28041',
    state: 'Mississippi',
    county: 'Greene',
  },
  {
    code: '28043',
    state: 'Mississippi',
    county: 'Grenada',
  },
  {
    code: '28045',
    state: 'Mississippi',
    county: 'Hancock',
  },
  {
    code: '28047',
    state: 'Mississippi',
    county: 'Harrison',
  },
  {
    code: '28049',
    state: 'Mississippi',
    county: 'Hinds',
  },
  {
    code: '28051',
    state: 'Mississippi',
    county: 'Holmes',
  },
  {
    code: '28053',
    state: 'Mississippi',
    county: 'Humphreys',
  },
  {
    code: '28055',
    state: 'Mississippi',
    county: 'Issaquena',
  },
  {
    code: '28057',
    state: 'Mississippi',
    county: 'Itawamba',
  },
  {
    code: '28059',
    state: 'Mississippi',
    county: 'Jackson',
  },
  {
    code: '28061',
    state: 'Mississippi',
    county: 'Jasper',
  },
  {
    code: '28063',
    state: 'Mississippi',
    county: 'Jefferson',
  },
  {
    code: '28065',
    state: 'Mississippi',
    county: 'Jefferson Davis',
  },
  {
    code: '28067',
    state: 'Mississippi',
    county: 'Jones',
  },
  {
    code: '28069',
    state: 'Mississippi',
    county: 'Kemper',
  },
  {
    code: '28071',
    state: 'Mississippi',
    county: 'Lafayette',
  },
  {
    code: '28073',
    state: 'Mississippi',
    county: 'Lamar',
  },
  {
    code: '28075',
    state: 'Mississippi',
    county: 'Lauderdale',
  },
  {
    code: '28077',
    state: 'Mississippi',
    county: 'Lawrence',
  },
  {
    code: '28079',
    state: 'Mississippi',
    county: 'Leake',
  },
  {
    code: '28081',
    state: 'Mississippi',
    county: 'Lee',
  },
  {
    code: '28083',
    state: 'Mississippi',
    county: 'Leflore',
  },
  {
    code: '28085',
    state: 'Mississippi',
    county: 'Lincoln',
  },
  {
    code: '28087',
    state: 'Mississippi',
    county: 'Lowndes',
  },
  {
    code: '28089',
    state: 'Mississippi',
    county: 'Madison',
  },
  {
    code: '28091',
    state: 'Mississippi',
    county: 'Marion',
  },
  {
    code: '28093',
    state: 'Mississippi',
    county: 'Marshall',
  },
  {
    code: '28095',
    state: 'Mississippi',
    county: 'Monroe',
  },
  {
    code: '28097',
    state: 'Mississippi',
    county: 'Montgomery',
  },
  {
    code: '28099',
    state: 'Mississippi',
    county: 'Neshoba',
  },
  {
    code: '28101',
    state: 'Mississippi',
    county: 'Newton',
  },
  {
    code: '28103',
    state: 'Mississippi',
    county: 'Noxubee',
  },
  {
    code: '28105',
    state: 'Mississippi',
    county: 'Oktibbeha',
  },
  {
    code: '28107',
    state: 'Mississippi',
    county: 'Panola',
  },
  {
    code: '28109',
    state: 'Mississippi',
    county: 'Pearl River',
  },
  {
    code: '28111',
    state: 'Mississippi',
    county: 'Perry',
  },
  {
    code: '28113',
    state: 'Mississippi',
    county: 'Pike',
  },
  {
    code: '28115',
    state: 'Mississippi',
    county: 'Pontotoc',
  },
  {
    code: '28117',
    state: 'Mississippi',
    county: 'Prentiss',
  },
  {
    code: '28119',
    state: 'Mississippi',
    county: 'Quitman',
  },
  {
    code: '28121',
    state: 'Mississippi',
    county: 'Rankin',
  },
  {
    code: '28123',
    state: 'Mississippi',
    county: 'Scott',
  },
  {
    code: '28125',
    state: 'Mississippi',
    county: 'Sharkey',
  },
  {
    code: '28127',
    state: 'Mississippi',
    county: 'Simpson',
  },
  {
    code: '28129',
    state: 'Mississippi',
    county: 'Smith',
  },
  {
    code: '28131',
    state: 'Mississippi',
    county: 'Stone',
  },
  {
    code: '28133',
    state: 'Mississippi',
    county: 'Sunflower',
  },
  {
    code: '28135',
    state: 'Mississippi',
    county: 'Tallahatchie',
  },
  {
    code: '28137',
    state: 'Mississippi',
    county: 'Tate',
  },
  {
    code: '28139',
    state: 'Mississippi',
    county: 'Tippah',
  },
  {
    code: '28141',
    state: 'Mississippi',
    county: 'Tishomingo',
  },
  {
    code: '28143',
    state: 'Mississippi',
    county: 'Tunica',
  },
  {
    code: '28145',
    state: 'Mississippi',
    county: 'Union',
  },
  {
    code: '28147',
    state: 'Mississippi',
    county: 'Walthall',
  },
  {
    code: '28149',
    state: 'Mississippi',
    county: 'Warren',
  },
  {
    code: '28151',
    state: 'Mississippi',
    county: 'Washington',
  },
  {
    code: '28153',
    state: 'Mississippi',
    county: 'Wayne',
  },
  {
    code: '28155',
    state: 'Mississippi',
    county: 'Webster',
  },
  {
    code: '28157',
    state: 'Mississippi',
    county: 'Wilkinson',
  },
  {
    code: '28159',
    state: 'Mississippi',
    county: 'Winston',
  },
  {
    code: '28161',
    state: 'Mississippi',
    county: 'Yalobusha',
  },
  {
    code: '28163',
    state: 'Mississippi',
    county: 'Yazoo',
  },
  {
    code: '29001',
    state: 'Missouri',
    county: 'Adair',
  },
  {
    code: '29003',
    state: 'Missouri',
    county: 'Andrew',
  },
  {
    code: '29005',
    state: 'Missouri',
    county: 'Atchison',
  },
  {
    code: '29007',
    state: 'Missouri',
    county: 'Audrain',
  },
  {
    code: '29009',
    state: 'Missouri',
    county: 'Barry',
  },
  {
    code: '29011',
    state: 'Missouri',
    county: 'Barton',
  },
  {
    code: '29013',
    state: 'Missouri',
    county: 'Bates',
  },
  {
    code: '29015',
    state: 'Missouri',
    county: 'Benton',
  },
  {
    code: '29017',
    state: 'Missouri',
    county: 'Bollinger',
  },
  {
    code: '29019',
    state: 'Missouri',
    county: 'Boone',
  },
  {
    code: '29021',
    state: 'Missouri',
    county: 'Buchanan',
  },
  {
    code: '29023',
    state: 'Missouri',
    county: 'Butler',
  },
  {
    code: '29025',
    state: 'Missouri',
    county: 'Caldwell',
  },
  {
    code: '29027',
    state: 'Missouri',
    county: 'Callaway',
  },
  {
    code: '29029',
    state: 'Missouri',
    county: 'Camden',
  },
  {
    code: '29031',
    state: 'Missouri',
    county: 'Cape Girardeau',
  },
  {
    code: '29033',
    state: 'Missouri',
    county: 'Carroll',
  },
  {
    code: '29035',
    state: 'Missouri',
    county: 'Carter',
  },
  {
    code: '29037',
    state: 'Missouri',
    county: 'Cass',
  },
  {
    code: '29039',
    state: 'Missouri',
    county: 'Cedar',
  },
  {
    code: '29041',
    state: 'Missouri',
    county: 'Chariton',
  },
  {
    code: '29043',
    state: 'Missouri',
    county: 'Christian',
  },
  {
    code: '29045',
    state: 'Missouri',
    county: 'Clark',
  },
  {
    code: '29047',
    state: 'Missouri',
    county: 'Clay',
  },
  {
    code: '29049',
    state: 'Missouri',
    county: 'Clinton',
  },
  {
    code: '29051',
    state: 'Missouri',
    county: 'Cole',
  },
  {
    code: '29053',
    state: 'Missouri',
    county: 'Cooper',
  },
  {
    code: '29055',
    state: 'Missouri',
    county: 'Crawford',
  },
  {
    code: '29057',
    state: 'Missouri',
    county: 'Dade',
  },
  {
    code: '29059',
    state: 'Missouri',
    county: 'Dallas',
  },
  {
    code: '29061',
    state: 'Missouri',
    county: 'Daviess',
  },
  {
    code: '29063',
    state: 'Missouri',
    county: 'DeKalb',
  },
  {
    code: '29065',
    state: 'Missouri',
    county: 'Dent',
  },
  {
    code: '29067',
    state: 'Missouri',
    county: 'Douglas',
  },
  {
    code: '29069',
    state: 'Missouri',
    county: 'Dunklin',
  },
  {
    code: '29071',
    state: 'Missouri',
    county: 'Franklin',
  },
  {
    code: '29073',
    state: 'Missouri',
    county: 'Gasconade',
  },
  {
    code: '29075',
    state: 'Missouri',
    county: 'Gentry',
  },
  {
    code: '29077',
    state: 'Missouri',
    county: 'Greene',
  },
  {
    code: '29079',
    state: 'Missouri',
    county: 'Grundy',
  },
  {
    code: '29081',
    state: 'Missouri',
    county: 'Harrison',
  },
  {
    code: '29083',
    state: 'Missouri',
    county: 'Henry',
  },
  {
    code: '29085',
    state: 'Missouri',
    county: 'Hickory',
  },
  {
    code: '29087',
    state: 'Missouri',
    county: 'Holt',
  },
  {
    code: '29089',
    state: 'Missouri',
    county: 'Howard',
  },
  {
    code: '29091',
    state: 'Missouri',
    county: 'Howell',
  },
  {
    code: '29093',
    state: 'Missouri',
    county: 'Iron',
  },
  {
    code: '29095',
    state: 'Missouri',
    county: 'Jackson',
  },
  {
    code: '29097',
    state: 'Missouri',
    county: 'Jasper',
  },
  {
    code: '29099',
    state: 'Missouri',
    county: 'Jefferson',
  },
  {
    code: '29101',
    state: 'Missouri',
    county: 'Johnson',
  },
  {
    code: '29103',
    state: 'Missouri',
    county: 'Knox',
  },
  {
    code: '29105',
    state: 'Missouri',
    county: 'Laclede',
  },
  {
    code: '29107',
    state: 'Missouri',
    county: 'Lafayette',
  },
  {
    code: '29109',
    state: 'Missouri',
    county: 'Lawrence',
  },
  {
    code: '29111',
    state: 'Missouri',
    county: 'Lewis',
  },
  {
    code: '29113',
    state: 'Missouri',
    county: 'Lincoln',
  },
  {
    code: '29115',
    state: 'Missouri',
    county: 'Linn',
  },
  {
    code: '29117',
    state: 'Missouri',
    county: 'Livingston',
  },
  {
    code: '29119',
    state: 'Missouri',
    county: 'McDonald',
  },
  {
    code: '29121',
    state: 'Missouri',
    county: 'Macon',
  },
  {
    code: '29123',
    state: 'Missouri',
    county: 'Madison',
  },
  {
    code: '29125',
    state: 'Missouri',
    county: 'Maries',
  },
  {
    code: '29127',
    state: 'Missouri',
    county: 'Marion',
  },
  {
    code: '29129',
    state: 'Missouri',
    county: 'Mercer',
  },
  {
    code: '29131',
    state: 'Missouri',
    county: 'Miller',
  },
  {
    code: '29133',
    state: 'Missouri',
    county: 'Mississippi',
  },
  {
    code: '29135',
    state: 'Missouri',
    county: 'Moniteau',
  },
  {
    code: '29137',
    state: 'Missouri',
    county: 'Monroe',
  },
  {
    code: '29139',
    state: 'Missouri',
    county: 'Montgomery',
  },
  {
    code: '29141',
    state: 'Missouri',
    county: 'Morgan',
  },
  {
    code: '29143',
    state: 'Missouri',
    county: 'New Madrid',
  },
  {
    code: '29145',
    state: 'Missouri',
    county: 'Newton',
  },
  {
    code: '29147',
    state: 'Missouri',
    county: 'Nodaway',
  },
  {
    code: '29149',
    state: 'Missouri',
    county: 'Oregon',
  },
  {
    code: '29151',
    state: 'Missouri',
    county: 'Osage',
  },
  {
    code: '29153',
    state: 'Missouri',
    county: 'Ozark',
  },
  {
    code: '29155',
    state: 'Missouri',
    county: 'Pemiscot',
  },
  {
    code: '29157',
    state: 'Missouri',
    county: 'Perry',
  },
  {
    code: '29159',
    state: 'Missouri',
    county: 'Pettis',
  },
  {
    code: '29161',
    state: 'Missouri',
    county: 'Phelps',
  },
  {
    code: '29163',
    state: 'Missouri',
    county: 'Pike',
  },
  {
    code: '29165',
    state: 'Missouri',
    county: 'Platte',
  },
  {
    code: '29167',
    state: 'Missouri',
    county: 'Polk',
  },
  {
    code: '29169',
    state: 'Missouri',
    county: 'Pulaski',
  },
  {
    code: '29171',
    state: 'Missouri',
    county: 'Putnam',
  },
  {
    code: '29173',
    state: 'Missouri',
    county: 'Ralls',
  },
  {
    code: '29175',
    state: 'Missouri',
    county: 'Randolph',
  },
  {
    code: '29177',
    state: 'Missouri',
    county: 'Ray',
  },
  {
    code: '29179',
    state: 'Missouri',
    county: 'Reynolds',
  },
  {
    code: '29181',
    state: 'Missouri',
    county: 'Ripley',
  },
  {
    code: '29183',
    state: 'Missouri',
    county: 'St. Charles',
  },
  {
    code: '29185',
    state: 'Missouri',
    county: 'St. Clair',
  },
  {
    code: '29186',
    state: 'Missouri',
    county: 'Ste. Genevieve',
  },
  {
    code: '29187',
    state: 'Missouri',
    county: 'St. Francois',
  },
  {
    code: '29189',
    state: 'Missouri',
    county: 'St. Louis',
  },
  {
    code: '29195',
    state: 'Missouri',
    county: 'Saline',
  },
  {
    code: '29197',
    state: 'Missouri',
    county: 'Schuyler',
  },
  {
    code: '29199',
    state: 'Missouri',
    county: 'Scotland',
  },
  {
    code: '29201',
    state: 'Missouri',
    county: 'Scott',
  },
  {
    code: '29203',
    state: 'Missouri',
    county: 'Shannon',
  },
  {
    code: '29205',
    state: 'Missouri',
    county: 'Shelby',
  },
  {
    code: '29207',
    state: 'Missouri',
    county: 'Stoddard',
  },
  {
    code: '29209',
    state: 'Missouri',
    county: 'Stone',
  },
  {
    code: '29211',
    state: 'Missouri',
    county: 'Sullivan',
  },
  {
    code: '29213',
    state: 'Missouri',
    county: 'Taney',
  },
  {
    code: '29215',
    state: 'Missouri',
    county: 'Texas',
  },
  {
    code: '29217',
    state: 'Missouri',
    county: 'Vernon',
  },
  {
    code: '29219',
    state: 'Missouri',
    county: 'Warren',
  },
  {
    code: '29221',
    state: 'Missouri',
    county: 'Washington',
  },
  {
    code: '29223',
    state: 'Missouri',
    county: 'Wayne',
  },
  {
    code: '29225',
    state: 'Missouri',
    county: 'Webster',
  },
  {
    code: '29227',
    state: 'Missouri',
    county: 'Worth',
  },
  {
    code: '29229',
    state: 'Missouri',
    county: 'Wright',
  },
  {
    code: '29510',
    state: 'Missouri',
    county: 'St. Louis city',
  },
  {
    code: '30001',
    state: 'Montana',
    county: 'Beaverhead',
  },
  {
    code: '30003',
    state: 'Montana',
    county: 'Big Horn',
  },
  {
    code: '30005',
    state: 'Montana',
    county: 'Blaine',
  },
  {
    code: '30007',
    state: 'Montana',
    county: 'Broadwater',
  },
  {
    code: '30009',
    state: 'Montana',
    county: 'Carbon',
  },
  {
    code: '30011',
    state: 'Montana',
    county: 'Carter',
  },
  {
    code: '30013',
    state: 'Montana',
    county: 'Cascade',
  },
  {
    code: '30015',
    state: 'Montana',
    county: 'Chouteau',
  },
  {
    code: '30017',
    state: 'Montana',
    county: 'Custer',
  },
  {
    code: '30019',
    state: 'Montana',
    county: 'Daniels',
  },
  {
    code: '30021',
    state: 'Montana',
    county: 'Dawson',
  },
  {
    code: '30023',
    state: 'Montana',
    county: 'Deer Lodge',
  },
  {
    code: '30025',
    state: 'Montana',
    county: 'Fallon',
  },
  {
    code: '30027',
    state: 'Montana',
    county: 'Fergus',
  },
  {
    code: '30029',
    state: 'Montana',
    county: 'Flathead',
  },
  {
    code: '30031',
    state: 'Montana',
    county: 'Gallatin',
  },
  {
    code: '30033',
    state: 'Montana',
    county: 'Garfield',
  },
  {
    code: '30035',
    state: 'Montana',
    county: 'Glacier',
  },
  {
    code: '30037',
    state: 'Montana',
    county: 'Golden Valley',
  },
  {
    code: '30039',
    state: 'Montana',
    county: 'Granite',
  },
  {
    code: '30041',
    state: 'Montana',
    county: 'Hill',
  },
  {
    code: '30043',
    state: 'Montana',
    county: 'Jefferson',
  },
  {
    code: '30045',
    state: 'Montana',
    county: 'Judith Basin',
  },
  {
    code: '30047',
    state: 'Montana',
    county: 'Lake',
  },
  {
    code: '30049',
    state: 'Montana',
    county: 'Lewis and Clark',
  },
  {
    code: '30051',
    state: 'Montana',
    county: 'Liberty',
  },
  {
    code: '30053',
    state: 'Montana',
    county: 'Lincoln',
  },
  {
    code: '30055',
    state: 'Montana',
    county: 'McCone',
  },
  {
    code: '30057',
    state: 'Montana',
    county: 'Madison',
  },
  {
    code: '30059',
    state: 'Montana',
    county: 'Meagher',
  },
  {
    code: '30061',
    state: 'Montana',
    county: 'Mineral',
  },
  {
    code: '30063',
    state: 'Montana',
    county: 'Missoula',
  },
  {
    code: '30065',
    state: 'Montana',
    county: 'Musselshell',
  },
  {
    code: '30067',
    state: 'Montana',
    county: 'Park',
  },
  {
    code: '30069',
    state: 'Montana',
    county: 'Petroleum',
  },
  {
    code: '30071',
    state: 'Montana',
    county: 'Phillips',
  },
  {
    code: '30073',
    state: 'Montana',
    county: 'Pondera',
  },
  {
    code: '30075',
    state: 'Montana',
    county: 'Powder River',
  },
  {
    code: '30077',
    state: 'Montana',
    county: 'Powell',
  },
  {
    code: '30079',
    state: 'Montana',
    county: 'Prairie',
  },
  {
    code: '30081',
    state: 'Montana',
    county: 'Ravalli',
  },
  {
    code: '30083',
    state: 'Montana',
    county: 'Richland',
  },
  {
    code: '30085',
    state: 'Montana',
    county: 'Roosevelt',
  },
  {
    code: '30087',
    state: 'Montana',
    county: 'Rosebud',
  },
  {
    code: '30089',
    state: 'Montana',
    county: 'Sanders',
  },
  {
    code: '30091',
    state: 'Montana',
    county: 'Sheridan',
  },
  {
    code: '30093',
    state: 'Montana',
    county: 'Silver Bow',
  },
  {
    code: '30095',
    state: 'Montana',
    county: 'Stillwater',
  },
  {
    code: '30097',
    state: 'Montana',
    county: 'Sweet Grass',
  },
  {
    code: '30099',
    state: 'Montana',
    county: 'Teton',
  },
  {
    code: '30101',
    state: 'Montana',
    county: 'Toole',
  },
  {
    code: '30103',
    state: 'Montana',
    county: 'Treasure',
  },
  {
    code: '30105',
    state: 'Montana',
    county: 'Valley',
  },
  {
    code: '30107',
    state: 'Montana',
    county: 'Wheatland',
  },
  {
    code: '30109',
    state: 'Montana',
    county: 'Wibaux',
  },
  {
    code: '30111',
    state: 'Montana',
    county: 'Yellowstone',
  },
  {
    code: '31001',
    state: 'Nebraska',
    county: 'Adams',
  },
  {
    code: '31003',
    state: 'Nebraska',
    county: 'Antelope',
  },
  {
    code: '31005',
    state: 'Nebraska',
    county: 'Arthur',
  },
  {
    code: '31007',
    state: 'Nebraska',
    county: 'Banner',
  },
  {
    code: '31009',
    state: 'Nebraska',
    county: 'Blaine',
  },
  {
    code: '31011',
    state: 'Nebraska',
    county: 'Boone',
  },
  {
    code: '31013',
    state: 'Nebraska',
    county: 'Box Butte',
  },
  {
    code: '31015',
    state: 'Nebraska',
    county: 'Boyd',
  },
  {
    code: '31017',
    state: 'Nebraska',
    county: 'Brown',
  },
  {
    code: '31019',
    state: 'Nebraska',
    county: 'Buffalo',
  },
  {
    code: '31021',
    state: 'Nebraska',
    county: 'Burt',
  },
  {
    code: '31023',
    state: 'Nebraska',
    county: 'Butler',
  },
  {
    code: '31025',
    state: 'Nebraska',
    county: 'Cass',
  },
  {
    code: '31027',
    state: 'Nebraska',
    county: 'Cedar',
  },
  {
    code: '31029',
    state: 'Nebraska',
    county: 'Chase',
  },
  {
    code: '31031',
    state: 'Nebraska',
    county: 'Cherry',
  },
  {
    code: '31033',
    state: 'Nebraska',
    county: 'Cheyenne',
  },
  {
    code: '31035',
    state: 'Nebraska',
    county: 'Clay',
  },
  {
    code: '31037',
    state: 'Nebraska',
    county: 'Colfax',
  },
  {
    code: '31039',
    state: 'Nebraska',
    county: 'Cuming',
  },
  {
    code: '31041',
    state: 'Nebraska',
    county: 'Custer',
  },
  {
    code: '31043',
    state: 'Nebraska',
    county: 'Dakota',
  },
  {
    code: '31045',
    state: 'Nebraska',
    county: 'Dawes',
  },
  {
    code: '31047',
    state: 'Nebraska',
    county: 'Dawson',
  },
  {
    code: '31049',
    state: 'Nebraska',
    county: 'Deuel',
  },
  {
    code: '31051',
    state: 'Nebraska',
    county: 'Dixon',
  },
  {
    code: '31053',
    state: 'Nebraska',
    county: 'Dodge',
  },
  {
    code: '31055',
    state: 'Nebraska',
    county: 'Douglas',
  },
  {
    code: '31057',
    state: 'Nebraska',
    county: 'Dundy',
  },
  {
    code: '31059',
    state: 'Nebraska',
    county: 'Fillmore',
  },
  {
    code: '31061',
    state: 'Nebraska',
    county: 'Franklin',
  },
  {
    code: '31063',
    state: 'Nebraska',
    county: 'Frontier',
  },
  {
    code: '31065',
    state: 'Nebraska',
    county: 'Furnas',
  },
  {
    code: '31067',
    state: 'Nebraska',
    county: 'Gage',
  },
  {
    code: '31069',
    state: 'Nebraska',
    county: 'Garden',
  },
  {
    code: '31071',
    state: 'Nebraska',
    county: 'Garfield',
  },
  {
    code: '31073',
    state: 'Nebraska',
    county: 'Gosper',
  },
  {
    code: '31075',
    state: 'Nebraska',
    county: 'Grant',
  },
  {
    code: '31077',
    state: 'Nebraska',
    county: 'Greeley',
  },
  {
    code: '31079',
    state: 'Nebraska',
    county: 'Hall',
  },
  {
    code: '31081',
    state: 'Nebraska',
    county: 'Hamilton',
  },
  {
    code: '31083',
    state: 'Nebraska',
    county: 'Harlan',
  },
  {
    code: '31085',
    state: 'Nebraska',
    county: 'Hayes',
  },
  {
    code: '31087',
    state: 'Nebraska',
    county: 'Hitchcock',
  },
  {
    code: '31089',
    state: 'Nebraska',
    county: 'Holt',
  },
  {
    code: '31091',
    state: 'Nebraska',
    county: 'Hooker',
  },
  {
    code: '31093',
    state: 'Nebraska',
    county: 'Howard',
  },
  {
    code: '31095',
    state: 'Nebraska',
    county: 'Jefferson',
  },
  {
    code: '31097',
    state: 'Nebraska',
    county: 'Johnson',
  },
  {
    code: '31099',
    state: 'Nebraska',
    county: 'Kearney',
  },
  {
    code: '31101',
    state: 'Nebraska',
    county: 'Keith',
  },
  {
    code: '31103',
    state: 'Nebraska',
    county: 'Keya Paha',
  },
  {
    code: '31105',
    state: 'Nebraska',
    county: 'Kimball',
  },
  {
    code: '31107',
    state: 'Nebraska',
    county: 'Knox',
  },
  {
    code: '31109',
    state: 'Nebraska',
    county: 'Lancaster',
  },
  {
    code: '31111',
    state: 'Nebraska',
    county: 'Lincoln',
  },
  {
    code: '31113',
    state: 'Nebraska',
    county: 'Logan',
  },
  {
    code: '31115',
    state: 'Nebraska',
    county: 'Loup',
  },
  {
    code: '31117',
    state: 'Nebraska',
    county: 'McPherson',
  },
  {
    code: '31119',
    state: 'Nebraska',
    county: 'Madison',
  },
  {
    code: '31121',
    state: 'Nebraska',
    county: 'Merrick',
  },
  {
    code: '31123',
    state: 'Nebraska',
    county: 'Morrill',
  },
  {
    code: '31125',
    state: 'Nebraska',
    county: 'Nance',
  },
  {
    code: '31127',
    state: 'Nebraska',
    county: 'Nemaha',
  },
  {
    code: '31129',
    state: 'Nebraska',
    county: 'Nuckolls',
  },
  {
    code: '31131',
    state: 'Nebraska',
    county: 'Otoe',
  },
  {
    code: '31133',
    state: 'Nebraska',
    county: 'Pawnee',
  },
  {
    code: '31135',
    state: 'Nebraska',
    county: 'Perkins',
  },
  {
    code: '31137',
    state: 'Nebraska',
    county: 'Phelps',
  },
  {
    code: '31139',
    state: 'Nebraska',
    county: 'Pierce',
  },
  {
    code: '31141',
    state: 'Nebraska',
    county: 'Platte',
  },
  {
    code: '31143',
    state: 'Nebraska',
    county: 'Polk',
  },
  {
    code: '31145',
    state: 'Nebraska',
    county: 'Red Willow',
  },
  {
    code: '31147',
    state: 'Nebraska',
    county: 'Richardson',
  },
  {
    code: '31149',
    state: 'Nebraska',
    county: 'Rock',
  },
  {
    code: '31151',
    state: 'Nebraska',
    county: 'Saline',
  },
  {
    code: '31153',
    state: 'Nebraska',
    county: 'Sarpy',
  },
  {
    code: '31155',
    state: 'Nebraska',
    county: 'Saunders',
  },
  {
    code: '31157',
    state: 'Nebraska',
    county: 'Scotts Bluff',
  },
  {
    code: '31159',
    state: 'Nebraska',
    county: 'Seward',
  },
  {
    code: '31161',
    state: 'Nebraska',
    county: 'Sheridan',
  },
  {
    code: '31163',
    state: 'Nebraska',
    county: 'Sherman',
  },
  {
    code: '31165',
    state: 'Nebraska',
    county: 'Sioux',
  },
  {
    code: '31167',
    state: 'Nebraska',
    county: 'Stanton',
  },
  {
    code: '31169',
    state: 'Nebraska',
    county: 'Thayer',
  },
  {
    code: '31171',
    state: 'Nebraska',
    county: 'Thomas',
  },
  {
    code: '31173',
    state: 'Nebraska',
    county: 'Thurston',
  },
  {
    code: '31175',
    state: 'Nebraska',
    county: 'Valley',
  },
  {
    code: '31177',
    state: 'Nebraska',
    county: 'Washington',
  },
  {
    code: '31179',
    state: 'Nebraska',
    county: 'Wayne',
  },
  {
    code: '31181',
    state: 'Nebraska',
    county: 'Webster',
  },
  {
    code: '31183',
    state: 'Nebraska',
    county: 'Wheeler',
  },
  {
    code: '31185',
    state: 'Nebraska',
    county: 'York',
  },
  {
    code: '32001',
    state: 'Nevada',
    county: 'Churchill',
  },
  {
    code: '32003',
    state: 'Nevada',
    county: 'Clark',
  },
  {
    code: '32005',
    state: 'Nevada',
    county: 'Douglas',
  },
  {
    code: '32007',
    state: 'Nevada',
    county: 'Elko',
  },
  {
    code: '32009',
    state: 'Nevada',
    county: 'Esmeralda',
  },
  {
    code: '32011',
    state: 'Nevada',
    county: 'Eureka',
  },
  {
    code: '32013',
    state: 'Nevada',
    county: 'Humboldt',
  },
  {
    code: '32015',
    state: 'Nevada',
    county: 'Lander',
  },
  {
    code: '32017',
    state: 'Nevada',
    county: 'Lincoln',
  },
  {
    code: '32019',
    state: 'Nevada',
    county: 'Lyon',
  },
  {
    code: '32021',
    state: 'Nevada',
    county: 'Mineral',
  },
  {
    code: '32023',
    state: 'Nevada',
    county: 'Nye',
  },
  {
    code: '32027',
    state: 'Nevada',
    county: 'Pershing',
  },
  {
    code: '32029',
    state: 'Nevada',
    county: 'Storey',
  },
  {
    code: '32031',
    state: 'Nevada',
    county: 'Washoe',
  },
  {
    code: '32033',
    state: 'Nevada',
    county: 'White Pine',
  },
  {
    code: '32510',
    state: 'Nevada',
    county: 'Carson city',
  },
  {
    code: '33001',
    state: 'New Hampshire',
    county: 'Belknap',
  },
  {
    code: '33003',
    state: 'New Hampshire',
    county: 'Carroll',
  },
  {
    code: '33005',
    state: 'New Hampshire',
    county: 'Cheshire',
  },
  {
    code: '33007',
    state: 'New Hampshire',
    county: 'Coos',
  },
  {
    code: '33009',
    state: 'New Hampshire',
    county: 'Grafton',
  },
  {
    code: '33011',
    state: 'New Hampshire',
    county: 'Hillsborough',
  },
  {
    code: '33013',
    state: 'New Hampshire',
    county: 'Merrimack',
  },
  {
    code: '33015',
    state: 'New Hampshire',
    county: 'Rockingham',
  },
  {
    code: '33017',
    state: 'New Hampshire',
    county: 'Strafford',
  },
  {
    code: '33019',
    state: 'New Hampshire',
    county: 'Sullivan',
  },
  {
    code: '34001',
    state: 'New Jersey',
    county: 'Atlantic',
  },
  {
    code: '34003',
    state: 'New Jersey',
    county: 'Bergen',
  },
  {
    code: '34005',
    state: 'New Jersey',
    county: 'Burlington',
  },
  {
    code: '34007',
    state: 'New Jersey',
    county: 'Camden',
  },
  {
    code: '34009',
    state: 'New Jersey',
    county: 'Cape May',
  },
  {
    code: '34011',
    state: 'New Jersey',
    county: 'Cumberland',
  },
  {
    code: '34013',
    state: 'New Jersey',
    county: 'Essex',
  },
  {
    code: '34015',
    state: 'New Jersey',
    county: 'Gloucester',
  },
  {
    code: '34017',
    state: 'New Jersey',
    county: 'Hudson',
  },
  {
    code: '34019',
    state: 'New Jersey',
    county: 'Hunterdon',
  },
  {
    code: '34021',
    state: 'New Jersey',
    county: 'Mercer',
  },
  {
    code: '34023',
    state: 'New Jersey',
    county: 'Middlesex',
  },
  {
    code: '34025',
    state: 'New Jersey',
    county: 'Monmouth',
  },
  {
    code: '34027',
    state: 'New Jersey',
    county: 'Morris',
  },
  {
    code: '34029',
    state: 'New Jersey',
    county: 'Ocean',
  },
  {
    code: '34031',
    state: 'New Jersey',
    county: 'Passaic',
  },
  {
    code: '34033',
    state: 'New Jersey',
    county: 'Salem',
  },
  {
    code: '34035',
    state: 'New Jersey',
    county: 'Somerset',
  },
  {
    code: '34037',
    state: 'New Jersey',
    county: 'Sussex',
  },
  {
    code: '34039',
    state: 'New Jersey',
    county: 'Union',
  },
  {
    code: '34041',
    state: 'New Jersey',
    county: 'Warren',
  },
  {
    code: '35001',
    state: 'New Mexico',
    county: 'Bernalillo',
  },
  {
    code: '35003',
    state: 'New Mexico',
    county: 'Catron',
  },
  {
    code: '35005',
    state: 'New Mexico',
    county: 'Chaves',
  },
  {
    code: '35006',
    state: 'New Mexico',
    county: 'Cibola',
  },
  {
    code: '35007',
    state: 'New Mexico',
    county: 'Colfax',
  },
  {
    code: '35009',
    state: 'New Mexico',
    county: 'Curry',
  },
  {
    code: '35011',
    state: 'New Mexico',
    county: 'De Baca',
  },
  {
    code: '35013',
    state: 'New Mexico',
    county: 'Dona Ana',
  },
  {
    code: '35015',
    state: 'New Mexico',
    county: 'Eddy',
  },
  {
    code: '35017',
    state: 'New Mexico',
    county: 'Grant',
  },
  {
    code: '35019',
    state: 'New Mexico',
    county: 'Guadalupe',
  },
  {
    code: '35021',
    state: 'New Mexico',
    county: 'Harding',
  },
  {
    code: '35023',
    state: 'New Mexico',
    county: 'Hidalgo',
  },
  {
    code: '35025',
    state: 'New Mexico',
    county: 'Lea',
  },
  {
    code: '35027',
    state: 'New Mexico',
    county: 'Lincoln',
  },
  {
    code: '35028',
    state: 'New Mexico',
    county: 'Los Alamos',
  },
  {
    code: '35029',
    state: 'New Mexico',
    county: 'Luna',
  },
  {
    code: '35031',
    state: 'New Mexico',
    county: 'McKinley',
  },
  {
    code: '35033',
    state: 'New Mexico',
    county: 'Mora',
  },
  {
    code: '35035',
    state: 'New Mexico',
    county: 'Otero',
  },
  {
    code: '35037',
    state: 'New Mexico',
    county: 'Quay',
  },
  {
    code: '35039',
    state: 'New Mexico',
    county: 'Rio Arriba',
  },
  {
    code: '35041',
    state: 'New Mexico',
    county: 'Roosevelt',
  },
  {
    code: '35043',
    state: 'New Mexico',
    county: 'Sandoval',
  },
  {
    code: '35045',
    state: 'New Mexico',
    county: 'San Juan',
  },
  {
    code: '35047',
    state: 'New Mexico',
    county: 'San Miguel',
  },
  {
    code: '35049',
    state: 'New Mexico',
    county: 'Santa Fe',
  },
  {
    code: '35051',
    state: 'New Mexico',
    county: 'Sierra',
  },
  {
    code: '35053',
    state: 'New Mexico',
    county: 'Socorro',
  },
  {
    code: '35055',
    state: 'New Mexico',
    county: 'Taos',
  },
  {
    code: '35057',
    state: 'New Mexico',
    county: 'Torrance',
  },
  {
    code: '35059',
    state: 'New Mexico',
    county: 'Union',
  },
  {
    code: '35061',
    state: 'New Mexico',
    county: 'Valencia',
  },
  {
    code: '36001',
    state: 'New York',
    county: 'Albany',
  },
  {
    code: '36003',
    state: 'New York',
    county: 'Allegany',
  },
  {
    code: '36005',
    state: 'New York',
    county: 'Bronx',
  },
  {
    code: '36007',
    state: 'New York',
    county: 'Broome',
  },
  {
    code: '36009',
    state: 'New York',
    county: 'Cattaraugus',
  },
  {
    code: '36011',
    state: 'New York',
    county: 'Cayuga',
  },
  {
    code: '36013',
    state: 'New York',
    county: 'Chautauqua',
  },
  {
    code: '36015',
    state: 'New York',
    county: 'Chemung',
  },
  {
    code: '36017',
    state: 'New York',
    county: 'Chenango',
  },
  {
    code: '36019',
    state: 'New York',
    county: 'Clinton',
  },
  {
    code: '36021',
    state: 'New York',
    county: 'Columbia',
  },
  {
    code: '36023',
    state: 'New York',
    county: 'Cortland',
  },
  {
    code: '36025',
    state: 'New York',
    county: 'Delaware',
  },
  {
    code: '36027',
    state: 'New York',
    county: 'Dutchess',
  },
  {
    code: '36029',
    state: 'New York',
    county: 'Erie',
  },
  {
    code: '36031',
    state: 'New York',
    county: 'Essex',
  },
  {
    code: '36033',
    state: 'New York',
    county: 'Franklin',
  },
  {
    code: '36035',
    state: 'New York',
    county: 'Fulton',
  },
  {
    code: '36037',
    state: 'New York',
    county: 'Genesee',
  },
  {
    code: '36039',
    state: 'New York',
    county: 'Greene',
  },
  {
    code: '36041',
    state: 'New York',
    county: 'Hamilton',
  },
  {
    code: '36043',
    state: 'New York',
    county: 'Herkimer',
  },
  {
    code: '36045',
    state: 'New York',
    county: 'Jefferson',
  },
  {
    code: '36047',
    state: 'New York',
    county: 'Kings',
  },
  {
    code: '36049',
    state: 'New York',
    county: 'Lewis',
  },
  {
    code: '36051',
    state: 'New York',
    county: 'Livingston',
  },
  {
    code: '36053',
    state: 'New York',
    county: 'Madison',
  },
  {
    code: '36055',
    state: 'New York',
    county: 'Monroe',
  },
  {
    code: '36057',
    state: 'New York',
    county: 'Montgomery',
  },
  {
    code: '36059',
    state: 'New York',
    county: 'Nassau',
  },
  {
    code: '36061',
    state: 'New York',
    county: 'New York',
  },
  {
    code: '36063',
    state: 'New York',
    county: 'Niagara',
  },
  {
    code: '36065',
    state: 'New York',
    county: 'Oneida',
  },
  {
    code: '36067',
    state: 'New York',
    county: 'Onondaga',
  },
  {
    code: '36069',
    state: 'New York',
    county: 'Ontario',
  },
  {
    code: '36071',
    state: 'New York',
    county: 'Orange',
  },
  {
    code: '36073',
    state: 'New York',
    county: 'Orleans',
  },
  {
    code: '36075',
    state: 'New York',
    county: 'Oswego',
  },
  {
    code: '36077',
    state: 'New York',
    county: 'Otsego',
  },
  {
    code: '36079',
    state: 'New York',
    county: 'Putnam',
  },
  {
    code: '36081',
    state: 'New York',
    county: 'Queens',
  },
  {
    code: '36083',
    state: 'New York',
    county: 'Rensselaer',
  },
  {
    code: '36085',
    state: 'New York',
    county: 'Richmond',
  },
  {
    code: '36087',
    state: 'New York',
    county: 'Rockland',
  },
  {
    code: '36089',
    state: 'New York',
    county: 'St. Lawrence',
  },
  {
    code: '36091',
    state: 'New York',
    county: 'Saratoga',
  },
  {
    code: '36093',
    state: 'New York',
    county: 'Schenectady',
  },
  {
    code: '36095',
    state: 'New York',
    county: 'Schoharie',
  },
  {
    code: '36097',
    state: 'New York',
    county: 'Schuyler',
  },
  {
    code: '36099',
    state: 'New York',
    county: 'Seneca',
  },
  {
    code: '36101',
    state: 'New York',
    county: 'Steuben',
  },
  {
    code: '36103',
    state: 'New York',
    county: 'Suffolk',
  },
  {
    code: '36105',
    state: 'New York',
    county: 'Sullivan',
  },
  {
    code: '36107',
    state: 'New York',
    county: 'Tioga',
  },
  {
    code: '36109',
    state: 'New York',
    county: 'Tompkins',
  },
  {
    code: '36111',
    state: 'New York',
    county: 'Ulster',
  },
  {
    code: '36113',
    state: 'New York',
    county: 'Warren',
  },
  {
    code: '36115',
    state: 'New York',
    county: 'Washington',
  },
  {
    code: '36117',
    state: 'New York',
    county: 'Wayne',
  },
  {
    code: '36119',
    state: 'New York',
    county: 'Westchester',
  },
  {
    code: '36121',
    state: 'New York',
    county: 'Wyoming',
  },
  {
    code: '36123',
    state: 'New York',
    county: 'Yates',
  },
  {
    code: '37001',
    state: 'North Carolina',
    county: 'Alamance',
  },
  {
    code: '37003',
    state: 'North Carolina',
    county: 'Alexander',
  },
  {
    code: '37005',
    state: 'North Carolina',
    county: 'Alleghany',
  },
  {
    code: '37007',
    state: 'North Carolina',
    county: 'Anson',
  },
  {
    code: '37009',
    state: 'North Carolina',
    county: 'Ashe',
  },
  {
    code: '37011',
    state: 'North Carolina',
    county: 'Avery',
  },
  {
    code: '37013',
    state: 'North Carolina',
    county: 'Beaufort',
  },
  {
    code: '37015',
    state: 'North Carolina',
    county: 'Bertie',
  },
  {
    code: '37017',
    state: 'North Carolina',
    county: 'Bladen',
  },
  {
    code: '37019',
    state: 'North Carolina',
    county: 'Brunswick',
  },
  {
    code: '37021',
    state: 'North Carolina',
    county: 'Buncombe',
  },
  {
    code: '37023',
    state: 'North Carolina',
    county: 'Burke',
  },
  {
    code: '37025',
    state: 'North Carolina',
    county: 'Cabarrus',
  },
  {
    code: '37027',
    state: 'North Carolina',
    county: 'Caldwell',
  },
  {
    code: '37029',
    state: 'North Carolina',
    county: 'Camden',
  },
  {
    code: '37031',
    state: 'North Carolina',
    county: 'Carteret',
  },
  {
    code: '37033',
    state: 'North Carolina',
    county: 'Caswell',
  },
  {
    code: '37035',
    state: 'North Carolina',
    county: 'Catawba',
  },
  {
    code: '37037',
    state: 'North Carolina',
    county: 'Chatham',
  },
  {
    code: '37039',
    state: 'North Carolina',
    county: 'Cherokee',
  },
  {
    code: '37041',
    state: 'North Carolina',
    county: 'Chowan',
  },
  {
    code: '37043',
    state: 'North Carolina',
    county: 'Clay',
  },
  {
    code: '37045',
    state: 'North Carolina',
    county: 'Cleveland',
  },
  {
    code: '37047',
    state: 'North Carolina',
    county: 'Columbus',
  },
  {
    code: '37049',
    state: 'North Carolina',
    county: 'Craven',
  },
  {
    code: '37051',
    state: 'North Carolina',
    county: 'Cumberland',
  },
  {
    code: '37053',
    state: 'North Carolina',
    county: 'Currituck',
  },
  {
    code: '37055',
    state: 'North Carolina',
    county: 'Dare',
  },
  {
    code: '37057',
    state: 'North Carolina',
    county: 'Davidson',
  },
  {
    code: '37059',
    state: 'North Carolina',
    county: 'Davie',
  },
  {
    code: '37061',
    state: 'North Carolina',
    county: 'Duplin',
  },
  {
    code: '37063',
    state: 'North Carolina',
    county: 'Durham',
  },
  {
    code: '37065',
    state: 'North Carolina',
    county: 'Edgecombe',
  },
  {
    code: '37067',
    state: 'North Carolina',
    county: 'Forsyth',
  },
  {
    code: '37069',
    state: 'North Carolina',
    county: 'Franklin',
  },
  {
    code: '37071',
    state: 'North Carolina',
    county: 'Gaston',
  },
  {
    code: '37073',
    state: 'North Carolina',
    county: 'Gates',
  },
  {
    code: '37075',
    state: 'North Carolina',
    county: 'Graham',
  },
  {
    code: '37077',
    state: 'North Carolina',
    county: 'Granville',
  },
  {
    code: '37079',
    state: 'North Carolina',
    county: 'Greene',
  },
  {
    code: '37081',
    state: 'North Carolina',
    county: 'Guilford',
  },
  {
    code: '37083',
    state: 'North Carolina',
    county: 'Halifax',
  },
  {
    code: '37085',
    state: 'North Carolina',
    county: 'Harnett',
  },
  {
    code: '37087',
    state: 'North Carolina',
    county: 'Haywood',
  },
  {
    code: '37089',
    state: 'North Carolina',
    county: 'Henderson',
  },
  {
    code: '37091',
    state: 'North Carolina',
    county: 'Hertford',
  },
  {
    code: '37093',
    state: 'North Carolina',
    county: 'Hoke',
  },
  {
    code: '37095',
    state: 'North Carolina',
    county: 'Hyde',
  },
  {
    code: '37097',
    state: 'North Carolina',
    county: 'Iredell',
  },
  {
    code: '37099',
    state: 'North Carolina',
    county: 'Jackson',
  },
  {
    code: '37101',
    state: 'North Carolina',
    county: 'Johnston',
  },
  {
    code: '37103',
    state: 'North Carolina',
    county: 'Jones',
  },
  {
    code: '37105',
    state: 'North Carolina',
    county: 'Lee',
  },
  {
    code: '37107',
    state: 'North Carolina',
    county: 'Lenoir',
  },
  {
    code: '37109',
    state: 'North Carolina',
    county: 'Lincoln',
  },
  {
    code: '37111',
    state: 'North Carolina',
    county: 'McDowell',
  },
  {
    code: '37113',
    state: 'North Carolina',
    county: 'Macon',
  },
  {
    code: '37115',
    state: 'North Carolina',
    county: 'Madison',
  },
  {
    code: '37117',
    state: 'North Carolina',
    county: 'Martin',
  },
  {
    code: '37119',
    state: 'North Carolina',
    county: 'Mecklenburg',
  },
  {
    code: '37121',
    state: 'North Carolina',
    county: 'Mitchell',
  },
  {
    code: '37123',
    state: 'North Carolina',
    county: 'Montgomery',
  },
  {
    code: '37125',
    state: 'North Carolina',
    county: 'Moore',
  },
  {
    code: '37127',
    state: 'North Carolina',
    county: 'Nash',
  },
  {
    code: '37129',
    state: 'North Carolina',
    county: 'New Hanover',
  },
  {
    code: '37131',
    state: 'North Carolina',
    county: 'Northampton',
  },
  {
    code: '37133',
    state: 'North Carolina',
    county: 'Onslow',
  },
  {
    code: '37135',
    state: 'North Carolina',
    county: 'Orange',
  },
  {
    code: '37137',
    state: 'North Carolina',
    county: 'Pamlico',
  },
  {
    code: '37139',
    state: 'North Carolina',
    county: 'Pasquotank',
  },
  {
    code: '37141',
    state: 'North Carolina',
    county: 'Pender',
  },
  {
    code: '37143',
    state: 'North Carolina',
    county: 'Perquimans',
  },
  {
    code: '37145',
    state: 'North Carolina',
    county: 'Person',
  },
  {
    code: '37147',
    state: 'North Carolina',
    county: 'Pitt',
  },
  {
    code: '37149',
    state: 'North Carolina',
    county: 'Polk',
  },
  {
    code: '37151',
    state: 'North Carolina',
    county: 'Randolph',
  },
  {
    code: '37153',
    state: 'North Carolina',
    county: 'Richmond',
  },
  {
    code: '37155',
    state: 'North Carolina',
    county: 'Robeson',
  },
  {
    code: '37157',
    state: 'North Carolina',
    county: 'Rockingham',
  },
  {
    code: '37159',
    state: 'North Carolina',
    county: 'Rowan',
  },
  {
    code: '37161',
    state: 'North Carolina',
    county: 'Rutherford',
  },
  {
    code: '37163',
    state: 'North Carolina',
    county: 'Sampson',
  },
  {
    code: '37165',
    state: 'North Carolina',
    county: 'Scotland',
  },
  {
    code: '37167',
    state: 'North Carolina',
    county: 'Stanly',
  },
  {
    code: '37169',
    state: 'North Carolina',
    county: 'Stokes',
  },
  {
    code: '37171',
    state: 'North Carolina',
    county: 'Surry',
  },
  {
    code: '37173',
    state: 'North Carolina',
    county: 'Swain',
  },
  {
    code: '37175',
    state: 'North Carolina',
    county: 'Transylvania',
  },
  {
    code: '37177',
    state: 'North Carolina',
    county: 'Tyrrell',
  },
  {
    code: '37179',
    state: 'North Carolina',
    county: 'Union',
  },
  {
    code: '37181',
    state: 'North Carolina',
    county: 'Vance',
  },
  {
    code: '37183',
    state: 'North Carolina',
    county: 'Wake',
  },
  {
    code: '37185',
    state: 'North Carolina',
    county: 'Warren',
  },
  {
    code: '37187',
    state: 'North Carolina',
    county: 'Washington',
  },
  {
    code: '37189',
    state: 'North Carolina',
    county: 'Watauga',
  },
  {
    code: '37191',
    state: 'North Carolina',
    county: 'Wayne',
  },
  {
    code: '37193',
    state: 'North Carolina',
    county: 'Wilkes',
  },
  {
    code: '37195',
    state: 'North Carolina',
    county: 'Wilson',
  },
  {
    code: '37197',
    state: 'North Carolina',
    county: 'Yadkin',
  },
  {
    code: '37199',
    state: 'North Carolina',
    county: 'Yancey',
  },
  {
    code: '38001',
    state: 'North Dakota',
    county: 'Adams',
  },
  {
    code: '38003',
    state: 'North Dakota',
    county: 'Barnes',
  },
  {
    code: '38005',
    state: 'North Dakota',
    county: 'Benson',
  },
  {
    code: '38007',
    state: 'North Dakota',
    county: 'Billings',
  },
  {
    code: '38009',
    state: 'North Dakota',
    county: 'Bottineau',
  },
  {
    code: '38011',
    state: 'North Dakota',
    county: 'Bowman',
  },
  {
    code: '38013',
    state: 'North Dakota',
    county: 'Burke',
  },
  {
    code: '38015',
    state: 'North Dakota',
    county: 'Burleigh',
  },
  {
    code: '38017',
    state: 'North Dakota',
    county: 'Cass',
  },
  {
    code: '38019',
    state: 'North Dakota',
    county: 'Cavalier',
  },
  {
    code: '38021',
    state: 'North Dakota',
    county: 'Dickey',
  },
  {
    code: '38023',
    state: 'North Dakota',
    county: 'Divide',
  },
  {
    code: '38025',
    state: 'North Dakota',
    county: 'Dunn',
  },
  {
    code: '38027',
    state: 'North Dakota',
    county: 'Eddy',
  },
  {
    code: '38029',
    state: 'North Dakota',
    county: 'Emmons',
  },
  {
    code: '38031',
    state: 'North Dakota',
    county: 'Foster',
  },
  {
    code: '38033',
    state: 'North Dakota',
    county: 'Golden Valley',
  },
  {
    code: '38035',
    state: 'North Dakota',
    county: 'Grand Forks',
  },
  {
    code: '38037',
    state: 'North Dakota',
    county: 'Grant',
  },
  {
    code: '38039',
    state: 'North Dakota',
    county: 'Griggs',
  },
  {
    code: '38041',
    state: 'North Dakota',
    county: 'Hettinger',
  },
  {
    code: '38043',
    state: 'North Dakota',
    county: 'Kidder',
  },
  {
    code: '38045',
    state: 'North Dakota',
    county: 'LaMoure',
  },
  {
    code: '38047',
    state: 'North Dakota',
    county: 'Logan',
  },
  {
    code: '38049',
    state: 'North Dakota',
    county: 'McHenry',
  },
  {
    code: '38051',
    state: 'North Dakota',
    county: 'McIntosh',
  },
  {
    code: '38053',
    state: 'North Dakota',
    county: 'McKenzie',
  },
  {
    code: '38055',
    state: 'North Dakota',
    county: 'McLean',
  },
  {
    code: '38057',
    state: 'North Dakota',
    county: 'Mercer',
  },
  {
    code: '38059',
    state: 'North Dakota',
    county: 'Morton',
  },
  {
    code: '38061',
    state: 'North Dakota',
    county: 'Mountrail',
  },
  {
    code: '38063',
    state: 'North Dakota',
    county: 'Nelson',
  },
  {
    code: '38065',
    state: 'North Dakota',
    county: 'Oliver',
  },
  {
    code: '38067',
    state: 'North Dakota',
    county: 'Pembina',
  },
  {
    code: '38069',
    state: 'North Dakota',
    county: 'Pierce',
  },
  {
    code: '38071',
    state: 'North Dakota',
    county: 'Ramsey',
  },
  {
    code: '38073',
    state: 'North Dakota',
    county: 'Ransom',
  },
  {
    code: '38075',
    state: 'North Dakota',
    county: 'Renville',
  },
  {
    code: '38077',
    state: 'North Dakota',
    county: 'Richland',
  },
  {
    code: '38079',
    state: 'North Dakota',
    county: 'Rolette',
  },
  {
    code: '38081',
    state: 'North Dakota',
    county: 'Sargent',
  },
  {
    code: '38083',
    state: 'North Dakota',
    county: 'Sheridan',
  },
  {
    code: '38085',
    state: 'North Dakota',
    county: 'Sioux',
  },
  {
    code: '38087',
    state: 'North Dakota',
    county: 'Slope',
  },
  {
    code: '38089',
    state: 'North Dakota',
    county: 'Stark',
  },
  {
    code: '38091',
    state: 'North Dakota',
    county: 'Steele',
  },
  {
    code: '38093',
    state: 'North Dakota',
    county: 'Stutsman',
  },
  {
    code: '38095',
    state: 'North Dakota',
    county: 'Towner',
  },
  {
    code: '38097',
    state: 'North Dakota',
    county: 'Traill',
  },
  {
    code: '38099',
    state: 'North Dakota',
    county: 'Walsh',
  },
  {
    code: '38101',
    state: 'North Dakota',
    county: 'Ward',
  },
  {
    code: '38103',
    state: 'North Dakota',
    county: 'Wells',
  },
  {
    code: '38105',
    state: 'North Dakota',
    county: 'Williams',
  },
  {
    code: '39001',
    state: 'Ohio',
    county: 'Adams',
  },
  {
    code: '39003',
    state: 'Ohio',
    county: 'Allen',
  },
  {
    code: '39005',
    state: 'Ohio',
    county: 'Ashland',
  },
  {
    code: '39007',
    state: 'Ohio',
    county: 'Ashtabula',
  },
  {
    code: '39009',
    state: 'Ohio',
    county: 'Athens',
  },
  {
    code: '39011',
    state: 'Ohio',
    county: 'Auglaize',
  },
  {
    code: '39013',
    state: 'Ohio',
    county: 'Belmont',
  },
  {
    code: '39015',
    state: 'Ohio',
    county: 'Brown',
  },
  {
    code: '39017',
    state: 'Ohio',
    county: 'Butler',
  },
  {
    code: '39019',
    state: 'Ohio',
    county: 'Carroll',
  },
  {
    code: '39021',
    state: 'Ohio',
    county: 'Champaign',
  },
  {
    code: '39023',
    state: 'Ohio',
    county: 'Clark',
  },
  {
    code: '39025',
    state: 'Ohio',
    county: 'Clermont',
  },
  {
    code: '39027',
    state: 'Ohio',
    county: 'Clinton',
  },
  {
    code: '39029',
    state: 'Ohio',
    county: 'Columbiana',
  },
  {
    code: '39031',
    state: 'Ohio',
    county: 'Coshocton',
  },
  {
    code: '39033',
    state: 'Ohio',
    county: 'Crawford',
  },
  {
    code: '39035',
    state: 'Ohio',
    county: 'Cuyahoga',
  },
  {
    code: '39037',
    state: 'Ohio',
    county: 'Darke',
  },
  {
    code: '39039',
    state: 'Ohio',
    county: 'Defiance',
  },
  {
    code: '39041',
    state: 'Ohio',
    county: 'Delaware',
  },
  {
    code: '39043',
    state: 'Ohio',
    county: 'Erie',
  },
  {
    code: '39045',
    state: 'Ohio',
    county: 'Fairfield',
  },
  {
    code: '39047',
    state: 'Ohio',
    county: 'Fayette',
  },
  {
    code: '39049',
    state: 'Ohio',
    county: 'Franklin',
  },
  {
    code: '39051',
    state: 'Ohio',
    county: 'Fulton',
  },
  {
    code: '39053',
    state: 'Ohio',
    county: 'Gallia',
  },
  {
    code: '39055',
    state: 'Ohio',
    county: 'Geauga',
  },
  {
    code: '39057',
    state: 'Ohio',
    county: 'Greene',
  },
  {
    code: '39059',
    state: 'Ohio',
    county: 'Guernsey',
  },
  {
    code: '39061',
    state: 'Ohio',
    county: 'Hamilton',
  },
  {
    code: '39063',
    state: 'Ohio',
    county: 'Hancock',
  },
  {
    code: '39065',
    state: 'Ohio',
    county: 'Hardin',
  },
  {
    code: '39067',
    state: 'Ohio',
    county: 'Harrison',
  },
  {
    code: '39069',
    state: 'Ohio',
    county: 'Henry',
  },
  {
    code: '39071',
    state: 'Ohio',
    county: 'Highland',
  },
  {
    code: '39073',
    state: 'Ohio',
    county: 'Hocking',
  },
  {
    code: '39075',
    state: 'Ohio',
    county: 'Holmes',
  },
  {
    code: '39077',
    state: 'Ohio',
    county: 'Huron',
  },
  {
    code: '39079',
    state: 'Ohio',
    county: 'Jackson',
  },
  {
    code: '39081',
    state: 'Ohio',
    county: 'Jefferson',
  },
  {
    code: '39083',
    state: 'Ohio',
    county: 'Knox',
  },
  {
    code: '39085',
    state: 'Ohio',
    county: 'Lake',
  },
  {
    code: '39087',
    state: 'Ohio',
    county: 'Lawrence',
  },
  {
    code: '39089',
    state: 'Ohio',
    county: 'Licking',
  },
  {
    code: '39091',
    state: 'Ohio',
    county: 'Logan',
  },
  {
    code: '39093',
    state: 'Ohio',
    county: 'Lorain',
  },
  {
    code: '39095',
    state: 'Ohio',
    county: 'Lucas',
  },
  {
    code: '39097',
    state: 'Ohio',
    county: 'Madison',
  },
  {
    code: '39099',
    state: 'Ohio',
    county: 'Mahoning',
  },
  {
    code: '39101',
    state: 'Ohio',
    county: 'Marion',
  },
  {
    code: '39103',
    state: 'Ohio',
    county: 'Medina',
  },
  {
    code: '39105',
    state: 'Ohio',
    county: 'Meigs',
  },
  {
    code: '39107',
    state: 'Ohio',
    county: 'Mercer',
  },
  {
    code: '39109',
    state: 'Ohio',
    county: 'Miami',
  },
  {
    code: '39111',
    state: 'Ohio',
    county: 'Monroe',
  },
  {
    code: '39113',
    state: 'Ohio',
    county: 'Montgomery',
  },
  {
    code: '39115',
    state: 'Ohio',
    county: 'Morgan',
  },
  {
    code: '39117',
    state: 'Ohio',
    county: 'Morrow',
  },
  {
    code: '39119',
    state: 'Ohio',
    county: 'Muskingum',
  },
  {
    code: '39121',
    state: 'Ohio',
    county: 'Noble',
  },
  {
    code: '39123',
    state: 'Ohio',
    county: 'Ottawa',
  },
  {
    code: '39125',
    state: 'Ohio',
    county: 'Paulding',
  },
  {
    code: '39127',
    state: 'Ohio',
    county: 'Perry',
  },
  {
    code: '39129',
    state: 'Ohio',
    county: 'Pickaway',
  },
  {
    code: '39131',
    state: 'Ohio',
    county: 'Pike',
  },
  {
    code: '39133',
    state: 'Ohio',
    county: 'Portage',
  },
  {
    code: '39135',
    state: 'Ohio',
    county: 'Preble',
  },
  {
    code: '39137',
    state: 'Ohio',
    county: 'Putnam',
  },
  {
    code: '39139',
    state: 'Ohio',
    county: 'Richland',
  },
  {
    code: '39141',
    state: 'Ohio',
    county: 'Ross',
  },
  {
    code: '39143',
    state: 'Ohio',
    county: 'Sandusky',
  },
  {
    code: '39145',
    state: 'Ohio',
    county: 'Scioto',
  },
  {
    code: '39147',
    state: 'Ohio',
    county: 'Seneca',
  },
  {
    code: '39149',
    state: 'Ohio',
    county: 'Shelby',
  },
  {
    code: '39151',
    state: 'Ohio',
    county: 'Stark',
  },
  {
    code: '39153',
    state: 'Ohio',
    county: 'Summit',
  },
  {
    code: '39155',
    state: 'Ohio',
    county: 'Trumbull',
  },
  {
    code: '39157',
    state: 'Ohio',
    county: 'Tuscarawas',
  },
  {
    code: '39159',
    state: 'Ohio',
    county: 'Union',
  },
  {
    code: '39161',
    state: 'Ohio',
    county: 'Van Wert',
  },
  {
    code: '39163',
    state: 'Ohio',
    county: 'Vinton',
  },
  {
    code: '39165',
    state: 'Ohio',
    county: 'Warren',
  },
  {
    code: '39167',
    state: 'Ohio',
    county: 'Washington',
  },
  {
    code: '39169',
    state: 'Ohio',
    county: 'Wayne',
  },
  {
    code: '39171',
    state: 'Ohio',
    county: 'Williams',
  },
  {
    code: '39173',
    state: 'Ohio',
    county: 'Wood',
  },
  {
    code: '39175',
    state: 'Ohio',
    county: 'Wyandot',
  },
  {
    code: '40001',
    state: 'Oklahoma',
    county: 'Adair',
  },
  {
    code: '40003',
    state: 'Oklahoma',
    county: 'Alfalfa',
  },
  {
    code: '40005',
    state: 'Oklahoma',
    county: 'Atoka',
  },
  {
    code: '40007',
    state: 'Oklahoma',
    county: 'Beaver',
  },
  {
    code: '40009',
    state: 'Oklahoma',
    county: 'Beckham',
  },
  {
    code: '40011',
    state: 'Oklahoma',
    county: 'Blaine',
  },
  {
    code: '40013',
    state: 'Oklahoma',
    county: 'Bryan',
  },
  {
    code: '40015',
    state: 'Oklahoma',
    county: 'Caddo',
  },
  {
    code: '40017',
    state: 'Oklahoma',
    county: 'Canadian',
  },
  {
    code: '40019',
    state: 'Oklahoma',
    county: 'Carter',
  },
  {
    code: '40021',
    state: 'Oklahoma',
    county: 'Cherokee',
  },
  {
    code: '40023',
    state: 'Oklahoma',
    county: 'Choctaw',
  },
  {
    code: '40025',
    state: 'Oklahoma',
    county: 'Cimarron',
  },
  {
    code: '40027',
    state: 'Oklahoma',
    county: 'Cleveland',
  },
  {
    code: '40029',
    state: 'Oklahoma',
    county: 'Coal',
  },
  {
    code: '40031',
    state: 'Oklahoma',
    county: 'Comanche',
  },
  {
    code: '40033',
    state: 'Oklahoma',
    county: 'Cotton',
  },
  {
    code: '40035',
    state: 'Oklahoma',
    county: 'Craig',
  },
  {
    code: '40037',
    state: 'Oklahoma',
    county: 'Creek',
  },
  {
    code: '40039',
    state: 'Oklahoma',
    county: 'Custer',
  },
  {
    code: '40041',
    state: 'Oklahoma',
    county: 'Delaware',
  },
  {
    code: '40043',
    state: 'Oklahoma',
    county: 'Dewey',
  },
  {
    code: '40045',
    state: 'Oklahoma',
    county: 'Ellis',
  },
  {
    code: '40047',
    state: 'Oklahoma',
    county: 'Garfield',
  },
  {
    code: '40049',
    state: 'Oklahoma',
    county: 'Garvin',
  },
  {
    code: '40051',
    state: 'Oklahoma',
    county: 'Grady',
  },
  {
    code: '40053',
    state: 'Oklahoma',
    county: 'Grant',
  },
  {
    code: '40055',
    state: 'Oklahoma',
    county: 'Greer',
  },
  {
    code: '40057',
    state: 'Oklahoma',
    county: 'Harmon',
  },
  {
    code: '40059',
    state: 'Oklahoma',
    county: 'Harper',
  },
  {
    code: '40061',
    state: 'Oklahoma',
    county: 'Haskell',
  },
  {
    code: '40063',
    state: 'Oklahoma',
    county: 'Hughes',
  },
  {
    code: '40065',
    state: 'Oklahoma',
    county: 'Jackson',
  },
  {
    code: '40067',
    state: 'Oklahoma',
    county: 'Jefferson',
  },
  {
    code: '40069',
    state: 'Oklahoma',
    county: 'Johnston',
  },
  {
    code: '40071',
    state: 'Oklahoma',
    county: 'Kay',
  },
  {
    code: '40073',
    state: 'Oklahoma',
    county: 'Kingfisher',
  },
  {
    code: '40075',
    state: 'Oklahoma',
    county: 'Kiowa',
  },
  {
    code: '40077',
    state: 'Oklahoma',
    county: 'Latimer',
  },
  {
    code: '40079',
    state: 'Oklahoma',
    county: 'Le Flore',
  },
  {
    code: '40081',
    state: 'Oklahoma',
    county: 'Lincoln',
  },
  {
    code: '40083',
    state: 'Oklahoma',
    county: 'Logan',
  },
  {
    code: '40085',
    state: 'Oklahoma',
    county: 'Love',
  },
  {
    code: '40087',
    state: 'Oklahoma',
    county: 'McClain',
  },
  {
    code: '40089',
    state: 'Oklahoma',
    county: 'McCurtain',
  },
  {
    code: '40091',
    state: 'Oklahoma',
    county: 'McIntosh',
  },
  {
    code: '40093',
    state: 'Oklahoma',
    county: 'Major',
  },
  {
    code: '40095',
    state: 'Oklahoma',
    county: 'Marshall',
  },
  {
    code: '40097',
    state: 'Oklahoma',
    county: 'Mayes',
  },
  {
    code: '40099',
    state: 'Oklahoma',
    county: 'Murray',
  },
  {
    code: '40101',
    state: 'Oklahoma',
    county: 'Muskogee',
  },
  {
    code: '40103',
    state: 'Oklahoma',
    county: 'Noble',
  },
  {
    code: '40105',
    state: 'Oklahoma',
    county: 'Nowata',
  },
  {
    code: '40107',
    state: 'Oklahoma',
    county: 'Okfuskee',
  },
  {
    code: '40109',
    state: 'Oklahoma',
    county: 'Oklahoma',
  },
  {
    code: '40111',
    state: 'Oklahoma',
    county: 'Okmulgee',
  },
  {
    code: '40113',
    state: 'Oklahoma',
    county: 'Osage',
  },
  {
    code: '40115',
    state: 'Oklahoma',
    county: 'Ottawa',
  },
  {
    code: '40117',
    state: 'Oklahoma',
    county: 'Pawnee',
  },
  {
    code: '40119',
    state: 'Oklahoma',
    county: 'Payne',
  },
  {
    code: '40121',
    state: 'Oklahoma',
    county: 'Pittsburg',
  },
  {
    code: '40123',
    state: 'Oklahoma',
    county: 'Pontotoc',
  },
  {
    code: '40125',
    state: 'Oklahoma',
    county: 'Pottawatomie',
  },
  {
    code: '40127',
    state: 'Oklahoma',
    county: 'Pushmataha',
  },
  {
    code: '40129',
    state: 'Oklahoma',
    county: 'Roger Mills',
  },
  {
    code: '40131',
    state: 'Oklahoma',
    county: 'Rogers',
  },
  {
    code: '40133',
    state: 'Oklahoma',
    county: 'Seminole',
  },
  {
    code: '40135',
    state: 'Oklahoma',
    county: 'Sequoyah',
  },
  {
    code: '40137',
    state: 'Oklahoma',
    county: 'Stephens',
  },
  {
    code: '40139',
    state: 'Oklahoma',
    county: 'Texas',
  },
  {
    code: '40141',
    state: 'Oklahoma',
    county: 'Tillman',
  },
  {
    code: '40143',
    state: 'Oklahoma',
    county: 'Tulsa',
  },
  {
    code: '40145',
    state: 'Oklahoma',
    county: 'Wagoner',
  },
  {
    code: '40147',
    state: 'Oklahoma',
    county: 'Washington',
  },
  {
    code: '40149',
    state: 'Oklahoma',
    county: 'Washita',
  },
  {
    code: '40151',
    state: 'Oklahoma',
    county: 'Woods',
  },
  {
    code: '40153',
    state: 'Oklahoma',
    county: 'Woodward',
  },
  {
    code: '41001',
    state: 'Oregon',
    county: 'Baker',
  },
  {
    code: '41003',
    state: 'Oregon',
    county: 'Benton',
  },
  {
    code: '41005',
    state: 'Oregon',
    county: 'Clackamas',
  },
  {
    code: '41007',
    state: 'Oregon',
    county: 'Clatsop',
  },
  {
    code: '41009',
    state: 'Oregon',
    county: 'Columbia',
  },
  {
    code: '41011',
    state: 'Oregon',
    county: 'Coos',
  },
  {
    code: '41013',
    state: 'Oregon',
    county: 'Crook',
  },
  {
    code: '41015',
    state: 'Oregon',
    county: 'Curry',
  },
  {
    code: '41017',
    state: 'Oregon',
    county: 'Deschutes',
  },
  {
    code: '41019',
    state: 'Oregon',
    county: 'Douglas',
  },
  {
    code: '41021',
    state: 'Oregon',
    county: 'Gilliam',
  },
  {
    code: '41023',
    state: 'Oregon',
    county: 'Grant',
  },
  {
    code: '41025',
    state: 'Oregon',
    county: 'Harney',
  },
  {
    code: '41027',
    state: 'Oregon',
    county: 'Hood River',
  },
  {
    code: '41029',
    state: 'Oregon',
    county: 'Jackson',
  },
  {
    code: '41031',
    state: 'Oregon',
    county: 'Jefferson',
  },
  {
    code: '41033',
    state: 'Oregon',
    county: 'Josephine',
  },
  {
    code: '41035',
    state: 'Oregon',
    county: 'Klamath',
  },
  {
    code: '41037',
    state: 'Oregon',
    county: 'Lake',
  },
  {
    code: '41039',
    state: 'Oregon',
    county: 'Lane',
  },
  {
    code: '41041',
    state: 'Oregon',
    county: 'Lincoln',
  },
  {
    code: '41043',
    state: 'Oregon',
    county: 'Linn',
  },
  {
    code: '41045',
    state: 'Oregon',
    county: 'Malheur',
  },
  {
    code: '41047',
    state: 'Oregon',
    county: 'Marion',
  },
  {
    code: '41049',
    state: 'Oregon',
    county: 'Morrow',
  },
  {
    code: '41051',
    state: 'Oregon',
    county: 'Multnomah',
  },
  {
    code: '41053',
    state: 'Oregon',
    county: 'Polk',
  },
  {
    code: '41055',
    state: 'Oregon',
    county: 'Sherman',
  },
  {
    code: '41057',
    state: 'Oregon',
    county: 'Tillamook',
  },
  {
    code: '41059',
    state: 'Oregon',
    county: 'Umatilla',
  },
  {
    code: '41061',
    state: 'Oregon',
    county: 'Union',
  },
  {
    code: '41063',
    state: 'Oregon',
    county: 'Wallowa',
  },
  {
    code: '41065',
    state: 'Oregon',
    county: 'Wasco',
  },
  {
    code: '41067',
    state: 'Oregon',
    county: 'Washington',
  },
  {
    code: '41069',
    state: 'Oregon',
    county: 'Wheeler',
  },
  {
    code: '41071',
    state: 'Oregon',
    county: 'Yamhill',
  },
  {
    code: '42001',
    state: 'Pennsylvania',
    county: 'Adams',
  },
  {
    code: '42003',
    state: 'Pennsylvania',
    county: 'Allegheny',
  },
  {
    code: '42005',
    state: 'Pennsylvania',
    county: 'Armstrong',
  },
  {
    code: '42007',
    state: 'Pennsylvania',
    county: 'Beaver',
  },
  {
    code: '42009',
    state: 'Pennsylvania',
    county: 'Bedford',
  },
  {
    code: '42011',
    state: 'Pennsylvania',
    county: 'Berks',
  },
  {
    code: '42013',
    state: 'Pennsylvania',
    county: 'Blair',
  },
  {
    code: '42015',
    state: 'Pennsylvania',
    county: 'Bradford',
  },
  {
    code: '42017',
    state: 'Pennsylvania',
    county: 'Bucks',
  },
  {
    code: '42019',
    state: 'Pennsylvania',
    county: 'Butler',
  },
  {
    code: '42021',
    state: 'Pennsylvania',
    county: 'Cambria',
  },
  {
    code: '42023',
    state: 'Pennsylvania',
    county: 'Cameron',
  },
  {
    code: '42025',
    state: 'Pennsylvania',
    county: 'Carbon',
  },
  {
    code: '42027',
    state: 'Pennsylvania',
    county: 'Centre',
  },
  {
    code: '42029',
    state: 'Pennsylvania',
    county: 'Chester',
  },
  {
    code: '42031',
    state: 'Pennsylvania',
    county: 'Clarion',
  },
  {
    code: '42033',
    state: 'Pennsylvania',
    county: 'Clearfield',
  },
  {
    code: '42035',
    state: 'Pennsylvania',
    county: 'Clinton',
  },
  {
    code: '42037',
    state: 'Pennsylvania',
    county: 'Columbia',
  },
  {
    code: '42039',
    state: 'Pennsylvania',
    county: 'Crawford',
  },
  {
    code: '42041',
    state: 'Pennsylvania',
    county: 'Cumberland',
  },
  {
    code: '42043',
    state: 'Pennsylvania',
    county: 'Dauphin',
  },
  {
    code: '42045',
    state: 'Pennsylvania',
    county: 'Delaware',
  },
  {
    code: '42047',
    state: 'Pennsylvania',
    county: 'Elk',
  },
  {
    code: '42049',
    state: 'Pennsylvania',
    county: 'Erie',
  },
  {
    code: '42051',
    state: 'Pennsylvania',
    county: 'Fayette',
  },
  {
    code: '42053',
    state: 'Pennsylvania',
    county: 'Forest',
  },
  {
    code: '42055',
    state: 'Pennsylvania',
    county: 'Franklin',
  },
  {
    code: '42057',
    state: 'Pennsylvania',
    county: 'Fulton',
  },
  {
    code: '42059',
    state: 'Pennsylvania',
    county: 'Greene',
  },
  {
    code: '42061',
    state: 'Pennsylvania',
    county: 'Huntingdon',
  },
  {
    code: '42063',
    state: 'Pennsylvania',
    county: 'Indiana',
  },
  {
    code: '42065',
    state: 'Pennsylvania',
    county: 'Jefferson',
  },
  {
    code: '42067',
    state: 'Pennsylvania',
    county: 'Juniata',
  },
  {
    code: '42069',
    state: 'Pennsylvania',
    county: 'Lackawanna',
  },
  {
    code: '42071',
    state: 'Pennsylvania',
    county: 'Lancaster',
  },
  {
    code: '42073',
    state: 'Pennsylvania',
    county: 'Lawrence',
  },
  {
    code: '42075',
    state: 'Pennsylvania',
    county: 'Lebanon',
  },
  {
    code: '42077',
    state: 'Pennsylvania',
    county: 'Lehigh',
  },
  {
    code: '42079',
    state: 'Pennsylvania',
    county: 'Luzerne',
  },
  {
    code: '42081',
    state: 'Pennsylvania',
    county: 'Lycoming',
  },
  {
    code: '42083',
    state: 'Pennsylvania',
    county: 'McKean',
  },
  {
    code: '42085',
    state: 'Pennsylvania',
    county: 'Mercer',
  },
  {
    code: '42087',
    state: 'Pennsylvania',
    county: 'Mifflin',
  },
  {
    code: '42089',
    state: 'Pennsylvania',
    county: 'Monroe',
  },
  {
    code: '42091',
    state: 'Pennsylvania',
    county: 'Montgomery',
  },
  {
    code: '42093',
    state: 'Pennsylvania',
    county: 'Montour',
  },
  {
    code: '42095',
    state: 'Pennsylvania',
    county: 'Northampton',
  },
  {
    code: '42097',
    state: 'Pennsylvania',
    county: 'Northumberland',
  },
  {
    code: '42099',
    state: 'Pennsylvania',
    county: 'Perry',
  },
  {
    code: '42101',
    state: 'Pennsylvania',
    county: 'Philadelphia',
  },
  {
    code: '42103',
    state: 'Pennsylvania',
    county: 'Pike',
  },
  {
    code: '42105',
    state: 'Pennsylvania',
    county: 'Potter',
  },
  {
    code: '42107',
    state: 'Pennsylvania',
    county: 'Schuylkill',
  },
  {
    code: '42109',
    state: 'Pennsylvania',
    county: 'Snyder',
  },
  {
    code: '42111',
    state: 'Pennsylvania',
    county: 'Somerset',
  },
  {
    code: '42113',
    state: 'Pennsylvania',
    county: 'Sullivan',
  },
  {
    code: '42115',
    state: 'Pennsylvania',
    county: 'Susquehanna',
  },
  {
    code: '42117',
    state: 'Pennsylvania',
    county: 'Tioga',
  },
  {
    code: '42119',
    state: 'Pennsylvania',
    county: 'Union',
  },
  {
    code: '42121',
    state: 'Pennsylvania',
    county: 'Venango',
  },
  {
    code: '42123',
    state: 'Pennsylvania',
    county: 'Warren',
  },
  {
    code: '42125',
    state: 'Pennsylvania',
    county: 'Washington',
  },
  {
    code: '42127',
    state: 'Pennsylvania',
    county: 'Wayne',
  },
  {
    code: '42129',
    state: 'Pennsylvania',
    county: 'Westmoreland',
  },
  {
    code: '42131',
    state: 'Pennsylvania',
    county: 'Wyoming',
  },
  {
    code: '42133',
    state: 'Pennsylvania',
    county: 'York',
  },
  {
    code: '44001',
    state: 'Rhode Island',
    county: 'Bristol',
  },
  {
    code: '44003',
    state: 'Rhode Island',
    county: 'Kent',
  },
  {
    code: '44005',
    state: 'Rhode Island',
    county: 'Newport',
  },
  {
    code: '44007',
    state: 'Rhode Island',
    county: 'Providence',
  },
  {
    code: '44009',
    state: 'Rhode Island',
    county: 'Washington',
  },
  {
    code: '45001',
    state: 'South Carolina',
    county: 'Abbeville',
  },
  {
    code: '45003',
    state: 'South Carolina',
    county: 'Aiken',
  },
  {
    code: '45005',
    state: 'South Carolina',
    county: 'Allendale',
  },
  {
    code: '45007',
    state: 'South Carolina',
    county: 'Anderson',
  },
  {
    code: '45009',
    state: 'South Carolina',
    county: 'Bamberg',
  },
  {
    code: '45011',
    state: 'South Carolina',
    county: 'Barnwell',
  },
  {
    code: '45013',
    state: 'South Carolina',
    county: 'Beaufort',
  },
  {
    code: '45015',
    state: 'South Carolina',
    county: 'Berkeley',
  },
  {
    code: '45017',
    state: 'South Carolina',
    county: 'Calhoun',
  },
  {
    code: '45019',
    state: 'South Carolina',
    county: 'Charleston',
  },
  {
    code: '45021',
    state: 'South Carolina',
    county: 'Cherokee',
  },
  {
    code: '45023',
    state: 'South Carolina',
    county: 'Chester',
  },
  {
    code: '45025',
    state: 'South Carolina',
    county: 'Chesterfield',
  },
  {
    code: '45027',
    state: 'South Carolina',
    county: 'Clarendon',
  },
  {
    code: '45029',
    state: 'South Carolina',
    county: 'Colleton',
  },
  {
    code: '45031',
    state: 'South Carolina',
    county: 'Darlington',
  },
  {
    code: '45033',
    state: 'South Carolina',
    county: 'Dillon',
  },
  {
    code: '45035',
    state: 'South Carolina',
    county: 'Dorchester',
  },
  {
    code: '45037',
    state: 'South Carolina',
    county: 'Edgefield',
  },
  {
    code: '45039',
    state: 'South Carolina',
    county: 'Fairfield',
  },
  {
    code: '45041',
    state: 'South Carolina',
    county: 'Florence',
  },
  {
    code: '45043',
    state: 'South Carolina',
    county: 'Georgetown',
  },
  {
    code: '45045',
    state: 'South Carolina',
    county: 'Greenville',
  },
  {
    code: '45047',
    state: 'South Carolina',
    county: 'Greenwood',
  },
  {
    code: '45049',
    state: 'South Carolina',
    county: 'Hampton',
  },
  {
    code: '45051',
    state: 'South Carolina',
    county: 'Horry',
  },
  {
    code: '45053',
    state: 'South Carolina',
    county: 'Jasper',
  },
  {
    code: '45055',
    state: 'South Carolina',
    county: 'Kershaw',
  },
  {
    code: '45057',
    state: 'South Carolina',
    county: 'Lancaster',
  },
  {
    code: '45059',
    state: 'South Carolina',
    county: 'Laurens',
  },
  {
    code: '45061',
    state: 'South Carolina',
    county: 'Lee',
  },
  {
    code: '45063',
    state: 'South Carolina',
    county: 'Lexington',
  },
  {
    code: '45065',
    state: 'South Carolina',
    county: 'McCormick',
  },
  {
    code: '45067',
    state: 'South Carolina',
    county: 'Marion',
  },
  {
    code: '45069',
    state: 'South Carolina',
    county: 'Marlboro',
  },
  {
    code: '45071',
    state: 'South Carolina',
    county: 'Newberry',
  },
  {
    code: '45073',
    state: 'South Carolina',
    county: 'Oconee',
  },
  {
    code: '45075',
    state: 'South Carolina',
    county: 'Orangeburg',
  },
  {
    code: '45077',
    state: 'South Carolina',
    county: 'Pickens',
  },
  {
    code: '45079',
    state: 'South Carolina',
    county: 'Richland',
  },
  {
    code: '45081',
    state: 'South Carolina',
    county: 'Saluda',
  },
  {
    code: '45083',
    state: 'South Carolina',
    county: 'Spartanburg',
  },
  {
    code: '45085',
    state: 'South Carolina',
    county: 'Sumter',
  },
  {
    code: '45087',
    state: 'South Carolina',
    county: 'Union',
  },
  {
    code: '45089',
    state: 'South Carolina',
    county: 'Williamsburg',
  },
  {
    code: '45091',
    state: 'South Carolina',
    county: 'York',
  },
  {
    code: '46003',
    state: 'South Dakota',
    county: 'Aurora',
  },
  {
    code: '46005',
    state: 'South Dakota',
    county: 'Beadle',
  },
  {
    code: '46007',
    state: 'South Dakota',
    county: 'Bennett',
  },
  {
    code: '46009',
    state: 'South Dakota',
    county: 'Bon Homme',
  },
  {
    code: '46011',
    state: 'South Dakota',
    county: 'Brookings',
  },
  {
    code: '46013',
    state: 'South Dakota',
    county: 'Brown',
  },
  {
    code: '46015',
    state: 'South Dakota',
    county: 'Brule',
  },
  {
    code: '46017',
    state: 'South Dakota',
    county: 'Buffalo',
  },
  {
    code: '46019',
    state: 'South Dakota',
    county: 'Butte',
  },
  {
    code: '46021',
    state: 'South Dakota',
    county: 'Campbell',
  },
  {
    code: '46023',
    state: 'South Dakota',
    county: 'Charles Mix',
  },
  {
    code: '46025',
    state: 'South Dakota',
    county: 'Clark',
  },
  {
    code: '46027',
    state: 'South Dakota',
    county: 'Clay',
  },
  {
    code: '46029',
    state: 'South Dakota',
    county: 'Codington',
  },
  {
    code: '46031',
    state: 'South Dakota',
    county: 'Corson',
  },
  {
    code: '46033',
    state: 'South Dakota',
    county: 'Custer',
  },
  {
    code: '46035',
    state: 'South Dakota',
    county: 'Davison',
  },
  {
    code: '46037',
    state: 'South Dakota',
    county: 'Day',
  },
  {
    code: '46039',
    state: 'South Dakota',
    county: 'Deuel',
  },
  {
    code: '46041',
    state: 'South Dakota',
    county: 'Dewey',
  },
  {
    code: '46043',
    state: 'South Dakota',
    county: 'Douglas',
  },
  {
    code: '46045',
    state: 'South Dakota',
    county: 'Edmunds',
  },
  {
    code: '46047',
    state: 'South Dakota',
    county: 'Fall River',
  },
  {
    code: '46049',
    state: 'South Dakota',
    county: 'Faulk',
  },
  {
    code: '46051',
    state: 'South Dakota',
    county: 'Grant',
  },
  {
    code: '46053',
    state: 'South Dakota',
    county: 'Gregory',
  },
  {
    code: '46055',
    state: 'South Dakota',
    county: 'Haakon',
  },
  {
    code: '46057',
    state: 'South Dakota',
    county: 'Hamlin',
  },
  {
    code: '46059',
    state: 'South Dakota',
    county: 'Hand',
  },
  {
    code: '46061',
    state: 'South Dakota',
    county: 'Hanson',
  },
  {
    code: '46063',
    state: 'South Dakota',
    county: 'Harding',
  },
  {
    code: '46065',
    state: 'South Dakota',
    county: 'Hughes',
  },
  {
    code: '46067',
    state: 'South Dakota',
    county: 'Hutchinson',
  },
  {
    code: '46069',
    state: 'South Dakota',
    county: 'Hyde',
  },
  {
    code: '46071',
    state: 'South Dakota',
    county: 'Jackson',
  },
  {
    code: '46073',
    state: 'South Dakota',
    county: 'Jerauld',
  },
  {
    code: '46075',
    state: 'South Dakota',
    county: 'Jones',
  },
  {
    code: '46077',
    state: 'South Dakota',
    county: 'Kingsbury',
  },
  {
    code: '46079',
    state: 'South Dakota',
    county: 'Lake',
  },
  {
    code: '46081',
    state: 'South Dakota',
    county: 'Lawrence',
  },
  {
    code: '46083',
    state: 'South Dakota',
    county: 'Lincoln',
  },
  {
    code: '46085',
    state: 'South Dakota',
    county: 'Lyman',
  },
  {
    code: '46087',
    state: 'South Dakota',
    county: 'McCook',
  },
  {
    code: '46089',
    state: 'South Dakota',
    county: 'McPherson',
  },
  {
    code: '46091',
    state: 'South Dakota',
    county: 'Marshall',
  },
  {
    code: '46093',
    state: 'South Dakota',
    county: 'Meade',
  },
  {
    code: '46095',
    state: 'South Dakota',
    county: 'Mellette',
  },
  {
    code: '46097',
    state: 'South Dakota',
    county: 'Miner',
  },
  {
    code: '46099',
    state: 'South Dakota',
    county: 'Minnehaha',
  },
  {
    code: '46101',
    state: 'South Dakota',
    county: 'Moody',
  },
  {
    code: '46103',
    state: 'South Dakota',
    county: 'Pennington',
  },
  {
    code: '46105',
    state: 'South Dakota',
    county: 'Perkins',
  },
  {
    code: '46107',
    state: 'South Dakota',
    county: 'Potter',
  },
  {
    code: '46109',
    state: 'South Dakota',
    county: 'Roberts',
  },
  {
    code: '46111',
    state: 'South Dakota',
    county: 'Sanborn',
  },
  {
    code: '46113',
    state: 'South Dakota',
    county: 'Shannon',
  },
  {
    code: '46115',
    state: 'South Dakota',
    county: 'Spink',
  },
  {
    code: '46117',
    state: 'South Dakota',
    county: 'Stanley',
  },
  {
    code: '46119',
    state: 'South Dakota',
    county: 'Sully',
  },
  {
    code: '46121',
    state: 'South Dakota',
    county: 'Todd',
  },
  {
    code: '46123',
    state: 'South Dakota',
    county: 'Tripp',
  },
  {
    code: '46125',
    state: 'South Dakota',
    county: 'Turner',
  },
  {
    code: '46127',
    state: 'South Dakota',
    county: 'Union',
  },
  {
    code: '46129',
    state: 'South Dakota',
    county: 'Walworth',
  },
  {
    code: '46135',
    state: 'South Dakota',
    county: 'Yankton',
  },
  {
    code: '46137',
    state: 'South Dakota',
    county: 'Ziebach',
  },
  {
    code: '47001',
    state: 'Tennessee',
    county: 'Anderson',
  },
  {
    code: '47003',
    state: 'Tennessee',
    county: 'Bedford',
  },
  {
    code: '47005',
    state: 'Tennessee',
    county: 'Benton',
  },
  {
    code: '47007',
    state: 'Tennessee',
    county: 'Bledsoe',
  },
  {
    code: '47009',
    state: 'Tennessee',
    county: 'Blount',
  },
  {
    code: '47011',
    state: 'Tennessee',
    county: 'Bradley',
  },
  {
    code: '47013',
    state: 'Tennessee',
    county: 'Campbell',
  },
  {
    code: '47015',
    state: 'Tennessee',
    county: 'Cannon',
  },
  {
    code: '47017',
    state: 'Tennessee',
    county: 'Carroll',
  },
  {
    code: '47019',
    state: 'Tennessee',
    county: 'Carter',
  },
  {
    code: '47021',
    state: 'Tennessee',
    county: 'Cheatham',
  },
  {
    code: '47023',
    state: 'Tennessee',
    county: 'Chester',
  },
  {
    code: '47025',
    state: 'Tennessee',
    county: 'Claiborne',
  },
  {
    code: '47027',
    state: 'Tennessee',
    county: 'Clay',
  },
  {
    code: '47029',
    state: 'Tennessee',
    county: 'Cocke',
  },
  {
    code: '47031',
    state: 'Tennessee',
    county: 'Coffee',
  },
  {
    code: '47033',
    state: 'Tennessee',
    county: 'Crockett',
  },
  {
    code: '47035',
    state: 'Tennessee',
    county: 'Cumberland',
  },
  {
    code: '47037',
    state: 'Tennessee',
    county: 'Davidson',
  },
  {
    code: '47039',
    state: 'Tennessee',
    county: 'Decatur',
  },
  {
    code: '47041',
    state: 'Tennessee',
    county: 'DeKalb',
  },
  {
    code: '47043',
    state: 'Tennessee',
    county: 'Dickson',
  },
  {
    code: '47045',
    state: 'Tennessee',
    county: 'Dyer',
  },
  {
    code: '47047',
    state: 'Tennessee',
    county: 'Fayette',
  },
  {
    code: '47049',
    state: 'Tennessee',
    county: 'Fentress',
  },
  {
    code: '47051',
    state: 'Tennessee',
    county: 'Franklin',
  },
  {
    code: '47053',
    state: 'Tennessee',
    county: 'Gibson',
  },
  {
    code: '47055',
    state: 'Tennessee',
    county: 'Giles',
  },
  {
    code: '47057',
    state: 'Tennessee',
    county: 'Grainger',
  },
  {
    code: '47059',
    state: 'Tennessee',
    county: 'Greene',
  },
  {
    code: '47061',
    state: 'Tennessee',
    county: 'Grundy',
  },
  {
    code: '47063',
    state: 'Tennessee',
    county: 'Hamblen',
  },
  {
    code: '47065',
    state: 'Tennessee',
    county: 'Hamilton',
  },
  {
    code: '47067',
    state: 'Tennessee',
    county: 'Hancock',
  },
  {
    code: '47069',
    state: 'Tennessee',
    county: 'Hardeman',
  },
  {
    code: '47071',
    state: 'Tennessee',
    county: 'Hardin',
  },
  {
    code: '47073',
    state: 'Tennessee',
    county: 'Hawkins',
  },
  {
    code: '47075',
    state: 'Tennessee',
    county: 'Haywood',
  },
  {
    code: '47077',
    state: 'Tennessee',
    county: 'Henderson',
  },
  {
    code: '47079',
    state: 'Tennessee',
    county: 'Henry',
  },
  {
    code: '47081',
    state: 'Tennessee',
    county: 'Hickman',
  },
  {
    code: '47083',
    state: 'Tennessee',
    county: 'Houston',
  },
  {
    code: '47085',
    state: 'Tennessee',
    county: 'Humphreys',
  },
  {
    code: '47087',
    state: 'Tennessee',
    county: 'Jackson',
  },
  {
    code: '47089',
    state: 'Tennessee',
    county: 'Jefferson',
  },
  {
    code: '47091',
    state: 'Tennessee',
    county: 'Johnson',
  },
  {
    code: '47093',
    state: 'Tennessee',
    county: 'Knox',
  },
  {
    code: '47095',
    state: 'Tennessee',
    county: 'Lake',
  },
  {
    code: '47097',
    state: 'Tennessee',
    county: 'Lauderdale',
  },
  {
    code: '47099',
    state: 'Tennessee',
    county: 'Lawrence',
  },
  {
    code: '47101',
    state: 'Tennessee',
    county: 'Lewis',
  },
  {
    code: '47103',
    state: 'Tennessee',
    county: 'Lincoln',
  },
  {
    code: '47105',
    state: 'Tennessee',
    county: 'Loudon',
  },
  {
    code: '47107',
    state: 'Tennessee',
    county: 'McMinn',
  },
  {
    code: '47109',
    state: 'Tennessee',
    county: 'McNairy',
  },
  {
    code: '47111',
    state: 'Tennessee',
    county: 'Macon',
  },
  {
    code: '47113',
    state: 'Tennessee',
    county: 'Madison',
  },
  {
    code: '47115',
    state: 'Tennessee',
    county: 'Marion',
  },
  {
    code: '47117',
    state: 'Tennessee',
    county: 'Marshall',
  },
  {
    code: '47119',
    state: 'Tennessee',
    county: 'Maury',
  },
  {
    code: '47121',
    state: 'Tennessee',
    county: 'Meigs',
  },
  {
    code: '47123',
    state: 'Tennessee',
    county: 'Monroe',
  },
  {
    code: '47125',
    state: 'Tennessee',
    county: 'Montgomery',
  },
  {
    code: '47127',
    state: 'Tennessee',
    county: 'Moore',
  },
  {
    code: '47129',
    state: 'Tennessee',
    county: 'Morgan',
  },
  {
    code: '47131',
    state: 'Tennessee',
    county: 'Obion',
  },
  {
    code: '47133',
    state: 'Tennessee',
    county: 'Overton',
  },
  {
    code: '47135',
    state: 'Tennessee',
    county: 'Perry',
  },
  {
    code: '47137',
    state: 'Tennessee',
    county: 'Pickett',
  },
  {
    code: '47139',
    state: 'Tennessee',
    county: 'Polk',
  },
  {
    code: '47141',
    state: 'Tennessee',
    county: 'Putnam',
  },
  {
    code: '47143',
    state: 'Tennessee',
    county: 'Rhea',
  },
  {
    code: '47145',
    state: 'Tennessee',
    county: 'Roane',
  },
  {
    code: '47147',
    state: 'Tennessee',
    county: 'Robertson',
  },
  {
    code: '47149',
    state: 'Tennessee',
    county: 'Rutherford',
  },
  {
    code: '47151',
    state: 'Tennessee',
    county: 'Scott',
  },
  {
    code: '47153',
    state: 'Tennessee',
    county: 'Sequatchie',
  },
  {
    code: '47155',
    state: 'Tennessee',
    county: 'Sevier',
  },
  {
    code: '47157',
    state: 'Tennessee',
    county: 'Shelby',
  },
  {
    code: '47159',
    state: 'Tennessee',
    county: 'Smith',
  },
  {
    code: '47161',
    state: 'Tennessee',
    county: 'Stewart',
  },
  {
    code: '47163',
    state: 'Tennessee',
    county: 'Sullivan',
  },
  {
    code: '47165',
    state: 'Tennessee',
    county: 'Sumner',
  },
  {
    code: '47167',
    state: 'Tennessee',
    county: 'Tipton',
  },
  {
    code: '47169',
    state: 'Tennessee',
    county: 'Trousdale',
  },
  {
    code: '47171',
    state: 'Tennessee',
    county: 'Unicoi',
  },
  {
    code: '47173',
    state: 'Tennessee',
    county: 'Union',
  },
  {
    code: '47175',
    state: 'Tennessee',
    county: 'Van Buren',
  },
  {
    code: '47177',
    state: 'Tennessee',
    county: 'Warren',
  },
  {
    code: '47179',
    state: 'Tennessee',
    county: 'Washington',
  },
  {
    code: '47181',
    state: 'Tennessee',
    county: 'Wayne',
  },
  {
    code: '47183',
    state: 'Tennessee',
    county: 'Weakley',
  },
  {
    code: '47185',
    state: 'Tennessee',
    county: 'White',
  },
  {
    code: '47187',
    state: 'Tennessee',
    county: 'Williamson',
  },
  {
    code: '47189',
    state: 'Tennessee',
    county: 'Wilson',
  },
  {
    code: '48001',
    state: 'Texas',
    county: 'Anderson',
  },
  {
    code: '48003',
    state: 'Texas',
    county: 'Andrews',
  },
  {
    code: '48005',
    state: 'Texas',
    county: 'Angelina',
  },
  {
    code: '48007',
    state: 'Texas',
    county: 'Aransas',
  },
  {
    code: '48009',
    state: 'Texas',
    county: 'Archer',
  },
  {
    code: '48011',
    state: 'Texas',
    county: 'Armstrong',
  },
  {
    code: '48013',
    state: 'Texas',
    county: 'Atascosa',
  },
  {
    code: '48015',
    state: 'Texas',
    county: 'Austin',
  },
  {
    code: '48017',
    state: 'Texas',
    county: 'Bailey',
  },
  {
    code: '48019',
    state: 'Texas',
    county: 'Bandera',
  },
  {
    code: '48021',
    state: 'Texas',
    county: 'Bastrop',
  },
  {
    code: '48023',
    state: 'Texas',
    county: 'Baylor',
  },
  {
    code: '48025',
    state: 'Texas',
    county: 'Bee',
  },
  {
    code: '48027',
    state: 'Texas',
    county: 'Bell',
  },
  {
    code: '48029',
    state: 'Texas',
    county: 'Bexar',
  },
  {
    code: '48031',
    state: 'Texas',
    county: 'Blanco',
  },
  {
    code: '48033',
    state: 'Texas',
    county: 'Borden',
  },
  {
    code: '48035',
    state: 'Texas',
    county: 'Bosque',
  },
  {
    code: '48037',
    state: 'Texas',
    county: 'Bowie',
  },
  {
    code: '48039',
    state: 'Texas',
    county: 'Brazoria',
  },
  {
    code: '48041',
    state: 'Texas',
    county: 'Brazos',
  },
  {
    code: '48043',
    state: 'Texas',
    county: 'Brewster',
  },
  {
    code: '48045',
    state: 'Texas',
    county: 'Briscoe',
  },
  {
    code: '48047',
    state: 'Texas',
    county: 'Brooks',
  },
  {
    code: '48049',
    state: 'Texas',
    county: 'Brown',
  },
  {
    code: '48051',
    state: 'Texas',
    county: 'Burleson',
  },
  {
    code: '48053',
    state: 'Texas',
    county: 'Burnet',
  },
  {
    code: '48055',
    state: 'Texas',
    county: 'Caldwell',
  },
  {
    code: '48057',
    state: 'Texas',
    county: 'Calhoun',
  },
  {
    code: '48059',
    state: 'Texas',
    county: 'Callahan',
  },
  {
    code: '48061',
    state: 'Texas',
    county: 'Cameron',
  },
  {
    code: '48063',
    state: 'Texas',
    county: 'Camp',
  },
  {
    code: '48065',
    state: 'Texas',
    county: 'Carson',
  },
  {
    code: '48067',
    state: 'Texas',
    county: 'Cass',
  },
  {
    code: '48069',
    state: 'Texas',
    county: 'Castro',
  },
  {
    code: '48071',
    state: 'Texas',
    county: 'Chambers',
  },
  {
    code: '48073',
    state: 'Texas',
    county: 'Cherokee',
  },
  {
    code: '48075',
    state: 'Texas',
    county: 'Childress',
  },
  {
    code: '48077',
    state: 'Texas',
    county: 'Clay',
  },
  {
    code: '48079',
    state: 'Texas',
    county: 'Cochran',
  },
  {
    code: '48081',
    state: 'Texas',
    county: 'Coke',
  },
  {
    code: '48083',
    state: 'Texas',
    county: 'Coleman',
  },
  {
    code: '48085',
    state: 'Texas',
    county: 'Collin',
  },
  {
    code: '48087',
    state: 'Texas',
    county: 'Collingsworth',
  },
  {
    code: '48089',
    state: 'Texas',
    county: 'Colorado',
  },
  {
    code: '48091',
    state: 'Texas',
    county: 'Comal',
  },
  {
    code: '48093',
    state: 'Texas',
    county: 'Comanche',
  },
  {
    code: '48095',
    state: 'Texas',
    county: 'Concho',
  },
  {
    code: '48097',
    state: 'Texas',
    county: 'Cooke',
  },
  {
    code: '48099',
    state: 'Texas',
    county: 'Coryell',
  },
  {
    code: '48101',
    state: 'Texas',
    county: 'Cottle',
  },
  {
    code: '48103',
    state: 'Texas',
    county: 'Crane',
  },
  {
    code: '48105',
    state: 'Texas',
    county: 'Crockett',
  },
  {
    code: '48107',
    state: 'Texas',
    county: 'Crosby',
  },
  {
    code: '48109',
    state: 'Texas',
    county: 'Culberson',
  },
  {
    code: '48111',
    state: 'Texas',
    county: 'Dallam',
  },
  {
    code: '48113',
    state: 'Texas',
    county: 'Dallas',
  },
  {
    code: '48115',
    state: 'Texas',
    county: 'Dawson',
  },
  {
    code: '48117',
    state: 'Texas',
    county: 'Deaf Smith',
  },
  {
    code: '48119',
    state: 'Texas',
    county: 'Delta',
  },
  {
    code: '48121',
    state: 'Texas',
    county: 'Denton',
  },
  {
    code: '48123',
    state: 'Texas',
    county: 'DeWitt',
  },
  {
    code: '48125',
    state: 'Texas',
    county: 'Dickens',
  },
  {
    code: '48127',
    state: 'Texas',
    county: 'Dimmit',
  },
  {
    code: '48129',
    state: 'Texas',
    county: 'Donley',
  },
  {
    code: '48131',
    state: 'Texas',
    county: 'Duval',
  },
  {
    code: '48133',
    state: 'Texas',
    county: 'Eastland',
  },
  {
    code: '48135',
    state: 'Texas',
    county: 'Ector',
  },
  {
    code: '48137',
    state: 'Texas',
    county: 'Edwards',
  },
  {
    code: '48139',
    state: 'Texas',
    county: 'Ellis',
  },
  {
    code: '48141',
    state: 'Texas',
    county: 'El Paso',
  },
  {
    code: '48143',
    state: 'Texas',
    county: 'Erath',
  },
  {
    code: '48145',
    state: 'Texas',
    county: 'Falls',
  },
  {
    code: '48147',
    state: 'Texas',
    county: 'Fannin',
  },
  {
    code: '48149',
    state: 'Texas',
    county: 'Fayette',
  },
  {
    code: '48151',
    state: 'Texas',
    county: 'Fisher',
  },
  {
    code: '48153',
    state: 'Texas',
    county: 'Floyd',
  },
  {
    code: '48155',
    state: 'Texas',
    county: 'Foard',
  },
  {
    code: '48157',
    state: 'Texas',
    county: 'Fort Bend',
  },
  {
    code: '48159',
    state: 'Texas',
    county: 'Franklin',
  },
  {
    code: '48161',
    state: 'Texas',
    county: 'Freestone',
  },
  {
    code: '48163',
    state: 'Texas',
    county: 'Frio',
  },
  {
    code: '48165',
    state: 'Texas',
    county: 'Gaines',
  },
  {
    code: '48167',
    state: 'Texas',
    county: 'Galveston',
  },
  {
    code: '48169',
    state: 'Texas',
    county: 'Garza',
  },
  {
    code: '48171',
    state: 'Texas',
    county: 'Gillespie',
  },
  {
    code: '48173',
    state: 'Texas',
    county: 'Glasscock',
  },
  {
    code: '48175',
    state: 'Texas',
    county: 'Goliad',
  },
  {
    code: '48177',
    state: 'Texas',
    county: 'Gonzales',
  },
  {
    code: '48179',
    state: 'Texas',
    county: 'Gray',
  },
  {
    code: '48181',
    state: 'Texas',
    county: 'Grayson',
  },
  {
    code: '48183',
    state: 'Texas',
    county: 'Gregg',
  },
  {
    code: '48185',
    state: 'Texas',
    county: 'Grimes',
  },
  {
    code: '48187',
    state: 'Texas',
    county: 'Guadalupe',
  },
  {
    code: '48189',
    state: 'Texas',
    county: 'Hale',
  },
  {
    code: '48191',
    state: 'Texas',
    county: 'Hall',
  },
  {
    code: '48193',
    state: 'Texas',
    county: 'Hamilton',
  },
  {
    code: '48195',
    state: 'Texas',
    county: 'Hansford',
  },
  {
    code: '48197',
    state: 'Texas',
    county: 'Hardeman',
  },
  {
    code: '48199',
    state: 'Texas',
    county: 'Hardin',
  },
  {
    code: '48201',
    state: 'Texas',
    county: 'Harris',
  },
  {
    code: '48203',
    state: 'Texas',
    county: 'Harrison',
  },
  {
    code: '48205',
    state: 'Texas',
    county: 'Hartley',
  },
  {
    code: '48207',
    state: 'Texas',
    county: 'Haskell',
  },
  {
    code: '48209',
    state: 'Texas',
    county: 'Hays',
  },
  {
    code: '48211',
    state: 'Texas',
    county: 'Hemphill',
  },
  {
    code: '48213',
    state: 'Texas',
    county: 'Henderson',
  },
  {
    code: '48215',
    state: 'Texas',
    county: 'Hidalgo',
  },
  {
    code: '48217',
    state: 'Texas',
    county: 'Hill',
  },
  {
    code: '48219',
    state: 'Texas',
    county: 'Hockley',
  },
  {
    code: '48221',
    state: 'Texas',
    county: 'Hood',
  },
  {
    code: '48223',
    state: 'Texas',
    county: 'Hopkins',
  },
  {
    code: '48225',
    state: 'Texas',
    county: 'Houston',
  },
  {
    code: '48227',
    state: 'Texas',
    county: 'Howard',
  },
  {
    code: '48229',
    state: 'Texas',
    county: 'Hudspeth',
  },
  {
    code: '48231',
    state: 'Texas',
    county: 'Hunt',
  },
  {
    code: '48233',
    state: 'Texas',
    county: 'Hutchinson',
  },
  {
    code: '48235',
    state: 'Texas',
    county: 'Irion',
  },
  {
    code: '48237',
    state: 'Texas',
    county: 'Jack',
  },
  {
    code: '48239',
    state: 'Texas',
    county: 'Jackson',
  },
  {
    code: '48241',
    state: 'Texas',
    county: 'Jasper',
  },
  {
    code: '48243',
    state: 'Texas',
    county: 'Jeff Davis',
  },
  {
    code: '48245',
    state: 'Texas',
    county: 'Jefferson',
  },
  {
    code: '48247',
    state: 'Texas',
    county: 'Jim Hogg',
  },
  {
    code: '48249',
    state: 'Texas',
    county: 'Jim Wells',
  },
  {
    code: '48251',
    state: 'Texas',
    county: 'Johnson',
  },
  {
    code: '48253',
    state: 'Texas',
    county: 'Jones',
  },
  {
    code: '48255',
    state: 'Texas',
    county: 'Karnes',
  },
  {
    code: '48257',
    state: 'Texas',
    county: 'Kaufman',
  },
  {
    code: '48259',
    state: 'Texas',
    county: 'Kendall',
  },
  {
    code: '48261',
    state: 'Texas',
    county: 'Kenedy',
  },
  {
    code: '48263',
    state: 'Texas',
    county: 'Kent',
  },
  {
    code: '48265',
    state: 'Texas',
    county: 'Kerr',
  },
  {
    code: '48267',
    state: 'Texas',
    county: 'Kimble',
  },
  {
    code: '48269',
    state: 'Texas',
    county: 'King',
  },
  {
    code: '48271',
    state: 'Texas',
    county: 'Kinney',
  },
  {
    code: '48273',
    state: 'Texas',
    county: 'Kleberg',
  },
  {
    code: '48275',
    state: 'Texas',
    county: 'Knox',
  },
  {
    code: '48277',
    state: 'Texas',
    county: 'Lamar',
  },
  {
    code: '48279',
    state: 'Texas',
    county: 'Lamb',
  },
  {
    code: '48281',
    state: 'Texas',
    county: 'Lampasas',
  },
  {
    code: '48283',
    state: 'Texas',
    county: 'La Salle',
  },
  {
    code: '48285',
    state: 'Texas',
    county: 'Lavaca',
  },
  {
    code: '48287',
    state: 'Texas',
    county: 'Lee',
  },
  {
    code: '48289',
    state: 'Texas',
    county: 'Leon',
  },
  {
    code: '48291',
    state: 'Texas',
    county: 'Liberty',
  },
  {
    code: '48293',
    state: 'Texas',
    county: 'Limestone',
  },
  {
    code: '48295',
    state: 'Texas',
    county: 'Lipscomb',
  },
  {
    code: '48297',
    state: 'Texas',
    county: 'Live Oak',
  },
  {
    code: '48299',
    state: 'Texas',
    county: 'Llano',
  },
  {
    code: '48301',
    state: 'Texas',
    county: 'Loving',
  },
  {
    code: '48303',
    state: 'Texas',
    county: 'Lubbock',
  },
  {
    code: '48305',
    state: 'Texas',
    county: 'Lynn',
  },
  {
    code: '48307',
    state: 'Texas',
    county: 'McCulloch',
  },
  {
    code: '48309',
    state: 'Texas',
    county: 'McLennan',
  },
  {
    code: '48311',
    state: 'Texas',
    county: 'McMullen',
  },
  {
    code: '48313',
    state: 'Texas',
    county: 'Madison',
  },
  {
    code: '48315',
    state: 'Texas',
    county: 'Marion',
  },
  {
    code: '48317',
    state: 'Texas',
    county: 'Martin',
  },
  {
    code: '48319',
    state: 'Texas',
    county: 'Mason',
  },
  {
    code: '48321',
    state: 'Texas',
    county: 'Matagorda',
  },
  {
    code: '48323',
    state: 'Texas',
    county: 'Maverick',
  },
  {
    code: '48325',
    state: 'Texas',
    county: 'Medina',
  },
  {
    code: '48327',
    state: 'Texas',
    county: 'Menard',
  },
  {
    code: '48329',
    state: 'Texas',
    county: 'Midland',
  },
  {
    code: '48331',
    state: 'Texas',
    county: 'Milam',
  },
  {
    code: '48333',
    state: 'Texas',
    county: 'Mills',
  },
  {
    code: '48335',
    state: 'Texas',
    county: 'Mitchell',
  },
  {
    code: '48337',
    state: 'Texas',
    county: 'Montague',
  },
  {
    code: '48339',
    state: 'Texas',
    county: 'Montgomery',
  },
  {
    code: '48341',
    state: 'Texas',
    county: 'Moore',
  },
  {
    code: '48343',
    state: 'Texas',
    county: 'Morris',
  },
  {
    code: '48345',
    state: 'Texas',
    county: 'Motley',
  },
  {
    code: '48347',
    state: 'Texas',
    county: 'Nacogdoches',
  },
  {
    code: '48349',
    state: 'Texas',
    county: 'Navarro',
  },
  {
    code: '48351',
    state: 'Texas',
    county: 'Newton',
  },
  {
    code: '48353',
    state: 'Texas',
    county: 'Nolan',
  },
  {
    code: '48355',
    state: 'Texas',
    county: 'Nueces',
  },
  {
    code: '48357',
    state: 'Texas',
    county: 'Ochiltree',
  },
  {
    code: '48359',
    state: 'Texas',
    county: 'Oldham',
  },
  {
    code: '48361',
    state: 'Texas',
    county: 'Orange',
  },
  {
    code: '48363',
    state: 'Texas',
    county: 'Palo Pinto',
  },
  {
    code: '48365',
    state: 'Texas',
    county: 'Panola',
  },
  {
    code: '48367',
    state: 'Texas',
    county: 'Parker',
  },
  {
    code: '48369',
    state: 'Texas',
    county: 'Parmer',
  },
  {
    code: '48371',
    state: 'Texas',
    county: 'Pecos',
  },
  {
    code: '48373',
    state: 'Texas',
    county: 'Polk',
  },
  {
    code: '48375',
    state: 'Texas',
    county: 'Potter',
  },
  {
    code: '48377',
    state: 'Texas',
    county: 'Presidio',
  },
  {
    code: '48379',
    state: 'Texas',
    county: 'Rains',
  },
  {
    code: '48381',
    state: 'Texas',
    county: 'Randall',
  },
  {
    code: '48383',
    state: 'Texas',
    county: 'Reagan',
  },
  {
    code: '48385',
    state: 'Texas',
    county: 'Real',
  },
  {
    code: '48387',
    state: 'Texas',
    county: 'Red River',
  },
  {
    code: '48389',
    state: 'Texas',
    county: 'Reeves',
  },
  {
    code: '48391',
    state: 'Texas',
    county: 'Refugio',
  },
  {
    code: '48393',
    state: 'Texas',
    county: 'Roberts',
  },
  {
    code: '48395',
    state: 'Texas',
    county: 'Robertson',
  },
  {
    code: '48397',
    state: 'Texas',
    county: 'Rockwall',
  },
  {
    code: '48399',
    state: 'Texas',
    county: 'Runnels',
  },
  {
    code: '48401',
    state: 'Texas',
    county: 'Rusk',
  },
  {
    code: '48403',
    state: 'Texas',
    county: 'Sabine',
  },
  {
    code: '48405',
    state: 'Texas',
    county: 'San Augustine',
  },
  {
    code: '48407',
    state: 'Texas',
    county: 'San Jacinto',
  },
  {
    code: '48409',
    state: 'Texas',
    county: 'San Patricio',
  },
  {
    code: '48411',
    state: 'Texas',
    county: 'San Saba',
  },
  {
    code: '48413',
    state: 'Texas',
    county: 'Schleicher',
  },
  {
    code: '48415',
    state: 'Texas',
    county: 'Scurry',
  },
  {
    code: '48417',
    state: 'Texas',
    county: 'Shackelford',
  },
  {
    code: '48419',
    state: 'Texas',
    county: 'Shelby',
  },
  {
    code: '48421',
    state: 'Texas',
    county: 'Sherman',
  },
  {
    code: '48423',
    state: 'Texas',
    county: 'Smith',
  },
  {
    code: '48425',
    state: 'Texas',
    county: 'Somervell',
  },
  {
    code: '48427',
    state: 'Texas',
    county: 'Starr',
  },
  {
    code: '48429',
    state: 'Texas',
    county: 'Stephens',
  },
  {
    code: '48431',
    state: 'Texas',
    county: 'Sterling',
  },
  {
    code: '48433',
    state: 'Texas',
    county: 'Stonewall',
  },
  {
    code: '48435',
    state: 'Texas',
    county: 'Sutton',
  },
  {
    code: '48437',
    state: 'Texas',
    county: 'Swisher',
  },
  {
    code: '48439',
    state: 'Texas',
    county: 'Tarrant',
  },
  {
    code: '48441',
    state: 'Texas',
    county: 'Taylor',
  },
  {
    code: '48443',
    state: 'Texas',
    county: 'Terrell',
  },
  {
    code: '48445',
    state: 'Texas',
    county: 'Terry',
  },
  {
    code: '48447',
    state: 'Texas',
    county: 'Throckmorton',
  },
  {
    code: '48449',
    state: 'Texas',
    county: 'Titus',
  },
  {
    code: '48451',
    state: 'Texas',
    county: 'Tom Green',
  },
  {
    code: '48453',
    state: 'Texas',
    county: 'Travis',
  },
  {
    code: '48455',
    state: 'Texas',
    county: 'Trinity',
  },
  {
    code: '48457',
    state: 'Texas',
    county: 'Tyler',
  },
  {
    code: '48459',
    state: 'Texas',
    county: 'Upshur',
  },
  {
    code: '48461',
    state: 'Texas',
    county: 'Upton',
  },
  {
    code: '48463',
    state: 'Texas',
    county: 'Uvalde',
  },
  {
    code: '48465',
    state: 'Texas',
    county: 'Val Verde',
  },
  {
    code: '48467',
    state: 'Texas',
    county: 'Van Zandt',
  },
  {
    code: '48469',
    state: 'Texas',
    county: 'Victoria',
  },
  {
    code: '48471',
    state: 'Texas',
    county: 'Walker',
  },
  {
    code: '48473',
    state: 'Texas',
    county: 'Waller',
  },
  {
    code: '48475',
    state: 'Texas',
    county: 'Ward',
  },
  {
    code: '48477',
    state: 'Texas',
    county: 'Washington',
  },
  {
    code: '48479',
    state: 'Texas',
    county: 'Webb',
  },
  {
    code: '48481',
    state: 'Texas',
    county: 'Wharton',
  },
  {
    code: '48483',
    state: 'Texas',
    county: 'Wheeler',
  },
  {
    code: '48485',
    state: 'Texas',
    county: 'Wichita',
  },
  {
    code: '48487',
    state: 'Texas',
    county: 'Wilbarger',
  },
  {
    code: '48489',
    state: 'Texas',
    county: 'Willacy',
  },
  {
    code: '48491',
    state: 'Texas',
    county: 'Williamson',
  },
  {
    code: '48493',
    state: 'Texas',
    county: 'Wilson',
  },
  {
    code: '48495',
    state: 'Texas',
    county: 'Winkler',
  },
  {
    code: '48497',
    state: 'Texas',
    county: 'Wise',
  },
  {
    code: '48499',
    state: 'Texas',
    county: 'Wood',
  },
  {
    code: '48501',
    state: 'Texas',
    county: 'Yoakum',
  },
  {
    code: '48503',
    state: 'Texas',
    county: 'Young',
  },
  {
    code: '48505',
    state: 'Texas',
    county: 'Zapata',
  },
  {
    code: '48507',
    state: 'Texas',
    county: 'Zavala',
  },
  {
    code: '49001',
    state: 'Utah',
    county: 'Beaver',
  },
  {
    code: '49003',
    state: 'Utah',
    county: 'Box Elder',
  },
  {
    code: '49005',
    state: 'Utah',
    county: 'Cache',
  },
  {
    code: '49007',
    state: 'Utah',
    county: 'Carbon',
  },
  {
    code: '49009',
    state: 'Utah',
    county: 'Daggett',
  },
  {
    code: '49011',
    state: 'Utah',
    county: 'Davis',
  },
  {
    code: '49013',
    state: 'Utah',
    county: 'Duchesne',
  },
  {
    code: '49015',
    state: 'Utah',
    county: 'Emery',
  },
  {
    code: '49017',
    state: 'Utah',
    county: 'Garfield',
  },
  {
    code: '49019',
    state: 'Utah',
    county: 'Grand',
  },
  {
    code: '49021',
    state: 'Utah',
    county: 'Iron',
  },
  {
    code: '49023',
    state: 'Utah',
    county: 'Juab',
  },
  {
    code: '49025',
    state: 'Utah',
    county: 'Kane',
  },
  {
    code: '49027',
    state: 'Utah',
    county: 'Millard',
  },
  {
    code: '49029',
    state: 'Utah',
    county: 'Morgan',
  },
  {
    code: '49031',
    state: 'Utah',
    county: 'Piute',
  },
  {
    code: '49033',
    state: 'Utah',
    county: 'Rich',
  },
  {
    code: '49035',
    state: 'Utah',
    county: 'Salt Lake',
  },
  {
    code: '49037',
    state: 'Utah',
    county: 'San Juan',
  },
  {
    code: '49039',
    state: 'Utah',
    county: 'Sanpete',
  },
  {
    code: '49041',
    state: 'Utah',
    county: 'Sevier',
  },
  {
    code: '49043',
    state: 'Utah',
    county: 'Summit',
  },
  {
    code: '49045',
    state: 'Utah',
    county: 'Tooele',
  },
  {
    code: '49047',
    state: 'Utah',
    county: 'Uintah',
  },
  {
    code: '49049',
    state: 'Utah',
    county: 'Utah',
  },
  {
    code: '49051',
    state: 'Utah',
    county: 'Wasatch',
  },
  {
    code: '49053',
    state: 'Utah',
    county: 'Washington',
  },
  {
    code: '49055',
    state: 'Utah',
    county: 'Wayne',
  },
  {
    code: '49057',
    state: 'Utah',
    county: 'Weber',
  },
  {
    code: '50001',
    state: 'Vermont',
    county: 'Addison',
  },
  {
    code: '50003',
    state: 'Vermont',
    county: 'Bennington',
  },
  {
    code: '50005',
    state: 'Vermont',
    county: 'Caledonia',
  },
  {
    code: '50007',
    state: 'Vermont',
    county: 'Chittenden',
  },
  {
    code: '50009',
    state: 'Vermont',
    county: 'Essex',
  },
  {
    code: '50011',
    state: 'Vermont',
    county: 'Franklin',
  },
  {
    code: '50013',
    state: 'Vermont',
    county: 'Grand Isle',
  },
  {
    code: '50015',
    state: 'Vermont',
    county: 'Lamoille',
  },
  {
    code: '50017',
    state: 'Vermont',
    county: 'Orange',
  },
  {
    code: '50019',
    state: 'Vermont',
    county: 'Orleans',
  },
  {
    code: '50021',
    state: 'Vermont',
    county: 'Rutland',
  },
  {
    code: '50023',
    state: 'Vermont',
    county: 'Washington',
  },
  {
    code: '50025',
    state: 'Vermont',
    county: 'Windham',
  },
  {
    code: '50027',
    state: 'Vermont',
    county: 'Windsor',
  },
  {
    code: '51001',
    state: 'Virginia',
    county: 'Accomack',
  },
  {
    code: '51003',
    state: 'Virginia',
    county: 'Albemarle',
  },
  {
    code: '51005',
    state: 'Virginia',
    county: 'Alleghany',
  },
  {
    code: '51007',
    state: 'Virginia',
    county: 'Amelia',
  },
  {
    code: '51009',
    state: 'Virginia',
    county: 'Amherst',
  },
  {
    code: '51011',
    state: 'Virginia',
    county: 'Appomattox',
  },
  {
    code: '51013',
    state: 'Virginia',
    county: 'Arlington',
  },
  {
    code: '51015',
    state: 'Virginia',
    county: 'Augusta',
  },
  {
    code: '51017',
    state: 'Virginia',
    county: 'Bath',
  },
  {
    code: '51019',
    state: 'Virginia',
    county: 'Bedford',
  },
  {
    code: '51021',
    state: 'Virginia',
    county: 'Bland',
  },
  {
    code: '51023',
    state: 'Virginia',
    county: 'Botetourt',
  },
  {
    code: '51025',
    state: 'Virginia',
    county: 'Brunswick',
  },
  {
    code: '51027',
    state: 'Virginia',
    county: 'Buchanan',
  },
  {
    code: '51029',
    state: 'Virginia',
    county: 'Buckingham',
  },
  {
    code: '51031',
    state: 'Virginia',
    county: 'Campbell',
  },
  {
    code: '51033',
    state: 'Virginia',
    county: 'Caroline',
  },
  {
    code: '51035',
    state: 'Virginia',
    county: 'Carroll',
  },
  {
    code: '51036',
    state: 'Virginia',
    county: 'Charles city',
  },
  {
    code: '51037',
    state: 'Virginia',
    county: 'Charlotte',
  },
  {
    code: '51041',
    state: 'Virginia',
    county: 'Chesterfield',
  },
  {
    code: '51043',
    state: 'Virginia',
    county: 'Clarke',
  },
  {
    code: '51045',
    state: 'Virginia',
    county: 'Craig',
  },
  {
    code: '51047',
    state: 'Virginia',
    county: 'Culpeper',
  },
  {
    code: '51049',
    state: 'Virginia',
    county: 'Cumberland',
  },
  {
    code: '51051',
    state: 'Virginia',
    county: 'Dickenson',
  },
  {
    code: '51053',
    state: 'Virginia',
    county: 'Dinwiddie',
  },
  {
    code: '51057',
    state: 'Virginia',
    county: 'Essex',
  },
  {
    code: '51059',
    state: 'Virginia',
    county: 'Fairfax',
  },
  {
    code: '51061',
    state: 'Virginia',
    county: 'Fauquier',
  },
  {
    code: '51063',
    state: 'Virginia',
    county: 'Floyd',
  },
  {
    code: '51065',
    state: 'Virginia',
    county: 'Fluvanna',
  },
  {
    code: '51067',
    state: 'Virginia',
    county: 'Franklin',
  },
  {
    code: '51069',
    state: 'Virginia',
    county: 'Frederick',
  },
  {
    code: '51071',
    state: 'Virginia',
    county: 'Giles',
  },
  {
    code: '51073',
    state: 'Virginia',
    county: 'Gloucester',
  },
  {
    code: '51075',
    state: 'Virginia',
    county: 'Goochland',
  },
  {
    code: '51077',
    state: 'Virginia',
    county: 'Grayson',
  },
  {
    code: '51079',
    state: 'Virginia',
    county: 'Greene',
  },
  {
    code: '51081',
    state: 'Virginia',
    county: 'Greensville',
  },
  {
    code: '51083',
    state: 'Virginia',
    county: 'Halifax',
  },
  {
    code: '51085',
    state: 'Virginia',
    county: 'Hanover',
  },
  {
    code: '51087',
    state: 'Virginia',
    county: 'Henrico',
  },
  {
    code: '51089',
    state: 'Virginia',
    county: 'Henry',
  },
  {
    code: '51091',
    state: 'Virginia',
    county: 'Highland',
  },
  {
    code: '51093',
    state: 'Virginia',
    county: 'Isle of Wight',
  },
  {
    code: '51095',
    state: 'Virginia',
    county: 'James city',
  },
  {
    code: '51097',
    state: 'Virginia',
    county: 'King and Queen',
  },
  {
    code: '51099',
    state: 'Virginia',
    county: 'King George',
  },
  {
    code: '51101',
    state: 'Virginia',
    county: 'King William',
  },
  {
    code: '51103',
    state: 'Virginia',
    county: 'Lancaster',
  },
  {
    code: '51105',
    state: 'Virginia',
    county: 'Lee',
  },
  {
    code: '51107',
    state: 'Virginia',
    county: 'Loudoun',
  },
  {
    code: '51109',
    state: 'Virginia',
    county: 'Louisa',
  },
  {
    code: '51111',
    state: 'Virginia',
    county: 'Lunenburg',
  },
  {
    code: '51113',
    state: 'Virginia',
    county: 'Madison',
  },
  {
    code: '51115',
    state: 'Virginia',
    county: 'Mathews',
  },
  {
    code: '51117',
    state: 'Virginia',
    county: 'Mecklenburg',
  },
  {
    code: '51119',
    state: 'Virginia',
    county: 'Middlesex',
  },
  {
    code: '51121',
    state: 'Virginia',
    county: 'Montgomery',
  },
  {
    code: '51125',
    state: 'Virginia',
    county: 'Nelson',
  },
  {
    code: '51127',
    state: 'Virginia',
    county: 'New Kent',
  },
  {
    code: '51131',
    state: 'Virginia',
    county: 'Northampton',
  },
  {
    code: '51133',
    state: 'Virginia',
    county: 'Northumberland',
  },
  {
    code: '51135',
    state: 'Virginia',
    county: 'Nottoway',
  },
  {
    code: '51137',
    state: 'Virginia',
    county: 'Orange',
  },
  {
    code: '51139',
    state: 'Virginia',
    county: 'Page',
  },
  {
    code: '51141',
    state: 'Virginia',
    county: 'Patrick',
  },
  {
    code: '51143',
    state: 'Virginia',
    county: 'Pittsylvania',
  },
  {
    code: '51145',
    state: 'Virginia',
    county: 'Powhatan',
  },
  {
    code: '51147',
    state: 'Virginia',
    county: 'Prince Edward',
  },
  {
    code: '51149',
    state: 'Virginia',
    county: 'Prince George',
  },
  {
    code: '51153',
    state: 'Virginia',
    county: 'Prince William',
  },
  {
    code: '51155',
    state: 'Virginia',
    county: 'Pulaski',
  },
  {
    code: '51157',
    state: 'Virginia',
    county: 'Rappahannock',
  },
  {
    code: '51159',
    state: 'Virginia',
    county: 'Richmond',
  },
  {
    code: '51161',
    state: 'Virginia',
    county: 'Roanoke',
  },
  {
    code: '51163',
    state: 'Virginia',
    county: 'Rockbridge',
  },
  {
    code: '51165',
    state: 'Virginia',
    county: 'Rockingham',
  },
  {
    code: '51167',
    state: 'Virginia',
    county: 'Russell',
  },
  {
    code: '51169',
    state: 'Virginia',
    county: 'Scott',
  },
  {
    code: '51171',
    state: 'Virginia',
    county: 'Shenandoah',
  },
  {
    code: '51173',
    state: 'Virginia',
    county: 'Smyth',
  },
  {
    code: '51175',
    state: 'Virginia',
    county: 'Southampton',
  },
  {
    code: '51177',
    state: 'Virginia',
    county: 'Spotsylvania',
  },
  {
    code: '51179',
    state: 'Virginia',
    county: 'Stafford',
  },
  {
    code: '51181',
    state: 'Virginia',
    county: 'Surry',
  },
  {
    code: '51183',
    state: 'Virginia',
    county: 'Sussex',
  },
  {
    code: '51185',
    state: 'Virginia',
    county: 'Tazewell',
  },
  {
    code: '51187',
    state: 'Virginia',
    county: 'Warren',
  },
  {
    code: '51191',
    state: 'Virginia',
    county: 'Washington',
  },
  {
    code: '51193',
    state: 'Virginia',
    county: 'Westmoreland',
  },
  {
    code: '51195',
    state: 'Virginia',
    county: 'Wise',
  },
  {
    code: '51197',
    state: 'Virginia',
    county: 'Wythe',
  },
  {
    code: '51199',
    state: 'Virginia',
    county: 'York',
  },
  {
    code: '51510',
    state: 'Virginia',
    county: 'Alexandria city',
  },
  {
    code: '51515',
    state: 'Virginia',
    county: 'Bedford city',
  },
  {
    code: '51520',
    state: 'Virginia',
    county: 'Bristol city',
  },
  {
    code: '51530',
    state: 'Virginia',
    county: 'Buena Vista city',
  },
  {
    code: '51540',
    state: 'Virginia',
    county: 'Charlottesville city',
  },
  {
    code: '51550',
    state: 'Virginia',
    county: 'Chesapeake city',
  },
  {
    code: '51570',
    state: 'Virginia',
    county: 'Colonial Heights city',
  },
  {
    code: '51580',
    state: 'Virginia',
    county: 'Covington city',
  },
  {
    code: '51590',
    state: 'Virginia',
    county: 'Danville city',
  },
  {
    code: '51595',
    state: 'Virginia',
    county: 'Emporia city',
  },
  {
    code: '51600',
    state: 'Virginia',
    county: 'Fairfax city',
  },
  {
    code: '51610',
    state: 'Virginia',
    county: 'Falls Church city',
  },
  {
    code: '51620',
    state: 'Virginia',
    county: 'Franklin city',
  },
  {
    code: '51630',
    state: 'Virginia',
    county: 'Fredericksburg city',
  },
  {
    code: '51640',
    state: 'Virginia',
    county: 'Galax city',
  },
  {
    code: '51650',
    state: 'Virginia',
    county: 'Hampton city',
  },
  {
    code: '51660',
    state: 'Virginia',
    county: 'Harrisonburg city',
  },
  {
    code: '51670',
    state: 'Virginia',
    county: 'Hopewell city',
  },
  {
    code: '51678',
    state: 'Virginia',
    county: 'Lexington city',
  },
  {
    code: '51680',
    state: 'Virginia',
    county: 'Lynchburg city',
  },
  {
    code: '51683',
    state: 'Virginia',
    county: 'Manassas city',
  },
  {
    code: '51685',
    state: 'Virginia',
    county: 'Manassas Park city',
  },
  {
    code: '51690',
    state: 'Virginia',
    county: 'Martinsville city',
  },
  {
    code: '51700',
    state: 'Virginia',
    county: 'Newport News city',
  },
  {
    code: '51710',
    state: 'Virginia',
    county: 'Norfolk city',
  },
  {
    code: '51720',
    state: 'Virginia',
    county: 'Norton city',
  },
  {
    code: '51730',
    state: 'Virginia',
    county: 'Petersburg city',
  },
  {
    code: '51735',
    state: 'Virginia',
    county: 'Poquoson city',
  },
  {
    code: '51740',
    state: 'Virginia',
    county: 'Portsmouth city',
  },
  {
    code: '51750',
    state: 'Virginia',
    county: 'Radford city',
  },
  {
    code: '51760',
    state: 'Virginia',
    county: 'Richmond city',
  },
  {
    code: '51770',
    state: 'Virginia',
    county: 'Roanoke city',
  },
  {
    code: '51775',
    state: 'Virginia',
    county: 'Salem city',
  },
  {
    code: '51790',
    state: 'Virginia',
    county: 'Staunton city',
  },
  {
    code: '51800',
    state: 'Virginia',
    county: 'Suffolk city',
  },
  {
    code: '51810',
    state: 'Virginia',
    county: 'Virginia Beach city',
  },
  {
    code: '51820',
    state: 'Virginia',
    county: 'Waynesboro city',
  },
  {
    code: '51830',
    state: 'Virginia',
    county: 'Williamsburg city',
  },
  {
    code: '51840',
    state: 'Virginia',
    county: 'Winchester city',
  },
  {
    code: '53001',
    state: 'Washington',
    county: 'Adams',
  },
  {
    code: '53003',
    state: 'Washington',
    county: 'Asotin',
  },
  {
    code: '53005',
    state: 'Washington',
    county: 'Benton',
  },
  {
    code: '53007',
    state: 'Washington',
    county: 'Chelan',
  },
  {
    code: '53009',
    state: 'Washington',
    county: 'Clallam',
  },
  {
    code: '53011',
    state: 'Washington',
    county: 'Clark',
  },
  {
    code: '53013',
    state: 'Washington',
    county: 'Columbia',
  },
  {
    code: '53015',
    state: 'Washington',
    county: 'Cowlitz',
  },
  {
    code: '53017',
    state: 'Washington',
    county: 'Douglas',
  },
  {
    code: '53019',
    state: 'Washington',
    county: 'Ferry',
  },
  {
    code: '53021',
    state: 'Washington',
    county: 'Franklin',
  },
  {
    code: '53023',
    state: 'Washington',
    county: 'Garfield',
  },
  {
    code: '53025',
    state: 'Washington',
    county: 'Grant',
  },
  {
    code: '53027',
    state: 'Washington',
    county: 'Grays Harbor',
  },
  {
    code: '53029',
    state: 'Washington',
    county: 'Island',
  },
  {
    code: '53031',
    state: 'Washington',
    county: 'Jefferson',
  },
  {
    code: '53033',
    state: 'Washington',
    county: 'King',
  },
  {
    code: '53035',
    state: 'Washington',
    county: 'Kitsap',
  },
  {
    code: '53037',
    state: 'Washington',
    county: 'Kittitas',
  },
  {
    code: '53039',
    state: 'Washington',
    county: 'Klickitat',
  },
  {
    code: '53041',
    state: 'Washington',
    county: 'Lewis',
  },
  {
    code: '53043',
    state: 'Washington',
    county: 'Lincoln',
  },
  {
    code: '53045',
    state: 'Washington',
    county: 'Mason',
  },
  {
    code: '53047',
    state: 'Washington',
    county: 'Okanogan',
  },
  {
    code: '53049',
    state: 'Washington',
    county: 'Pacific',
  },
  {
    code: '53051',
    state: 'Washington',
    county: 'Pend Oreille',
  },
  {
    code: '53053',
    state: 'Washington',
    county: 'Pierce',
  },
  {
    code: '53055',
    state: 'Washington',
    county: 'San Juan',
  },
  {
    code: '53057',
    state: 'Washington',
    county: 'Skagit',
  },
  {
    code: '53059',
    state: 'Washington',
    county: 'Skamania',
  },
  {
    code: '53061',
    state: 'Washington',
    county: 'Snohomish',
  },
  {
    code: '53063',
    state: 'Washington',
    county: 'Spokane',
  },
  {
    code: '53065',
    state: 'Washington',
    county: 'Stevens',
  },
  {
    code: '53067',
    state: 'Washington',
    county: 'Thurston',
  },
  {
    code: '53069',
    state: 'Washington',
    county: 'Wahkiakum',
  },
  {
    code: '53071',
    state: 'Washington',
    county: 'Walla Walla',
  },
  {
    code: '53073',
    state: 'Washington',
    county: 'Whatcom',
  },
  {
    code: '53075',
    state: 'Washington',
    county: 'Whitman',
  },
  {
    code: '53077',
    state: 'Washington',
    county: 'Yakima',
  },
  {
    code: '54001',
    state: 'West Virginia',
    county: 'Barbour',
  },
  {
    code: '54003',
    state: 'West Virginia',
    county: 'Berkeley',
  },
  {
    code: '54005',
    state: 'West Virginia',
    county: 'Boone',
  },
  {
    code: '54007',
    state: 'West Virginia',
    county: 'Braxton',
  },
  {
    code: '54009',
    state: 'West Virginia',
    county: 'Brooke',
  },
  {
    code: '54011',
    state: 'West Virginia',
    county: 'Cabell',
  },
  {
    code: '54013',
    state: 'West Virginia',
    county: 'Calhoun',
  },
  {
    code: '54015',
    state: 'West Virginia',
    county: 'Clay',
  },
  {
    code: '54017',
    state: 'West Virginia',
    county: 'Doddridge',
  },
  {
    code: '54019',
    state: 'West Virginia',
    county: 'Fayette',
  },
  {
    code: '54021',
    state: 'West Virginia',
    county: 'Gilmer',
  },
  {
    code: '54023',
    state: 'West Virginia',
    county: 'Grant',
  },
  {
    code: '54025',
    state: 'West Virginia',
    county: 'Greenbrier',
  },
  {
    code: '54027',
    state: 'West Virginia',
    county: 'Hampshire',
  },
  {
    code: '54029',
    state: 'West Virginia',
    county: 'Hancock',
  },
  {
    code: '54031',
    state: 'West Virginia',
    county: 'Hardy',
  },
  {
    code: '54033',
    state: 'West Virginia',
    county: 'Harrison',
  },
  {
    code: '54035',
    state: 'West Virginia',
    county: 'Jackson',
  },
  {
    code: '54037',
    state: 'West Virginia',
    county: 'Jefferson',
  },
  {
    code: '54039',
    state: 'West Virginia',
    county: 'Kanawha',
  },
  {
    code: '54041',
    state: 'West Virginia',
    county: 'Lewis',
  },
  {
    code: '54043',
    state: 'West Virginia',
    county: 'Lincoln',
  },
  {
    code: '54045',
    state: 'West Virginia',
    county: 'Logan',
  },
  {
    code: '54047',
    state: 'West Virginia',
    county: 'McDowell',
  },
  {
    code: '54049',
    state: 'West Virginia',
    county: 'Marion',
  },
  {
    code: '54051',
    state: 'West Virginia',
    county: 'Marshall',
  },
  {
    code: '54053',
    state: 'West Virginia',
    county: 'Mason',
  },
  {
    code: '54055',
    state: 'West Virginia',
    county: 'Mercer',
  },
  {
    code: '54057',
    state: 'West Virginia',
    county: 'Mineral',
  },
  {
    code: '54059',
    state: 'West Virginia',
    county: 'Mingo',
  },
  {
    code: '54061',
    state: 'West Virginia',
    county: 'Monongalia',
  },
  {
    code: '54063',
    state: 'West Virginia',
    county: 'Monroe',
  },
  {
    code: '54065',
    state: 'West Virginia',
    county: 'Morgan',
  },
  {
    code: '54067',
    state: 'West Virginia',
    county: 'Nicholas',
  },
  {
    code: '54069',
    state: 'West Virginia',
    county: 'Ohio',
  },
  {
    code: '54071',
    state: 'West Virginia',
    county: 'Pendleton',
  },
  {
    code: '54073',
    state: 'West Virginia',
    county: 'Pleasants',
  },
  {
    code: '54075',
    state: 'West Virginia',
    county: 'Pocahontas',
  },
  {
    code: '54077',
    state: 'West Virginia',
    county: 'Preston',
  },
  {
    code: '54079',
    state: 'West Virginia',
    county: 'Putnam',
  },
  {
    code: '54081',
    state: 'West Virginia',
    county: 'Raleigh',
  },
  {
    code: '54083',
    state: 'West Virginia',
    county: 'Randolph',
  },
  {
    code: '54085',
    state: 'West Virginia',
    county: 'Ritchie',
  },
  {
    code: '54087',
    state: 'West Virginia',
    county: 'Roane',
  },
  {
    code: '54089',
    state: 'West Virginia',
    county: 'Summers',
  },
  {
    code: '54091',
    state: 'West Virginia',
    county: 'Taylor',
  },
  {
    code: '54093',
    state: 'West Virginia',
    county: 'Tucker',
  },
  {
    code: '54095',
    state: 'West Virginia',
    county: 'Tyler',
  },
  {
    code: '54097',
    state: 'West Virginia',
    county: 'Upshur',
  },
  {
    code: '54099',
    state: 'West Virginia',
    county: 'Wayne',
  },
  {
    code: '54101',
    state: 'West Virginia',
    county: 'Webster',
  },
  {
    code: '54103',
    state: 'West Virginia',
    county: 'Wetzel',
  },
  {
    code: '54105',
    state: 'West Virginia',
    county: 'Wirt',
  },
  {
    code: '54107',
    state: 'West Virginia',
    county: 'Wood',
  },
  {
    code: '54109',
    state: 'West Virginia',
    county: 'Wyoming',
  },
  {
    code: '55001',
    state: 'Wisconsin',
    county: 'Adams',
  },
  {
    code: '55003',
    state: 'Wisconsin',
    county: 'Ashland',
  },
  {
    code: '55005',
    state: 'Wisconsin',
    county: 'Barron',
  },
  {
    code: '55007',
    state: 'Wisconsin',
    county: 'Bayfield',
  },
  {
    code: '55009',
    state: 'Wisconsin',
    county: 'Brown',
  },
  {
    code: '55011',
    state: 'Wisconsin',
    county: 'Buffalo',
  },
  {
    code: '55013',
    state: 'Wisconsin',
    county: 'Burnett',
  },
  {
    code: '55015',
    state: 'Wisconsin',
    county: 'Calumet',
  },
  {
    code: '55017',
    state: 'Wisconsin',
    county: 'Chippewa',
  },
  {
    code: '55019',
    state: 'Wisconsin',
    county: 'Clark',
  },
  {
    code: '55021',
    state: 'Wisconsin',
    county: 'Columbia',
  },
  {
    code: '55023',
    state: 'Wisconsin',
    county: 'Crawford',
  },
  {
    code: '55025',
    state: 'Wisconsin',
    county: 'Dane',
  },
  {
    code: '55027',
    state: 'Wisconsin',
    county: 'Dodge',
  },
  {
    code: '55029',
    state: 'Wisconsin',
    county: 'Door',
  },
  {
    code: '55031',
    state: 'Wisconsin',
    county: 'Douglas',
  },
  {
    code: '55033',
    state: 'Wisconsin',
    county: 'Dunn',
  },
  {
    code: '55035',
    state: 'Wisconsin',
    county: 'Eau Claire',
  },
  {
    code: '55037',
    state: 'Wisconsin',
    county: 'Florence',
  },
  {
    code: '55039',
    state: 'Wisconsin',
    county: 'Fond du Lac',
  },
  {
    code: '55041',
    state: 'Wisconsin',
    county: 'Forest',
  },
  {
    code: '55043',
    state: 'Wisconsin',
    county: 'Grant',
  },
  {
    code: '55045',
    state: 'Wisconsin',
    county: 'Green',
  },
  {
    code: '55047',
    state: 'Wisconsin',
    county: 'Green Lake',
  },
  {
    code: '55049',
    state: 'Wisconsin',
    county: 'Iowa',
  },
  {
    code: '55051',
    state: 'Wisconsin',
    county: 'Iron',
  },
  {
    code: '55053',
    state: 'Wisconsin',
    county: 'Jackson',
  },
  {
    code: '55055',
    state: 'Wisconsin',
    county: 'Jefferson',
  },
  {
    code: '55057',
    state: 'Wisconsin',
    county: 'Juneau',
  },
  {
    code: '55059',
    state: 'Wisconsin',
    county: 'Kenosha',
  },
  {
    code: '55061',
    state: 'Wisconsin',
    county: 'Kewaunee',
  },
  {
    code: '55063',
    state: 'Wisconsin',
    county: 'La Crosse',
  },
  {
    code: '55065',
    state: 'Wisconsin',
    county: 'Lafayette',
  },
  {
    code: '55067',
    state: 'Wisconsin',
    county: 'Langlade',
  },
  {
    code: '55069',
    state: 'Wisconsin',
    county: 'Lincoln',
  },
  {
    code: '55071',
    state: 'Wisconsin',
    county: 'Manitowoc',
  },
  {
    code: '55073',
    state: 'Wisconsin',
    county: 'Marathon',
  },
  {
    code: '55075',
    state: 'Wisconsin',
    county: 'Marinette',
  },
  {
    code: '55077',
    state: 'Wisconsin',
    county: 'Marquette',
  },
  {
    code: '55078',
    state: 'Wisconsin',
    county: 'Menominee',
  },
  {
    code: '55079',
    state: 'Wisconsin',
    county: 'Milwaukee',
  },
  {
    code: '55081',
    state: 'Wisconsin',
    county: 'Monroe',
  },
  {
    code: '55083',
    state: 'Wisconsin',
    county: 'Oconto',
  },
  {
    code: '55085',
    state: 'Wisconsin',
    county: 'Oneida',
  },
  {
    code: '55087',
    state: 'Wisconsin',
    county: 'Outagamie',
  },
  {
    code: '55089',
    state: 'Wisconsin',
    county: 'Ozaukee',
  },
  {
    code: '55091',
    state: 'Wisconsin',
    county: 'Pepin',
  },
  {
    code: '55093',
    state: 'Wisconsin',
    county: 'Pierce',
  },
  {
    code: '55095',
    state: 'Wisconsin',
    county: 'Polk',
  },
  {
    code: '55097',
    state: 'Wisconsin',
    county: 'Portage',
  },
  {
    code: '55099',
    state: 'Wisconsin',
    county: 'Price',
  },
  {
    code: '55101',
    state: 'Wisconsin',
    county: 'Racine',
  },
  {
    code: '55103',
    state: 'Wisconsin',
    county: 'Richland',
  },
  {
    code: '55105',
    state: 'Wisconsin',
    county: 'Rock',
  },
  {
    code: '55107',
    state: 'Wisconsin',
    county: 'Rusk',
  },
  {
    code: '55109',
    state: 'Wisconsin',
    county: 'St. Croix',
  },
  {
    code: '55111',
    state: 'Wisconsin',
    county: 'Sauk',
  },
  {
    code: '55113',
    state: 'Wisconsin',
    county: 'Sawyer',
  },
  {
    code: '55115',
    state: 'Wisconsin',
    county: 'Shawano',
  },
  {
    code: '55117',
    state: 'Wisconsin',
    county: 'Sheboygan',
  },
  {
    code: '55119',
    state: 'Wisconsin',
    county: 'Taylor',
  },
  {
    code: '55121',
    state: 'Wisconsin',
    county: 'Trempealeau',
  },
  {
    code: '55123',
    state: 'Wisconsin',
    county: 'Vernon',
  },
  {
    code: '55125',
    state: 'Wisconsin',
    county: 'Vilas',
  },
  {
    code: '55127',
    state: 'Wisconsin',
    county: 'Walworth',
  },
  {
    code: '55129',
    state: 'Wisconsin',
    county: 'Washburn',
  },
  {
    code: '55131',
    state: 'Wisconsin',
    county: 'Washington',
  },
  {
    code: '55133',
    state: 'Wisconsin',
    county: 'Waukesha',
  },
  {
    code: '55135',
    state: 'Wisconsin',
    county: 'Waupaca',
  },
  {
    code: '55137',
    state: 'Wisconsin',
    county: 'Waushara',
  },
  {
    code: '55139',
    state: 'Wisconsin',
    county: 'Winnebago',
  },
  {
    code: '55141',
    state: 'Wisconsin',
    county: 'Wood',
  },
  {
    code: '56001',
    state: 'Wyoming',
    county: 'Albany',
  },
  {
    code: '56003',
    state: 'Wyoming',
    county: 'Big Horn',
  },
  {
    code: '56005',
    state: 'Wyoming',
    county: 'Campbell',
  },
  {
    code: '56007',
    state: 'Wyoming',
    county: 'Carbon',
  },
  {
    code: '56009',
    state: 'Wyoming',
    county: 'Converse',
  },
  {
    code: '56011',
    state: 'Wyoming',
    county: 'Crook',
  },
  {
    code: '56013',
    state: 'Wyoming',
    county: 'Fremont',
  },
  {
    code: '56015',
    state: 'Wyoming',
    county: 'Goshen',
  },
  {
    code: '56017',
    state: 'Wyoming',
    county: 'Hot Springs',
  },
  {
    code: '56019',
    state: 'Wyoming',
    county: 'Johnson',
  },
  {
    code: '56021',
    state: 'Wyoming',
    county: 'Laramie',
  },
  {
    code: '56023',
    state: 'Wyoming',
    county: 'Lincoln',
  },
  {
    code: '56025',
    state: 'Wyoming',
    county: 'Natrona',
  },
  {
    code: '56027',
    state: 'Wyoming',
    county: 'Niobrara',
  },
  {
    code: '56029',
    state: 'Wyoming',
    county: 'Park',
  },
  {
    code: '56031',
    state: 'Wyoming',
    county: 'Platte',
  },
  {
    code: '56033',
    state: 'Wyoming',
    county: 'Sheridan',
  },
  {
    code: '56035',
    state: 'Wyoming',
    county: 'Sublette',
  },
  {
    code: '56037',
    state: 'Wyoming',
    county: 'Sweetwater',
  },
  {
    code: '56039',
    state: 'Wyoming',
    county: 'Teton',
  },
  {
    code: '56041',
    state: 'Wyoming',
    county: 'Uinta',
  },
  {
    code: '56043',
    state: 'Wyoming',
    county: 'Washakie',
  },
  {
    code: '56045',
    state: 'Wyoming',
    county: 'Weston',
  },
];

export default FipsCodes;
