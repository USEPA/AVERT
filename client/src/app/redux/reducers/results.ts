import type { AppThunk } from 'app/redux/index';
import { setStatesAndCounties } from 'app/redux/reducers/monthlyEmissions';
import type { EmissionsChanges } from 'app/calculations/emissions';
import type { RegionId } from 'app/config';
import { regions } from 'app/config';

export type EmissionsReplacements = ReturnType<typeof setEmissionsReplacements>;

type Action =
  | { type: 'results/FETCH_EMISSIONS_CHANGES_REQUEST' }
  | {
      type: 'results/FETCH_EMISSIONS_CHANGES_SUCCESS';
      payload: { emissionsChanges: EmissionsChanges };
    }
  | { type: 'results/FETCH_EMISSIONS_CHANGES_FAILURE' }
  | {
      type: 'results/SET_EGUS_NEEDING_EMISSIONS_REPLACEMENT';
      payload: { egusNeedingEmissionsReplacement: EmissionsChanges };
    }
  | {
      type: 'results/SET_EMISSIONS_REPLACEMENTS';
      payload: { emissionsReplacements: EmissionsReplacements };
    };

type State = {
  emissionsChanges:
    | { status: 'idle'; data: {} }
    | { status: 'pending'; data: {} }
    | { status: 'success'; data: EmissionsChanges }
    | { status: 'failure'; data: {} };
  egusNeedingEmissionsReplacement: EmissionsChanges | {};
  emissionsReplacements: EmissionsReplacements | {};
};

const initialState: State = {
  emissionsChanges: {
    status: 'idle',
    data: {},
  },
  egusNeedingEmissionsReplacement: {},
  emissionsReplacements: {},
};

export default function reducer(
  state: State = initialState,
  action: Action,
): State {
  switch (action.type) {
    case 'results/FETCH_EMISSIONS_CHANGES_REQUEST': {
      return {
        ...state,
        emissionsChanges: {
          status: 'pending',
          data: {},
        },
        egusNeedingEmissionsReplacement: {},
        emissionsReplacements: {},
      };
    }

    case 'results/FETCH_EMISSIONS_CHANGES_SUCCESS': {
      const { emissionsChanges } = action.payload;
      return {
        ...state,
        emissionsChanges: {
          status: 'success',
          data: emissionsChanges,
        },
      };
    }

    case 'results/FETCH_EMISSIONS_CHANGES_FAILURE': {
      return {
        ...state,
        emissionsChanges: {
          status: 'failure',
          data: {},
        },
      };
    }

    case 'results/SET_EGUS_NEEDING_EMISSIONS_REPLACEMENT': {
      const { egusNeedingEmissionsReplacement } = action.payload;
      return {
        ...state,
        egusNeedingEmissionsReplacement,
      };
    }

    case 'results/SET_EMISSIONS_REPLACEMENTS': {
      const { emissionsReplacements } = action.payload;
      return {
        ...state,
        emissionsReplacements,
      };
    }

    default: {
      return state;
    }
  }
}

/**
 * Called every time the "Get Results" button is clicked on the "Set EE/RE
 * Impacts" page
 */
export function calculateEmissionsChanges(): AppThunk {
  return (dispatch, getState) => {
    const { api, eere } = getState();
    const { regionalProfiles } = eere;

    dispatch({ type: 'results/FETCH_EMISSIONS_CHANGES_REQUEST' });

    // build up requests for selected regions
    const requests: Promise<Response>[] = [];

    for (const regionId in regionalProfiles) {
      const hourlyEere = regionalProfiles[regionId as RegionId]?.hourlyEere;

      if (hourlyEere) {
        requests.push(
          fetch(`${api.baseUrl}/api/v1/emissions`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ regionId, hourlyEere }),
          }),
        );
      }
    }

    // request all data for selected regions in parallel
    Promise.all(requests)
      .then((responses) => Promise.all(responses.map((res) => res.json())))
      .then((regionsData: EmissionsChanges[]) => {
        // flatten array of regionData objects into a single object
        const emissionsChanges = regionsData.reduce((result, regionData) => {
          return { ...result, ...regionData };
        }, {});

        dispatch({
          type: 'results/FETCH_EMISSIONS_CHANGES_SUCCESS',
          payload: { emissionsChanges },
        });

        const egusNeedingEmissionsReplacement =
          setEgusNeedingEmissionsReplacement(emissionsChanges);

        const emissionsReplacements = setEmissionsReplacements(
          egusNeedingEmissionsReplacement,
        );

        dispatch({
          type: 'results/SET_EGUS_NEEDING_EMISSIONS_REPLACEMENT',
          payload: { egusNeedingEmissionsReplacement },
        });

        dispatch({
          type: 'results/SET_EMISSIONS_REPLACEMENTS',
          payload: { emissionsReplacements },
        });

        dispatch(setStatesAndCounties());
      })
      .catch((err) => {
        dispatch({ type: 'results/FETCH_EMISSIONS_CHANGES_FAILURE' });
      });
  };
}

/**
 * An EGU is marked as needing emissions "replacement" if it's `emissionsFlag`
 * array isn't empty. In calculating the emissions changes (via the server app's
 * `calculateEmissionsChanges()` function), a pollutant that needs replacement
 * will have the `infreq_emissions_flag` property's value of 1 for the given
 * given in the region's RDF.
 */
function setEgusNeedingEmissionsReplacement(egus: EmissionsChanges) {
  if (Object.keys(egus).length === 0) return {};

  const result = Object.entries(egus).reduce((object, [eguId, eguData]) => {
    if (eguData.emissionsFlags.length !== 0) {
      object[eguId] = eguData;
    }

    return object;
  }, {} as EmissionsChanges);

  return result;
}

/**
 * Build up emissions replacement values for each pollutant from provided EGUs
 * needing emissions replacement, and the region's actual emissions value for
 * that particular pollutant.
 */
function setEmissionsReplacements(egus: EmissionsChanges) {
  type EmissionsFlagsField = EmissionsChanges[string]['emissionsFlags'][number];

  if (Object.keys(egus).length === 0) {
    return {} as { [pollutant in EmissionsFlagsField]: number };
  }

  const replacementsByRegion = Object.values(egus).reduce(
    (object, egu) => {
      const regionId = egu.region as RegionId;

      egu.emissionsFlags.forEach((pollutant) => {
        object[pollutant] ??= {};
        object[pollutant][regionId] = regions[regionId].actualEmissions[pollutant]; // prettier-ignore
      });

      return object;
    },
    {} as {
      [pollutant in EmissionsFlagsField]: Partial<{
        [regionId in RegionId]: number;
      }>;
    },
  );

  const result = Object.entries(replacementsByRegion).reduce(
    (object, [key, regionData]) => {
      const pollutant = key as EmissionsFlagsField;
      object[pollutant] = Object.values(regionData).reduce((a, b) => (a += b));
      return object;
    },
    {} as { [pollutant in EmissionsFlagsField]: number },
  );

  return result;
}
