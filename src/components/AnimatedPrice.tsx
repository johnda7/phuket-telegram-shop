import { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface AnimatedPriceProps {
  adultPrice: number;
  childPrice: number;
  className?: string;
}

export const AnimatedPrice = ({ adultPrice, childPrice, className = '' }: AnimatedPriceProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showChildPrice, setShowChildPrice] = useState(false);

  useEffect(() => {
    // Анимация каждые 3 секунды
    const interval = setInterval(() => {
      setIsAnimating(true);
      setShowChildPrice(prev => !prev);
      
      // Сброс анимации через 1 секунду
      setTimeout(() => {
        setIsAnimating(false);
      }, 1000);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const currentPrice = showChildPrice ? childPrice : adultPrice;
  const priceLabel = showChildPrice ? 'за ребёнка' : 'за взрослого';

  return (
    <div className={`relative ${className}`}>
      {/* Анимированная стрелка */}
      <div className={`absolute -top-2 -right-2 transition-all duration-500 ${
        isAnimating ? 'scale-110' : 'scale-100'
      }`}>
        {showChildPrice ? (
          <ChevronDown className="w-4 h-4 text-green-500 animate-bounce" />
        ) : (
          <ChevronUp className="w-4 h-4 text-blue-500 animate-bounce" />
        )}
      </div>

      {/* Цена с анимацией */}
      <div className={`transition-all duration-500 ${
        isAnimating ? 'scale-105' : 'scale-100'
      }`}>
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">от</div>
          <div className={`text-2xl font-bold transition-colors duration-500 ${
            showChildPrice ? 'text-green-600' : 'text-gray-900'
          }`}>
            {Math.round(currentPrice).toLocaleString()} ฿
          </div>
          <div className={`text-xs transition-colors duration-500 ${
            showChildPrice ? 'text-green-500' : 'text-gray-500'
          }`}>
            {priceLabel}
          </div>
        </div>
      </div>

      {/* Индикатор смены цены */}
      {isAnimating && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-medium text-gray-700 shadow-lg animate-pulse">
            {showChildPrice ? 'Детская цена' : 'Взрослая цена'}
          </div>
        </div>
      )}
    </div>
  );
};
