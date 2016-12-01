// EERE Defaults
import californiaEere from '../../assets/data/eere-defaults-california.json';
import greatLakesMidAtlanticEere from '../../assets/data/eere-defaults-great-lakes-mid-atlantic.json';
import lowerMidwestEere from '../../assets/data/eere-defaults-lower-midwest.json';
import northeastEere from '../../assets/data/eere-defaults-northeast.json';
import northwestEere from '../../assets/data/eere-defaults-northwest.json';
import rockyMountainsEere from '../../assets/data/eere-defaults-rocky-mountains.json';
import southeastEere from '../../assets/data/eere-defaults-southeast.json';
import southwestEere from '../../assets/data/eere-defaults-southwest.json';
import texasEere from '../../assets/data/eere-defaults-texas.json';
import upperMidwestEere from '../../assets/data/eere-defaults-upper-midwest.json';

// RDFs
import greatLakesMidAtlanticRdf from '../../assets/data/rdf_great-lakes-mid-atlantic_2015.json';
import californiaRdf from '../../assets/data/rdf_california_2015.json';
// import lowerMidwestRdf from '../../assets/data/rdf_lower-midwest_2015.json';
import northeastRdf from '../../assets/data/rdf_northeast_2015.json';
// import northwestRdf from '../../assets/data/rdf_northwest_2015.json';
// import rockyMountainsRdf from '../../assets/data/rdf_rocky-mountains_2015.json';
// import southeastRdf from '../../assets/data/rdf_southeast_2015.json';
// import southwestRdf from '../../assets/data/rdf_southwest_2015.json';
import texasRdf from '../../assets/data/rdf_texas_2015.json';
import upperMidwestRdf from '../../assets/data/rdf_upper-midwest_2015.json';

const Regions = {
    CALIFORNIA: {
        id: 1,
        slug: 'CA',
        label: 'California',
        defaults: californiaEere,
        rdf: californiaRdf,
    },
    GREAT_LAKES_MID_ATLANTIC: {
        id: 2,
        slug: 'EMW',
        label: 'Great Lakes / Mid-Atlantic',
        defaults: greatLakesMidAtlanticEere,
        rdf: greatLakesMidAtlanticRdf,
    },
    NORTHEAST: {
        id: 3,
        slug: 'NE',
        label: 'Northeast',
        defaults: northeastEere,
        rdf: northeastRdf,
    },
    NORTHWEST: {
        id: 4,
        slug: 'NW',
        label: 'Northwest',
        defaults: northwestEere,
        // rdf: northwestRdf,
        rdf: false,
    },
    ROCKY_MOUNTAINS: {
        id: 5,
        slug: 'RM',
        label: 'Rocky Mountains',
        defaults: rockyMountainsEere,
        // rdf: rockyMountainsRdf,
        rdf: false,
    },
    LOWER_MIDWEST: {
        id: 6,
        slug: 'SC',
        label: 'Lower Midwest',
        defaults: lowerMidwestEere,
        // rdf: lowerMidwestRdf,
        rdf: false,
    },
    SOUTHEAST: {
        id: 7,
        slug: 'SE',
        label: 'Southeast',
        defaults: southeastEere,
        // rdf: southeastRdf,
        rdf: false,
    },
    SOUTHWEST: {
        id: 8,
        slug: 'SW',
        label: 'Southwest',
        defaults: southwestEere,
        // rdf: southwestRdf,
        rdf: false,
    },
    TEXAS: {
        id: 9,
        slug: 'TX',
        label: 'Texas',
        defaults: texasEere,
        rdf: texasRdf,
    },
    UPPER_MIDWEST: {
        id: 10,
        slug: 'WMW',
        label: 'Upper Midwest',
        defaults: upperMidwestEere,
        rdf: upperMidwestRdf,
    },
}

export default Regions;