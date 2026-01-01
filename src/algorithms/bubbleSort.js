// Bubble Sort Algorithm
export const bubbleSort = async (array, setArray, setComparison, setSwap) => {
  const arr = [...array];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Highlight comparison
      setComparison([j, j + 1]);
      await new Promise(resolve => setTimeout(resolve, 500));

      if (arr[j] > arr[j + 1]) {
        // Swap elements
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        setSwap([j, j + 1]);
        setArray([...arr]);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      setComparison([]);
      setSwap([]);
    }
  }
};

export const bubbleSortSteps = (array) => {
  const steps = [];
  const arr = [...array];
  const n = arr.length;

  steps.push({
    array: [...arr],
    comparison: [],
    swap: [],
    pivot: [],
    type: 'init',
    description: 'Starting Bubble Sort'
  });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        array: [...arr],
        comparison: [j, j + 1],
        swap: [],
        pivot: [],
        type: 'compare',
        description: `Comparing index ${j} and ${j + 1}`
      });

      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        steps.push({
          array: [...arr],
          comparison: [],
          swap: [j, j + 1],
          pivot: [],
          type: 'swap',
          description: `Swapping index ${j} and ${j + 1}`
        });
      }
    }
  }

  steps.push({
    array: [...arr],
    comparison: [],
    swap: [],
    pivot: [],
    type: 'done',
    description: 'Bubble Sort complete'
  });

  return steps;
};
