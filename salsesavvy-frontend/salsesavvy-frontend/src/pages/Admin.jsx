import { useEffect, useState } from "react";
import api from "../api/axios";
import PriceTag from "../components/PriceTag";

export default function Admin() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    imageUrl: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/products");
      setProducts(Array.isArray(res.data) ? res.data : res.data.products || []);
    } catch (err) {
      setMessage("Could not load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      // NOTE: adjust this endpoint/body to match your actual AdminProductController mapping
      await api.post("/api/admin/products", {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        categoryId: Number(form.categoryId),
        imageUrl: form.imageUrl,
      });
      setMessage("Product added successfully.");
      setForm({ name: "", description: "", price: "", stock: "", categoryId: "", imageUrl: "" });
      fetchProducts();
    } catch (err) {
      setMessage(err.response?.data?.error || "Could not add product. Check the admin endpoint path.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm("Delete this product?")) return;
    try {
      // NOTE: adjust this endpoint to match your actual AdminProductController mapping
      await api.delete(`/api/admin/products/${productId}`);
      fetchProducts();
    } catch (err) {
      setMessage("Could not delete product.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <span className="font-mono text-xs tracking-widest uppercase text-sale font-bold">
          Admin panel
        </span>
        <h1 className="font-display font-800 text-4xl mt-1">Manage products</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
        {/* Add product form */}
        <div className="border border-line rounded-lg p-5 bg-white/40 h-fit">
          <h2 className="font-display font-700 text-lg mb-4">Add new product</h2>
          <form onSubmit={handleAddProduct} className="flex flex-col gap-3">
            <input
              name="name"
              required
              placeholder="Product name"
              value={form.name}
              onChange={handleChange}
              className="border border-line rounded-md px-3 py-2 font-body text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sale/40"
            />
            <textarea
              name="description"
              required
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="border border-line rounded-md px-3 py-2 font-body text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sale/40"
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                name="price"
                type="number"
                step="0.01"
                required
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                className="border border-line rounded-md px-3 py-2 font-body text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sale/40"
              />
              <input
                name="stock"
                type="number"
                required
                placeholder="Stock"
                value={form.stock}
                onChange={handleChange}
                className="border border-line rounded-md px-3 py-2 font-body text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sale/40"
              />
            </div>
            <input
              name="categoryId"
              type="number"
              required
              placeholder="Category ID"
              value={form.categoryId}
              onChange={handleChange}
              className="border border-line rounded-md px-3 py-2 font-body text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sale/40"
            />
            <input
              name="imageUrl"
              required
              placeholder="Image URL"
              value={form.imageUrl}
              onChange={handleChange}
              className="border border-line rounded-md px-3 py-2 font-body text-sm bg-white focus:outline-none focus:ring-2 focus:ring-sale/40"
            />
            <button
              type="submit"
              disabled={submitting}
              className="mt-2 bg-ink text-paper font-body font-semibold rounded-full py-2.5 hover:bg-sale transition-colors disabled:opacity-60"
            >
              {submitting ? "Adding..." : "Add product"}
            </button>
            {message && (
              <p className="font-body text-xs text-ink/60 mt-1">{message}</p>
            )}
          </form>
        </div>

        {/* Product list */}
        <div>
          {loading && <p className="font-body text-ink/60">Loading products...</p>}
          <div className="flex flex-col gap-3">
            {products.map((product) => (
              <div
                key={product.productId ?? product.product_id}
                className="flex items-center gap-4 border border-line rounded-lg p-3 bg-white/40"
              >
                <div className="flex-1">
                  <h3 className="font-display font-700 text-base leading-tight">
                    {product.name}
                  </h3>
                  <p className="font-body text-xs text-ink/50">
                    Stock: {product.stock}
                  </p>
                </div>
                <PriceTag price={product.price} size="sm" />
                <button
                  onClick={() => handleDelete(product.productId ?? product.product_id)}
                  className="font-body text-xs font-semibold text-sale border border-sale/30 rounded-full px-3 py-1.5 hover:bg-sale hover:text-paper transition-colors"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
