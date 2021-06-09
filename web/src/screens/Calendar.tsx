import React from 'react';
import { AppDefaultLayoutDesktop } from '@components/Layout/AppDefaultLayoutDesktop';
import { NavigationSideBar } from '@components/NavigationSideBar';
import { ControlledMonthlyDatePicker } from '@components/DatePicker/ControlledMonthlyDatePicker';
import { Box } from '@chakra-ui/react';

export const Calendar = () => {
  return (
    <AppDefaultLayoutDesktop>
      <NavigationSideBar />
      <Box>
        <ControlledMonthlyDatePicker />
        <Box flex="1">123123</Box>
      </Box>
    </AppDefaultLayoutDesktop>
  );
};
