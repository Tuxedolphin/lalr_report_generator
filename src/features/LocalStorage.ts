class LocalStorage {
  get workingOn() {
    const result = localStorage.getItem("workingOn");

    if (!result) return -1;
    if (result != result)
      throw new Error(
        `Local Storage value for "workingOn, ${result} is invalid`
      );

    return Number(result);
  }

  set workingOn(id: number) {
    localStorage.setItem("workingOn", String(id));
  }

  finish() {
    localStorage.removeItem("workingOn");
  }
}

export default new LocalStorage();
