import type { AppThunk } from 'app/redux/index';
import type { EmissionsChanges } from 'app/calculations/emissions';
import type { EmissionsMonthlyData } from 'app/redux/reducers/results';
import type { RegionId } from 'app/config';
import { regions as regionsConfig } from 'app/config';

type EmissionsData = EmissionsChanges[string]['data'];
type EmissionsFlagsField = EmissionsChanges[string]['emissionsFlags'][number];
type MonthlyData = EmissionsData[keyof EmissionsData];

type Pollutant = 'SO2' | 'NOX' | 'CO2' | 'PM25' | 'VOCS' | 'NH3';

type CountyData = {
  Pollutant: Pollutant;
  'Aggregation level': string;
  State: string | null;
  County: string | null;
  'Unit of measure': 'percent' | 'emissions (tons)' | 'emissions (pounds)';
  'Power Sector: January': number | null;
  'Power Sector: February': number | null;
  'Power Sector: March': number | null;
  'Power Sector: April': number | null;
  'Power Sector: May': number | null;
  'Power Sector: June': number | null;
  'Power Sector: July': number | null;
  'Power Sector: August': number | null;
  'Power Sector: September': number | null;
  'Power Sector: October': number | null;
  'Power Sector: November': number | null;
  'Power Sector: December': number | null;
};

type CobraData = {
  FIPS: string;
  STATE: string;
  COUNTY: string;
  TIER1NAME: string;
  NOx_REDUCTIONS_TONS: number;
  SO2_REDUCTIONS_TONS: number;
  PM25_REDUCTIONS_TONS: number;
  VOCS_REDUCTIONS_TONS: number;
  NH3_REDUCTIONS_TONS: number;
};

type Action =
  | {
      type: 'downloads/SET_DOWNLOAD_DATA';
      payload: {
        countyData: CountyData[];
        cobraData: CobraData[];
      };
    }
  | { type: 'downloads/TODO' };

type State = {
  countyData: CountyData[];
  cobraData: CobraData[];
};

const initialState: State = {
  countyData: [],
  cobraData: [],
};

export default function reducer(
  state: State = initialState,
  action: Action,
): State {
  switch (action.type) {
    case 'downloads/SET_DOWNLOAD_DATA': {
      const { countyData, cobraData } = action.payload;

      return {
        ...state,
        countyData: countyData,
        cobraData: cobraData,
      };
    }

    default: {
      return state;
    }
  }
}

export function setDownloadData(): AppThunk {
  return (dispatch, getState) => {
    const { results } = getState();
    const { emissionsMonthlyData, egusNeedingEmissionsReplacement } = results;

    const countyData = formatCountyDownloadData({
      emissionsMonthlyData,
      egusNeedingEmissionsReplacement,
    });

    const cobraData = [] as CountyData[]; // TODO

    dispatch({
      type: 'downloads/SET_DOWNLOAD_DATA',
      payload: {
        countyData,
        cobraData,
      },
    });
  };
}

/**
 * Formats monthly emissions data in a format that supports downloading the
 * county level data as a CSV file.
 */
function formatCountyDownloadData(options: {
  emissionsMonthlyData: EmissionsMonthlyData;
  egusNeedingEmissionsReplacement: EmissionsChanges;
}) {
  const { emissionsMonthlyData, egusNeedingEmissionsReplacement } = options;
  const { total, regions, states, counties } = emissionsMonthlyData;

  const result: CountyData[] = [];

  if (Object.keys(total).length === 0) return result;

  const pollutantsRows = createOrderedPollutantsRows();

  const egusNeedingReplacement = Object.values(egusNeedingEmissionsReplacement);

  /**
   * Conditionally add all affected regions data
   * (will only occur a state was selected that's part of multiple regions)
   */
  if (Object.keys(regions).length > 1) {
    const totalRows = [...pollutantsRows].map((row) => {
      const { pollutant, unit } = row;

      const pollutantNeedsReplacement = egusNeedingReplacement.some((egu) => {
        return egu.emissionsFlags.includes(pollutant as EmissionsFlagsField);
      });

      const monthlyData = (total as EmissionsData)[pollutant];
      const monthlyFields = createMonthlyFields({
        pollutantNeedsReplacement,
        monthlyData,
        unit,
      });

      return {
        Pollutant: pollutant.toUpperCase() as Pollutant,
        'Aggregation level': 'All Affected Regions',
        State: null,
        County: null,
        'Unit of measure': unit,
        ...monthlyFields,
      };
    });

    result.push(...totalRows);
  }

  /**
   * Add regions data
   */
  Object.entries(regions).forEach(([regionId, regionData]) => {
    const regionsRows = [...pollutantsRows].map((row) => {
      const { pollutant, unit } = row;

      const pollutantNeedsReplacement = egusNeedingReplacement.some((egu) => {
        return (
          egu.emissionsFlags.includes(pollutant as EmissionsFlagsField) &&
          egu.region === regionId
        );
      });

      const monthlyData = regionData[pollutant];
      const monthlyFields = createMonthlyFields({
        pollutantNeedsReplacement,
        monthlyData,
        unit,
      });

      return {
        Pollutant: pollutant.toUpperCase() as Pollutant,
        'Aggregation level': `${regionsConfig[regionId as RegionId].name} Region`, // prettier-ignore
        State: null,
        County: null,
        'Unit of measure': unit,
        ...monthlyFields,
      };
    });

    result.push(...regionsRows);
  });

  /**
   * Add states data
   */
  Object.entries(states).forEach(([stateId, stateData]) => {
    const statesRows = [...pollutantsRows].map((row) => {
      const { pollutant, unit } = row;

      const pollutantNeedsReplacement = egusNeedingReplacement.some((egu) => {
        return (
          egu.emissionsFlags.includes(pollutant as EmissionsFlagsField) &&
          egu.state === stateId
        );
      });

      const monthlyData = stateData[pollutant];
      const monthlyFields = createMonthlyFields({
        pollutantNeedsReplacement,
        monthlyData,
        unit,
      });

      return {
        Pollutant: pollutant.toUpperCase() as Pollutant,
        'Aggregation level': 'State',
        State: stateId,
        County: null,
        'Unit of measure': unit,
        ...monthlyFields,
      };
    });

    result.push(...statesRows);
  });

  /**
   * Add counties data
   */
  Object.entries(counties).forEach(([stateId, stateData]) => {
    Object.entries(stateData).forEach(([countyName, countyData]) => {
      const countiesRows = [...pollutantsRows].map((row) => {
        const { pollutant, unit } = row;

        const pollutantNeedsReplacement = egusNeedingReplacement.some((egu) => {
          return (
            egu.emissionsFlags.includes(pollutant as EmissionsFlagsField) &&
            egu.state === stateId &&
            egu.county === countyName
          );
        });

        const monthlyData = countyData[pollutant];
        const monthlyFields = createMonthlyFields({
          pollutantNeedsReplacement,
          monthlyData,
          unit,
        });

        return {
          Pollutant: pollutant.toUpperCase() as Pollutant,
          'Aggregation level': 'County',
          State: stateId,
          County: countyName.replace(/city/, '(City)'), // format 'city'
          'Unit of measure': unit,
          ...monthlyFields,
        };
      });

      result.push(...countiesRows);
    });
  });

  return result;
}

/**
 * Creates an array of pollutants (in a specific order) for storing emissions
 * data, followed by those same pollutants for storing percent data.
 */
function createOrderedPollutantsRows() {
  const pollutants = ['so2', 'nox', 'co2', 'pm25', 'vocs', 'nh3'] as const;

  const emissionsRows = pollutants.map((pollutant) => {
    return {
      pollutant,
      unit: `emissions (${pollutant === 'co2' ? 'tons' : 'pounds'})` as const,
    };
  });

  const percentRows = pollutants.map((pollutant) => {
    return {
      pollutant,
      unit: 'percent' as const,
    };
  });

  return [...emissionsRows, ...percentRows];
}

/**
 * Creates monthly fields from monthly data and unit.
 */
function createMonthlyFields(options: {
  pollutantNeedsReplacement: boolean;
  monthlyData: MonthlyData;
  unit: 'percent' | 'emissions (tons)' | 'emissions (pounds)';
}) {
  const { pollutantNeedsReplacement, monthlyData, unit } = options;

  const result = Object.entries(monthlyData).reduce((object, [key, data]) => {
    const month = Number(key);
    const { original, postEere } = data;

    const emissionsChange = postEere - original;
    const percentChange = (emissionsChange / original) * 100 || 0;

    object[month] =
      unit === 'percent'
        ? pollutantNeedsReplacement
          ? null
          : percentChange
        : emissionsChange;

    return object;
  }, {} as { [month: number]: number | null });

  return {
    'Power Sector: January': result[1],
    'Power Sector: February': result[2],
    'Power Sector: March': result[3],
    'Power Sector: April': result[4],
    'Power Sector: May': result[5],
    'Power Sector: June': result[6],
    'Power Sector: July': result[7],
    'Power Sector: August': result[8],
    'Power Sector: September': result[9],
    'Power Sector: October': result[10],
    'Power Sector: November': result[11],
    'Power Sector: December': result[12],
  };
}
