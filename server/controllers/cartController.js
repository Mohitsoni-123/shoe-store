import Cart from "../models/Cart.js";

export const addToCart = async (req, res) => {
  try {
    const { productId, size, quantity = 1 } = req.body;

    if (!productId || !size) {
      return res.status(400).json({
        success: false,
        message: "Product and size are required",
      });
    }

    let cart = await Cart.findOne({
      user: req.user.id,
    });

    // Cart doesn't exist
    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [
          {
            product: productId,
            size,
            quantity: Number(quantity),
          },
        ],
      });
    } else {
      // Check if same product + same size already exists
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId && item.size === size,
      );

      if (existingItem) {
        existingItem.quantity += Number(quantity);
      } else {
        cart.items.push({
          product: productId,
          size,
          quantity: Number(quantity),
        });
      }

      await cart.save();
    }

    const updatedCart = await Cart.findOne({
      user: req.user.id,
    }).populate("items.product");

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      cart: updatedCart,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to add product to cart",
    });
  }
};

export const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      user: req.user.id,
    }).populate("items.product");

    // Cart doesn't exist
    if (!cart) {
      return res.status(200).json({
        success: true,
        cart: {
          items: [],
        },
      });
    }

    // Remove old/deleted products from cart
    const validItems = cart.items.filter(
      (item) => item.product !== null
    );

    // If invalid products were found, update DB
    if (validItems.length !== cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.error("GET CART ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch cart",
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId, size, quantity } = req.body;

    if (!productId || !size || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Product, size and quantity are required",
      });
    }

    const cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (item) =>
        item.product.toString() === String(productId) &&
        String(item.size) === String(size),
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    if (Number(quantity) <= 0) {
      cart.items = cart.items.filter(
        (item) =>
          !(
            item.product.toString() === String(productId) &&
            String(item.size) === String(size)
          ),
      );
    } else {
      item.quantity = Number(quantity);
    }

    await cart.save();

    const updatedCart = await Cart.findOne({
      user: req.user.id,
    }).populate("items.product");

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      cart: updatedCart,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to update cart",
    });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const { productId, size } = req.body;

    if (!productId || !size) {
      return res.status(400).json({
        success: false,
        message: "Product and size are required",
      });
    }

    const cart = await Cart.findOne({
      user: req.user.id,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemExists = cart.items.some(
      (item) =>
        item.product.toString() === String(productId) &&
        String(item.size) === String(size),
    );

    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: "Cart item not found",
      });
    }

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.product.toString() === String(productId) &&
          String(item.size) === String(size)
        ),
    );

    await cart.save();

    const updatedCart = await Cart.findOne({
      user: req.user.id,
    }).populate("items.product");

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      cart: updatedCart,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Failed to remove product from cart",
    });
  }
};
