// Heap Sort (step-based)

export const heapSortSteps = (array) => {
  const steps = [];
  const arr = [...array];
  const n = arr.length;

  steps.push({
    array: [...arr],
    comparison: [],
    swap: [],
    pivot: [],
    type: 'init',
    description: 'Starting Heap Sort'
  });

  const pushCompare = (i, j, desc) => {
    steps.push({
      array: [...arr],
      comparison: [i, j],
      swap: [],
      pivot: [],
      type: 'compare',
      description: desc
    });
  };

  const pushSwap = (i, j, desc) => {
    steps.push({
      array: [...arr],
      comparison: [],
      swap: [i, j],
      pivot: [],
      type: 'swap',
      description: desc
    });
  };

  const heapify = (size, root) => {
    let largest = root;
    const left = 2 * root + 1;
    const right = 2 * root + 2;

    if (left < size) {
      pushCompare(left, largest, `Comparing left child ${left} with current largest ${largest}`);
      if (arr[left] > arr[largest]) largest = left;
    }

    if (right < size) {
      pushCompare(right, largest, `Comparing right child ${right} with current largest ${largest}`);
      if (arr[right] > arr[largest]) largest = right;
    }

    if (largest !== root) {
      [arr[root], arr[largest]] = [arr[largest], arr[root]];
      pushSwap(root, largest, `Swapping to maintain heap at indices ${root} and ${largest}`);
      heapify(size, largest);
    }
  };

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  // Extract elements
  for (let end = n - 1; end > 0; end--) {
    [arr[0], arr[end]] = [arr[end], arr[0]];
    pushSwap(0, end, `Moving max element to index ${end}`);
    heapify(end, 0);
  }

  steps.push({
    array: [...arr],
    comparison: [],
    swap: [],
    pivot: [],
    type: 'done',
    description: 'Heap Sort complete'
  });

  return steps;
};
