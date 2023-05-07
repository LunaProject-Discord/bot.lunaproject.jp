import { Dialog, DialogActions, DialogProps } from '@lunaproject-discord/web-core/dist/components/Dialog';
import { useResettableState } from '@lunaproject-discord/web-core/dist/utils/state';
import { AddOutlined, CloseOutlined, DeleteOutlined, SaveOutlined } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Button, DialogContent, DialogTitle, Theme, useMediaQuery } from '@mui/material';
import deepEqual from 'deep-equal';
import { APIRole } from 'discord-api-types/v10';
import { useRouter } from 'next/navigation';
import { size } from 'polished';
import React, { Fragment, MouseEvent, useState, useTransition } from 'react';
import { NumberFieldItem, RolePopover } from '../../../../components/items';
import { GuildSettingsLevelRewardRole } from '../../../../interfaces/bot';
import { LocalizationProps } from '../../../../interfaces/localization';
import { RedisRole } from '../../../../interfaces/redis';
import { getRoleColor, sortRoles } from '../../../../utils/discord';

interface Props extends DialogProps, LocalizationProps {
    choices: RedisRole[];
    initialValues: GuildSettingsLevelRewardRole[];
    onClickSaveButton: (e: MouseEvent<HTMLButtonElement>, roles: GuildSettingsLevelRewardRole[]) => Promise<boolean>;
}

export const ManageRolesDialog = (
    {
        open,
        onClose,
        choices,
        initialValues,
        onClickSaveButton,
        localization: { translations }
    }: Props
) => {
    const router = useRouter();

    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('md'));

    const [loading, setLoading] = useState(false);
    const [pending, startTransition] = useTransition();

    const [values, setValues] = useResettableState(initialValues);

    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const popoverOpen = Boolean(anchorEl);

    const handlePopoverOpen = (e: MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);
    const handlePopoverClose = () => setAnchorEl(null);

    const roles = sortRoles(choices).filter((role) => role.position !== 0) as APIRole[];

    const isChanged = () => !deepEqual(values, initialValues);

    const handleClose = () => {
        setValues(initialValues);
        onClose();
    };

    const handleDialogClose = (_: {}, reason: 'backdropClick' | 'escapeKeyDown') => {
        if ((reason === 'backdropClick' || reason === 'escapeKeyDown') && isChanged())
            return;

        handleClose();
    };

    const updateValue = (id: string, level: number) => setValues((values) => {
        let data = [...values];

        const i = data.findIndex((level) => level.id === id);
        if (i !== -1)
            data.splice(i, 1);

        const current = initialValues.find((level) => level.id === id);
        if (level !== current?.level)
            data.push({ id, level });

        return data;
    });

    const handleClickSaveButton = async (e: MouseEvent<HTMLButtonElement>) => {
        setLoading(true);

        const result = await onClickSaveButton(e, values);
        if (result)
            startTransition(() => router.refresh());

        setLoading(false);
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
                <DialogTitle sx={{ height: 64, m: 0, px: 2, display: 'flex', alignItems: 'center' }}>
                    {translations.level_reward_manage_roles}
                    <Button
                        onClick={handlePopoverOpen}
                        variant="contained"
                        startIcon={<AddOutlined />}
                        sx={{ ml: 'auto' }}
                    >
                        {translations.add}
                    </Button>
                </DialogTitle>
                <DialogContent
                    dividers
                    sx={{
                        p: '0 !important',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden'
                    }}
                >
                    <Box sx={{ height: { xs: 'auto', md: 500 }, p: 2, overflowY: 'auto' }}>
                        {values.filter((level) => choices.some((choice) => choice.id === level.id))
                            .map((level) => {
                                const role = choices.find((choice) => choice.id === level.id)!!;
                                return (
                                    <NumberFieldItem
                                        key={role.id}
                                        icon={
                                            <Box
                                                sx={{
                                                    ...size(16),
                                                    bgcolor: getRoleColor(role),
                                                    borderRadius: '50%'
                                                }}
                                            />
                                        }
                                        primary={role.name}
                                        value={level.level}
                                        setValue={(level) => updateValue(role.id, level)}
                                        min={0}
                                    />
                                );
                            })
                        }
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

            <RolePopover
                open={popoverOpen}
                anchorEl={anchorEl}
                onPopupClose={handlePopoverClose}
                value=""
                setValue={(id) => updateValue(id, 0)}
                choices={roles}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            />
        </Fragment>
    );
};
