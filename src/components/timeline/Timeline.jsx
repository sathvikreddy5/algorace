import { useRef, useState } from "react";
import { SkipBack, Play, Pause, SkipForward, RotateCcw } from "lucide-react";

function Timeline({
  state,
  play,
  pause,
  next,
  previous,
  setStep,
  reset,
  setSpeed,
}) {
  const { status, currentStep, steps, speed } = state;

  const [isDragging, setIsDragging] = useState(false);

  const timelineRef = useRef(null);

  const hasSteps = steps.length > 0;

  const progress =
    steps.length > 1 ? (currentStep / (steps.length - 1)) * 100 : 0;

  function handlePlayPause() {
    if (!hasSteps) return;

    if (status === "playing") {
      pause();
    } else {
      play();
    }
  }

  function updateStepFromPosition(clientX) {
    if (!timelineRef.current) return;

    if (!hasSteps || steps.length <= 1) {
      return;
    }

    const rect = timelineRef.current.getBoundingClientRect();

    const percentage = (clientX - rect.left) / rect.width;

    const clampedPercentage = Math.min(Math.max(percentage, 0), 1);

    const newStep = Math.round(clampedPercentage * (steps.length - 1));

    setStep(newStep);
  }

  function handleTimelineClick(event) {
    updateStepFromPosition(event.clientX);
  }

  function handlePointerDown(event) {
    if (!hasSteps || steps.length <= 1) {
      return;
    }

    setIsDragging(true);

    event.currentTarget.setPointerCapture(event.pointerId);

    updateStepFromPosition(event.clientX);
  }

  function handlePointerMove(event) {
    if (!isDragging) return;

    updateStepFromPosition(event.clientX);
  }

  function handlePointerUp() {
    setIsDragging(false);
  }

  return (
    <section className="border-t border-white/10 bg-[#0d0f12] px-3 py-3 sm:px-6 sm:py-4">
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        {/* Playback Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={reset}
            disabled={!hasSteps}
            aria-label="Reset"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            <RotateCcw size={16} />
          </button>

          <button
            type="button"
            onClick={previous}
            disabled={!hasSteps || currentStep === 0}
            aria-label="Previous step"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            <SkipBack size={16} />
          </button>

          <button
            type="button"
            onClick={handlePlayPause}
            disabled={!hasSteps}
            aria-label={status === "playing" ? "Pause" : "Play"}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-30"
          >
            {status === "playing" ? (
              <Pause size={16} fill="currentColor" />
            ) : (
              <Play size={16} fill="currentColor" />
            )}
          </button>

          <button
            type="button"
            onClick={next}
            disabled={!hasSteps || currentStep >= steps.length - 1}
            aria-label="Next step"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
          >
            <SkipForward size={16} />
          </button>
        </div>

        {/* Timeline */}
        <div className="min-w-[160px] flex-1">
          <div className="mb-2 flex justify-between text-[10px] font-mono text-zinc-600">
            <span>STEP {hasSteps ? currentStep + 1 : 0}</span>

            <span>
              {hasSteps ? `${currentStep + 1} / ${steps.length}` : "0 / 0"}
            </span>
          </div>

          <div
            ref={timelineRef}
            className={`relative h-2 select-none rounded-full bg-zinc-800 ${
              hasSteps ? "cursor-pointer touch-none" : "cursor-default"
            }`}
            onClick={handleTimelineClick}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerLeave={() => {
              if (isDragging) {
                setIsDragging(false);
              }
            }}
          >
            {/* Progress */}
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-white"
              style={{
                width: `${progress}%`,
              }}
            />

            {/* Handle */}
            <div
              className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full border-2 border-[#0d0f12] bg-white transition-transform ${
                isDragging ? "scale-125" : "scale-100"
              }`}
              style={{
                left: `calc(${progress}% - 8px)`,
              }}
            />
          </div>
        </div>

        {/* Speed */}
        <div className="flex items-center gap-1 rounded-lg border border-white/10 p-1">
          {[0.5, 1, 2].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setSpeed(value)}
              className={`rounded-md px-2 py-1 text-[11px] transition ${
                speed === value
                  ? "bg-white/[0.08] text-white"
                  : "text-zinc-500 hover:bg-white/[0.06] hover:text-white"
              }`}
            >
              {value}×
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Timeline;
