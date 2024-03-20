import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// ---
import { App } from "@/components/App";
import "@/preflight.css"; // Tailwind CSS preflight styles, scoped to .twpf
import "@/styles.css";

const container = document.getElementById("root") as HTMLElement;
const root = createRoot(container);

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
);
