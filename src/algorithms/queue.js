// Queue Data Structure
export class Queue {
  constructor() {
    this.items = [];
  }

  enqueue(element) {
    this.items.push(element);
    return [...this.items];
  }

  dequeue() {
    if (this.isEmpty()) return null;
    this.items.shift();
    return [...this.items];
  }

  front() {
    if (this.isEmpty()) return null;
    return this.items[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  clear() {
    this.items = [];
    return [...this.items];
  }

  reverse() {
    this.items.reverse();
    return [...this.items];
  }

  getItems() {
    return [...this.items];
  }
}

export const queueOperations = {
  enqueue: (queue, value) => queue.enqueue(value),
  dequeue: (queue) => queue.dequeue(),
  front: (queue) => queue.front(),
  clear: (queue) => queue.clear(),
};
