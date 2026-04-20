import { fileURLToPath, URL } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import { ViteImageOptimizer } from "vite-plugin-image-optimizer";

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
			ViteImageOptimizer({
				png: { quality: 80 },
				jpeg: { quality: 75 },
				webp: { quality: 80 },
				avif: { quality: 70 },
			}),
			tailwindcss(),
			{
				name: "import-meta-resolve-polyfill",
				transform(code, _id) {
					if (code.includes("import.meta.resolve")) {
						return {
							code: code.replace(
								/import\.meta\.resolve/g,
								"((s, p) => new URL(s, p || import.meta.url).href)",
							),
							map: null,
						};
					}
				},
			},
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
