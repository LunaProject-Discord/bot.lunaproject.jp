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
                name: 'table',
                content: [
                    asRibbonButton(
                        TableInsertRibbonButton,
                        {
                            icon: TableIcon,
                            perform: ({ editor }) => editor.chain().focus().insertTable({ withHeaderRow: false }).run()
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
                        perform: ({ editor }) => editor.chain().focus().run()
                    },
                    {
                        name: 'video',
                        icon: MovieIcon,
                        label: '動画',
                        perform: ({ editor }) => editor.chain().focus().run()
                    },
                    {
                        name: 'audio',
                        icon: MusicNoteIcon,
                        label: '音声',
                        perform: ({ editor }) => editor.chain().focus().run()
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
