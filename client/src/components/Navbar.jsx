import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { cart } = useCart();

  console.log("NAVBAR CART:", cart);

  const cartCount =
    cart?.items?.reduce((total, item) => {
      return total + Number(item.quantity || 1);
    }, 0) || 0;

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 40px",
        borderBottom: "1px solid #ddd",
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          textDecoration: "none",
          color: "black",
        }}
      >
        ShoeStore
      </Link>

      {/* Navigation */}
      <div
        style={{
          display: "flex",
          gap: "25px",
        }}
      >
        <Link to="/">Home</Link>

        <Link to="/products">
          Products
        </Link>

        <Link to="/cart">
          🛒 Cart ({cartCount})
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;