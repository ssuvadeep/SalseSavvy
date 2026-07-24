import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import PriceTag from "../components/PriceTag";

export default function Cart() {
  const { cart, loading, refreshCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const products = cart.products || [];

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-8">
        <span className="font-mono text-xs tracking-widest uppercase text-sale font-bold">
          Your selections
        </span>
        <h1 className="font-display font-800 text-4xl mt-1">Cart</h1>
      </div>

      {loading && <p className="font-body text-ink/60">Loading cart...</p>}

      {!loading && products.length === 0 && (
        <div className="border border-line rounded-lg p-10 text-center">
          <p className="font-body text-ink/60 mb-4">Your cart is empty.</p>
          <Link
            to="/"
            className="inline-block bg-ink text-paper font-body font-semibold rounded-full px-6 py-2.5 hover:bg-sale transition-colors"
          >
            Browse products
          </Link>
        </div>
      )}

      {products.length > 0 && (
        <div className="flex flex-col gap-4">
          {products.map((item, idx) => (
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
              </div>
              <PriceTag price={item.total_price} />
            </div>
          ))}

          <div className="flex items-center justify-between border-t border-line pt-6 mt-2">
            <span className="font-display font-700 text-xl">Total</span>
            <PriceTag price={cart.overall_total_price} size="lg" />
          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="mt-4 bg-sale text-paper font-body font-semibold rounded-full py-3 hover:bg-ink transition-colors"
          >
            Proceed to checkout
          </button>
        </div>
      )}
    </div>
  );
}
