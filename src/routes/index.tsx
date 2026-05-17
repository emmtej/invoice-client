import { createFileRoute } from "@tanstack/react-router";
import HomeView from "@/features/home/HomeView";

export const Route = createFileRoute("/")({
	component: HomeView,
	staticData: {
		layoutMode: "flush",
		hideSidebar: true,
	},
});
