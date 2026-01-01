export const pancakeSortSteps = (inputArray) => {
  const arr = Array.isArray(inputArray) ? [...inputArray] : [];
  const frames = [];

  const snapshot = ({ comparison = [], swap = [], pivot = [], type = 'state', description = '' } = {}) => {
    frames.push({ array: [...arr], comparison, swap, pivot, type, description });
  };

  const flip = (k) => {
    let i = 0;
    let j = k;
    while (i < j) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      snapshot({ swap: [i, j], type: 'swap', description: `Flip swap indices ${i} and ${j}` });
      i += 1;
      j -= 1;
    }
  };

  snapshot({ type: 'init', description: 'Starting Pancake Sort' });

  const n = arr.length;
  if (n <= 1) {
    snapshot({ type: 'done', description: 'Array is already sorted' });
    return frames;
  }

  for (let currSize = n; currSize > 1; currSize--) {
    // Find index of max in [0..currSize-1]
    let maxIdx = 0;
    for (let i = 1; i < currSize; i++) {
      snapshot({ comparison: [i, maxIdx], type: 'compare', description: `Find max: compare ${i} with current max ${maxIdx}` });
      if (arr[i] > arr[maxIdx]) maxIdx = i;
    }

    if (maxIdx === currSize - 1) continue;

    snapshot({ pivot: [maxIdx], type: 'pivot', description: `Max at index ${maxIdx} (value ${arr[maxIdx]})` });

    if (maxIdx > 0) {
      snapshot({ comparison: [0, maxIdx], type: 'inspect', description: `Flip first ${maxIdx + 1} elements` });
      flip(maxIdx);
    }

    snapshot({ comparison: [0, currSize - 1], type: 'inspect', description: `Flip first ${currSize} elements to place max` });
    flip(currSize - 1);
  }

  snapshot({ type: 'done', description: 'Pancake Sort complete' });
  return frames;
};
