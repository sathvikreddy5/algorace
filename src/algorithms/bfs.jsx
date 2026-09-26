import { buildAdjacencyList } from "../utils/graphUtils";

export function bfs(graph, startNode, targetNode) {
  const adjacencyList = buildAdjacencyList(graph);

  const visited = new Set();
  const previous = {};

  const steps = [];
  const queue = [];

  graph.nodes.forEach((node) => {
    previous[node.id] = null;
  });

  // Initialize
  steps.push({
    type: "INITIALIZE",
    node: startNode,
  });

  queue.push(startNode);
  visited.add(startNode);

  while (queue.length > 0) {
    const currentNode = queue.shift();

    steps.push({
      type: "VISIT_NODE",
      node: currentNode,
    });

    if (currentNode === targetNode) {
      break;
    }

    for (const neighbor of adjacencyList[currentNode]) {
      if (visited.has(neighbor.node)) {
        continue;
      }

      steps.push({
        type: "CHECK_EDGE",
        from: currentNode,
        to: neighbor.node,
      });

      visited.add(neighbor.node);
      previous[neighbor.node] = currentNode;

      queue.push(neighbor.node);

      steps.push({
        type: "RELAX_EDGE",
        from: currentNode,
        to: neighbor.node,
      });
    }
  }

  // Reconstruct path
  const path = [];
  let current = targetNode;

  if (visited.has(targetNode) || targetNode === startNode) {
    while (current !== null) {
      path.unshift(current);
      current = previous[current];
    }
  }

  if (path.length > 0 && path[0] === startNode) {
    steps.push({
      type: "PATH_FOUND",
      path,
      distance: path.length - 1,
    });
  }

  return steps;
}
