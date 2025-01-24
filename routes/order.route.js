import express from "express";
import protectRoute from "../middlewares/protectRoute.js";
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrdersByService,
  getOrdersByUser,
} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/add-order/:serviceId", protectRoute, createOrder);
router.get("/orders/:serviceId", protectRoute, getOrdersByService);
router.get("/orders", protectRoute, getAllOrders);
router.get("/user/orders", protectRoute, getOrdersByUser);
router.delete("/orders/:orderId", protectRoute, deleteOrder);

export default router;
