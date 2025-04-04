import Report from "../classes/Report";

const LocalStorage = {
  getWorkingOn: () => {
    const result = Number(localStorage.getItem("workingOn"));

    if (!result) return -1;

    if (isNaN(result))
      throw new Error(
        `Local Storage value for "workingOn, ${result.toString()} is invalid`
      );

    return result;
  },

  setWorkingOn: (id: number) => {
    if (id < 0) return;

    localStorage.setItem("workingOn", String(id));
  },

  clear: () => {
    localStorage.removeItem("workingOn");
  },
} as const;

export default LocalStorage;
