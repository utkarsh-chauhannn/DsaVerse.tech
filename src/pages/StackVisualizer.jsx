import React, { useState } from 'react';
import Stack3D from '../components/Stack3D';
import { Stack } from '../algorithms/stack';

const StackVisualizer = () => {
  const [stackInstance] = useState(new Stack());
  const [stack, setStack] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [message, setMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handlePush = () => {
    if (!inputValue) {
      setMessage('Please enter a value');
      return;
    }
    const newStack = stackInstance.push(parseInt(inputValue));
    setStack(newStack);
    setHighlightedIndex(newStack.length - 1);
    setMessage(`Pushed ${inputValue} to stack`);
    setInputValue('');
    setTimeout(() => setHighlightedIndex(-1), 1000);
  };

  const handlePop = () => {
    if (stack.length === 0) {
      setMessage('Stack is empty!');
      return;
    }
    const topValue = stackInstance.peek();
    setHighlightedIndex(stack.length - 1);
    setTimeout(() => {
      const newStack = stackInstance.pop();
      setStack(newStack);
      setHighlightedIndex(-1);
      setMessage(`Popped ${topValue} from stack`);
    }, 500);
  };

  const handlePeek = () => {
    if (stack.length === 0) {
      setMessage('Stack is empty!');
      return;
    }
    const topValue = stackInstance.peek();
    setHighlightedIndex(stack.length - 1);
    setMessage(`Top element: ${topValue}`);
    setTimeout(() => setHighlightedIndex(-1), 1000);
  };

  const handleClear = () => {
    const newStack = stackInstance.clear();
    setStack(newStack);
    setHighlightedIndex(-1);
    setMessage('Stack cleared');
  };

  const handleReverse = async () => {
    if (stack.length <= 1) {
      setMessage('Need at least 2 items to reverse');
      return;
    }
    setIsAnimating(true);
    for (let i = stack.length - 1; i >= 0; i--) {
      setHighlightedIndex(i);
      await sleep(150);
    }
    const newStack = stackInstance.reverse();
    setStack(newStack);
    setHighlightedIndex(-1);
    setMessage('Reversed the stack');
    setIsAnimating(false);
  };

  const handleSort = async () => {
    if (stack.length <= 1) {
      setMessage('Need at least 2 items to sort');
      return;
    }
    setIsAnimating(true);
    for (let i = stack.length - 1; i >= 0; i--) {
      setHighlightedIndex(i);
      await sleep(120);
    }
    const newStack = stackInstance.sort((a, b) => a - b);
    setStack(newStack);
    setHighlightedIndex(-1);
    setMessage('Sorted the stack (ascending)');
    setIsAnimating(false);
  };

  return (
    <div className="visualizer-container">
      <header className="visualizer-header">
        <h1>Stack Visualizer (LIFO)</h1>
        <p>Last In, First Out - Push and Pop from the top</p>
      </header>

      <div className="visualizer-content">
        <div className="visualization-panel">
          <Stack3D stack={stack} highlightedIndex={highlightedIndex} />
          
          <div className="controls-container">
            <div className="input-group">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter value"
                onKeyPress={(e) => e.key === 'Enter' && handlePush()}
                disabled={isAnimating}
              />
              <button onClick={handlePush} className="btn btn-primary">
                Push
              </button>
            </div>

            <div className="button-group">
              <button onClick={handlePop} className="btn btn-danger" disabled={isAnimating}>
                Pop
              </button>
              <button onClick={handlePeek} className="btn btn-secondary" disabled={isAnimating}>
                Peek
              </button>
              <button onClick={handleReverse} className="btn btn-secondary" disabled={isAnimating || stack.length <= 1}>
                Reverse
              </button>
              <button onClick={handleSort} className="btn btn-secondary" disabled={isAnimating || stack.length <= 1}>
                Sort
              </button>
              <button onClick={handleClear} className="btn btn-warning" disabled={isAnimating}>
                Clear
              </button>
            </div>

            {message && <div className="message">{message}</div>}
            <div className="info">
              <p>Size: {stack.length}</p>
            </div>
          </div>
        </div>

        <div className="explanation-panel">
          <h2>Stack Data Structure</h2>
          <p>A stack is a linear data structure that follows the LIFO (Last In First Out) principle.</p>
          
          <h3>Operations</h3>
          <ul>
            <li><strong>Push:</strong> Add element to top - O(1)</li>
            <li><strong>Pop:</strong> Remove element from top - O(1)</li>
            <li><strong>Peek:</strong> View top element - O(1)</li>
            <li><strong>isEmpty:</strong> Check if empty - O(1)</li>
          </ul>

          <h3>Applications</h3>
          <ul>
            <li>Function call stack</li>
            <li>Undo/Redo functionality</li>
            <li>Expression evaluation</li>
            <li>Backtracking algorithms</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StackVisualizer;
