import {
    SELECT_REGION,
    UPDATE_EERE_TOP_HOURS,
    UPDATE_EERE_REDUCTION,
    UPDATE_EERE_ANNUAL_GWH,
    UPDATE_EERE_CONSTANT_MW,
    UPDATE_EERE_WIND_CAPACITY,
    UPDATE_EERE_UTILITY_SOLAR,
    UPDATE_EERE_ROOFTOP_SOLAR,
    VALIDATE_EERE,
    UPDATE_EXCEEDANCES,
    SUBMIT_PARAMS,
    SUBMIT_CALCULATION,
    COMPLETE_CALCULATION,
} from '../actions';

const eere = (state = {
    status: 'select_region',
    submitted: false,
    valid: true,
    exceedances: [],
    top_exceedance_value: 0,
    top_exceedance_hour: 0,
    soft_valid: true,
    soft_exceedances: [],
    soft_top_exceedance_value: 0,
    soft_top_exceedance_hour: 0,
    hard_valid: true,
    hard_exceedances: [],
    hard_top_exceedance_value: 0,
    hard_top_exceedance_hour: 0,
    errors: [],
    topHours: '',
    reduction: '',
    annualGwh: '',
    constantMw: '',
    capacity: '',
    utilitySolar: '',
    rooftopSolar: '',
    hourlyEere: []
}, action) => {
    switch (action.type) {
        case SELECT_REGION:
            return Object.assign({}, state, {
                status: "ready",
            });

        case UPDATE_EERE_TOP_HOURS:
            return Object.assign({}, state, {
                topHours: action.text
            });

        case UPDATE_EERE_REDUCTION:
            return Object.assign({}, state, {
                reduction: action.text
            });

        case UPDATE_EERE_ANNUAL_GWH:
            return Object.assign({}, state, {
                annualGwh: action.text
            });

        case UPDATE_EERE_CONSTANT_MW:
            return Object.assign({}, state, {
                constantMw: action.text
            });

        case UPDATE_EERE_WIND_CAPACITY:
            return Object.assign({}, state, {
                capacity: action.text
            });

        case UPDATE_EERE_UTILITY_SOLAR:
            return Object.assign({}, state, {
                utilitySolar: action.text
            });

        case UPDATE_EERE_ROOFTOP_SOLAR:
            return Object.assign({}, state, {
                rooftopSolar: action.text
            });

        case VALIDATE_EERE:
            return Object.assign({}, state, {
                valid: action.valid,
                errors: action.errors,
            });

        case UPDATE_EXCEEDANCES:
            const valid = action.exceedances.reduce((a, b) => a + b) === 0;
            const maxVal = (! valid) ? Math.max(...action.exceedances) : 0;
            const maxIndex = (! valid) ? action.exceedances.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0) : 0;

            const softValid = action.soft_exceedances.reduce((a, b) => a + b) === 0;
            const softMaxVal = (! valid) ? Math.max(...action.soft_exceedances) : 0;
            const softMaxIndex = (! valid) ? action.soft_exceedances.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0) : 0;

            const hardValid = action.hard_exceedances.reduce((a, b) => a + b) === 0;
            const hardMaxVal = (! valid) ? Math.max(...action.hard_exceedances) : 0;
            const hardMaxIndex = (! valid) ? action.hard_exceedances.reduce((iMax, x, i, arr) => x > arr[iMax] ? i : iMax, 0) : 0;

            return Object.assign({}, state, {
                // TODO: Consider splitting up "validity for exceed" from "validity for fields"
                exceedances: action.exceedances,
                top_exceedance_value: maxVal,
                top_exceedance_hour: maxIndex,

                soft_valid: softValid,
                soft_exceedances: action.soft_exceedances,
                soft_top_exceedance_value: softMaxVal,
                soft_top_exceedance_hour: softMaxIndex,

                hard_valid: hardValid,
                hard_exceedances: action.hard_exceedances,
                hard_top_exceedance_value: hardMaxVal,
                Hard_top_exceedance_hour: hardMaxIndex,

            });

        case SUBMIT_PARAMS:
            return Object.assign({}, state, {
                submitted: true,
            });

        case SUBMIT_CALCULATION:
            return Object.assign({}, state, {
                status: 'started',
                hourlyEere: [],
            });

        case COMPLETE_CALCULATION:
            return Object.assign({}, state, {
                status: 'complete',
                hourlyEere: action.hourlyEere
            });
        default:
            return state;
    }
};

export default eere;