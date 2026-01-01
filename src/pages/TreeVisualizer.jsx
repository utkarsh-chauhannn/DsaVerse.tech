import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import BinaryTree3D from '../components/BinaryTree3D';
import { BinaryTree } from '../algorithms/binaryTree';

const TreeVisualizer = () => {
  const [treeInstance] = useState(new BinaryTree());
  const [tree, setTree] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [deleteValue, setDeleteValue] = useState('');
  const [highlightedNodes, setHighlightedNodes] = useState([]);
  const [message, setMessage] = useState('');
  const [insertMode, setInsertMode] = useState('bst');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleInsert = () => {
    if (!inputValue) {
      setMessage('Please enter a value');
      return;
    }
    const value = parseInt(inputValue);
    const newTree = insertMode === 'bst'
      ? treeInstance.insertBST(value)
      : insertMode === 'avl'
        ? treeInstance.insertAVL(value)
        : treeInstance.insert(value);
    setTree(newTree);
    setMessage(`Inserted ${value}`);
    setInputValue('');
  };

  const animateTraversal = async (indices) => {
    setIsAnimating(true);
    for (let i = 0; i < indices.length; i++) {
      setHighlightedNodes([indices[i]]);
      await new Promise(resolve => setTimeout(resolve, 600));
    }
    setHighlightedNodes([]);
    setIsAnimating(false);
  };

  const handleTraversal = (type) => {
    const indices = getTraversalIndices(type);
    const values = indices.map(i => tree[i]).filter(v => v !== null);
    setMessage(`${type}: [${values.join(', ')}]`);
    animateTraversal(indices);
  };

  const getSearchPathIndicesBST = (value) => {
    const path = [];
    let i = 0;
    while (i < tree.length && tree[i] !== null && tree[i] !== undefined) {
      path.push(i);
      if (tree[i] === value) break;
      if (value < tree[i]) i = 2 * i + 1;
      else i = 2 * i + 2;
    }
    return path;
  };

  const handleSearch = async () => {
    if (!searchValue) {
      setMessage('Please enter a value to search');
      return;
    }
    if (insertMode !== 'bst' && insertMode !== 'avl') {
      setMessage('Search is available in BST/AVL Mode');
      return;
    }
    const target = parseInt(searchValue);
    const path = getSearchPathIndicesBST(target);
    if (!path.length) {
      setMessage('Tree is empty');
      return;
    }

    await animateTraversal(path);

    const lastIdx = path[path.length - 1];
    if (tree[lastIdx] === target) {
      setMessage(`Found ${target} (checked ${path.length} node(s))`);
    } else {
      setMessage(`Not found: ${target} (checked ${path.length} node(s))`);
    }
    setSearchValue('');
  };

  const handleDelete = () => {
    if (!deleteValue) {
      setMessage('Please enter a value to delete');
      return;
    }
    if (insertMode !== 'bst') {
      setMessage('Delete is available in BST Mode');
      return;
    }
    const value = parseInt(deleteValue);
    const newTree = treeInstance.deleteBST(value);
    setTree(newTree);
    setMessage(`Deleted ${value} (if present)`);
    setDeleteValue('');
  };

  const getTraversalIndices = (type) => {
    const result = [];
    
    const inorder = (i) => {
      if (i >= tree.length || tree[i] === null) return;
      inorder(2 * i + 1);
      result.push(i);
      inorder(2 * i + 2);
    };
    
    const preorder = (i) => {
      if (i >= tree.length || tree[i] === null) return;
      result.push(i);
      preorder(2 * i + 1);
      preorder(2 * i + 2);
    };
    
    const postorder = (i) => {
      if (i >= tree.length || tree[i] === null) return;
      postorder(2 * i + 1);
      postorder(2 * i + 2);
      result.push(i);
    };
    
    const levelorder = () => {
      for (let i = 0; i < tree.length; i++) {
        if (tree[i] !== null) result.push(i);
      }
    };

    switch(type) {
      case 'Inorder': inorder(0); break;
      case 'Preorder': preorder(0); break;
      case 'Postorder': postorder(0); break;
      case 'Level-order': levelorder(); break;
      default: break;
    }
    
    return result;
  };

  const handleClear = () => {
    const newTree = treeInstance.clear();
    setTree(newTree);
    setHighlightedNodes([]);
    setMessage('Cleared');
  };

  const handleMinMaxHeight = (kind) => {
    if (insertMode !== 'bst') {
      setMessage('This operation is available in BST Mode');
      return;
    }
    if (!tree.length) {
      setMessage('Tree is empty');
      return;
    }

    if (kind === 'min') {
      const v = treeInstance.findMinBST();
      setMessage(v == null ? 'Tree is empty' : `Min (BST): ${v}`);
    } else if (kind === 'max') {
      const v = treeInstance.findMaxBST();
      setMessage(v == null ? 'Tree is empty' : `Max (BST): ${v}`);
    } else if (kind === 'height') {
      const h = treeInstance.height();
      setMessage(`Height: ${h}`);
    }
  };

  return (
    <div className="vis-page">
      <div className="vis-nav">
        <Link to="/data-structures" className="vis-back">← Back</Link>
        <div className="vis-title">
          <h1>Binary Tree</h1>
          <span className="vis-badge">{insertMode === 'bst' ? 'BST' : 'LEVEL'}</span>
        </div>
        <div className="vis-info">Nodes: {tree.filter(n => n !== null).length}</div>
      </div>

      <div className="vis-workspace">
        <div className="vis-canvas">
          <BinaryTree3D tree={tree} highlightedNodes={highlightedNodes} />
        </div>

        <div className="vis-panel">
          <div className="vis-controls">
            <div className="mode-selector">
              <button 
                className={`mode-btn ${insertMode === 'bst' ? 'active' : ''}`}
                onClick={() => setInsertMode('bst')}
              >
                BST Mode
              </button>
              <button 
                className={`mode-btn ${insertMode === 'avl' ? 'active' : ''}`}
                onClick={() => setInsertMode('avl')}
              >
                AVL Mode
              </button>
              <button 
                className={`mode-btn ${insertMode === 'level' ? 'active' : ''}`}
                onClick={() => setInsertMode('level')}
              >
                Level-order
              </button>
            </div>

            <div className="control-row">
              <input
                type="number"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Value"
                onKeyPress={(e) => e.key === 'Enter' && handleInsert()}
                className="vis-input"
                disabled={isAnimating}
              />
              <button onClick={handleInsert} className="vis-btn vis-btn-primary">
                Insert
              </button>
            </div>

            <div className="control-row">
              <input
                type="number"
                value={deleteValue}
                onChange={(e) => setDeleteValue(e.target.value)}
                placeholder="Delete (BST)"
                onKeyPress={(e) => e.key === 'Enter' && handleDelete()}
                className="vis-input"
                disabled={isAnimating || insertMode !== 'bst'}
              />
              <button onClick={handleDelete} className="vis-btn" disabled={isAnimating || insertMode !== 'bst' || tree.length === 0}>
                Delete
              </button>
            </div>

            <div className="control-row">
              <input
                type="number"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search (BST)"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="vis-input"
                disabled={isAnimating || (insertMode !== 'bst' && insertMode !== 'avl')}
              />
              <button onClick={handleSearch} className="vis-btn" disabled={isAnimating || (insertMode !== 'bst' && insertMode !== 'avl') || tree.length === 0}>
                Search
              </button>
            </div>

            <div className="traversal-group">
              <button onClick={() => handleTraversal('Inorder')} className="vis-btn" disabled={tree.length === 0 || isAnimating}>
                Inorder
              </button>
              <button onClick={() => handleTraversal('Preorder')} className="vis-btn" disabled={tree.length === 0 || isAnimating}>
                Preorder
              </button>
              <button onClick={() => handleTraversal('Postorder')} className="vis-btn" disabled={tree.length === 0 || isAnimating}>
                Postorder
              </button>
              <button onClick={() => handleTraversal('Level-order')} className="vis-btn" disabled={tree.length === 0 || isAnimating}>
                Level
              </button>
            </div>

            <div className="traversal-group">
              <button onClick={() => handleMinMaxHeight('min')} className="vis-btn" disabled={tree.length === 0 || isAnimating || (insertMode !== 'bst' && insertMode !== 'avl')}>
                Min
              </button>
              <button onClick={() => handleMinMaxHeight('max')} className="vis-btn" disabled={tree.length === 0 || isAnimating || (insertMode !== 'bst' && insertMode !== 'avl')}>
                Max
              </button>
              <button onClick={() => handleMinMaxHeight('height')} className="vis-btn" disabled={tree.length === 0 || isAnimating}>
                Height
              </button>
            </div>

            <button onClick={handleClear} className="vis-btn" disabled={tree.length === 0 || isAnimating}>
              Clear
            </button>

            {message && <div className="vis-message">{message}</div>}
          </div>

          <div className="vis-docs">
            <div className="doc-section">
              <h4>Insertion</h4>
              <p><strong>BST:</strong> Follows binary search tree property (left &lt; parent &lt; right)</p>
              <p><strong>AVL:</strong> Self-balancing BST (rotations keep height ~ log n)</p>
              <p><strong>Level-order:</strong> Fills tree level by level, left to right</p>
            </div>

            <div className="doc-section">
              <h4>Traversals</h4>
              <ul className="doc-list">
                <li><strong>Inorder:</strong> Left → Root → Right</li>
                <li><strong>Preorder:</strong> Root → Left → Right</li>
                <li><strong>Postorder:</strong> Left → Right → Root</li>
                <li><strong>Level-order:</strong> Level by level</li>
              </ul>
            </div>

            <div className="doc-section">
              <h4>Complexity</h4>
              <table className="complexity-table">
                <tbody>
                  <tr>
                    <td>Search (BST)</td>
                    <td className="mono">O(log n)</td>
                  </tr>
                  <tr>
                    <td>Insert (BST)</td>
                    <td className="mono">O(log n)</td>
                  </tr>
                  <tr>
                    <td>Traversal</td>
                    <td className="mono">O(n)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreeVisualizer;
