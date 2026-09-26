import { buildAdjacencyList } from "../utils/graphUtils";

export function dijkstra(graph, startNode, targetNode) {
  const adjacencyList = buildAdjacencyList(graph);

  const distances = {};
  const previous = {};
  const visited = new Set();

  const steps = [];

  // Initialize
  graph.nodes.forEach((node) => {
    distances[node.id] = Infinity;
    previous[node.id] = null;
  });

  distances[startNode] = 0;

  steps.push({
    type: "INITIALIZE",
    node: startNode,
    distances: { ...distances },
  });

  while (visited.size < graph.nodes.length) {
    let currentNode = null;
    let smallestDistance = Infinity;

    // Find closest unvisited node
    for (const node of graph.nodes) {
      if (!visited.has(node.id) && distances[node.id] < smallestDistance) {
        smallestDistance = distances[node.id];
        currentNode = node.id;
      }
    }

    if (currentNode === null) {
      break;
    }

    visited.add(currentNode);

    steps.push({
      type: "VISIT_NODE",
      node: currentNode,
      distance: distances[currentNode],
    });

    if (currentNode === targetNode) {
      break;
    }

    // Relax edges
    for (const neighbor of adjacencyList[currentNode]) {
      if (visited.has(neighbor.node)) {
        continue;
      }

      const newDistance = distances[currentNode] + neighbor.weight;

      steps.push({
        type: "CHECK_EDGE",
        from: currentNode,
        to: neighbor.node,
        currentDistance: distances[neighbor.node],
        newDistance,
      });

      if (newDistance < distances[neighbor.node]) {
        const oldDistance = distances[neighbor.node];

        distances[neighbor.node] = newDistance;
        previous[neighbor.node] = currentNode;

        steps.push({
          type: "RELAX_EDGE",
          from: currentNode,
          to: neighbor.node,
          oldDistance,
          newDistance,
          distances: { ...distances },
        });
      }
    }
  }

  // Build final path
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
