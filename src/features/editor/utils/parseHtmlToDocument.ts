const DOC_TYPE: DOMParserSupportedType = "text/html";

export function parseHtmlToDocument(content: string): Document {
	const parser = new DOMParser();
	const doc = parser.parseFromString(content, DOC_TYPE);

	const parserError = doc.querySelector("parsererror");
	if (parserError) {
		console.error("DOMParser error:", parserError.textContent);
		// In a real app we might throw or return a specific error structure,
		// but for now we'll log it. The existing flows will just see an empty-ish doc.
	}

	return doc;
}
