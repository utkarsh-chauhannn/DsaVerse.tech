// Binary Tree Data Structure
export class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

export class BinaryTree {
  constructor() {
    this.root = null;
  }

  findMinBST() {
    let cur = this.root;
    if (!cur) return null;
    while (cur.left) cur = cur.left;
    return cur.value;
  }

  findMaxBST() {
    let cur = this.root;
    if (!cur) return null;
    while (cur.right) cur = cur.right;
    return cur.value;
  }

  height() {
    const h = (node) => {
      if (!node) return 0;
      return 1 + Math.max(h(node.left), h(node.right));
    };
    return h(this.root);
  }

  insert(value) {
    const newNode = new TreeNode(value);
    
    if (!this.root) {
      this.root = newNode;
      return this.serialize();
    }
    
    const queue = [this.root];
    while (queue.length > 0) {
      const current = queue.shift();
      
      if (!current.left) {
        current.left = newNode;
        break;
      } else {
        queue.push(current.left);
      }
      
      if (!current.right) {
        current.right = newNode;
        break;
      } else {
        queue.push(current.right);
      }
    }
    
    return this.serialize();
  }

  insertBST(value) {
    const newNode = new TreeNode(value);
    
    if (!this.root) {
      this.root = newNode;
      return this.serialize();
    }
    
    const insertNode = (node, newNode) => {
      if (newNode.value < node.value) {
        if (!node.left) {
          node.left = newNode;
        } else {
          insertNode(node.left, newNode);
        }
      } else {
        if (!node.right) {
          node.right = newNode;
        } else {
          insertNode(node.right, newNode);
        }
      }
    };
    
    insertNode(this.root, newNode);
    return this.serialize();
  }

  deleteBST(value) {
    const deleteNode = (node, val) => {
      if (!node) return null;
      if (val < node.value) {
        node.left = deleteNode(node.left, val);
        return node;
      }
      if (val > node.value) {
        node.right = deleteNode(node.right, val);
        return node;
      }

      // node.value === val
      if (!node.left && !node.right) return null;
      if (!node.left) return node.right;
      if (!node.right) return node.left;

      // two children: replace with inorder successor
      let succParent = node;
      let succ = node.right;
      while (succ.left) {
        succParent = succ;
        succ = succ.left;
      }
      node.value = succ.value;
      if (succParent === node) succParent.right = succ.right;
      else succParent.left = succ.right;
      return node;
    };

    this.root = deleteNode(this.root, value);
    return this.serialize();
  }

  insertAVL(value) {
    const height = (node) => (node ? node._height || 1 : 0);
    const updateHeight = (node) => {
      node._height = 1 + Math.max(height(node.left), height(node.right));
    };
    const balanceFactor = (node) => height(node.left) - height(node.right);

    const rotateRight = (y) => {
      const x = y.left;
      const t2 = x.right;
      x.right = y;
      y.left = t2;
      updateHeight(y);
      updateHeight(x);
      return x;
    };

    const rotateLeft = (x) => {
      const y = x.right;
      const t2 = y.left;
      y.left = x;
      x.right = t2;
      updateHeight(x);
      updateHeight(y);
      return y;
    };

    const insertNode = (node, val) => {
      if (!node) {
        const n = new TreeNode(val);
        n._height = 1;
        return n;
      }
      if (val < node.value) node.left = insertNode(node.left, val);
      else node.right = insertNode(node.right, val);

      updateHeight(node);
      const bf = balanceFactor(node);

      // Left Left
      if (bf > 1 && val < node.left.value) return rotateRight(node);
      // Right Right
      if (bf < -1 && val > node.right.value) return rotateLeft(node);
      // Left Right
      if (bf > 1 && val > node.left.value) {
        node.left = rotateLeft(node.left);
        return rotateRight(node);
      }
      // Right Left
      if (bf < -1 && val < node.right.value) {
        node.right = rotateRight(node.right);
        return rotateLeft(node);
      }

      return node;
    };

    this.root = insertNode(this.root, value);
    return this.serialize();
  }

  inorderTraversal() {
    const result = [];
    const traverse = (node) => {
      if (node) {
        traverse(node.left);
        result.push(node.value);
        traverse(node.right);
      }
    };
    traverse(this.root);
    return result;
  }

  preorderTraversal() {
    const result = [];
    const traverse = (node) => {
      if (node) {
        result.push(node.value);
        traverse(node.left);
        traverse(node.right);
      }
    };
    traverse(this.root);
    return result;
  }

  postorderTraversal() {
    const result = [];
    const traverse = (node) => {
      if (node) {
        traverse(node.left);
        traverse(node.right);
        result.push(node.value);
      }
    };
    traverse(this.root);
    return result;
  }

  levelOrderTraversal() {
    if (!this.root) return [];
    
    const result = [];
    const queue = [this.root];
    
    while (queue.length > 0) {
      const current = queue.shift();
      result.push(current.value);
      
      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }
    
    return result;
  }

  serialize() {
    if (!this.root) return [];
    
    const result = [];
    const queue = [this.root];
    
    while (queue.length > 0) {
      const current = queue.shift();
      
      if (current) {
        result.push(current.value);
        queue.push(current.left);
        queue.push(current.right);
      } else {
        result.push(null);
      }
    }
    
    // Remove trailing nulls
    while (result[result.length - 1] === null) {
      result.pop();
    }
    
    return result;
  }

  clear() {
    this.root = null;
    return [];
  }
}
