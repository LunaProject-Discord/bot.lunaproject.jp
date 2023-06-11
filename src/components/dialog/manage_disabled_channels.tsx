'use client';

import { GuildChannelsViewProps } from '@interfaces/view';
import { Dialog, DialogActions, DialogHeader } from '@lunaproject-discord/web-core/dist/components/Dialog';
import { ItemVariableProps } from '@lunaproject-discord/web-core/dist/components/SectionItems';
import { useResettableState } from '@lunaproject-discord/web-core/dist/utils';
import { ChevronRightOutlined, ClearOutlined, CloseOutlined, SearchOutlined } from '@mui/icons-material';
import {
    Accordion as MuiAccordion,
    accordionClasses,
    AccordionDetails as MuiAccordionDetails,
    AccordionProps,
    AccordionSummary as MuiAccordionSummary,
    accordionSummaryClasses,
    AccordionSummaryProps,
    Box,
    Button,
    DialogContent,
    IconButton,
    InputBase,
    ListItemText,
    styled,
    Switch,
    switchClasses,
    Theme,
    useMediaQuery
} from '@mui/material';
import { filterPredicateChannel, sortChannels } from '@utils/discord';
import { ChannelType } from 'discord-api-types/v10';
import { ellipsis } from 'polished';
import React, { Fragment, useState } from 'react';
import { ChannelIcon } from '../icons';
import { ListItemButton, ListItemIcon } from '../items';
import { DialogProps } from './index';

const Accordion = styled(
    ({ children, ...props }: AccordionProps) => <MuiAccordion disableGutters elevation={0} {...props}>
        {children}
    </MuiAccordion>
)<AccordionProps>({
    backgroundColor: 'unset',
    border: 'none',
    [`&.${accordionClasses.disabled}`]: {
        backgroundColor: 'inherit'
    },
    '&::before': {
        display: 'none'
    }
});

const AccordionSummary = styled(
    (props: AccordionSummaryProps) => <MuiAccordionSummary expandIcon={<ChevronRightOutlined />} {...props} />
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
        margin: 0
    }
}));

const AccordionDetails = styled(MuiAccordionDetails)({
    padding: 0,
    display: 'flex',
    flexDirection: 'column'
});

type ManageDisabledChannelsDialogProps = DialogProps & ItemVariableProps<string[]> & GuildChannelsViewProps;

export const ManageDisabledChannelsDialog = (
    {
        open,
        setOpen,
        value,
        setValue,
        channels: choices,
        localization: { translations }
    }: ManageDisabledChannelsDialogProps
) => {
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('md'));

    const [search, setSearch, resetSearch] = useResettableState('');

    const guildChannels = sortChannels(choices);
    const categories = guildChannels.filter((channel) => channel.type === ChannelType.GuildCategory);
    const textChannels = guildChannels.filter((channel) => channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildAnnouncement || channel.type === ChannelType.GuildForum);
    const voiceChannels = guildChannels.filter((channel) => channel.type === ChannelType.GuildVoice || channel.type === ChannelType.GuildStageVoice);
    const choiceChannels = [...textChannels, ...voiceChannels];

    const [expandedCategories, setExpandedCategories] = useState<string[]>(categories.map((category) => category.id));

    const handleClose = () => {
        resetSearch();
        setOpen(false);
    };

    const handleCategoryExpandedChange = (categoryId: string | undefined) => {
        if (!categoryId || search.length > 0)
            return;

        setExpandedCategories((categories) => categories.includes(categoryId) ? categories.filter((id) => id !== categoryId) : [...categories, categoryId]);
    };

    const toggleEnabled = (channelId: string) => setValue((channels) => channels.includes(channelId) ? channels.filter((id) => id !== channelId) : [...channels, channelId]);

    return (
        <Fragment>
            <Dialog
                open={open}
                onClose={handleClose}
                fullScreen={isMobile}
                fullWidth
                maxWidth="sm"
                sx={{ zIndex: (theme) => theme.zIndex.modal + 100 }}
            >
                <DialogHeader>
                    {translations.manage_disabled_channels}
                </DialogHeader>
                <DialogContent
                    dividers
                    sx={{
                        p: '0 !important',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}
                >
                    <Box
                        sx={{
                            px: 2,
                            py: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            bgcolor: (theme) => theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900]
                        }}
                    >
                        <SearchOutlined color="action" />
                        <InputBase
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder={translations.search_channels as string}
                            fullWidth
                        />
                        {search.length > 0 && <IconButton onClick={() => resetSearch()} sx={{ my: -.5, mr: -.5 }}>
                            <ClearOutlined color="action" />
                        </IconButton>}
                    </Box>
                    <Box sx={{ height: { xs: 'auto', md: 500 }, p: 2, overflowY: 'auto' }}>
                        {[undefined, ...categories].filter((category) => search.length < 1 || choiceChannels.some((channel) => channel.parent_id == category?.id && filterPredicateChannel(channel, search))).map((category) => (
                            <Accordion
                                key={category?.id ?? 'no_parent'}
                                expanded={search.length > 0 || !category || expandedCategories.includes(category.id)}
                                onChange={() => handleCategoryExpandedChange(category?.id)}
                                defaultExpanded
                                disabled={search.length > 0}
                            >
                                {category && <AccordionSummary>{category.name}</AccordionSummary>}
                                <AccordionDetails>
                                    {choiceChannels.filter((channel) => channel.parent_id == category?.id && filterPredicateChannel(channel, search)).map((channel) => (
                                        <ListItemButton
                                            key={channel.id}
                                            onClick={() => toggleEnabled(channel.id)}
                                            sx={{ px: 1.5, borderRadius: 1 }}
                                        >
                                            <ListItemIcon><ChannelIcon channel={channel} /></ListItemIcon>
                                            <ListItemText
                                                primary={channel.name}
                                                primaryTypographyProps={{ sx: { ...ellipsis(), display: 'block' } }}
                                            />
                                            <Box
                                                sx={{
                                                    mr: -.75,
                                                    display: 'flex',
                                                    flexShrink: 0,
                                                    placeItems: 'center',
                                                    placeContent: 'center'
                                                }}
                                            >
                                                <Switch
                                                    checked={!value.includes(channel.id)}
                                                    disableRipple
                                                    tabIndex={-1}
                                                    sx={{
                                                        [`& .${switchClasses.switchBase}`]: {
                                                            backgroundColor: 'transparent !important'
                                                        }
                                                    }}
                                                />
                                            </Box>
                                        </ListItemButton>
                                    ))}
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} variant="contained" startIcon={<CloseOutlined />}>
                        {translations.close}
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};
