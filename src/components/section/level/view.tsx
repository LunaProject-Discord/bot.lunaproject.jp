'use client';

import {
    sectionLevelHeaderClasses,
    SectionLevelHeaderItem,
    SectionLevelHeaderProps,
    SectionLevelHeaderRoot
} from '@/components/section';
import { SectionLevelViewCard } from '@/components/section_card';
import { GuildLevel } from '@/interfaces/bot';
import { GuildViewProps } from '@/interfaces/view';
import { Section } from '@lunaproject/web-core/dist/components/Section';
import { sectionCardClasses, SectionCardRoot } from '@lunaproject/web-core/dist/components/SectionCard';
import { CircularProgress } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { WindowVirtualizer, WindowVirtualizerHandle } from 'virtua';

export const SectionLevelViewHeader = (
    {
        localization: { translations },
        ...props
    }: SectionLevelHeaderProps
) => (
    <SectionLevelHeaderRoot {...props}>
        <SectionLevelHeaderItem align="center" className={sectionLevelHeaderClasses.rank}>
            {translations.rank}
        </SectionLevelHeaderItem>
        <SectionLevelHeaderItem className={sectionLevelHeaderClasses.profile}>
            {translations.member}
        </SectionLevelHeaderItem>
        <SectionLevelHeaderItem align="center" className={sectionLevelHeaderClasses.level}>
            {translations.level}
        </SectionLevelHeaderItem>
        <SectionLevelHeaderItem align="center" className={sectionLevelHeaderClasses.experience}>
            {translations.experience}
        </SectionLevelHeaderItem>
    </SectionLevelHeaderRoot>
);

export interface SectionLevelViewProps extends GuildViewProps {
    levels: GuildLevel[];
}

export const SectionLevelView = ({ guild, levels, localization }: SectionLevelViewProps) => {
    const ref = useRef<WindowVirtualizerHandle>(null);

    const [items, setItems] = useState(levels.slice(0, 100));
    const count = items.length;

    const [loading, setLoading] = useState(false);
    const fetchedCountRef = useRef(-1);

    const handleScroll = async () => {
        if (!ref.current)
            return;

        if (fetchedCountRef.current >= count || ref.current.findEndIndex() + 50 <= count || levels.length === count)
            return;

        fetchedCountRef.current = count;

        setLoading(true);
        setItems((prevItems) => [...prevItems, ...levels.slice(prevItems.length, prevItems.length + 100)]);
        setLoading(false);
    };

    useEffect(() => {
        fetchedCountRef.current = -1;
        setItems(levels.slice(0, 100));
        setLoading(false);
    }, [levels]);

    return (
        <Section
            sx={{
                mt: -.5,
                p: 0,
                [`& .${sectionCardClasses.root}`]: {
                    mt: .5
                }
            }}
        >
            <WindowVirtualizer ref={ref} onScroll={handleScroll}>
                {items.map(({ user, member, rank, level, experience }) => (
                    <SectionLevelViewCard
                        key={user.id}
                        user={user}
                        member={member}
                        guild={guild}
                        rank={rank}
                        level={level}
                        experience={experience}
                        localization={localization}
                    />
                ))}
                {loading && <SectionCardRoot sx={{ justifyContent: 'center' }}>
                    <CircularProgress />
                </SectionCardRoot>}
            </WindowVirtualizer>
        </Section>
    );
};
