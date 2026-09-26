import { Route, Clock3, Database, Info, CircleDot } from "lucide-react";

import { algorithms } from "../../algorithms";
import { getExecutionStats } from "../../utils/executionStats";
import { getStepExplanation } from "../../utils/stepExplanation";

function AlgorithmInfo({
  algorithm = "dijkstra",
  currentStep = 0,
  steps = [],
}) {
  const algorithmData = algorithms[algorithm] || algorithms.dijkstra;

  const step = steps[currentStep];

  const explanation = getStepExplanation(step, algorithm);

  const stats = getExecutionStats(steps, currentStep);

  return (
    <div className="h-full overflow-y-auto bg-[#0d0f12] p-5">
      {/* Algorithm Header */}
      <div className="mb-7">
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04]">
          <Route size={17} />
        </div>

        <h2 className="text-lg font-semibold">{algorithmData.name}</h2>

        <p className="mt-1 text-sm leading-5 text-zinc-500">
          {algorithmData.description}
        </p>
      </div>

      {/* Complexity */}
      <div className="mb-7">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
          Complexity
        </p>

        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-lg border border-white/10 bg-white/[0.025] p-3">
            <div className="mb-2 flex items-center gap-2 text-zinc-500">
              <Clock3 size={14} />
              <span className="text-xs">Time</span>
            </div>

            <p className="font-mono text-sm">{algorithmData.complexity.time}</p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.025] p-3">
            <div className="mb-2 flex items-center gap-2 text-zinc-500">
              <Database size={14} />
              <span className="text-xs">Space</span>
            </div>

            <p className="font-mono text-sm">
              {algorithmData.complexity.space}
            </p>
          </div>
        </div>
      </div>

      {/* Current Step */}
      <div className="mb-7">
        <div className="mb-3 flex items-center gap-2">
          <Info size={14} className="text-zinc-500" />

          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
            Current Step
          </p>
        </div>

        <div className="rounded-lg border border-white/10 bg-white/[0.025] p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/[0.06]">
              <CircleDot size={14} />
            </div>

            <div className="min-w-0">
              <p className="text-sm font-medium text-white">
                {explanation.title}
              </p>

              <p className="mt-2 text-xs leading-5 text-zinc-500">
                {explanation.description}
              </p>

              {explanation.detail && (
                <div className="mt-3 rounded-md border border-white/10 bg-black/20 px-3 py-2">
                  <p className="font-mono text-[11px] text-zinc-300">
                    {explanation.detail}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Execution Progress */}
      <div className="mb-7">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
          Execution
        </p>

        <div className="rounded-lg border border-white/10 bg-white/[0.025] p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-zinc-500">Step</span>

            <span className="font-mono text-xs text-zinc-300">
              {steps.length > 0
                ? `${currentStep + 1} / ${steps.length}`
                : "0 / 0"}
            </span>
          </div>

          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-white transition-all duration-200"
              style={{
                width:
                  steps.length > 1
                    ? `${(currentStep / (steps.length - 1)) * 100}%`
                    : "0%",
              }}
            />
          </div>
        </div>
      </div>

      {/* Execution Stats */}
      <div>
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
          Execution Stats
        </p>

        <div className="grid grid-cols-2 gap-2">
          <StatCard label="Visited" value={stats.visitedNodes} />

          <StatCard label="Edges" value={stats.edgesChecked} />

          <StatCard label="Relaxed" value={stats.relaxations} />

          <StatCard
            label="Distance"
            value={
              stats.currentDistance === null
                ? "—"
                : stats.currentDistance === Infinity
                  ? "∞"
                  : stats.currentDistance
            }
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.025] p-3">
      <p className="text-[10px] uppercase tracking-wider text-zinc-600">
        {label}
      </p>

      <p className="mt-1 font-mono text-sm text-zinc-200">{value}</p>
    </div>
  );
}

export default AlgorithmInfo;
