import User from "../models/User.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const getAdminStats = async (req, res) => {
  try {
    // =========================
    // BASIC COUNTS
    // =========================

    const totalProducts = await Product.countDocuments();

    const totalUsers = await User.countDocuments({
      role: "user",
    });

    const totalOrders = await Order.countDocuments();

    // =========================
    // ORDER STATUS COUNTS
    // =========================

    const pendingOrders = await Order.countDocuments({
      status: "Pending",
    });

    const confirmedOrders = await Order.countDocuments({
      status: "Confirmed",
    });

    const shippedOrders = await Order.countDocuments({
      status: "Shipped",
    });

    const deliveredOrders = await Order.countDocuments({
      status: "Delivered",
    });

    const cancelledOrders = await Order.countDocuments({
      status: "Cancelled",
    });

    // =========================
    // TOTAL REVENUE
    // =========================

    const revenueResult = await Order.aggregate([
      {
        $match: {
          status: {
            $ne: "Cancelled",
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    // =========================
    // RECENT ORDERS
    // =========================

    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(5);

    // =========================
    // RESPONSE
    // =========================

    res.status(200).json({
      success: true,

      stats: {
        totalProducts,
        totalUsers,
        totalOrders,
        totalRevenue,

        pendingOrders,
        confirmedOrders,
        shippedOrders,
        deliveredOrders,
        cancelledOrders,
      },

      recentOrders,
    });
  } catch (error) {
    console.error("ADMIN STATS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch admin stats",
    });
  }
};


// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("GET USERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
    });
  }
};


// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent deleting admin account
    if (user.role === "admin") {
      return res.status(400).json({
        success: false,
        message: "Admin user cannot be deleted",
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("DELETE USER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete user",
    });
  }
};