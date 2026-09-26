export function stepReducer(state, action) {
  switch (action.type) {
    case "LOAD_STEPS":
      return {
        ...state,
        steps: action.steps,
        currentStep: 0,
        status: "paused",
        result: null,
      };

    case "PLAY":
      return {
        ...state,
        status: "playing",
      };

    case "PAUSE":
      return {
        ...state,
        status: "paused",
      };

    case "NEXT":
      return {
        ...state,
        currentStep: Math.min(
          state.currentStep + 1,
          Math.max(state.steps.length - 1, 0),
        ),
      };

    case "SET_STEP":
      return {
        ...state,
        currentStep: Math.min(
          Math.max(action.step, 0),
          Math.max(state.steps.length - 1, 0),
        ),
        status: "paused",
      };

    case "PREVIOUS":
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 0),
      };

    case "RESET":
      return {
        ...state,
        currentStep: 0,
        status: "paused",
        result: null,
      };

    case "SET_SPEED":
      return {
        ...state,
        speed: action.speed,
      };

    default:
      return state;
  }
}
