import { applyTextFilter, sortByField } from "../features/common/utils/filtering";

test("applyTextFilter filters by configured keys", () => {
  const items = [{ title: "Alpha", owner: "Jane" }, { title: "Beta", owner: "John" }];
  expect(applyTextFilter(items, "alp", ["title"]).length).toBe(1);
});

test("sortByField sorts ascending by default", () => {
  const items = [{ name: "Zeta" }, { name: "Alpha" }];
  expect(sortByField(items, "name")[0].name).toBe("Alpha");
});
