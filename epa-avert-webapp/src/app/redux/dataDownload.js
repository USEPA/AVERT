import json2csv from 'json2csv';
import Blob from 'blob';
import FileSaver from 'file-saver';

// action types
export const START_DATA_DOWNLOAD = 'dataDownload/START_DATA_DOWNLOAD';

// reducer
const initialState = {
  file: false,
};

export default function reducer(state = initialState, action) {
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

// action creators
export const startDataDownload = () => {
  return (dispatch, getState) => {
    const { monthlyEmissions, region } = getState();

    const data = monthlyEmissions.downloadableData;
    const fields = Object.keys(data[0]);

    try {
      const csv = json2csv({ fields, data });
      const blob = new Blob([csv], { type: 'text/plain:charset=utf-8' });
      FileSaver.saveAs(blob, `AVERT Monthly Emissions (${region.name} Region).csv`);
    } catch (e) {
      console.error(e);
    }

    // dispatch 'start data download' action
    return dispatch({ type: START_DATA_DOWNLOAD });
  }
};
