import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "virtual:uno.css";
import "./styles/theme.css";
import { render } from "solid-js/web";
import App from "./App";

const root = document.getElementById("root");
if (!root) throw new Error("Root element not found");

render(() => <App />, root);
