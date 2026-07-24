import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import PriceTag from "../components/PriceTag";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function Checkout() {
  const { cart, refreshCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [status, setStatus] = useState("idle"); // idle | processing | success | failed
  const [error, setError] = useState("");

  const handlePay = async () => {
    setError("");
    setStatus("processing");

    try {
      // Step 1: convert cart into a PENDING order
      const checkoutRes = await api.post("/api/orders/checkout");
      const { orderId } = checkoutRes.data;

      // Step 2: create the Razorpay order
      const paymentRes = await api.post(`/api/payments/create-order/${orderId}`);
      const { razorpayOrderId, amount, currency, razorpayKeyId } = paymentRes.data;

      // Step 3: load Razorpay checkout script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setError("Could not load Razorpay checkout. Check your internet connection.");
        setStatus("failed");
        return;
      }

      // Step 4: open Razorpay's checkout popup
      const options = {
        key: razorpayKeyId,
        amount,
        currency,
        name: "SalseSavvy",
        description: `Order ${orderId}`,
        order_id: razorpayOrderId,
        handler: async function (response) {
          try {
            await api.post("/api/payments/verify", {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });
            setStatus("success");
            await refreshCart();
          } catch (err) {
            setStatus("failed");
            setError("Payment verification failed.");
          }
        },
        modal: {
          ondismiss: function () {
            if (status !== "success") {
              setStatus("idle");
            }
          },
        },
        prefill: {
          name: user?.username || "",
        },
        theme: {
          color: "#D6402C",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function () {
        setStatus("failed");
        setError("Payment failed. Please try again.");
      });
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong during checkout.");
      setStatus("failed");
    }
  };

  const products = cart.products || [];

  if (status === "success") {
    return (
      <div className="max-w-lg mx-auto px-6 py-24 text-center">
        <span className="font-mono text-xs tracking-widest uppercase text-sage font-bold">
          Order confirmed
        </span>
        <h1 className="font-display font-800 text-4xl mt-2 mb-4">Payment successful!</h1>
        <p className="font-body text-ink/60 mb-8">
          Your order has been placed. You can track it from your orders page.
        </p>
        <button
          onClick={() => navigate("/orders")}
          className="bg-ink text-paper font-body font-semibold rounded-full px-6 py-2.5 hover:bg-sale transition-colors"
        >
          View my orders
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-6 py-10">
      <div className="mb-8">
        <span className="font-mono text-xs tracking-widest uppercase text-sale font-bold">
          Final step
        </span>
        <h1 className="font-display font-800 text-4xl mt-1">Checkout</h1>
      </div>

      {products.length === 0 ? (
        <p className="font-body text-ink/60">Your cart is empty.</p>
      ) : (
        <>
          <div className="border border-line rounded-lg p-5 bg-white/40 mb-6">
            <h2 className="font-display font-700 text-lg mb-3">Order summary</h2>
            <div className="flex flex-col gap-2 mb-4">
              {products.map((item, idx) => (
                <div key={idx} className="flex justify-between font-body text-sm">
                  <span className="text-ink/70">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-mono">₹{Number(item.total_price).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-line pt-4">
              <span className="font-display font-700 text-lg">Total</span>
              <PriceTag price={cart.overall_total_price} size="lg" />
            </div>
          </div>

          {error && (
            <p className="text-sale text-sm font-body font-medium mb-4">{error}</p>
          )}

          <button
            onClick={handlePay}
            disabled={status === "processing"}
            className="w-full bg-sale text-paper font-body font-semibold rounded-full py-3 hover:bg-ink transition-colors disabled:opacity-60"
          >
            {status === "processing" ? "Processing..." : "Pay with Razorpay"}
          </button>

          <p className="font-body text-xs text-ink/40 text-center mt-4">
            Test mode — use Razorpay's test card 4111 1111 1111 1111, any future date, any CVV.
          </p>
        </>
      )}
    </div>
  );
}
