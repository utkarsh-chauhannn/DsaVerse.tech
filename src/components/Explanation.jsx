import React from 'react';

const Explanation = ({ algorithm = 'bubbleSort' }) => {
  const explanations = {
    bubbleSort: {
      title: 'Bubble Sort',
      description: 'Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.',
      timeComplexity: {
        best: 'O(n)',
        average: 'O(n²)',
        worst: 'O(n²)'
      },
      spaceComplexity: 'O(1)',
      steps: [
        'Start at the beginning of the array',
        'Compare each pair of adjacent elements',
        'If they are in the wrong order, swap them',
        'Repeat until the array is sorted',
        'Each pass "bubbles" the largest element to the end'
      ]
    },
    quickSort: {
      title: 'Quick Sort',
      description: 'Quick Sort is a divide-and-conquer algorithm that picks a pivot element and partitions the array around it.',
      timeComplexity: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n²)'
      },
      spaceComplexity: 'O(log n)',
      steps: [
        'Pick a pivot element (usually the last element)',
        'Partition: Move elements smaller than pivot to left',
        'Move elements larger than pivot to right',
        'Recursively sort left and right partitions',
        'Combine the results'
      ]
    },
    mergeSort: {
      title: 'Merge Sort',
      description: 'Merge Sort is a divide-and-conquer algorithm that divides the array into halves, sorts them, and merges them back.',
      timeComplexity: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n log n)'
      },
      spaceComplexity: 'O(n)',
      steps: [
        'Divide the array into two halves',
        'Recursively sort each half',
        'Merge the sorted halves',
        'Compare elements from both halves',
        'Place smaller element in result array'
      ]
    },
    insertionSort: {
      title: 'Insertion Sort',
      description: 'Insertion Sort builds the sorted array one item at a time by inserting each element into its correct position.',
      timeComplexity: {
        best: 'O(n)',
        average: 'O(n²)',
        worst: 'O(n²)'
      },
      spaceComplexity: 'O(1)',
      steps: [
        'Start with second element',
        'Compare with elements in sorted portion',
        'Shift larger elements to the right',
        'Insert element at correct position',
        'Repeat for all elements'
      ]
    },
    selectionSort: {
      title: 'Selection Sort',
      description: 'Selection Sort repeatedly finds the minimum element from the unsorted portion and moves it to the sorted portion.',
      timeComplexity: {
        best: 'O(n²)',
        average: 'O(n²)',
        worst: 'O(n²)'
      },
      spaceComplexity: 'O(1)',
      steps: [
        'Find the minimum element in unsorted array',
        'Swap it with the first unsorted element',
        'Move boundary of sorted portion one step',
        'Repeat until entire array is sorted',
        'Number of swaps is minimized'
      ]
    },
    heapSort: {
      title: 'Heap Sort',
      description: 'Heap Sort builds a max heap and repeatedly moves the largest element to the end, restoring the heap each time.',
      timeComplexity: {
        best: 'O(n log n)',
        average: 'O(n log n)',
        worst: 'O(n log n)'
      },
      spaceComplexity: 'O(1)',
      steps: [
        'Build a max heap from the array',
        'Swap the root (max) with the last element',
        'Reduce heap size by one',
        'Heapify the root to restore heap property',
        'Repeat until sorted'
      ]
    },
    shellSort: {
      title: 'Shell Sort',
      description: 'Shell Sort is a generalization of insertion sort that allows swapping elements far apart using decreasing gaps.',
      timeComplexity: {
        best: 'O(n log n) (depends on gaps)',
        average: 'Depends on gap sequence',
        worst: 'O(n²)'
      },
      spaceComplexity: 'O(1)',
      steps: [
        'Choose an initial gap (usually n/2)',
        'Perform gapped insertion sort for this gap',
        'Reduce the gap (e.g., gap = gap/2)',
        'Repeat until gap becomes 1',
        'Final pass is regular insertion sort'
      ]
    },
    countingSort: {
      title: 'Counting Sort',
      description: 'Counting Sort counts occurrences of each value and reconstructs the array in order. It works best when the value range is limited.',
      timeComplexity: {
        best: 'O(n + k)',
        average: 'O(n + k)',
        worst: 'O(n + k)'
      },
      spaceComplexity: 'O(k)',
      steps: [
        'Find the min and max value to determine range',
        'Count occurrences of each value',
        'Compute positions (conceptually)',
        'Write values back into the array in order',
        'Done'
      ]
    },
    radixSort: {
      title: 'Radix Sort',
      description: 'Radix Sort sorts numbers digit-by-digit (usually from least significant digit to most) using a stable counting-like pass per digit.',
      timeComplexity: {
        best: 'O(d(n + k))',
        average: 'O(d(n + k))',
        worst: 'O(d(n + k))'
      },
      spaceComplexity: 'O(n + k)',
      steps: [
        'Find the maximum number of digits',
        'For each digit place (1, 10, 100...)',
        'Stable-sort by that digit (counting-like)',
        'Copy the output back to the array',
        'Repeat until all digit places are processed'
      ]
    },
    combSort: {
      title: 'Comb Sort',
      description: 'Comb Sort improves Bubble Sort by comparing elements a gap apart, shrinking the gap over time until it becomes 1.',
      timeComplexity: {
        best: 'O(n log n) (typical)',
        average: 'O(n²) (worst-ish)',
        worst: 'O(n²)'
      },
      spaceComplexity: 'O(1)',
      steps: [
        'Start with a large gap (usually n)',
        'Compare and swap elements gap apart',
        'Shrink the gap by a shrink factor (≈ 1.3)',
        'Repeat until gap is 1 and no swaps occur',
        'Finishes like Bubble Sort with gap = 1'
      ]
    },
    bucketSort: {
      title: 'Bucket Sort',
      description: 'Bucket Sort distributes elements into buckets, sorts each bucket, then concatenates buckets back into the array. Works best when values are uniformly distributed.',
      timeComplexity: {
        best: 'O(n + k)',
        average: 'O(n + k)',
        worst: 'O(n²) (bad bucket distribution)'
      },
      spaceComplexity: 'O(n + k)',
      steps: [
        'Create a fixed number of buckets',
        'Distribute elements into buckets by value range',
        'Sort each bucket (often insertion sort)',
        'Write buckets back in order',
        'Array becomes sorted'
      ]
    },
    cocktailSort: {
      title: 'Cocktail Shaker Sort',
      description: 'A bidirectional Bubble Sort variant that moves large items right and small items left in alternating passes.',
      timeComplexity: {
        best: 'O(n)',
        average: 'O(n²)',
        worst: 'O(n²)'
      },
      spaceComplexity: 'O(1)',
      steps: [
        'Forward pass: bubble the largest element to the end',
        'Backward pass: bubble the smallest element to the front',
        'Shrink the unsorted window from both sides',
        'Repeat until a full iteration makes no swaps'
      ]
    },
    gnomeSort: {
      title: 'Gnome Sort',
      description: 'A simple sort that moves an element leftward by swapping backwards until it is in the correct position (like insertion sort via swaps).',
      timeComplexity: {
        best: 'O(n)',
        average: 'O(n²)',
        worst: 'O(n²)'
      },
      spaceComplexity: 'O(1)',
      steps: [
        'Walk forward comparing adjacent elements',
        'If in order, move forward',
        'If out of order, swap and step backward',
        'Repeat until the end is reached'
      ]
    },
    pancakeSort: {
      title: 'Pancake Sort',
      description: 'Sorts by repeatedly flipping prefixes to move the maximum element to its final position, similar to sorting pancakes with a spatula.',
      timeComplexity: {
        best: 'O(n²)',
        average: 'O(n²)',
        worst: 'O(n²)'
      },
      spaceComplexity: 'O(1)',
      steps: [
        'Find the maximum element in the unsorted prefix',
        'Flip to bring it to the front',
        'Flip the full unsorted prefix to move it to the end',
        'Shrink the unsorted prefix and repeat'
      ]
    }
  };

  const algo = explanations[algorithm] || explanations.bubbleSort;

  return (
    <div className="explanation-container">
      <h2>{algo.title}</h2>
      <p className="description">{algo.description}</p>
      
      <div className="complexity-section">
        <h3>Time Complexity</h3>
        <ul>
          <li><strong>Best Case:</strong> {algo.timeComplexity.best}</li>
          <li><strong>Average Case:</strong> {algo.timeComplexity.average}</li>
          <li><strong>Worst Case:</strong> {algo.timeComplexity.worst}</li>
        </ul>
        
        <h3>Space Complexity</h3>
        <p>{algo.spaceComplexity}</p>
      </div>

      <div className="steps-section">
        <h3>How it works:</h3>
        <ol>
          {algo.steps.map((step, index) => (
            <li key={index}>{step}</li>
          ))}
        </ol>
      </div>

      <div className="legend">
        <h3>Color Legend:</h3>
        <div className="legend-items">
          <div className="legend-item">
            <span className="color-box blue"></span>
            <span>Default</span>
          </div>
          <div className="legend-item">
            <span className="color-box yellow"></span>
            <span>Comparing</span>
          </div>
          <div className="legend-item">
            <span className="color-box red"></span>
            <span>Swapping</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explanation;
