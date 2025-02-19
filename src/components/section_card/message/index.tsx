'use client';

import { EditIcon } from '@/components/icons';
import { MessageBuilder, MessagePreviewContainer } from '@/components/message';
import { LocalizationProps } from '@/interfaces/localization';
import { DataMessage } from '@/interfaces/message';
import { toLPDMessage } from '@/libs/message_v2';
import { appearanceAtom } from '@/states/appearance';
import { Button } from '@lunaproject/web-core/dist/components/Button';
import {
    merges,
    SectionCardContent,
    SectionCardDisplay,
    SectionCardProps,
    SectionCardRoot,
    SectionCardVariableProps
} from '@lunaproject/web-core/dist/components/SectionCard';
import { ConfigContext, generateComponentClasses, SomePartial } from '@lunaproject/web-core/dist/utils';
import { Message, Messages, messagesClasses } from '@lunaproject/web-discord-components';
import { Box, BoxProps, styled, Typography } from '@mui/material';
import { BoxTypeMap } from '@mui/system';
import clsx from 'clsx';
import { useAtomValue } from 'jotai';
import React, { ElementType, Fragment, useContext, useState } from 'react';

export const sectionMessageCardClasses = generateComponentClasses(
    'SectionMessageCard',
    [
        'root',
        'queryContainer',
        'header',
        'headerContent',
        'control',
        'gridContainer'
    ]
);

export const SectionMessageCardQueryContainer = styled(
    ({ className, ...props }: BoxProps) => (
        <Box
            className={clsx(sectionMessageCardClasses.queryContainer, className)}
            {...props}
        />
    )
)<BoxProps>(({ theme }) => ({
    width: '100%',
    containerType: 'inline-size',
    [theme.containerQueries.down(750)]: {
        [`& .${sectionMessageCardClasses.header}`]: {
            flexWrap: 'wrap',
            [`& .${sectionMessageCardClasses.headerContent}`]: {
                width: '100%'
            }
        },
        [`& .${sectionMessageCardClasses.gridContainer}`]: {
            gridTemplateColumns: '1fr'
        }
    }
}));

export const SectionMessageCardHeader = styled(
    ({ className, ...props }: BoxProps) => (
        <Box
            className={clsx(sectionMessageCardClasses.header, className)}
            {...props}
        />
    )
)<BoxProps>(({ theme }) => ({
    display: 'flex',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: theme.spacing(1.5),
    rowGap: theme.spacing(1),
    [theme.breakpoints.down('md')]: {
        flexWrap: 'wrap',
        [`& .${sectionMessageCardClasses.headerContent}`]: {
            width: '100%'
        }
    }
}));

export const SectionMessageCardHeaderContent = styled(
    ({ className, ...props }: BoxProps) => (
        <SectionCardContent
            className={clsx(sectionMessageCardClasses.headerContent, className)}
            {...props}
        />
    )
)<BoxProps>({
    marginLeft: 0
});

export const SectionMessageCardGridContainer = styled(
    ({ className, ...props }: BoxProps) => (
        <Box
            className={clsx(sectionMessageCardClasses.gridContainer, className)}
            {...props}
        />
    )
)<BoxProps>(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: '1fr',
    columnGap: theme.spacing(1.5),
    rowGap: theme.spacing(1),
    [theme.breakpoints.up('md')]: {
        gridTemplateColumns: '1fr 40%'
    }
}));

export type SectionMessageCardRootProps =
    SomePartial<SectionCardVariableProps<{ value: DataMessage; open: boolean; }>, 'open' | 'setOpen'>
    & LocalizationProps;

export type SectionMessageCardProps<C extends ElementType = BoxTypeMap['defaultComponent']> =
    SectionCardProps<C>
    & SectionMessageCardRootProps;

export const SectionMessageCard = <C extends ElementType = BoxTypeMap['defaultComponent'], >(
    {
        icon,
        primary,
        secondary,
        children,
        value,
        setValue,
        open: _open,
        setOpen: _setOpen,
        disabled: _disabled,
        variant,
        slots: { display = {}, content } = {},
        slotProps: {
            display: displayProps = {},
            content: contentProps = {}
        } = {},
        className,
        localization,
        ...props
    }: SectionMessageCardProps<C>
) => {
    const { translations } = localization;

    const { isDarkMode } = useAtomValue(appearanceAtom);

    const { components } = useContext(ConfigContext);
    const {
        disabled: configDisabled,
        variant: configVariant,
        slots: {
            display: configDisplay = {},
            content: configContent = undefined
        } = {},
        slotProps: {
            display: configDisplayProps = {},
            content: configContentProps = {}
        } = {}
    } = components?.SectionCard ?? {};

    const [__open, __setOpen] = useState(false);
    const open = _open ?? __open;
    const setOpen = _setOpen ?? __setOpen;

    const disabled = _disabled ?? configDisabled;
    return (
        <Fragment>
            <SectionCardRoot
                disabled={disabled}
                variant={variant ?? configVariant}
                className={clsx(sectionMessageCardClasses.root, className)}
                {...props}
            >
                <SectionMessageCardQueryContainer>
                    <SectionMessageCardHeader>
                        <SectionCardDisplay
                            icon={icon}
                            primary={primary}
                            secondary={secondary}
                            slots={merges(configDisplay, display)}
                            slotProps={merges(configDisplayProps, displayProps)}
                        />
                        <SectionMessageCardHeaderContent
                            component={content ?? configContent}
                            {...merges(configContentProps, contentProps)}
                        >
                            <Button
                                onClick={() => setOpen(true)}
                                disabled={disabled}
                                disableElevation
                                variant="outlined"
                                corners="extended"
                                fullWidth
                                startIcon={<EditIcon />}
                                className={sectionMessageCardClasses.control}
                            >
                                {translations.edit_message}
                            </Button>
                        </SectionMessageCardHeaderContent>
                    </SectionMessageCardHeader>
                </SectionMessageCardQueryContainer>
                <SectionMessageCardQueryContainer>
                    <SectionMessageCardGridContainer>
                        <MessagePreviewContainer
                            sx={{
                                border: (theme) => `solid 1px ${theme.vars.palette.divider}`,
                                [`&, & .${messagesClasses.root}`]: {
                                    height: '100%',
                                    borderRadius: 1
                                }
                            }}
                        >
                            <Messages appearance={{ color: isDarkMode ? 'dark' : 'light', display: 'cozy' }}>
                                <Message message={toLPDMessage(value)} />
                            </Messages>
                        </MessagePreviewContainer>
                        <Box>
                            {children && <Typography
                                component="div"
                                color={!disabled ? 'text.primary' : 'text.disabled'}
                            >
                                {children}
                            </Typography>}
                        </Box>
                    </SectionMessageCardGridContainer>
                </SectionMessageCardQueryContainer>
            </SectionCardRoot>

            <MessageBuilder
                open={open}
                setOpen={setOpen}
                value={value}
                setValue={setValue}
                localization={localization}
            />
        </Fragment>
    );
};
