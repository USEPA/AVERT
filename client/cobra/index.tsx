import React from "react";
import { createRoot } from "react-dom/client";
import "@/styles.css";
// ---
import { COBRAPendingMessage } from "../src/components/COBRAPendingMessage";

const container = document.getElementById("avert-cobra") as HTMLElement;
const root = createRoot(container);

root.render(<COBRAPendingMessage />);
