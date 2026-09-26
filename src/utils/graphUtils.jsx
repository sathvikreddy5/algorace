export function buildAdjacencyList(graph) {
  const adjacencyList = {};

  graph.nodes.forEach((node) => {
    adjacencyList[node.id] = [];
  });

  graph.edges.forEach((edge) => {
    adjacencyList[edge.from].push({
      node: edge.to,
      weight: edge.weight,
    });

    adjacencyList[edge.to].push({
      node: edge.from,
      weight: edge.weight,
    });
  });

  return adjacencyList;
}
