import { Code } from '@components/text';
import { LocalizationProps } from '@interfaces/localization';
import { Box, styled, Typography } from '@mui/material';
import React from 'react';
import { ZodIssue } from 'zod';

export const IssuesRoot = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1)
}));

export const IssueRoot = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(1)
}));

export interface IssuesProps extends LocalizationProps {
    issues: ZodIssue[];
}

export const Issues = ({ issues, localization: { translations } }: IssuesProps) => (
    <IssuesRoot>
        <Typography variant="h6" fontWeight={400}>
            {String(translations.save_confirm_issues).replace('%c', issues.length.toLocaleString())}
        </Typography>
        {issues.map((issue) => (
            <IssueRoot key={`${issue.path.join('.')}-${issue.code}`}>
                <Typography><Code>{issue.path.join('.')}</Code>: {issue.code}</Typography>
                <Typography variant="body2">
                    {issue.message in translations ? translations[issue.message as keyof typeof translations] : issue.message}
                </Typography>
            </IssueRoot>
        ))}
    </IssuesRoot>
);
