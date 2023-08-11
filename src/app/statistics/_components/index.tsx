import { Skeleton } from '@mui/material';
import { ParentSize } from '@visx/responsive';
import React, { useEffect, useState } from 'react';
import { AreaChart as OriginalAreaChart, AreaChartProps } from './area';

export const AreaChart = ({ statistics, ...props }: Omit<AreaChartProps, 'width' | 'height'>) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading((prevState) => !prevState);
        setTimeout(() => setLoading((prevState) => !prevState), 1000);
    }, [statistics]);

    if (loading)
        return (<Skeleton variant="rounded" width="100%" height="100%" />);

    return (
        <ParentSize debounceTime={10}>
            {({ width, height }) => (
                <OriginalAreaChart statistics={statistics} width={width} height={height} {...props} />
            )}
        </ParentSize>
    );
};

export * from './datagrid';
