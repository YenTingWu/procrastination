import React, { useMemo } from 'react';
import { Tooltip } from '@chakra-ui/tooltip';
import { StyledCircle } from './UI';
import { getFormatNumber } from '@lib/getFormatNumber';
import type { ScaleLinear } from 'd3';
import type { Event } from '@types';

function getTitleFormat(value: number) {
  return getFormatNumber(+value.toFixed(2));
}

interface MarksProps {
  data: Event[];
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
  xValue: Function;
  yValue: Function;
  circleRadius?: number;
}

export const Marks: React.FC<MarksProps> = ({
  data,
  xScale,
  yScale,
  xValue,
  yValue,
  circleRadius = 5,
}) => (
  <>
    {useMemo(
      () =>
        data.map((e) => (
          <Tooltip key={e.uuid} label={`${getTitleFormat(yValue(e))}%`}>
            <StyledCircle
              cx={xScale(xValue(e))}
              cy={yScale(yValue(e))}
              r={circleRadius}
            />
          </Tooltip>
        )),
      [data, xScale, yScale, xValue, yValue, circleRadius]
    )}
  </>
);
