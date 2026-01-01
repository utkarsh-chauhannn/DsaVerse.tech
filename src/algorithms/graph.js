// Graph Data Structure
export class Graph {
  constructor(directed = false) {
    this.adjacencyList = new Map();
    this.directed = directed;
  }

  static normalizeNeighbor(neighbor) {
    if (neighbor && typeof neighbor === 'object') {
      const to = neighbor.to;
      const weight = Number(neighbor.weight);
      return { to, weight: Number.isFinite(weight) ? weight : 1 };
    }
    return { to: neighbor, weight: 1 };
  }

  connectedComponentsSteps() {
    const steps = [];

    const snapshot = (highlightedNodes, type, description) => {
      steps.push({
        highlightedNodes: Array.isArray(highlightedNodes) ? highlightedNodes : [],
        type,
        description
      });
    };

    const nodes = Array.from(this.adjacencyList.keys());
    if (!nodes.length) return [];

    snapshot([], 'init', 'Finding connected components');

    const visited = new Set();
    let componentIndex = 0;

    const dfs = (start) => {
      const stack = [start];
      visited.add(start);
      snapshot([start], 'visit', `Start component ${componentIndex + 1} at ${start}`);

      while (stack.length) {
        const v = stack.pop();
        snapshot([v], 'visit', `Visit ${v}`);

        const neighbors = this.adjacencyList.get(v) || [];
        for (const n of neighbors) {
          snapshot([v, n], 'inspect', `Inspect edge ${v} → ${n}`);
          if (!visited.has(n)) {
            visited.add(n);
            stack.push(n);
            snapshot([n], 'push', `Add ${n} to stack`);
          }
        }
      }
    };

    for (const node of nodes) {
      if (visited.has(node)) continue;
      dfs(node);
      componentIndex += 1;
      snapshot([], 'component', `Component ${componentIndex} complete`);
    }

    snapshot([], 'done', `Found ${componentIndex} component(s)`);
    return steps;
  }

  hasCycleUndirectedSteps() {
    const steps = [];
    const snapshot = (highlightedNodes, type, description) => {
      steps.push({
        highlightedNodes: Array.isArray(highlightedNodes) ? highlightedNodes : [],
        type,
        description
      });
    };

    const nodes = Array.from(this.adjacencyList.keys());
    if (!nodes.length) return [];

    snapshot([], 'init', 'Cycle detection (undirected)');

    const visited = new Set();
    let cycleFound = false;

    const dfs = (start) => {
      const stack = [[start, null]];
      visited.add(start);
      snapshot([start], 'visit', `Start DFS at ${start}`);

      while (stack.length) {
        const [v, parent] = stack.pop();
        snapshot([v], 'visit', `Visit ${v}`);
        const neighbors = this.adjacencyList.get(v) || [];
        for (const n of neighbors) {
          snapshot([v, n], 'inspect', `Inspect edge ${v} → ${n}`);
          if (!visited.has(n)) {
            visited.add(n);
            stack.push([n, v]);
            snapshot([n], 'push', `Traverse to ${n}`);
          } else if (n !== parent) {
            snapshot([v, n], 'cycle', `Cycle found via ${v} ↔ ${n}`);
            cycleFound = true;
            return;
          }
        }
      }
    };

    for (const node of nodes) {
      if (visited.has(node)) continue;
      dfs(node);
      if (cycleFound) break;
    }

    snapshot([], 'done', cycleFound ? 'Graph has a cycle' : 'No cycle detected');
    return steps;
  }

  isBipartiteSteps() {
    const steps = [];
    const snapshot = (highlightedNodes, type, description) => {
      steps.push({
        highlightedNodes: Array.isArray(highlightedNodes) ? highlightedNodes : [],
        type,
        description
      });
    };

    const nodes = Array.from(this.adjacencyList.keys());
    if (!nodes.length) return [];

    snapshot([], 'init', 'Bipartite check (2-coloring)');

    const color = new Map(); // node -> 0|1
    let ok = true;

    for (const start of nodes) {
      if (color.has(start)) continue;
      const queue = [start];
      color.set(start, 0);
      snapshot([start], 'visit', `Color ${start} = 0`);

      while (queue.length && ok) {
        const v = queue.shift();
        snapshot([v], 'dequeue', `Dequeue ${v}`);

        const neighbors = this.adjacencyList.get(v) || [];
        for (const n of neighbors) {
          snapshot([v, n], 'inspect', `Inspect edge ${v} → ${n}`);
          if (!color.has(n)) {
            color.set(n, 1 - color.get(v));
            queue.push(n);
            snapshot([n], 'enqueue', `Color ${n} = ${color.get(n)} and enqueue`);
          } else if (color.get(n) === color.get(v)) {
            ok = false;
            snapshot([v, n], 'conflict', `Conflict: ${v} and ${n} have same color`);
            break;
          }
        }
      }

      if (!ok) break;
    }

    snapshot([], 'done', ok ? 'Graph is bipartite' : 'Graph is not bipartite');
    return steps;
  }

  shortestPathSteps(start, target) {
    if (!this.adjacencyList.has(start) || !this.adjacencyList.has(target)) return [];

    const steps = [];
    const visited = new Set();
    const parent = new Map();
    const queue = [start];

    const snapshot = (highlightedNodes, type, description) => {
      steps.push({
        highlightedNodes: Array.isArray(highlightedNodes) ? highlightedNodes : [],
        type,
        description
      });
    };

    visited.add(start);
    parent.set(start, null);
    snapshot([start], 'init', `Find shortest path from ${start} to ${target}`);
    snapshot([start], 'enqueue', `Enqueue ${start}`);

    let found = false;

    while (queue.length > 0) {
      const vertex = queue.shift();
      snapshot([vertex], 'dequeue', `Dequeue ${vertex}`);
      snapshot([vertex], 'visit', `Visit ${vertex}`);

      if (vertex === target) {
        found = true;
        break;
      }

      const neighbors = this.adjacencyList.get(vertex) || [];
      for (const neighbor of neighbors) {
        snapshot([vertex, neighbor], 'inspect', `Inspect edge ${vertex} → ${neighbor}`);
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          parent.set(neighbor, vertex);
          queue.push(neighbor);
          snapshot([neighbor], 'enqueue', `Enqueue ${neighbor}`);
        }
      }
    }

    if (!found) {
      snapshot([], 'done', `No path found from ${start} to ${target}`);
      return steps;
    }

    const path = [];
    let cur = target;
    while (cur != null) {
      path.push(cur);
      cur = parent.get(cur) ?? null;
    }
    path.reverse();

    snapshot(path, 'path', `Shortest path: ${path.join(' → ')}`);
    snapshot([], 'done', 'Shortest path complete');
    return steps;
  }

  bfsSteps(start) {
    if (!this.adjacencyList.has(start)) return [];

    const steps = [];
    const visited = new Set();
    const queue = [start];

    const snapshot = (highlightedNodes, type, description) => {
      steps.push({
        highlightedNodes: Array.isArray(highlightedNodes) ? highlightedNodes : [],
        type,
        description
      });
    };

    visited.add(start);
    snapshot([start], 'init', `Starting BFS from ${start}`);
    snapshot([start], 'enqueue', `Enqueue ${start}`);

    while (queue.length > 0) {
      const vertex = queue.shift();
      snapshot([vertex], 'dequeue', `Dequeue ${vertex}`);
      snapshot([vertex], 'visit', `Visit ${vertex}`);

      const neighbors = this.adjacencyList.get(vertex) || [];
      for (const raw of neighbors) {
        const { to: neighbor } = Graph.normalizeNeighbor(raw);
        snapshot([vertex, neighbor], 'inspect', `Inspect edge ${vertex} → ${neighbor}`);
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
          snapshot([neighbor], 'enqueue', `Enqueue ${neighbor}`);
        }
      }
    }

    snapshot([], 'done', 'BFS complete');
    return steps;
  }

  dfsSteps(start) {
    if (!this.adjacencyList.has(start)) return [];

    const steps = [];
    const visited = new Set();

    const snapshot = (highlightedNodes, type, description) => {
      steps.push({
        highlightedNodes: Array.isArray(highlightedNodes) ? highlightedNodes : [],
        type,
        description
      });
    };

    snapshot([start], 'init', `Starting DFS from ${start}`);

    const dfsHelper = (vertex) => {
      visited.add(vertex);
      snapshot([vertex], 'visit', `Visit ${vertex}`);

      const neighbors = this.adjacencyList.get(vertex) || [];
      for (const raw of neighbors) {
        const { to: neighbor } = Graph.normalizeNeighbor(raw);
        snapshot([vertex, neighbor], 'inspect', `Inspect edge ${vertex} → ${neighbor}`);
        if (!visited.has(neighbor)) {
          snapshot([neighbor], 'push', `Traverse to ${neighbor}`);
          dfsHelper(neighbor);
          snapshot([vertex], 'backtrack', `Backtrack to ${vertex}`);
        }
      }
    };

    dfsHelper(start);
    snapshot([], 'done', 'DFS complete');
    return steps;
  }

  addVertex(vertex) {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, []);
    }
    return this.serialize();
  }

  addEdge(vertex1, vertex2, weight = 1) {
    if (!this.adjacencyList.has(vertex1)) {
      this.addVertex(vertex1);
    }
    if (!this.adjacencyList.has(vertex2)) {
      this.addVertex(vertex2);
    }

    const w = Number(weight);
    const safeWeight = Number.isFinite(w) ? w : 1;

    this.adjacencyList.get(vertex1).push({ to: vertex2, weight: safeWeight });

    if (!this.directed) {
      this.adjacencyList.get(vertex2).push({ to: vertex1, weight: safeWeight });
    }
    
    return this.serialize();
  }

  removeEdge(vertex1, vertex2) {
    if (this.adjacencyList.has(vertex1)) {
      this.adjacencyList.set(
        vertex1,
        this.adjacencyList.get(vertex1).filter((raw) => Graph.normalizeNeighbor(raw).to !== vertex2)
      );
    }
    
    if (!this.directed && this.adjacencyList.has(vertex2)) {
      this.adjacencyList.set(
        vertex2,
        this.adjacencyList.get(vertex2).filter((raw) => Graph.normalizeNeighbor(raw).to !== vertex1)
      );
    }
    
    return this.serialize();
  }

  removeVertex(vertex) {
    if (!this.adjacencyList.has(vertex)) return this.serialize();
    
    // Remove all edges connected to this vertex
    for (const raw of this.adjacencyList.get(vertex)) {
      const { to } = Graph.normalizeNeighbor(raw);
      this.removeEdge(vertex, to);
    }
    
    // Remove the vertex
    this.adjacencyList.delete(vertex);
    
    return this.serialize();
  }

  bfs(start) {
    if (!this.adjacencyList.has(start)) return [];
    
    const visited = new Set();
    const queue = [start];
    const result = [];
    
    visited.add(start);
    
    while (queue.length > 0) {
      const vertex = queue.shift();
      result.push(vertex);
      
      for (const raw of this.adjacencyList.get(vertex)) {
        const { to: neighbor } = Graph.normalizeNeighbor(raw);
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
    
    return result;
  }

  dfs(start) {
    if (!this.adjacencyList.has(start)) return [];
    
    const visited = new Set();
    const result = [];
    
    const dfsHelper = (vertex) => {
      visited.add(vertex);
      result.push(vertex);
      
      for (const raw of this.adjacencyList.get(vertex)) {
        const { to: neighbor } = Graph.normalizeNeighbor(raw);
        if (!visited.has(neighbor)) {
          dfsHelper(neighbor);
        }
      }
    };
    
    dfsHelper(start);
    return result;
  }

  serialize() {
    const nodes = Array.from(this.adjacencyList.keys());
    const edges = [];
    
    for (let [vertex, neighbors] of this.adjacencyList) {
      for (const raw of neighbors) {
        const { to: neighbor, weight } = Graph.normalizeNeighbor(raw);
        if (this.directed || String(vertex) < String(neighbor)) {
          edges.push({ from: vertex, to: neighbor, weight });
        }
      }
    }
    
    return { nodes, edges };
  }

  clear() {
    this.adjacencyList.clear();
    return this.serialize();
  }

  dijkstraSteps(start, target) {
    if (!this.adjacencyList.has(start) || !this.adjacencyList.has(target)) return [];

    const steps = [];
    const snapshot = (highlightedNodes, type, description) => {
      steps.push({
        highlightedNodes: Array.isArray(highlightedNodes) ? highlightedNodes : [],
        type,
        description
      });
    };

    const dist = new Map();
    const prev = new Map();
    const visited = new Set();

    for (const node of this.adjacencyList.keys()) {
      dist.set(node, Infinity);
      prev.set(node, null);
    }
    dist.set(start, 0);

    snapshot([start], 'init', `Dijkstra from ${start} to ${target}`);

    const pq = [{ node: start, d: 0 }];

    while (pq.length) {
      // extract min
      pq.sort((a, b) => a.d - b.d);
      const { node: u, d } = pq.shift();
      if (visited.has(u)) continue;
      visited.add(u);

      snapshot([u], 'visit', `Visit ${u} with distance ${d}`);

      if (u === target) break;

      const neighbors = this.adjacencyList.get(u) || [];
      for (const raw of neighbors) {
        const { to: v, weight: w } = Graph.normalizeNeighbor(raw);
        snapshot([u, v], 'inspect', `Inspect edge ${u} → ${v} (w=${w})`);

        if (visited.has(v)) continue;

        const alt = dist.get(u) + w;
        if (alt < dist.get(v)) {
          dist.set(v, alt);
          prev.set(v, u);
          pq.push({ node: v, d: alt });
          snapshot([v], 'relax', `Relax ${v}: dist = ${alt} via ${u}`);
        }
      }
    }

    if (!Number.isFinite(dist.get(target)) || dist.get(target) === Infinity) {
      snapshot([], 'done', 'No path found');
      return steps;
    }

    const path = [];
    let cur = target;
    while (cur != null) {
      path.push(cur);
      cur = prev.get(cur);
    }
    path.reverse();
    snapshot(path, 'path', `Shortest weighted path: ${path.join(' → ')} (dist=${dist.get(target)})`);
    snapshot([], 'done', 'Dijkstra complete');
    return steps;
  }

  primMSTSteps(start) {
    if (!this.adjacencyList.has(start)) return [];

    const steps = [];
    const snapshot = (highlightedNodes, type, description) => {
      steps.push({
        highlightedNodes: Array.isArray(highlightedNodes) ? highlightedNodes : [],
        type,
        description
      });
    };

    const nodes = Array.from(this.adjacencyList.keys());
    if (!nodes.length) return [];

    const inMST = new Set([start]);
    snapshot([start], 'init', `Prim MST starting at ${start}`);

    let total = 0;

    while (inMST.size < nodes.length) {
      let best = null; // {from,to,w}
      for (const u of inMST) {
        const neighbors = this.adjacencyList.get(u) || [];
        for (const raw of neighbors) {
          const { to: v, weight: w } = Graph.normalizeNeighbor(raw);
          if (inMST.has(v)) continue;
          snapshot([u, v], 'inspect', `Consider edge ${u} → ${v} (w=${w})`);
          if (!best || w < best.w) best = { from: u, to: v, w };
        }
      }

      if (!best) {
        snapshot([], 'done', 'Graph is disconnected; MST not possible from this start');
        return steps;
      }

      inMST.add(best.to);
      total += best.w;
      snapshot([best.from, best.to], 'add', `Add edge ${best.from} — ${best.to} (w=${best.w}), total=${total}`);
    }

    snapshot([], 'done', `Prim MST complete (total=${total})`);
    return steps;
  }

  kruskalMSTSteps() {
    const steps = [];
    const snapshot = (highlightedNodes, type, description) => {
      steps.push({
        highlightedNodes: Array.isArray(highlightedNodes) ? highlightedNodes : [],
        type,
        description
      });
    };

    const nodes = Array.from(this.adjacencyList.keys());
    if (!nodes.length) return [];

    snapshot([], 'init', 'Kruskal MST');

    const edges = this.serialize().edges
      .map((e) => ({ from: e.from, to: e.to, w: Number.isFinite(Number(e.weight)) ? Number(e.weight) : 1 }))
      .sort((a, b) => a.w - b.w);

    const parent = new Map();
    const rank = new Map();
    for (const n of nodes) {
      parent.set(n, n);
      rank.set(n, 0);
    }

    const find = (x) => {
      let p = parent.get(x);
      if (p !== x) {
        p = find(p);
        parent.set(x, p);
      }
      return parent.get(x);
    };

    const union = (a, b) => {
      const ra = find(a);
      const rb = find(b);
      if (ra === rb) return false;
      const rka = rank.get(ra);
      const rkb = rank.get(rb);
      if (rka < rkb) parent.set(ra, rb);
      else if (rka > rkb) parent.set(rb, ra);
      else {
        parent.set(rb, ra);
        rank.set(ra, rka + 1);
      }
      return true;
    };

    let total = 0;
    let used = 0;

    for (const e of edges) {
      snapshot([e.from, e.to], 'inspect', `Inspect edge ${e.from} — ${e.to} (w=${e.w})`);
      if (union(e.from, e.to)) {
        total += e.w;
        used += 1;
        snapshot([e.from, e.to], 'add', `Add edge ${e.from} — ${e.to} (w=${e.w}), total=${total}`);
        if (used >= nodes.length - 1) break;
      } else {
        snapshot([e.from, e.to], 'skip', `Skip edge ${e.from} — ${e.to} (would form cycle)`);
      }
    }

    if (used !== nodes.length - 1) {
      snapshot([], 'done', 'Graph is disconnected; MST not possible');
      return steps;
    }

    snapshot([], 'done', `Kruskal MST complete (total=${total})`);
    return steps;
  }
}
