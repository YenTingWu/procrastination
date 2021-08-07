import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Flex, Text } from '@chakra-ui/layout';

const POSITION_CHANGING_FUNCTION_CALL_DELAY = 10;

interface TextCarouselProps {
  list: string[];
}

function getCorrectLengthList(list: string[]) {
  const time = 30 / list.length;
  if (time <= 1) return list;
  let newList: string[] = [];
  for (let i = 0; i < time + 1; i++) {
    newList = [...newList, ...list];
  }
  return newList;
}

export const TextCarousel: React.FC<TextCarouselProps> = ({ list }) => {
  const [carouselBarXPosition, setCarouselBarXPosition] = useState<number>(0);
  const carouselBarRef = useRef<HTMLDivElement>(null);

  const newList = useMemo(() => getCorrectLengthList(list), [list]);

  useEffect(() => {
    setCarouselBarXPosition((prev) => prev - 100);
    const id = setInterval(() => {
      setCarouselBarXPosition((prev) => prev - 100);
    }, POSITION_CHANGING_FUNCTION_CALL_DELAY * 1000);
    return () => {
      clearInterval(id);
    };
  }, [carouselBarRef.current]);

  useEffect(() => {
    const carouselBar = carouselBarRef.current;
    if (carouselBar == null) return;
    const { x, width } = carouselBar.getBoundingClientRect();
    const shouldResetCarouselPosition = width <= window.innerWidth - x;

    if (shouldResetCarouselPosition) {
      setCarouselBarXPosition(0);
    }
  }, [carouselBarXPosition]);

  return (
    <Flex overflowX="hidden" w="100%" mt="1.5rem">
      <Flex
        ref={carouselBarRef}
        transform={`translateX(${carouselBarXPosition}px)`}
        transition={`${POSITION_CHANGING_FUNCTION_CALL_DELAY}s linear`}
      >
        {newList.map((str, i) => {
          return (
            <Text
              key={`${str}_${i}`}
              fontSize="2rem"
              fontWeight="black"
              color={i % 2 === 1 ? 'black' : 'gray.300'}
              mr="1rem"
            >
              {str}
            </Text>
          );
        })}
      </Flex>
    </Flex>
  );
};
