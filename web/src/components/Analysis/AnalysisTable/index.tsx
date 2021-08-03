import React from 'react';
import { Flex } from '@chakra-ui/layout';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
} from '@chakra-ui/table';
import { Event } from '@types';

const tableHeadTitle = {
  name: 'name',
  forecast: 'forecast',
  actual: 'actual',
  forecastAccuracy: 'forecast accuracy',
};

const formattedSecondsOption = {
  style: 'unit',
  unit: 'second',
  unitDisplay: 'short',
};

function formatNumber(number: number, option?: {}) {
  return new Intl.NumberFormat('en-IN', option).format(number);
}

interface AnalysisTableProps {
  completedEvents: Event[];
}

export const AnalysisTable: React.FC<AnalysisTableProps> = ({
  completedEvents,
}) => {
  return (
    <Flex h="400px" overflowY="scroll" justifyContent="center">
      <Table
        size="sm"
        w="30%"
        variant="striped"
        colorScheme="red"
        cellSpacing="0"
        cellPadding="0"
        //userSelect="none"
      >
        <TableCaption>Completed Event List</TableCaption>
        <Thead>
          <Tr>
            {Object.values(tableHeadTitle).map((t, i) => (
              <Th key={`${t}_${i}`} isNumeric={t !== tableHeadTitle.name}>
                {t}
              </Th>
            ))}
          </Tr>
        </Thead>
        <Tbody h="300px">
          {completedEvents.map(({ name, duration, expectedDuration, uuid }) => (
            <Tr data-testid="table-row" key={uuid}>
              <Td fontSize="xs">{name}</Td>
              <Td fontSize="xs" isNumeric>
                {formatNumber(duration, formattedSecondsOption)}
              </Td>
              <Td fontSize="xs" isNumeric>
                {formatNumber(expectedDuration, formattedSecondsOption)}
              </Td>
              <Td fontSize="xs" isNumeric>
                {formatNumber(
                  +((duration / expectedDuration) * 100).toFixed(2)
                )}
                %
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Flex>
  );
};
