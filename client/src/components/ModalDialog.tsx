import { Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
// ---
import { useAppDispatch, useAppSelector } from "@/redux/index";
import { resetModalDialog } from "@/redux/reducers/panel";

export function ModalDialog() {
  const dispatch = useAppDispatch();
  const { displayed, description } = useAppSelector(
    ({ panel }) => panel.modalDialog,
  );

  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <Transition.Root show={displayed} as={Fragment}>
      <Dialog
        as="div"
        className={clsx("tw:relative tw:z-10")}
        initialFocus={cancelRef}
        open={displayed}
        onClose={(_ev) => dispatch(resetModalDialog())}
      >
        <Transition.Child
          as={Fragment}
          enter="tw:duration-300 tw:ease-out"
          enterFrom="tw:opacity-0"
          enterTo="tw:opacity-100"
          leave="tw:duration-200 tw:ease-in"
          leaveFrom="tw:opacity-100"
          leaveTo="tw:opacity-0"
        >
          <div
            className={clsx(
              "tw:fixed tw:inset-0 tw:bg-black/70 tw:transition-colors",
            )}
          />
        </Transition.Child>

        <div className={clsx("tw:fixed tw:inset-0 tw:z-10 tw:overflow-y-auto")}>
          <div
            className={clsx(
              "tw:flex tw:min-h-full tw:items-end tw:justify-center tw:p-4",
              "tw:sm:items-center",
            )}
          >
            <Transition.Child
              as={Fragment}
              enter="tw:duration-300 tw:ease-out"
              enterFrom="tw:translate-y-4 tw:opacity-0 tw:sm:translate-y-0"
              enterTo="tw:translate-y-0 tw:opacity-100"
              leave="tw:duration-200 tw:ease-in"
              leaveFrom="tw:translate-y-0 tw:opacity-100"
              leaveTo="tw:translate-y-4 tw:opacity-0 tw:sm:translate-y-0"
            >
              <Dialog.Panel
                className={clsx(
                  "tw:relative tw:transform tw:overflow-hidden tw:rounded-lg tw:bg-white tw:p-4 tw:shadow-xl tw:transition-all",
                  "tw:sm:w-full tw:sm:max-w-xl tw:sm:p-6",
                )}
              >
                <div className="twpf">
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
                      onClick={(_ev) => dispatch(resetModalDialog())}
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
                  <div className="usa-prose">{description}</div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
