import {
    AddColumnLeftIcon,
    AddColumnRightIcon,
    AddRowAboveIcon,
    AddRowBelowIcon,
    CalendarViewDayFillIcon,
    CallMergeIcon,
    CallSplitIcon,
    ChecklistIcon,
    CloseIcon,
    CodeIcon,
    ColumnDeleteIcon,
    FormatAlignCenterIcon,
    FormatAlignJustifyIcon,
    FormatAlignLeftIcon,
    FormatAlignRightIcon,
    FormatBoldIcon,
    FormatH1Icon,
    FormatH2Icon,
    FormatH3Icon,
    FormatItalicIcon,
    FormatListBulletedIcon,
    FormatListNumberedIcon,
    FormatQuoteIcon,
    FormatStrikethroughIcon,
    FormatUnderlinedIcon,
    ImageIcon,
    MovieIcon,
    MusicNoteIcon,
    RowDeleteIcon,
    SplitscreenLeftIcon,
    SplitscreenTopIcon,
    SubscriptIcon,
    SuperscriptIcon,
    TableIcon
} from '@/components/icons';
import {
    asRibbonButton,
    asRibbonDropdownButtonOption,
    BlockquoteRibbonButton,
    BoldRibbonButton,
    BulletListRibbonButton,
    CodeRibbonButton,
    EditorAction,
    EditorRibbonTab,
    ItalicRibbonButton,
    OrderedListRibbonButton,
    StrikeRibbonButton,
    SubscriptRibbonButton,
    SuperscriptRibbonButton,
    TableAddColumnAfterRibbonButton,
    TableAddColumnBeforeRibbonButton,
    TableAddRowAfterRibbonButton,
    TableAddRowBeforeRibbonButton,
    TableDeleteColumnCommand,
    TableDeleteCommand,
    TableDeleteRowCommand,
    TableInsertRibbonButton,
    TableMergeCellsRibbonButton,
    TableSplitCellRibbonButton,
    TableToggleHeaderCellRibbonButton,
    TableToggleHeaderColumnCommand,
    TableToggleHeaderRowCommand,
    TaskListRibbonButton,
    TextAlignCenterRibbonButton,
    TextAlignJustifyRibbonButton,
    TextAlignLeftRibbonButton,
    TextAlignRightRibbonButton,
    UnderlineRibbonButton
} from '@lunaproject/web-editor';
import type { BundledLanguage } from 'shiki/bundle/full';

type InsertContentNode = { type: 'paragraph' }
    | { type: 'heading'; level: 2 | 3 | 4; }
    | { type: 'bulletList' }
    | { type: 'orderedList' }
    | { type: 'taskList' }
    | { type: 'table' }
    | { type: 'codeBlock'; content: string; language: BundledLanguage; }
    | { type: 'image'; src: string; alt?: string; caption?: string; }
    | { type: 'video'; src: string; controls?: boolean; loop?: boolean; muted?: boolean; caption?: string; }
    | { type: 'audio'; src: string; controls?: boolean; loop?: boolean; muted?: boolean; caption?: string; };

const insertContentAfter: (node: InsertContentNode) => EditorAction = (node) => ({ editor, state }) => {
    const currentChain = editor.chain().focus();

    const currentNodePos = editor.$pos(state.selection.from);
    const currentNode = currentNodePos.node;

    if (currentNode.type.name !== 'paragraph' || currentNode.textContent.length > 0)
        currentChain.selectTextblockEnd();
    if (editor.isActive('image') || editor.isActive('video') || editor.isActive('audio'))
        currentChain.createParagraphNear();

    switch (node.type) {
        case 'paragraph':
        case 'heading':
            currentChain.insertContent(node);
            break;

        case 'bulletList':
        case 'orderedList':
            currentChain.insertContent(
                {
                    type: node.type,
                    content: [
                        {
                            type: 'listItem',
                            content: [
                                { type: 'paragraph' }
                            ]
                        }
                    ]
                }
            );
            break;

        case 'taskList':
            currentChain.insertContent(
                {
                    type: 'taskList',
                    content: [
                        {
                            type: 'taskItem',
                            content: [
                                { type: 'paragraph' }
                            ]
                        }
                    ]
                }
            );
            break;

        case 'table':
            currentChain.insertTable({ withHeaderRow: false });
            break;

        case 'codeBlock':
            currentChain.insertContent(
                {
                    type: node.type,
                    attrs: {
                        language: node.language
                    },
                    content: [
                        {
                            type: 'text',
                            text: node.content
                        }
                    ]
                }
            );
            break;

        case 'image':
            currentChain.insertContent(
                {
                    type: node.type,
                    attrs: {
                        src: node.src,
                        alt: node.alt
                    },
                    content: node.caption ? [
                        {
                            type: 'text',
                            text: node.caption
                        }
                    ] : []
                }
            );
            break;

        case 'video':
        case 'audio':
            currentChain.insertContent(
                {
                    type: node.type,
                    attrs: {
                        src: node.src,
                        controls: node.controls,
                        loop: node.loop,
                        muted: node.muted
                    },
                    content: node.caption ? [
                        {
                            type: 'text',
                            text: node.caption
                        }
                    ] : []
                }
            );
            break;

        default:
            break;
    }

    return currentChain.run();
};

export const RibbonTabs: EditorRibbonTab[] = [
    {
        name: 'home',
        label: 'ホーム',
        accessKey: 'H',
        content: [
            {
                name: 'heading',
                label: '見出し',
                accessKey: 'H',
                content: [
                    {
                        name: 'headingLarge',
                        icon: FormatH1Icon,
                        accessKey: 'L',
                        tooltip: {
                            children: '大見出し'
                        },
                        selected: ({ editor }) => editor.isActive('heading', { level: 2 }),
                        perform: ({ editor }) => editor.chain().focus().toggleHeading({ level: 2 }).run()
                    },
                    {
                        name: 'headingMedium',
                        icon: FormatH2Icon,
                        accessKey: 'M',
                        tooltip: {
                            children: '中見出し'
                        },
                        selected: ({ editor }) => editor.isActive('heading', { level: 3 }),
                        perform: ({ editor }) => editor.chain().focus().toggleHeading({ level: 3 }).run()
                    },
                    {
                        name: 'headingSmall',
                        icon: FormatH3Icon,
                        accessKey: 'S',
                        tooltip: {
                            children: '小見出し'
                        },
                        selected: ({ editor }) => editor.isActive('heading', { level: 4 }),
                        perform: ({ editor }) => editor.chain().focus().toggleHeading({ level: 4 }).run()
                    }
                ]
            },
            { type: 'divider' },
            {
                name: 'format',
                label: 'フォーマット',
                accessKey: 'F',
                content: [
                    asRibbonButton(BoldRibbonButton, { icon: FormatBoldIcon }),
                    asRibbonButton(ItalicRibbonButton, { icon: FormatItalicIcon }),
                    asRibbonButton(UnderlineRibbonButton, { icon: FormatUnderlinedIcon }),
                    asRibbonButton(StrikeRibbonButton, { icon: FormatStrikethroughIcon }),
                    asRibbonButton(CodeRibbonButton, { icon: CodeIcon }),
                    asRibbonButton(SuperscriptRibbonButton, { icon: SuperscriptIcon }),
                    asRibbonButton(SubscriptRibbonButton, { icon: SubscriptIcon })
                ]
            },
            { type: 'divider' },
            {
                name: 'paragraph',
                label: '段落',
                accessKey: 'P',
                content: [
                    asRibbonButton(TextAlignLeftRibbonButton, { icon: FormatAlignLeftIcon }),
                    asRibbonButton(TextAlignCenterRibbonButton, { icon: FormatAlignCenterIcon }),
                    asRibbonButton(TextAlignRightRibbonButton, { icon: FormatAlignRightIcon }),
                    asRibbonButton(TextAlignJustifyRibbonButton, { icon: FormatAlignJustifyIcon }),
                    { type: 'divider' },
                    asRibbonButton(
                        BlockquoteRibbonButton,
                        {
                            icon: FormatQuoteIcon,
                            label: '引用ブロック',
                            tooltip: undefined
                        }
                    )
                ]
            },
            { type: 'divider' },
            {
                name: 'list',
                label: 'リスト',
                accessKey: 'L',
                content: [
                    asRibbonButton(BulletListRibbonButton, { icon: FormatListBulletedIcon }),
                    asRibbonButton(OrderedListRibbonButton, { icon: FormatListNumberedIcon }),
                    asRibbonButton(TaskListRibbonButton, { icon: ChecklistIcon })
                ]
            }
        ]
    },
    {
        name: 'insert',
        label: '挿入',
        accessKey: 'I',
        content: [
            {
                name: 'paragraph',
                accessKey: 'P',
                content: [
                    {
                        name: 'paragraph',
                        icon: FormatAlignLeftIcon,
                        label: '段落',
                        accessKey: 'P',
                        perform: insertContentAfter({ type: 'paragraph' })
                    }
                ]
            },
            { type: 'divider' },
            {
                name: 'heading',
                label: '見出し',
                accessKey: 'H',
                content: [
                    {
                        name: 'headingLarge',
                        icon: FormatH1Icon,
                        label: '大見出し',
                        accessKey: 'L',
                        perform: insertContentAfter({ type: 'heading', level: 2 })
                    },
                    {
                        name: 'headingMedium',
                        icon: FormatH2Icon,
                        label: '中見出し',
                        accessKey: 'M',
                        perform: insertContentAfter({ type: 'heading', level: 3 })
                    },
                    {
                        name: 'headingSmall',
                        icon: FormatH3Icon,
                        label: '小見出し',
                        accessKey: 'S',
                        perform: insertContentAfter({ type: 'heading', level: 4 })
                    }
                ]
            },
            { type: 'divider' },
            {
                name: 'list',
                label: 'リスト',
                accessKey: 'L',
                content: [
                    asRibbonButton(
                        BulletListRibbonButton,
                        {
                            icon: FormatListBulletedIcon,
                            label: '箇条書きリスト',
                            tooltip: undefined,
                            selected: undefined,
                            perform: insertContentAfter({ type: 'bulletList' })
                        }
                    ),
                    asRibbonButton(
                        OrderedListRibbonButton,
                        {
                            icon: FormatListNumberedIcon,
                            label: '番号付きリスト',
                            tooltip: undefined,
                            selected: undefined,
                            perform: insertContentAfter({ type: 'orderedList' })
                        }
                    ),
                    asRibbonButton(
                        TaskListRibbonButton,
                        {
                            icon: ChecklistIcon,
                            label: 'チェックリスト',
                            tooltip: undefined,
                            selected: undefined,
                            perform: insertContentAfter({ type: 'taskList' })
                        }
                    )
                ]
            },
            { type: 'divider' },
            {
                name: 'table',
                content: [
                    asRibbonButton(
                        TableInsertRibbonButton,
                        {
                            icon: TableIcon,
                            perform: insertContentAfter({ type: 'table' })
                        }
                    )
                ]
            },
            { type: 'divider' },
            {
                name: 'media',
                label: 'メディア',
                content: [
                    {
                        name: 'image',
                        icon: ImageIcon,
                        label: '画像',
                        perform: insertContentAfter({
                            type: 'image',
                            src: 'https://i.ytimg.com/vi/5HTPLCcXBJA/maxresdefault.jpg'
                        })
                    },
                    {
                        name: 'video',
                        icon: MovieIcon,
                        label: '動画',
                        perform: (props) => {
                            const src = prompt('動画のURLを入力してください。', 'https://www.soumu.go.jp/main_content/000487276.mp4');
                            if (!src)
                                return false;
                            return insertContentAfter({ type: 'video', src })(props);
                        }
                    },
                    {
                        name: 'audio',
                        icon: MusicNoteIcon,
                        label: '音声',
                        perform: insertContentAfter({
                            type: 'audio',
                            src: 'https://ia801609.us.archive.org/8/items/glowings-lapr-0005/12%20-%20%E5%8A%B9%E7%8E%87%E5%8E%A8%E3%81%AA%E3%82%86%E3%81%9F%E2%98%86%E3%83%89%E3%82%AD%E3%83%89%E3%82%AD%E4%B8%96%E7%95%8C%E3%81%98%E3%82%85%EF%BD%9E%E3%81%9E%E3%81%8F%E7%B7%A8.mp3'
                        })
                    },
                    { type: 'divider' },
                    {
                        name: 'codeBlock',
                        icon: CodeIcon,
                        label: 'コードブロック',
                        perform: insertContentAfter({
                            type: 'codeBlock',
                            content: 'fun main() {\n    println("Hello, World!")\n}',
                            language: 'kt'
                        })
                    }
                ]
            }
        ]
    },
    {
        name: 'view',
        label: '表示',
        accessKey: 'V',
        content: []
    },
    {
        name: 'help',
        label: 'ヘルプ',
        accessKey: 'Y',
        content: []
    },
    {
        name: 'table',
        label: '表',
        accessKey: 'T',
        visible: ({ editor }) => editor.isActive('table') || editor.isActive('tableRow') || editor.isActive('tableCell') || editor.isActive('tableHeader'),
        content: [
            {
                name: 'addAndRemove',
                label: '追加と削除',
                content: [
                    asRibbonButton(TableAddRowBeforeRibbonButton, { icon: AddRowAboveIcon }),
                    asRibbonButton(TableAddRowAfterRibbonButton, { icon: AddRowBelowIcon }),
                    asRibbonButton(TableAddColumnBeforeRibbonButton, { icon: AddColumnLeftIcon }),
                    asRibbonButton(TableAddColumnAfterRibbonButton, { icon: AddColumnRightIcon }),
                    { type: 'divider' },
                    {
                        type: 'ribbonDropdownButton',
                        name: 'delete',
                        icon: CloseIcon,
                        tooltip: {
                            children: '削除'
                        },
                        disabled: ({ editor }) => !editor.can().deleteTable() && !editor.can().deleteRow() && !editor.can().deleteColumn(),
                        options: [
                            asRibbonDropdownButtonOption(
                                TableDeleteRowCommand,
                                {
                                    icon: RowDeleteIcon,
                                    description: undefined
                                }
                            ),
                            asRibbonDropdownButtonOption(
                                TableDeleteColumnCommand,
                                {
                                    icon: ColumnDeleteIcon,
                                    description: undefined
                                }
                            ),
                            { type: 'divider' },
                            asRibbonDropdownButtonOption(
                                TableDeleteCommand,
                                {
                                    icon: undefined,
                                    description: undefined
                                }
                            )
                        ]
                    }
                ]
            },
            { type: 'divider' },
            {
                name: 'mergeAndSplit',
                label: '結合と分割',
                content: [
                    asRibbonButton(TableMergeCellsRibbonButton, { icon: CallMergeIcon }),
                    asRibbonButton(TableSplitCellRibbonButton, { icon: CallSplitIcon })
                ]
            },
            { type: 'divider' },
            {
                name: 'toggleHeader',
                label: '見出し',
                content: [
                    asRibbonButton(TableToggleHeaderRowCommand, { icon: SplitscreenTopIcon }),
                    asRibbonButton(
                        TableToggleHeaderColumnCommand,
                        {
                            icon: SplitscreenLeftIcon,
                            label: undefined,
                            tooltip: {
                                children: '列見出し'
                            }
                        }
                    ),
                    asRibbonButton(
                        TableToggleHeaderCellRibbonButton,
                        {
                            icon: CalendarViewDayFillIcon,
                            label: undefined,
                            tooltip: {
                                children: 'セル見出し'
                            }
                        }
                    )
                ]
            }
        ]
    }
];
