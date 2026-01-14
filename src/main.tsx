import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import reportWebVitals from "./reportWebVitals.ts";
import "./styles.css";

import { MantineProvider } from "@mantine/core";
import { router } from "./router.tsx";

const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<MantineProvider>
				<RouterProvider router={router} />
			</MantineProvider>
		</StrictMode>,
	);
}

reportWebVitals();
