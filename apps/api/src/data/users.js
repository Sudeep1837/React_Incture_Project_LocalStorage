import bcrypt from "bcryptjs";

const seedUsers = [
  { id: "u-admin", name: "Admin User", email: "admin@demo.com", password: "Admin@123", role: "Admin" },
  { id: "u-manager", name: "Manager User", email: "manager@demo.com", password: "Manager@123", role: "Manager" },
  { id: "u-employee", name: "Employee User", email: "employee@demo.com", password: "Employee@123", role: "Employee" },
];

export const users = seedUsers.map((user) => ({
  ...user,
  passwordHash: bcrypt.hashSync(user.password, 10),
  isActive: true,
  lastActivityAt: new Date().toISOString(),
}));
