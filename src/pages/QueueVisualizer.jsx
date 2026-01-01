import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Queue3D from '../components/Queue3D';
import { Queue } from '../algorithms/queue';

const QueueVisualizer = () => {
  const [queueInstance] = useState(new Queue());
  const [queue, setQueue] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [message, setMessage] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleEnqueue = () => {
    if (!inputValue) {
      setMessage('Please enter a value');
      return;
    }
    const newQueue = queueInstance.enqueue(parseInt(inputValue));
    setQueue(newQueue);
    setHighlightedIndex(newQueue.length - 1);
    setMessage(`Enqueued ${inputValue}`);
    setInputValue('');
    setTimeout(() => setHighlightedIndex(-1), 1000);
  };

  const handleDequeue = () => {
    if (queue.length === 0) {
      setMessage('Queue is empty');
      return;
    }
    const frontValue = queueInstance.front();
    setHighlightedIndex(0);
    setTimeout(() => {
      const newQueue = queueInstance.dequeue();
      setQueue(newQueue);
      setHighlightedIndex(-1);
      setMessage(`Dequeued ${frontValue}`);
    }, 500);
  };

  const handleFront = () => {
    if (queue.length === 0) {
      setMessage('Queue is empty');
      return;
    }
    const frontValue = queueInstance.front();
    setHighlightedIndex(0);
    setMessage(`Front: ${frontValue}`);
    setTimeout(() => setHighlightedIndex(-1), 1000);
  };

  const handleClear = () => {
    const newQueue = queueInstance.clear();
    setQueue(newQueue);
    setHighlightedIndex(-1);
    setMessage('Cleared');
  };

  const handleReverse = async () => {
    if (queue.length <= 1) {
      setMessage('Need at least 2 items to reverse');
      return;
    }
    setIsAnimating(true);
    for (let i = 0; i < queue.length; i++) {
      setHighlightedIndex(i);
      await sleep(120);
    }
    const newQueue = queueInstance.reverse();
    setQueue(newQueue);
    setHighlightedIndex(-1);
    setMessage('Reversed the queue');
    setIsAnimating(false);
  };

  return (
    <div className="vis-page">
      <div className="vis-nav">
        <Link to="/data-structures" className="vis-back">← Back</Link>
        <div className="vis-title">
          <h1>Queue</h1>
          <span className="vis-badge">FIFO</span>
        </div>
        <div className="vis-info">Size: {queue.length}</div>
      </div>

      <div className="vis-workspace">
        <div className="vis-canvas">
          <Queue3D queue={queue} highlightedIndex={highlightedIndex} />
        </div>

        <div className="vis-panel">
          <div className="vis-controls">
            <div className="control-row">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Value"
                onKeyPress={(e) => e.key === 'Enter' && handleEnqueue()}
                className="vis-input"
              />
              <button onClick={handleEnqueue} className="vis-btn vis-btn-primary">
                Enqueue
              </button>
            </div>

            <div className="control-row">
              <button 
                onClick={handleDequeue} 
                className="vis-btn"
                disabled={queue.length === 0 || isAnimating}
              >
                Dequeue
              </button>
              <button 
                onClick={handleFront} 
                className="vis-btn"
                disabled={queue.length === 0 || isAnimating}
              >
                Peek
              </button>
              <button 
                onClick={handleReverse} 
                className="vis-btn"
                disabled={queue.length <= 1 || isAnimating}
              >
                Reverse
              </button>
              <button 
                onClick={handleClear} 
                className="vis-btn"
                disabled={queue.length === 0 || isAnimating}
              >
                Clear
              </button>
            </div>

            {message && <div className="vis-message">{message}</div>}
          </div>

          <div className="vis-docs">
            <div className="doc-section">
              <h4>About</h4>
              <p>Queue follows FIFO (First In First Out). Add elements at the rear, remove from the front.</p>
            </div>

            <div className="doc-section">
              <h4>Complexity</h4>
              <table className="complexity-table">
                <tbody>
                  <tr>
                    <td>Enqueue</td>
                    <td className="mono">O(1)</td>
                  </tr>
                  <tr>
                    <td>Dequeue</td>
                    <td className="mono">O(1)</td>
                  </tr>
                  <tr>
                    <td>Peek</td>
                    <td className="mono">O(1)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="doc-section">
              <h4>Applications</h4>
              <ul className="doc-list">
                <li>Task scheduling</li>
                <li>BFS algorithms</li>
                <li>Print spooling</li>
                <li>Message queues</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueVisualizer;
