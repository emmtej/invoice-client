export interface ScriptOverview {
	validLines: number[];
	invalidLines: number[];
	actionLines: number[];
	scenes: number[];
	wordCount: number;
	totalLines: number;
}
export interface Script {
	id: string;
	name: string;
	source: Document;
	lines: ParsedLine[];
	overview: ScriptOverview;
	html: string;
}

export interface BaseLine {
	timestamp: string;
	speakers: string[];
	source: string;
}

export interface Action extends BaseLine {
	type: "action";
	notes: string[];
}

export interface Dialogue extends BaseLine {
	type: "dialogue";
	content: string;
	notes?: string[];
}

export interface Marker {
	type: "marker";
	source: string;
}

export interface Malformed {
	type: "malformed";
	message: string;
	source: string;
}

export interface InvalidLine {
	type: "invalid";
	source: string;
}

export type ParsedLine = Dialogue | Marker | InvalidLine | Malformed | Action;
