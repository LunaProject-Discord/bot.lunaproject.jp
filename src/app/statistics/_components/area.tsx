import { StatisticResponseProps } from '@app/statistics/_components/interfaces';
import { Statistic } from '@interfaces/bot';
import { useTheme } from '@mui/material';
import { fromDBDate } from '@utils/date';
import { curveMonotoneX } from '@visx/curve';
import { localPoint } from '@visx/event';
import { LinearGradient } from '@visx/gradient';
import { GridColumns, GridRows } from '@visx/grid';
import { scaleLinear, scaleTime } from '@visx/scale';
import { AreaClosed, Bar, Line } from '@visx/shape';
import { defaultStyles, Tooltip, TooltipWithBounds, withTooltip } from '@visx/tooltip';
import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { bisector, extent, max, min } from '@visx/vendor/d3-array';
import React, { useCallback, useMemo } from 'react';

const bisectDate = bisector<Statistic, Date>((statistic) => fromDBDate(new Date(statistic.createdAt))).left;

export interface AreaChartProps extends StatisticResponseProps {
    statistics: Statistic[];

    width: number;
    height: number;
    margin?: {
        top: number;
        bottom: number;
        left: number;
        right: number;
    };
}

export const AreaChart = withTooltip<AreaChartProps, Statistic>((
    {
        statistics,
        getDate,
        getValue,
        formatDate,
        formatValue,

        width,
        height,
        margin = { top: 0, bottom: 0, left: 0, right: 0 },
        showTooltip,
        hideTooltip,
        tooltipData,
        tooltipTop = 0,
        tooltipLeft = 0
    }: AreaChartProps & WithTooltipProvidedProps<Statistic>
) => {
    if (width < 10) return null;

    const theme = useTheme();

    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const dateScale = useMemo(() => scaleTime({
        range: [margin.left, innerWidth + margin.left],
        domain: extent(statistics, getDate) as [Date, Date]
    }), [innerWidth, margin.left]);
    const stockValueScale = useMemo(() => scaleLinear({
        range: [innerHeight + margin.top, margin.top],
        domain: [Math.max(0, (min(statistics, getValue) || 0) - 5), (max(statistics, getValue) || 0) + 5],
        nice: true
    }), [margin.top, innerHeight]);

    const handleTooltip = useCallback(
        (event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>) => {
            const { x } = localPoint(event) || { x: 0 };
            const x0 = dateScale.invert(x);
            const index = bisectDate(statistics, x0, 1);
            const d0 = statistics[index - 1];
            const d1 = statistics[index];

            let d = d0;
            if (d1 && getDate(d1))
                d = x0.valueOf() - getDate(d0).valueOf() > getDate(d1).valueOf() - x0.valueOf() ? d1 : d0;

            showTooltip({
                tooltipData: d,
                tooltipLeft: x,
                tooltipTop: stockValueScale(getValue(d))
            });
        },
        [showTooltip, stockValueScale, dateScale]
    );

    return (
        <div>
            <svg width={width} height={height}>
                <rect x={0} y={0} width={width} height={height} fill="transparent" rx={4} />
                <LinearGradient
                    id="area-gradient"
                    from={theme.palette.primary.main}
                    to={theme.palette.primary.main}
                    fromOpacity={.2}
                    toOpacity={.2}
                />
                <GridRows
                    left={margin.left}
                    scale={stockValueScale}
                    width={innerWidth}
                    strokeDasharray="1,3"
                    stroke={theme.palette.primary.main}
                    strokeOpacity={0}
                    pointerEvents="none"
                />
                <GridColumns
                    top={margin.top}
                    scale={dateScale}
                    height={innerHeight}
                    strokeDasharray="1,3"
                    stroke={theme.palette.primary.main}
                    strokeOpacity={.5}
                    pointerEvents="none"
                />
                <AreaClosed<Statistic>
                    data={statistics}
                    x={(d) => dateScale(getDate(d)) ?? 0}
                    y={(d) => stockValueScale(getValue(d)) ?? 0}
                    yScale={stockValueScale}
                    strokeWidth={2}
                    stroke={theme.palette.primary.main}
                    fill="url(#area-gradient)"
                    curve={curveMonotoneX}
                />
                <Bar
                    x={margin.left}
                    y={margin.top}
                    width={innerWidth}
                    height={innerHeight}
                    fill="transparent"
                    rx={14}
                    onTouchStart={handleTooltip}
                    onTouchMove={handleTooltip}
                    onMouseMove={handleTooltip}
                    onMouseLeave={() => hideTooltip()}
                />
                {tooltipData && (
                    <g>
                        <Line
                            from={{ x: tooltipLeft, y: margin.top }}
                            to={{ x: tooltipLeft, y: innerHeight + margin.top }}
                            stroke={theme.palette.primary.dark}
                            strokeWidth={2}
                            pointerEvents="none"
                            strokeDasharray="5,2"
                        />
                        <circle
                            cx={tooltipLeft}
                            cy={tooltipTop + 1}
                            r={4}
                            fill="black"
                            fillOpacity={.1}
                            stroke="black"
                            strokeOpacity={.1}
                            strokeWidth={2}
                            pointerEvents="none"
                        />
                        <circle
                            cx={tooltipLeft}
                            cy={tooltipTop}
                            r={4}
                            fill={theme.palette.primary.dark}
                            stroke="white"
                            strokeWidth={2}
                            pointerEvents="none"
                        />
                    </g>
                )}
            </svg>
            {tooltipData && (
                <div>
                    <TooltipWithBounds
                        key={Math.random()}
                        top={tooltipTop - 12}
                        left={tooltipLeft + 12}
                        style={{
                            ...defaultStyles,
                            background: theme.palette.primary.main,
                            border: '1px solid white',
                            color: 'white'
                        }}
                    >
                        {formatValue(getValue(tooltipData))}
                    </TooltipWithBounds>
                    <Tooltip
                        top={innerHeight + margin.top - 14}
                        left={tooltipLeft}
                        style={{
                            ...defaultStyles,
                            minWidth: 72,
                            textAlign: 'center',
                            whiteSpace: 'nowrap',
                            transform: 'translateX(-50%)'
                        }}
                    >
                        {formatDate(getDate(tooltipData))}
                    </Tooltip>
                </div>
            )}
        </div>
    );
});
