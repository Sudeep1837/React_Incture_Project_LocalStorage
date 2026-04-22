const STORAGE_KEY = "ewms:v1";

const seedState = {
  version: 1,
  theme: "light",
  ui: { taskFilters: {}, projectFilters: {} },
  notifications: [],
  projects: [],
  tasks: [],
  users: [],
  activity: [],
};

export function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return seedState;
    const parsed = JSON.parse(raw);
    return { ...seedState, ...parsed };
  } catch {
    return seedState;
  }
}

export function writeStorage(payload) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

export { STORAGE_KEY, seedState };
