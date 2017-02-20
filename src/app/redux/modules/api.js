const SET_BASE_URL = 'avert/api/SET_BASE_URL';

export const initialState = {
  baseUrl: 'http://localhost:3001',
  // baseUrl: 'https://app7.erg.com/avert',
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SET_BASE_URL:
      return {
        ...state,
        baseUrl: action.payload.url
      };

    default:
      return state;
  }
}

export const getBaseUrl = (state) => state.api.baseUrl;

export function setBaseUrl(url) {
  return {
    type: SET_BASE_URL,
    payload: {
      url
    }
  }
}