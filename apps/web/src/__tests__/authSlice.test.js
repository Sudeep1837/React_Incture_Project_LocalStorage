import authReducer, { logout } from "../store/authSlice";

describe("auth slice", () => {
  test("logout clears auth state", () => {
    const next = authReducer({ user: { id: "1" }, token: "abc" }, logout());
    expect(next.user).toBeNull();
    expect(next.token).toBeNull();
  });
});
