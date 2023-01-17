import stats from 'stats-lite';
// ---
import { RegionalLoadData } from 'app/redux/reducers/geography';
import { EnergyEfficiencyFieldName } from 'app/redux/reducers/eere';

/**
 * TODO...
 */
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

export function calculateEere(options: {
  regionMaxEEPercent: number; // region.rdf.limits.max_ee_percent (15 for all RDFs)
  regionLineLoss: number; // region.lineLoss
  regionalLoad: RegionalLoadData[]; // region.rdf.regional_load
  hourlyRenewableEnergyProfile: number[]; // result of calculateHourlyRenewableEnergyProfile()
  hourlyEVLoad: number[]; // result of calculateHourlyEVLoad()
  energyEfficiencyInputs: { [field in EnergyEfficiencyFieldName]: number }; // eere.inputs (text inputs, scaled for each region)
}) {
  const {
    regionMaxEEPercent,
    regionLineLoss,
    regionalLoad,
    hourlyRenewableEnergyProfile,
    hourlyEVLoad,
    energyEfficiencyInputs,
  } = options;

  const {
    // A: Reductions spread evenly throughout the year
    annualGwh,
    constantMwh,
    // B: Percentage reductions in some or all hours
    broadProgram,
    reduction,
    topHours,
  } = energyEfficiencyInputs;

  const lineLoss = 1 / (1 - regionLineLoss);

  const hourlyMwReduction =
    ((annualGwh * 1_000) / regionalLoad.length) * lineLoss;

  const percentReduction =
    ((-1 * (broadProgram || reduction)) / 100) * lineLoss;

  const hourlyLoads = regionalLoad.map((data) => data.regional_load_mw);

  const percentHours = broadProgram ? 100 : topHours;
  const topPercentile = stats.percentile(hourlyLoads, 1 - percentHours / 100);

  // console.log(topPercentile); // NOTE: for debugging purposes

  // build up exceedances (soft and hard) and hourly eere for each hour of the year
  const softLimitHourlyExceedances: number[] = [];
  const hardLimitHourlyExceedances: number[] = [];
  const hourlyEere: number[] = [];

  regionalLoad.forEach((data, index) => {
    const hourlyLoad = data.regional_load_mw;

    const initialLoad =
      hourlyLoad >= topPercentile ? hourlyLoad * percentReduction : 0;

    const renewableProfile = hourlyRenewableEnergyProfile[index] || 0;

    // NOTE: hourlyEVLoad will be an empty array if there are no EV inputs entered
    const evLoad = hourlyEVLoad[index] || 0;

    // Excel: TODO
    const calculatedLoad =
      initialLoad -
      constantMwh * lineLoss -
      hourlyMwReduction -
      renewableProfile +
      evLoad;

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
