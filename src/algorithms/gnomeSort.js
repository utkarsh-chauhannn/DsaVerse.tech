export const gnomeSortSteps = (inputArray) => {
  const arr = Array.isArray(inputArray) ? [...inputArray] : [];
  const frames = [];

  const snapshot = ({ comparison = [], swap = [], pivot = [], type = 'state', description = '' } = {}) => {
    frames.push({ array: [...arr], comparison, swap, pivot, type, description });
  };

  snapshot({ type: 'init', description: 'Starting Gnome Sort' });

  const n = arr.length;
  if (n <= 1) {
    snapshot({ type: 'done', description: 'Array is already sorted' });
    return frames;
  }

  let i = 1;
  while (i < n) {
    snapshot({ comparison: [i - 1, i], type: 'compare', description: `Compare indices ${i - 1} and ${i}` });

    if (arr[i - 1] <= arr[i]) {
      i += 1;
    } else {
      [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
      snapshot({ swap: [i - 1, i], type: 'swap', description: `Swap indices ${i - 1} and ${i}` });
      i = Math.max(1, i - 1);
    }
  }

  snapshot({ type: 'done', description: 'Gnome Sort complete' });
  return frames;
};
