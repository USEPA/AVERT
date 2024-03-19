import { render } from "react-dom";
import { Provider } from "react-redux";
// ---
import { App } from "@/app/components/App";
import { store } from "@/app/redux/store";
import "@/preflight.css"; // Tailwind CSS preflight styles, scoped to .twpf
import "@/styles.css";

const container = document.getElementById("root") as HTMLElement;

render(
  <Provider store={store}>
    <App />
  </Provider>,
  container,
);
