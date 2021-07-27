export function getFormatNumber(
  value: number,
  options: Intl.NumberFormatOptions = {}
) {
  return new Intl.NumberFormat('en-US', {
    style: 'decimal',
    ...options,
  }).format(value);
}
