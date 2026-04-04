import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import "./styles.css";

import { MantineProvider } from "@mantine/core";
import { router } from "./router.tsx";
import { appTheme } from "./theme";

const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<MantineProvider theme={appTheme}>
				<RouterProvider router={router} />
			</MantineProvider>
		</StrictMode>,
	);
}
