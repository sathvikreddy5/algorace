import { useExecution } from "../hooks/useExecution";
import { algorithms } from "../algorithms";
import { useState } from "react";
import { useGraph } from "../hooks/useGraph";

import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import GraphCanvas from "../components/layout/graph/GraphCanvas";
import AlgorithmInfo from "../components/panels/AlgorithmInfo";
import Timeline from "../components/timeline/Timeline";
function Visualizer() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("dijkstra");
  const {
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
  } = useGraph();

  const {
    state,
    loadSteps,
    play,
    pause,
    next,
    previous,
    setStep,
    reset,
    setSpeed,
  } = useExecution();

  function handleRun() {
    const algorithm = algorithms[selectedAlgorithm];

    const steps = algorithm.run(graph, startNode, targetNode);

    loadSteps(steps);
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0b0d10] text-white">
      <Header />

      <div className="flex min-h-[calc(100vh-64px)]">
        <Sidebar
          selectedAlgorithm={selectedAlgorithm}
          onSelectAlgorithm={setSelectedAlgorithm}
          onRandomizeGraph={() => {
            randomizeGraph();
            reset();
          }}
          onResetGraph={() => {
            resetGraph();
            reset();
          }}
          onRun={handleRun}
        />

        <main className="flex min-w-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1 flex-col xl:grid xl:grid-cols-[minmax(0,1fr)_320px]">
            <section className="min-h-[420px] flex-1 border-b border-white/10 xl:min-h-0 xl:border-r xl:border-b-0">
              <GraphCanvas
                graph={graph}
                startNode={startNode}
                targetNode={targetNode}
                steps={state.steps}
                currentStep={state.currentStep}
                onMoveNode={(nodeId, x, y) => {
                  moveNode(nodeId, x, y);
                  reset();
                }}
                onSetStartNode={(nodeId) => {
                  setStartNode(nodeId);
                  reset();
                }}
                onSetTargetNode={(nodeId) => {
                  setTargetNode(nodeId);
                  reset();
                }}
                onAddEdge={(from, to, weight) => {
                  addEdge(from, to, weight);
                  reset();
                }}
                onRemoveEdge={(from, to) => {
                  removeEdge(from, to);
                  reset();
                }}
                onUpdateEdgeWeight={(from, to, weight) => {
                  updateEdgeWeight(from, to, weight);
                  reset();
                }}
              />
            </section>

            <aside className="shrink-0">
              <AlgorithmInfo
                algorithm={selectedAlgorithm}
                steps={state.steps}
                currentStep={state.currentStep}
              />
            </aside>
          </div>

          <Timeline
            state={state}
            play={play}
            pause={pause}
            next={next}
            previous={previous}
            setStep={setStep}
            reset={reset}
            setSpeed={setSpeed}
          />
        </main>
      </div>
    </div>
  );
}

export default Visualizer;
