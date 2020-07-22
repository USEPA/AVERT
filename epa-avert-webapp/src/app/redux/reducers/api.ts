// ensure base url has been set in environment variable
if (!process.env.REACT_APP_URL) {
  throw new Error('Base URL required!');
}

type ApiAction = {
  type: 'api/SET_BASE_URL';
  payload: { url: string };
};

type ApiState = {
  baseUrl: string;
};

// reducer
const initialState: ApiState = {
  baseUrl: process.env.REACT_APP_URL,
};

export default function reducer(
  state: ApiState = initialState,
  action: ApiAction,
): ApiState {
  switch (action.type) {
    case 'api/SET_BASE_URL': {
      const { url } = action.payload;

      return {
        ...state,
        baseUrl: url,
      };
    }

    default: {
      return state;
    }
  }
}

// action creators
export function setBaseUrl(url: string) {
  return {
    type: 'api/SET_BASE_URL',
    payload: { url },
  };
}
