import { MessageEditorConfigExtensionStorage } from '@/components/message_v2';
import {
    formatTimestamp,
    messageHeaderClasses,
    MessageHeaderTimestampElement
} from '@lunaproject/web-discord-components';
import { Node } from '@tiptap/core';
import { DateTime } from 'luxon';

export const MessageEditorMessageHeaderTimestampExtension = Node.create({
    name: 'messageHeaderTimestamp',

    group: 'layout',

    selectable: false,

    draggable: false,

    parseHTML() {
        return [
            {
                tag: `${MessageHeaderTimestampElement}.${messageHeaderClasses.timestamp}`
            }
        ];
    },

    renderHTML() {
        const {
            appearance: { display = 'cozy' },
            locale,
            translations
        }: MessageEditorConfigExtensionStorage = this.editor?.storage.config;

        if (display === 'compact') {
            return [
                MessageHeaderTimestampElement as string,
                {
                    class: messageHeaderClasses.timestamp,
                    style: `width: ${locale === 'en' ? '3.1rem' : '2.25rem'}`
                },
                DateTime.now().toFormat(translations.timestamp_time_short)
            ];
        }

        return [
            MessageHeaderTimestampElement as string,
            {
                class: messageHeaderClasses.timestamp
            },
            formatTimestamp(
                'now',
                {
                    today: translations.timestamp_today ?? '\'Today at\' h:mm a',
                    yesterday: translations.timestamp_yesterday ?? '\'Yesterday at\' h:mm a',
                    tomorrow: translations.timestamp_tomorrow ?? '\'Tomorrow at\' h:mm a',
                    other: translations.timestamp_other ?? 'MM/dd/yyyy h:mm a'
                }
            )
        ];
    }
});
