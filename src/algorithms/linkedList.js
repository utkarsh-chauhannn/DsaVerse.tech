// Linked List Data Structure
export class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

export class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
    // Visualization-safe cycle simulation: tail points to index (not a real pointer cycle in nodes)
    this._cycleToIndex = null;
  }

  append(value) {
    const newNode = new Node(value);
    
    if (!this.head) {
      this.head = newNode;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = newNode;
    }
    this.size++;
    return this.toArray();
  }

  prepend(value) {
    const newNode = new Node(value);
    newNode.next = this.head;
    this.head = newNode;
    this.size++;
    return this.toArray();
  }

  delete(value) {
    if (!this.head) return this.toArray();
    
    if (this.head.value === value) {
      this.head = this.head.next;
      this.size--;
      return this.toArray();
    }
    
    let current = this.head;
    while (current.next) {
      if (current.next.value === value) {
        current.next = current.next.next;
        this.size--;
        break;
      }
      current = current.next;
    }
    return this.toArray();
  }

  search(value) {
    let current = this.head;
    let index = 0;
    
    while (current) {
      if (current.value === value) {
        return index;
      }
      current = current.next;
      index++;
    }
    return -1;
  }

  toArray() {
    const arr = [];
    let current = this.head;
    while (current) {
      arr.push(current.value);
      current = current.next;
    }
    return arr;
  }

  reverse() {
    let prev = null;
    let current = this.head;

    while (current) {
      const next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    }

    this.head = prev;
    return this.toArray();
  }

  findMiddle() {
    let slow = this.head;
    let fast = this.head;

    while (fast && fast.next) {
      slow = slow.next;
      fast = fast.next.next;
    }

    return slow ? slow.value : null;
  }

  clear() {
    this.head = null;
    this.size = 0;
    this._cycleToIndex = null;
    return [];
  }

  createTailCycleToIndex(index) {
    const idx = Number(index);
    if (!Number.isInteger(idx) || idx < 0 || idx >= this.size || this.size < 2) {
      this._cycleToIndex = null;
      return { ok: false, cycleToIndex: null };
    }
    this._cycleToIndex = idx;
    return { ok: true, cycleToIndex: idx };
  }

  removeCycle() {
    this._cycleToIndex = null;
    return { ok: true };
  }

  getCycleToIndex() {
    return this._cycleToIndex;
  }

  // Simulate next pointer by index (tail may jump to cycleToIndex)
  _nextIndex(i) {
    if (i == null) return null;
    if (i < 0 || i >= this.size) return null;
    if (i === this.size - 1) {
      return this._cycleToIndex != null ? this._cycleToIndex : null;
    }
    return i + 1;
  }

  detectCycleFloydSteps(maxSteps = 50) {
    // returns steps: { slow, fast, type, description }
    const steps = [];
    if (this.size === 0) return steps;

    let slow = 0;
    let fast = 0;
    steps.push({ slow, fast, type: 'init', description: 'Start Floyd cycle detection' });

    for (let t = 0; t < maxSteps; t++) {
      slow = this._nextIndex(slow);
      fast = this._nextIndex(this._nextIndex(fast));

      steps.push({ slow, fast, type: 'move', description: `Move slow to ${slow}, fast to ${fast}` });

      if (slow == null || fast == null) {
        steps.push({ slow, fast, type: 'done', description: 'No cycle detected' });
        return steps;
      }

      if (slow === fast) {
        steps.push({ slow, fast, type: 'meet', description: `Pointers meet at index ${slow} (cycle detected)` });
        steps.push({ slow, fast, type: 'done', description: 'Cycle detected' });
        return steps;
      }
    }

    steps.push({ slow, fast, type: 'done', description: 'Stopped early (max steps reached)' });
    return steps;
  }
}
