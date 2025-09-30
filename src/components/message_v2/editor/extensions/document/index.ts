import { NodePos } from '@tiptap/core';
import { Document } from '@tiptap/extension-document';

const getLayoutNodePos = (nodePos: NodePos) => {
    const node = nodePos.node;
    if (node.type.name.startsWith('message'))
        return nodePos;

    const parentNodePos = nodePos.parent;
    if (!parentNodePos)
        return undefined;

    return getLayoutNodePos(parentNodePos);
};

export const MessageEditorDocumentExtension = Document.extend({
    content: 'messages',

    addKeyboardShortcuts() {
        return {
            'Mod-a': ({ editor }) => {
                // 現在のカーソル位置を取得
                const currentCursorResolvedPos = editor.state.selection.$head;
                const currentCursorNodePos = editor.$pos(currentCursorResolvedPos.pos);

                // 現在のカーソル位置から親に向かって一番近いレイアウト要素を取得
                let closestLayoutNodePos = getLayoutNodePos(currentCursorNodePos);
                if (!closestLayoutNodePos)
                    closestLayoutNodePos = currentCursorNodePos;

                // レイアウト要素内をすべて選択
                return editor
                    .chain()
                    .setTextSelection({
                        from: closestLayoutNodePos.from,
                        to: closestLayoutNodePos.to - 1
                    })
                    .scrollIntoView()
                    .run();
            },
            'Mod-A': ({ editor }) => {
                // 現在のカーソル位置を取得
                const currentCursorResolvedPos = editor.state.selection.$head;
                const currentCursorNodePos = editor.$pos(currentCursorResolvedPos.pos);

                // 現在のカーソル位置から親に向かって一番近いレイアウト要素を取得
                let closestLayoutNodePos = getLayoutNodePos(currentCursorNodePos);
                if (!closestLayoutNodePos)
                    closestLayoutNodePos = currentCursorNodePos;

                // レイアウト要素内をすべて選択
                return editor
                    .chain()
                    .setTextSelection({
                        from: closestLayoutNodePos.from,
                        to: closestLayoutNodePos.to - 1
                    })
                    .scrollIntoView()
                    .run();
            }
        };
    }
});
