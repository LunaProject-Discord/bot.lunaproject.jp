import { mergeAttributes, Node } from '@tiptap/core';

export const ImageElementType = 'img';

export interface ImageOptions {
    HTMLAttributes: Record<string, any>;
}

export const Image = Node.create<ImageOptions>({
    name: 'image',

    group: 'block',

    draggable() {
        return this.editor?.isEditable !== false;
    },

    selectable: true,

    isolating: true,

    content: 'inline*',

    addOptions() {
        return {
            HTMLAttributes: {}
        };
    },

    addAttributes() {
        return {
            src: {
                default: null
            },
            alt: {
                default: null
            }
        };
    },

    parseHTML() {
        return [
            {
                tag: `${ImageElementType}[src]`
            },
            {
                tag: 'figure',
                getAttrs: (element) => {
                    const firstElementChild = element.firstElementChild;
                    if (!firstElementChild || firstElementChild.tagName !== ImageElementType.toUpperCase() || !firstElementChild.hasAttribute('src'))
                        return false;

                    const lastElementChild = element.lastElementChild;
                    if (element.childElementCount >= 2 && (!lastElementChild || lastElementChild.tagName !== 'FIGCAPTION'))
                        return false;

                    return {
                        src: firstElementChild.getAttribute('src'),
                        alt: firstElementChild.getAttribute('alt')
                    };
                }
            }
        ];
    },

    renderHTML({ node, HTMLAttributes }) {
        const attrs = mergeAttributes(this.options.HTMLAttributes, HTMLAttributes);

        if (this.editor && !this.editor.isEditable) {
            if (node.textContent.length > 0) {
                return [
                    'figure',
                    {},
                    [
                        ImageElementType,
                        attrs
                    ],
                    [
                        'figcaption',
                        {},
                        0
                    ]
                ];
            } else {
                return [
                    ImageElementType,
                    attrs
                ];
            }
        }

        return [
            'figure',
            {},
            [
                ImageElementType,
                attrs
            ],
            [
                'figcaption',
                {},
                0
            ]
        ];
    },

    addKeyboardShortcuts() {
        return {
            'Enter': ({ editor }) => {
                const currentNodePos = editor.$pos(editor.state.selection.from);
                const currentNode = currentNodePos.node;
                if (currentNode.type.name !== this.name)
                    return false;

                if (currentNodePos.to - currentNodePos.pos === 1) {
                    // 要素の終端にカーソルがある場合、新しい段落を挿入する
                    return editor
                        .chain()
                        .insertContentAt(
                            currentNodePos.to,
                            {
                                type: 'paragraph'
                            }
                        )
                        .scrollIntoView()
                        .run();
                }

                // 要素の先頭にカーソルがあるかどうか
                const isCursorAtStart = currentNodePos.pos === currentNodePos.from;

                const currentChain = editor
                    .chain()
                    .deleteRange({ from: currentNodePos.pos, to: currentNodePos.to })
                    .insertContentAt(
                        currentNodePos.pos + (isCursorAtStart ? 1 : 0),
                        {
                            type: 'paragraph',
                            content: currentNode.content.content.map((node) => node.toJSON())
                        }
                    );

                if (!isCursorAtStart) {
                    currentChain.deleteRange({
                        from: currentNodePos.pos + 1,
                        to: currentNodePos.pos + (currentNodePos.pos - currentNodePos.from) + 2
                    });
                }

                return currentChain
                    .setTextSelection(currentNodePos.pos + 2)
                    .scrollIntoView()
                    .run();
            },
            'Backspace': ({ editor }) => {
                const selection = editor.state.selection;
                if (selection.from !== selection.to)
                    return false;

                const currentNodePos = editor.$pos(selection.from);
                // 要素の先頭にカーソルがなければ何もしない
                if (currentNodePos.pos !== currentNodePos.from)
                    return false;

                const currentNode = currentNodePos.node;
                if (currentNode.type.name === this.name) {
                    // バックスペースキーを押した要素が画像の場合。要素を削除する
                    return editor
                        .chain()
                        .setTextSelection(currentNodePos.from > 1 ? currentNodePos.from - 2 : 0)
                        .scrollIntoView()
                        .deleteRange({ from: currentNodePos.from - 1, to: currentNodePos.to })
                        .run();
                }

                if (currentNodePos.from < 3)
                    return false;

                const beforeNodePos = currentNodePos.before;
                if (!beforeNodePos)
                    return false;

                const beforeNode = beforeNodePos.node;
                if (beforeNode.type.name !== this.name)
                    return false;

                // バックスペースキーを押した要素の前の要素が画像の場合、既存のキャプションにマージする
                return editor
                    .chain()
                    .deleteRange({ from: currentNodePos.from - 1, to: currentNodePos.to })
                    .deleteRange({ from: beforeNodePos.from - 1, to: beforeNodePos.to })
                    .insertContentAt(
                        beforeNodePos.from - 1,
                        {
                            type: this.name,
                            attrs: beforeNode.attrs,
                            content: [
                                ...beforeNode.content.content.map((node) => node.toJSON()),
                                ...currentNode.content.content.map((node) => node.toJSON())
                            ]
                        }
                    )
                    .setTextSelection(beforeNodePos.to - 1)
                    .scrollIntoView()
                    .run();
            },
            'ArrowLeft': ({ editor }) => {
                const selection = editor.state.selection;
                if (selection.from !== selection.to)
                    return false;

                const currentNodePos = editor.$pos(selection.from);
                // 要素の先頭にカーソルがなければ何もしない
                if (currentNodePos.pos !== currentNodePos.from)
                    return false;

                const currentNode = currentNodePos.node;
                if (currentNode.type.name !== this.name)
                    return false;

                return editor
                    .chain()
                    .setTextSelection(currentNodePos.from > 1 ? currentNodePos.from - 2 : 0)
                    .scrollIntoView()
                    .run();
            }
        };
    }

    /*
    addProseMirrorPlugins() {
        return [
            new Plugin({
                props: {
                    handleDOMEvents: {
                        dragstart: (view, e) => {
                            const target = e.target;
                            if (!target || !(target instanceof HTMLElement))
                                return;

                            const pos = view.posAtDOM(target, 0);
                            const resolvedPos = view.state.doc.resolve(pos);

                            console.log({ target, pos, resolvedPos });

                            if (resolvedPos.parent.type !== this.type)
                                return;

                            const offsetX = e.offsetX;
                            const offsetY = e.offsetY;

                            const targetBeforeElement = getComputedStyle(target, '::before');
                            const width = parseInt(targetBeforeElement.width);
                            const height = parseInt(targetBeforeElement.height);
                            const top = parseInt(targetBeforeElement.top);
                            const left = parseInt(targetBeforeElement.left);
                            const x = left + width;
                            const y = top + height;

                            const result = offsetX >= left && offsetX <= x && offsetY >= top && offsetY <= y;
                            if (!result)
                                e.preventDefault();
                        }
                    }
                }
            })
        ];
    }
    */
});
