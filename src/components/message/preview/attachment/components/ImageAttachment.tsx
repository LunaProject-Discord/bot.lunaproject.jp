import styled from '@emotion/styled';
import React, { useLayoutEffect, useState } from 'react';
import { DefaultAttachment } from './DefaultAttachment';

const Image = styled('img')({
    maxWidth: 400,
    maxHeight: 300,
    display: 'block',
    cursor: 'pointer',
    borderRadius: 3
});

export interface ImageAttachmentProps {
    file: File;
}

export const ImageAttachment = ({ file }: ImageAttachmentProps) => {
    const [objectUrl, setObjectUrl] = useState('');
    useLayoutEffect(() => {
        const objectUrl = URL.createObjectURL(file);
        setObjectUrl(objectUrl);

        return () => {
            if (objectUrl)
                URL.revokeObjectURL(objectUrl);
        };
    }, [file]);

    const [errored, setErrored] = useState(false);
    useLayoutEffect(() => setErrored(false), [objectUrl]);

    if (errored)
        return (<DefaultAttachment file={file} type="image" />);

    return (<Image src={objectUrl} alt={file.name} onError={() => setErrored(true)} />);
};
