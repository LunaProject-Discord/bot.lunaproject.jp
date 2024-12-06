import { PickerChoiceFilter } from '@/components/picker';
import { useDebounce } from '@lunaproject/web-core/dist/utils';
import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react';
import { SnapPointProps } from 'react-spring-bottom-sheet/dist/types';

export const usePickerSearch = (_search?: string, _setSearch?: Dispatch<SetStateAction<string>>) => {
    const [__search, __setSearch] = useState('');
    const search = useDebounce(_search ?? __search, 500);
    const setSearch = _setSearch ?? __setSearch;

    return { search, setSearch };
};

export const getPickerChoices = <T>(choices: T[], search: string, filter: PickerChoiceFilter<T> | undefined) => filter ? choices.filter((choice) => filter(choice, search)) : choices;

export const useMobilePickerRef = () => {
    const sheetScrollRef = useRef<HTMLDivElement | null>(null);

    const sheetContentRef = useRef<HTMLDivElement | null>(null);
    const setSheetContentRef = useCallback((element: HTMLDivElement | null) => {
        const scrollElement = element?.closest('[data-rsbs-scroll]');
        if (scrollElement)
            sheetScrollRef.current = scrollElement as HTMLDivElement;

        sheetContentRef.current = element;
    }, []);

    return { sheetScrollRef, sheetContentRef, setSheetContentRef };
};

export const getMobilePickerDefaultSnap = ({ maxHeight }: SnapPointProps) => maxHeight / 2;

export const getMobilePickerSnapPoints = ({ maxHeight }: SnapPointProps) => [maxHeight - 8 * 9, maxHeight / 2];
