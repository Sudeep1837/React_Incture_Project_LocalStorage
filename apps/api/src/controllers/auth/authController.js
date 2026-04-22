import * as authService from "../../services/authService.js";

export function signup(req, res, next) {
  try {
    const result = authService.signup(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export function login(req, res, next) {
  try {
    const result = authService.login(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export function me(req, res) {
  const user = authService.getCurrentUser(req.user.sub);
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json({ user });
}
