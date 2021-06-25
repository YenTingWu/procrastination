import React, { useState, useRef, useCallback } from 'react';
import { useField } from 'formik';
import { Flex, Input, Text, FormLabel } from '@chakra-ui/react';

interface DurationInputProps {
  name: string;
  label: string;
  value: {
    hours: number;
    mins: number;
  };
}

export const DurationInput: React.FC<DurationInputProps> = ({
  name,
  label,
  value,
}) => {
  const [isError, setError] = useState<boolean>(false);

  const hoursRef = useRef<HTMLInputElement>(null);
  const minsRef = useRef<HTMLInputElement>(null);

  const [field, _, helpers] = useField(name);

  const handleHoursChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const hours = +e.target.value;
      const minInput = minsRef.current;
      if (isNaN(hours)) return;
      if (minInput == null) return;

      setError(false);

      helpers.setValue({
        ...field.value,
        hours,
      });
    },
    [helpers, minsRef.current]
  );

  const handleMinsChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const mins = +e.target.value;
      const hourInput = hoursRef.current;
      if (isNaN(mins)) return;
      if (mins > 59) {
        setError(true);
        return;
      }
      if (hourInput == null) return;

      setError(false);
      helpers.setValue({
        ...field.value,
        mins,
      });
    },
    [helpers, hoursRef.current]
  );

  return (
    <Flex mt="3rem" justifyContent="center">
      <Flex w="85%" alignItems="center" justifyContent="center">
        <FormLabel flex="1" m="0" fontWeight="extrabold">
          {label}
        </FormLabel>
        <Flex flex="1" alignItems="center" pr=".875rem">
          <Input
            ref={hoursRef}
            h="43px"
            fontSize="sm"
            flex="1"
            borderWidth="1px"
            borderRadius="6px"
            borderColor="gray.200"
            size="xs"
            pt="2px"
            pb="2px"
            _focus={{ border: 'inherent' }}
            value={value.hours === 0 ? '' : value.hours}
            onChange={handleHoursChange}
          />
          <Text ml="2" mr="2" fontSize="sm">
            Hr
          </Text>
          <Input
            ref={minsRef}
            h="43px"
            fontSize="sm"
            flex="1"
            borderWidth="1px"
            borderRadius="6px"
            borderColor={isError ? 'red.600' : 'gray.200'}
            size="xs"
            _focus={{ border: isError ? 'red.600' : 'inherent' }}
            _hover={{ border: isError ? 'red.600' : 'inherent' }}
            value={value.mins === 0 ? '' : value.mins}
            onChange={handleMinsChange}
          />
          <Text fontSize="sm" ml="2">
            Min
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};
