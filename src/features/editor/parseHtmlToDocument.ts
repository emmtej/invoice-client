const DOC_TYPE: DOMParserSupportedType = "text/html";

export class HtmlParseError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "HtmlParseError";
	}
}

export function parseHtmlToDocument(content: string): Document {
	const parser = new DOMParser();
	const doc = parser.parseFromString(content, DOC_TYPE);

	const parserError = doc.querySelector("parsererror");
	if (parserError) {
		throw new HtmlParseError(
			parserError.textContent ?? "Failed to parse HTML content",
		);
	}

	return doc;
}
