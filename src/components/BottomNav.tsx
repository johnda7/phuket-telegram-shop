import { Link, useLocation } from "react-router-dom";
import { Home, Compass, MessageCircle, ShoppingCart, User } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

const navItems = [
  { icon: Home, label: "Главная", path: "/" },
  { icon: Compass, label: "Пхукет", path: "/phuket" },
  { icon: MessageCircle, label: "AI Консьерж", path: "/ai-concierge" },
  { icon: ShoppingCart, label: "Корзина", path: "/cart" },
  { icon: User, label: "Профиль", path: "/profile" },
];

export const BottomNav = () => {
  const location = useLocation();
  const cartItems = useCartStore((state) => state.items);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-nav safe-area-inset-bottom">
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            const isCart = item.path === "/cart";

            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center justify-center flex-1 h-full group"
              >
                {/* Icon container with smooth iOS animation */}
                <div className="relative">
                  <Icon
                    className={`w-6 h-6 transition-all duration-200 ${
                      isActive
                        ? "text-primary scale-110"
                        : "text-muted-foreground group-hover:text-primary group-hover:scale-105"
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  
                  {/* Cart badge */}
                  {isCart && cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-scale-in">
                      {cartItemCount}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span
                  className={`text-xs mt-1 transition-all duration-200 ${
                    isActive
                      ? "text-primary font-semibold"
                      : "text-muted-foreground group-hover:text-primary"
                  }`}
                >
                  {item.label}
                </span>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute bottom-0 w-12 h-1 bg-primary rounded-full animate-fade-in" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
