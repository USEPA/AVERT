import { AppThunk } from 'app/redux/index';
import type { Unit } from 'app/redux/reducers/monthlyEmissions';
import { Pollutant, RegionId } from 'app/config';

type PollutantName = 'generation' | Pollutant;

export type MonthlyDisplacement = {
  [month: number]: {
    original: number;
    postEere: number;
  };
};

type PollutantDisplacement = {
  regionId: RegionId;
  originalTotal: number;
  postEereTotal: number;
  regionalData: MonthlyDisplacement;
  stateData: {
    [stateId: string]: MonthlyDisplacement;
  };
  countyData: {
    [stateId: string]: {
      [countyName: string]: MonthlyDisplacement;
    };
  };
};

type PollutantsDisplacements = Partial<{
  [key in PollutantName]: PollutantDisplacement;
}>;

type RegionalDisplacement = {
  [key in PollutantName]: PollutantDisplacement;
};

type RegionalDisplacements = Partial<{
  [key in RegionId]: RegionalDisplacement;
}>;

type Action =
  | { type: 'displacement/RESET_DISPLACEMENT' }
  | { type: 'displacement/INCREMENT_PROGRESS' }
  | { type: 'displacement/START_DISPLACEMENT' }
  | { type: 'displacement/COMPLETE_DISPLACEMENT' }
  | { type: 'displacement/REQUEST_DISPLACEMENT_DATA' }
  | {
      type: 'displacement/RECEIVE_DISPLACEMENT_DATA';
      payload: { data: PollutantsDisplacements };
    };

type State = {
  status: 'ready' | 'started' | 'complete' | 'error';
  regionalDisplacements: RegionalDisplacements;
};

// reducer
const initialState: State = {
  status: 'ready',
  regionalDisplacements: {},
};

export default function reducer(
  state: State = initialState,
  action: Action,
): State {
  switch (action.type) {
    case 'displacement/RESET_DISPLACEMENT': {
      // initial state
      return {
        status: 'ready',
        regionalDisplacements: {},
      };
    }

    case 'displacement/INCREMENT_PROGRESS': {
      return state;
    }

    case 'displacement/START_DISPLACEMENT': {
      return {
        ...state,
        status: 'started',
      };
    }

    case 'displacement/COMPLETE_DISPLACEMENT': {
      return {
        ...state,
        status: 'complete',
      };
    }

    case 'displacement/REQUEST_DISPLACEMENT_DATA': {
      return state;
    }

    case 'displacement/RECEIVE_DISPLACEMENT_DATA': {
      const { data } = action.payload;

      // each data object could contain multiple pollutants as keys:
      // - if `fetchDisplacementData('generation')` is called, there will
      //   only be one key for 'generation' (same for 'so2', 'nox', and 'co2').
      // - if `fetchDisplacementData('nei')` is called, there will be a key
      //   for 'pm25', 'vocs', and 'nh3'
      let updatedState = { ...state };
      for (const item in data) {
        const pollutant = item as PollutantName;
        const pollutantDisplacement = data[pollutant];
        if (pollutantDisplacement) {
          const { regionId } = pollutantDisplacement;
          updatedState = {
            ...updatedState,
            regionalDisplacements: {
              ...updatedState.regionalDisplacements,
              [regionId]: {
                ...updatedState.regionalDisplacements[regionId],
                [pollutant]: {
                  ...pollutantDisplacement,
                },
              },
            },
          };
        }
      }

      return updatedState;
    }

    default: {
      return state;
    }
  }
}

// action creators
export function incrementProgress(): Action {
  return { type: 'displacement/INCREMENT_PROGRESS' };
}

function fetchDisplacementData(
  metric: 'generation' | 'so2' | 'nox' | 'co2' | 'nei',
): AppThunk {
  return (dispatch, getState) => {
    const { api, eere } = getState();

    dispatch({ type: 'displacement/REQUEST_DISPLACEMENT_DATA' });

    // build up displacement requests for selected regions
    const displacementRequests: Promise<Response>[] = [];

    for (const regionId in eere.regionalProfiles) {
      const regionalProfile = eere.regionalProfiles[regionId as RegionId];

      displacementRequests.push(
        fetch(`${api.baseUrl}/api/v1/displacement/${metric}`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            region: regionId,
            eereLoad: regionalProfile?.hourlyEere,
          }),
        }),
      );
    }

    // request all displacement data for selected regions in parallel
    Promise.all(displacementRequests).then((responses) => {
      responses.forEach((response) => {
        response.json().then((data: PollutantsDisplacements) => {
          dispatch({
            type: 'displacement/RECEIVE_DISPLACEMENT_DATA',
            payload: { data },
          });
        });
      });

      dispatch(incrementProgress());
    });
  };
}

export function calculateDisplacement(): AppThunk {
  return (dispatch) => {
    dispatch({ type: 'displacement/START_DISPLACEMENT' });
    // whenever we call `incrementProgress()` the progress bar in
    // `components/Panels.tsx` is incremented. we'll initially increment it
    // before fetching any displacement data to give the user a visual que
    // something is happening, and then increment it after each set of
    // displacement data is returned inside the `fetchDisplacementData()`
    // function.
    dispatch(incrementProgress());
    // NOTE: if in the futre we ever fetch data for more metrics than the
    // 5 below (generation, so2, nox, co2, nei – which is used to calculate
    // PM2.5, VOCs, and NH3), the value of the `loadingSteps` state stored
    // in `redux/reducers/panel.ts` will need to be updated to be the total
    // number of metric displacement fetches + 1
    dispatch(fetchDisplacementData('generation'));
    dispatch(fetchDisplacementData('so2'));
    dispatch(fetchDisplacementData('nox'));
    dispatch(fetchDisplacementData('co2'));
    dispatch(fetchDisplacementData('nei'));

    dispatch(receiveDisplacement());
  };
}

function receiveDisplacement(): AppThunk {
  return (dispatch, getState) => {
    const { panel } = getState();

    // recursively call function if data is still fetching
    if (panel.loadingProgress !== panel.loadingSteps) {
      return setTimeout(() => dispatch(receiveDisplacement()), 1_000);
    }

    dispatch({ type: 'displacement/COMPLETE_DISPLACEMENT' });
  };
}

export function resetDisplacement(): Action {
  return { type: 'displacement/RESET_DISPLACEMENT' };
}

export function calculateMonthlyData(data: MonthlyDisplacement, unit: Unit) {
  const monthlyEmissionsChanges: number[] = [];
  const monthlyPercentageChanges: number[] = [];

  for (const dataKey in data) {
    const month = Number(dataKey);
    const { original, postEere } = data[month];
    const emissionsChange = postEere - original;
    const percentChange = (emissionsChange / original) * 100 || 0;
    monthlyEmissionsChanges.push(emissionsChange);
    monthlyPercentageChanges.push(percentChange);
  }

  return unit === 'emissions'
    ? monthlyEmissionsChanges
    : monthlyPercentageChanges;
}
