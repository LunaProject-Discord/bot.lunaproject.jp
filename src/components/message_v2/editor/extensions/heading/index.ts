import { headingClasses } from '@lunaproject/web-discord-components';
import { mergeAttributes } from '@tiptap/core';
import { Heading, HeadingOptions, Level } from '@tiptap/extension-heading';

export const MessageEditorHeadingExtension = Heading.extend<HeadingOptions>({
    addOptions() {
        return {
            ...this.parent?.(),
            levels: [1, 2, 3]
        };
    },

    renderHTML({ node, HTMLAttributes }) {
        const hasLevel = this.options.levels.includes(node.attrs.level);
        const level: Level = hasLevel ? node.attrs.level : this.options.levels[0];

        const classNames = [headingClasses.root];

        switch (level) {
            case 1:
                classNames.push(headingClasses.variantLarge);
                break;

            case 2:
                classNames.push(headingClasses.variantMedium);
                break;

            case 3:
                classNames.push(headingClasses.variantSmall);
                break;

            default:
                break;
        }

        return [
            `h${level}`,
            mergeAttributes(
                this.options.HTMLAttributes,
                HTMLAttributes,
                {
                    class: classNames.join(' ')
                }
            ),
            0
        ];
    }
});
