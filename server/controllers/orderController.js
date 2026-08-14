import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res) => {
  try {
    const {
      name, phone, address, city, state, pincode,
      paymentMethod = "COD",
    } = req.body;

    // Validate shipping address
    if (!name || !phone || !address || !city || !state || !pincode) {
      return res.status(400).json({
        success: false,
        message: "All shipping address fields are required",
      });
    }

    // Find user's cart
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Check stock availability
    for (const item of cart.items) {
      const product = item.product;

      if (!product || product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product?.name || "A product"} in your cart is out of stock`,
        });
      }
    }

    // Create order items
    // NOTE: uses `||` not `??` — discountPrice defaults to 0, and `0 ?? price`
    // would incorrectly return 0 since 0 is not null/undefined.
    const orderItems = cart.items.map((item) => {
      const product = item.product;
      const price = product.discountPrice || product.price;

      return {
        product: product._id,
        name: product.name,
        price: Number(price),
        quantity: Number(item.quantity),
        size: item.size,
      };
    });

    // Calculate total
    const totalAmount = orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Create order
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      shippingAddress: { name, phone, address, city, state, pincode },
      totalAmount,
      paymentMethod,
      paymentStatus: "Pending",
      status: "Pending",
    });

    // Decrement stock for each ordered product
    await Promise.all(
      cart.items.map((item) =>
        Product.findByIdAndUpdate(item.product._id, {
          $inc: { stock: -item.quantity },
        })
      )
    );

    // Clear cart after order creation
    cart.items = [];
    await cart.save();

    const populatedOrder = await Order.findById(order._id).populate("items.product");

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product", "name price discountPrice image")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("GET ALL ORDERS ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid order status" });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.status = status;
    await order.save();

    const updatedOrder = await Order.findById(id)
      .populate("user", "name email")
      .populate("items.product", "name price discountPrice image");

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("UPDATE ORDER STATUS ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to update order status" });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({ _id: id, user: req.user.id })
      .populate("items.product")
      .populate("user", "name email");

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("GET ORDER BY ID ERROR:", error);
    res.status(500).json({ success: false, message: "Failed to fetch order details" });
  }
};