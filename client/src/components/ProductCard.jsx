import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div>
      <div>
        {product.images?.length > 0 ? (
          <img src={product.images[0]} alt={product.name} />
        ) : (
          <div>No Image</div>
        )}
      </div>

      <p>{product.brand}</p>

      <h2>{product.name}</h2>

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

      <button onClick={() => navigate(`/products/${product._id}`)}>
        View Product
      </button>
    </div>
  );
}

export default ProductCard;
