import { dijkstra } from "./dijkstra";
import { bfs } from "./bfs.jsx";
import { astar } from "./astar";

export const algorithms = {
  dijkstra: {
    name: "Dijkstra",
    description: "Finds the shortest path in a weighted graph.",
    complexity: {
      time: "O(V² + E)",
      space: "O(V)",
    },
    run: dijkstra,
  },

  bfs: {
    name: "BFS",
    description: "Finds the shortest path in an unweighted graph.",
    complexity: {
      time: "O(V + E)",
      space: "O(V)",
    },
    run: bfs,
  },
  astar: {
    name: "A*",
    description:
      "Uses path cost and a heuristic to efficiently find a shortest path.",
    complexity: {
      time: "O((V + E) log V)",
      space: "O(V)",
    },
    run: astar,
  },
};
