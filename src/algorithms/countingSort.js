// Counting Sort (step-based)
// Note: works best when values are small-ish. Your UI uses values 1..99.

export const countingSortSteps = (array) => {
  const steps = [];
  const arr = [...array];

  steps.push({
    array: [...arr],
    comparison: [],
    swap: [],
    pivot: [],
    type: 'init',
    description: 'Starting Counting Sort'
  });

  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const offset = min;
  const range = max - min + 1;

  const count = new Array(range).fill(0);

  // Count occurrences
  for (let i = 0; i < arr.length; i++) {
    const idx = arr[i] - offset;
    count[idx]++;
    steps.push({
      array: [...arr],
      comparison: [i],
      swap: [],
      pivot: [],
      type: 'write',
      description: `Counting value ${arr[i]} (count[${idx}] = ${count[idx]})`
    });
  }

  // Write back
  let writeIndex = 0;
  for (let c = 0; c < count.length; c++) {
    while (count[c] > 0) {
      arr[writeIndex] = c + offset;
      count[c]--;
      steps.push({
        array: [...arr],
        comparison: [],
        swap: [writeIndex],
        pivot: [],
        type: 'write',
        description: `Writing value ${arr[writeIndex]} at index ${writeIndex}`
      });
      writeIndex++;
    }
  }

  steps.push({
    array: [...arr],
    comparison: [],
    swap: [],
    pivot: [],
    type: 'done',
    description: 'Counting Sort complete'
  });

  return steps;
};
