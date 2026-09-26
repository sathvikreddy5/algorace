import { buildAdjacencyList } from "../utils/graphUtils";

export function astar(graph, startNode, targetNode) {
  const adjacencyList = buildAdjacencyList(graph);

  const distances = {};
  const previous = {};
  const closedSet = new Set();

  const steps = [];

  // Initialize distances and previous nodes
  graph.nodes.forEach((node) => {
    distances[node.id] = Infinity;
    previous[node.id] = null;
  });

  distances[startNode] = 0;

  const minHeap = new MinHeap();

  minHeap.push({
    node: startNode,
    g: 0,
    f: heuristic(graph, startNode, targetNode),
  });

  steps.push({
    type: "INITIALIZE",
    node: startNode,
    distances: { ...distances },
  });

  while (!minHeap.isEmpty()) {
    const current = minHeap.pop();

    const currentNode = current.node;

    // Ignore nodes that were already finalized
    if (closedSet.has(currentNode)) {
      continue;
    }

    closedSet.add(currentNode);

    steps.push({
      type: "VISIT_NODE",
      node: currentNode,
      distance: distances[currentNode],
    });

    // Target reached
    if (currentNode === targetNode) {
      break;
    }

    for (const neighbor of adjacencyList[currentNode]) {
      if (closedSet.has(neighbor.node)) {
        continue;
      }

      const tentativeDistance = distances[currentNode] + neighbor.weight;

      steps.push({
        type: "CHECK_EDGE",
        from: currentNode,
        to: neighbor.node,
        currentDistance: distances[neighbor.node],
        newDistance: tentativeDistance,
      });

      if (tentativeDistance < distances[neighbor.node]) {
        const oldDistance = distances[neighbor.node];

        distances[neighbor.node] = tentativeDistance;

        previous[neighbor.node] = currentNode;

        const estimatedTotal =
          tentativeDistance + heuristic(graph, neighbor.node, targetNode);

        minHeap.push({
          node: neighbor.node,
          g: tentativeDistance,
          f: estimatedTotal,
        });

        steps.push({
          type: "RELAX_EDGE",
          from: currentNode,
          to: neighbor.node,
          oldDistance,
          newDistance: tentativeDistance,
          distances: { ...distances },
        });
      }
    }
  }

  // Reconstruct shortest path
  const path = [];

  let current = targetNode;

  if (previous[current] !== null || current === startNode) {
    while (current !== null) {
      path.unshift(current);
      current = previous[current];
    }
  }

  if (path.length > 0 && path[0] === startNode) {
    steps.push({
      type: "PATH_FOUND",
      path,
      distance: distances[targetNode],
    });
  }

  return steps;
}

/*
 * Euclidean distance between two graph nodes.
 *
 * This assumes the graph coordinates represent
 * meaningful spatial positions.
 */
function heuristic(graph, nodeId, targetId) {
  const node = graph.nodes.find((item) => item.id === nodeId);

  const target = graph.nodes.find((item) => item.id === targetId);

  if (!node || !target) {
    return 0;
  }

  const dx = Math.abs(node.x - target.x);
  const dy = Math.abs(node.y - target.y);

  /*
   * Scale the geometric distance so that the
   * heuristic remains conservative relative
   * to the graph's edge weights.
   */
  return (dx + dy) / 100;
}

/*
 * Min-Heap
 *
 * The node with the smallest f-score
 * stays at the top.
 */
class MinHeap {
  constructor() {
    this.heap = [];
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  push(item) {
    this.heap.push(item);
    this.bubbleUp();
  }

  pop() {
    if (this.heap.length === 0) {
      return null;
    }

    if (this.heap.length === 1) {
      return this.heap.pop();
    }

    const root = this.heap[0];

    this.heap[0] = this.heap.pop();

    this.bubbleDown();

    return root;
  }

  bubbleUp() {
    let index = this.heap.length - 1;

    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);

      if (this.heap[parentIndex].f <= this.heap[index].f) {
        break;
      }

      this.swap(index, parentIndex);

      index = parentIndex;
    }
  }

  bubbleDown() {
    let index = 0;

    while (true) {
      const leftIndex = index * 2 + 1;

      const rightIndex = index * 2 + 2;

      let smallestIndex = index;

      if (
        leftIndex < this.heap.length &&
        this.heap[leftIndex].f < this.heap[smallestIndex].f
      ) {
        smallestIndex = leftIndex;
      }

      if (
        rightIndex < this.heap.length &&
        this.heap[rightIndex].f < this.heap[smallestIndex].f
      ) {
        smallestIndex = rightIndex;
      }

      if (smallestIndex === index) {
        break;
      }

      this.swap(index, smallestIndex);

      index = smallestIndex;
    }
  }

  swap(first, second) {
    [this.heap[first], this.heap[second]] = [
      this.heap[second],
      this.heap[first],
    ];
  }
}
