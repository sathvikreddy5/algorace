import {
  BrainCircuit,
  CircleDot,
  GitBranch,
  Shuffle,
  MousePointer2,
  Play,
} from "lucide-react";

function Sidebar({
  selectedAlgorithm,
  onSelectAlgorithm,
  onRandomizeGraph,
  onResetGraph,
  onRun,
}) {
  return (
    <aside className="hidden w-56 shrink-0 border-r border-white/10 bg-[#0d0f12] lg:block">
      <div className="p-4">
        {/* Algorithms */}
        <div className="mb-8">
          <p className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
            Algorithms
          </p>

          <div className="space-y-1">
            <button
              type="button"
              onClick={() => onSelectAlgorithm("dijkstra")}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                selectedAlgorithm === "dijkstra"
                  ? "bg-white/[0.07] text-white"
                  : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300"
              }`}
            >
              <CircleDot size={15} />
              Dijkstra
            </button>

            <button
              type="button"
              onClick={() => onSelectAlgorithm("bfs")}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                selectedAlgorithm === "bfs"
                  ? "bg-white/[0.07] text-white"
                  : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300"
              }`}
            >
              <GitBranch size={15} />
              BFS
            </button>

            <button
              type="button"
              onClick={() => onSelectAlgorithm("astar")}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                selectedAlgorithm === "astar"
                  ? "bg-white/[0.07] text-white"
                  : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300"
              }`}
            >
              <BrainCircuit size={15} />
              A*
            </button>
          </div>
        </div>

        {/* Graph */}
        <div className="mb-8">
          <p className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
            Graph
          </p>

          <div className="space-y-1">
            <button
              type="button"
              onClick={onRandomizeGraph}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-500 transition hover:bg-white/[0.04] hover:text-zinc-300"
            >
              <Shuffle size={15} />
              Random Graph
            </button>

            <button
              type="button"
              onClick={onResetGraph}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-zinc-500 transition hover:bg-white/[0.04] hover:text-zinc-300"
            >
              <MousePointer2 size={15} />
              Reset Graph
            </button>
          </div>
        </div>

        {/* Run */}
        <button
          type="button"
          onClick={onRun}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200"
        >
          <Play size={15} fill="currentColor" />
          Run Algorithm
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
