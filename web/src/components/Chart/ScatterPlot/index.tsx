import React, { useMemo } from 'react';
import { useTypeSafeBreakpointValue } from '@hooks/useTypeSafeBreakpointValue';
import { scaleLinear, extent, format as d3Format } from 'd3';
import { StyledSvg, StyledLabel } from './UI';
import { Marks } from './Marks';
import { AxisLeft } from './AxisLeft';
import { AxisBottom } from './AxisBottom';
import type { Event } from '@types';

const LG_WIDTH = 600;
const LG_HEIGHT = 400;

const WIDTH = 500;
const HEIGHT = 333;

const MARGIN = { top: 30, right: 30, bottom: 100, left: 100 };

const getInnerWidth = (width: number) => width - MARGIN.right - MARGIN.left;
const getInnerHeight = (height: number) => height - MARGIN.top - MARGIN.bottom;

const X_TICK_OFFSET = 15;
const Y_TICK_OFFSET = 20;

const X_AXIS_LABEL_OFFSET = 70;
const Y_AXIS_LABEL_OFFSET = 75;

const X_LABEL = 'Expected Duration (sec)';
const Y_LABEL = 'Forecast Accuracy Rate (%)';

const xAxisTickFormat = (value: number) =>
  d3Format('~s')(value).replace('G', 'B');

const xValue = (d: Event) => d.expectedDuration;
const yValue = (d: Event) => (d.duration / d.expectedDuration) * 100;

interface ScatterPlotProps {
  events: Event[];
  circleRadius?: number;
}

export const ScatterPlot: React.FC<ScatterPlotProps> = ({
  events,
  circleRadius = 4,
}) => {
  const width = useTypeSafeBreakpointValue({
    default: WIDTH,
    base: WIDTH,
    xl: LG_WIDTH,
  });
  const height = useTypeSafeBreakpointValue({
    default: HEIGHT,
    base: HEIGHT,
    xl: LG_HEIGHT,
  });

  const innerWidth = useTypeSafeBreakpointValue<number>({
    default: getInnerWidth(WIDTH),
    base: getInnerWidth(WIDTH),
    xl: getInnerWidth(LG_WIDTH),
  });

  const innerHeight = useTypeSafeBreakpointValue<number>({
    default: getInnerWidth(HEIGHT),
    base: getInnerHeight(HEIGHT),
    xl: getInnerHeight(LG_HEIGHT),
  });

  const labelFontSize = useTypeSafeBreakpointValue({
    default: '1.2rem',
    xl: '1.5rem',
  });

  const xScale = useMemo(
    () =>
      scaleLinear()
        .range([0, innerWidth])
        .domain(extent(events, xValue) as [number, number]),
    [events, xValue, innerWidth]
  );

  const yScale = useMemo(
    () =>
      scaleLinear()
        .range([innerHeight, 0])
        .domain(extent(events, yValue) as [number, number])
        .nice(),
    [events, yValue, innerHeight]
  );

  return (
    <StyledSvg width={width} height={height}>
      <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
        <AxisBottom
          xScale={xScale}
          innerHeight={innerHeight}
          xTickOffset={X_TICK_OFFSET}
          xAxisTickFormat={xAxisTickFormat}
        />
        <AxisLeft
          yScale={yScale}
          innerWidth={innerWidth}
          yTickOffset={Y_TICK_OFFSET}
        />
        <Marks
          data={events}
          xScale={xScale}
          yScale={yScale}
          xValue={xValue}
          yValue={yValue}
          circleRadius={circleRadius}
        />
        <StyledLabel
          fontSize={labelFontSize}
          textAnchor="middle"
          x={innerWidth / 2}
          y={innerHeight + X_AXIS_LABEL_OFFSET}
        >
          {X_LABEL}
        </StyledLabel>
        <StyledLabel
          fontSize={labelFontSize}
          textAnchor="middle"
          transform={`translate(${-Y_AXIS_LABEL_OFFSET}, ${
            innerHeight / 2
          }) rotate(-90)`}
        >
          {Y_LABEL}
        </StyledLabel>
      </g>
    </StyledSvg>
  );
};
