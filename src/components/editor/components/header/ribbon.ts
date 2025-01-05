import {
    EditorBoldRibbonButton,
    EditorCodeRibbonButton,
    EditorInsertAudioRibbonButton,
    EditorInsertBulletListRibbonButton,
    EditorInsertHeadingLargeRibbonButton,
    EditorInsertHeadingMediumRibbonButton,
    EditorInsertHeadingSmallRibbonButton,
    EditorInsertImageRibbonButton,
    EditorInsertOrderedListRibbonButton,
    EditorInsertParagraphRibbonButton,
    EditorInsertTableRibbonButton,
    EditorInsertTaskListRibbonButton,
    EditorInsertVideoRibbonButton,
    EditorItalicRibbonButton,
    EditorStrikeRibbonButton,
    EditorSubscriptRibbonButton,
    EditorSuperscriptRibbonButton,
    EditorTableAddColumnRibbonDropdownButton,
    EditorTableAddRowRibbonDropdownButton,
    EditorTableDeleteRibbonDropdownButton,
    EditorTableMergeCellsRibbonButton,
    EditorTableSplitCellRibbonButton,
    EditorTableToggleHeaderCellRibbonButton,
    EditorTableToggleHeaderColumnRibbonButton,
    EditorTableToggleHeaderRowRibbonButton,
    EditorTextAlignCenterRibbonButton,
    EditorTextAlignJustifyRibbonButton,
    EditorTextAlignLeftRibbonButton,
    EditorTextAlignRightRibbonButton,
    EditorToggleBulletListRibbonButton,
    EditorToggleHeadingLargeRibbonButton,
    EditorToggleHeadingMediumRibbonButton,
    EditorToggleHeadingSmallRibbonButton,
    EditorToggleNavigationSidebarRibbonButton,
    EditorToggleOrderedListRibbonButton,
    EditorTogglePublishSidebarRibbonButton,
    EditorToggleTaskListRibbonButton,
    EditorUnderlineRibbonButton
} from '@/components/editor';
import { Localization } from '@/interfaces/localization';
import { EditorRibbonTab } from '@lunaproject/web-editor';

export const EditorRibbonTabs = (localization: Localization): EditorRibbonTab[] => {
    const { translations } = localization;

    return [
        {
            name: 'home',
            label: translations.home,
            accessKey: 'H',
            content: [
                {
                    name: 'heading',
                    label: translations.heading,
                    content: [
                        EditorToggleHeadingLargeRibbonButton(localization),
                        EditorToggleHeadingMediumRibbonButton(localization),
                        EditorToggleHeadingSmallRibbonButton(localization)
                    ]
                },
                { type: 'divider' },
                {
                    name: 'format',
                    label: translations.format,
                    content: [
                        EditorBoldRibbonButton(localization),
                        EditorItalicRibbonButton(localization),
                        EditorUnderlineRibbonButton(localization),
                        EditorStrikeRibbonButton(localization),
                        EditorCodeRibbonButton(localization),
                        EditorSuperscriptRibbonButton(localization),
                        EditorSubscriptRibbonButton(localization)
                    ]
                },
                { type: 'divider' },
                {
                    name: 'paragraph',
                    label: translations.paragraph,
                    content: [
                        EditorTextAlignLeftRibbonButton(localization),
                        EditorTextAlignCenterRibbonButton(localization),
                        EditorTextAlignRightRibbonButton(localization),
                        EditorTextAlignJustifyRibbonButton(localization)
                    ]
                },
                { type: 'divider' },
                {
                    name: 'list',
                    label: translations.list,
                    content: [
                        EditorToggleBulletListRibbonButton(localization),
                        EditorToggleOrderedListRibbonButton(localization),
                        EditorToggleTaskListRibbonButton(localization)
                    ]
                }
            ]
        },
        {
            name: 'insert',
            label: translations.insert,
            accessKey: 'I',
            content: [
                {
                    name: 'paragraph',
                    content: [
                        EditorInsertParagraphRibbonButton(localization)
                    ]
                },
                { type: 'divider' },
                {
                    name: 'heading',
                    label: translations.heading,
                    content: [
                        EditorInsertHeadingLargeRibbonButton(localization),
                        EditorInsertHeadingMediumRibbonButton(localization),
                        EditorInsertHeadingSmallRibbonButton(localization)
                    ]
                },
                { type: 'divider' },
                {
                    name: 'list',
                    label: translations.list,
                    content: [
                        EditorInsertBulletListRibbonButton(localization),
                        EditorInsertOrderedListRibbonButton(localization),
                        EditorInsertTaskListRibbonButton(localization)
                    ]
                },
                { type: 'divider' },
                {
                    name: 'table',
                    content: [
                        EditorInsertTableRibbonButton(localization)
                    ]
                },
                { type: 'divider' },
                {
                    name: 'media',
                    content: [
                        EditorInsertImageRibbonButton(localization),
                        EditorInsertVideoRibbonButton(localization),
                        EditorInsertAudioRibbonButton(localization)
                    ]
                }
            ]
        },
        {
            name: 'view',
            label: translations.web_page_editor_ribbon_view,
            accessKey: 'V',
            content: [
                {
                    name: 'sidebar',
                    label: translations.web_page_editor_ribbon_view_sidebar,
                    content: [
                        EditorToggleNavigationSidebarRibbonButton(localization),
                        EditorTogglePublishSidebarRibbonButton(localization)
                    ]
                }
            ]
        },
        {
            name: 'help',
            label: translations.help,
            accessKey: 'Y',
            content: []
        },
        {
            name: 'table',
            label: translations.table,
            accessKey: 'T',
            visible: ({ editor }) => editor.isActive('table') || editor.isActive('tableRow') || editor.isActive('tableCell') || editor.isActive('tableHeader'),
            content: [
                {
                    name: 'delete',
                    content: [
                        EditorTableDeleteRibbonDropdownButton(localization)
                    ]
                },
                { type: 'divider' },
                {
                    name: 'add',
                    content: [
                        EditorTableAddRowRibbonDropdownButton(localization),
                        EditorTableAddColumnRibbonDropdownButton(localization)
                    ]
                },
                { type: 'divider' },
                {
                    name: 'mergeAndSplit',
                    label: '結合と分割',
                    content: [
                        EditorTableMergeCellsRibbonButton(localization),
                        EditorTableSplitCellRibbonButton(localization)
                    ]
                },
                { type: 'divider' },
                {
                    name: 'toggleHeader',
                    label: '見出し',
                    content: [
                        EditorTableToggleHeaderRowRibbonButton(localization),
                        EditorTableToggleHeaderColumnRibbonButton(localization),
                        EditorTableToggleHeaderCellRibbonButton(localization)
                    ]
                }
            ]
        }
    ];
};
