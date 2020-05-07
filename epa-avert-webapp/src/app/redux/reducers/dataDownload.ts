import { useSelector, TypedUseSelectorHook } from 'react-redux';
import json2csv from 'json2csv';
import Blob from 'blob';
import FileSaver from 'file-saver';
// reducers
import { AppThunk } from 'app/redux/index';

type DataDownloadAction =
  | {
      type: 'dataDownload/START_COUNTY_RESULTS_DOWNLOAD';
    }
  | {
      type: 'dataDownload/START_COBRA_RESULTS_DOWNLOAD';
    };

type DataDownloadState = {
  countyFile: boolean;
  cobraFile: boolean;
};

export const useDataDownloadState: TypedUseSelectorHook<DataDownloadState> = useSelector;

// reducer
const initialState: DataDownloadState = {
  countyFile: false,
  cobraFile: false,
};

export default function reducer(
  state: DataDownloadState = initialState,
  action: DataDownloadAction,
): DataDownloadState {
  switch (action.type) {
    case 'dataDownload/START_COUNTY_RESULTS_DOWNLOAD':
      return {
        ...state,
        countyFile: true,
      };

    case 'dataDownload/START_COBRA_RESULTS_DOWNLOAD':
      return {
        ...state,
        cobraFile: true,
      };

    default:
      return state;
  }
}

// action creators
export const startCountyResultsDownload = (): AppThunk => {
  return (dispatch, getState) => {
    // get reducer data from store to use in dispatched action
    const { monthlyEmissions, region } = getState();

    const data = monthlyEmissions.downloadableCountyData;
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

    return dispatch({ type: 'dataDownload/START_COUNTY_RESULTS_DOWNLOAD' });
  };
};

export const startCobraResultsDownload = (): AppThunk => {
  return (dispatch, getState) => {
    // get reducer data from store to use in dispatched action
    const { monthlyEmissions, region } = getState();

    const data = monthlyEmissions.downloadableCobraData;
    const fields = Object.keys(data[0]);

    try {
      const csv = json2csv.parse(data, { fields });
      const blob = new Blob([csv], { type: 'text/plain:charset=utf-8' });
      FileSaver.saveAs(blob, `AVERT COBRA (${region.name}).csv`);
    } catch (err) {
      console.error(err);
    }

    return dispatch({ type: 'dataDownload/START_COBRA_RESULTS_DOWNLOAD' });
  };
};
