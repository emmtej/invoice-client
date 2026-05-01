import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import "./styles.css";

import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { reportWebVitals } from "./lib/vitals";
import { router } from "./router.tsx";
import { appTheme } from "./theme";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5,
			retry: 1,
		},
	},
});

const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<QueryClientProvider client={queryClient}>
				<MantineProvider theme={appTheme}>
					<Notifications position="bottom-right" zIndex={1000} />
					<ModalsProvider>
						<RouterProvider router={router} />
					</ModalsProvider>
				</MantineProvider>
				{import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
			</QueryClientProvider>
		</StrictMode>,
	);
}

reportWebVitals();
