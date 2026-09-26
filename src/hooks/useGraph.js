import { useState } from "react";

import {
  defaultGraph,
  defaultStartNode,
  defaultTargetNode,
} from "../data/defaultGraphs";

export function useGraph() {
  const [graph, setGraph] = useState(defaultGraph);
  const [startNode, setStartNode] = useState(defaultStartNode);
  const [targetNode, setTargetNode] = useState(defaultTargetNode);

  function moveNode(nodeId, x, y) {
    setGraph((currentGraph) => ({
      ...currentGraph,
      nodes: currentGraph.nodes.map((node) =>
        node.id === nodeId ? { ...node, x, y } : node,
      ),
    }));
  }

  function addEdge(from, to, weight = 1) {
    if (!from || !to || from === to) {
      return;
    }

    setGraph((currentGraph) => {
      const exists = currentGraph.edges.some(
        (edge) =>
          (edge.from === from && edge.to === to) ||
          (edge.from === to && edge.to === from),
      );

      if (exists) {
        return currentGraph;
      }

      return {
        ...currentGraph,
        edges: [
          ...currentGraph.edges,
          {
            from,
            to,
            weight: Number(weight) || 1,
          },
        ],
      };
    });
  }

  function removeEdge(from, to) {
    setGraph((currentGraph) => ({
      ...currentGraph,
      edges: currentGraph.edges.filter(
        (edge) =>
          !(
            (edge.from === from && edge.to === to) ||
            (edge.from === to && edge.to === from)
          ),
      ),
    }));
  }

  function updateEdgeWeight(from, to, weight) {
    const numericWeight = Number(weight);

    if (!Number.isFinite(numericWeight) || numericWeight <= 0) {
      return;
    }

    setGraph((currentGraph) => ({
      ...currentGraph,
      edges: currentGraph.edges.map((edge) => {
        const sameEdge =
          (edge.from === from && edge.to === to) ||
          (edge.from === to && edge.to === from);

        return sameEdge
          ? {
              ...edge,
              weight: numericWeight,
            }
          : edge;
      }),
    }));
  }

  function randomizeGraph() {
    const nodeCount = 6;

    const nodes = Array.from({ length: nodeCount }, (_, index) => ({
      id: String.fromCharCode(65 + index),
      x: 100 + Math.random() * 500,
      y: 80 + Math.random() * 280,
    }));

    const edges = [];

    // Connected backbone
    for (let i = 1; i < nodes.length; i++) {
      const previousNode = nodes[Math.floor(Math.random() * i)];

      edges.push({
        from: previousNode.id,
        to: nodes[i].id,
        weight: Math.floor(Math.random() * 9) + 1,
      });
    }

    // Additional edges
    for (let i = 0; i < 5; i++) {
      const from = nodes[Math.floor(Math.random() * nodes.length)];

      const to = nodes[Math.floor(Math.random() * nodes.length)];

      if (from.id === to.id) continue;

      const exists = edges.some(
        (edge) =>
          (edge.from === from.id && edge.to === to.id) ||
          (edge.from === to.id && edge.to === from.id),
      );

      if (!exists) {
        edges.push({
          from: from.id,
          to: to.id,
          weight: Math.floor(Math.random() * 9) + 1,
        });
      }
    }

    setGraph({
      nodes,
      edges,
    });

    setStartNode("A");
    setTargetNode(String.fromCharCode(65 + nodeCount - 1));
  }

  function resetGraph() {
    setGraph(defaultGraph);
    setStartNode(defaultStartNode);
    setTargetNode(defaultTargetNode);
  }

  return {
    graph,
    startNode,
    targetNode,

    moveNode,

    setStartNode,
    setTargetNode,

    addEdge,
    removeEdge,
    updateEdgeWeight,

    randomizeGraph,
    resetGraph,
  };
}
