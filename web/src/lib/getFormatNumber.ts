export function getFormatNumber(
  value: number,
  options: Intl.NumberFormatOptions = {}
) {
  return new Intl.NumberFormat('en-IN', options).format(value);
}
