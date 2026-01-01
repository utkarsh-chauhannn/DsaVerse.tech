// Stack Data Structure
export class Stack {
  constructor() {
    this.items = [];
  }

  push(element) {
    this.items.push(element);
    return [...this.items];
  }

  pop() {
    if (this.isEmpty()) return null;
    this.items.pop();
    return [...this.items];
  }

  peek() {
    if (this.isEmpty()) return null;
    return this.items[this.items.length - 1];
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

  sort(compareFn) {
    const cmp = typeof compareFn === 'function' ? compareFn : (a, b) => a - b;
    this.items.sort(cmp);
    return [...this.items];
  }

  getItems() {
    return [...this.items];
  }
}

export const stackOperations = {
  push: (stack, value) => stack.push(value),
  pop: (stack) => stack.pop(),
  peek: (stack) => stack.peek(),
  clear: (stack) => stack.clear(),
};
