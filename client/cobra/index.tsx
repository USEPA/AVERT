import React from "react";
import { createRoot } from "react-dom/client";
// ---
import { COBRAPendingMessage } from "../src/components/COBRAPendingMessage";
import "../src/styles.css";

const container = document.getElementById("avert-cobra") as HTMLElement;
const root = createRoot(container);

root.render(<COBRAPendingMessage />);
