import { Fragment, useState, useEffect } from "react";
import clsx from "clsx";
// ---
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useAppDispatch, useAppSelector } from "@/redux/index";
import {
  selectRegion,
  setRegionSelectStateIdAndRegionIds,
  setRegionSelectCounty,
} from "@/redux/reducers/geography";
import { useSelectedRegion } from "@/hooks";
import { type CountiesByGeography } from "@/calculations/geography";
import { type RegionId, type StateId, regions, states } from "@/config";

function RegionsListContent() {
  const dispatch = useAppDispatch();
  const countiesByGeography = useAppSelector(
    ({ geography }) => geography.countiesByGeography,
  );
  const regionSelectStateId = useAppSelector(
    ({ geography }) => geography.regionSelect.stateId,
  );
  const regionSelectStateRegionIds = useAppSelector(
    ({ geography }) => geography.regionSelect.stateRegionIds,
  );
  const regionSelectCounty = useAppSelector(
    ({ geography }) => geography.regionSelect.county,
  );

  const selectedRegionId = useSelectedRegion()?.id;

  const [countyNames, setCountyNames] = useState<string[]>([]);

  // update county select options, based on selected state
  useEffect(() => {
    const stateId = regionSelectStateId;
    const stateRegionIds = regionSelectStateRegionIds;

    const countiesByGeographyData =
      Object.keys(countiesByGeography).length !== 0
        ? (countiesByGeography as CountiesByGeography)
        : null;

    if (stateId === "") {
      setCountyNames([]);
      return;
    }

    if (countiesByGeographyData) {
      const { states } = countiesByGeographyData;
      const stateCounties = states[stateId];

      if (stateCounties) {
        /**
         * if an entire state is within one AVERT region, use ["All Counties"]
         * instead of an array of county names within that state.
         */
        const countyNames =
          stateRegionIds.length === 1 ? ["All Counties"] : stateCounties.sort();

        setCountyNames(countyNames);
      }
    }
  }, [countiesByGeography, regionSelectStateId, regionSelectStateRegionIds]);

  // update selected region, based on selected county
  useEffect(() => {
    const stateId = regionSelectStateId;
    const county = regionSelectCounty;

    const countiesByGeographyData =
      Object.keys(countiesByGeography).length !== 0
        ? (countiesByGeography as CountiesByGeography)
        : null;

    if (stateId === "") {
      return;
    }

    /**
     * if an entire state is within one AVERT region, and user has selected
     * "All Counties", select that region.
     */
    if (regionSelectStateRegionIds.length === 1 && county === "All Counties") {
      const regionId = regionSelectStateRegionIds[0];
      dispatch(selectRegion(regionId));
      return;
    }

    if (countiesByGeographyData) {
      /** determine which region the county falls within */
      const regionId = Object.entries(countiesByGeographyData.regions).find(
        ([_, regionData]) => {
          return Object.entries(regionData).some(([key, value]) => {
            return (key as StateId) === stateId && value.includes(county);
          });
        },
      )?.[0] as RegionId | undefined;

      if (regionId) {
        dispatch(selectRegion(regionId));
      }
    }
  }, [
    countiesByGeography,
    regionSelectStateId,
    regionSelectStateRegionIds,
    regionSelectCounty,
    dispatch,
  ]);

  return (
    <div className={clsx("text-base-darker")}>
      <p className={clsx("margin-top-205 margin-bottom-1 line-height-sans-2")}>
        <strong>Select an AVERT region directly:</strong>
      </p>

      <div className={clsx("display-flex")}>
        <div className={clsx("flex-1")}>
          <select
            className={clsx("usa-select margin-0 maxw-full")}
            aria-label="Select Region"
            value={selectedRegionId || ""}
            onChange={(ev) => {
              const regionId = ev.target.value as RegionId;
              dispatch(selectRegion(regionId));
              dispatch(setRegionSelectStateIdAndRegionIds(""));
              dispatch(setRegionSelectCounty(""));
            }}
            data-avert-region-select
          >
            <option value={""} disabled>
              Select Region
            </option>
            <option value={regions.CA.id}>{regions.CA.name}</option>
            <option value={regions.NCSC.id}>{regions.NCSC.name}</option>
            <option value={regions.CENT.id}>{regions.CENT.name}</option>
            <option value={regions.FL.id}>{regions.FL.name}</option>
            <option value={regions.MIDA.id}>{regions.MIDA.name}</option>
            <option value={regions.MIDW.id}>{regions.MIDW.name}</option>
            <option value={regions.NE.id}>{regions.NE.name}</option>
            <option value={regions.NY.id}>{regions.NY.name}</option>
            <option value={regions.NW.id}>{regions.NW.name}</option>
            <option value={regions.RM.id}>{regions.RM.name}</option>
            <option value={regions.SE.id}>{regions.SE.name}</option>
            <option value={regions.SW.id}>{regions.SW.name}</option>
            <option value={regions.TN.id}>{regions.TN.name}</option>
            <option value={regions.TE.id}>{regions.TE.name}</option>
          </select>
        </div>
      </div>

      <p className={clsx("margin-top-205 margin-bottom-1 line-height-sans-2")}>
        <strong>
          Or select a state and county, which will select an AVERT region:
        </strong>
      </p>

      <div className={clsx("display-flex")}>
        <div className={clsx("flex-1 margin-right-1")}>
          <select
            className={clsx("usa-select margin-0 maxw-full")}
            aria-label="Select State"
            value={regionSelectStateId || ""}
            onChange={(ev) => {
              const stateId = ev.target.value as StateId;
              dispatch(selectRegion("" as RegionId));
              dispatch(setRegionSelectStateIdAndRegionIds(stateId));
              dispatch(setRegionSelectCounty(""));
            }}
            data-avert-region-state-select
          >
            <option value={""} disabled>
              Select State
            </option>

            {Object.keys(states).map((stateId) => {
              return (
                <Fragment key={stateId}>
                  <option value={stateId}>
                    {states[stateId as StateId].name}
                  </option>
                </Fragment>
              );
            })}
          </select>
        </div>

        <div className={clsx("flex-1 margin-left-1")}>
          <select
            className={clsx("usa-select margin-0 maxw-full")}
            aria-label="Select County"
            value={regionSelectCounty || ""}
            onChange={(ev) => {
              const county = ev.target.value;
              dispatch(setRegionSelectCounty(county));
            }}
            data-avert-region-county-select
          >
            <option value={""} disabled>
              Select County
            </option>

            {countyNames.map((county) => {
              return (
                <Fragment key={county}>
                  <option value={county}>
                    {county.replace(/city/, "(City)")}
                  </option>
                </Fragment>
              );
            })}
          </select>
        </div>
      </div>
    </div>
  );
}

export function RegionsList() {
  return (
    <ErrorBoundary
      message={
        <>
          AVERT Regions select error. Please contact AVERT support at{" "}
          <a
            className={clsx("usa-link")}
            href="mailto:avert@epa.gov"
            target="_parent"
            rel="noreferrer"
          >
            avert@epa.gov
          </a>
        </>
      }
    >
      <RegionsListContent />
    </ErrorBoundary>
  );
}
