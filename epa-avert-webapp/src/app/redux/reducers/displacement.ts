// reducers
import { AppThunk } from 'app/redux/index';
// action creators
import { completeStateEmissions } from './stateEmissions';
import { MonthlyChanges, completeMonthlyEmissions } from './monthlyEmissions';
// config
import { RegionId } from 'app/config';

// TODO: move this?
export type StatesAndCounties = {
  [stateId: string]: string[];
};

type Pollutant = 'generation' | 'so2' | 'nox' | 'co2' | 'pm25';

export type PollutantDisplacementData = {
  regionId: RegionId;
  pollutant: Pollutant;
  original: number;
  post: number;
  impact: number;
  monthlyChanges: MonthlyChanges;
  stateChanges: {
    [stateId: string]: number;
  };
};

type DisplacementAction =
  | { type: 'geography/SELECT_REGION' }
  | { type: 'displacement/INCREMENT_PROGRESS' }
  | { type: 'displacement/START_DISPLACEMENT' }
  | { type: 'displacement/COMPLETE_DISPLACEMENT' }
  | { type: 'displacement/RESET_DISPLACEMENT' }
  | { type: 'displacement/REQUEST_DISPLACEMENT_DATA' }
  | {
      type: 'displacement/RECEIVE_DISPLACEMENT_DATA';
      payload: { data: PollutantDisplacementData };
    };

type RegionalDisplacement = {
  generation: PollutantDisplacementData;
  so2: PollutantDisplacementData;
  nox: PollutantDisplacementData;
  co2: PollutantDisplacementData;
  pm25: PollutantDisplacementData;
};

type DisplacementState = {
  status: 'ready' | 'started' | 'complete' | 'error';
  regionalDisplacements: Partial<{ [key in RegionId]: RegionalDisplacement }>;
};

// reducer
const initialState: DisplacementState = {
  status: 'ready',
  regionalDisplacements: {},
};

export default function reducer(
  state: DisplacementState = initialState,
  action: DisplacementAction,
): DisplacementState {
  switch (action.type) {
    case 'geography/SELECT_REGION':
    case 'displacement/RESET_DISPLACEMENT':
      return initialState;

    case 'displacement/START_DISPLACEMENT':
      return {
        ...state,
        status: 'started',
      };

    case 'displacement/COMPLETE_DISPLACEMENT':
      return {
        ...state,
        status: 'complete',
      };

    case 'displacement/REQUEST_DISPLACEMENT_DATA':
    case 'displacement/INCREMENT_PROGRESS':
      return state;

    case 'displacement/RECEIVE_DISPLACEMENT_DATA':
      return {
        ...state,
        regionalDisplacements: {
          ...state.regionalDisplacements,
          [action.payload.data.regionId]: {
            ...state.regionalDisplacements[action.payload.data.regionId],
            [action.payload.data.pollutant]: {
              ...action.payload.data,
            },
          },
        },
      };

    default:
      return state;
  }
}

// action creators
export function incrementProgress(): DisplacementAction {
  return { type: 'displacement/INCREMENT_PROGRESS' };
}

function fetchDisplacementData(pollutant: Pollutant): AppThunk {
  return (dispatch, getState) => {
    const { api, eere } = getState();

    dispatch({ type: 'displacement/REQUEST_DISPLACEMENT_DATA' });

    // build up displacement requests for selected regions
    const displacementRequests: Promise<Response>[] = [];

    for (const regionId in eere.regionalProfiles) {
      const regionalProfile = eere.regionalProfiles[regionId as RegionId];

      displacementRequests.push(
        fetch(`${api.baseUrl}/api/v1/${pollutant}`, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            region: regionId,
            hourlyLoad: regionalProfile?.hourlyEere,
          }),
        }),
      );
    }

    // request all displacement data for selected regions in parallel
    Promise.all(displacementRequests)
      .then((responses) => {
        const displacementData = responses.map((response) => {
          return response.json().then((data: PollutantDisplacementData) => {
            dispatch({
              type: 'displacement/RECEIVE_DISPLACEMENT_DATA',
              payload: { data },
            });
            return data;
          });
        });

        return Promise.all(displacementData);
      })
      .then((displacement) => {
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
    // NOTE: if in the futre we ever fetch data for more pollutants than the 5
    // below (generation, so2, nox, co2, pm25), the value of the `loadingSteps`
    // state stored in `redux/reducers/panel.ts` will need to be updated to be
    // the total number of pollutant displacements + 1
    dispatch(fetchDisplacementData('generation'));
    dispatch(fetchDisplacementData('so2'));
    dispatch(fetchDisplacementData('nox'));
    dispatch(fetchDisplacementData('co2'));
    dispatch(fetchDisplacementData('pm25'));

    dispatch(receiveDisplacement());
  };
}

function receiveDisplacement(): AppThunk {
  return (dispatch, getState) => {
    const { panel, displacement } = getState();

    // recursively call function if data is still fetching
    if (panel.loadingProgress !== panel.loadingSteps) {
      return setTimeout(() => dispatch(receiveDisplacement()), 1000);
    }

    dispatch({ type: 'displacement/COMPLETE_DISPLACEMENT' });
    dispatch(completeStateEmissions()); // TODO: move this?
    dispatch(completeMonthlyEmissions()); // TODO: move this?
  };
}

export function resetDisplacement(): DisplacementAction {
  return { type: 'displacement/RESET_DISPLACEMENT' };
}
