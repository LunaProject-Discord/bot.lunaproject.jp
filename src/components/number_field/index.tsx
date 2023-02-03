import { KeyboardArrowDownOutlined, KeyboardArrowUpOutlined } from '@mui/icons-material';
import { InputAdornment, inputBaseClasses, OutlinedInput, OutlinedInputProps, styled } from '@mui/material';
import React from 'react';
import { ButtonBase } from '../button_base';

const Button = styled(ButtonBase)({
    height: 20,
    borderRadius: 0
});

interface Props extends Partial<OutlinedInputProps> {
    value: number;
    setValue: (value: number) => void;
    step?: number;
    min?: number;
    max?: number;
    disabled?: boolean;
}

export const NumberField = ({ value, setValue, step, min, max, disabled, ...props }: Props) => {
    const amount = step ?? 1;
    return (
        <OutlinedInput
            value={value}
            onChange={(e) => {
                const value = Number(e.target.value);
                if (min && value < min) {
                    setValue(min);
                    return;
                }

                if (max && value > max) {
                    setValue(max);
                    return;
                }

                setValue(value);
            }}
            type="number"
            inputProps={{
                step: amount,
                min,
                max
            }}
            disabled={disabled}
            size="small"
            margin="none"
            endAdornment={
                <InputAdornment
                    position="end"
                    sx={{
                        height: '100%',
                        maxHeight: 'unset',
                        m: 0,
                        flexDirection: 'column',
                        placeItems: 'center',
                        placeContent: 'center',
                        cursor: 'default'
                    }}
                >
                    <Button
                        onClick={() => {
                            if (!max || (value + amount) <= max)
                                setValue(value + amount);
                        }}
                        disabled={disabled || value === max}
                        tabIndex={-1}
                        sx={{ borderTopRightRadius: (theme) => theme.shape.borderRadius }}
                    >
                        <KeyboardArrowUpOutlined />
                    </Button>
                    <Button
                        onClick={() => {
                            if (!min || (value - amount) >= min)
                                setValue(value - amount);
                        }}
                        disabled={disabled || value === min}
                        tabIndex={-1}
                        sx={{ borderBottomRightRadius: (theme) => theme.shape.borderRadius }}
                    >
                        <KeyboardArrowDownOutlined />
                    </Button>
                </InputAdornment>
            }
            sx={{
                width: {
                    xs: '100%',
                    md: 300
                },
                p: 0,
                [`& .${inputBaseClasses.input}`]: {
                    px: 1.75,
                    py: '8.5px'
                },
                [`& .${inputBaseClasses.input}::-webkit-outer-spin-button, .${inputBaseClasses.input}::-webkit-inner-spin-button`]: {
                    margin: 0,
                    WebkitAppearance: 'none'
                },
                [`& .${inputBaseClasses.input}[type=number]`]: {
                    MozAppearance: 'textfield'
                }
            }}
            {...props}
        />
    );
};
