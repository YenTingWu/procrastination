import React from 'react';
import { Flex, Box, Heading, BoxProps } from '@chakra-ui/layout';
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from '@chakra-ui/stat';
import { getFormatNumber } from '@lib/getFormatNumber';
import { DeviceMedia } from './index';

interface StyledStatProps extends BoxProps {
  label: string;
  number: string;
  text: string;
}

const StyledStat: React.FC<StyledStatProps> = ({
  label,
  number,
  text,
  ...boxProps
}) => (
  <Box as="span" {...boxProps}>
    <Stat>
      <StatLabel color="white" fontSize="1.5rem">
        {label}
      </StatLabel>
      <StatNumber color="white" fontSize="3rem">
        {number}
      </StatNumber>
      <StatHelpText color="white" fontSize="1.5rem">
        <StatArrow type="increase" />
        {text}
      </StatHelpText>
    </Stat>
  </Box>
);

interface StatSectionProps {
  deviceMedia: DeviceMedia;
}

export const StatSection: React.FC<StatSectionProps> = ({
  deviceMedia: { isLargerThan1000, isLargerThan500 },
}) => {
  return (
    <Flex justifyContent="center" bg="gray.700" p="6rem 4rem 5rem">
      <Flex
        flexDir="column"
        alignItems="center"
        w="100%"
        maxW={isLargerThan1000 ? '1000px' : '500px'}
        justifyContent="center"
      >
        <Heading
          as="h1"
          color="white"
          fontSize={isLargerThan500 ? '3.5rem' : '2.5rem'}
          fontWeight="black"
        >
          Procrastination is Growing Slowly
        </Heading>
        <Flex
          flexDir={isLargerThan1000 ? 'row' : 'column'}
          w="100%"
          mt="4rem"
          justifyContent="space-around"
          alignItems={isLargerThan1000 ? 'center' : 'flex-start'}
        >
          <StyledStat
            label="Download"
            number={getFormatNumber(0)}
            text="0%"
            mt={isLargerThan1000 ? '0' : '2rem'}
          />
          <StyledStat
            label="Core Contributors"
            number={getFormatNumber(0)}
            text="0%"
            mt={isLargerThan1000 ? '0' : '4rem'}
          />
          <StyledStat
            label="Github stars"
            number={getFormatNumber(0)}
            text="0%"
            mt={isLargerThan1000 ? '0' : '4rem'}
            mb={isLargerThan1000 ? '0' : '2rem'}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
