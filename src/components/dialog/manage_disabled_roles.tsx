'use client';

import { Dialog, DialogActions, DialogHeader, DialogProps } from '@lunaproject-discord/web-core/dist/components/Dialog';
import { useResettableState } from '@lunaproject-discord/web-core/dist/utils/state';
import { ClearOutlined, CloseOutlined, DeleteOutlined, SaveOutlined, SearchOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
    Box,
    Button,
    DialogContent,
    IconButton,
    InputBase,
    ListItemText,
    Switch,
    switchClasses,
    Theme,
    useMediaQuery
} from '@mui/material';
import deepEqual from 'deep-equal';
import { useRouter } from 'next/navigation';
import { ellipsis, size } from 'polished';
import React, { Fragment, MouseEvent, useState, useTransition } from 'react';
import { RedisRole } from '../../interfaces/redis';
import { useTranslation } from '../../languages/client';
import { filterPredicateRole, sortRoles } from '../../utils/discord';
import { ListItemButton, ListItemIcon } from '../items';

interface Props extends DialogProps {
    choices: RedisRole[];
    values: string[];
    onClickSaveButton: (e: MouseEvent<HTMLButtonElement>, roles: string[]) => Promise<boolean>;
}

export const ManageDisabledRolesDialog = (
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

    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('md'));

    const [loading, setLoading] = useState(false);
    const [pending, startTransition] = useTransition();

    const [search, setSearch, resetSearch] = useResettableState('');

    const [roleIds, setRoleIds] = useResettableState(values);

    const roles = sortRoles(choices).filter((role) => role.position !== 0);

    const isChanged = () => !deepEqual(roleIds, values);

    const handleClose = () => {
        setSearch('');
        setRoleIds(values);
        onClose();
    };

    const handleDialogClose = (_: {}, reason: 'backdropClick' | 'escapeKeyDown') => {
        if ((reason === 'backdropClick' || reason === 'escapeKeyDown') && isChanged())
            return;

        handleClose();
    };

    const toggleEnabled = (channelId: string) => setRoleIds((ids) => roleIds.includes(channelId) ? ids.filter((id) => id !== channelId) : [...ids, channelId]);

    const handleClickSaveButton = async (e: MouseEvent<HTMLButtonElement>) => {
        setLoading(true);

        const result = await onClickSaveButton(e, roleIds);
        if (result)
            startTransition(() => router.refresh());

        setLoading(false);
        setSearch('');
        onClose();
    };

    return (
        <Fragment>
            <Dialog
                open={open}
                onClose={handleDialogClose}
                disableEscapeKeyDown={isChanged()}
                fullScreen={isMobile}
                fullWidth
                maxWidth="sm"
            >
                <DialogHeader>
                    {translations.manage_disabled_roles}
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
                            placeholder={translations.search_roles as string}
                            fullWidth
                        />
                        {search.length > 0 && <IconButton onClick={() => resetSearch()} sx={{ my: -.5, mr: -.5 }}>
                            <ClearOutlined color="action" />
                        </IconButton>}
                    </Box>
                    <Box sx={{ height: { xs: 'auto', md: 500 }, p: 2, overflowY: 'auto' }}>
                        {roles.filter((role) => filterPredicateRole(role, search)).map((role) => (
                            <ListItemButton
                                key={role.id}
                                onClick={() => toggleEnabled(role.id)}
                                sx={{ px: 1.5, borderRadius: 1 }}
                            >
                                <ListItemIcon sx={{ placeItems: 'center', placeContent: 'center' }}>
                                    <Box
                                        sx={{
                                            ...size(16),
                                            bgcolor: `#${role.color.toString(16).padStart(6, '0')}`,
                                            borderRadius: '50%'
                                        }}
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary={role.name}
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
                                        checked={!roleIds.includes(role.id)}
                                        onChange={() => toggleEnabled(role.id)}
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
                    </Box>
                </DialogContent>
                <DialogActions>
                    {isChanged() ? <Fragment>
                        <Button
                            onClick={handleClose}
                            disabled={loading || pending}
                            color="inherit"
                            startIcon={<DeleteOutlined />}
                        >
                            {translations.reset}
                        </Button>
                        <LoadingButton
                            onClick={handleClickSaveButton}
                            loading={loading || pending}
                            loadingPosition="start"
                            variant="contained"
                            startIcon={<SaveOutlined />}
                        >
                            {translations.save}
                        </LoadingButton>
                    </Fragment> : <Button onClick={handleClose} variant="contained" startIcon={<CloseOutlined />}>
                        {translations.close}
                    </Button>}
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};
