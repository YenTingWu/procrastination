import React, { useState, useCallback, useMemo } from 'react';
import { Flex, SimpleGrid } from '@chakra-ui/layout';
import min from 'date-fns/fp/min';
import max from 'date-fns/fp/max';
import { AnalysisTable } from '@components/Analysis/AnalysisTable';
import { BidirectionalSlider } from '@components/Slider/BidirectionalSlider';
import { ScatterPlot } from '@components/Chart/ScatterPlot';
import { Event } from '@types';

type Domain = [Date, Date];

function getCompletedTime(timestamp: (string | Date)[]) {
  return new Date(timestamp[timestamp.length - 1]);
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
        const completedTime = getCompletedTime(timestamp);
        return completedTime >= domain[0] && completedTime <= domain[1];
      }),
    [events, domain]
  );

  return (
    <Flex flexDir="column" alignItems="center" pt="7rem" flex="1" minH="100vh">
      <BidirectionalSlider
        width={'40%'}
        domain={domain}
        onChange={handleDomainChange}
      />
      <SimpleGrid mt="8rem" columns={[1, null, 2]} gap={2}>
        <Flex justifyContent="center">
          <AnalysisTable completedEvents={filteredEvents} />
        </Flex>
        <ScatterPlot events={filteredEvents} circleRadius={4} />
      </SimpleGrid>
    </Flex>
  );
};
