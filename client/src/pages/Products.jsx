import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

function Products() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");


  const [initialLoading, setInitialLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/products", {
        params: {
          search,
          category,
          brand,
          minPrice,
          maxPrice,
          sort,
        },
      });

      setProducts(response.data.products);
    } catch (error) {
      console.error(error);
      setError("Failed to load products");
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, category, brand, minPrice, maxPrice, sort]);

  const clearFilters = () => {
  setSearch("");
  setCategory("");
  setBrand("");
  setMinPrice("");
  setMaxPrice("");
  setSort("");
};

  if (initialLoading) {
    return <h1>Loading products...</h1>;
  }

  if (error) {
    return <h1>{error}</h1>;
  }

  return (
    <div>
      <h1>All Shoes</h1>

      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search shoes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Category */}
      <div>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Kids">Kids</option>
          <option value="Sports">Sports</option>
        </select>
      </div>

      {/* Brand */}
      <div>
        <select value={brand} onChange={(e) => setBrand(e.target.value)}>
          <option value="">All Brands</option>
          <option value="Nike">Nike</option>
          <option value="Adidas">Adidas</option>
          <option value="Puma">Puma</option>
          <option value="Reebok">Reebok</option>
        </select>
      </div>

      <div>
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>

      <select value={sort} onChange={(e) => setSort(e.target.value)}>
        <option value="">Sort By</option>

        <option value="price_asc">Price: Low to High</option>

        <option value="price_desc">Price: High to Low</option>

        <option value="newest">Newest</option>
      </select>

      {/* Clear */}
      <div>
        <button onClick={clearFilters}>Clear Filters</button>
      </div>

      {/* Products */}
      <div>
        {products.length === 0 ? (
          <p>No products found</p>
        ) : (
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        )}
      </div>
    </div>
  );
}

export default Products;
