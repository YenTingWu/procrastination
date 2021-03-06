import React, { useState, useCallback, useMemo } from 'react';
import { Flex, SimpleGrid } from '@chakra-ui/layout';
import min from 'date-fns/fp/min';
import max from 'date-fns/fp/max';
import { AnalysisTable } from '@components/Analysis/AnalysisTable';
import { BidirectionalSlider } from '@components/Slider/BidirectionalSlider';
import { ScatterPlot } from '@components/Chart/ScatterPlot';
import { Event } from '@types';

type Domain = [Date, Date];

const COMPLETED_TIME_INDEX = 2;

function getCompletedTime(timestamp: (string | Date)[]) {
  const completedTime = new Date(timestamp[COMPLETED_TIME_INDEX]);
  if (!completedTime) throw new Error();
  return completedTime;
}

function useCompletedTimeList(events: Event[]) {
  return useMemo(
    () => events.map(({ timestamp }) => getCompletedTime(timestamp)),
    [events]
  );
}

interface AnalysisMainSection {
  events: Event[];
}

export const AnalysisMainSection: React.FC<AnalysisMainSection> = ({
  events,
}) => {
  const completedTime = useCompletedTimeList(events);

  const [domain, setDomain] = useState<Domain>([
    min(completedTime),
    max(completedTime),
  ]);

  const handleDomainChange = useCallback((newDomain: Domain) => {
    setDomain(newDomain);
  }, []);

  const filteredEvents = useMemo(
    () =>
      events.filter(({ timestamp }) => {
        const completedTime = getCompletedTime(timestamp).getTime();

        return (
          completedTime >= domain[0].getTime() &&
          completedTime <= domain[1].getTime()
        );
      }),
    [events, domain]
  );

  return (
    <Flex
      flexDir="column"
      alignItems="center"
      flex="1"
      minH="100vh"
      h="100vh"
      overflow="scroll"
      justifyContent="center"
    >
      <BidirectionalSlider
        width={'40%'}
        domain={domain}
        onChange={handleDomainChange}
      />
      <SimpleGrid
        mt={['4rem', '4rem', '5rem', '4rem', '8rem']}
        columns={[1, 1, 1, 2]}
        pl="1rem"
        pr="1rem"
        gap={2}
      >
        <Flex justifyContent="center">
          <AnalysisTable completedEvents={filteredEvents} />
        </Flex>
        <Flex justifyContent="center" alignItems="center">
          <ScatterPlot events={filteredEvents} circleRadius={4} />
        </Flex>
      </SimpleGrid>
    </Flex>
  );
};
