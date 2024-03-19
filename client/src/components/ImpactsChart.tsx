import Highcharts from "highcharts";
import HighchartsExporting from "highcharts/modules/exporting";
import HighchartsAccessibility from "highcharts/modules/accessibility";
import HighchartsReact from "highcharts-react-official";
// ---
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Tooltip } from "@/components/Tooltip";
import { useAppSelector } from "@/redux/index";
import { useSelectedRegion, useSelectedStateRegions } from "@/hooks";

HighchartsExporting(Highcharts);
HighchartsAccessibility(Highcharts);

function ImpactsChartContent() {
  const geographicFocus = useAppSelector(({ geography }) => geography.focus);
  const inputs = useAppSelector(({ impacts }) => impacts.inputs);
  const hourlyEnergyProfile = useAppSelector(
    ({ impacts }) => impacts.hourlyEnergyProfile,
  );

  const totalHourlyChanges = hourlyEnergyProfile.data.total.hourlyChanges;

  /**
   * Recalculation of the hourly energy profile is needed if the impacts inputs
   * have changed from the ones used in the hourly energy profile calculation
   */
  const hourlyEnergyProfileRecalculationNeeded = !Object.keys(inputs).every(
    (field) => {
      return (
        inputs[field as keyof typeof inputs] ===
        hourlyEnergyProfile.inputs[field as keyof typeof hourlyEnergyProfile.inputs] // prettier-ignore
      );
    },
  );

  const selectedRegion = useSelectedRegion();
  const selectedStateRegions = useSelectedStateRegions();

  const rdfYear =
    geographicFocus === "regions"
      ? selectedRegion?.rdf.run.year
      : selectedStateRegions[0]?.rdf.run.year;

  const year = rdfYear || new Date().getFullYear();

  const hourlyData = Object.values(totalHourlyChanges).map((change, hour) => {
    const firstHourOfYear = Date.UTC(year, 0, 1);
    const hourlyMs = hour * 60 * 60 * 1_000;
    return [new Date().setTime(firstHourOfYear + hourlyMs), change];
  });

  const chartConfig: Highcharts.Options = {
    chart: {
      height: 300,
      style: {
        fontFamily: '"Open Sans", sans-serif',
      },
    },
    accessibility: {
      description: "Electric power load profile",
    },
    title: {
      text: undefined,
    },
    credits: {
      enabled: false,
    },
    legend: {
      enabled: false,
    },
    tooltip: {
      formatter: function () {
        const x = Number(this.x);
        const y = Number(this.y);
        return `<span style="font-size: 10px">
          ${Highcharts.dateFormat("%m/%d/%y %l:%M %P", x)}</span><br/>
          <strong>${Math.round(y).toLocaleString()}</strong> MW`;
      },
    },
    lang: {
      contextButtonTitle: "Export options",
    },
    xAxis: {
      type: "datetime",
      dateTimeLabelFormats: {
        month: "%b",
      },
      tickInterval: 30 * 24 * 3600 * 1_000,
      title: {
        text: undefined,
      },
    },
    yAxis: {
      title: {
        text: "Change in load (MW)",
      },
      labels: {
        formatter: function () {
          return Math.round(Number(this.value)).toString();
        },
      },
    },
    series: [
      {
        type: "line",
        name: "Electric power load profile",
        data: hourlyData,
        color: "#058dc7",
      },
    ],
  };

  return (
    <div data-avert-chart>
      {Object.keys(totalHourlyChanges).length > 0 && (
        <>
          <h3 className="margin-0 font-sans-md line-height-sans-2 text-base-darker text-center">
            Electric power load profile based on values entered:&nbsp;
            <Tooltip>
              <p className="margin-0 text-normal text-left">
                This graph shows the hourly changes in load that will result
                from the inputs entered above. It reflects a combination of all
                inputs, typical capacity factors for wind and solar, and
                adjustments for avoided transmission and distribution line loss,
                where applicable. This hourly load profile will be used to
                calculate the change in emissions from the electric power
                sector.
              </p>
            </Tooltip>
          </h3>

          <p className="margin-top-1 font-sans-2xs text-base-darker text-center">
            Adjusted for transmission and distribution line loss and wind and
            solar capacity factors, where applicable.
          </p>

          <div className="position-relative height-full">
            {hourlyEnergyProfileRecalculationNeeded && (
              <div className="pin-all z-100 bg-black opacity-80">
                <div className="display-flex flex-column flex-align-center flex-justify-center height-full">
                  <p className="margin-0 padding-2 text-center text-white">
                    Inputs have changed since this electric power load profile
                    was calculated.
                  </p>

                  <p className="margin-0 padding-2 text-center text-white">
                    Please click the “Recalculate Energy Impacts” button above
                    to recalculate with the latest energy impacts input values.
                  </p>
                </div>
              </div>
            )}

            <HighchartsReact
              highcharts={Highcharts}
              options={chartConfig}
              callback={(_chart: Highcharts.Chart) => {
                // callback for after highcharts chart renders
                // as this entire react app is ultimately served in an iframe on another page,
                // this document has a click handler that sends document's height to other window,
                // which can then set the embedded iframe's height (see public/post-message.js)
                document.querySelector("html")?.click();
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

export function ImpactsChart() {
  return (
    <ErrorBoundary
      message={
        <>
          Electric power load profile chart error. Please contact AVERT support
          at{" "}
          <a
            className="usa-link"
            href="mailto:avert@epa.gov"
            target="_parent"
            rel="noreferrer"
          >
            avert@epa.gov
          </a>
        </>
      }
    >
      <ImpactsChartContent />
    </ErrorBoundary>
  );
}
