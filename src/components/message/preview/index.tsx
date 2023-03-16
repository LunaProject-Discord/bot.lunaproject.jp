import { Box, styled } from '@mui/material';
import '../../../../public/fonts/noto-sans-jp/style.css';
import '../../../../public/fonts/noto-sans/style.css';

export const MessagePreviewContainer = styled(Box)({
    '& *, & *::before, & *::after': {
        fontFamily: '"Roboto Symbol", "Noto Sans", "Noto Sans JP", "Yu Gothic UI", "Hiragino Sans", "Noto Color Emoji", sans-serif'
    }
});
