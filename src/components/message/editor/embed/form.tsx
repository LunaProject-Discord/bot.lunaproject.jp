'use client';

import { Box, BoxProps, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface EmbedFormContainerProps {
    sx?: BoxProps['sx'];
    children?: ReactNode;
}

export const EmbedFormContainer = ({ sx, children }: EmbedFormContainerProps) => (
    <Box sx={{ pb: 1, pl: 3.5, pr: .5, display: 'flex', flexWrap: 'wrap', gap: 1.5, ...sx }}>
        {children}
    </Box>
);

interface EmbedFormItemProps extends EmbedFormContainerProps {
    inline?: boolean;
    label: ReactNode;
    length?: number;
    maxLength?: number;
}

export const EmbedFormItem = ({ inline, label, length, maxLength, sx, children }: EmbedFormItemProps) => (
    <Box
        sx={{
            width: !inline ? '100%' : undefined,
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            gap: .5,
            ...sx
        }}
    >
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1 }}>
            <Typography sx={{ userSelect: 'none' }}>{label}</Typography>
            {length !== undefined && maxLength !== undefined && (
                <Typography variant="caption" color="text.secondary" sx={{ userSelect: 'none' }}>
                    {length}/{maxLength}
                </Typography>
            )}
        </Box>
        <Box>{children}</Box>
    </Box>
);
