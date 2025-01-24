import express from "express";
import {
  forgotPassword,
  login,
  logout,
  resetPassword,
  signup,
  verifyEmail,
  checkAuth,
  updateUser,
  deleteUser,
  getUserById,
  getAllUsers,
} from "../controllers/auth.controller.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/", protectRoute, checkAuth);
router.get("/user/:userId", protectRoute, getUserById);
router.get("/users", protectRoute, getAllUsers);
router.post("/signup", signup);
router.put("/update/:userId", updateUser);
router.delete("/delete/:userId", protectRoute, deleteUser);
router.post("/login", login);
router.post("/logout", logout);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
