import { useTheme } from '@emotion/react';
import { DefaultField, Embed as EmbedData, EmbedField } from '@lunaproject-discord/web-discord/dist/interfaces/message';
import { AddOutlined, ClearOutlined, ExpandMoreOutlined } from '@mui/icons-material';
import {
    Accordion as MuiAccordion,
    AccordionDetails as MuiAccordionDetails,
    AccordionProps,
    AccordionSummary as MuiAccordionSummary,
    AccordionSummaryProps,
    Box,
    Button,
    ButtonBase,
    Checkbox,
    Divider,
    FormControlLabel,
    Grid,
    GridProps,
    IconButton,
    Popover,
    styled,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import clsx from 'clsx';
import Color from 'color';
import { ja } from 'date-fns/locale';
import React, { ReactNode, useState } from 'react';
import { ChromePicker } from 'react-color';
import { TextArea } from '../text_area';

const isValidHexColor = (value: string) => /^#([0-9A-F]{3}){1,2}$/i.test(value);

interface ContainerAccordionProps {
    borderColor: string;
}

const ContainerAccordion = styled(
    (props: AccordionProps) => (<MuiAccordion disableGutters elevation={0} {...props} />),
    { shouldForwardProp: (prop) => prop !== 'borderColor' }
)<ContainerAccordionProps>(({ theme, borderColor }) => ({
    // border: 'solid 1px rgb(235, 237, 239)',
    border: `solid 1px ${theme.palette.divider}`,
    borderLeft: `solid 4px ${borderColor}`,
    borderRadius: 4,
    boxShadow: 'rgb(0 0 0 / 8%) 0px 4px 4px',
    '&::before': {
        content: 'none'
    }
}));

const Accordion = styled(
    (props: AccordionProps) => (<MuiAccordion disableGutters elevation={0} {...props} />)
)(({ theme }) => ({
    border: 'none',
    borderBottom: `solid 1px ${theme.palette.divider}`,
    borderRadius: '0 !important',
    boxShadow: 'none',
    '&::before': {
        content: 'none'
    },
    '&:last-of-type': {
        border: 'none',
        borderBottomRightRadius: `4px !important`
    }
}));

const AccordionSummary = styled(
    (props: AccordionSummaryProps) => (<MuiAccordionSummary expandIcon={<ExpandMoreOutlined />} {...props} />)
)(({ theme }) => ({
    height: 40,
    minHeight: '40px !important',
    '&:hover': {
        background: theme.palette.action.hover
    }
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
    padding: theme.spacing(0)
}));

const FormGridItem = styled(
    (props: GridProps) => (<Grid item xs={12} {...props} />)
)(({ theme }) => ({
    padding: '0 0 0 16px !important',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    '&.right': {
        padding: '0 !important'
    },
    '&:not(.inline):not(:last-child) .item-container': {
        borderBottom: `solid 1px ${theme.palette.divider}`
    }
}));

const ItemLabelContainer = styled('div')(({ theme }) => ({
    height: 'auto',
    padding: theme.spacing(1, 2),
    display: 'flex',
    alignItems: 'center',
    [theme.breakpoints.up('md')]: {
        height: 40,
        padding: theme.spacing(1, 0)
    }
}));

const ItemTitleContainer = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    userSelect: 'none',
    [theme.breakpoints.up('md')]: {
        marginLeft: 16 // 8 -> 12
    }
}));

const ItemWrapper = styled('div')(({ theme }) => ({
    width: '100%',
    padding: theme.spacing(0, 2, 1),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'initial'
}));

interface FormContainerProps {
    inline?: boolean;

    right?: boolean;
    label: ReactNode;
    description?: ReactNode;
    children?: any;
}

const FormContainer = ({ inline = false, right = false, label, description, children }: FormContainerProps) => (
    <FormGridItem md={inline ? 6 : 12} className={clsx(inline && 'inline', right && 'right')}>
        <ItemLabelContainer>
            <ItemTitleContainer>
                <Typography variant="body1" sx={{ textAlign: 'start' }}>{label}</Typography>
                {description && <Typography variant="caption" sx={{ textAlign: 'start', color: 'text.secondary' }}>
                    {description}
                </Typography>}
            </ItemTitleContainer>
        </ItemLabelContainer>
        <ItemWrapper className="item-container">
            {children}
        </ItemWrapper>
    </FormGridItem>
);

interface Props {
    id: number;
    embed: EmbedData;
    onChange: (embed: EmbedData) => void;
    removeEmbed: () => void;
}

export const EmbedEditor = ({ id, embed, onChange, removeEmbed }: Props) => {
    const theme = useTheme();

    const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
    const open = Boolean(anchorEl);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const [color, setColor] = useState(embed.color.hex());

    const embedColor = embed.color.rgbNumber() === 0xffffff ? undefined : embed.color.hex();
    const author = embed.author;
    const footer = embed.footer;

    const changeColor = (hex: string) => {
        setColor(hex);
        if (isValidHexColor(hex) || hex.length === 0)
            onChange({ ...embed, color: Color(hex) });
    };

    const addField = () => onChange({ ...embed, fields: [...embed.fields, DefaultField] });

    const removeField = (i: number) => {
        let data = [...embed.fields];
        data.splice(i, 1);
        onChange({ ...embed, fields: data });
    };

    const updateField = (i: number, field: EmbedField) => {
        let data = [...embed.fields];
        data[i] = field;
        onChange({ ...embed, fields: data });
    };

    return (
        <ContainerAccordion borderColor={embedColor || theme.background.tertiary}>
            <MuiAccordionSummary
                expandIcon={<ExpandMoreOutlined />}
                sx={{
                    '& .MuiAccordionSummary-root': {
                        height: 40,
                        minHeight: '40px !important',
                        '&:hover': {
                            background: (theme) => theme.palette.action.hover
                        }
                    }
                }}
            >
                <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                    <Typography>Embed {id + 1}</Typography>
                    <div style={{
                        height: '100%',
                        marginLeft: 'auto',
                        display: 'flex',
                        alignItems: 'center'
                    }}>
                        <Tooltip title="languageSection.embed.remove">
                            <IconButton size="small" color="error" onClick={(e) => {
                                e.stopPropagation();
                                removeEmbed();
                            }}>
                                <ClearOutlined />
                            </IconButton>
                        </Tooltip>
                        <Divider orientation="vertical" sx={{ height: '80%', mx: 1 }} />
                    </div>
                </div>
            </MuiAccordionSummary>
            <AccordionDetails>
                <Accordion>
                    <AccordionSummary>
                        <Typography>languageEmbedSection.author.name</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={2} sx={{ mt: 0 }}>
                            <FormContainer label="languageEmbedSection.author.author">
                                <TextField
                                    value={author.name}
                                    onChange={(e) => onChange({
                                        ...embed,
                                        author: { ...author, name: e.target.value }
                                    })}
                                    inputProps={{ maxLength: 256 }}
                                    helperText={`${author.name.length} / 256`}
                                    multiline
                                    rows={1}
                                    size="small"
                                />
                            </FormContainer>
                            <FormContainer label="languageEmbedSection.author.url" inline>
                                <TextField
                                    value={author.url}
                                    onChange={(e) => onChange({
                                        ...embed,
                                        author: { ...author, url: e.target.value }
                                    })}
                                    size="small"
                                />
                            </FormContainer>
                            <FormContainer label="languageEmbedSection.author.iconUrl" inline>
                                <TextField
                                    value={author.iconUrl}
                                    onChange={(e) => onChange({
                                        ...embed,
                                        author: { ...author, iconUrl: e.target.value }
                                    })}
                                    size="small"
                                />
                            </FormContainer>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary>
                        <Typography>languageEmbedSection.body.name</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={2} sx={{ mt: 0 }}>
                            <FormContainer label="languageEmbedSection.body.title">
                                <TextField
                                    value={embed.title}
                                    onChange={(e) => onChange({
                                        ...embed,
                                        title: e.target.value
                                    })}
                                    inputProps={{ maxLength: 256 }}
                                    helperText={`${embed.title.length} / 256`}
                                    multiline
                                    rows={1}
                                    size="small"
                                />
                            </FormContainer>
                            <FormContainer label="languageEmbedSection.body.description">
                                <TextArea
                                    value={embed.description}
                                    setValue={(description) => onChange({ ...embed, description })}
                                    limit={4096}
                                    rows={4}
                                />
                            </FormContainer>
                            <FormContainer label="languageEmbedSection.body.url" inline>
                                <TextField
                                    value={embed.url}
                                    onChange={(e) => onChange({
                                        ...embed,
                                        url: e.target.value
                                    })}
                                    size="small"
                                />
                            </FormContainer>
                            <FormContainer label="languageEmbedSection.body.color" inline>
                                <Popover
                                    open={open}
                                    anchorEl={anchorEl}
                                    onClose={handleClose}
                                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                                    sx={{ zIndex: 1600 }}
                                    PaperProps={{
                                        sx: {
                                            border: (theme) => `solid 1px ${theme.palette.divider}`,
                                            boxShadow: (theme) => `0 ${theme.spacing(.5)} ${theme.spacing(1)} rgba(0, 0, 0, .15)`
                                        }
                                    }}
                                >
                                    <ChromePicker
                                        color={color}
                                        onChange={(colorResult) => changeColor(colorResult.hex)}
                                    />
                                </Popover>
                                <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                                    <TextField
                                        value={color}
                                        onChange={(e) => changeColor(e.target.value)}
                                        size="small"
                                    />
                                    <ButtonBase
                                        onClick={handleClick}
                                        sx={{
                                            width: 40,
                                            height: 40,
                                            ml: 1,
                                            flexShrink: 0,
                                            border: (theme) => `solid 1px ${theme.palette.divider}`,
                                            borderRadius: 1
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: '100%',
                                                height: '100%',
                                                backgroundColor: embedColor || theme.background.tertiary,
                                                borderRadius: 1
                                            }}
                                        />
                                    </ButtonBase>
                                </div>
                            </FormContainer>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary>
                        <Typography>languageEmbedSection.fields.name</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {embed.fields.map((field, i) => (
                            <Accordion key={i}>
                                <AccordionSummary>
                                    <div style={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                                        <Typography>Field {i + 1}</Typography>
                                        <div style={{
                                            height: '100%',
                                            marginLeft: 'auto',
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}>
                                            <Tooltip title="Remove">
                                                <IconButton size="small" color="error" onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeField(i);
                                                }}>
                                                    <ClearOutlined />
                                                </IconButton>
                                            </Tooltip>
                                            <Divider orientation="vertical" sx={{ height: '80%', mx: 1 }} />
                                        </div>
                                    </div>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={2} sx={{ mt: 0 }}>
                                        <FormContainer label="languageEmbedSection.fields.field.name">
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <TextField
                                                    value={field.name}
                                                    onChange={(e) => updateField(i, {
                                                        ...field,
                                                        name: e.target.value
                                                    })}
                                                    inputProps={{ maxLength: 256 }}
                                                    helperText={`${field.name.length} / 256`}
                                                    multiline
                                                    rows={1}
                                                    size="small"
                                                    fullWidth
                                                />
                                                <FormControlLabel
                                                    checked={field.inline}
                                                    onChange={(e, checked) => updateField(i, {
                                                        ...field,
                                                        inline: checked
                                                    })}
                                                    control={<Checkbox defaultChecked />}
                                                    label="languageEmbedSection.fields.field.inline"
                                                    componentsProps={{ typography: { sx: { whiteSpace: 'nowrap' } } }}
                                                    sx={{ ml: 'auto', mr: 0, pl: 1 }}
                                                />
                                            </div>
                                        </FormContainer>
                                        <FormContainer label="languageEmbedSection.fields.field.value">
                                            <TextField
                                                value={field.value}
                                                onChange={(e) => updateField(i, {
                                                    ...field,
                                                    value: e.target.value
                                                })}
                                                inputProps={{ maxLength: 1024 }}
                                                helperText={`${field.value.length} / 1024`}
                                                multiline
                                                rows={5}
                                            />
                                        </FormContainer>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                        <div style={{ padding: 8 }}>
                            <Button variant="contained" disableElevation startIcon={<AddOutlined />}
                                    onClick={addField} disabled={embed.fields.length > 24}>Add Field</Button>
                        </div>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary>
                        <Typography>languageEmbedSection.images.name</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                    </AccordionDetails>
                </Accordion>
                <Accordion>
                    <AccordionSummary>
                        <Typography>languageEmbedSection.footer.name</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Grid container spacing={2} sx={{ mt: 0 }}>
                            <FormContainer label="languageEmbedSection.footer.text">
                                <TextField
                                    value={footer.text}
                                    onChange={(e) => onChange({
                                        ...embed,
                                        footer: { ...footer, text: e.target.value }
                                    })}
                                    inputProps={{ maxLength: 2048 }}
                                    helperText={`${footer.text.length} / 2048`}
                                    multiline
                                    rows={1}
                                    size="small"
                                />
                            </FormContainer>
                            <FormContainer label="languageEmbedSection.footer.timestamp" inline>
                                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ja}>
                                    <DateTimePicker
                                        renderInput={(props) => <TextField size="small" {...props} />}
                                        value={embed.timestamp}
                                        onChange={(date) => onChange({
                                            ...embed,
                                            timestamp: date
                                        })}
                                        inputFormat="yyyy/MM/dd HH:mm"
                                        mask="____/__/__ __:__"
                                    />
                                </LocalizationProvider>
                            </FormContainer>
                            <FormContainer label="languageEmbedSection.footer.iconUrl" inline>
                                <TextField
                                    value={footer.iconUrl}
                                    onChange={(e) => onChange({
                                        ...embed,
                                        footer: { ...footer, iconUrl: e.target.value }
                                    })}
                                    size="small"
                                />
                            </FormContainer>
                        </Grid>
                    </AccordionDetails>
                </Accordion>
            </AccordionDetails>
        </ContainerAccordion>
    );
};
