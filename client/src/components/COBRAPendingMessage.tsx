import { LoadingIcon } from "@/components/LoadingIcon";
import { COBRAHeartbeat } from "@/components/COBRAHeartbeat";

export function COBRAPendingMessage() {
  return (
    <>
      <div className="usa-alert usa-alert--slim usa-alert--info">
        <div className="usa-alert__body">
          <p className="usa-alert__text">
            Sending data to COBRA. This may take a few minutes.
          </p>
        </div>
      </div>

      <div className="-tw-mb-10 -tw-mt-16 tw-flex tw-scale-50 tw-items-center tw-justify-center">
        <LoadingIcon />

        <div className="tw-ml-2 tw-mr-4 tw-flex tw-gap-3">
          <div className="tw-h-3 tw-w-3 tw-animate-pulse tw-rounded-full tw-bg-[--avert-blue]" />
          <div className="tw-h-3 tw-w-3 tw-animate-pulse tw-rounded-full tw-bg-[--avert-blue]" />
          <div className="tw-h-3 tw-w-3 tw-animate-pulse tw-rounded-full tw-bg-[--avert-blue]" />
        </div>

        <COBRAHeartbeat />
      </div>
    </>
  );
}
