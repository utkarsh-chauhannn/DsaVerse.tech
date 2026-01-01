export const cocktailSortSteps = (inputArray) => {
  const arr = Array.isArray(inputArray) ? [...inputArray] : [];
  const frames = [];

  const snapshot = ({ comparison = [], swap = [], pivot = [], type = 'state', description = '' } = {}) => {
    frames.push({ array: [...arr], comparison, swap, pivot, type, description });
  };

  snapshot({ type: 'init', description: 'Starting Cocktail Shaker Sort' });

  const n = arr.length;
  if (n <= 1) {
    snapshot({ type: 'done', description: 'Array is already sorted' });
    return frames;
  }

  let start = 0;
  let end = n - 1;
  let swapped = true;

  while (swapped) {
    swapped = false;

    for (let i = start; i < end; i++) {
      snapshot({ comparison: [i, i + 1], type: 'compare', description: `Compare indices ${i} and ${i + 1}` });
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;
        snapshot({ swap: [i, i + 1], type: 'swap', description: `Swap indices ${i} and ${i + 1}` });
      }
    }

    if (!swapped) break;

    swapped = false;
    end -= 1;

    for (let i = end; i > start; i--) {
      snapshot({ comparison: [i - 1, i], type: 'compare', description: `Compare indices ${i - 1} and ${i}` });
      if (arr[i - 1] > arr[i]) {
        [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
        swapped = true;
        snapshot({ swap: [i - 1, i], type: 'swap', description: `Swap indices ${i - 1} and ${i}` });
      }
    }

    start += 1;
  }

  snapshot({ type: 'done', description: 'Cocktail Shaker Sort complete' });
  return frames;
};
