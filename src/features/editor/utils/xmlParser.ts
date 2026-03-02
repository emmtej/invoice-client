const DOC_TYPE: DOMParserSupportedType = "text/html";

export function xmlParser(content: string): Document {
	const parser = new DOMParser();
	return parser.parseFromString(content, DOC_TYPE);
}
