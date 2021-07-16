import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
} from '@chakra-ui/react';
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
    <Table
      size="sm"
      w="30%"
      variant="striped"
      colorScheme="red"
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
      <Tbody>
        {completedEvents.map(({ name, duration, expectedDuration, uuid }) => (
          <Tr key={uuid}>
            <Td fontSize="xs">{name}</Td>
            <Td fontSize="xs" isNumeric>
              {formatNumber(duration, formattedSecondsOption)}
            </Td>
            <Td fontSize="xs" isNumeric>
              {formatNumber(expectedDuration, formattedSecondsOption)}
            </Td>
            <Td fontSize="xs" isNumeric>
              {formatNumber(+((duration / expectedDuration) * 100).toFixed(2))}%
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
