// Shell Sort (step-based)

export const shellSortSteps = (array) => {
  const steps = [];
  const arr = [...array];
  const n = arr.length;

  steps.push({
    array: [...arr],
    comparison: [],
    swap: [],
    pivot: [],
    type: 'init',
    description: 'Starting Shell Sort'
  });

  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    steps.push({
      array: [...arr],
      comparison: [],
      swap: [],
      pivot: [],
      type: 'select',
      description: `Gap set to ${gap}`
    });

    for (let i = gap; i < n; i++) {
      const temp = arr[i];
      let j = i;

      steps.push({
        array: [...arr],
        comparison: [i],
        swap: [],
        pivot: [],
        type: 'select',
        description: `Selecting index ${i} for gapped insertion` 
      });

      while (j >= gap) {
        steps.push({
          array: [...arr],
          comparison: [j - gap, j],
          swap: [],
          pivot: [],
          type: 'compare',
          description: `Comparing index ${j - gap} and ${j} (gap ${gap})`
        });

        if (arr[j - gap] <= temp) break;

        arr[j] = arr[j - gap];
        steps.push({
          array: [...arr],
          comparison: [],
          swap: [j - gap, j],
          pivot: [],
          type: 'write',
          description: `Shifting index ${j - gap} to ${j}`
        });
        j -= gap;
      }

      arr[j] = temp;
      steps.push({
        array: [...arr],
        comparison: [],
        swap: [j],
        pivot: [],
        type: 'write',
        description: `Inserting value at index ${j}`
      });
    }
  }

  steps.push({
    array: [...arr],
    comparison: [],
    swap: [],
    pivot: [],
    type: 'done',
    description: 'Shell Sort complete'
  });

  return steps;
};
