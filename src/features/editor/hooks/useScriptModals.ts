import { useDisclosure } from "@mantine/hooks";

export function useScriptModals() {
	const [clearAllOpened, { open: openClearAll, close: closeClearAll }] =
		useDisclosure(false);
	const [saveOpened, { open: openSave, close: closeSave }] =
		useDisclosure(false);

	return {
		clearAll: {
			opened: clearAllOpened,
			open: openClearAll,
			close: closeClearAll,
		},
		save: { opened: saveOpened, open: openSave, close: closeSave },
	};
}
