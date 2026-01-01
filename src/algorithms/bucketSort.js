export const bucketSortSteps = (inputArray) => {
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

  snapshot({ type: 'init', description: 'Starting Bucket Sort' });

  const n = arr.length;
  if (n <= 1) {
    snapshot({ type: 'done', description: 'Array is already sorted' });
    return frames;
  }

  let min = Infinity;
  let max = -Infinity;
  for (let i = 0; i < n; i++) {
    const v = arr[i];
    if (v < min) min = v;
    if (v > max) max = v;
  }

  if (min === max) {
    snapshot({ type: 'done', description: 'All values are equal' });
    return frames;
  }

  const bucketCount = Math.max(3, Math.min(7, n));
  const buckets = Array.from({ length: bucketCount }, () => []);
  const range = max - min + 1;

  for (let i = 0; i < n; i++) {
    const v = arr[i];
    const normalized = (v - min) / range;
    const idx = Math.min(bucketCount - 1, Math.max(0, Math.floor(normalized * bucketCount)));

    snapshot({ comparison: [i], type: 'inspect', description: `Place ${v} into bucket ${idx}` });
    buckets[idx].push(v);
  }

  // Sort each bucket (native sort is fine for visualization scale)
  for (let b = 0; b < buckets.length; b++) {
    buckets[b].sort((a, b2) => a - b2);
  }

  // Write back
  let writeIndex = 0;
  for (let b = 0; b < buckets.length; b++) {
    for (const v of buckets[b]) {
      arr[writeIndex] = v;
      snapshot({ comparison: [writeIndex], type: 'write', description: `Write ${v} at index ${writeIndex}` });
      writeIndex++;
    }
  }

  snapshot({ type: 'done', description: 'Bucket Sort complete' });
  return frames;
};
