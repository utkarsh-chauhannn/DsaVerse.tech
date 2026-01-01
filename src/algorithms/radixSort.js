// Radix Sort (LSD, base 10) (step-based)

export const radixSortSteps = (array) => {
  const steps = [];
  const arr = [...array];

  steps.push({
    array: [...arr],
    comparison: [],
    swap: [],
    pivot: [],
    type: 'init',
    description: 'Starting Radix Sort (base 10)'
  });

  const getDigit = (num, exp) => Math.floor(num / exp) % 10;

  const max = Math.max(...arr);

  for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
    steps.push({
      array: [...arr],
      comparison: [],
      swap: [],
      pivot: [],
      type: 'select',
      description: `Sorting by digit place exp=${exp}`
    });

    const output = new Array(arr.length);
    const count = new Array(10).fill(0);

    // Count digits
    for (let i = 0; i < arr.length; i++) {
      const d = getDigit(arr[i], exp);
      count[d]++;
      steps.push({
        array: [...arr],
        comparison: [i],
        swap: [],
        pivot: [],
        type: 'write',
        description: `Counting digit ${d} for value ${arr[i]}`
      });
    }

    // Prefix sums
    for (let i = 1; i < 10; i++) {
      count[i] += count[i - 1];
    }

    // Build output (stable)
    for (let i = arr.length - 1; i >= 0; i--) {
      const d = getDigit(arr[i], exp);
      output[count[d] - 1] = arr[i];
      count[d]--;
    }

    // Copy back
    for (let i = 0; i < arr.length; i++) {
      arr[i] = output[i];
      steps.push({
        array: [...arr],
        comparison: [],
        swap: [i],
        pivot: [],
        type: 'write',
        description: `Writing output back at index ${i}`
      });
    }
  }

  steps.push({
    array: [...arr],
    comparison: [],
    swap: [],
    pivot: [],
    type: 'done',
    description: 'Radix Sort complete'
  });

  return steps;
};
