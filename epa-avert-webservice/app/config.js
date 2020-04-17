const regions = {
  CA: {
    label: 'California',
    defaults: 'app/data/eere-defaults-california.json',
    rdf: 'app/data/rdf_CA_2018.json',
  },
  EMW: {
    label: 'Great Lakes / Mid-Atlantic',
    defaults: 'app/data/eere-defaults-great-lakes-mid-atlantic.json',
    rdf: 'app/data/rdf_EMW_2018.json',
  },
  NE: {
    label: 'Northeast',
    defaults: 'app/data/eere-defaults-northeast.json',
    rdf: 'app/data/rdf_NE_2018.json',
  },
  NW: {
    label: 'Northwest',
    defaults: 'app/data/eere-defaults-northwest.json',
    rdf: 'app/data/rdf_NW_2018.json',
  },
  RM: {
    label: 'Rocky Mountains',
    defaults: 'app/data/eere-defaults-rocky-mountains.json',
    rdf: 'app/data/rdf_RM_2018.json',
  },
  SC: {
    label: 'Lower Midwest',
    defaults: 'app/data/eere-defaults-lower-midwest.json',
    rdf: 'app/data/rdf_SC_2018.json',
  },
  SE: {
    label: 'Southeast',
    defaults: 'app/data/eere-defaults-southeast.json',
    rdf: 'app/data/rdf_SE_2018.json',
  },
  SW: {
    label: 'Southwest',
    defaults: 'app/data/eere-defaults-southwest.json',
    rdf: 'app/data/rdf_AZNM_2018.json',
  },
  TX: {
    label: 'Texas',
    defaults: 'app/data/eere-defaults-texas.json',
    rdf: 'app/data/rdf_TX_2018.json',
  },
  WMW: {
    label: 'Upper Midwest',
    defaults: 'app/data/eere-defaults-upper-midwest.json',
    rdf: 'app/data/rdf_WMW_2018.json',
  },
};

module.exports = { regions };
