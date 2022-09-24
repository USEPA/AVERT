import stats from 'stats-lite';
// reducers
import {
  RegionalLoadData,
  EereDefaultData,
} from 'app/redux/reducers/geography';
import { EereTextInputFieldName } from 'app/redux/reducers/eere';

function calculateHourlyExceedance(
  calculatedLoad: number,
  softOrHardLimit: number,
  amount: 15 | 30,
) {
  const load = Math.abs(calculatedLoad);
  const limit = Math.abs(softOrHardLimit);
  if (load > limit) {
    const exceedance = load / limit - 1;
    return exceedance * amount + amount;
  }
  return 0;
}

export function calculateEere({
  regionMaxEEPercent, // region.rdf.limits.max_ee_percent (15 for all RDFs)
  regionLineLoss, // region.lineLoss
  regionalLoad, // region.rdf.regional_load
  eereDefaults, // region.eereDefaults.data
  eereInputs, // eere.inputs (scaled for each region)
}: {
  regionMaxEEPercent: number;
  regionLineLoss: number;
  regionalLoad: RegionalLoadData[];
  eereDefaults: EereDefaultData[];
  eereInputs: { [field in EereTextInputFieldName]: number };
}) {
  const {
    // A: Reductions spread evenly throughout the year
    annualGwh,
    constantMwh,
    // B: Percentage reductions in some or all hours
    broadProgram,
    reduction,
    topHours,
    // C: Wind
    onshoreWind,
    offshoreWind,
    // D: Solar photovoltaic
    utilitySolar,
    rooftopSolar,
    // E: Electric Vehicles
    // batteryEVs,
    // batteryEVsProfile,
    // hybridEVs,
    // hybridEVsProfile,
    // transitBuses,
    // transitBusesProfile,
    // schoolBuses,
    // schoolBusesProfile,
  } = eereInputs;

  const lineLoss = 1 / (1 - regionLineLoss);

  const hourlyMwReduction =
    ((annualGwh * 1000) / regionalLoad.length) * lineLoss;

  const percentReduction =
    ((-1 * (broadProgram || reduction)) / 100) * lineLoss;

  const hourlyLoads = regionalLoad.map((hour) => hour.regional_load_mw);

  const percentHours = broadProgram ? 100 : topHours;
  const topPercentile = stats.percentile(hourlyLoads, 1 - percentHours / 100);

  // build up exceedances (soft and hard) and hourly eere for each hour of the year
  const softLimitHourlyExceedances: number[] = [];
  const hardLimitHourlyExceedances: number[] = [];
  const hourlyEere: number[] = [];

  regionalLoad.forEach((hour, index) => {
    const hourlyLoad = hour.regional_load_mw;

    const hourlyDefault = eereDefaults[index];

    const renewableProfile =
      onshoreWind * hourlyDefault.onshore_wind +
      offshoreWind * (hourlyDefault.offshore_wind || 0) +
      utilitySolar * hourlyDefault.utility_pv +
      rooftopSolar * hourlyDefault.rooftop_pv * lineLoss;

    const initialLoad =
      hourlyLoad > topPercentile ? hourlyLoad * percentReduction : 0;

    const calculatedLoad =
      initialLoad -
      renewableProfile -
      hourlyMwReduction -
      constantMwh * lineLoss;

    const softLimitHourlyExceedance = calculateHourlyExceedance(
      calculatedLoad,
      (hourlyLoad * -1 * regionMaxEEPercent) / 100,
      15,
    );

    const hardLimitHourlyExceedance = calculateHourlyExceedance(
      calculatedLoad,
      hourlyLoad * -0.3,
      30,
    );

    softLimitHourlyExceedances[index] = softLimitHourlyExceedance;
    hardLimitHourlyExceedances[index] = hardLimitHourlyExceedance;
    hourlyEere[index] = calculatedLoad;
  });

  // calculate soft and hard exceedances to determine the hour that exceeded
  // the soft and hard limits
  const softValid = softLimitHourlyExceedances.reduce((a, b) => a + b) === 0;
  const softTopExceedanceValue = Math.max(...softLimitHourlyExceedances);
  const softTopExceedanceIndex = !softValid
    ? softLimitHourlyExceedances.indexOf(softTopExceedanceValue)
    : -1;

  const hardValid = hardLimitHourlyExceedances.reduce((a, b) => a + b) === 0;
  const hardTopExceedanceValue = Math.max(...hardLimitHourlyExceedances);
  const hardTopExceedanceIndex = !hardValid
    ? hardLimitHourlyExceedances.indexOf(hardTopExceedanceValue)
    : -1;

  return {
    hourlyEere,
    softValid,
    softTopExceedanceValue,
    softTopExceedanceIndex,
    hardValid,
    hardTopExceedanceValue,
    hardTopExceedanceIndex,
  };
}
