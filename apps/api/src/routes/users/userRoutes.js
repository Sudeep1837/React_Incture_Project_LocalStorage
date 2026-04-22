import express from "express";
import { getUsers, createUser, updateUser } from "../../controllers/users/userController.js";
import { authMiddleware } from "../../middleware/authMiddleware.js";
import { roleMiddleware } from "../../middleware/roleMiddleware.js";

const router = express.Router();

router.use(authMiddleware);
router.get("/", getUsers);
router.post("/", roleMiddleware(["Admin"]), createUser);
router.patch("/:userId", roleMiddleware(["Admin"]), updateUser);

export default router;
