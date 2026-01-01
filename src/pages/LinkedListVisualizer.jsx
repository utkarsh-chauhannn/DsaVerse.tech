import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LinkedList3D from '../components/LinkedList3D';
import { LinkedList } from '../algorithms/linkedList';

const LinkedListVisualizer = () => {
  const [listInstance] = useState(new LinkedList());
  const [list, setList] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [deleteValue, setDeleteValue] = useState('');
  const [cycleIndex, setCycleIndex] = useState('0');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [message, setMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const animateIndices = async (indices, delayMs = 350) => {
    setIsAnimating(true);
    for (const idx of indices) {
      setHighlightedIndex(idx);
      await sleep(delayMs);
    }
    setHighlightedIndex(-1);
    setIsAnimating(false);
  };

  const handleAppend = () => {
    if (!inputValue) {
      setMessage('Please enter a value');
      return;
    }
    const newList = listInstance.append(parseInt(inputValue));
    setList(newList);
    setHighlightedIndex(newList.length - 1);
    setMessage(`Appended ${inputValue} to list`);
    setInputValue('');
    setTimeout(() => setHighlightedIndex(-1), 1000);
  };

  const handlePrepend = () => {
    if (!inputValue) {
      setMessage('Please enter a value');
      return;
    }
    const newList = listInstance.prepend(parseInt(inputValue));
    setList(newList);
    setHighlightedIndex(0);
    setMessage(`Prepended ${inputValue} to list`);
    setInputValue('');
    setTimeout(() => setHighlightedIndex(-1), 1000);
  };

  const handleReverse = async () => {
    if (list.length <= 1) {
      setMessage('Need at least 2 nodes to reverse');
      return;
    }
    await animateIndices(Array.from({ length: list.length }, (_, i) => i), 200);
    const newList = listInstance.reverse();
    setList(newList);
    setMessage('Reversed the list');
  };

  const handleFindMiddle = async () => {
    if (!list.length) {
      setMessage('List is empty');
      return;
    }

    // Simulate slow/fast pointers using indices for visualization
    const slowSteps = [];
    let slow = 0;
    let fast = 0;
    while (fast < list.length && fast + 1 < list.length) {
      slowSteps.push(slow);
      slow += 1;
      fast += 2;
    }
    slowSteps.push(slow);
    await animateIndices(slowSteps, 300);

    const middleValue = listInstance.findMiddle();
    setHighlightedIndex(slow);
    setMessage(`Middle node: ${middleValue}`);
    setTimeout(() => setHighlightedIndex(-1), 1200);
  };

  const handleDelete = () => {
    if (!deleteValue) {
      setMessage('Please enter a value to delete');
      return;
    }
    const index = listInstance.search(parseInt(deleteValue));
    if (index === -1) {
      setMessage(`Value ${deleteValue} not found`);
      return;
    }
    setHighlightedIndex(index);
    setTimeout(() => {
      const newList = listInstance.delete(parseInt(deleteValue));
      setList(newList);
      setHighlightedIndex(-1);
      setMessage(`Deleted ${deleteValue} from list`);
      setDeleteValue('');
    }, 500);
  };

  const handleSearch = () => {
    if (!deleteValue) {
      setMessage('Please enter a value to search');
      return;
    }
    const index = listInstance.search(parseInt(deleteValue));
    if (index === -1) {
      setMessage(`Value ${deleteValue} not found`);
    } else {
      setHighlightedIndex(index);
      setMessage(`Found ${deleteValue} at index ${index}`);
      setTimeout(() => setHighlightedIndex(-1), 2000);
    }
  };

  const handleClear = () => {
    const newList = listInstance.clear();
    setList(newList);
    setHighlightedIndex(-1);
    setMessage('List cleared');
  };

  const handleCreateCycle = () => {
    const res = listInstance.createTailCycleToIndex(cycleIndex);
    if (!res.ok) {
      setMessage('Invalid cycle index (needs 0..size-1, size >= 2)');
      return;
    }
    setMessage(`Created tail cycle to index ${res.cycleToIndex}`);
  };

  const handleRemoveCycle = () => {
    listInstance.removeCycle();
    setMessage('Removed cycle');
  };

  const handleDetectCycle = async () => {
    if (list.length < 2) {
      setMessage('Need at least 2 nodes');
      return;
    }
    const steps = listInstance.detectCycleFloydSteps(60);
    if (!steps.length) return;
    setIsAnimating(true);
    for (const s of steps) {
      if (typeof s?.slow === 'number') setHighlightedIndex(s.slow);
      setMessage(s.description);
      // slower when both pointers valid
      await sleep(320);
      if (s.type === 'done') break;
    }
    setHighlightedIndex(-1);
    setIsAnimating(false);
  };

  return (
    <div className="vis-page">
      <div className="vis-nav">
        <Link to="/data-structures" className="vis-back">← Back</Link>
        <div className="vis-title">
          <h1>Linked List</h1>
          <span className="vis-badge">LINEAR</span>
        </div>
        <div className="vis-info">Size: {list.length}</div>
      </div>

      <div className="vis-workspace">
        <div className="vis-canvas">
          <LinkedList3D list={list} highlightedIndex={highlightedIndex} />
        </div>

        <div className="vis-panel">
          <div className="vis-controls">
            <div className="control-row">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Value"
                onKeyPress={(e) => e.key === 'Enter' && handleAppend()}
                className="vis-input"
                disabled={isAnimating}
              />
              <button onClick={handleAppend} className="vis-btn vis-btn-primary">
                Append
              </button>
            </div>

            <div className="control-row">
              <input
                type="number"
                value={cycleIndex}
                onChange={(e) => setCycleIndex(e.target.value)}
                placeholder="Cycle to index"
                className="vis-input"
                disabled={isAnimating}
              />
              <button onClick={handleCreateCycle} className="vis-btn" disabled={isAnimating || list.length < 2}>
                Make Cycle
              </button>
              <button onClick={handleDetectCycle} className="vis-btn" disabled={isAnimating || list.length < 2}>
                Detect Cycle
              </button>
              <button onClick={handleRemoveCycle} className="vis-btn" disabled={isAnimating}>
                Remove Cycle
              </button>
            </div>

            <div className="control-row">
              <button onClick={handlePrepend} className="vis-btn" disabled={!inputValue || isAnimating}>
                Prepend
              </button>
              <button onClick={handleReverse} className="vis-btn" disabled={list.length <= 1 || isAnimating}>
                Reverse
              </button>
              <button onClick={handleFindMiddle} className="vis-btn" disabled={list.length === 0 || isAnimating}>
                Find Middle
              </button>
              <button onClick={handleClear} className="vis-btn" disabled={list.length === 0 || isAnimating}>
                Clear
              </button>
            </div>

            <div className="control-row">
              <input
                type="number"
                value={deleteValue}
                onChange={(e) => setDeleteValue(e.target.value)}
                placeholder="Search/Delete"
                className="vis-input"
                disabled={isAnimating}
              />
              <button onClick={handleSearch} className="vis-btn" disabled={isAnimating}>
                Search
              </button>
            </div>

            <div className="control-row">
              <button onClick={handleDelete} className="vis-btn" disabled={!deleteValue || isAnimating}>
                Delete
              </button>
            </div>

            {message && <div className="vis-message">{message}</div>}
          </div>

          <div className="vis-docs">
            <div className="doc-section">
              <h4>About</h4>
              <p>A linear data structure where elements are stored in nodes, each pointing to the next node.</p>
            </div>

            <div className="doc-section">
              <h4>Complexity</h4>
              <table className="complexity-table">
                <tbody>
                  <tr>
                    <td>Append</td>
                    <td className="mono">O(n)</td>
                  </tr>
                  <tr>
                    <td>Prepend</td>
                    <td className="mono">O(1)</td>
                  </tr>
                  <tr>
                    <td>Delete</td>
                    <td className="mono">O(n)</td>
                  </tr>
                  <tr>
                    <td>Search</td>
                    <td className="mono">O(n)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="doc-section">
              <h4>Applications</h4>
              <ul className="doc-list">
                <li>Dynamic memory allocation</li>
                <li>Stack and queue implementation</li>
                <li>Browser history</li>
                <li>Image viewer (prev/next)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedListVisualizer;
