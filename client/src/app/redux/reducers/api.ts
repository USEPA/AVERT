// ensure base url has been set in environment variable
if (!process.env.REACT_APP_URL) {
  throw new Error('Base URL required!');
}

// ensure COBRA API url has been set in environment variable
if (!process.env.REACT_APP_COBRA_API_URL) {
  throw new Error('COBRA API URL required!');
}

// ensure COBRA app url has been set in environment variable
if (!process.env.REACT_APP_COBRA_APP_URL) {
  throw new Error('COBRA App URL required!');
}

type Action =
  | {
      type: 'api/SET_BASE_URL';
      payload: { url: string };
    }
  | {
      type: 'api/SET_COBRA_API_URL';
      payload: { url: string };
    }
  | {
      type: 'api/SET_COBRA_APP_URL';
      payload: { url: string };
    };

type State = {
  baseUrl: string;
  cobraApiUrl: string;
  cobraAppUrl: string;
};

const initialState: State = {
  baseUrl: process.env.REACT_APP_URL,
  cobraApiUrl: process.env.REACT_APP_COBRA_API_URL,
  cobraAppUrl: process.env.REACT_APP_COBRA_APP_URL,
};

export default function reducer(
  state: State = initialState,
  action: Action,
): State {
  switch (action.type) {
    case 'api/SET_BASE_URL': {
      const { url } = action.payload;

      return {
        ...state,
        baseUrl: url,
      };
    }

    case 'api/SET_COBRA_API_URL': {
      const { url } = action.payload;

      return {
        ...state,
        cobraApiUrl: url,
      };
    }

    case 'api/SET_COBRA_APP_URL': {
      const { url } = action.payload;

      return {
        ...state,
        cobraAppUrl: url,
      };
    }

    default: {
      return state;
    }
  }
}

export function setBaseUrl(url: string) {
  return {
    type: 'api/SET_BASE_URL',
    payload: { url },
  };
}

export function setCobraApiUrl(url: string) {
  return {
    type: 'api/SET_COBRA_API_URL',
    payload: { url },
  };
}

export function setCobraAppUrl(url: string) {
  return {
    type: 'api/SET_COBRA_APP_URL',
    payload: { url },
  };
}
