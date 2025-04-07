const LocalStorage = {
  getWorkingOn: () => {
    const result = Number(localStorage.getItem("workingOn"));

    if (!result) return;

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

  clearWorkingOn: () => {
    localStorage.removeItem("workingOn");
  },

  setDarkMode: (isDarkMode: boolean) => {
    localStorage.setItem("darkMode", String(isDarkMode));
  },

  getDarkMode: () => {
    const result = localStorage.getItem("darkMode");

    if (result === null) return true;

    if (result !== "true" && result !== "false")
      throw new Error(
        `Local Storage value for "darkMode", ${result} is invalid`
      );

    return result === "true";
  },
} as const;

export default LocalStorage;
