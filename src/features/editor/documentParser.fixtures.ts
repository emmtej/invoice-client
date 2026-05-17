export const PARSER_FIXTURES = {
	simple: {
		name: "Simple Script",
		html: `
			<h3>Scene 1</h3>
			<p>00:01 Speaker: Hello world</p>
			<p>00:02 Another: This is a test</p>
		`,
		expectedLines: 3,
		expectedWords: 6,
	},
	complex: {
		name: "Complex Script",
		html: `
			<h3>Scene 1</h3>
			<p>00:01 Alice & Bob: Combined speakers</p>
			<p>00:02 Alice (Whispering): Quiet notes</p>
			<p>00:03 Bob: (Coughing)</p>
			<p>Invalid line without timestamp</p>
			<h3>SCENE 2</h3>
			<p>01:00:01 Long: H:MM:SS format</p>
		`,
		expectedLines: 7,
		expectedWords: 8, // "Combined speakers" (2) + "Quiet notes" (2) + "H:MM:SS format" (3) + 1? No, action line "(Coughing)" shouldn't count words.
	},
	edgeCases: {
		name: "Edge Case Script",
		html: `
			<p>  </p>
			<p>00:01 Speaker: </p>
			<p>SCENE</p>
			<p>00:01:01:01 Too many segments: Content</p>
		`,
		expectedLines: 3, // SCENE, Speaker: (malformed), Too many segments (malformed)
	},
};
