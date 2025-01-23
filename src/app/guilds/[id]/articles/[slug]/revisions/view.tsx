'use client';

import { ArrowBackIcon } from '@/components/icons';
import { GuildWebPage, GuildWebPageContent } from '@/interfaces/bot';
import { GuildViewProps } from '@/interfaces/view';
import { getSlug } from '@/utils/web';
import { Section, SectionContent } from '@lunaproject/web-core/dist/components/Section';
import { SectionRouteLinkCard } from '@lunaproject/web-core/dist/components/SectionCard';
import {
    Timeline as MuiTimeline,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineItem,
    timelineItemClasses,
    TimelineSeparator as MuiTimelineSeparator
} from '@mui/lab';
import { Box, IconButton, styled, Tooltip, Typography } from '@mui/material';
import groupBy from 'lodash/groupBy';
import orderBy from 'lodash/orderBy';
import toPairs from 'lodash/toPairs';
import { DateTime } from 'luxon';
import NextLink from 'next/link';
import React, { useMemo } from 'react';
import { WindowVirtualizer } from 'virtua';

const Timeline = styled(MuiTimeline)(({ theme }) => ({
    padding: theme.spacing(0, 0, 0, 2),
    [`& .${timelineItemClasses.root}::before`]: {
        padding: 0,
        flex: 0
    }
}));

const TimelineSeparator = styled(MuiTimelineSeparator)(({ theme }) => ({
    width: theme.spacing(1.5),
    flex: 'unset'
}));

interface ViewProps extends GuildViewProps {
    page: GuildWebPage;
    contents: GuildWebPageContent[];
}

export const View = ({ guild, page, contents, localization }: ViewProps) => {
    const { translations, locale } = localization;

    const items: (GuildWebPageContent | string)[] = useMemo(() => orderBy(
        toPairs(
            groupBy(
                contents,
                (content) => {
                    const dateTime = DateTime.fromMillis(content.createdAt, {
                        zone: 'Asia/Tokyo',
                        locale
                    }).startOf('day');
                    return `${dateTime.toMillis()}_${dateTime.toFormat(translations.pattern_date_luxon as string)}`;
                }
            )
        ),
        ([date]) => Number(date.split('_')[0]),
        'desc'
    ).flatMap(([date, contents]) => [
        date.split('_')[1],
        ...(contents ?? []).toSorted((a, b) => a.createdAt < b.createdAt ? 1 : -1)
    ]), [contents, locale, translations.pattern_date_luxon]);

    const prefix = `/guilds/${guild.id}/articles/${getSlug(page)}`;
    return (
        <Box sx={{ maxWidth: (theme) => theme.breakpoints.values.lg, mx: 'auto' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Tooltip title={translations.back}>
                    <IconButton component={NextLink} href={prefix} size="large">
                        <ArrowBackIcon />
                    </IconButton>
                </Tooltip>
                <Typography variant="h1">この投稿の変更履歴</Typography>
            </Box>
            <Section>
                <SectionContent>
                    <Timeline>
                        <WindowVirtualizer>
                            {items.map((content, i) => {
                                if (typeof content === 'string')
                                    return (
                                        <TimelineItem key={content} sx={{ minHeight: 'unset' }}>
                                            <TimelineSeparator>
                                                <TimelineConnector />
                                            </TimelineSeparator>
                                            <TimelineContent
                                                sx={{
                                                    py: 0,
                                                    pt: i > 0 ? 2 : 0,
                                                    pb: .5,
                                                    pr: 0
                                                }}
                                            >
                                                <Typography component="h2" variant="h3">
                                                    {content}
                                                </Typography>
                                            </TimelineContent>
                                        </TimelineItem>
                                    );

                                return (
                                    <TimelineItem key={content.id}>
                                        <TimelineSeparator>
                                            <TimelineConnector
                                                sx={{
                                                    height: (theme) => theme.spacing(.65625),
                                                    flexGrow: 0
                                                }}
                                            />
                                            {!content.autoSave && <TimelineDot
                                                color={content.published ? 'primary' : 'grey'}
                                                variant={content.published ? 'filled' : 'outlined'}
                                            />}
                                            <TimelineConnector />
                                        </TimelineSeparator>
                                        <TimelineContent sx={{ py: .25, pr: 0 }}>
                                            <SectionRouteLinkCard
                                                primary={!content.autoSave ? (content.comment || 'コメントなし') : '自動保存された変更'}
                                                secondary={DateTime.fromMillis(
                                                    content.createdAt,
                                                    {
                                                        zone: 'Asia/Tokyo',
                                                        locale
                                                    }
                                                ).toFormat(translations.pattern_datetime_luxon as string)}
                                                href={`${prefix}/revisions/${content.id.toLowerCase()}`}
                                                slotProps={{
                                                    display: {
                                                        primary: {
                                                            sx: (theme) => ({
                                                                color: content.comment ? theme.vars.palette.text.primary : theme.vars.palette.text.secondary,
                                                                fontStyle: content.comment ? 'normal' : 'italic'
                                                            })
                                                        }
                                                    }
                                                }}
                                            />
                                        </TimelineContent>
                                    </TimelineItem>
                                );
                            })}
                        </WindowVirtualizer>
                    </Timeline>
                </SectionContent>
            </Section>
        </Box>
    );
};
