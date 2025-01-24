import { Order } from "../models/order.model.js";

export const createOrder = async (req, res) => {
  try {
    const { serviceId } = req.params; // Extract serviceId from URL parameters
    const userId = req.userId; // Get userId from the request (set by your auth middleware)

    const newOrder = new Order({
      serviceId,
      userId,
    });

    await newOrder.save();
    res
      .status(201)
      .json({ message: "Order created successfully!", order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating order", error });
  }
};

export const getOrdersByService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const orders = await Order.find({ serviceId }).populate("userId");

    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving orders", error });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res
      .status(200)
      .json({ message: "Order deleted successfully!", order: deletedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting order", error });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("userId");
    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving orders", error });
  }
};

export const getOrdersByUser = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await Order.find({ userId }).populate("serviceId");

    res.status(200).json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving orders", error });
  }
};
