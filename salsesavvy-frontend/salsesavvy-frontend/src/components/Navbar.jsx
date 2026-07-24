import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-40 bg-paper/95 backdrop-blur border-b border-line">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display font-800 text-3xl tracking-tight leading-none">
            Salse<span className="text-sale">Savvy</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 font-body text-sm font-medium text-ink/70">
          <Link to="/" className="hover:text-ink transition-colors">Shop</Link>
          {user && (
            <Link to="/orders" className="hover:text-ink transition-colors">Orders</Link>
          )}
          {user?.role === "ADMIN" && (
            <Link to="/admin" className="hover:text-ink transition-colors">Admin</Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {user && (
            <Link
              to="/cart"
              className="relative font-mono text-sm font-semibold border border-ink/20 rounded-full px-4 py-1.5 hover:border-ink transition-colors"
            >
              Cart
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-sale text-paper text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {itemCount}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="font-body text-sm font-semibold text-ink/70 hover:text-sale transition-colors"
            >
              Log out
            </button>
          ) : (
            <Link
              to="/login"
              className="font-body text-sm font-semibold bg-ink text-paper rounded-full px-5 py-2 hover:bg-sale transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
