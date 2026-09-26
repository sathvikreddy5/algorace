export function getExecutionStats(steps = [], currentStep = 0) {
  const stats = {
    visitedNodes: 0,
    edgesChecked: 0,
    relaxations: 0,
    currentDistance: null,
  };

  if (!steps.length) {
    return stats;
  }

  const safeStep = Math.min(Math.max(currentStep, 0), steps.length - 1);

  const visited = new Set();

  for (let i = 0; i <= safeStep; i++) {
    const step = steps[i];

    if (!step) {
      continue;
    }

    switch (step.type) {
      case "VISIT_NODE":
        visited.add(step.node);
        stats.currentDistance = step.distance;
        break;

      case "CHECK_EDGE":
        stats.edgesChecked++;
        break;

      case "RELAX_EDGE":
        stats.relaxations++;
        break;

      default:
        break;
    }
  }

  stats.visitedNodes = visited.size;

  return stats;
}
