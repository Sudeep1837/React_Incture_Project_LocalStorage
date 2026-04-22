import React from "react";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import DashboardPage from "../features/dashboard/DashboardPage";

test("dashboard renders metrics cards", () => {
  const store = configureStore({
    reducer: () => ({
      work: { projects: [{ id: "p1" }], tasks: [{ id: "t1", status: "Done" }], notifications: [], activity: [] },
    }),
  });

  render(
    <Provider store={store}>
      <DashboardPage />
    </Provider>,
  );
  expect(screen.getByText("Project Velocity")).toBeInTheDocument();
});
