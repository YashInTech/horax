import { Router } from "express";
import {
	createUser,
	getUsers,
	getUserById,
	deleteUser,
	// updateUser,
} from "../controllers/userController";

const router: Router = Router();

// Create a new user
router.post("/", createUser);

// Get all users
router.get("/", getUsers);

// router.put('/:id', updateUser);
router.get("/:id", getUserById);

// Delete a user by ID
router.delete("/:id", deleteUser);

export default router;
