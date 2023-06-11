'use client';

import { GuildRolesViewProps } from '@interfaces/view';
import { Dialog, DialogActions, DialogHeader } from '@lunaproject-discord/web-core/dist/components/Dialog';
import { ItemVariableProps } from '@lunaproject-discord/web-core/dist/components/SectionItems';
import { useResettableState } from '@lunaproject-discord/web-core/dist/utils/state';
import { ClearOutlined, CloseOutlined, SearchOutlined } from '@mui/icons-material';
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
import { filterPredicateRole, getRoleColor, sortRoles } from '@utils/discord';
import { ellipsis, size } from 'polished';
import React, { Fragment } from 'react';
import { ListItemButton, ListItemIcon } from '../items';
import { DialogProps } from './index';

type ManageDisabledRolesDialogProps = DialogProps & ItemVariableProps<string[]> & GuildRolesViewProps;

export const ManageDisabledRolesDialog = (
    {
        open,
        setOpen,
        value,
        setValue,
        roles: choices,
        localization: { translations }
    }: ManageDisabledRolesDialogProps
) => {
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('md'));

    const [search, setSearch, resetSearch] = useResettableState('');

    const choiceRoles = sortRoles(choices).filter((role) => role.position !== 0);

    const handleClose = () => {
        resetSearch();
        setOpen(false);
    };

    const toggleEnabled = (roleId: string) => setValue((roles) => roles.includes(roleId) ? roles.filter((id) => id !== roleId) : [...roles, roleId]);

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
                        {choiceRoles.filter((role) => filterPredicateRole(role, search)).map((role) => (
                            <ListItemButton
                                key={role.id}
                                onClick={() => toggleEnabled(role.id)}
                                sx={{ px: 1.5, borderRadius: 1 }}
                            >
                                <ListItemIcon sx={{ placeItems: 'center', placeContent: 'center' }}>
                                    <Box sx={{ ...size(16), bgcolor: getRoleColor(role), borderRadius: '50%' }} />
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
                                        checked={!value.includes(role.id)}
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
                    <Button onClick={handleClose} variant="contained" startIcon={<CloseOutlined />}>
                        {translations.close}
                    </Button>
                </DialogActions>
            </Dialog>
        </Fragment>
    );
};
