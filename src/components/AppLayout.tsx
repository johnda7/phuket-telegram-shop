
import { ReactNode } from "react";
import { BottomNav } from "./BottomNav";
import { TourMenu } from "./TourMenu";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { Link } from "react-router-dom";
import logo from "@/assets/phuketda-logo-temp.svg";

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const cartItems = useCartStore((state) => state.items);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col pb-16">
      {/* Top bar - iOS 26 style */}
      <header className="glass-nav fixed top-0 left-0 right-0 z-40 safe-area-inset-top">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TourMenu />
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="PhuketDA Logo" className="h-8 w-8 rounded-full bg-white shadow" />
              <span className="font-bold text-lg text-[#007AFF]">PhuketDA</span>
            </Link>
          </div>
          
          <Link to="/cart" className="relative p-2">
            <ShoppingCart className="w-5 h-5 text-foreground" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Main content with padding for fixed header */}
      <main className="flex-1 pt-14">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};
