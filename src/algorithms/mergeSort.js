// Merge Sort Algorithm
export const mergeSort = async (array, setArray, setComparison, setSwap) => {
  const arr = [...array];
  
  const merge = async (left, mid, right) => {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);
    
    let i = 0, j = 0, k = left;
    
    while (i < leftArr.length && j < rightArr.length) {
      setComparison([left + i, mid + 1 + j]);
      await new Promise(resolve => setTimeout(resolve, 400));
      
      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }
      setArray([...arr]);
      k++;
    }
    
    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      setArray([...arr]);
      i++;
      k++;
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      setArray([...arr]);
      j++;
      k++;
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setComparison([]);
  };
  
  const mergeSortHelper = async (left, right) => {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);
      await mergeSortHelper(left, mid);
      await mergeSortHelper(mid + 1, right);
      await merge(left, mid, right);
    }
  };
  
  await mergeSortHelper(0, arr.length - 1);
  setArray([...arr]);
};

export const mergeSortSteps = (array) => {
  const steps = [];
  const arr = [...array];

  steps.push({
    array: [...arr],
    comparison: [],
    swap: [],
    pivot: [],
    type: 'init',
    description: 'Starting Merge Sort'
  });

  const merge = (left, mid, right) => {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);

    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftArr.length && j < rightArr.length) {
      const leftIndex = left + i;
      const rightIndex = mid + 1 + j;

      steps.push({
        array: [...arr],
        comparison: [leftIndex, rightIndex],
        swap: [],
        pivot: [],
        type: 'compare',
        description: `Comparing left index ${leftIndex} and right index ${rightIndex}`
      });

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }

      steps.push({
        array: [...arr],
        comparison: [],
        swap: [k],
        pivot: [],
        type: 'write',
        description: `Writing value at index ${k}`
      });

      k++;
    }

    while (i < leftArr.length) {
      arr[k] = leftArr[i];
      steps.push({
        array: [...arr],
        comparison: [],
        swap: [k],
        pivot: [],
        type: 'write',
        description: `Copying remaining left value to index ${k}`
      });
      i++;
      k++;
    }

    while (j < rightArr.length) {
      arr[k] = rightArr[j];
      steps.push({
        array: [...arr],
        comparison: [],
        swap: [k],
        pivot: [],
        type: 'write',
        description: `Copying remaining right value to index ${k}`
      });
      j++;
      k++;
    }
  };

  const mergeSortHelper = (left, right) => {
    if (left >= right) return;
    const mid = Math.floor((left + right) / 2);
    mergeSortHelper(left, mid);
    mergeSortHelper(mid + 1, right);
    merge(left, mid, right);
  };

  mergeSortHelper(0, arr.length - 1);

  steps.push({
    array: [...arr],
    comparison: [],
    swap: [],
    pivot: [],
    type: 'done',
    description: 'Merge Sort complete'
  });

  return steps;
};
