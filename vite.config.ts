import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig, loadEnv } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), "");

	const SERVER_PORT = Number(env.CLIENT_PORT);

	// Only the dev server needs a port; `vite build` (CI, Docker) does not.
	if (mode === "development" && !SERVER_PORT) {
		throw new Error("No valid port found in .env.local (CLIENT_PORT)");
	}

	return {
		plugins: [
			TanStackRouterVite(),
			...(mode === "development" ? [devtools()] : []),
			viteReact({
				babel: {
					plugins: ["babel-plugin-react-compiler"],
				},
			}),
			ViteImageOptimizer({
				png: { quality: 80 },
				jpeg: { quality: 75 },
				webp: { quality: 80 },
				avif: { quality: 70 },
			}),
			tailwindcss(),
			visualizer({
				filename: "dist/stats.html",
				gzipSize: true,
				brotliSize: true,
			}),
		],
		optimizeDeps: {
			exclude: ["@electric-sql/pglite"],
		},
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
