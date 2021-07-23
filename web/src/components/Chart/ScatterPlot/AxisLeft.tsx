import React, { useMemo } from 'react';
import type { ScaleLinear } from 'd3';
import { StyledLine, StyledText } from './UI';

interface AxisLeftProps {
  yScale: ScaleLinear<number, number>;
  innerWidth: number;
  yTickOffset: number;
}

export const AxisLeft: React.FC<AxisLeftProps> = ({
  yScale,
  innerWidth,
  yTickOffset,
}) => (
  <>
    {useMemo(
      () =>
        yScale.ticks().map((tickValue) => (
          <g key={tickValue} transform={`translate(0 , ${yScale(tickValue)})`}>
            <StyledLine x2={innerWidth} />
            <StyledText
              key={tickValue}
              dy=".32em"
              x={-yTickOffset}
              style={{ textAnchor: 'end' }}
            >
              {tickValue}
            </StyledText>
          </g>
        )),
      [yScale]
    )}
  </>
);
