export function applyTextFilter(items, query, keys) {
  if (!query) return items;
  const term = query.toLowerCase();
  return items.filter((item) => keys.some((key) => String(item[key] || "").toLowerCase().includes(term)));
}

export function sortByField(items, field, direction = "asc") {
  const copy = [...items];
  copy.sort((a, b) => {
    const av = a[field] || "";
    const bv = b[field] || "";
    if (av < bv) return direction === "asc" ? -1 : 1;
    if (av > bv) return direction === "asc" ? 1 : -1;
    return 0;
  });
  return copy;
}
