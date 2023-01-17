import type { RegionalLoadData } from 'app/redux/reducers/geography';

/**
 * TODO...
 */
function calculateHourlyExceedance(
  valueMw: number,
  softOrHardLimit: number,
  amount: 15 | 30,
) {
  const load = Math.abs(valueMw);
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
  hourlyTopPercentReduction: number[]; // result of calculateHourlyTopPercentReduction()
  annualGwh: number; // eere.inputs.annualGwh
  constantMwh: number; // eere.inputs.annualGwh
}) {
  const {
    regionMaxEEPercent,
    regionLineLoss,
    regionalLoad,
    hourlyRenewableEnergyProfile,
    hourlyEVLoad,
    hourlyTopPercentReduction,
    annualGwh,
    constantMwh,
  } = options;

  const hourlyMwReduction = (annualGwh * 1_000) / regionalLoad.length;

  // build up exceedances (soft and hard) and hourly eere for each hour of the year
  const softLimitHourlyExceedances: number[] = [];
  const hardLimitHourlyExceedances: number[] = [];
  const hourlyEere: number[] = [];

  regionalLoad.forEach((data, index) => {
    const hourlyLoad = data.regional_load_mw;

    const topPercentReduction = hourlyTopPercentReduction[index] || 0;
    const renewableProfile = hourlyRenewableEnergyProfile[index] || 0;
    const evLoad = hourlyEVLoad[index] || 0;

    /**
     * Excel: Data in column I of the "CalculateEERE" sheet (I5:I8788).
     */
    const finalMw =
      (topPercentReduction - hourlyMwReduction - constantMwh + evLoad) /
        (1 - regionLineLoss) +
      renewableProfile;

    const softLimitHourlyExceedance = calculateHourlyExceedance(
      finalMw,
      (hourlyLoad * -1 * regionMaxEEPercent) / 100,
      15,
    );

    const hardLimitHourlyExceedance = calculateHourlyExceedance(
      finalMw,
      hourlyLoad * -0.3,
      30,
    );

    softLimitHourlyExceedances[index] = softLimitHourlyExceedance;
    hardLimitHourlyExceedances[index] = hardLimitHourlyExceedance;
    hourlyEere[index] = finalMw;
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
