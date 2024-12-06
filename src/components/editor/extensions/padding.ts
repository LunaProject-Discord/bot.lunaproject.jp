import { Extension } from '@tiptap/core';

export interface PaddingOptions {
    types: string[],
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        padding: {
            setPadding: (value: string) => ReturnType,
            unsetPadding: () => ReturnType,
            setPaddingTop: (value: string) => ReturnType,
            unsetPaddingTop: () => ReturnType,
            setPaddingBottom: (value: string) => ReturnType,
            unsetPaddingBottom: () => ReturnType,
            setPaddingLeft: (value: string) => ReturnType,
            unsetPaddingLeft: () => ReturnType,
            setPaddingRight: (value: string) => ReturnType,
            unsetPaddingRight: () => ReturnType,
        };
    }
}

export const Padding = Extension.create<PaddingOptions>({
    name: 'padding',

    addOptions() {
        return {
            types: ['heading', 'paragraph', 'blockquote']
        };
    },

    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    paddingTop: {
                        default: null,
                        parseHTML: (element) => element.style.paddingTop,
                        renderHTML: (attributes) => ({
                            style: `padding-top: ${attributes.paddingTop}`
                        })
                    },
                    paddingBottom: {
                        default: null,
                        parseHTML: (element) => element.style.paddingBottom,
                        renderHTML: (attributes) => ({
                            style: `padding-bottom: ${attributes.paddingBottom}`
                        })
                    },
                    paddingLeft: {
                        default: null,
                        parseHTML: (element) => element.style.paddingLeft,
                        renderHTML: (attributes) => ({
                            style: `padding-left: ${attributes.paddingLeft}`
                        })
                    },
                    paddingRight: {
                        default: null,
                        parseHTML: (element) => element.style.paddingRight,
                        renderHTML: (attributes) => ({
                            style: `padding-right: ${attributes.paddingRight}`
                        })
                    }
                }
            }
        ];
    },

    addCommands() {
        return {
            setPadding: (value: string) => ({ chain }) => {
                return chain()
                    .setPaddingTop(value)
                    .setPaddingBottom(value)
                    .setPaddingLeft(value)
                    .setPaddingRight(value)
                    .run();
            },
            unsetPadding: () => ({ chain }) => {
                return chain()
                    .unsetPaddingTop()
                    .unsetPaddingBottom()
                    .unsetPaddingLeft()
                    .unsetPaddingRight()
                    .run();
            },
            setPaddingTop: (value: string) => ({ commands }) => {
                return this.options.types
                    .map((type) => commands.updateAttributes(type, { paddingTop: value }))
                    .every((result) => result);
            },
            unsetPaddingTop: () => ({ commands }) => {
                return this.options.types
                    .map((type) => commands.updateAttributes(type, { paddingTop: null }))
                    .every((result) => result);
            },
            setPaddingBottom: (value: string) => ({ commands }) => {
                return this.options.types
                    .map((type) => commands.updateAttributes(type, { paddingBottom: value }))
                    .every((result) => result);
            },
            unsetPaddingBottom: () => ({ commands }) => {
                return this.options.types
                    .map((type) => commands.updateAttributes(type, { paddingBottom: null }))
                    .every((result) => result);
            },
            setPaddingLeft: (value: string) => ({ commands }) => {
                return this.options.types
                    .map((type) => commands.updateAttributes(type, { paddingLeft: value }))
                    .every((result) => result);
            },
            unsetPaddingLeft: () => ({ commands }) => {
                return this.options.types
                    .map((type) => commands.updateAttributes(type, { paddingLeft: null }))
                    .every((result) => result);
            },
            setPaddingRight: (value: string) => ({ commands }) => {
                return this.options.types
                    .map((type) => commands.updateAttributes(type, { paddingRight: value }))
                    .every((result) => result);
            },
            unsetPaddingRight: () => ({ commands }) => {
                return this.options.types
                    .map((type) => commands.updateAttributes(type, { paddingRight: null }))
                    .every((result) => result);
            }
        };
    }
});
