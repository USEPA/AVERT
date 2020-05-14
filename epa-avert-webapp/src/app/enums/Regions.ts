type Region = {
  number: number;
  slug: string;
  label: string;
  grid_loss: number;
};

export type RegionKeys =
  | 'CALIFORNIA'
  | 'GREAT_LAKES_MID_ATLANTIC'
  | 'NORTHEAST'
  | 'NORTHWEST'
  | 'ROCKY_MOUNTAINS'
  | 'LOWER_MIDWEST'
  | 'SOUTHEAST'
  | 'SOUTHWEST'
  | 'TEXAS'
  | 'UPPER_MIDWEST';

const Regions: { [key in RegionKeys]: Region } = {
  CALIFORNIA: {
    number: 1,
    slug: 'CA',
    label: 'California',
    grid_loss: 8.54,
  },
  GREAT_LAKES_MID_ATLANTIC: {
    number: 2,
    slug: 'EMW',
    label: 'Great Lakes / Mid-Atlantic',
    grid_loss: 6.74,
  },
  NORTHEAST: {
    number: 3,
    slug: 'NE',
    label: 'Northeast',
    grid_loss: 6.74,
  },
  NORTHWEST: {
    number: 4,
    slug: 'NW',
    label: 'Northwest',
    grid_loss: 8.54,
  },
  ROCKY_MOUNTAINS: {
    number: 5,
    slug: 'RM',
    label: 'Rocky Mountains',
    grid_loss: 8.54,
  },
  LOWER_MIDWEST: {
    number: 6,
    slug: 'SC',
    label: 'Lower Midwest',
    grid_loss: 6.74,
  },
  SOUTHEAST: {
    number: 7,
    slug: 'SE',
    label: 'Southeast',
    grid_loss: 6.74,
  },
  SOUTHWEST: {
    number: 8,
    slug: 'SW', // 'AZNM'
    label: 'Southwest',
    grid_loss: 8.54,
  },
  TEXAS: {
    number: 9,
    slug: 'TX',
    label: 'Texas',
    grid_loss: 4.83,
  },
  UPPER_MIDWEST: {
    number: 10,
    slug: 'WMW',
    label: 'Upper Midwest',
    grid_loss: 6.74,
  },
};

export default Regions;
