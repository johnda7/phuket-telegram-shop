import { useEffect, useState } from "react";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import { CircleTourCard } from "./CircleTourCard";

export const FeaturedToursSection = () => {
  const [topTours, setTopTours] = useState<ShopifyProduct["node"][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTours = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts(100);
        
        // Фильтруем ТОЛЬКО ТУРЫ
        const toursOnly = data.filter(p => {
          const type = (p.node.productType || '').toLowerCase();
          const hasTourTag = p.node.tags.includes('tour');
          return type === 'excursions' || type === 'экскурсии' || hasTourTag;
        });
        
        // Сортируем: популярные (с тегами 'popular', 'хит', 'ХИТ', 'популярное') → остальные
        const isPopular = (tags: string[]) => tags.some(t => 
          ['popular','популярное','хит','ХИТ'].includes(t.toLowerCase())
        );
        
        const sortedTours = toursOnly.sort((a, b) => {
          const aPop = isPopular(a.node.tags) ? 1 : 0;
          const bPop = isPopular(b.node.tags) ? 1 : 0;
          if (aPop !== bPop) return bPop - aPop;
          return 0; // Сохраняем порядок для одинаковой популярности
        });
        
        // Берем топ-6 туров
        setTopTours(sortedTours.slice(0, 6).map(t => t.node));
      } catch (error) {
        console.error('Failed to load featured tours:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTours();
  }, []);

  if (loading || topTours.length === 0) {
    return null;
  }

  return (
    <section className="py-6 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-4">
          <h2 
            className="text-[20px] md:text-[24px] font-bold"
            style={{ fontFamily: "'SF Pro Display', -apple-system, system-ui, sans-serif", color: '#1C1C1E' }}
          >
            🔥 ХИТ ПРОДАЖ
          </h2>
          <span 
            className="text-[12px] text-gray-500"
            style={{ fontFamily: "'SF Pro Text', -apple-system, system-ui, sans-serif" }}
          >
            Топ-{topTours.length} туров
          </span>
        </div>
        <div 
          className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
          style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {topTours.map((tour) => (
            <CircleTourCard
              key={tour.id}
              product={tour}
              detailPath={`/product/${tour.handle}`}
            />
          ))}
        </div>
        <div className="flex justify-center mt-2 md:hidden">
          <div className="flex gap-1.5">
            {topTours.map((_, index) => (
              <div key={index} className="w-1.5 h-1.5 rounded-full bg-gray-300" />
            ))}
          </div>
        </div>
      </div>
      <style>{".scrollbar-hide::-webkit-scrollbar { display: none; }"}</style>
    </section>
  );
};

