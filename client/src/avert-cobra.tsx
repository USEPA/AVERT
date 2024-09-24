import { createRoot } from "react-dom/client";
import "@/styles.css";
// ---
import { CommunicatingIcons } from "./components/LoadingIcon";

const container = document.getElementById("avert-cobra") as HTMLElement;
const root = createRoot(container);

root.render(<CommunicatingIcons />);
