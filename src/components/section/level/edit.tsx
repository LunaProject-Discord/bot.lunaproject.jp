'use client';

import { SectionLevelHeaderProps, SectionLevelViewHeader, SectionLevelViewProps } from '@/components/section';
import { SectionLevelEditCard, SectionLevelEditCardRootProps } from '@/components/section_card';
import { PartialGuildLevels } from '@/interfaces/bot';
import { Section } from '@lunaproject/web-core/dist/components/Section';
import { sectionAccordionCardClasses, SectionCardRoot } from '@lunaproject/web-core/dist/components/SectionCard';
import { CircularProgress } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { WindowVirtualizer, WindowVirtualizerProps } from 'virtua';

export const SectionLevelEditHeader = (
    {
        sx,
        ...props
    }: SectionLevelHeaderProps
) => (
    <SectionLevelViewHeader
        sx={{
            gridTemplateColumns: '32px 40px 1fr 10% 10% 24px',
            ...sx
        }}
        {...props}
    />
);

export interface SectionLevelEditProps extends SectionLevelViewProps {
    partialLevels: PartialGuildLevels;
    updateLevel: (userId: string) => SectionLevelEditCardRootProps['setValue'];
}

export const SectionLevelEdit = (
    {
        guild,
        levels,
        partialLevels,
        updateLevel,
        localization
    }: SectionLevelEditProps
) => {
    const [items, setItems] = useState(levels.slice(0, 100));
    const count = items.length;

    const [loading, setLoading] = useState(false);
    const fetchedCountRef = useRef(-1);

    const handleRangeChange: WindowVirtualizerProps['onRangeChange'] = (_, end) => {
        if (end + 50 <= count || fetchedCountRef.current >= count || levels.length === count)
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
                [`& .${sectionAccordionCardClasses.root}`]: {
                    mt: .5
                }
            }}
        >
            <WindowVirtualizer onRangeChange={handleRangeChange}>
                {items.map((level) => {
                    const partialLevel = partialLevels.find((partialLevel) => partialLevel.user_id === level.user.id);

                    return (
                        <SectionLevelEditCard
                            key={level.user.id}
                            value={{ ...level, ...partialLevel }}
                            setValue={updateLevel(level.user.id)}
                            guild={guild}
                            localization={localization}
                        />
                    );
                })}
                {loading && <SectionCardRoot sx={{ justifyContent: 'center' }}>
                    <CircularProgress />
                </SectionCardRoot>}
            </WindowVirtualizer>
        </Section>
    );
};
