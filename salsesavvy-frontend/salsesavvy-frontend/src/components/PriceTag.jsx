export default function PriceTag({ price, size = "md" }) {
  const sizeClasses = {
    sm: "text-sm px-2 py-0.5",
    md: "text-base px-3 py-1",
    lg: "text-2xl px-4 py-1.5",
  };

  return (
    <span
      className={`relative tag-notch inline-flex items-center font-mono font-bold bg-ink text-paper rounded-r-sm rounded-l-none ${sizeClasses[size]}`}
    >
      ₹{Number(price).toFixed(2)}
    </span>
  );
}
