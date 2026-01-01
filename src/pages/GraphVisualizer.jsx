import React, { useEffect, useMemo, useRef, useState } from 'react';
import Graph3D from '../components/Graph3D';
import { Graph } from '../algorithms/graph';

const GraphVisualizer = () => {
  const [graphInstance] = useState(new Graph(false));
  const [graph, setGraph] = useState({ nodes: [], edges: [] });
  const [vertex1, setVertex1] = useState('');
  const [vertex2, setVertex2] = useState('');
  const [edgeWeight, setEdgeWeight] = useState('1');
  const [singleVertex, setSingleVertex] = useState('');
  const [highlightedNodes, setHighlightedNodes] = useState([]);
  const [message, setMessage] = useState('');

  const [traversalAlgo, setTraversalAlgo] = useState('bfs');
  const [speed, setSpeed] = useState(800);
  const [frames, setFrames] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [stepDescription, setStepDescription] = useState('');
  const [traversalOrder, setTraversalOrder] = useState([]);
  const [metrics, setMetrics] = useState({
    visits: 0,
    enqueues: 0,
    inspections: 0
  });

  const playTimerRef = useRef(null);
  const finalOrderRef = useRef([]);

  const stopPlayback = () => {
    setIsPlaying(false);
    if (playTimerRef.current) {
      clearTimeout(playTimerRef.current);
      playTimerRef.current = null;
    }
  };

  const applyFrame = (frame) => {
    if (!frame) return;
    setHighlightedNodes(frame.highlightedNodes || []);
    setStepDescription(frame.description || '');
  };

  const computeOrderUpToIndex = (nextFrames, idx) => {
    const visits = [];
    for (let i = 0; i <= idx && i < nextFrames.length; i++) {
      const f = nextFrames[i];
      if (f?.type === 'visit' && Array.isArray(f.highlightedNodes) && f.highlightedNodes[0] != null) {
        visits.push(f.highlightedNodes[0]);
      }
    }
    return visits;
  };

  const traversalLabel = useMemo(() => {
    if (traversalAlgo === 'shortestPath') return 'SHORTEST PATH';
    if (traversalAlgo === 'dijkstra') return 'DIJKSTRA';
    if (traversalAlgo === 'prim') return 'PRIM MST';
    if (traversalAlgo === 'kruskal') return 'KRUSKAL MST';
    return traversalAlgo.toUpperCase();
  }, [traversalAlgo]);

  const computeMetrics = (nextFrames) => {
    const acc = { visits: 0, enqueues: 0, inspections: 0 };
    for (const frame of nextFrames) {
      if (frame.type === 'visit') acc.visits += 1;
      if (frame.type === 'enqueue') acc.enqueues += 1;
      if (frame.type === 'inspect') acc.inspections += 1;
    }
    return acc;
  };

  const handleAddVertex = () => {
    if (!singleVertex) {
      setMessage('Please enter a vertex');
      return;
    }
    stopPlayback();
    setIsRunning(false);
    const newGraph = graphInstance.addVertex(singleVertex);
    setGraph(newGraph);
    setMessage(`Added vertex ${singleVertex}`);
    setSingleVertex('');
  };

  const handleAddEdge = () => {
    if (!vertex1 || !vertex2) {
      setMessage('Please enter both vertices');
      return;
    }
    stopPlayback();
    setIsRunning(false);
    const w = Number(edgeWeight);
    const safeW = Number.isFinite(w) ? w : 1;
    const newGraph = graphInstance.addEdge(vertex1, vertex2, safeW);
    setGraph(newGraph);
    setMessage(`Added edge between ${vertex1} and ${vertex2} (w=${safeW})`);
    setVertex1('');
    setVertex2('');
  };

  const handleRemoveEdge = () => {
    if (!vertex1 || !vertex2) {
      setMessage('Please enter both vertices');
      return;
    }
    stopPlayback();
    setIsRunning(false);
    const newGraph = graphInstance.removeEdge(vertex1, vertex2);
    setGraph(newGraph);
    setMessage(`Removed edge between ${vertex1} and ${vertex2}`);
    setVertex1('');
    setVertex2('');
  };

  const handleRemoveVertex = () => {
    if (!singleVertex) {
      setMessage('Please enter a vertex');
      return;
    }
    stopPlayback();
    setIsRunning(false);
    const newGraph = graphInstance.removeVertex(singleVertex);
    setGraph(newGraph);
    setMessage(`Removed vertex ${singleVertex}`);
    setSingleVertex('');
  };

  const handleStartTraversal = () => {
    stopPlayback();

    const isShortestPath = traversalAlgo === 'shortestPath';
    const isComponents = traversalAlgo === 'components';
    const isCycle = traversalAlgo === 'cycle';
    const isBipartite = traversalAlgo === 'bipartite';
    const isDijkstra = traversalAlgo === 'dijkstra';
    const isPrim = traversalAlgo === 'prim';
    const isKruskal = traversalAlgo === 'kruskal';

    if (!isShortestPath && !isDijkstra && !isKruskal && !singleVertex) {
      setMessage('Please enter a start vertex');
      return;
    }
    if ((isShortestPath || isDijkstra) && (!vertex1 || !vertex2)) {
      setMessage('Please enter both From and To for shortest path');
      return;
    }

    if ((isComponents || isCycle || isBipartite || isKruskal) && graph.nodes.length === 0) {
      setMessage('Please add vertices/edges first');
      return;
    }

    if (isPrim && !singleVertex) {
      setMessage('Please enter a start vertex');
      return;
    }

    const nextFrames = isComponents
      ? graphInstance.connectedComponentsSteps()
      : isCycle
        ? graphInstance.hasCycleUndirectedSteps()
        : isBipartite
          ? graphInstance.isBipartiteSteps()
          : isKruskal
            ? graphInstance.kruskalMSTSteps()
            : isPrim
              ? graphInstance.primMSTSteps(singleVertex)
              : isDijkstra
                ? graphInstance.dijkstraSteps(vertex1, vertex2)
                : isShortestPath
                  ? graphInstance.shortestPathSteps(vertex1, vertex2)
                  : traversalAlgo === 'dfs'
                    ? graphInstance.dfsSteps(singleVertex)
                    : graphInstance.bfsSteps(singleVertex);

    if (!nextFrames.length) {
      setMessage(isShortestPath ? 'No path available (missing vertex?)' : `Vertex ${singleVertex} not found`);
      return;
    }

    setFrames(nextFrames);
    setStepIndex(0);
    setMetrics(computeMetrics(nextFrames));
    applyFrame(nextFrames[0]);
    setIsRunning(true);
    setIsPlaying(true);

    if (isDijkstra) {
      const pathFrame = [...nextFrames].reverse().find((f) => f?.type === 'path' && Array.isArray(f.highlightedNodes));
      finalOrderRef.current = pathFrame?.highlightedNodes || [];
    } else if (isShortestPath) {
      const pathFrame = [...nextFrames].reverse().find((f) => f?.type === 'path' && Array.isArray(f.highlightedNodes));
      finalOrderRef.current = pathFrame?.highlightedNodes || [];
    } else if (isComponents) {
      // Final order shown is the sequence of visits
      finalOrderRef.current = nextFrames
        .filter((f) => f?.type === 'visit' && Array.isArray(f.highlightedNodes) && f.highlightedNodes[0] != null)
        .map((f) => f.highlightedNodes[0]);
    } else if (isCycle || isBipartite) {
      finalOrderRef.current = [];
    } else {
      const finalOrder = nextFrames
        .filter((f) => f?.type === 'visit' && Array.isArray(f.highlightedNodes) && f.highlightedNodes[0] != null)
        .map((f) => f.highlightedNodes[0]);
      finalOrderRef.current = finalOrder;
    }
    setTraversalOrder([]);

    setMessage(
      isComponents
        ? `${traversalLabel} started`
        : isCycle
          ? `${traversalLabel} started`
          : isBipartite
            ? `${traversalLabel} started`
            : isKruskal
              ? `${traversalLabel} started`
              : isPrim
                ? `${traversalLabel} started from ${singleVertex}`
                : (isShortestPath || isDijkstra)
                  ? `${traversalLabel} from ${vertex1} to ${vertex2}`
                  : `${traversalLabel} started from ${singleVertex}`
    );
  };

  const handleStepTo = (nextIndex) => {
    const safeIndex = Math.max(0, Math.min(nextIndex, frames.length - 1));
    setStepIndex(safeIndex);
    applyFrame(frames[safeIndex]);
  };

  const handleNext = () => {
    stopPlayback();
    if (!frames.length) return;
    handleStepTo(stepIndex + 1);
  };

  const handlePrev = () => {
    stopPlayback();
    if (!frames.length) return;
    handleStepTo(stepIndex - 1);
  };

  const handlePlayPause = () => {
    if (!frames.length) return;
    setIsPlaying((prev) => !prev);
  };

  const handleRestart = () => {
    stopPlayback();
    if (!frames.length) return;
    setIsRunning(true);
    handleStepTo(0);
  };

  const handleClear = () => {
    stopPlayback();
    setIsRunning(false);
    const newGraph = graphInstance.clear();
    setGraph(newGraph);
    setHighlightedNodes([]);
    setFrames([]);
    setStepIndex(0);
    setStepDescription('');
    setMessage('Graph cleared');
  };

  const handleLoadExample = () => {
    stopPlayback();
    setIsRunning(false);
    graphInstance.clear();

    // Minimal example graph
    graphInstance.addEdge('A', 'B');
    graphInstance.addEdge('A', 'C');
    graphInstance.addEdge('B', 'D');
    graphInstance.addEdge('C', 'E');
    graphInstance.addEdge('D', 'F');

    setGraph(graphInstance.serialize());
    setMessage('Loaded example graph');
  };

  useEffect(() => {
    if (!isPlaying) {
      if (playTimerRef.current) {
        clearTimeout(playTimerRef.current);
        playTimerRef.current = null;
      }
      return;
    }

    if (!frames.length) {
      setIsPlaying(false);
      setIsRunning(false);
      return;
    }

    if (stepIndex >= frames.length - 1) {
      setIsPlaying(false);
      setIsRunning(false);
      return;
    }

    playTimerRef.current = setTimeout(() => {
      setStepIndex((prev) => {
        const next = prev + 1;
        applyFrame(frames[next]);
        if (next >= frames.length - 1) {
          setIsPlaying(false);
          setIsRunning(false);
        }
        return next;
      });
    }, Math.max(50, Number(speed) || 800));

    return () => {
      if (playTimerRef.current) {
        clearTimeout(playTimerRef.current);
        playTimerRef.current = null;
      }
    };
  }, [isPlaying, stepIndex, frames, speed]);

  useEffect(() => {
    if (!frames.length) {
      setTraversalOrder([]);
      return;
    }
    setTraversalOrder(computeOrderUpToIndex(frames, stepIndex));

    const isLast = stepIndex >= frames.length - 1;
    if (isLast && finalOrderRef.current?.length) {
      setMessage(`${traversalLabel}: ${finalOrderRef.current.join(' → ')}`);
    }
  }, [frames, stepIndex, traversalLabel]);

  return (
    <div className="visualizer-container">
      <header className="visualizer-header">
        <h1>Graph Visualizer</h1>
        <p>Network of vertices connected by edges</p>
      </header>

      <div className="visualizer-content">
        <div className="visualization-panel">
          <Graph3D graphData={graph} highlightedNodes={highlightedNodes} />
          
          <div className="controls-container">
            <div className="input-group">
              <button onClick={handleLoadExample} className="btn btn-secondary">
                Load Example
              </button>
              <button onClick={handleClear} className="btn btn-warning">
                Clear
              </button>
            </div>

            <div className="input-group">
              <input
                type="text"
                value={singleVertex}
                onChange={(e) => setSingleVertex(e.target.value)}
                placeholder="Vertex (e.g., A)"
                disabled={isRunning}
              />
              <button onClick={handleAddVertex} className="btn btn-primary">
                Add Vertex
              </button>
              <button onClick={handleRemoveVertex} className="btn btn-danger">
                Remove
              </button>
            </div>

            <div className="input-group">
              <input
                type="text"
                value={vertex1}
                onChange={(e) => setVertex1(e.target.value)}
                placeholder="From"
                disabled={isRunning}
              />
              <input
                type="text"
                value={vertex2}
                onChange={(e) => setVertex2(e.target.value)}
                placeholder="To"
                disabled={isRunning}
              />
              <input
                type="number"
                value={edgeWeight}
                onChange={(e) => setEdgeWeight(e.target.value)}
                placeholder="w"
                disabled={isRunning}
                style={{ width: '90px' }}
              />
              <button onClick={handleAddEdge} className="btn btn-primary">
                Add Edge
              </button>
              <button onClick={handleRemoveEdge} className="btn btn-danger">
                Remove Edge
              </button>
            </div>

            <div className="input-group">
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className={traversalAlgo === 'bfs' ? 'btn btn-primary' : 'btn btn-secondary'}
                  disabled={isRunning}
                  onClick={() => setTraversalAlgo('bfs')}
                >
                  BFS
                </button>
                <button
                  type="button"
                  className={traversalAlgo === 'dfs' ? 'btn btn-primary' : 'btn btn-secondary'}
                  disabled={isRunning}
                  onClick={() => setTraversalAlgo('dfs')}
                >
                  DFS
                </button>
                <button
                  type="button"
                  className={traversalAlgo === 'shortestPath' ? 'btn btn-primary' : 'btn btn-secondary'}
                  disabled={isRunning}
                  onClick={() => setTraversalAlgo('shortestPath')}
                >
                  Shortest Path
                </button>
                <button
                  type="button"
                  className={traversalAlgo === 'components' ? 'btn btn-primary' : 'btn btn-secondary'}
                  disabled={isRunning}
                  onClick={() => setTraversalAlgo('components')}
                >
                  Components
                </button>
                <button
                  type="button"
                  className={traversalAlgo === 'cycle' ? 'btn btn-primary' : 'btn btn-secondary'}
                  disabled={isRunning}
                  onClick={() => setTraversalAlgo('cycle')}
                >
                  Cycle?
                </button>
                <button
                  type="button"
                  className={traversalAlgo === 'bipartite' ? 'btn btn-primary' : 'btn btn-secondary'}
                  disabled={isRunning}
                  onClick={() => setTraversalAlgo('bipartite')}
                >
                  Bipartite?
                </button>
                <button
                  type="button"
                  className={traversalAlgo === 'dijkstra' ? 'btn btn-primary' : 'btn btn-secondary'}
                  disabled={isRunning}
                  onClick={() => setTraversalAlgo('dijkstra')}
                >
                  Dijkstra
                </button>
                <button
                  type="button"
                  className={traversalAlgo === 'prim' ? 'btn btn-primary' : 'btn btn-secondary'}
                  disabled={isRunning}
                  onClick={() => setTraversalAlgo('prim')}
                >
                  Prim MST
                </button>
                <button
                  type="button"
                  className={traversalAlgo === 'kruskal' ? 'btn btn-primary' : 'btn btn-secondary'}
                  disabled={isRunning}
                  onClick={() => setTraversalAlgo('kruskal')}
                >
                  Kruskal MST
                </button>
              </div>

              <label style={{ color: '#fff' }}>Speed: {speed}ms</label>
              <input
                type="range"
                min="100"
                max="2000"
                step="100"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
              />
            </div>

            <div className="button-group">
              <button onClick={handleStartTraversal} className="btn btn-secondary" disabled={isRunning}>
                Start
              </button>
              <button onClick={handlePlayPause} className="btn btn-secondary" disabled={!frames.length}>
                {isPlaying ? 'Pause' : 'Play'}
              </button>
              <button onClick={handlePrev} className="btn btn-secondary" disabled={!frames.length || stepIndex <= 0}>
                Prev
              </button>
              <button onClick={handleNext} className="btn btn-secondary" disabled={!frames.length || stepIndex >= frames.length - 1}>
                Next
              </button>
              <button onClick={handleRestart} className="btn btn-secondary" disabled={!frames.length}>
                Restart
              </button>
            </div>

            {frames.length ? (
              <div className="control-group">
                <label style={{ color: '#fff' }}>
                  Step: {stepIndex + 1} / {frames.length}
                </label>
                <input
                  type="range"
                  min="1"
                  max={frames.length}
                  value={stepIndex + 1}
                  onChange={(e) => handleStepTo(Number(e.target.value) - 1)}
                />
              </div>
            ) : null}

            {message && <div className="message">{message}</div>}
            <div className="info">
              <p>Vertices: {graph.nodes.length} | Edges: {graph.edges.length}</p>
            </div>
          </div>
        </div>

        <div className="explanation-panel">
          <div style={{ marginBottom: '12px' }}>
            <h2 style={{ margin: 0 }}>Traversal</h2>
            <div style={{ opacity: 0.9, fontSize: '14px' }}>
              <div>Algorithm: {traversalLabel}</div>
              <div>Visits: {metrics.visits} | Inspections: {metrics.inspections} | Enqueues: {metrics.enqueues}</div>
              <div>Step: {frames.length ? stepIndex + 1 : 0} / {frames.length || 0}</div>
              {traversalOrder.length ? (
                <div style={{ marginTop: '8px' }}>Order so far: {traversalOrder.join(' → ')}</div>
              ) : null}
              {stepDescription ? <div style={{ marginTop: '8px' }}>{stepDescription}</div> : null}
            </div>
          </div>

          <h2>Graph Data Structure</h2>
          <p>A collection of vertices (nodes) connected by edges.</p>
          
          <h3>Graph Traversals</h3>
          <ul>
            <li><strong>BFS (Breadth-First):</strong> Level by level exploration - O(V + E)</li>
            <li><strong>DFS (Depth-First):</strong> Deep exploration first - O(V + E)</li>
            <li><strong>Shortest Path (Unweighted):</strong> BFS-based path finding - O(V + E)</li>
            <li><strong>Connected Components:</strong> DFS across all nodes - O(V + E)</li>
            <li><strong>Cycle Detection (Undirected):</strong> DFS with parent tracking - O(V + E)</li>
            <li><strong>Bipartite Check:</strong> BFS 2-coloring - O(V + E)</li>
            <li><strong>Dijkstra (Weighted):</strong> Shortest path with non-negative weights - O((V + E) log V)</li>
            <li><strong>Prim MST (Weighted):</strong> Minimum spanning tree from a start node - O(VE) (simple impl)</li>
            <li><strong>Kruskal MST (Weighted):</strong> Minimum spanning tree via edge sorting - O(E log E)</li>
          </ul>

          <h3>Types</h3>
          <ul>
            <li><strong>Directed:</strong> Edges have direction</li>
            <li><strong>Undirected:</strong> Edges are bidirectional (current mode)</li>
            <li><strong>Weighted:</strong> Edges have weights/costs</li>
            <li><strong>Unweighted:</strong> All edges equal (current mode)</li>
          </ul>

          <h3>Applications</h3>
          <ul>
            <li>Social networks</li>
            <li>Maps and navigation</li>
            <li>Network routing</li>
            <li>Recommendation systems</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default GraphVisualizer;
