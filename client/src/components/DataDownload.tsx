import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useAppSelector } from "@/redux/index";
import { useSelectedRegion, useSelectedState } from "@/hooks";

function convertToCSVString(data: { [key: string]: unknown }[]) {
  const keys = Object.keys(data[0] || {});
  const rows = data.map((row) => {
    return keys
      .map((key) => `"${row[key] || row[key] === 0 ? row[key] : ""}"`)
      .join(",");
  });
  return [keys.map((key) => `"${key}"`).join(",")].concat(rows).join("\r\n");
}

function DataDownloadContent() {
  const geographicFocus = useAppSelector(({ geography }) => geography.focus);
  const countyData = useAppSelector(({ downloads }) => downloads.countyData);
  const cobraData = useAppSelector(({ downloads }) => downloads.cobraData);

  const selectedRegionName = useSelectedRegion()?.name || "";
  const selectedStateName = useSelectedState()?.name || "";

  const geographyText =
    geographicFocus === "regions"
      ? `Region – ${selectedRegionName}`
      : `State – ${selectedStateName}`;

  const countyCsvString = encodeURIComponent(convertToCSVString(countyData));
  const cobraCsvString = encodeURIComponent(convertToCSVString(cobraData));

  return (
    <>
      <h3 className="avert-blue margin-bottom-1 font-serif-md">
        Data Download
      </h3>

      <p className="margin-top-0">
        Download monthly displacement data for each county, state, and region in
        this analysis, in CSV format, or download your results formatted as
        inputs for use in{" "}
        <a
          className="usa-link"
          href="https://www.epa.gov/cobra"
          target="_parent"
          rel="noreferrer"
        >
          COBRA
        </a>
        .
      </p>

      <p className="margin-top-0 text-center">
        <a
          className="usa-button avert-button"
          href={`data:text/csv;charset=utf-8,${countyCsvString}`}
          download={`AVERT Monthly Emission Changes (${geographyText}).csv`}
        >
          Download County Level Results
        </a>
      </p>

      <p className="margin-0 text-center">
        <a
          className="usa-button avert-button"
          href={`data:text/csv;charset=utf-8,${cobraCsvString}`}
          download={`AVERT COBRA (${geographyText}).csv`}
        >
          Download COBRA Inputs
        </a>
      </p>
    </>
  );
}

export function DataDownload() {
  return (
    <ErrorBoundary
      message={
        <>
          AVERT data download error. Please contact AVERT support at{" "}
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
      <DataDownloadContent />
    </ErrorBoundary>
  );
}
