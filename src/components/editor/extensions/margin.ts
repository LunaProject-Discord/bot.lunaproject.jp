import { Extension } from '@tiptap/core';

export interface MarginOptions {
    types: string[],
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        margin: {
            setMargin: (value: string) => ReturnType,
            unsetMargin: () => ReturnType,
            setMarginTop: (value: string) => ReturnType,
            unsetMarginTop: () => ReturnType,
            setMarginBottom: (value: string) => ReturnType,
            unsetMarginBottom: () => ReturnType,
            setMarginLeft: (value: string) => ReturnType,
            unsetMarginLeft: () => ReturnType,
            setMarginRight: (value: string) => ReturnType,
            unsetMarginRight: () => ReturnType,
        };
    }
}

export const Margin = Extension.create<MarginOptions>({
    name: 'margin',

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
                    marginTop: {
                        default: null,
                        parseHTML: (element) => element.style.marginTop,
                        renderHTML: (attributes) => ({
                            style: `margin-top: ${attributes.marginTop}`
                        })
                    },
                    marginBottom: {
                        default: null,
                        parseHTML: (element) => element.style.marginBottom,
                        renderHTML: (attributes) => ({
                            style: `margin-bottom: ${attributes.marginBottom}`
                        })
                    },
                    marginLeft: {
                        default: null,
                        parseHTML: (element) => element.style.marginLeft,
                        renderHTML: (attributes) => ({
                            style: `margin-left: ${attributes.marginLeft}`
                        })
                    },
                    marginRight: {
                        default: null,
                        parseHTML: (element) => element.style.marginRight,
                        renderHTML: (attributes) => ({
                            style: `margin-right: ${attributes.marginRight}`
                        })
                    }
                }
            }
        ];
    },

    addCommands() {
        return {
            setMargin: (value: string) => ({ chain }) => {
                return chain()
                    .setMarginTop(value)
                    .setMarginBottom(value)
                    .setMarginLeft(value)
                    .setMarginRight(value)
                    .run();
            },
            unsetMargin: () => ({ chain }) => {
                return chain()
                    .unsetMarginTop()
                    .unsetMarginBottom()
                    .unsetMarginLeft()
                    .unsetMarginRight()
                    .run();
            },
            setMarginTop: (value: string) => ({ commands }) => {
                return this.options.types
                    .map((type) => commands.updateAttributes(type, { marginTop: value }))
                    .every((result) => result);
            },
            unsetMarginTop: () => ({ commands }) => {
                return this.options.types
                    .map((type) => commands.updateAttributes(type, { marginTop: null }))
                    .every((result) => result);
            },
            setMarginBottom: (value: string) => ({ commands }) => {
                return this.options.types
                    .map((type) => commands.updateAttributes(type, { marginBottom: value }))
                    .every((result) => result);
            },
            unsetMarginBottom: () => ({ commands }) => {
                return this.options.types
                    .map((type) => commands.updateAttributes(type, { marginBottom: null }))
                    .every((result) => result);
            },
            setMarginLeft: (value: string) => ({ commands }) => {
                return this.options.types
                    .map((type) => commands.updateAttributes(type, { marginLeft: value }))
                    .every((result) => result);
            },
            unsetMarginLeft: () => ({ commands }) => {
                return this.options.types
                    .map((type) => commands.updateAttributes(type, { marginLeft: null }))
                    .every((result) => result);
            },
            setMarginRight: (value: string) => ({ commands }) => {
                return this.options.types
                    .map((type) => commands.updateAttributes(type, { marginRight: value }))
                    .every((result) => result);
            },
            unsetMarginRight: () => ({ commands }) => {
                return this.options.types
                    .map((type) => commands.updateAttributes(type, { marginRight: null }))
                    .every((result) => result);
            }
        };
    }
});
