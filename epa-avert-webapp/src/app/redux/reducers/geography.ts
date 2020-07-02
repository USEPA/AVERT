type Geography = 'regions' | 'states';

type GeographyAction = {
  type: 'geography/SELECT_GEOGRAPHY';
  payload: { focus: Geography };
};

type GeographyState = {
  focus: Geography;
};

// reducer
const initialState: GeographyState = {
  focus: 'regions',
};

export default function reducer(
  state: GeographyState = initialState,
  action: GeographyAction,
): GeographyState {
  switch (action.type) {
    case 'geography/SELECT_GEOGRAPHY':
      return {
        ...state,
        focus: action.payload.focus,
      };

    default:
      return state;
  }
}

// action creators
export function selectGeography(focus: Geography) {
  return {
    type: 'geography/SELECT_GEOGRAPHY',
    payload: { focus },
  };
}
