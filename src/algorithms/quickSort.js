// Quick Sort Algorithm
export const quickSort = async (array, setArray, setComparison, setSwap, setPivot) => {
  const arr = [...array];
  
  const partition = async (low, high) => {
    const pivot = arr[high];
    setPivot([high]);
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let i = low - 1;
    
    for (let j = low; j < high; j++) {
      setComparison([j, high]);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setSwap([i, j]);
        setArray([...arr]);
        await new Promise(resolve => setTimeout(resolve, 300));
        setSwap([]);
      }
    }
    
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setSwap([i + 1, high]);
    setArray([...arr]);
    await new Promise(resolve => setTimeout(resolve, 300));
    setSwap([]);
    setPivot([]);
    setComparison([]);
    
    return i + 1;
  };
  
  const quickSortHelper = async (low, high) => {
    if (low < high) {
      const pi = await partition(low, high);
      await quickSortHelper(low, pi - 1);
      await quickSortHelper(pi + 1, high);
    }
  };
  
  await quickSortHelper(0, arr.length - 1);
  setArray([...arr]);
};

export const quickSortSteps = (array) => {
  const steps = [];
  const arr = [...array];

  steps.push({
    array: [...arr],
    comparison: [],
    swap: [],
    pivot: [],
    type: 'init',
    description: 'Starting Quick Sort'
  });

  const partition = (low, high) => {
    const pivotValue = arr[high];
    steps.push({
      array: [...arr],
      comparison: [],
      swap: [],
      pivot: [high],
      type: 'pivot',
      description: `Pivot chosen at index ${high} (value ${pivotValue})`
    });

    let i = low - 1;

    for (let j = low; j < high; j++) {
      steps.push({
        array: [...arr],
        comparison: [j, high],
        swap: [],
        pivot: [high],
        type: 'compare',
        description: `Comparing index ${j} with pivot index ${high}`
      });

      if (arr[j] < pivotValue) {
        i++;
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          steps.push({
            array: [...arr],
            comparison: [],
            swap: [i, j],
            pivot: [high],
            type: 'swap',
            description: `Swapping index ${i} and ${j}`
          });
        }
      }
    }

    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    steps.push({
      array: [...arr],
      comparison: [],
      swap: [i + 1, high],
      pivot: [i + 1],
      type: 'swap',
      description: `Placing pivot at index ${i + 1}`
    });

    return i + 1;
  };

  const quickSortHelper = (low, high) => {
    if (low < high) {
      const pi = partition(low, high);
      quickSortHelper(low, pi - 1);
      quickSortHelper(pi + 1, high);
    }
  };

  quickSortHelper(0, arr.length - 1);

  steps.push({
    array: [...arr],
    comparison: [],
    swap: [],
    pivot: [],
    type: 'done',
    description: 'Quick Sort complete'
  });

  return steps;
};
