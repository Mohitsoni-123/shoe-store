import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

export const createOrder = async (req, res) => {
  try {
    const {
      name,
      phone,
      address,
      city,
      state,
      pincode,
      paymentMethod = "COD",
    } = req.body;

    // Validate shipping address
    if (
      !name ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "All shipping address fields are required",
      });
    }

    // Find user's cart
    const cart = await Cart.findOne({
      user: req.user.id,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // Create order items
    const orderItems = cart.items.map((item) => {
      const product = item.product;

      const price =
        product.discountPrice ?? product.price;

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
      (total, item) => {
        return total + item.price * item.quantity;
      },
      0
    );

    // Create order
    const order = await Order.create({
      user: req.user.id,

      items: orderItems,

      shippingAddress: {
        name,
        phone,
        address,
        city,
        state,
        pincode,
      },

      totalAmount,

      paymentMethod,

      paymentStatus:
        paymentMethod === "COD"
          ? "Pending"
          : "Pending",

      status: "Pending",
    });

    // Clear cart after order creation
    cart.items = [];

    await cart.save();

    const populatedOrder = await Order.findById(
      order._id
    ).populate("items.product");

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: populatedOrder,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};


export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.id,
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};