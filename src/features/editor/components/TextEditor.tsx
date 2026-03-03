import { Link, RichTextEditor } from "@mantine/tiptap";
import Highlight from "@tiptap/extension-highlight";
import SubScript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, type ReactNode } from "react";
import Placeholder from "@tiptap/extension-placeholder";

interface TextEditorProps {
	content: string;
	onContentChange: (html: string) => void;
	additionalMenu?: ReactNode;
}

export function TextEditor({
	content,
	onContentChange,
	additionalMenu,
}: TextEditorProps) {
	const editor = useEditor({
		shouldRerenderOnTransaction: true,
		extensions: [
			StarterKit.configure({ link: false }),
			Link,
			Superscript,
			SubScript,
			Highlight,
			TextAlign.configure({ types: ["heading", "paragraph"] }),
			Placeholder.configure({
				placeholder: "Paste your script here or upload several to start...",
			}),
		],

		onUpdate: ({ editor }) => {
			const html = editor.getHTML();
			onContentChange(html);
		},
		autofocus: "start",
		content,
	});

	useEffect(() => {
		// Waits for editor to render and sets initial content.
		if (!editor || content === undefined) return;

		if (content !== editor.getHTML()) {
			editor.commands.setContent(content);
		}
	}, [content, editor]);

	return (
		<RichTextEditor
			editor={editor}
			className="flex h-full w-full flex-col"
			style={{ flex: 1, minHeight: 0 }}
		>
			<RichTextEditor.Toolbar className="flex rich-text-editor-toolbar">
				<RichTextEditor.ControlsGroup>
					<RichTextEditor.Bold />
					<RichTextEditor.Italic />
					<RichTextEditor.Underline />
					<RichTextEditor.Strikethrough />
					<RichTextEditor.ClearFormatting />
					<RichTextEditor.Highlight />
					<RichTextEditor.Code />
				</RichTextEditor.ControlsGroup>

				<RichTextEditor.ControlsGroup>
					<RichTextEditor.Blockquote />
					<RichTextEditor.Hr />
					<RichTextEditor.BulletList />
					<RichTextEditor.OrderedList />
					<RichTextEditor.Subscript />
					<RichTextEditor.Superscript />
				</RichTextEditor.ControlsGroup>

				<RichTextEditor.ControlsGroup>
					<RichTextEditor.Undo />
					<RichTextEditor.Redo />
				</RichTextEditor.ControlsGroup>
				{/* Custom Functions */}
				{additionalMenu && (
					<RichTextEditor.ControlsGroup className="editor-additional-menu">
						{additionalMenu}
					</RichTextEditor.ControlsGroup>
				)}
			</RichTextEditor.Toolbar>
			<RichTextEditor.Content className="overflow-y-auto flex-1" />
		</RichTextEditor>
	);
}
