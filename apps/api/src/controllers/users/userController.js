import * as userService from "../../services/userService.js";

export function getUsers(req, res) {
  res.json({ users: userService.listUsers() });
}

export function createUser(req, res) {
  const user = userService.createUser(req.body);
  res.status(201).json({ user });
}

export function updateUser(req, res) {
  const user = userService.updateUser(req.params.userId, req.body);
  if (!user) return res.status(404).json({ message: "User not found" });
  return res.json({ user });
}
