// Selection Sort Algorithm
export const selectionSort = async (array, setArray, setComparison, setSwap) => {
  const arr = [...array];
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    
    for (let j = i + 1; j < n; j++) {
      setComparison([minIdx, j]);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (arr[j] < arr[minIdx]) {
        minIdx = j;
      }
    }
    
    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      setSwap([i, minIdx]);
      setArray([...arr]);
      await new Promise(resolve => setTimeout(resolve, 500));
      setSwap([]);
    }
    
    setComparison([]);
  }
};

export const selectionSortSteps = (array) => {
  const steps = [];
  const arr = [...array];
  const n = arr.length;

  steps.push({
    array: [...arr],
    comparison: [],
    swap: [],
    pivot: [],
    type: 'init',
    description: 'Starting Selection Sort'
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      steps.push({
        array: [...arr],
        comparison: [minIdx, j],
        swap: [],
        pivot: [],
        type: 'compare',
        description: `Comparing current min (index ${minIdx}) with index ${j}`
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        steps.push({
          array: [...arr],
          comparison: [minIdx],
          swap: [],
          pivot: [],
          type: 'select',
          description: `New minimum selected at index ${minIdx}`
        });
      }
    }

    if (minIdx !== i) {
      [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
      steps.push({
        array: [...arr],
        comparison: [],
        swap: [i, minIdx],
        pivot: [],
        type: 'swap',
        description: `Swapping index ${i} with min index ${minIdx}`
      });
    }
  }

  steps.push({
    array: [...arr],
    comparison: [],
    swap: [],
    pivot: [],
    type: 'done',
    description: 'Selection Sort complete'
  });

  return steps;
};
