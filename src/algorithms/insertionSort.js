// Insertion Sort Algorithm
export const insertionSort = async (array, setArray, setComparison, setSwap) => {
  const arr = [...array];
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    
    setComparison([i]);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    while (j >= 0 && arr[j] > key) {
      setComparison([j, j + 1]);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      arr[j + 1] = arr[j];
      setSwap([j, j + 1]);
      setArray([...arr]);
      await new Promise(resolve => setTimeout(resolve, 300));
      setSwap([]);
      j--;
    }
    
    arr[j + 1] = key;
    setArray([...arr]);
    setComparison([]);
  }
};

export const insertionSortSteps = (array) => {
  const steps = [];
  const arr = [...array];
  const n = arr.length;

  steps.push({
    array: [...arr],
    comparison: [],
    swap: [],
    pivot: [],
    type: 'init',
    description: 'Starting Insertion Sort'
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    steps.push({
      array: [...arr],
      comparison: [i],
      swap: [],
      pivot: [],
      type: 'select',
      description: `Selecting key at index ${i}`
    });

    while (j >= 0) {
      steps.push({
        array: [...arr],
        comparison: [j, j + 1],
        swap: [],
        pivot: [],
        type: 'compare',
        description: `Comparing key with index ${j}`
      });

      if (arr[j] <= key) break;

      arr[j + 1] = arr[j];
      steps.push({
        array: [...arr],
        comparison: [],
        swap: [j, j + 1],
        pivot: [],
        type: 'write',
        description: `Shifting index ${j} to index ${j + 1}`
      });
      j--;
    }

    arr[j + 1] = key;
    steps.push({
      array: [...arr],
      comparison: [],
      swap: [j + 1],
      pivot: [],
      type: 'write',
      description: `Inserting key at index ${j + 1}`
    });
  }

  steps.push({
    array: [...arr],
    comparison: [],
    swap: [],
    pivot: [],
    type: 'done',
    description: 'Insertion Sort complete'
  });

  return steps;
};
