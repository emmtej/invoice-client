import { useShallow } from "zustand/react/shallow";
import { ActiveSessionView } from "./components/ActiveSessionView";
import { BoothHeader } from "./components/BoothHeader";
import { BoothLayout } from "./components/BoothLayout";
import { BoothModals } from "./components/BoothModals";
import { CompletedSessionView } from "./components/CompletedSessionView";
import { SelectionView } from "./components/SelectionView";
import { useBoothInitialization } from "./hooks/useBoothInitialization";
import { useBoothStore } from "./store/useBoothStore";

export default function BoothView() {
	useBoothInitialization();

	const { status, isSelectionMode, isSessionMode } = useBoothStore(
		useShallow((s) => ({
			status: s.status,
			isSelectionMode: s.isSelectionMode(),
			isSessionMode: s.isSessionMode(),
		})),
	);

	return (
		<BoothLayout>
			<BoothHeader />

			{isSelectionMode && <SelectionView />}

			{isSessionMode && status !== "completed" && <ActiveSessionView />}

			{status === "completed" && <CompletedSessionView />}

			<BoothModals />
		</BoothLayout>
	);
}
