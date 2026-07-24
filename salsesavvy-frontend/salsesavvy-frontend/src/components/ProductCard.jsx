import { useState } from "react";
import PriceTag from "./PriceTag";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setAdding(true);
    try {
      await addToCart(product.product_id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } finally {
      setAdding(false);
    }
  };

  const imageUrl =
    (product.images && product.images[0]) ||
    "https://placehold.co/400x400/F7F4EC/1C1C1E?text=No+Image";

  return (
    <div className="group border border-line rounded-lg overflow-hidden bg-white/40 hover:shadow-lg transition-shadow">
      <div className="aspect-square bg-line/30 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = "https://placehold.co/400x400/F7F4EC/1C1C1E?text=No+Image";
          }}
        />
      </div>
      <div className="p-4 flex flex-col gap-2">
        <h3 className="font-display font-700 text-xl leading-tight">{product.name}</h3>
        <p className="font-body text-sm text-ink/60 line-clamp-2">{product.description}</p>
        <div className="flex items-center justify-between pt-2">
          <PriceTag price={product.price} />
          <button
            onClick={handleAdd}
            disabled={adding}
            className={`font-body text-sm font-semibold rounded-full px-4 py-2 transition-colors ${
              added
                ? "bg-sage text-white"
                : "bg-ink text-paper hover:bg-sale"
            }`}
          >
            {added ? "Added ✓" : adding ? "Adding..." : "Add to cart"}
          </button>
        </div>
      </div>
    </div>
  );
}