import format from 'date-fns/fp/format';

export function getLabel(label: Date | number) {
  if (typeof label === 'number') return label;
  if (label instanceof Date) return format('PP')(label);
  throw new Error('inappropriate type');
}
