import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from 'react';
import { getIndices } from './lib/getIndices';
import { getValues } from './lib/getValues';
import { getLabel } from './lib/getLabel';

import styleModule from './BidirectionalSlider.module.css';

export type DomainType = [number, number] | [Date, Date];

// const DEFAULT_DOMAIN: [number, number] = [0, 100];
const DEFAULT_DATE_DOMAIN: DomainType = [new Date(), new Date(2021, 7, 6)];
const INPUT_EXCEED_RATE = 1.037;

function getAppropriateWidth(width: number | string) {
  const testPercentReg = /^[0-9]+%$/;
  const testPxReg = /^[0-9]+px$/;
  if (typeof width === 'number') return width;
  if (testPercentReg.test(width))
    return `calc(${width} / ${INPUT_EXCEED_RATE})`;
  if (testPxReg.test(width)) return width;

  return `${width}px`;
}

interface BidirectionalSliderProps {
  domain?: DomainType;
  width?: string | number;
  onChange?: Function;
  style?: React.CSSProperties;
}

/**
 * ## BidirectionalSlider
 * @param {{{ domain, width, onChange }}}
 * @returns JSX.Element
 */

export const BidirectionalSlider: React.FC<BidirectionalSliderProps> = ({
  domain = DEFAULT_DATE_DOMAIN,
  onChange,
  width = '70%',
  style = {},
}) => {
  /**
   * Translate domain into indices and values so that
   * it is able to use index to get the value.
   *
   * The reason doing this way is because I'm trying to make it possible
   * to pass not only "number" type but "Date" type array as domain props
   *
   */
  const indicesOfDomain = useMemo(() => getIndices(domain), []);
  const valuesOfDomain = useMemo(() => getValues(domain), []);
  const [min, max] = indicesOfDomain;

  /**
   * The start and end value for two thumbs
   * Initial state is the index of min and max
   */
  const [biDirSliderDomain, setBiDirSliderDomain] = useState<[number, number]>(
    indicesOfDomain
  );
  const [minVal, maxVal] = biDirSliderDomain;
  const rangeRef = useRef<HTMLDivElement>(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  const handleMinValueChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = Math.min(+event.target.value, maxVal - 1);
      setBiDirSliderDomain([value, maxVal]);
    },
    [maxVal, setBiDirSliderDomain]
  );

  const handleMaxValueChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = Math.max(+event.target.value, minVal + 1);
      setBiDirSliderDomain([minVal, value]);
    },
    [minVal, setBiDirSliderDomain]
  );

  // Set width of the range to decrease from the left side
  useEffect(() => {
    if (rangeRef.current) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(maxVal);

      rangeRef.current.style.left = `${minPercent}%`;
      rangeRef.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [biDirSliderDomain, getPercent, domain]);

  // Get min and max values when their state changes
  useEffect(() => {
    onChange &&
      onChange([valuesOfDomain[minVal], valuesOfDomain[maxVal]] as DomainType);
  }, [biDirSliderDomain, onChange]);

  const newInputWidth = width ? { width: getAppropriateWidth(width) } : {};

  return (
    <div
      className={styleModule.container}
      style={width ? { ...style, ...newInputWidth } : {}}
    >
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        onChange={handleMinValueChange}
        className={`${styleModule.thumb} ${styleModule['thumb--left']}`}
        style={{
          zIndex: minVal > max - 100 ? 5 : 3,
          ...newInputWidth,
        }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        onChange={handleMaxValueChange}
        className={`${styleModule.thumb} ${styleModule['thumb--right']}`}
        style={{ ...newInputWidth }}
      />

      <div className={styleModule.slider}>
        <div className={styleModule['slider__track']}></div>
        <div ref={rangeRef} className={styleModule['slider__range']}></div>
        <div className={styleModule['slider__left-value']}>
          {getLabel(valuesOfDomain[minVal])}
        </div>
        <div className={styleModule['slider__right-value']}>
          {getLabel(valuesOfDomain[maxVal])}
        </div>
      </div>
    </div>
  );
};
