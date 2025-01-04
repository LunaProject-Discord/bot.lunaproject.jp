'use client';

import { EditorAudioDialog, EditorImageDialog } from '@/components/editor';
import { EditorVideoDialog } from '@/components/editor/dialogs/video';
import { LocalizationProps } from '@/interfaces/localization';
import { Dialog, DialogActions, DialogContent, DialogTitle } from '@lunaproject/web-core/dist/components/Dialog';
import { SectionSwitchCardRootProps } from '@lunaproject/web-core/dist/components/SectionCard';
import { generateComponentClasses } from '@lunaproject/web-core/dist/utils';
import {
    DialogActionsProps,
    DialogContentProps,
    DialogProps,
    DialogTitleProps,
    FormControlLabel,
    formControlLabelClasses,
    FormControlLabelProps,
    styled,
    Switch,
    Tab,
    TabProps,
    Tabs,
    TabsProps
} from '@mui/material';
import clsx from 'clsx';
import { Fragment } from 'react';

export const editorDialogClasses = generateComponentClasses(
    'EditorDialog',
    [
        'root',
        'header',
        'content',
        'actions'
    ]
);

export const EditorDialog = styled(
    ({ className, ...props }: DialogProps) => (
        <Dialog
            fullWidth
            maxWidth="sm"
            className={clsx(editorDialogClasses.root, className)}
            {...props}
        />
    )
)();

export const EditorDialogHeader = styled(
    ({ className, ...props }: DialogTitleProps) => (
        <DialogTitle
            className={clsx(editorDialogClasses.header, className)}
            {...props}
        />
    )
)(({ theme }) => ({
    padding: theme.spacing(.5, 2, 0),
    borderBottom: `solid 1px ${theme.vars.palette.divider}`
}));

export const EditorDialogContent = styled(
    ({ className, ...props }: DialogContentProps) => (
        <DialogContent
            className={clsx(editorDialogClasses.content, className)}
            {...props}
        />
    )
)(({ theme }) => ({
    gap: theme.spacing(2)
}));

export const EditorDialogActions = styled(
    ({ className, ...props }: DialogActionsProps) => (
        <DialogActions
            className={clsx(editorDialogClasses.actions, className)}
            {...props}
        />
    )
)();

export const editorDialogHeaderTabsClasses = generateComponentClasses(
    'EditorDialogHeaderTabs',
    [
        'root'
    ]
);

export const editorDialogHeaderTabClasses = generateComponentClasses(
    'EditorDialogHeaderTab',
    [
        'root'
    ]
);

export const EditorDialogHeaderTabs = styled(
    ({ className, ...props }: TabsProps) => (
        <Tabs
            className={clsx(editorDialogHeaderTabsClasses.root, className)}
            {...props}
        />
    )
)({
    width: '100%',
    borderBottom: 'none'
});

export const EditorDialogHeaderTab = styled(
    ({ className, ...props }: TabProps) => (
        <Tab
            className={clsx(editorDialogHeaderTabClasses.root, className)}
            {...props}
        />
    )
)();

export type EditorDialogSwitchControlProps =
    Omit<FormControlLabelProps, 'value' | 'control' | 'labelPlacement'>
    & SectionSwitchCardRootProps;

export const EditorDialogSwitchControl = (
    {
        checked,
        setChecked,
        defaultChecked,
        sx,
        ...props
    }: EditorDialogSwitchControlProps
) => (
    <FormControlLabel
        control={
            <Switch
                checked={checked}
                onChange={() => setChecked((prevState) => !prevState)}
                defaultChecked={defaultChecked}
            />
        }
        labelPlacement="start"
        sx={{
            ml: 0,
            [`& .${formControlLabelClasses.label}`]: {
                width: '100%'
            },
            ...sx
        }}
        {...props}
    />
);


export const EditorDialogs = ({ localization }: LocalizationProps) => {
    return (
        <Fragment>
            <EditorImageDialog localization={localization} />
            <EditorVideoDialog localization={localization} />
            <EditorAudioDialog localization={localization} />
        </Fragment>
    );
};

export * from './audio';
export * from './image';
export * from './video';
