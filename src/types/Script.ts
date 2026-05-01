export interface ScriptOverview {
	validLines: number[];
	invalidLines: number[];
	actionLines: number[];
	scenes: number[];
	wordCount: number;
	totalLines: number;
}

export interface ScriptMetadata {
	id: string;
	name: string;
	overview: ScriptOverview;
	groupName?: string;
	label?: string;
	folderId?: string | null;
	lastAccessedAt?: Date | null;
	createdAt: Date;
}

export interface Script extends ScriptMetadata {
	source?: Document;
	lines: ParsedLine[];
	html: string;
}

export interface BaseLine {
	timestamp: string;
	speakers: string[];
	source: string;
	id?: string;
}

export interface Action extends BaseLine {
	type: "action";
	notes: string[];
}

export interface DialogueMetadata {
	wordCount: number;
}

export interface Dialogue extends BaseLine {
	type: "dialogue";
	content: string;
	metadata: DialogueMetadata;
	notes?: string[];
}

export interface Marker {
	type: "marker";
	source: string;
	id?: string;
}

export interface Malformed {
	type: "malformed";
	message: string;
	source: string;
	id?: string;
}

export interface InvalidLine {
	type: "invalid";
	source: string;
	id?: string;
}

export type ParsedLine = Dialogue | Marker | InvalidLine | Malformed | Action;
