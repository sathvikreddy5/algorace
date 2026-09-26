export function getVisualState(steps = [], currentStep = 0) {
  const state = {
    visitedNodes: new Set(),
    activeNode: null,
    activeEdge: null,
    distances: {},
    finalPath: [],
  };

  // Nothing to process yet
  if (!steps.length) {
    return state;
  }

  const safeStep = Math.min(Math.max(currentStep, 0), steps.length - 1);

  for (let i = 0; i <= safeStep; i++) {
    const step = steps[i];

    // Extra safety
    if (!step || !step.type) {
      continue;
    }

    switch (step.type) {
      case "INITIALIZE":
        state.distances = { ...step.distances };
        break;

      case "VISIT_NODE":
        state.visitedNodes.add(step.node);
        state.activeNode = step.node;

        if (step.distance !== undefined) {
          state.distances[step.node] = step.distance;
        }
        break;

      case "CHECK_EDGE":
        state.activeEdge = {
          from: step.from,
          to: step.to,
        };
        break;

      case "RELAX_EDGE":
        state.activeEdge = {
          from: step.from,
          to: step.to,
        };

        state.distances = {
          ...step.distances,
        };
        break;

      case "PATH_FOUND":
        state.finalPath = step.path;
        break;

      default:
        break;
    }
  }

  return state;
}
