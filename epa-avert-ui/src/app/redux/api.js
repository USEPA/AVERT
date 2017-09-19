// actions
const SET_BASE_URL = 'avert/api/SET_BASE_URL';
const SET_POLLING_FREQUENCY = 'avert/api/SET_POLLING_FREQUENCY';

// reducer
const initialState = {
  baseUrl: (process.env.REACT_APP_WEB_SERVICE === 'local')
    ? 'http://localhost:3001'
    : 'https://app7.erg.com/avert',
  pollingFrequency: 30000,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_BASE_URL:
      return {
        ...state,
        baseUrl: action.payload.url,
      };

    case SET_POLLING_FREQUENCY:
      return {
        ...state,
        pollingFrequency: action.payload.time,
      };

    default:
      return state;
  }
}

// action creators
export const setBaseUrl = (url) => ({
  type: SET_BASE_URL,
  payload: {
    url,
  },
});

export const setPolingFrequency = (time) => ({
  type: SET_BASE_URL,
  payload: {
    time,
  },
});
