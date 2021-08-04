export function getRandomIntArray(max: number, amount: number) {
  let indice: number[] = [];
  if (max < amount) throw new Error();
  if (max === amount) return new Array(amount).fill(null).map((_, i) => i);
  let i = 0;
  while (i < amount) {
    const randomNumber = Math.floor(Math.random() * max);
    const isExist = indice.some((i) => i === randomNumber);
    if (isExist) continue;

    indice.push(randomNumber);
    i++;
  }
  return indice;
}
