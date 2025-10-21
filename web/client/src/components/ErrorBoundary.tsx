import { type ErrorInfo, type ReactNode, Component } from "react";
import clsx from "clsx";

type Props = {
  children: ReactNode;
  message?: ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_error: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    const { children, message } = this.props;
    const { hasError } = this.state;

    if (hasError) {
      return (
        <div className={clsx("usa-alert usa-alert--slim usa-alert--error")}>
          <div className={clsx("usa-alert__body")}>
            <p className={clsx("usa-alert__text")}>
              {message ?? (
                <>
                  AVERT application error. Please contact AVERT support at{" "}
                  <a
                    className={clsx("usa-link")}
                    href="mailto:avert@epa.gov"
                    target="_parent"
                    rel="noreferrer"
                  >
                    avert@epa.gov
                  </a>
                </>
              )}
            </p>
          </div>
        </div>
      );
    }

    return children;
  }
}
