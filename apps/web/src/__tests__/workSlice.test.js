import workReducer, { setTheme, upsertProject } from "../store/workSlice";

describe("work slice", () => {
  test("updates theme", () => {
    const next = workReducer(undefined, setTheme("dark"));
    expect(next.theme).toBe("dark");
  });

  test("adds project", () => {
    const next = workReducer(undefined, upsertProject({ id: "p1", name: "Alpha" }));
    expect(next.projects[0].name).toBe("Alpha");
  });
});
