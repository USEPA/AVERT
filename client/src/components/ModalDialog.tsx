import { useRef } from "react";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
// ---
import { useAppDispatch, useAppSelector } from "@/redux/index";
import { closeModalDialog } from "@/redux/reducers/panel";

export function ModalDialog() {
  const dispatch = useAppDispatch();
  const { displayed, description } = useAppSelector(
    ({ panel }) => panel.modalDialog,
  );

  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <Dialog
      className={clsx("tw:relative tw:z-10")}
      initialFocus={cancelRef}
      open={displayed}
      onClose={(_ev) => dispatch(closeModalDialog())}
    >
      <DialogBackdrop
        transition
        className={clsx(
          "tw:fixed tw:inset-0 tw:bg-black/70",
          "tw:transition tw:!duration-100",
          "tw:data-closed:opacity-0",
          "tw:data-enter:ease-out",
          "tw:data-leave:ease-in",
        )}
      />

      <div className={clsx("tw:fixed tw:inset-0 tw:z-10 tw:overflow-y-auto")}>
        <div
          className={clsx(
            "tw:flex tw:min-h-full tw:items-end tw:justify-center tw:p-4",
            "tw:sm:items-center",
          )}
        >
          <DialogPanel
            transition
            className={clsx(
              "tw:relative tw:transform tw:overflow-hidden tw:rounded-lg tw:bg-white tw:p-4 tw:shadow-xl",
              "tw:transition tw:!duration-100",
              "tw:sm:w-full tw:sm:max-w-xl tw:sm:p-6",
              "tw:data-closed:opacity-0 tw:data-closed:sm:translate-y-0",
              "tw:data-enter:ease-out",
              "tw:data-leave:ease-in",
            )}
          >
            <div className={clsx("twpf")}>
              <div
                className={clsx(
                  "tw:absolute tw:top-0 tw:right-0 tw:pt-4 tw:pr-4",
                )}
              >
                <button
                  type="button"
                  className={clsx(
                    "tw:rounded-md tw:bg-white tw:text-gray-400 tw:transition-none",
                    "tw:hover:text-gray-700",
                    "tw:focus:text-gray-700",
                  )}
                  onClick={(_ev) => dispatch(closeModalDialog())}
                >
                  <span className={clsx("tw:sr-only")}>Close</span>
                  <XMarkIcon
                    className={clsx("tw:size-6 tw:transition-none")}
                    aria-hidden="true"
                  />
                </button>
              </div>
            </div>

            <div className={clsx("tw:m-4")}>
              <div className={clsx("usa-prose")}>{description}</div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
