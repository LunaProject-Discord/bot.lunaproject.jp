import { ThemeProvider } from '@emotion/react';
import { EditOutlined } from '@mui/icons-material';
import { Box, Button, styled, Typography, useTheme } from '@mui/material';
import React, { Fragment, ReactNode, useState } from 'react';
import { SendableMessage } from '../../../interfaces/message';
import { useTranslation } from '../../../languages/client';
import { toEditableMessage } from '../../../libs/message';
import { THEMES } from '../../../styles/discord/constants';
import { MessageBuilder } from '../../message/builder';
import { MessageContainer } from '../../message/preview/MessageContainer';
import { MessagePreview } from '../../message/preview/MessagePreview';
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

interface Props extends ItemTextBlockProps, ItemIconProps, ItemDisabledProps, ItemVariableProps<SendableMessage> {
    children?: ReactNode;
}

export const MessageItem = ({ icon, primary, secondary, value, setValue, disabled, children }: Props) => {
    const translations = useTranslation();
    const theme = useTheme();

    const [open, setOpen] = useState(false);

    const handleDialogClose = () => setOpen(false);

    const setMessage = (message: SendableMessage | ((prevValue: SendableMessage) => SendableMessage)) => {
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
                            <MessageContainer style={{ height: '100%' }}>
                                <MessagePreview message={toEditableMessage(value)} />
                            </MessageContainer>
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
                        {children && <Typography variant="body1">{children}</Typography>}
                        <Button
                            onClick={() => setOpen(true)}
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
                open={open}
                onClose={handleDialogClose}
            />
        </Fragment>
    );
};
