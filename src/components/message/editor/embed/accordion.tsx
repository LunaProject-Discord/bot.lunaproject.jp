'use client';

import { KeyboardArrowRightIcon } from '@/components/icons';
import {
    Accordion as MuiAccordion,
    accordionClasses,
    AccordionDetails as MuiAccordionDetails,
    AccordionProps,
    AccordionSummary as MuiAccordionSummary,
    accordionSummaryClasses,
    AccordionSummaryProps,
    styled
} from '@mui/material';
import React from 'react';

export const EmbedAccordion = styled(
    ({ children, ...props }: AccordionProps) => <MuiAccordion disableGutters elevation={0} {...props}>
        {children}
    </MuiAccordion>
)<AccordionProps>(({ theme }) => ({
    padding: theme.spacing(0, 1),
    backgroundColor: 'unset',
    border: 'none',
    [`&.${accordionClasses.disabled}`]: {
        backgroundColor: 'inherit'
    },
    '&::before': {
        display: 'none'
    }
}));

export const EmbedAccordionSummary = styled(
    (props: AccordionSummaryProps) => <MuiAccordionSummary expandIcon={<KeyboardArrowRightIcon />} {...props} />
)<AccordionSummaryProps>(({ theme }) => ({
    minHeight: 36,
    padding: 0,
    flexDirection: 'row-reverse',
    gap: theme.spacing(.5),
    fontWeight: 600,
    borderRadius: theme.shape.borderRadius,
    [`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]: {
        transform: 'rotate(90deg)'
    },
    [`& .${accordionSummaryClasses.content}`]: {
        margin: 0,
        alignItems: 'center',
        gap: theme.spacing(1)
    }
}));

export const EmbedAccordionDetails = styled(MuiAccordionDetails)({
    padding: 0,
    display: 'flex',
    flexDirection: 'column'
});
