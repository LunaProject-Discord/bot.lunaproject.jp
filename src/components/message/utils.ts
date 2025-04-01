import { MessageData, MessageEmbedData, MessageEmbedField, MessageTimestampData } from '@/interfaces/message';
import { DeepPartial } from '@lunaproject/web-core/dist/utils';
import deepmerge from 'lodash/merge';
import { DateTime } from 'luxon';
import { useReducer } from 'react';

export const MessageBuilderActionType = {
    Clear: 'clear',

    SetContent: 'setContent',
    SetEmbeds: 'setEmbeds',
    AddEmbed: 'addEmbed',
    RemoveEmbed: 'removeEmbed',
    SetEmbedTitle: 'setEmbedTitle',
    SetEmbedDescription: 'setEmbedDescription',
    SetEmbedUrl: 'setEmbedUrl',
    SetEmbedColor: 'setEmbedColor',
    SetEmbedTimestamp: 'setEmbedTimestamp',
    SetEmbedAuthorName: 'setEmbedAuthorName',
    SetEmbedAuthorUrl: 'setEmbedAuthorUrl',
    SetEmbedAuthorIconUrl: 'setEmbedAuthorIconUrl',
    SetEmbedFooterText: 'setEmbedFooterText',
    SetEmbedFooterIconUrl: 'setEmbedFooterIconUrl',
    AddEmbedField: 'addEmbedField',
    RemoveEmbedField: 'removeEmbedField',
    SetEmbedFieldName: 'setEmbedFieldName',
    SetEmbedFieldValue: 'setEmbedFieldValue',
    SetEmbedFieldInline: 'setEmbedFieldInline',
    SetEmbedImage: 'setEmbedImage',
    SetEmbedThumbnail: 'setEmbedThumbnail'
} as const;

type MessageBuilderClearAction = {
    type: typeof MessageBuilderActionType.Clear;
};

type MessageBuilderSetContentAction = {
    type: typeof MessageBuilderActionType.SetContent;
    value: string;
};

type MessageBuilderSetEmbedsAction = {
    type: typeof MessageBuilderActionType.SetEmbeds;
    value: MessageEmbedData[];
};

type MessageBuilderAddEmbedAction = {
    type: typeof MessageBuilderActionType.AddEmbed;
};

type MessageBuilderSetEmbedAction = { index: number; };

type MessageBuilderRemoveEmbedAction = MessageBuilderSetEmbedAction & {
    type: typeof MessageBuilderActionType.RemoveEmbed;
};

type MessageBuilderSetEmbedTitleAction = MessageBuilderSetEmbedAction & {
    type: typeof MessageBuilderActionType.SetEmbedTitle;
    value: string;
};

type MessageBuilderSetEmbedDescriptionAction = MessageBuilderSetEmbedAction & {
    type: typeof MessageBuilderActionType.SetEmbedDescription;
    value: string;
};

type MessageBuilderSetEmbedUrlAction = MessageBuilderSetEmbedAction & {
    type: typeof MessageBuilderActionType.SetEmbedUrl;
    value: string;
};

type MessageBuilderSetEmbedColorAction = MessageBuilderSetEmbedAction & {
    type: typeof MessageBuilderActionType.SetEmbedColor;
    value: number | null;
};

type MessageBuilderSetEmbedTimestampAction = MessageBuilderSetEmbedAction & {
    type: typeof MessageBuilderActionType.SetEmbedTimestamp;
    value: DateTime<true> | 'now' | null;
};

type MessageBuilderSetEmbedAuthorNameAction = MessageBuilderSetEmbedAction & {
    type: typeof MessageBuilderActionType.SetEmbedAuthorName;
    value: string;
}

type MessageBuilderSetEmbedAuthorUrlAction = MessageBuilderSetEmbedAction & {
    type: typeof MessageBuilderActionType.SetEmbedAuthorUrl;
    value: string;
}

type MessageBuilderSetEmbedAuthorIconUrlAction = MessageBuilderSetEmbedAction & {
    type: typeof MessageBuilderActionType.SetEmbedAuthorIconUrl;
    value: string;
}

type MessageBuilderSetEmbedFooterTextAction = MessageBuilderSetEmbedAction & {
    type: typeof MessageBuilderActionType.SetEmbedFooterText;
    value: string;
}

type MessageBuilderSetEmbedFooterIconUrlAction = MessageBuilderSetEmbedAction & {
    type: typeof MessageBuilderActionType.SetEmbedFooterIconUrl;
    value: string;
}

type MessageBuilderAddEmbedFieldAction = MessageBuilderSetEmbedAction & {
    type: typeof MessageBuilderActionType.AddEmbedField;
};

type MessageBuilderSetEmbedFieldAction = MessageBuilderSetEmbedAction & { fieldIndex: number; };

type MessageBuilderRemoveEmbedFieldAction = MessageBuilderSetEmbedFieldAction & {
    type: typeof MessageBuilderActionType.RemoveEmbedField;
};

type MessageBuilderSetEmbedFieldNameAction = MessageBuilderSetEmbedFieldAction & {
    type: typeof MessageBuilderActionType.SetEmbedFieldName;
    value: string;
};

type MessageBuilderSetEmbedFieldValueAction = MessageBuilderSetEmbedFieldAction & {
    type: typeof MessageBuilderActionType.SetEmbedFieldValue;
    value: string;
};

type MessageBuilderSetEmbedFieldInlineAction = MessageBuilderSetEmbedFieldAction & {
    type: typeof MessageBuilderActionType.SetEmbedFieldInline;
    value: boolean;
};

type MessageBuilderSetEmbedImageAction = MessageBuilderSetEmbedAction & {
    type: typeof MessageBuilderActionType.SetEmbedImage;
    value: string;
};

type MessageBuilderSetEmbedThumbnailAction = MessageBuilderSetEmbedAction & {
    type: typeof MessageBuilderActionType.SetEmbedThumbnail;
    value: string;
};

export type MessageBuilderAction =
    MessageBuilderClearAction
    | MessageBuilderSetContentAction
    | MessageBuilderSetEmbedsAction
    | MessageBuilderAddEmbedAction
    | MessageBuilderRemoveEmbedAction
    | MessageBuilderSetEmbedTitleAction
    | MessageBuilderSetEmbedDescriptionAction
    | MessageBuilderSetEmbedUrlAction
    | MessageBuilderSetEmbedColorAction
    | MessageBuilderSetEmbedTimestampAction
    | MessageBuilderSetEmbedAuthorNameAction
    | MessageBuilderSetEmbedAuthorUrlAction
    | MessageBuilderSetEmbedAuthorIconUrlAction
    | MessageBuilderSetEmbedFooterTextAction
    | MessageBuilderSetEmbedFooterIconUrlAction
    | MessageBuilderAddEmbedFieldAction
    | MessageBuilderRemoveEmbedFieldAction
    | MessageBuilderSetEmbedFieldNameAction
    | MessageBuilderSetEmbedFieldValueAction
    | MessageBuilderSetEmbedFieldInlineAction
    | MessageBuilderSetEmbedImageAction
    | MessageBuilderSetEmbedThumbnailAction;

const addEmbed = (state: MessageData): MessageData => {
    const embeds = state.embeds ? [...state.embeds] : [];

    embeds.push({
        title: '',
        description: '',
        url: '',
        color: null,
        timestamp: null,
        author: {
            name: '',
            url: '',
            icon_url: ''
        },
        footer: {
            text: '',
            icon_url: ''
        },
        fields: [],
        image: '',
        thumbnail: ''
    });

    return deepmerge(state, { embeds });
};

const removeEmbed = (state: MessageData, index: number): MessageData => {
    const embeds = state.embeds ? [...state.embeds] : [];
    if (index >= embeds.length)
        return state;

    embeds.splice(index, 1);
    return deepmerge(state, { embeds });
};

const updateEmbed = (state: MessageData, index: number, value: DeepPartial<MessageEmbedData>): MessageData => {
    const embeds = state.embeds ? [...state.embeds] : [];
    if (index >= embeds.length)
        return state;

    embeds[index] = deepmerge(
        embeds[index],
        value
    );

    return deepmerge(state, { embeds });
};

const addEmbedField = (state: MessageData, embedIndex: number): MessageData => {
    const embeds = state.embeds ? [...state.embeds] : [];
    if (embedIndex >= embeds.length)
        return state;

    const embed = embeds[embedIndex];
    const fields = embed.fields ? [...embed.fields] : [];
    fields.push({ name: '', value: '', inline: false });
    embed.fields = fields;
    embeds[embedIndex] = embed;

    return deepmerge(state, { embeds });
};

const removeEmbedField = (state: MessageData, embedIndex: number, fieldIndex: number): MessageData => {
    const embeds = state.embeds ? [...state.embeds] : [];
    if (embedIndex >= embeds.length)
        return state;

    const embed = embeds[embedIndex];
    const fields = embed.fields ? [...embed.fields] : [];
    if (fieldIndex >= fields.length)
        return state;

    fields.splice(fieldIndex, 1);
    embed.fields = fields;
    embeds[embedIndex] = embed;

    return deepmerge(state, { embeds });
};

const setEmbedField = (state: MessageData, embedIndex: number, fieldIndex: number, value: Partial<MessageEmbedField>): MessageData => {
    const embeds = state.embeds ? [...state.embeds] : [];
    if (embedIndex >= embeds.length)
        return state;

    const embed = embeds[embedIndex];
    const fields = embed.fields ? [...embed.fields] : [];
    if (fieldIndex >= fields.length)
        return state;

    fields[fieldIndex] = deepmerge(
        fields[fieldIndex],
        value
    );
    embed.fields = fields;
    embeds[embedIndex] = embed;

    return deepmerge(state, { embeds });
};

const reducer = (state: MessageData, action: MessageBuilderAction): MessageData => {
    switch (action.type) {
        case MessageBuilderActionType.Clear:
            return {
                content: '',
                embeds: []
            };
        case MessageBuilderActionType.SetContent:
            return deepmerge(
                state,
                {
                    content: action.value
                }
            );
        case MessageBuilderActionType.SetEmbeds:
            return deepmerge(
                state,
                {
                    embeds: action.value
                }
            );
        case MessageBuilderActionType.AddEmbed:
            return addEmbed(state);
        case MessageBuilderActionType.RemoveEmbed:
            return removeEmbed(state, action.index);
        case MessageBuilderActionType.SetEmbedTitle:
            return updateEmbed(state, action.index, { title: action.value });
        case MessageBuilderActionType.SetEmbedDescription:
            return updateEmbed(state, action.index, { description: action.value });
        case MessageBuilderActionType.SetEmbedUrl:
            return updateEmbed(state, action.index, { url: action.value });
        case MessageBuilderActionType.SetEmbedColor:
            return updateEmbed(state, action.index, { color: action.value });
        case MessageBuilderActionType.SetEmbedTimestamp:
            let timestamp: MessageTimestampData | null;
            switch (action.value) {
                case null:
                    timestamp = null;
                    break;
                case 'now':
                    timestamp = { type: 'now' };
                    break;
                default:
                    timestamp = { type: 'value', value: action.value.toSeconds() };
                    break;
            }

            return updateEmbed(state, action.index, { timestamp });
        case MessageBuilderActionType.SetEmbedAuthorName:
            return updateEmbed(state, action.index, { author: { name: action.value } });
        case MessageBuilderActionType.SetEmbedAuthorUrl:
            return updateEmbed(state, action.index, { author: { url: action.value } });
        case MessageBuilderActionType.SetEmbedAuthorIconUrl:
            return updateEmbed(state, action.index, { author: { icon_url: action.value } });
        case MessageBuilderActionType.SetEmbedFooterText:
            return updateEmbed(state, action.index, { footer: { text: action.value } });
        case MessageBuilderActionType.SetEmbedFooterIconUrl:
            return updateEmbed(state, action.index, { footer: { icon_url: action.value } });
        case MessageBuilderActionType.AddEmbedField:
            return addEmbedField(state, action.index);
        case MessageBuilderActionType.RemoveEmbedField:
            return removeEmbedField(state, action.index, action.fieldIndex);
        case MessageBuilderActionType.SetEmbedFieldName:
            return setEmbedField(state, action.index, action.fieldIndex, { name: action.value });
        case MessageBuilderActionType.SetEmbedFieldValue:
            return setEmbedField(state, action.index, action.fieldIndex, { value: action.value });
        case MessageBuilderActionType.SetEmbedFieldInline:
            return setEmbedField(state, action.index, action.fieldIndex, { inline: action.value });
        case MessageBuilderActionType.SetEmbedImage:
            return updateEmbed(state, action.index, { image: action.value });
        case MessageBuilderActionType.SetEmbedThumbnail:
            return updateEmbed(state, action.index, { thumbnail: action.value });
        default:
            return state;
    }
};

export const useMessageBuilder = (message: MessageData) => useReducer(reducer, message);
