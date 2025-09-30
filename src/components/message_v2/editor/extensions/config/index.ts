import {
    Appearance,
    Config,
    ConfigTranslations,
    DefaultEnglishTranslations,
    DefaultJapaneseTranslations
} from '@lunaproject/web-discord-components';
import { Extension } from '@tiptap/core';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        config: {
            setAppearance: (appearance: Appearance) => ReturnType;
        };
    }
}

export interface MesaageEditorConfigExtensionOptions {
    appearance: Appearance;
    locale: Config['locale'];
}

export interface MessageEditorConfigExtensionStorage {
    appearance: Appearance;
    locale: Config['locale'];
    translations: ConfigTranslations;
}

export const MessageEditorConfigExtension = Extension.create<MesaageEditorConfigExtensionOptions, MessageEditorConfigExtensionStorage>({
    name: 'config',

    addOptions(): MesaageEditorConfigExtensionOptions {
        return {
            appearance: {
                color: 'dark',
                display: 'cozy'
            },
            locale: 'en'
        };
    },

    addStorage() {
        return {
            appearance: this.options.appearance,
            locale: this.options.locale,
            translations: this.options.locale === 'ja' ? DefaultJapaneseTranslations : DefaultEnglishTranslations
        };
    },

    addCommands() {
        return {
            setAppearance: (appearance) => ({ editor, state }) => {
                this.options.appearance = appearance;
                this.storage.appearance = appearance;

                // 現在の選択範囲を取得
                const { $from, $to } = state.selection;

                const currentChain = editor.chain().focus();

                const documentNodePos = editor.$doc;

                // Messages をすべて取得
                const messagesNodePoses = documentNodePos.querySelectorAll('messages');
                messagesNodePoses.forEach((messagesNodePos) => {
                    currentChain
                        .setNodeSelection(messagesNodePos.from)
                        .updateAttributes(
                            'messages',
                            {
                                color: appearance.color,
                                display: appearance.display
                            }
                        );
                });

                return currentChain
                    .setTextSelection({
                        from: $from.pos,
                        to: $to.pos
                    })
                    .run();
            }
        };
    }
});
