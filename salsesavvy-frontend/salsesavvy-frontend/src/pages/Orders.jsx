import { useEffect, useState } from "react";
import api from "../api/axios";
import PriceTag from "../components/PriceTag";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/api/orders");
        setOrders(res.data.products || []);
      } catch (err) {
        setError("Could not load orders.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-8">
        <span className="font-mono text-xs tracking-widest uppercase text-sale font-bold">
          Order history
        </span>
        <h1 className="font-display font-800 text-4xl mt-1">My orders</h1>
      </div>

      {loading && <p className="font-body text-ink/60">Loading orders...</p>}
      {error && <p className="font-body text-sale text-sm">{error}</p>}

      {!loading && orders.length === 0 && !error && (
        <p className="font-body text-ink/60">You haven't completed any orders yet.</p>
      )}

      <div className="flex flex-col gap-4">
        {orders.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 border border-line rounded-lg p-4 bg-white/40"
          >
            <img
              src={item.image_url || "https://placehold.co/100x100/F7F4EC/1C1C1E?text=No+Image"}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-md"
              onError={(e) => {
                e.target.src = "https://placehold.co/100x100/F7F4EC/1C1C1E?text=No+Image";
              }}
            />
            <div className="flex-1">
              <h3 className="font-display font-700 text-lg leading-tight">{item.name}</h3>
              <p className="font-body text-sm text-ink/60">Qty: {item.quantity}</p>
              <p className="font-mono text-xs text-ink/40 mt-1">Order #{item.order_id}</p>
            </div>
            <PriceTag price={item.total_price} />
          </div>
        ))}
      </div>
    </div>
  );
}
