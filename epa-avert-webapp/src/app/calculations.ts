import stats from 'stats-lite';
// reducers
import { RegionalLoadData, EereDefaultData } from 'app/redux/reducers/rdfs';
import {
  EereInputFields,
  EereInputs,
  HourlyEere,
} from 'app/redux/reducers/eere';

function calculateTopPercentile(
  regionalLoads: RegionalLoadData[],
  eereInputs: EereInputs,
) {
  const loads = regionalLoads.map((hour) => hour.regional_load_mw);
  const broadProgramInput = Number(eereInputs.broadProgram);
  const topHoursInput = Number(eereInputs.topHours);
  const hours = broadProgramInput ? 100 : topHoursInput;
  const ptile = 1 - hours / 100;
  return stats.percentile(loads, ptile);
}

function calculateHourlyReduction(
  regionalLoads: RegionalLoadData[],
  eereInputs: EereInputs,
) {
  const annualGwhInput = Number(eereInputs.annualGwh);
  const hours = regionalLoads.length;
  return (annualGwhInput * 1000) / hours;
}

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
  regionMaxEELimit, // 15 (percent)
  regionLineLoss,
  regionalLoads,
  eereDefaults,
  eereInputs,
}: {
  regionMaxEELimit: number;
  regionLineLoss: number;
  regionalLoads: RegionalLoadData[];
  eereDefaults: EereDefaultData[];
  eereInputs: { [field in EereInputFields]: string };
}) {
  const constantMwhInput = Number(eereInputs.constantMwh);
  const broadProgramInput = Number(eereInputs.broadProgram);
  const reductionInput = Number(eereInputs.reduction);
  const windCapacityInput = Number(eereInputs.windCapacity);
  const utilitySolarInput = Number(eereInputs.utilitySolar);
  const rooftopSolarInput = Number(eereInputs.rooftopSolar);

  const lineLoss = 1 / (1 - regionLineLoss / 100);
  const topPercentile = calculateTopPercentile(regionalLoads, eereInputs);
  const hourlyReduction = calculateHourlyReduction(regionalLoads, eereInputs);
  const percentReduction =
    ((-1 * (broadProgramInput || reductionInput)) / 100) * lineLoss;

  const softLimitHourlyExceedances: number[] = [];
  const hardLimitHourlyExceedances: number[] = [];
  const hourlyEere: HourlyEere[] = [];

  regionalLoads.forEach((hour, index) => {
    const hourlyLoad = hour.regional_load_mw;
    const hourlyDefault = eereDefaults[index];

    const softLimit = (hourlyLoad * -1 * regionMaxEELimit) / 100;
    const hardLimit = hourlyLoad * -0.3;

    const windCapacity = windCapacityInput * hourlyDefault.wind;
    const utilitySolar = utilitySolarInput * hourlyDefault.utility_pv;
    const rooftopSolar = rooftopSolarInput * hourlyDefault.rooftop_pv * lineLoss; // prettier-ignore
    const renewableProfile = -1 * (windCapacity + utilitySolar + rooftopSolar);

    const initialLoad =
      hourlyLoad > topPercentile ? hourlyLoad * percentReduction : 0;

    const calculatedLoad =
      initialLoad +
      renewableProfile -
      hourlyReduction * lineLoss -
      constantMwhInput * lineLoss;

    const softLimitHourlyExceedance = calculateHourlyExceedance(
      calculatedLoad,
      softLimit,
      15,
    );

    const hardLimitHourlyExceedance = calculateHourlyExceedance(
      calculatedLoad,
      hardLimit,
      30,
    );

    softLimitHourlyExceedances[index] = softLimitHourlyExceedance;
    hardLimitHourlyExceedances[index] = hardLimitHourlyExceedance;
    hourlyEere[index] = {
      index: index,
      constant: hourlyReduction,
      current_load_mw: hourlyLoad,
      percent: initialLoad,
      final_mw: calculatedLoad,
      renewable_energy_profile: renewableProfile,
      soft_limit: softLimit,
      hard_limit: hardLimit,
      soft_exceedance: softLimitHourlyExceedance,
      hard_exceedance: hardLimitHourlyExceedance,
    };
  });

  return { softLimitHourlyExceedances, hardLimitHourlyExceedances, hourlyEere };
}
