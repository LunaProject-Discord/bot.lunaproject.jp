import {
    AnnouncementChannelIcon,
    Dialog,
    DialogActions,
    DialogHeader,
    DialogProps,
    ForumChannelIcon,
    StageChannelIcon,
    TextChannelIcon,
    VoiceChannelIcon
} from '@lunaproject-discord/web-core';
import { APIGuildChannel } from '@lunaproject-discord/web-discord';
import { ChevronRightOutlined, CloseOutlined, SaveOutlined, SearchOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
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
    InputBase,
    ListItemText,
    styled,
    Switch,
    switchClasses
} from '@mui/material';
import { APIGuildCategoryChannel, APITextBasedChannel, APIVoiceChannelBase, ChannelType } from 'discord-api-types/v10';
import { useRouter } from 'next/navigation';
import { ellipsis } from 'polished';
import React, { Fragment, MouseEvent, useState, useTransition } from 'react';
import { useTranslation } from '../../languages/client';
import { filterPredicateChannel, sortChannels } from '../../utils/discord';
import { ListItemButton, ListItemIcon } from '../items';

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

interface Props extends DialogProps {
    choices: APIGuildChannel[];
    values: string[];
    onClickSaveButton: (e: MouseEvent<HTMLButtonElement>, channels: string[]) => Promise<boolean>;
}

export const ManageDisabledChannelsDialog = (
    {
        open,
        onClose,
        choices,
        values,
        onClickSaveButton
    }: Props
) => {
    const router = useRouter();

    const translations = useTranslation();

    const [loading, setLoading] = useState(false);
    const [pending, startTransition] = useTransition();

    const [search, setSearch] = useState('');

    const [channelIds, setChannelIds] = useState(values);

    const guildChannels = sortChannels(choices);
    const categories = guildChannels.filter((channel): channel is APIGuildCategoryChannel => channel.type === ChannelType.GuildCategory);
    const textChannels = guildChannels.filter((channel): channel is Extract<APIGuildChannel, APITextBasedChannel<any>> => channel.type === ChannelType.GuildText || channel.type === ChannelType.GuildAnnouncement || channel.type === ChannelType.GuildForum);
    const voiceChannels = guildChannels.filter((channel): channel is Extract<APIGuildChannel, APIVoiceChannelBase<any>> => channel.type === ChannelType.GuildVoice || channel.type === ChannelType.GuildStageVoice);
    const channels = [...textChannels, ...voiceChannels];

    const [expandedCategories, setExpandedCategories] = useState<string[]>(categories.map((category) => category.id));

    const handleClose = () => {
        setSearch('');
        setChannelIds(values);
        onClose();
    };

    const handleDialogClose = (_: {}, reason: 'backdropClick' | 'escapeKeyDown') => {
        if (reason === 'backdropClick')
            return;

        handleClose();
    };

    const handleChangeExpandedCategory = (categoryId: string | undefined) => {
        if (!categoryId || search.length > 0)
            return;

        setExpandedCategories((ids) => ids.includes(categoryId) ? ids.filter((id) => id !== categoryId) : [...ids, categoryId]);
    };

    const toggleEnabled = (channelId: string) => setChannelIds((ids) => channelIds.includes(channelId) ? ids.filter((id) => id !== channelId) : [...ids, channelId]);

    const handleClickSaveButton = async (e: MouseEvent<HTMLButtonElement>) => {
        setLoading(true);

        const result = await onClickSaveButton(e, channelIds);
        if (result)
            startTransition(() => router.refresh());

        setLoading(false);
        setSearch('');
        onClose();
    };

    return (
        <Fragment>
            <Dialog open={open} onClose={handleDialogClose} maxWidth="sm" fullWidth sx={{ maxWidth: 1400 }}>
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
                        <SearchOutlined />
                        <InputBase
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="チャンネルを検索..."
                            fullWidth
                        />
                    </Box>
                    <Box sx={{ height: { xs: 'auto', md: 500 }, p: 2, overflowY: 'auto' }}>
                        {[undefined, ...categories].filter((category) => search.length < 1 || channels.some((channel) => channel.parent_id == category?.id && filterPredicateChannel(channel, search))).map((category) => (
                            <Accordion
                                key={category?.id ?? 'no_parent'}
                                expanded={search.length > 0 || !category || expandedCategories.includes(category.id)}
                                onChange={() => handleChangeExpandedCategory(category?.id)}
                                defaultExpanded
                                disabled={search.length > 0}
                            >
                                {category && <AccordionSummary>{category.name}</AccordionSummary>}
                                <AccordionDetails>
                                    {channels.filter((channel) => channel.parent_id == category?.id && filterPredicateChannel(channel, search)).map((channel) => (
                                        <ListItemButton
                                            key={channel.id}
                                            onClick={() => toggleEnabled(channel.id)}
                                            sx={{ px: 1.5, borderRadius: 1 }}
                                        >
                                            <ListItemIcon>
                                                {channel.type === ChannelType.GuildText && <TextChannelIcon />}
                                                {channel.type === ChannelType.GuildVoice && <VoiceChannelIcon />}
                                                {channel.type === ChannelType.GuildAnnouncement &&
                                                    <AnnouncementChannelIcon />}
                                                {channel.type === ChannelType.GuildStageVoice && <StageChannelIcon />}
                                                {channel.type === ChannelType.GuildForum && <ForumChannelIcon />}
                                            </ListItemIcon>
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
                                                    checked={!channelIds.includes(channel.id)}
                                                    onChange={() => toggleEnabled(channel.id)}
                                                    disableRipple
                                                    tabIndex={-1}
                                                    sx={{ [`& .${switchClasses.switchBase}`]: { backgroundColor: 'transparent !important' } }}
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
                    <Button onClick={handleClose} startIcon={<CloseOutlined />}>
                        {translations.cancel}
                    </Button>
                    <LoadingButton
                        onClick={handleClickSaveButton}
                        loading={loading || pending}
                        loadingPosition="start"
                        startIcon={<SaveOutlined />}
                        variant="contained"
                    >
                        {translations.save}
                    </LoadingButton>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};
