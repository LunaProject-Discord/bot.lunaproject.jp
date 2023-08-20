import { Box, styled } from '@mui/material';

export const MessageEditorContainer = styled(Box)({
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
});

export const MessageEditorWrapper = styled(Box)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    gap: theme.spacing(2),
    overflow: 'hidden'
}));

interface MessageEditorSectionProps {
    active?: boolean;
}

export const MessageEditorSection = styled('section')<MessageEditorSectionProps>(({ theme, active }) => ({
    width: '100%',
    display: active ? 'block' : 'none',
    overflow: 'auto',
    [theme.breakpoints.up('md')]: {
        display: 'block',
        maxWidth: '50%',
        flexBasis: '50%'
    }
}));
