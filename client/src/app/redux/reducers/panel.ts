import { ReactNode } from "react";

type Action =
  | {
      type: "panel/CHANGE_ACTIVE_STEP";
      payload: { stepNumber: number };
    }
  | {
      type: "panel/DISPLAY_MODAL_DIALOG";
      payload: { description: ReactNode };
    }
  | { type: "panel/RESET_MODAL_DIALOG" }
  | { type: "geography/REQUEST_SELECTED_REGIONS_DATA" }
  | { type: "geography/RECEIVE_SELECTED_REGIONS_DATA" }
  | { type: "impacts/START_HOURLY_ENERGY_PROFILE_CALCULATIONS" }
  | { type: "impacts/COMPLETE_HOURLY_ENERGY_PROFILE_CALCULATIONS" }
  | { type: "results/FETCH_EMISSIONS_CHANGES_REQUEST" }
  | { type: "results/FETCH_EMISSIONS_CHANGES_SUCCESS" };

type State = {
  activeStep: number;
  loading: boolean;
  modalDialog: {
    displayed: boolean;
    description: ReactNode;
  };
};

const initialState: State = {
  activeStep: 1,
  loading: false,
  modalDialog: {
    displayed: false,
    description: null,
  },
};

export default function reducer(
  state: State = initialState,
  action: Action,
): State {
  switch (action.type) {
    case "panel/CHANGE_ACTIVE_STEP": {
      const { stepNumber } = action.payload;

      return {
        ...state,
        activeStep: stepNumber,
      };
    }

    case "panel/DISPLAY_MODAL_DIALOG": {
      const { description } = action.payload;

      return {
        ...state,
        modalDialog: {
          displayed: true,
          description,
        },
      };
    }

    case "panel/RESET_MODAL_DIALOG": {
      return {
        ...state,
        modalDialog: {
          displayed: false,
          description: null,
        },
      };
    }

    case "geography/REQUEST_SELECTED_REGIONS_DATA":
    case "impacts/START_HOURLY_ENERGY_PROFILE_CALCULATIONS":
    case "results/FETCH_EMISSIONS_CHANGES_REQUEST": {
      return {
        ...state,
        loading: true,
      };
    }

    case "geography/RECEIVE_SELECTED_REGIONS_DATA":
    case "impacts/COMPLETE_HOURLY_ENERGY_PROFILE_CALCULATIONS":
    case "results/FETCH_EMISSIONS_CHANGES_SUCCESS": {
      return {
        ...state,
        loading: false,
      };
    }

    default: {
      return state;
    }
  }
}

export function setActiveStep(stepNumber: number) {
  return {
    type: "panel/CHANGE_ACTIVE_STEP",
    payload: { stepNumber },
  };
}

export function displayModalDialog(description: ReactNode) {
  return {
    type: "panel/DISPLAY_MODAL_DIALOG",
    payload: { description },
  };
}

export function resetModalDialog() {
  return { type: "panel/RESET_MODAL_DIALOG" };
}
