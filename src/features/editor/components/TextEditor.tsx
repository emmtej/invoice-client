import { Link, RichTextEditor } from "@mantine/tiptap";
import Highlight from "@tiptap/extension-highlight";
import Placeholder from "@tiptap/extension-placeholder";
import SubScript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Box, Paper } from "@mantine/core";
import { type ReactNode, useEffect } from "react";

const normalizeHtml = (html: string) =>
	html.replace(/>[\r\n]+\s*</g, "><").trim();

interface TextEditorProps {
	content: string;
	onContentChange: (html: string) => void;
	additionalMenu?: ReactNode;
	placeholder?: string;
}

export function TextEditor({
	content,
	onContentChange,
	additionalMenu,
	placeholder = "Paste your script here or upload several to start...",
}: TextEditorProps) {
	const editor = useEditor({
		shouldRerenderOnTransaction: false,
		extensions: [
			StarterKit.configure({ link: false }),
			Link,
			Superscript,
			SubScript,
			Highlight,
			TextAlign.configure({ types: ["heading", "paragraph"] }),
			Placeholder.configure({
				placeholder,
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

		const normalizedContent = normalizeHtml(content);
		const normalizedEditorHtml = normalizeHtml(editor.getHTML());

		if (normalizedContent !== normalizedEditorHtml) {
			const { from, to } = editor.state.selection;
			editor.commands.setContent(content, { emitUpdate: false });

			// Preserve cursor position after reparse
			const maxPos = editor.state.doc.content.size;
			editor.commands.setTextSelection({
				from: Math.min(from, maxPos),
				to: Math.min(to, maxPos),
			});
		}
	}, [content, editor]);

	useEffect(() => {
		if (!editor) return;
		return () => {
			editor.destroy();
		};
	}, [editor]);

	return (
		<Paper
			radius="xl"
			p={48}
			bg="white"
			style={{
				position: "relative",
				overflow: "hidden",
				flex: 1,
				minHeight: 400,
				boxShadow: "0 25px 50px -12px rgba(45, 58, 49, 0.05)",
				display: "flex",
				flexDirection: "column",
			}}
		>
			{/* Paper Grain Overlay */}
			<Box
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					pointerEvents: "none",
					zIndex: 10,
					opacity: 0.015,
					backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
				}}
			/>

			<RichTextEditor
				editor={editor}
				className="flex h-full w-full flex-col"
				style={{ flex: 1, minHeight: 0, position: "relative", zIndex: 1 }}
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
		</Paper>
	);
}
