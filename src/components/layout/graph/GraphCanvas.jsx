import { useState } from "react";
import { Plus, Link2, Trash2, X } from "lucide-react";

import { getVisualState } from "../../../utils/visualState";

function GraphCanvas({
  graph,
  startNode,
  targetNode,
  steps = [],
  currentStep = 0,
  onMoveNode,
  onSetStartNode,
  onSetTargetNode,
  onAddEdge,
  onRemoveEdge,
  onUpdateEdgeWeight,
}) {
  const { nodes, edges } = graph;

  const visualState = getVisualState(steps, currentStep);

  const [draggingNode, setDraggingNode] = useState(null);

  const [selectedNode, setSelectedNode] = useState(null);

  const [selectedEdge, setSelectedEdge] = useState(null);

  const [dragStartPoint, setDragStartPoint] = useState(null);

  const [editMode, setEditMode] = useState(false);

  const [connectMode, setConnectMode] = useState(false);

  const [edgeWeight, setEdgeWeight] = useState(1);

  function getSVGPoint(event) {
    const svg = event.currentTarget.ownerSVGElement;

    if (!svg) return null;

    const point = svg.createSVGPoint();

    point.x = event.clientX;
    point.y = event.clientY;

    const transformedPoint = point.matrixTransform(
      svg.getScreenCTM().inverse(),
    );

    return {
      x: transformedPoint.x,
      y: transformedPoint.y,
    };
  }

  function handlePointerDown(event, nodeId) {
    event.stopPropagation();

    const point = getSVGPoint(event);

    setDraggingNode(nodeId);
    setDragStartPoint(point);

    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event) {
    if (!draggingNode) return;

    const point = getSVGPoint(event);

    if (!point) return;

    const x = Math.max(40, Math.min(660, point.x));

    const y = Math.max(40, Math.min(410, point.y));

    onMoveNode(draggingNode, x, y);
  }

  function handlePointerUp(event) {
    if (!draggingNode) return;

    const point = getSVGPoint(event);

    const moved =
      dragStartPoint &&
      point &&
      Math.hypot(point.x - dragStartPoint.x, point.y - dragStartPoint.y) > 5;

    if (!moved) {
      handleNodeClick(draggingNode);
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setDraggingNode(null);
    setDragStartPoint(null);
  }

  function handleNodeClick(nodeId) {
    setSelectedEdge(null);

    if (connectMode) {
      if (!selectedNode) {
        setSelectedNode(nodeId);
        return;
      }

      if (selectedNode === nodeId) {
        return;
      }

      onAddEdge(selectedNode, nodeId, edgeWeight);

      setSelectedNode(null);
      return;
    }

    setSelectedNode(nodeId);
  }

  function handleEdgeClick(event, edge) {
    event.stopPropagation();

    if (!editMode) return;

    setSelectedNode(null);
    setSelectedEdge(edge);

    setEdgeWeight(edge.weight);
  }

  function handleAddEdge() {
    if (!selectedNode) return;

    setConnectMode(true);
    setSelectedEdge(null);
  }

  function handleSaveWeight() {
    if (!selectedEdge) return;

    onUpdateEdgeWeight(selectedEdge.from, selectedEdge.to, edgeWeight);

    setSelectedEdge(null);
  }

  function handleDeleteEdge() {
    if (!selectedEdge) return;

    onRemoveEdge(selectedEdge.from, selectedEdge.to);

    setSelectedEdge(null);
  }

  function handleSetStart() {
    if (!selectedNode) return;

    if (selectedNode === targetNode) {
      return;
    }

    onSetStartNode(selectedNode);
  }

  function handleSetTarget() {
    if (!selectedNode) return;

    if (selectedNode === startNode) {
      return;
    }

    onSetTargetNode(selectedNode);
  }

  function toggleEditMode() {
    setEditMode((value) => !value);
    setConnectMode(false);
    setSelectedEdge(null);
    setSelectedNode(null);
  }

  return (
    <div className="relative flex h-full min-h-[420px] items-center justify-center overflow-hidden bg-[#0b0d10]">
      {/* Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Edit Graph button */}
      <button
        type="button"
        onClick={toggleEditMode}
        className={`absolute right-4 top-4 z-20 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs transition sm:right-5 sm:top-5 ${
          editMode
            ? "border-white/20 bg-white text-black"
            : "border-white/10 bg-[#111318]/90 text-zinc-400 hover:text-white"
        }`}
      >
        <Link2 size={14} />
        {editMode ? "Editing Graph" : "Edit Graph"}
      </button>

      {/* SVG */}
      <svg
        viewBox="0 0 700 450"
        preserveAspectRatio="xMidYMid meet"
        className="relative h-auto w-full max-w-4xl touch-none p-4 sm:p-8"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        {/* Edges */}
        <g>
          {edges.map((edge) => {
            const from = nodes.find((node) => node.id === edge.from);

            const to = nodes.find((node) => node.id === edge.to);

            if (!from || !to) return null;

            const isActive =
              visualState.activeEdge?.from === edge.from &&
              visualState.activeEdge?.to === edge.to;

            const isReverseActive =
              visualState.activeEdge?.from === edge.to &&
              visualState.activeEdge?.to === edge.from;

            const isPathEdge = visualState.finalPath.some(
              (node, index) =>
                index < visualState.finalPath.length - 1 &&
                ((node === edge.from &&
                  visualState.finalPath[index + 1] === edge.to) ||
                  (node === edge.to &&
                    visualState.finalPath[index + 1] === edge.from)),
            );

            const isSelected =
              selectedEdge?.from === edge.from && selectedEdge?.to === edge.to;

            return (
              <g key={`${edge.from}-${edge.to}`}>
                {/* Invisible larger hit area */}
                {editMode && (
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke="transparent"
                    strokeWidth="16"
                    className="cursor-pointer"
                    onPointerDown={(event) => handleEdgeClick(event, edge)}
                  />
                )}

                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  stroke={
                    isSelected
                      ? "#ffffff"
                      : isPathEdge
                        ? "#ffffff"
                        : isActive || isReverseActive
                          ? "#a1a1aa"
                          : "#3f3f46"
                  }
                  strokeWidth={
                    isSelected || isPathEdge || isActive || isReverseActive
                      ? 4
                      : 2
                  }
                  className="transition-all duration-300"
                  pointerEvents="none"
                />

                <text
                  x={(from.x + to.x) / 2}
                  y={(from.y + to.y) / 2 - 8}
                  textAnchor="middle"
                  fontSize="12"
                  fontFamily="monospace"
                  fill={isSelected ? "#ffffff" : "#71717a"}
                  pointerEvents="none"
                >
                  {edge.weight}
                </text>
              </g>
            );
          })}
        </g>

        {/* Nodes */}
        {nodes.map((node) => {
          const isVisited = visualState.visitedNodes.has(node.id);

          const isActive = visualState.activeNode === node.id;

          const isPath = visualState.finalPath.includes(node.id);

          const isStart = node.id === startNode;

          const isTarget = node.id === targetNode;

          const isSelected = node.id === selectedNode;

          return (
            <GraphNode
              key={node.id}
              x={node.x}
              y={node.y}
              label={node.id}
              visited={isVisited}
              active={isActive}
              start={isStart}
              target={isTarget}
              path={isPath}
              selected={isSelected}
              dragging={draggingNode === node.id}
              onPointerDown={(event) => handlePointerDown(event, node.id)}
            />
          );
        })}
      </svg>

      {/* Graph info */}
      <div className="absolute left-4 top-4 rounded-lg border border-white/10 bg-[#111318]/90 px-3 py-2 backdrop-blur sm:left-5 sm:top-5">
        <p className="text-xs text-zinc-500">Current graph</p>

        <p className="mt-0.5 text-sm font-medium">
          {nodes.length} nodes · {edges.length} edges
        </p>
      </div>

      {/* Edit mode hint */}
      {editMode && !selectedEdge && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-xl border border-white/10 bg-[#111318]/95 px-4 py-3 text-center shadow-2xl backdrop-blur">
          <p className="text-xs font-medium text-white">
            {connectMode
              ? selectedNode
                ? `Select another node to connect with ${selectedNode}`
                : "Select the first node"
              : "Select a node or edge"}
          </p>

          <p className="mt-1 text-[10px] text-zinc-500">
            Click nodes to connect · Click edges to edit
          </p>
        </div>
      )}

      {/* Node controls */}
      {selectedNode && !connectMode && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-white/10 bg-[#111318]/95 p-2 shadow-2xl backdrop-blur">
          <div className="px-2">
            <p className="text-[10px] uppercase tracking-wider text-zinc-600">
              Selected
            </p>

            <p className="font-mono text-sm font-semibold">
              Node {selectedNode}
            </p>
          </div>

          <button
            type="button"
            onClick={handleSetStart}
            disabled={selectedNode === targetNode}
            className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-zinc-300 transition hover:bg-white/[0.1] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            Set Start
          </button>

          <button
            type="button"
            onClick={handleSetTarget}
            disabled={selectedNode === startNode}
            className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-zinc-300 transition hover:bg-white/[0.1] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            Set Target
          </button>

          {editMode && (
            <button
              type="button"
              onClick={handleAddEdge}
              className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-2 text-xs font-medium text-black transition hover:bg-zinc-200"
            >
              <Plus size={13} />
              Connect
            </button>
          )}

          <button
            type="button"
            onClick={() => setSelectedNode(null)}
            className="px-2 text-xs text-zinc-600 transition hover:text-white"
          >
            ×
          </button>
        </div>
      )}

      {/* Edge controls */}
      {selectedEdge && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-xl border border-white/10 bg-[#111318]/95 p-2 shadow-2xl backdrop-blur">
          <div className="px-2">
            <p className="text-[10px] uppercase tracking-wider text-zinc-600">
              Edge
            </p>

            <p className="font-mono text-sm font-semibold">
              {selectedEdge.from} ↔ {selectedEdge.to}
            </p>
          </div>

          <input
            type="number"
            min="1"
            value={edgeWeight}
            onChange={(event) => setEdgeWeight(event.target.value)}
            className="h-9 w-16 rounded-lg border border-white/10 bg-white/[0.05] px-2 text-center font-mono text-sm text-white outline-none focus:border-white/30"
          />

          <button
            type="button"
            onClick={handleSaveWeight}
            className="rounded-lg bg-white px-3 py-2 text-xs font-medium text-black transition hover:bg-zinc-200"
          >
            Save
          </button>

          <button
            type="button"
            onClick={handleDeleteEdge}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-400 transition hover:border-red-400/30 hover:text-red-300"
          >
            <Trash2 size={13} />
            Delete
          </button>

          <button
            type="button"
            onClick={() => setSelectedEdge(null)}
            className="px-2 text-zinc-600 hover:text-white"
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Execution */}
      {steps.length > 0 && (
        <div className="absolute bottom-4 left-4 rounded-lg border border-white/10 bg-[#111318]/90 px-3 py-2 backdrop-blur sm:bottom-5 sm:left-5">
          <p className="text-[10px] uppercase tracking-wider text-zinc-600">
            Execution
          </p>

          <p className="font-mono text-xs text-zinc-300">
            Step {currentStep + 1} / {steps.length}
          </p>
        </div>
      )}
    </div>
  );
}

function GraphNode({
  x,
  y,
  label,
  visited,
  active,
  start,
  target,
  path,
  selected,
  dragging,
  distance,
  onPointerDown,
}) {
  return (
    <g
      onPointerDown={onPointerDown}
      className="cursor-grab"
      style={{
        cursor: dragging ? "grabbing" : "grab",
      }}
    >
      <circle
        cx={x}
        cy={y}
        r="34"
        fill="none"
        stroke={selected ? "#ffffff" : "transparent"}
        strokeWidth="1.5"
        strokeDasharray={selected ? "4 4" : "0"}
      />

      <circle
        cx={x}
        cy={y}
        r={active ? 30 : 27}
        fill="none"
        stroke={active ? "#ffffff" : path ? "#a1a1aa" : "transparent"}
        strokeWidth="2"
      />

      <circle
        cx={x}
        cy={y}
        r="24"
        fill={active ? "#ffffff" : visited ? "#3f3f46" : "#15181d"}
        stroke={start || target ? "#ffffff" : visited ? "#71717a" : "#52525b"}
        strokeWidth="2"
      />

      <text
        x={x}
        y={y + 5}
        textAnchor="middle"
        fontSize="14"
        fontWeight="600"
        fill={active ? "#090a0c" : "#ffffff"}
        fontFamily="Inter, sans-serif"
        pointerEvents="none"
      >
        {label}
      </text>

      <text
        x={x}
        y={y - 34}
        textAnchor="middle"
        fontSize="9"
        fontFamily="monospace"
        fill="#71717a"
        pointerEvents="none"
      >
        {start ? "START" : target ? "TARGET" : ""}
      </text>

      {distance !== undefined && distance !== Infinity && (
        <text
          x={x}
          y={y + 43}
          textAnchor="middle"
          fontSize="11"
          fontFamily="monospace"
          fill="#71717a"
          pointerEvents="none"
        >
          {distance}
        </text>
      )}
    </g>
  );
}

export default GraphCanvas;
