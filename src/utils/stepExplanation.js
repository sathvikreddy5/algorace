export function getStepExplanation(step, algorithm = "dijkstra") {
  if (!step) {
    return {
      title: "Ready to execute",
      description:
        "Run the algorithm to see each operation explained step-by-step.",
      detail: null,
    };
  }

  if (algorithm === "bfs") {
    return getBfsExplanation(step);
  }

  if (algorithm === "astar") {
    return getAstarExplanation(step);
  }

  return getDijkstraExplanation(step);
}

/* =========================
   DIJKSTRA
========================= */

function getDijkstraExplanation(step) {
  switch (step.type) {
    case "INITIALIZE":
      return {
        title: "Initialize Dijkstra",
        description:
          "All nodes begin with an infinite distance except the starting node.",
        detail: `Starting node ${step.node} has distance 0.`,
      };

    case "VISIT_NODE":
      return {
        title: `Visiting node ${step.node}`,
        description:
          "Dijkstra selects the unvisited node with the smallest known distance.",
        detail: `Current shortest distance: ${formatDistance(step.distance)}.`,
      };

    case "CHECK_EDGE":
      return {
        title: `Checking edge ${step.from} → ${step.to}`,
        description:
          "The algorithm checks whether reaching the neighboring node through the current node creates a shorter path.",
        detail: `Current: ${formatDistance(
          step.currentDistance,
        )} · New: ${formatDistance(step.newDistance)}`,
      };

    case "RELAX_EDGE":
      return {
        title: `Relaxing edge ${step.from} → ${step.to}`,
        description:
          "A shorter route was discovered, so the neighbor's distance is updated.",
        detail: `Distance updated from ${formatDistance(
          step.oldDistance,
        )} to ${formatDistance(step.newDistance)}.`,
      };

    case "PATH_FOUND":
      return {
        title: "Shortest path found",
        description:
          "Dijkstra reached the target and reconstructed the shortest path.",
        detail: `${step.path.join(" → ")} · Total distance: ${step.distance}`,
      };

    default:
      return {
        title: "Processing step",
        description: "Dijkstra is processing the graph.",
        detail: null,
      };
  }
}

/* =========================
   BFS
========================= */

function getBfsExplanation(step) {
  switch (step.type) {
    case "INITIALIZE":
      return {
        title: "Initialize BFS",
        description:
          "BFS starts from the source node and places it into the queue.",
        detail: `Starting node: ${step.node}.`,
      };

    case "VISIT_NODE":
      return {
        title: `Visiting node ${step.node}`,
        description:
          "BFS removes the next node from the queue and explores its neighbors.",
        detail: `Processing node ${step.node}.`,
      };

    case "CHECK_EDGE":
      return {
        title: `Checking edge ${step.from} → ${step.to}`,
        description:
          "BFS examines whether this neighboring node has already been discovered.",
        detail: `Exploring neighbor ${step.to} from ${step.from}.`,
      };

    case "RELAX_EDGE":
      return {
        title: `Discovering node ${step.to}`,
        description:
          "The node has not been visited, so BFS marks it discovered and adds it to the queue.",
        detail: `Parent of ${step.to}: ${step.from}.`,
      };

    case "PATH_FOUND":
      return {
        title: "Shortest path found",
        description:
          "BFS reached the target and reconstructed the path with the minimum number of edges.",
        detail: `${step.path.join(" → ")} · ${step.distance} edges`,
      };

    default:
      return {
        title: "Processing step",
        description: "BFS is processing the graph.",
        detail: null,
      };
  }
}

function getAstarExplanation(step) {
  switch (step.type) {
    case "INITIALIZE":
      return {
        title: "Initialize A*",
        description:
          "A* starts from the source and uses both path cost and an estimated distance to the target.",
        detail: `Starting node: ${step.node}.`,
      };

    case "VISIT_NODE":
      return {
        title: `Exploring node ${step.node}`,
        description:
          "A* selects the most promising node based on the path cost and heuristic estimate.",
        detail: `Current path distance: ${formatDistance(step.distance)}.`,
      };

    case "CHECK_EDGE":
      return {
        title: `Checking edge ${step.from} → ${step.to}`,
        description:
          "A* evaluates whether reaching the neighbor through the current node creates a better path.",
        detail: `Current: ${formatDistance(
          step.currentDistance,
        )} · New: ${formatDistance(step.newDistance)}`,
      };

    case "RELAX_EDGE":
      return {
        title: `Improving path to ${step.to}`,
        description:
          "A shorter path was discovered, so A* updates the node's best known route.",
        detail: `Distance updated from ${formatDistance(
          step.oldDistance,
        )} to ${formatDistance(step.newDistance)}.`,
      };

    case "PATH_FOUND":
      return {
        title: "Shortest path found",
        description:
          "A* reached the target and reconstructed the shortest path.",
        detail: `${step.path.join(" → ")} · Total distance: ${step.distance}`,
      };

    default:
      return {
        title: "Processing step",
        description: "A* is processing the graph.",
        detail: null,
      };
  }
}

/* =========================
   HELPERS
========================= */

function formatDistance(distance) {
  if (distance === Infinity) {
    return "∞";
  }

  return distance;
}
