import type { RegionalLoadData } from 'app/redux/reducers/geography';

/**
 * TODO...
 */
function calculateHourlyExceedance(
  calculatedLoad: number,
  exceedanceLimit: number,
  amount: 15 | 30,
) {
  const load = Math.abs(calculatedLoad);
  const limit = Math.abs(exceedanceLimit);
  if (load > limit) {
    const exceedance = load / limit - 1;
    return exceedance * amount + amount;
  }
  return 0;
}

export function calculateEere(options: {
  lineLoss: number; // region.lineLoss
  regionalLoad: RegionalLoadData[]; // region.rdf.regional_load
  hourlyRenewableEnergyProfile: number[]; // result of calculateHourlyRenewableEnergyProfile()
  hourlyEVLoad: number[]; // result of calculateHourlyEVLoad()
  hourlyTopPercentReduction: number[]; // result of calculateHourlyTopPercentReduction()
  annualGwh: number; // eere.inputs.annualGwh
  constantMwh: number; // eere.inputs.annualGwh
}) {
  const {
    lineLoss,
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
    const originalLoad = data.regional_load_mw;

    const topPercentReduction = hourlyTopPercentReduction[index] || 0;
    const renewableProfile = hourlyRenewableEnergyProfile[index] || 0;
    const evLoad = hourlyEVLoad[index] || 0;

    /**
     * Excel: Data in column I of the "CalculateEERE" sheet (I5:I8788).
     */
    const calculatedLoad =
      (topPercentReduction - hourlyMwReduction - constantMwh + evLoad) /
        (1 - lineLoss) +
      renewableProfile;

    const softLimitHourlyExceedance = calculateHourlyExceedance(
      calculatedLoad,
      originalLoad * -0.15,
      15,
    );

    const hardLimitHourlyExceedance = calculateHourlyExceedance(
      calculatedLoad,
      originalLoad * -0.3,
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
