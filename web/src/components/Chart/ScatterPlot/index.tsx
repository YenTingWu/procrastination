import React, { useMemo } from 'react';
import { scaleLinear, extent, format as d3Format } from 'd3';
import { StyledSvg, StyledLabel } from './UI';
import { Marks } from './Marks';
import { AxisLeft } from './AxisLeft';
import { AxisBottom } from './AxisBottom';
import type { Event } from '@types';

const WIDTH = 600;
const HEIGHT = 400;

const MARGIN = { top: 30, right: 30, bottom: 100, left: 100 };

const INNER_WIDTH = WIDTH - MARGIN.right - MARGIN.left;
const INNER_HEIGHT = HEIGHT - MARGIN.top - MARGIN.bottom;

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
  const xScale = useMemo(
    () =>
      scaleLinear()
        .range([0, INNER_WIDTH])
        .domain(extent(events, xValue) as [number, number]),
    [events, xValue, INNER_WIDTH]
  );

  const yScale = useMemo(
    () =>
      scaleLinear()
        .range([INNER_HEIGHT, 0])
        .domain(extent(events, yValue) as [number, number])
        .nice(),
    [events, yValue, INNER_HEIGHT]
  );

  return (
    <StyledSvg width={WIDTH} height={HEIGHT}>
      <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
        <AxisBottom
          xScale={xScale}
          innerHeight={INNER_HEIGHT}
          xTickOffset={X_TICK_OFFSET}
          xAxisTickFormat={xAxisTickFormat}
        />
        <AxisLeft
          yScale={yScale}
          innerWidth={INNER_WIDTH}
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
          textAnchor="middle"
          x={INNER_WIDTH / 2}
          y={INNER_HEIGHT + X_AXIS_LABEL_OFFSET}
        >
          {X_LABEL}
        </StyledLabel>
        <StyledLabel
          textAnchor="middle"
          transform={`translate(${-Y_AXIS_LABEL_OFFSET}, ${
            INNER_HEIGHT / 2
          }) rotate(-90)`}
        >
          {Y_LABEL}
        </StyledLabel>
      </g>
    </StyledSvg>
  );
};
