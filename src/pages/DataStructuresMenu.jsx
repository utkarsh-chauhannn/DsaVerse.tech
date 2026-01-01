import React from 'react';
import { Link } from 'react-router-dom';

const DataStructuresMenu = () => {
  const dataStructures = [
      {
        name: 'Sorting',
        path: '/sorting',
        description: 'Visualize and compare sorting algorithms step-by-step.',
        icon: '🔢',
        color: '#f59e0b'
      },
    {
      name: 'Stack',
      path: '/stack',
      description: 'LIFO - Last In First Out',
      icon: '📚',
      color: '#3b82f6'
    },
    {
      name: 'Queue',
      path: '/queue',
      description: 'FIFO - First In First Out',
      icon: '🚶',
      color: '#10b981'
    },
    {
      name: 'Linked List',
      path: '/linked-list',
      description: 'Nodes connected by pointers',
      icon: '🔗',
      color: '#f59e0b'
    },
    {
      name: 'Binary Tree',
      path: '/tree',
      description: 'Hierarchical structure',
      icon: '🌳',
      color: '#8b5cf6'
    },
    {
      name: 'Graph',
      path: '/graph',
      description: 'Vertices and edges',
      icon: '🕸️',
      color: '#ec4899'
    }
  ];

  return (
    <div className="menu-container">
      <header className="menu-header">
        <Link to="/" className="back-link">← Back to Home</Link>
        <h1>Data Structures</h1>
        <p>Choose a data structure to visualize</p>
      </header>

      <div className="menu-grid">
        {dataStructures.map((ds, index) => (
          <Link
            key={index}
            to={ds.path}
            className="menu-card"
            style={{ borderColor: ds.color }}
          >
            <div className="menu-icon" style={{ color: ds.color }}>
              {ds.icon}
            </div>
            <h2>{ds.name}</h2>
            <p>{ds.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DataStructuresMenu;
