// @flow

type Region = {|
  id: number,
  slug: string,
  label: string,
  original_slug: string,
  grid_loss: number,
|};

type RegionsMap = {|
  CALIFORNIA: Region,
  GREAT_LAKES_MID_ATLANTIC: Region,
  NORTHEAST: Region,
  NORTHWEST: Region,
  ROCKY_MOUNTAINS: Region,
  LOWER_MIDWEST: Region,
  SOUTHEAST: Region,
  SOUTHWEST: Region,
  TEXAS: Region,
  UPPER_MIDWEST: Region,
|};

const Regions: RegionsMap = {
  CALIFORNIA: {
    id: 1,
    slug: 'CA',
    label: 'California',
    original_slug: 'CA',
    grid_loss: 8.54,
  },
  GREAT_LAKES_MID_ATLANTIC: {
    id: 2,
    slug: 'EMW',
    label: 'Great Lakes / Mid-Atlantic',
    original_slug: 'EMW',
    grid_loss: 6.74,
  },
  NORTHEAST: {
    id: 3,
    slug: 'NE',
    label: 'Northeast',
    original_slug: 'NE',
    grid_loss: 6.74,
  },
  NORTHWEST: {
    id: 4,
    slug: 'NW',
    label: 'Northwest',
    original_slug: 'NW',
    grid_loss: 8.54,
  },
  ROCKY_MOUNTAINS: {
    id: 5,
    slug: 'RM',
    label: 'Rocky Mountains',
    original_slug: 'RM',
    grid_loss: 8.54,
  },
  LOWER_MIDWEST: {
    id: 6,
    slug: 'SC',
    label: 'Lower Midwest',
    original_slug: 'SC',
    grid_loss: 6.74,
  },
  SOUTHEAST: {
    id: 7,
    slug: 'SE',
    label: 'Southeast',
    original_slug: 'SE',
    grid_loss: 6.74,
  },
  SOUTHWEST: {
    id: 8,
    slug: 'SW',
    label: 'Southwest',
    original_slug: 'AZNM',
    grid_loss: 8.54,
  },
  TEXAS: {
    id: 9,
    slug: 'TX',
    label: 'Texas',
    original_slug: 'TX',
    grid_loss: 4.83,
  },
  UPPER_MIDWEST: {
    id: 10,
    slug: 'WMW',
    label: 'Upper Midwest',
    original_slug: 'WMW',
    grid_loss: 6.74,
  },
};

export default Regions;
