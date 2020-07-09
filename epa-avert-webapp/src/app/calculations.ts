import stats from 'stats-lite';
// reducers
import { EereDefaultData } from 'app/redux/reducers/geography';
import { EereInputFields } from 'app/redux/reducers/eere';

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
  hourlyLoads, // region.rdf.regional_load.map((hour) => hour.regional_load_mw)
  eereDefaults, // region.eereDefaults.data
  eereInputs, // eere.inputs
}: {
  regionMaxEEPercent: number;
  regionLineLoss: number;
  hourlyLoads: number[];
  eereDefaults: EereDefaultData[];
  eereInputs: { [field in EereInputFields]: string };
}) {
  const lineLoss = 1 / (1 - regionLineLoss);

  // Energy Efficiency inputs
  // A: Reductions spread evenly throughout the year
  const annualGwhInput = Number(eereInputs.annualGwh);
  const constantMwhInput = Number(eereInputs.constantMwh);
  // B: Percentage reductions in some or all hours
  const broadProgramInput = Number(eereInputs.broadProgram);
  const reductionInput = Number(eereInputs.reduction);
  const topHoursInput = Number(eereInputs.topHours);
  // Renewable Energy inputs
  // C: Wind
  const onshoreWindInput = Number(eereInputs.onshoreWind);
  const offshoreWindInput = Number(eereInputs.offshoreWind);
  // D: Solar photovoltaic
  const utilitySolarInput = Number(eereInputs.utilitySolar);
  const rooftopSolarInput = Number(eereInputs.rooftopSolar);

  const percentHours = broadProgramInput ? 100 : topHoursInput;
  const ptile = 1 - percentHours / 100;
  const topPercentile = stats.percentile(hourlyLoads, ptile);

  const hourlyMwReduction = (annualGwhInput * 1000) / hourlyLoads.length;

  const percentReduction =
    ((-1 * (broadProgramInput || reductionInput)) / 100) * lineLoss;

  const softLimitHourlyExceedances: number[] = [];
  const hardLimitHourlyExceedances: number[] = [];
  const hourlyEere: number[] = [];

  hourlyLoads.forEach((hourlyLoad, index) => {
    const hourlyDefault = eereDefaults[index];

    const onshoreWind = onshoreWindInput * hourlyDefault.onshore_wind;
    const offshoreWind = offshoreWindInput * (hourlyDefault.offshore_wind || 0);
    const utilitySolar = utilitySolarInput * hourlyDefault.utility_pv;
    const rooftopSolar = rooftopSolarInput * hourlyDefault.rooftop_pv * lineLoss; // prettier-ignore

    const renewableProfile =
      -1 * (onshoreWind + offshoreWind + utilitySolar + rooftopSolar);

    const initialLoad =
      hourlyLoad > topPercentile ? hourlyLoad * percentReduction : 0;

    const calculatedLoad =
      initialLoad +
      renewableProfile -
      hourlyMwReduction * lineLoss -
      constantMwhInput * lineLoss;

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

  return { softLimitHourlyExceedances, hardLimitHourlyExceedances, hourlyEere };
}
