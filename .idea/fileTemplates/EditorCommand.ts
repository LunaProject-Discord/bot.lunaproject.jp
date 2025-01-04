#set($name = ${NAME})
#set($extensionName = $name.substring(0, 1).toUpperCase() + $name.substring(1).toLowerCase())

import {
    asEditorCommand,
    LocalizedEditorCommandFactory,
    LocalizedEditorRibbonButtonFactory
} from '@/components/editor';
import { #[[$ICON_NAME$]]#Icon } from '@/components/icons';
import { asRibbonButton, ${extensionName}Command } from '@lunaproject/web-editor';

export const Editor${extensionName}Command: LocalizedEditorCommandFactory = ({ translations }) => asEditorCommand(
    ${extensionName}Command,
    {
        label: translations.#[[$TRANSLATION_KEY$]]#
    }
);

export const Editor${extensionName}RibbonButton: LocalizedEditorRibbonButtonFactory = (localization) => {
    const { translations } = localization;

    return asRibbonButton(
        Editor${extensionName}Command(localization),
        {
            icon: #[[$ICON_NAME$]]#Icon,
            label: undefined,
            accessKey: '#[[$ACCESS_KEY$]]#',
            tooltip: {
                children: translations.#[[$TRANSLATION_KEY$]]#
            }
        }
    );
};
