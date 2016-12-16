// action types
import {
  START_DATA_DOWNLOAD,
} from '../../actions';

const defaultState = {
  file: false,
};

const dataDownload = (state = defaultState, action) => {
  switch (action.type) {
    case START_DATA_DOWNLOAD:
      return {
        ...state,
        file: true
      };

    default:
      return state;
  }
};

export default dataDownload;