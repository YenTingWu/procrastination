import React, { useMemo } from 'react';
import type { ScaleLinear } from 'd3';
import { StyledLine, StyledText } from './UI';

interface AxisBottomProps {
  xScale: ScaleLinear<number, number>;
  innerHeight: number;
  xTickOffset: number;
  xAxisTickFormat: Function;
}

export const AxisBottom: React.FC<AxisBottomProps> = ({
  xScale,
  innerHeight,
  xTickOffset,
  xAxisTickFormat,
}) => (
  <>
    {useMemo(
      () =>
        xScale.ticks().map((tickValue) => (
          <g key={tickValue} transform={`translate(${xScale(tickValue)}, 0)`}>
            <StyledLine y2={innerHeight} />
            <StyledText
              dy=".71rem"
              y={innerHeight + xTickOffset}
              style={{ textAnchor: 'middle' }}
            >
              {xAxisTickFormat(tickValue)}
            </StyledText>
          </g>
        )),
      [xScale]
    )}
  </>
);
