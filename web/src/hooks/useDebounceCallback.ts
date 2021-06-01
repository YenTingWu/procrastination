import { useCallback, DependencyList } from 'react';
import { debounce, DebouncedFunc } from 'lodash';

export const useDebounceCallback = <T extends (...arg: any[]) => any>(
  fn: T,
  duration: number,
  dependency: DependencyList
): DebouncedFunc<T> => useCallback(debounce(fn, duration), [...dependency]);
