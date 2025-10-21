import { Fragment } from "react";
import clsx from "clsx";
// ---
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useAppDispatch } from "@/redux/index";
import { selectState } from "@/redux/reducers/geography";
import { useSelectedState } from "@/hooks";
import { type StateId, states } from "@/config";

function StatesListContent() {
  const dispatch = useAppDispatch();

  const selectedStateId = useSelectedState()?.id;

  return (
    <div className={clsx("margin-top-3 text-base-darker")}>
      <div className={clsx("display-flex")}>
        <div className={clsx("flex-1")}>
          <select
            className={clsx("usa-select margin-0 maxw-full")}
            aria-label="Select State"
            value={selectedStateId || ""}
            onChange={(ev) => dispatch(selectState(ev.target.value as StateId))}
            data-avert-state-select
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
      </div>
    </div>
  );
}

export function StatesList() {
  return (
    <ErrorBoundary
      message={
        <>
          States select error. Please contact AVERT support at{" "}
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
      <StatesListContent />
    </ErrorBoundary>
  );
}
