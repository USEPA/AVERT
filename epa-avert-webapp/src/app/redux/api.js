// action types
export const SET_BASE_URL = 'api/SET_BASE_URL';

// reducer
const initialState = {
  baseUrl: (process.env.REACT_APP_WEB_SERVICE === 'local')
    ? 'http://localhost:3001'
    : 'https://avert-webservice.app.cloud.gov',
    // : 'https://avert.app.cloud.gov',
    // : 'https://app7.erg.com/avert',
  pollingFrequency: 10000,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_BASE_URL:
      return {
        ...state,
        baseUrl: action.payload.url,
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
