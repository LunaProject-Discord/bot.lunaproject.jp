'use client';

import { EditIcon } from '@/components/icons';
import { LocalizationProps } from '@/interfaces/localization';
import { DataMessage } from '@/interfaces/message';
import { toMessage } from '@/libs/message';
import { ThemeProvider } from '@emotion/react';
import { MessageContainer, MessagePreview } from '@lunaproject/web-core/dist/components/Message';
import { ItemProps } from '@lunaproject/web-core/dist/components/SectionItems';
import { buildDiscordTheme } from '@lunaproject/web-core/dist/styles/theme';
import { Box, Button, styled, Typography, useTheme } from '@mui/material';
import React, { Dispatch, Fragment, ReactNode, SetStateAction, useState } from 'react';
import { MessageBuilder } from '../../message/builder';
import { MessagePreviewContainer } from '../../message/preview';
import { ItemIcon, ItemRowContainer, ItemTextBlock, ItemVariableProps } from '../index';

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

const ItemQueryContainer = styled(Box)(({ theme }) => ({
    width: '100%',
    containerType: 'inline-size',
    [`@container (max-width: ${750 - .05}px)`]: {
        '& > div': {
            flexDirection: 'column',
            gap: theme.spacing(1),
            '& > div': {
                width: '100%'
            }
        }
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

interface Props extends ItemProps, ItemVariableProps<DataMessage>, LocalizationProps {
    open?: boolean;
    setOpen?: Dispatch<SetStateAction<boolean>>;
    children?: ReactNode;
}

export const MessageItem = (
    {
        icon,
        iconSx,
        primary,
        secondary,
        primaryTypographyProps,
        secondaryTypographyProps,
        value,
        setValue,
        disabled,
        open,
        setOpen,
        sx,
        localization,
        children
    }: Props
) => {
    const { translations } = localization;

    const theme = useTheme();

    const [__open, __setOpen] = useState(false);

    const setMessage = (message: DataMessage | ((prevValue: DataMessage) => DataMessage)) => {
        setValue(typeof message === 'function' ? message(value) : message);
    };

    return (
        <Fragment>
            <ItemContainer sx={sx}>
                <ItemRowContainer>
                    <ItemIcon icon={icon} iconSx={iconSx} />
                    <ItemTextBlock
                        primary={primary}
                        secondary={secondary}
                        primaryTypographyProps={primaryTypographyProps}
                        secondaryTypographyProps={secondaryTypographyProps}
                        disabled={disabled}
                    />
                </ItemRowContainer>
                <ItemQueryContainer>
                    <ItemGridContainer>
                        <Box sx={{ width: { xs: '100%', md: '60%' } }}>
                            <ThemeProvider theme={buildDiscordTheme({ color: theme.palette.mode })}>
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
                            {children && <Typography
                                component="div"
                                color={!disabled ? 'text.primary' : 'text.disabled'}
                            >
                                {children}
                            </Typography>}
                            <Button
                                onClick={() => (setOpen ?? __setOpen)(true)}
                                disabled={disabled}
                                disableElevation
                                variant="contained"
                                size="large"
                                startIcon={<EditIcon />}
                            >
                                {translations.edit_message}
                            </Button>
                        </Box>
                    </ItemGridContainer>
                </ItemQueryContainer>
            </ItemContainer>

            <MessageBuilder
                open={open ?? __open}
                setOpen={setOpen ?? __setOpen}
                message={value}
                setMessage={setMessage}
                localization={localization}
            />
        </Fragment>
    );
};
