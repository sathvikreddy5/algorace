import { useEffect, useReducer } from "react";

import { initialExecutionState } from "../engine/executionEngine";

import { stepReducer } from "../engine/stepReducer";

export function useExecution() {
  const [state, dispatch] = useReducer(stepReducer, initialExecutionState);

  // Automatic playback
  useEffect(() => {
    if (state.status !== "playing") {
      return;
    }

    // Stop when the final step is reached
    if (state.currentStep >= state.steps.length - 1) {
      dispatch({
        type: "PAUSE",
      });

      return;
    }

    const delay = 1000 / state.speed;

    const timer = setTimeout(() => {
      dispatch({
        type: "NEXT",
      });
    }, delay);

    return () => clearTimeout(timer);
  }, [state.status, state.currentStep, state.steps.length, state.speed]);

  // Load algorithm steps
  const loadSteps = (steps) => {
    dispatch({
      type: "LOAD_STEPS",
      steps,
    });
  };

  // Start playback
  const play = () => {
    dispatch({
      type: "PLAY",
    });
  };

  // Pause playback
  const pause = () => {
    dispatch({
      type: "PAUSE",
    });
  };

  // Move to next step
  const next = () => {
    dispatch({
      type: "NEXT",
    });
  };

  // Move to previous step
  const previous = () => {
    dispatch({
      type: "PREVIOUS",
    });
  };

  // Jump directly to a specific step
  const setStep = (step) => {
    dispatch({
      type: "SET_STEP",
      step,
    });
  };

  // Reset execution
  const reset = () => {
    dispatch({
      type: "RESET",
    });
  };

  // Change playback speed
  const setSpeed = (speed) => {
    dispatch({
      type: "SET_SPEED",
      speed,
    });
  };

  return {
    state,

    loadSteps,
    play,
    pause,
    next,
    previous,
    setStep,
    reset,
    setSpeed,
  };
}
