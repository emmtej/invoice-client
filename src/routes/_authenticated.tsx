import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { useUserStore } from "@/features/user/store/userStore";

export const Route = createFileRoute("/_authenticated")({
	beforeLoad: ({ location }) => {
		if (!useUserStore.getState().user) {
			throw redirect({
				to: "/login",
				search: {
					redirect: location.href,
				},
			});
		}
	},
	component: () => <Outlet />,
});
