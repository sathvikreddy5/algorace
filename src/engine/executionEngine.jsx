export const initialExecutionState = {
  status: "idle",

  steps: [],

  currentStep: 0,

  speed: 1,

  result: null,
};

export function createExecution(steps) {
  return {
    status: "paused",
    steps,
    currentStep: 0,
    speed: 1,
    result: null,
  };
}
