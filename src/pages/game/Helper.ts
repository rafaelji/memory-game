/** Fisher–Yates shuffle */
function shuffle<T>(arr: T[]): T[] {
  const shallowCopy = arr.slice();
  for (let indexA = shallowCopy.length - 1; indexA > 0; indexA--) {
    const indexB = Math.floor(Math.random() * (indexA + 1));
    [shallowCopy[indexA], shallowCopy[indexB]] = [
      shallowCopy[indexB],
      shallowCopy[indexA],
    ];
  }
  return shallowCopy;
}

export { shuffle };
