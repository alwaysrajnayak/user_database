import { Router } from "express";
import {
  loadData,
  deleteAllUsers,
  deleteUserById,
  getUserById,
  addUser,
} from "../controllers/userController";

const router = Router();

router.get("/load", loadData);
router.delete("/users", deleteAllUsers);
router.delete("/users/:userId", deleteUserById);
router.get("/users/:userId", getUserById);

router.post("/users", addUser);
export default router;
