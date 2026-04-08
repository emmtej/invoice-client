export { initDb, getDb, resetDb } from "./pgliteClient";
export {
	initSchema,
	getFoldersAtLevel,
	getAllFolders,
	createFolder,
	deleteFolder,
	getFolderBreadcrumb,
	getScriptCountInFolder,
} from "./folderQueries";
export type {
	Folder,
	FolderRow,
	ScriptSummary,
	ScriptSummaryRow,
} from "./types";
