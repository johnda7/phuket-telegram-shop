import { Link, useLocation } from "react-router-dom";
import { Home, Briefcase, Map, ShoppingCart, User, Grid3x3, Handshake } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

const navItems = [
  { icon: Home, label: "Главная", path: "/" },
  { icon: Grid3x3, label: "Категории", path: "/categories" },
  { icon: Map, label: "Карта", path: "/map" },
  { icon: Handshake, label: "Партнеры", path: "/partners" },
  { icon: User, label: "Профиль", path: "/profile" },
];

export const BottomNav = () => {
  const location = useLocation();
  const cartItems = useCartStore((state) => state.items);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 z-50 safe-area-inset-bottom"
      style={{
        background: 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        borderTop: '1px solid rgba(0, 0, 0, 0.08)',
        boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.5)'
      }}
    >
      <div className="max-w-7xl mx-auto px-2 pb-2 pt-1">
        <div className="flex items-center justify-around h-14">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || 
                            (item.path === '/tours' && location.pathname === '/phuket');
            const isCart = item.path === "/cart";

            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center justify-center flex-1 h-full group transition-all duration-200"
                style={{
                  transform: isActive ? 'translateY(-2px)' : 'translateY(0)'
                }}
              >
                {/* Icon container with liquid animation */}
                <div className="relative">
                  <div
                    className="absolute inset-0 rounded-full transition-all duration-200"
                    style={{
                      background: isActive 
                        ? 'rgba(0, 122, 255, 0.15)' 
                        : 'transparent',
                      transform: isActive ? 'scale(1.5)' : 'scale(1)',
                      opacity: isActive ? 1 : 0
                    }}
                  />
                  <Icon
                    className={`w-5 h-5 transition-all duration-200 relative z-10 ${
                      isActive
                        ? "text-[#007AFF] scale-110"
                        : "text-[#8E8E93] group-hover:text-[#007AFF] group-hover:scale-105"
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  
                  {/* Cart badge - Telegram style */}
                  {isCart && cartItemCount > 0 && (
                    <span 
                      className="absolute -top-1.5 -right-1.5 bg-[#007AFF] text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-lg"
                      style={{
                        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                        boxShadow: '0 2px 8px rgba(0, 122, 255, 0.4)'
                      }}
                    >
                      {cartItemCount > 9 ? '9+' : cartItemCount}
                    </span>
                  )}
                </div>

                {/* Label - Compact iOS 26 */}
                <span
                  className={`text-[11px] mt-0.5 transition-all duration-200 ${
                    isActive
                      ? "text-[#007AFF] font-semibold"
                      : "text-[#8E8E93] group-hover:text-[#007AFF]"
                  }`}
                  style={{
                    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                    letterSpacing: '-0.01em'
                  }}
                >
                  {item.label}
                </span>

                {/* Active indicator - Liquid dot */}
                {isActive && (
                  <div 
                    className="absolute bottom-0 w-1 h-1 bg-[#007AFF] rounded-full"
                    style={{
                      boxShadow: '0 0 8px rgba(0, 122, 255, 0.6)'
                    }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
