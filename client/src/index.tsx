import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
// ---
import { App } from "@/components/App";
import { store } from "@/redux/store";
import "@/preflight.css"; // Tailwind CSS preflight styles, scoped to .twpf
import "@/styles.css";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <App />
  </Provider>,
);
