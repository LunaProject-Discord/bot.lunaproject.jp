'use client';

import { ArrowRightOutlined } from '@mui/icons-material';
import React, { MouseEvent } from 'react';
import {
    ItemButtonBase,
    ItemDisabledProps,
    ItemFormContainer,
    ItemIcon,
    ItemIconProps,
    ItemRowContainer,
    ItemTextBlock,
    ItemTextBlockProps
} from './index';

interface Props extends ItemTextBlockProps, ItemIconProps, ItemDisabledProps {
    onAction: (e: MouseEvent<HTMLButtonElement>) => void;
}

export const ActionItem = ({ icon, primary, secondary, onAction, disabled }: Props) => (
    <ItemButtonBase onClick={onAction} disabled={disabled}>
        <ItemRowContainer>
            <ItemIcon icon={icon} />
            <ItemTextBlock primary={primary} secondary={secondary} disabled={disabled} />
            <ItemFormContainer>
                <ItemIcon icon={<ArrowRightOutlined color={!disabled ? 'action' : 'disabled'} />} />
            </ItemFormContainer>
        </ItemRowContainer>
    </ItemButtonBase>
);
