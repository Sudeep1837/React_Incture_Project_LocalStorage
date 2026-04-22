import { readStorage } from "../lib/storage";

describe("storage helpers", () => {
  test("returns defaults when localStorage is empty", () => {
    localStorage.clear();
    const data = readStorage();
    expect(Array.isArray(data.projects)).toBe(true);
  });
});
