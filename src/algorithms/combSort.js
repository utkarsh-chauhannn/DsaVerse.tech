export const combSortSteps = (inputArray) => {
  const arr = Array.isArray(inputArray) ? [...inputArray] : [];
  const frames = [];

  const snapshot = ({ comparison = [], swap = [], pivot = [], type = 'state', description = '' } = {}) => {
    frames.push({
      array: [...arr],
      comparison,
      swap,
      pivot,
      type,
      description
    });
  };

  snapshot({ type: 'init', description: 'Starting Comb Sort' });

  const n = arr.length;
  if (n <= 1) {
    snapshot({ type: 'done', description: 'Array is already sorted' });
    return frames;
  }

  const shrinkFactor = 1.3;
  let gap = n;
  let swapped = true;

  while (gap !== 1 || swapped) {
    gap = Math.floor(gap / shrinkFactor);
    if (gap < 1) gap = 1;

    swapped = false;

    for (let i = 0; i + gap < n; i++) {
      const j = i + gap;
      snapshot({ comparison: [i, j], type: 'compare', description: `Compare indices ${i} and ${j}` });

      if (arr[i] > arr[j]) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        swapped = true;
        snapshot({ swap: [i, j], type: 'swap', description: `Swap indices ${i} and ${j}` });
      }
    }
  }

  snapshot({ type: 'done', description: 'Comb Sort complete' });
  return frames;
};
