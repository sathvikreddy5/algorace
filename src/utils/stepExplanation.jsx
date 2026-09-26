export function getStepExplanation(step) {
  if (!step) {
    return {
      title: "Ready to execute",
      description:
        "Run the algorithm to see each operation explained step-by-step.",
      detail: null,
    };
  }

  switch (step.type) {
    case "INITIALIZE":
      return {
        title: "Initialize Dijkstra",
        description:
          "All nodes start with an infinite distance except the starting node.",
        detail: `Starting node ${step.node} has distance 0.`,
      };

    case "VISIT_NODE":
      return {
        title: `Visiting node ${step.node}`,
        description:
          "This is currently the unvisited node with the smallest known distance.",
        detail: `Current shortest distance: ${formatDistance(step.distance)}.`,
      };

    case "CHECK_EDGE":
      return {
        title: `Checking edge ${step.from} → ${step.to}`,
        description:
          "Dijkstra checks whether reaching the neighboring node through the current node produces a shorter path.",
        detail: `Current: ${formatDistance(
          step.currentDistance,
        )} · New: ${formatDistance(step.newDistance)}`,
      };

    case "RELAX_EDGE":
      return {
        title: `Relaxing edge ${step.from} → ${step.to}`,
        description:
          "A shorter route was found, so the distance and previous node are updated.",
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
        description: "The algorithm is processing the graph.",
        detail: null,
      };
  }
}

function formatDistance(distance) {
  if (distance === Infinity) {
    return "∞";
  }

  return distance;
}
