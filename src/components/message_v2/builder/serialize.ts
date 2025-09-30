import { MessageData, MessageEmbedData } from '@/interfaces/message';
import { backticksFor, MarkdownSerializer } from '@lunaproject/prosemirror-markdown';
import { NodePos } from '@tiptap/core';
import { Node } from '@tiptap/pm/model';
import { DateTime } from 'luxon';

const markdownSerializer = new MarkdownSerializer(
    {
        text: (state, node) => {
            state.text(node.text || '', true);
        },
        paragraph: (state, node) => {
            if (node.childCount < 1) {
                state.write(' ');
                state.closeBlock(node);
                return;
            }

            state.renderInline(node);
            state.closeBlock(node);
        },
        heading: (state, node) => {
            state.write(`${state.repeat('#', node.attrs.level)} `);
            state.renderInline(node, false);
            state.closeBlock(node);
        },
        bulletList: (state, node) => {
            state.renderList(
                node,
                '  ',
                () => '- '
            );
        },
        orderedList: (state, node) => {
            let start: number = node.attrs.start || 1;
            let maxW = String(start + node.childCount - 1).length;

            state.renderList(
                node,
                '  ',
                (i) => {
                    let nStr = String(start + i);
                    return `${state.repeat(' ', maxW - nStr.length)}${nStr}. `;
                }
            );
        },
        listItem: (state, node) => {
            state.renderInline(node);
            state.closeBlock(node);
        },
        blockquote: (state, node) => {
            state.wrapBlock(
                '> ',
                null,
                node,
                () => state.renderContent(node)
            );
        },
        unicodeEmoji: (state, node) => {
            state.text(node.attrs.value!, false);
        },
        placeholder: (state, node) => {
            state.text(node.attrs.value!, false);
        },
        lineBreak: (state) => {
            state.write('\n');
        }
    },
    {
        bold: {
            open: '**',
            close: '**',
            mixable: true,
            expelEnclosingWhitespace: true
        },
        italic: {
            open: '*',
            close: '*',
            mixable: true,
            expelEnclosingWhitespace: true
        },
        underline: {
            open: '__',
            close: '__',
            mixable: true,
            expelEnclosingWhitespace: true
        },
        strike: {
            open: '~~',
            close: '~~',
            mixable: true,
            expelEnclosingWhitespace: true
        },
        code: {
            open: (_, __, parent, index) => backticksFor(parent.child(index), -1),
            close: (_, __, parent, index) => backticksFor(parent.child(index - 1), 1),
            escape: false
        },
        link: {
            open: '[',
            close: (_, mark) => '](' + mark.attrs.href.replace(/[\(\)"]/g, '\\$&') + (mark.attrs.title ? ` "${mark.attrs.title.replace(/"/g, '\\"')}"` : '') + ')',
            mixable: true
        }
    },
    {
        escapeExtraCharacters: /(?<!\\){[A-Za-z0-9_]+(?::[A-Za-z0-9_]+)?}/g
    }
);

const serializeNode = (node: Node) => markdownSerializer.serialize(node).trim();

export const serialize = (messageNodePos: NodePos): MessageData | undefined => {
    const messageNode = messageNodePos.node;
    if (!messageNode || messageNode.type.name !== 'message')
        return undefined;

    // Message 内の MessageContent を取得
    const messageContentNodePos = messageNodePos.querySelector('messageContent');
    const messageContentNode = messageContentNodePos?.node;

    // Message 内の MessageEmbed をすべて取得
    const messageEmbedNodePoses = messageNodePos.querySelectorAll('messageEmbed');

    return {
        content: messageContentNode ? serializeNode(messageContentNode) : '',
        embeds: messageEmbedNodePoses.map((messageEmbedNodePos): MessageEmbedData => {
            const messageEmbedNode = messageEmbedNodePos.node;

            // MessageEmbed 内の MessageEmbedTitle を取得
            const messageEmbedTitleNodePos = messageEmbedNodePos.querySelector('messageEmbedTitle');
            const messageEmbedTitleNode = messageEmbedTitleNodePos?.node;

            // MessageEmbed 内の MessageEmbedDescription を取得
            const messageEmbedDescriptionNodePos = messageEmbedNodePos.querySelector('messageEmbedDescription');
            const messageEmbedDescriptionNode = messageEmbedDescriptionNodePos?.node;

            // MessageEmbedAuthor 内の MessageEmbedAuthorIcon を取得
            const messageEmbedAuthorIconNodePos = messageEmbedNodePos.querySelector('messageEmbedAuthorIcon');
            const messageEmbedAuthorIconNode = messageEmbedAuthorIconNodePos?.node;

            // MessageEmbedAuthor 内の MessageEmbedAuthorName を取得
            const messageEmbedAuthorNameNodePos = messageEmbedNodePos.querySelector('messageEmbedAuthorName');
            const messageEmbedAuthorNameNode = messageEmbedAuthorNameNodePos?.node;

            // MessageEmbedFooter 内の MessageEmbedFooterIcon を取得
            const messageEmbedFooterIconNodePos = messageEmbedNodePos.querySelector('messageEmbedFooterIcon');
            const messageEmbedFooterIconNode = messageEmbedFooterIconNodePos?.node;

            // MessageEmbedFooter 内の MessageEmbedFooterText を取得
            const messageEmbedFooterTextNodePos = messageEmbedNodePos.querySelector('messageEmbedFooterText');
            const messageEmbedFooterTextNode = messageEmbedFooterTextNodePos?.node;

            // MessageEmbedFooter 内の MessageEmbedFooterTimestamp を取得
            const messageEmbedFooterTimestampNodePos = messageEmbedNodePos.querySelector('messageEmbedFooterTimestamp');
            const messageEmbedFooterTimestampNode = messageEmbedFooterTimestampNodePos?.node;
            const timestamp: DateTime<true> | 'now' | null = messageEmbedFooterTimestampNode?.attrs.timestamp || null;

            // MessageEmbedFields 内の MessageEmbedField をすべて取得
            const messageEmbedFieldNodePoses = messageEmbedNodePos.querySelectorAll('messageEmbedField');

            // MessageEmbed 内の MessageEmbedImage を取得
            const messageEmbedImageNodePos = messageEmbedNodePos.querySelector('messageEmbedImage');
            const messageEmbedImageNode = messageEmbedImageNodePos?.node;

            // MessageEmbed 内の MessageEmbedThumbnail を取得
            const messageEmbedThumbnailNodePos = messageEmbedNodePos.querySelector('messageEmbedThumbnail');
            const messageEmbedThumbnailNode = messageEmbedThumbnailNodePos?.node;

            return {
                title: messageEmbedTitleNode ? serializeNode(messageEmbedTitleNode) : '',
                description: messageEmbedDescriptionNode ? serializeNode(messageEmbedDescriptionNode) : '',
                url: messageEmbedTitleNode?.attrs.url || '',
                color: messageEmbedNode?.attrs.color || null,
                timestamp: timestamp ? (
                    timestamp === 'now' ? {
                        type: 'now'
                    } : {
                        type: 'value',
                        value: timestamp.toSeconds()
                    }
                ) : null,
                author: {
                    name: messageEmbedAuthorNameNode ? serializeNode(messageEmbedAuthorNameNode) : '',
                    url: messageEmbedAuthorNameNode?.attrs.url || '',
                    icon_url: messageEmbedAuthorIconNode?.attrs.src || ''
                },
                footer: {
                    text: messageEmbedFooterTextNode ? serializeNode(messageEmbedFooterTextNode) : '',
                    icon_url: messageEmbedFooterIconNode?.attrs.src || ''
                },
                fields: messageEmbedFieldNodePoses.map((messageEmbedFieldNodePos) => {
                    const messageEmbedFieldNode = messageEmbedFieldNodePos.node;

                    // MessageEmbedField 内の MessageEmbedFieldName を取得
                    const messageEmbedFieldNameNodePos = messageEmbedFieldNodePos.querySelector('messageEmbedFieldName');
                    const messageEmbedFieldNameNode = messageEmbedFieldNameNodePos?.node;

                    // MessageEmbedField 内の MessageEmbedFieldValue を取得
                    const messageEmbedFieldValueNodePos = messageEmbedFieldNodePos.querySelector('messageEmbedFieldValue');
                    const messageEmbedFieldValueNode = messageEmbedFieldValueNodePos?.node;

                    return {
                        name: messageEmbedFieldNameNode ? serializeNode(messageEmbedFieldNameNode) : '',
                        value: messageEmbedFieldValueNode ? serializeNode(messageEmbedFieldValueNode) : '',
                        inline: messageEmbedFieldNode?.attrs.inline || false
                    };
                }),
                image: messageEmbedImageNode?.attrs.src || '',
                thumbnail: messageEmbedThumbnailNode?.attrs.src || ''
            };
        })
    };
};
