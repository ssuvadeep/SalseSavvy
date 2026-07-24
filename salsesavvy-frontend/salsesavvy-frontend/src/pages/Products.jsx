import { useEffect, useState } from "react";
import api from "../api/axios";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/api/products");
        setProducts(res.data.products || []);
      } catch (err) {
        setError("Could not load products. Check that /api/products exists on your backend.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <span className="font-mono text-xs tracking-widest uppercase text-sale font-bold">
            The full catalog
          </span>
          <h1 className="font-display font-800 text-4xl mt-1">Shop everything</h1>
        </div>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-line rounded-full px-5 py-2.5 font-body text-sm bg-white/60 focus:outline-none focus:ring-2 focus:ring-sale/40 focus:border-sale w-full md:w-72"
        />
      </div>

      {loading && (
        <p className="font-body text-ink/60">Loading products...</p>
      )}

      {error && (
        <div className="border border-sale/30 bg-sale/5 rounded-md p-4 font-body text-sm text-sale">
          {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className="font-body text-ink/60">No products found.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map((product) => (
          <ProductCard key={product.product_id} product={product} />
        ))}
      </div>
    </div>
  );
}