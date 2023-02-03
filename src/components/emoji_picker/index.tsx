import data from '@emoji-mart/data/sets/14/twitter.json';
import React, { useRef } from 'react';

const EmojiPicker = (props: any): JSX.Element => {
    const pickerRef = useRef();
    const moduleRef = useRef();
    const handleDivRef = (divElem: HTMLDivElement) => {
        pickerRef.current = divElem as any;
        if (!moduleRef.current) {
            moduleRef.current = import('emoji-mart').then(
                (m) => new m.Picker({
                    ...props,
                    ref: pickerRef,
                    data,
                    set: 'twitter'
                })
            ) as any;
        }
    };
    return <div ref={handleDivRef} />;
};

export default EmojiPicker;
