import { Node } from '@tiptap/core';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        lineBreak: {
            setLineBreak: () => ReturnType;
        };
    }
}

export const MessageEditorLineBreakExtension = Node.create({
    name: 'lineBreak',

    group: 'inline',

    inline: true,

    selectable: false,

    linebreakReplacement: true,

    addCommands() {
        return {
            setLineBreak: () => ({ editor, state, commands, chain }) => {
                return commands.first([
                    () => commands.exitCode(),
                    () => commands.command(() => {
                        const { selection, storedMarks } = state;

                        if (selection.$from.parent.type.spec.isolating)
                            return false;

                        const { keepMarks } = this.options;
                        const { splittableMarks } = editor.extensionManager;
                        const marks = storedMarks || (selection.$to.parentOffset && selection.$from.marks());

                        return chain()
                            .insertContent({ type: this.name })
                            .command(({ tr, dispatch }) => {
                                if (dispatch && marks && keepMarks)
                                    tr.ensureMarks(marks.filter((mark) => splittableMarks.includes(mark.type.name)));

                                return true;
                            })
                            .run();
                    })
                ]);
            }
        };
    },

    parseHTML() {
        return [
            {
                tag: 'br'
            }
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['br', HTMLAttributes];
    },

    renderText() {
        return '\n';
    }
});
