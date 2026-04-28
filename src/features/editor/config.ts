import EditorPage from "@/pages/editor/EditorPage";
import type { FeatureConfig } from "@/types/navigation";

export const editorConfig: FeatureConfig = {
	routes: {
		public: [
			{
				label: "Editor",
				path: "/editor",
				component: EditorPage,
			},
		],
	},
};
