import { MessageData } from '@/interfaces/message';
import {
    decimalToHex,
    DefaultAvatar,
    FeatureConfig,
    getFieldGridColumn,
    Markdown,
    messageAccessoriesClasses,
    MessageAccessoriesRootElement,
    messageClasses,
    messageContentClasses,
    MessageContentElement,
    messageEmbedAuthorClasses,
    MessageEmbedAuthorIconElement,
    MessageEmbedAuthorNameElement,
    MessageEmbedAuthorRootElement,
    messageEmbedClasses,
    MessageEmbedDescriptionElement,
    messageEmbedFieldClasses,
    MessageEmbedFieldNameElement,
    MessageEmbedFieldRootElement,
    MessageEmbedFieldsElement,
    MessageEmbedFieldValueElement,
    messageEmbedFooterClasses,
    MessageEmbedFooterIconElement,
    MessageEmbedFooterRootElement,
    MessageEmbedFooterSeparatorElement,
    MessageEmbedFooterTextElement,
    messageEmbedImageClasses,
    MessageEmbedImageElement,
    MessageEmbedRootElement,
    messageEmbedThumbnailClasses,
    MessageEmbedThumbnailImageElement,
    MessageEmbedThumbnailRootElement,
    MessageEmbedTitleElement,
    MessageHeaderAvatarElement,
    messageHeaderClasses,
    MessageHeaderNameElement,
    MessageHeaderRootElement,
    MessageHeaderTimestampElement,
    MessageRootElement,
    messagesClasses,
    MessagesRootElement,
    User
} from '@lunaproject/web-discord-components';
import { createElement, ElementType } from 'react';
import ReactDOMServer from 'react-dom/server';

const buildElement = (tag: string | ElementType, props: Record<string, string | number | boolean | undefined | null>, content?: string) => {
    const attributes = Object.entries(props)
        .filter(([_, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${key}="${value}"`)
        .join(' ');

    if (!content)
        return `<${tag} ${attributes} />`;

    return [
        `<${tag} ${attributes}>`,
        content,
        `</${tag}>`
    ].join('');
};

export const renderMarkdown = (content: string, features?: FeatureConfig, parseParagraphs: boolean = true) => ReactDOMServer.renderToStaticMarkup(
    createElement(
        Markdown,
        {
            content,
            features,
            initialState: {
                enableParseParagraphs: parseParagraphs
            }
        }
    )
).replaceAll(/\n/g, parseParagraphs ? '' : '<br />');

export const deserialize = (message: MessageData, author: Omit<User, 'id'>) => buildElement(
    MessagesRootElement,
    { class: messagesClasses.root },
    buildElement(
        MessageRootElement,
        { class: messageClasses.root },
        [
            buildElement(
                MessageHeaderRootElement,
                { class: messageHeaderClasses.root },
                [
                    buildElement(
                        MessageHeaderAvatarElement,
                        {
                            src: author.avatarUrl ?? DefaultAvatar.Blurple,
                            class: messageHeaderClasses.avatar
                        }
                    ),
                    buildElement(
                        MessageHeaderNameElement,
                        { class: messageHeaderClasses.name },
                        author.name
                    ),
                    buildElement(
                        MessageHeaderTimestampElement,
                        { class: messageHeaderClasses.timestamp }
                    )
                ].join('')
            ),
            buildElement(
                MessageContentElement,
                { class: messageContentClasses.root },
                renderMarkdown(message.content, 'full')
            ),
            message.embeds && message.embeds.length > 0 ? buildElement(
                MessageAccessoriesRootElement,
                { class: messageAccessoriesClasses.root },
                message.embeds.map((
                    {
                        title,
                        description,
                        url,
                        color,
                        timestamp: _timestamp,
                        author: {
                            name: authorName,
                            url: authorUrl,
                            icon_url: authorIconUrl
                        },
                        footer: {
                            text: footerText,
                            icon_url: footerIconUrl
                        },
                        fields,
                        image,
                        thumbnail
                    }
                ) => {
                    let timestamp: number | 'now' | undefined;
                    switch (_timestamp?.type) {
                        case 'value':
                            timestamp = _timestamp.value;
                            break;
                        case 'now':
                            timestamp = 'now';
                            break;
                        default:
                            timestamp = undefined;
                            break;
                    }

                    const fieldInlines = fields.map((field) => field.inline ?? false);

                    return buildElement(
                        MessageEmbedRootElement,
                        {
                            class: messageEmbedClasses.root,
                            style: color ? `border-left-color: ${decimalToHex(color)};` : undefined
                        },
                        [
                            authorName.length > 0 ? buildElement(
                                MessageEmbedAuthorRootElement,
                                { class: messageEmbedAuthorClasses.root },
                                [
                                    authorIconUrl.length > 0 ? buildElement(
                                        MessageEmbedAuthorIconElement,
                                        {
                                            src: authorIconUrl,
                                            class: messageEmbedAuthorClasses.icon
                                        }
                                    ) : undefined,
                                    buildElement(
                                        MessageEmbedAuthorNameElement,
                                        {
                                            'data-url': authorUrl,
                                            class: messageEmbedAuthorClasses.name
                                        },
                                        renderMarkdown(
                                            authorName,
                                            {
                                                text: true,
                                                placeholders: true,
                                                lineBreaks: true
                                            },
                                            false
                                        )
                                    )
                                ].filter((content) => content !== undefined).join('')
                            ) : undefined,
                            title.length > 0 ? buildElement(
                                MessageEmbedTitleElement,
                                {
                                    'data-url': url,
                                    class: messageEmbedClasses.title
                                },
                                renderMarkdown(title, 'title', false)
                            ) : undefined,
                            description.length > 0 ? buildElement(
                                MessageEmbedDescriptionElement,
                                { class: messageEmbedClasses.description },
                                renderMarkdown(description, 'full')
                            ) : undefined,
                            fields.length > 0 ? buildElement(
                                MessageEmbedFieldsElement,
                                { class: messageEmbedClasses.fields },
                                fields.map(({ name, value, inline }, i) => {
                                    const { start, end } = getFieldGridColumn(fieldInlines, i);

                                    return buildElement(
                                        MessageEmbedFieldRootElement,
                                        {
                                            'data-inline': inline,
                                            class: messageEmbedFieldClasses.root,
                                            style: `grid-column: ${start} / ${end};`
                                        },
                                        [
                                            buildElement(
                                                MessageEmbedFieldNameElement,
                                                { class: messageEmbedFieldClasses.name },
                                                renderMarkdown(name, 'title', false)
                                            ),
                                            buildElement(
                                                MessageEmbedFieldValueElement,
                                                { class: messageEmbedFieldClasses.value },
                                                renderMarkdown(
                                                    value,
                                                    {
                                                        extend: 'full',
                                                        headings: false
                                                    }
                                                )
                                            )
                                        ].join('')
                                    );
                                }).join('')
                            ) : undefined,
                            image.length > 0 ? buildElement(
                                MessageEmbedImageElement,
                                {
                                    src: image,
                                    class: messageEmbedImageClasses.root
                                }
                            ) : undefined,
                            thumbnail.length > 0 ? buildElement(
                                MessageEmbedThumbnailRootElement,
                                { class: messageEmbedThumbnailClasses.root },
                                buildElement(
                                    MessageEmbedThumbnailImageElement,
                                    {
                                        src: thumbnail,
                                        class: messageEmbedThumbnailClasses.image
                                    }
                                )
                            ) : undefined,
                            (footerText.length > 0 || timestamp) ? buildElement(
                                MessageEmbedFooterRootElement,
                                { class: messageEmbedFooterClasses.root },
                                [
                                    footerIconUrl.length > 0 ? buildElement(
                                        MessageEmbedFooterIconElement,
                                        {
                                            src: footerIconUrl,
                                            class: messageEmbedFooterClasses.icon
                                        }
                                    ) : undefined,
                                    footerText.length > 0 ? buildElement(
                                        MessageEmbedFooterTextElement,
                                        { class: messageEmbedFooterClasses.text },
                                        renderMarkdown(
                                            footerText,
                                            {
                                                text: true,
                                                placeholders: true,
                                                lineBreaks: true
                                            },
                                            false
                                        )
                                    ) : undefined,
                                    (footerText.length > 0 && timestamp) ? buildElement(
                                        MessageEmbedFooterSeparatorElement,
                                        { class: messageEmbedFooterClasses.separator }
                                    ) : undefined,
                                    timestamp ? buildElement(
                                        'time',
                                        {
                                            'data-timestamp': timestamp,
                                            class: messageEmbedFooterClasses.text
                                        }
                                    ) : undefined
                                ].filter((content) => content !== undefined).join('')
                            ) : undefined
                        ].filter((content) => content !== undefined).join('')
                    );
                }).join('')
            ) : undefined
        ].filter((content) => content !== undefined).join('')
    )
);
