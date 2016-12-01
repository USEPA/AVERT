import greatLakesMidAtlantic from '../../../assets/data/rdf_great-lakes-mid-atlantic_2015.json';
import california from '../../../assets/data/rdf_california_2015.json';
// import lowerMidwest from '../../../assets/data/rdf_lower-midwest_2015.json';
import northeast from '../../../assets/data/rdf_northeast_2015.json';
// import northwest from '../../../assets/data/rdf_northwest_2015.json';
// import rockyMountains from '../../../assets/data/rdf_rocky-mountains_2015.json';
// import southeast from '../../../assets/data/rdf_southeast_2015.json';
// import southwest from '../../../assets/data/rdf_southwest_2015.json';
import texas from '../../../assets/data/rdf_texas_2015.json';
import upperMidwest from '../../../assets/data/rdf_upper-midwest_2015.json';



const RdfEnum = {
    'EMW': greatLakesMidAtlantic,
    'CA': california,
    // 'SC': lowerMidwest,
    'NE': northeast,
    // 'NW': northwest,
    // 'RM': rockyMountains,
    // 'SE': southeast,
    // 'AZNM': southwest,
    'TX': texas,
    'WMW': upperMidwest,
}

export default RdfEnum;