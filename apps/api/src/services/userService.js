import bcrypt from "bcryptjs";
import { users } from "../data/users.js";
import { sanitizeUser } from "./authService.js";

export function listUsers() {
  return users.map(sanitizeUser);
}

export function createUser(payload) {
  const user = {
    id: `u-${Date.now()}`,
    name: payload.name,
    email: payload.email,
    role: payload.role || "Employee",
    isActive: payload.isActive ?? true,
    passwordHash: bcrypt.hashSync(payload.password || "Temp@123", 10),
    lastActivityAt: new Date().toISOString(),
  };
  users.push(user);
  return sanitizeUser(user);
}

export function updateUser(id, payload) {
  const user = users.find((item) => item.id === id);
  if (!user) return null;
  Object.assign(user, payload);
  return sanitizeUser(user);
}
