export const loadFromStorage = (key) => {
  try {
    const serializedState = localStorage.getItem(key);
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (error) {
    console.error("Error loading from local storage:", error);
    return undefined;
  }
};

export const saveToStorage = (key, value) => {
  try {
    const serializedState = JSON.stringify(value);
    localStorage.setItem(key, serializedState);
  } catch (error) {
    console.error("Error saving to local storage:", error);
  }
};

export const clearAll = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error("Error clearing local storage:", error);
  }
};