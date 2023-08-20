'use client';

import { LocalizationProps } from '@interfaces/localization';
import { getNewEmbed } from '@libs/message';
import { Embed, Message } from '@lunaproject-discord/web-discord/dist/interfaces/message';
import { AddOutlined } from '@mui/icons-material';
import { Box, Button, Divider } from '@mui/material';
import React from 'react';
import { TextArea } from '../text_area';
import { EmbedEditor } from './embed';


interface Props extends LocalizationProps {
    message: Message;
    setMessage: (value: Message | ((prevValue: Message) => Message)) => void;
}

export const Editor = ({ message, setMessage, localization }: Props) => {
    const { translations } = localization;

    const addEmbed = () => setMessage((msg) => ({ ...msg, embeds: [...msg.embeds, getNewEmbed()] }));

    const removeEmbed = (i: number) => setMessage((msg) => {
        let data = [...msg.embeds];
        data.splice(i, 1);
        return { ...msg, embeds: data };
    });

    const updateEmbed = (i: number, embed: Embed) => setMessage((msg) => {
        let data = [...msg.embeds];
        data[i] = embed;
        return { ...msg, embeds: data };
    });

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextArea
                value={message.content}
                setValue={(content) => setMessage({ ...message, content })}
                limit={2000}
                rows={8}
            />
            <Divider flexItem />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button
                        onClick={addEmbed}
                        disabled={message.embeds.length > 9}
                        disableElevation
                        variant="contained"
                        startIcon={<AddOutlined />}
                    >
                        {translations.embed_add}
                    </Button>
                </Box>
                {message.embeds.map((embed, i) => (
                    <EmbedEditor
                        key={embed._id}
                        id={i}
                        embed={embed}
                        removeEmbed={() => removeEmbed(i)}
                        onChange={(data) => updateEmbed(i, data)}
                        localization={localization}
                    />
                ))}
            </Box>
        </Box>
    );
};
