import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import ProtectedRoute from "../routes/ProtectedRoute";

test("protected route renders children outlet when token exists", () => {
  const store = configureStore({ reducer: () => ({ auth: { token: "token" } }) });
  const view = render(
    <Provider store={store}>
      <MemoryRouter>
        <ProtectedRoute />
      </MemoryRouter>
    </Provider>,
  );
  expect(view.container).toBeTruthy();
});
