import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`);

        setProduct(response.data.product);
      } catch (error) {
        console.error(error);

        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  if (!product) {
    return <h1>Product not found</h1>;
  }

  return (
    <div>
      {/* Image */}
      <div>
        {product.images?.length > 0 ? (
          <img src={product.images[0]} alt={product.name} />
        ) : (
          <div>No Image Available</div>
        )}
      </div>

      {/* Details */}
      <div>
        <p>{product.brand}</p>

        <h1>{product.name}</h1>

        <p>{product.description}</p>

        <div>
          {product.discountPrice ? (
            <>
              <span>₹{product.discountPrice}</span>

              <span>₹{product.price}</span>
            </>
          ) : (
            <span>₹{product.price}</span>
          )}
        </div>

        {/* Size */}
        <div>
          <h3>Select Size</h3>

          {product.sizes.map((size) => (
            <button key={size} onClick={() => setSelectedSize(size)}>
              {size}
            </button>
          ))}
        </div>

        {/* Color */}
        <div>
          <h3>Select Color</h3>

          {product.colors.map((color) => (
            <button key={color} onClick={() => setSelectedColor(color)}>
              {color}
            </button>
          ))}
        </div>

        {/* Quantity */}
        <div>
          <h3>Quantity</h3>

          <button onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>
            -
          </button>

          <span>{quantity}</span>

          <button
            onClick={() =>
              setQuantity((prev) => Math.min(product.stock, prev + 1))
            }
          >
            +
          </button>
        </div>

        {/* Stock */}
        <p>
          {product.stock > 0
            ? `${product.stock} items available`
            : "Out of stock"}
        </p>

        <button disabled={product.stock === 0}>Add to Cart 🛒</button>
      </div>
    </div>
  );
}

export default ProductDetails;
