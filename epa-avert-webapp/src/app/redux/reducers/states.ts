// config
import { StateId, State, states } from 'app/config';

// TODO: start copying over here...
type StatesAction = {
  type: 'geography/SELECT_STATE';
  payload: { stateId: StateId };
};

type StateState = State & {
  selected: boolean;
};

type StatesState = {
  [key in StateId]: StateState;
};

// augment states data (from config) with additonal 'selected' field for each state
const updatedStates: any = { ...states };
for (const key in updatedStates) {
  updatedStates[key].selected = false;
}

// reducer
const initialState: StatesState = updatedStates;

export default function reducer(
  state: StatesState = initialState,
  action: StatesAction,
): StatesState {
  switch (action.type) {
    case 'geography/SELECT_STATE':
      const updatedState = { ...state };
      for (const key in state) {
        const stateId = key as StateId;
        const stateIsSelected = action.payload.stateId === stateId;
        updatedState[stateId].selected = stateIsSelected;
      }
      return updatedState;

    default:
      return state;
  }
}

// action creators
export function selectState(stateId: string) {
  return {
    type: 'geography/SELECT_STATE',
    payload: { stateId },
  };
}
