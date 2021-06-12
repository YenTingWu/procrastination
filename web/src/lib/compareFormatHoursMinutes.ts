/**
 * ## getSplitHoursMinutes
 * The time param should be the format of HH:mm
 * HH has to be between 00 - 23
 * mm has to be between 00 - 59
 * @param time
 * @returns {{{ hours: number, mins: number } | boolean
 */

export function getSplitHoursMinutes(time: string) {
  const split = time.split(':');
  const hours = +split[0];
  const mins = +split[1];
  const reg = /^([01]?[0-9]|2[0-3]):([0-5][0-9])?$/g;

  if (!reg.test(time)) return false;

  if (
    typeof hours !== 'number' ||
    typeof mins !== 'number' ||
    hours > 23 ||
    hours < 0 ||
    mins > 59 ||
    mins < 0
  )
    return false;

  return { hours, mins };
}

/**
 * ## compareFormatTime
 * Both timeA and timeB should be HH:mm format,
 * HH has to be between 00 - 23,
 * mm has to be between 00 - 59
 * @param left
 * @param right
 * @returns boolean
 * | number (left > right => 1 | left < right => -1 | left === right => 0)
 */

export function compareFormatHoursMinutes(left: string, right: string) {
  const l = getSplitHoursMinutes(left);
  const r = getSplitHoursMinutes(right);

  if (!l || !r) return false;

  const { hours: hL, mins: mL } = l;
  const { hours: hR, mins: mR } = r;

  if (hL > hR || (hL === hR && mL > mR)) return 1;
  else if (hR === hL && mL === mR) return 0;
  else return -1;
}
