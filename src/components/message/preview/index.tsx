import { Box, styled } from '@mui/material';

export const MessagePreviewContainer = styled(Box)({
    '& *, & *::before, & *::after': {
        fontFamily: '"Roboto Symbol", "Noto Sans", "Noto Sans JP", "Yu Gothic UI", "Hiragino Sans", "Noto Color Emoji", sans-serif'
    }
});
