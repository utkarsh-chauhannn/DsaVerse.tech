import React from 'react';
import { useProgress } from '../hooks/useProgress';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import './Progress.css';

const Progress = () => {
  const { currentUser } = useAuth();
  const { progress, loading, getProgressPercentage } = useProgress();

  if (!currentUser) {
    return (
      <div className="progress-container">
        <div className="progress-login-prompt">
          <h2>Sign in to track your progress</h2>
          <p>Create an account to save your learning journey and track your progress across all algorithms and data structures.</p>
          <Link to="/login" className="btn btn-primary">Sign In</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="progress-container">
        <div className="progress-loading">
          <p>Loading your progress...</p>
          <p style={{ fontSize: '0.875rem', color: '#737373', marginTop: '1rem' }}>
            If this takes too long, check the browser console for errors.
          </p>
          <div style={{ 
            marginTop: '2rem', 
            padding: '1rem', 
            background: 'rgba(239, 68, 68, 0.1)', 
            border: '1px solid rgba(239, 68, 68, 0.3)', 
            borderRadius: '8px',
            fontSize: '0.875rem',
            color: '#fca5a5'
          }}>
            <strong>⚠️ Troubleshooting:</strong>
            <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
              <li>Disable ad blockers (uBlock Origin, AdBlock Plus, etc.)</li>
              <li>Disable privacy extensions that block trackers</li>
              <li>Check if Firestore is enabled in Firebase Console</li>
              <li>Verify Firestore security rules are set up</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
  
  // Handle case where progress is null or undefined
  if (!progress) {
    return (
      <div className="progress-container">
        <div className="progress-login-prompt">
          <h2>Unable to load progress</h2>
          <p>There was an error loading your progress. Please try refreshing the page.</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  const progressPercentage = getProgressPercentage();
  const algorithms = progress?.algorithms || {};
  const dataStructures = progress?.dataStructures || {};
  const totalTime = progress?.totalTimeSpent || 0;

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatAlgorithmName = (name) => {
    return name.replace(/([A-Z])/g, ' $1').trim().replace(/^\w/, c => c.toUpperCase());
  };

  const algorithmList = [
    'bubbleSort', 'quickSort', 'mergeSort', 'insertionSort', 'selectionSort', 
    'heapSort', 'shellSort', 'countingSort', 'radixSort', 'combSort', 
    'bucketSort', 'cocktailSort', 'gnomeSort', 'pancakeSort'
  ];

  const dataStructureList = ['Stack', 'Queue', 'Linked List', 'Binary Tree', 'Graph'];

  return (
    <div className="progress-container">
      <header className="progress-header">
        <h1>My Learning Progress</h1>
        <p>Track your journey through DSA concepts</p>
      </header>

      <div className="progress-stats">
        <div className="stat-card">
          <h3>Overall Progress</h3>
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${progressPercentage}%` }}>
              {progressPercentage}%
            </div>
          </div>
          <p className="stat-description">{progressPercentage}% of topics learned</p>
        </div>

        <div className="stat-card">
          <h3>Time Spent</h3>
          <p className="stat-value">{formatTime(totalTime)}</p>
          <p className="stat-description">Total learning time</p>
        </div>

        <div className="stat-card">
          <h3>Algorithms Viewed</h3>
          <p className="stat-value">{Object.keys(algorithms).length} / 14</p>
          <p className="stat-description">Sorting algorithms explored</p>
        </div>

        <div className="stat-card">
          <h3>Data Structures Viewed</h3>
          <p className="stat-value">{Object.keys(dataStructures).length} / 5</p>
          <p className="stat-description">Data structures explored</p>
        </div>
      </div>

      <div className="progress-sections">
        <section className="progress-section">
          <h2>Sorting Algorithms</h2>
          <div className="topic-grid">
            {algorithmList.map(algo => {
              const algoData = algorithms[algo] || {};
              return (
                <div key={algo} className="topic-item">
                  <div className="topic-name">{formatAlgorithmName(algo)}</div>
                  <div className="topic-status">
                    {algoData.understood ? (
                      <span className="status-learned">✓ Learned</span>
                    ) : algoData.viewed ? (
                      <span className="status-viewed">👁 Viewed</span>
                    ) : (
                      <span className="status-new">New</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="progress-section">
          <h2>Data Structures</h2>
          <div className="topic-grid">
            {dataStructureList.map(ds => {
              const dsData = dataStructures[ds] || {};
              return (
                <div key={ds} className="topic-item">
                  <div className="topic-name">{ds}</div>
                  <div className="topic-status">
                    {dsData.understood ? (
                      <span className="status-learned">✓ Learned</span>
                    ) : dsData.viewed ? (
                      <span className="status-viewed">👁 Viewed</span>
                    ) : (
                      <span className="status-new">New</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Progress;

