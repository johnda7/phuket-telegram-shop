
import { ReactNode, useState } from "react";
import { BottomNav } from "./BottomNav";
import { TourMenu } from "./TourMenu";
import { ShoppingCart, Search, X } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/phuketda-logo-temp.svg";

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const cartItems = useCartStore((state) => state.items);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/phuket?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setShowSearch(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col pb-24">
      {/* Top bar - iOS 26 style with Global Search (Phukeo.com inspiration) */}
      <header 
        className="fixed top-0 left-0 right-0 z-40 safe-area-inset-top"
        style={{
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 1px 8px rgba(0, 0, 0, 0.06)'
        }}
      >
        <div className="max-w-7xl mx-auto px-3 md:px-4 h-14 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <TourMenu />
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <img src={logo} alt="PhuketDA Logo" className="h-7 w-7 md:h-8 md:w-8 rounded-full bg-white shadow" />
              <span className="font-bold text-base md:text-lg text-[#007AFF] hidden sm:inline">PhuketDA</span>
            </Link>
            
            {/* Global Search - Компактный (Phukeo.com style) */}
            {showSearch ? (
              <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Поиск туров..."
                    autoFocus
                    className="w-full pl-8 pr-8 py-1.5 rounded-lg border border-gray-200 bg-white/90 text-sm min-h-[36px] focus:outline-none focus:ring-1 focus:ring-[#007AFF] focus:border-[#007AFF]"
                    style={{
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setShowSearch(false);
                      setSearchQuery('');
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100"
                  >
                    <X className="w-3.5 h-3.5 text-gray-400" />
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="flex-1 max-w-md hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white/90 hover:bg-white transition-colors"
                style={{
                  minHeight: '36px'
                }}
              >
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-xs text-gray-500 flex-1 text-left">Поиск туров...</span>
              </button>
            )}
          </div>
          
          <Link to="/cart" className="relative p-2 flex-shrink-0" style={{ minHeight: '44px', minWidth: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingCart className="w-5 h-5 text-foreground" />
            {cartItemCount > 0 && (
              <span 
                className="absolute -top-1 -right-1 bg-[#007AFF] text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 shadow-lg"
                style={{
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                  boxShadow: '0 2px 8px rgba(0, 122, 255, 0.4)'
                }}
              >
                {cartItemCount > 9 ? '9+' : cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Main content with padding for fixed header and bottom nav */}
      <main className="flex-1 pt-14 pb-20">
        {children}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};
