import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");

	const SERVER_PORT = Number(env.CLIENT_PORT);

	if (!SERVER_PORT) {
		throw new Error("No valid port found in .env.local (CLIENT_PORT)");
	}

	return {
		plugins: [
			devtools(),
			viteReact({
				babel: {
					plugins: ["babel-plugin-react-compiler"],
				},
			}),
			tailwindcss(),
		],
		resolve: {
			alias: {
				"@": fileURLToPath(new URL("./src", import.meta.url)),
			},
		},
		server: {
			port: SERVER_PORT,
			strictPort: true,
		},
	};
});
