export interface Folder {
	id: string;
	name: string;
	parentId: string | null;
	createdAt: Date;
}

export interface FolderRow {
	id: string;
	name: string;
	parent_id: string | null;
	created_at: string;
}

export interface ScriptSummary {
	id: string;
	name: string;
	folderId: string | null;
	wordCount: number;
	invalidLineCount: number;
	createdAt: Date;
}

export interface ScriptSummaryRow {
	id: string;
	name: string;
	folder_id: string | null;
	overview: any;
	created_at: string;
}
