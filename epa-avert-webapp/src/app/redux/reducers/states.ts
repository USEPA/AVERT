type StatesAction = {
  type: 'states/SELECT_STATE';
  payload: { stateId: string };
};

type StatesState = {
  stateId: string;
};

// reducer
const initialState: StatesState = {
  stateId: '',
};

export default function reducer(
  state: StatesState = initialState,
  action: StatesAction,
): StatesState {
  switch (action.type) {
    case 'states/SELECT_STATE':
      return {
        ...state,
        stateId: action.payload.stateId,
      };

    default:
      return state;
  }
}

// action creators
export function selectState(stateId: string) {
  return {
    type: 'states/SELECT_STATE',
    payload: { stateId },
  };
}
