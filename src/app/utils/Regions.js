const Regions = {
    CALIFORNIA: {
        id: 1,
        slug: 'CA',
        label: 'California',
        defaults: 'eere-defaults-california',
        rdf: 'rdf_california_2015',
    },
    GREAT_LAKES_MID_ATLANTIC: {
        id: 2,
        slug: 'EMW',
        label: 'Great Lakes / Mid-Atlantic',
        defaults: 'eere-defaults-great-lakes-mid-atlantic',
        rdf: 'rdf_great-lakes-mid-atlantic_2015',
    },
    NORTHEAST: {
        id: 3,
        slug: 'NE',
        label: 'Northeast',
        defaults: 'eere-defaults-northeast',
        rdf: 'rdf_northeast_2015',
    },
    NORTHWEST: {
        id: 4,
        slug: 'NW',
        label: 'Northwest',
        defaults: 'eere-defaults-northwest',
        rdf: false,
    },
    ROCKY_MOUNTAINS: {
        id: 5,
        slug: 'RM',
        label: 'Rocky Mountains',
        defaults: 'eere-defaults-rocky-mountains',
        rdf: false,
    },
    LOWER_MIDWEST: {
        id: 6,
        slug: 'SC',
        label: 'Lower Midwest',
        defaults: 'eere-defaults-lower-midwest',
        rdf: false,
    },
    SOUTHEAST: {
        id: 7,
        slug: 'SE',
        label: 'Southeast',
        defaults: 'eere-defaults-southeast',
        rdf: false,
    },
    SOUTHWEST: {
        id: 8,
        slug: 'SW',
        label: 'Southwest',
        defaults: 'eere-defaults-southwest',
        rdf: false,
    },
    TEXAS: {
        id: 9,
        slug: 'TX',
        label: 'Texas',
        defaults: 'eere-defaults-texas',
        rdf: 'rdf_texas_2015',
    },
    UPPER_MIDWEST: {
        id: 10,
        slug: 'WMW',
        label: 'Upper Midwest',
        defaults: 'eere-defaults-upper-midwest',
        rdf: 'rdf_upper-midwest_2015',
    },
}

export default Regions;