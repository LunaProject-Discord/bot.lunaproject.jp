'use client';

import { ThemeProvider } from '@emotion/react';
import { MessageContainer, MessagePreview, THEMES } from '@lunaproject-discord/web-core';
import { EditOutlined } from '@mui/icons-material';
import { Box, Button, styled, Typography, useTheme } from '@mui/material';
import React, { Dispatch, Fragment, ReactNode, SetStateAction, useState } from 'react';
import { DataMessage } from '../../../interfaces/message';
import { toMessage } from '../../../libs/message';
import { useTranslation } from '../../../localizations/client';
import { MessageBuilder } from '../../message/builder';
import { MessagePreviewContainer } from '../../message/preview';
import {
    ItemDisabledProps,
    ItemIcon,
    ItemIconProps,
    ItemRowContainer,
    ItemTextBlock,
    ItemTextBlockProps,
    ItemVariableProps
} from '../index';

const ItemContainer = styled(Box)(({ theme }) => ({
    padding: theme.spacing(0, 1.5),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: theme.spacing(1.5),
    borderRadius: theme.shape.borderRadius,
    transition: theme.transitions.create(['background-color', 'box-shadow', 'border-color', 'color'], {
        duration: theme.transitions.duration.shortest
    }),
    [theme.breakpoints.down('md')]: {
        gap: theme.spacing(.5)
    }
}));

const ItemGridContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    display: 'flex',
    alignItems: 'stretch',
    gap: theme.spacing(1.5),
    [theme.breakpoints.down('md')]: {
        flexDirection: 'column',
        gap: theme.spacing(1)
    }
}));

interface Props extends ItemTextBlockProps, ItemIconProps, ItemDisabledProps, ItemVariableProps<DataMessage> {
    open?: boolean;
    setOpen?: Dispatch<SetStateAction<boolean>>;
    children?: ReactNode;
}

export const MessageItem = (
    {
        icon,
        primary,
        secondary,
        value,
        setValue,
        disabled,
        open,
        setOpen,
        children
    }: Props
) => {
    const translations = useTranslation();
    const theme = useTheme();

    const [__open, __setOpen] = useState(false);

    const handleDialogClose = () => (setOpen ?? __setOpen)(false);

    const setMessage = (message: DataMessage | ((prevValue: DataMessage) => DataMessage)) => {
        setValue(typeof message === 'function' ? message(value) : message);
    };

    return (
        <Fragment>
            <ItemContainer>
                <ItemRowContainer>
                    <ItemIcon icon={icon} />
                    <ItemTextBlock primary={primary} secondary={secondary} disabled={disabled} />
                </ItemRowContainer>
                <ItemGridContainer>
                    <Box sx={{ width: { xs: '100%', md: '60%' } }}>
                        <ThemeProvider
                            theme={{
                                ...THEMES[theme.palette.mode],
                                appearance: {
                                    color: theme.palette.mode,
                                    display: 'cozy',
                                    fontSize: 16
                                }
                            }}
                        >
                            <MessagePreviewContainer sx={{ height: '100%' }}>
                                <MessageContainer style={{ height: '100%' }}>
                                    <MessagePreview message={toMessage(value)} />
                                </MessageContainer>
                            </MessagePreviewContainer>
                        </ThemeProvider>
                    </Box>
                    <Box
                        sx={{
                            width: { xs: '100%', md: '40%' },
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            gap: 1
                        }}
                    >
                        {children && <Typography component="div" variant="body1">{children}</Typography>}
                        <Button
                            onClick={() => (setOpen ?? __setOpen)(true)}
                            disabled={disabled}
                            disableElevation
                            variant="contained"
                            size="large"
                            startIcon={<EditOutlined />}
                        >
                            {translations.edit_message}
                        </Button>
                    </Box>
                </ItemGridContainer>
            </ItemContainer>

            <MessageBuilder
                message={value}
                setMessage={setMessage}
                open={open ?? __open}
                onClose={handleDialogClose}
            />
        </Fragment>
    );
};
