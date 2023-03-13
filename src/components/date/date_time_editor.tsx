import { Popover } from '@lunaproject-discord/web-core/dist/components/Popover';
import { TodayOutlined } from '@mui/icons-material';
import { IconButton, InputAdornment, Theme, useMediaQuery } from '@mui/material';
import { DateTimeField, MobileDateTimePicker, StaticDateTimePicker } from '@mui/x-date-pickers';
import React from 'react';
import { DateLocalizationProvider } from './localization_provider';
import { DatePickerModalDialog } from './picker_modal_dialog';

interface Props {
    value: Date | null;
    setValue: (value: Date | null) => void;
}

export const DateTimeEditor = ({ value, setValue }: Props) => {
    const isMobile = useMediaQuery<Theme>((theme) => theme.breakpoints.down('md'));

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);

    if (isMobile) {
        return (
            <DateLocalizationProvider>
                <MobileDateTimePicker
                    value={value}
                    onChange={(date) => setValue(date)}
                    slots={{ dialog: DatePickerModalDialog }}
                    slotProps={{
                        actionBar: { actions: ['today', 'cancel', 'accept'] },
                        textField: { size: 'small' }
                    }}
                />
            </DateLocalizationProvider>
        );
    } else {
        return (
            <DateLocalizationProvider>
                <DateTimeField
                    value={value}
                    onChange={(date) => setValue(date)}
                    fullWidth
                    slotProps={{
                        textField: {
                            size: 'small',
                            InputProps: {
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={(e) => setAnchorEl(e.currentTarget)}
                                            edge="end"
                                            size="small"
                                            sx={{ mr: -1 }}
                                        >
                                            <TodayOutlined />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }
                        }
                    }}
                />

                <Popover
                    open={!isMobile && open}
                    anchorEl={anchorEl}
                    onClose={() => setAnchorEl(null)}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    sx={{ zIndex: 1600 }}
                >
                    <StaticDateTimePicker
                        value={value}
                        onChange={(date) => setValue(date)}
                        slotProps={{ actionBar: { actions: ['today'] } }}
                    />
                </Popover>
            </DateLocalizationProvider>
        );
    }
};
