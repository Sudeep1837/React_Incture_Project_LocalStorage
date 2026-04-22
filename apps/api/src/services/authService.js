import bcrypt from "bcryptjs";
import { users } from "../data/users.js";
import { signToken } from "../utils/jwt.js";

export function sanitizeUser(user) {
  const { password, passwordHash, ...safe } = user;
  return safe;
}

export function signup(payload) {
  const { name, email, password, role = "Employee" } = payload;
  if (!name || !email || !password) throw new Error("Name, email, and password are required");
  const exists = users.some((user) => user.email.toLowerCase() === email.toLowerCase());
  if (exists) throw new Error("User already exists");

  const user = {
    id: `u-${Date.now()}`,
    name,
    email,
    role,
    isActive: true,
    lastActivityAt: new Date().toISOString(),
    passwordHash: bcrypt.hashSync(password, 10),
  };
  users.push(user);

  return { token: signToken(user), user: sanitizeUser(user) };
}

export function login(payload) {
  const { email, password } = payload;
  const user = users.find((item) => item.email.toLowerCase() === String(email).toLowerCase());
  if (!user) throw new Error("Invalid credentials");
  if (!user.isActive) throw new Error("User is deactivated");

  const matches = bcrypt.compareSync(password, user.passwordHash);
  if (!matches) throw new Error("Invalid credentials");
  user.lastActivityAt = new Date().toISOString();

  return { token: signToken(user), user: sanitizeUser(user) };
}

export function getCurrentUser(id) {
  const user = users.find((item) => item.id === id);
  if (!user) return null;
  return sanitizeUser(user);
}
