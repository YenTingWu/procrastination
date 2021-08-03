import { useBreakpointValue } from '@chakra-ui/media-query';

export const useTypeSafeBreakpointValue = <T extends {}>(
  values: Record<string, T> & { default: T }
) => {
  const breakPointValue = useBreakpointValue(values);

  return breakPointValue || values.default;
};
