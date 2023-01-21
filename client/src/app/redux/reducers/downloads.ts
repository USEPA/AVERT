import type { AppThunk } from 'app/redux/index';
import type { EmissionsChanges } from 'app/calculations/emissions';

type CountyData = {};

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
    const { emissionsChanges } = results;

    const { countyData, cobraData } = formatDownloadData(emissionsChanges.data);

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
 * TODO
 */
function formatDownloadData(egus: EmissionsChanges) {
  if (Object.keys(egus).length === 0) {
    return {
      countyData: [] as CountyData[],
      cobraData: [] as CobraData[],
    };
  }

  // TODO
  console.log(egus);
  const countyData = [] as CountyData[];
  const cobraData = [] as CobraData[];

  return { countyData, cobraData };
}
