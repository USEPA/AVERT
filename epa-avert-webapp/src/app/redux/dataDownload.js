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
        file: true,
      };

    default:
      return state;
  }
}

// action creators
export const startDataDownload = () => {
  return (dispatch, getState) => {
    // get reducer data from store to use in dispatched action
    const { monthlyEmissions, region } = getState();

    const data = monthlyEmissions.downloadableData;
    const fields = Object.keys(data[0]);

    try {
      const csv = json2csv.parse(data, { fields });
      const blob = new Blob([csv], { type: 'text/plain:charset=utf-8' });
      FileSaver.saveAs(
        blob,
        `AVERT Monthly Emission Changes (${region.name}).csv`,
      );
    } catch (err) {
      console.error(err);
    }

    return dispatch({ type: START_DATA_DOWNLOAD });
  };
};
