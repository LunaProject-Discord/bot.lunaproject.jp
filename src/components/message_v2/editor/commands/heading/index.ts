import {
    EditorInsertHeadingLargeCommand,
    EditorInsertHeadingMediumCommand,
    EditorInsertHeadingSmallCommand,
    EditorToggleHeadingLargeCommand,
    EditorToggleHeadingMediumCommand,
    EditorToggleHeadingSmallCommand,
    LocalizedEditorCommandFactory,
    LocalizedEditorRibbonButtonFactory
} from '@/components/editor';
import { asRibbonButton } from '@lunaproject/web-editor';

export const MessageEditorToggleHeadingLargeCommand: LocalizedEditorCommandFactory = (localization) => ({
    ...EditorToggleHeadingLargeCommand(localization),
    disabled: ({ editor }) => !editor.can().toggleHeading({ level: 1 }),
    selected: ({ editor }) => editor.isActive('heading', { level: 1 }),
    perform: ({ editor }) => editor.chain().focus().toggleHeading({ level: 1 }).run()
});

export const MessageEditorToggleHeadingMediumCommand: LocalizedEditorCommandFactory = (localization) => ({
    ...EditorToggleHeadingMediumCommand(localization),
    disabled: ({ editor }) => !editor.can().toggleHeading({ level: 2 }),
    selected: ({ editor }) => editor.isActive('heading', { level: 2 }),
    perform: ({ editor }) => editor.chain().focus().toggleHeading({ level: 2 }).run()
});

export const MessageEditorToggleHeadingSmallCommand: LocalizedEditorCommandFactory = (localization) => ({
    ...EditorToggleHeadingSmallCommand(localization),
    disabled: ({ editor }) => !editor.can().toggleHeading({ level: 3 }),
    selected: ({ editor }) => editor.isActive('heading', { level: 3 }),
    perform: ({ editor }) => editor.chain().focus().toggleHeading({ level: 3 }).run()
});

export const MessageEditorInsertHeadingLargeCommand: LocalizedEditorCommandFactory = (localization) => ({
    ...EditorInsertHeadingLargeCommand(localization),
    disabled: ({ editor }) => !editor.can().insertContent({ type: 'heading', level: 1 }),
    perform: ({ editor, state }) => {
        const currentChain = editor.chain().focus();

        const currentNodePos = editor.$pos(state.selection.from);
        const currentNode = currentNodePos.node;

        if (currentNode.type.name !== 'paragraph' || currentNode.textContent.length > 0)
            currentChain.selectTextblockEnd();
        if (editor.isActive('image') || editor.isActive('video') || editor.isActive('audio'))
            currentChain.createParagraphNear();

        return currentChain.insertContent({ type: 'heading', level: 1 }).run();
    }
});

export const MessageEditorInsertHeadingMediumCommand: LocalizedEditorCommandFactory = (localization) => ({
    ...EditorInsertHeadingMediumCommand(localization),
    disabled: ({ editor }) => !editor.can().insertContent({ type: 'heading', level: 2 }),
    perform: ({ editor, state }) => {
        const currentChain = editor.chain().focus();

        const currentNodePos = editor.$pos(state.selection.from);
        const currentNode = currentNodePos.node;

        if (currentNode.type.name !== 'paragraph' || currentNode.textContent.length > 0)
            currentChain.selectTextblockEnd();
        if (editor.isActive('image') || editor.isActive('video') || editor.isActive('audio'))
            currentChain.createParagraphNear();

        return currentChain.insertContent({ type: 'heading', level: 2 }).run();
    }
});

export const MessageEditorInsertHeadingSmallCommand: LocalizedEditorCommandFactory = (localization) => ({
    ...EditorInsertHeadingSmallCommand(localization),
    disabled: ({ editor }) => !editor.can().insertContent({ type: 'heading', level: 3 }),
    perform: ({ editor, state }) => {
        const currentChain = editor.chain().focus();

        const currentNodePos = editor.$pos(state.selection.from);
        const currentNode = currentNodePos.node;

        if (currentNode.type.name !== 'paragraph' || currentNode.textContent.length > 0)
            currentChain.selectTextblockEnd();
        if (editor.isActive('image') || editor.isActive('video') || editor.isActive('audio'))
            currentChain.createParagraphNear();

        return currentChain.insertContent({ type: 'heading', level: 3 }).run();
    }
});

export const MessageEditorToggleHeadingLargeRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => {
    const { translations } = localization;

    return asRibbonButton(
        MessageEditorToggleHeadingLargeCommand(localization),
        {
            label: undefined,
            accessKey: '1',
            tooltip: {
                children: translations.heading_large
            }
        }
    );
};

export const MessageEditorToggleHeadingMediumRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => {
    const { translations } = localization;

    return asRibbonButton(
        MessageEditorToggleHeadingMediumCommand(localization),
        {
            label: undefined,
            accessKey: '2',
            tooltip: {
                children: translations.heading_medium
            }
        }
    );
};

export const MessageEditorToggleHeadingSmallRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => {
    const { translations } = localization;

    return asRibbonButton(
        MessageEditorToggleHeadingSmallCommand(localization),
        {
            label: undefined,
            accessKey: '3',
            tooltip: {
                children: translations.heading_small
            }
        }
    );
};

export const MessageEditorInsertHeadingLargeRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => asRibbonButton(
    MessageEditorInsertHeadingLargeCommand(localization),
    {
        accessKey: '1'
    }
);

export const MessageEditorInsertHeadingMediumRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => asRibbonButton(
    MessageEditorInsertHeadingMediumCommand(localization),
    {
        accessKey: '2'
    }
);

export const MessageEditorInsertHeadingSmallRibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => asRibbonButton(
    MessageEditorInsertHeadingSmallCommand(localization),
    {
        accessKey: '3'
    }
);
