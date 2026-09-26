import { defaultGraph } from "../data/defaultGraphs";
import { dijkstra } from "./dijkstra";

const steps = dijkstra(defaultGraph, "A", "F");

console.log("Dijkstra steps:");

steps.forEach((step, index) => {
  console.log(index, step);
});
