export const defaultGraph = {
  nodes: [
    { id: "A", x: 170, y: 120 },
    { id: "B", x: 350, y: 90 },
    { id: "C", x: 530, y: 140 },
    { id: "D", x: 180, y: 300 },
    { id: "E", x: 360, y: 290 },
    { id: "F", x: 520, y: 320 },
  ],

  edges: [
    { from: "A", to: "B", weight: 4 },
    { from: "B", to: "C", weight: 3 },
    { from: "A", to: "D", weight: 2 },
    { from: "B", to: "E", weight: 5 },
    { from: "C", to: "F", weight: 2 },
    { from: "D", to: "E", weight: 1 },
    { from: "E", to: "F", weight: 4 },
  ],
};

export const defaultStartNode = "A";
export const defaultTargetNode = "F";
