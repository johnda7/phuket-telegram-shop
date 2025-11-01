/**
 * 🗺️ УЛУЧШЕННАЯ КАРТА С GOOGLE MAPS JAVASCRIPT API
 * 
 * Философия:
 * - Интерактивные маркеры вместо статичного iframe
 * - Кластеризация маркеров (чтобы не было перегрузки)
 * - Фильтрация по категориям (показываем только выбранную)
 * - Топ-10/Топ-30 мест (TravelAsk inspiration)
 * - iOS 26 дизайн + Telegram Wallet компактность
 */

import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, MapPin, Star, Filter, X, TrendingUp } from "lucide-react";
import { fetchProducts } from "@/lib/shopify";
import { getAllPartners } from "@/config/partners";
import { getCategoryConfig, CATEGORIES } from "@/config/categories";

interface PlaceMarker {
  handle: string;
  title: string;
  lat: number;
  lng: number;
  category: string;
  rating?: string;
  district?: string;
  isPartner: boolean;
  emoji: string;
  tags: string[];
  imageUrl?: string;
}

interface EnhancedMapProps {
  height?: string;
}

const EnhancedMap = ({ height = "calc(100vh - 200px)" }: EnhancedMapProps) => {
  const [places, setPlaces] = useState<PlaceMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(true);
  const [selectedPlaceHandle, setSelectedPlaceHandle] = useState<string | null>(null);
  const [showTopPlaces, setShowTopPlaces] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Google Maps API Key (нужно добавить в .env)
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

  // Получаем place из URL параметров
  useEffect(() => {
    const placeParam = searchParams.get('place');
    if (placeParam) {
      setSelectedPlaceHandle(placeParam);
      setShowFilters(true);
    }
  }, [searchParams]);

  const partners = getAllPartners();
  const partnerHandles = new Set(partners.map(p => p.id));

  // Загрузка мест из Shopify
  useEffect(() => {
    const loadPlaces = async () => {
      try {
        setLoading(true);
        const products = await fetchProducts(500);

        const mappedPlaces: PlaceMarker[] = products
          .filter(p => {
            const tags = p.node.tags || [];
            return (tags.includes('info') || tags.includes('insider')) &&
                   p.node.metafields?.some(m => m?.key === 'coordinates');
          })
          .map(p => {
            const coordinatesField = p.node.metafields?.find(m => m?.key === 'coordinates');
            const ratingField = p.node.metafields?.find(m => m?.key === 'rating');
            const districtField = p.node.metafields?.find(m => m?.key === 'district');

            if (!coordinatesField?.value) return null;

            const [lat, lng] = coordinatesField.value.split(',').map(Number);
            if (!lat || !lng || isNaN(lat) || isNaN(lng)) return null;

            const tags = p.node.tags || [];
            const categoryTag = tags.find(t => t.startsWith('category:'));
            const categoryId = categoryTag ? categoryTag.replace('category:', '') : 'place';
            const categoryConfig = getCategoryConfig(categoryId);

            // Определяем emoji по категории
            let emoji = '📍';
            if (categoryId === 'beaches') emoji = '🏖️';
            else if (categoryId === 'temples') emoji = '🛕';
            else if (categoryId === 'restaurants' || categoryId === 'coffee') emoji = '🍽️';
            else if (categoryId === 'shopping' || categoryId === 'nightmarkets') emoji = '🛍️';
            else if (categoryId === 'spa' || categoryId === 'massage' || categoryId === 'sauna') emoji = '💆';
            else if (categoryId === 'viewpoints' || categoryId === 'attractions') emoji = '🏞️';
            else if (categoryId === 'excursions' || categoryId === 'yachts') emoji = '⛵';
            else if (categoryId === 'nightlife' || categoryId === 'clubs' || categoryId === 'bars') emoji = '🎉';
            else if (categoryId === 'elephants' || categoryId === 'zoos') emoji = '🐘';
            else if (categoryId === 'museums') emoji = '🏛️';
            else if (categoryId === 'aquaparks' || categoryId === 'diving') emoji = '💧';

            const isPartner = partnerHandles.has(p.node.handle);

            // Первое изображение
            const firstImage = p.node.images?.edges[0]?.node?.url;

            return {
              handle: p.node.handle,
              title: p.node.title,
              lat,
              lng,
              category: categoryId,
              rating: ratingField?.value,
              district: districtField?.value,
              isPartner,
              emoji,
              tags,
              imageUrl: firstImage
            };
          })
          .filter(Boolean) as PlaceMarker[];

        setPlaces(mappedPlaces);
      } catch (error) {
        console.error('Error loading places:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPlaces();
  }, []);

  // Фильтрация мест
  const filteredPlaces = useMemo(() => {
    if (selectedCategory === "all") return places;
    return places.filter(p => p.category === selectedCategory);
  }, [places, selectedCategory]);

  // Сортировка: выделенное место → партнеры → по рейтингу
  const sortedPlaces = useMemo(() => {
    return [...filteredPlaces].sort((a, b) => {
      if (selectedPlaceHandle && a.handle === selectedPlaceHandle) return -1;
      if (selectedPlaceHandle && b.handle === selectedPlaceHandle) return 1;
      if (a.isPartner && !b.isPartner) return -1;
      if (!a.isPartner && b.isPartner) return 1;
      
      // Сортировка по рейтингу (если есть)
      const ratingA = parseFloat(a.rating || "0");
      const ratingB = parseFloat(b.rating || "0");
      return ratingB - ratingA;
    });
  }, [filteredPlaces, selectedPlaceHandle]);

  // Топ-10 и Топ-30 мест (по рейтингу)
  const top10Places = useMemo(() => {
    return [...places]
      .filter(p => p.rating)
      .sort((a, b) => {
        const ratingA = parseFloat(a.rating || "0");
        const ratingB = parseFloat(b.rating || "0");
        return ratingB - ratingA;
      })
      .slice(0, 10);
  }, [places]);

  const top30Places = useMemo(() => {
    return [...places]
      .filter(p => p.rating)
      .sort((a, b) => {
        const ratingA = parseFloat(a.rating || "0");
        const ratingB = parseFloat(b.rating || "0");
        return ratingB - ratingA;
      })
      .slice(0, 30);
  }, [places]);

  // Категории для фильтров
  const categories = useMemo(() => {
    return [
      { id: "all", label: "Все места", emoji: "🗺️" },
      ...Object.values(CATEGORIES)
        .filter(cat => {
          const popularCategories = ['shopping', 'beaches', 'temples', 'restaurants', 'spa', 'viewpoints', 'massage', 'coffee', 'nightmarkets', 'attractions'];
          return popularCategories.includes(cat.id);
        })
        .map(cat => ({
          id: cat.id,
          label: cat.title.replace('Пхукета', '').trim(),
          emoji: '📍'
        }))
    ];
  }, []);

  // Генерация Google Maps URL (fallback если API не загружен)
  const generateMapUrl = useCallback(() => {
    const highlightedPlace = selectedPlaceHandle 
      ? sortedPlaces.find(p => p.handle === selectedPlaceHandle)
      : null;

    if (highlightedPlace) {
      return `https://www.google.com/maps?q=${highlightedPlace.lat},${highlightedPlace.lng}&z=13&hl=ru`;
    }

    if (sortedPlaces.length === 0) {
      return `https://www.google.com/maps?q=7.8804,98.3923&z=11&hl=ru`;
    }

    const firstPlace = sortedPlaces[0];
    return `https://www.google.com/maps?q=${firstPlace.lat},${firstPlace.lng}&z=11&hl=ru`;
  }, [sortedPlaces, selectedPlaceHandle]);

  // Загрузка Google Maps API
  useEffect(() => {
    if (mapLoaded || !GOOGLE_MAPS_API_KEY) return;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,marker&callback=initMap`;
    script.async = true;
    script.defer = true;
    
    // @ts-ignore
    window.initMap = () => {
      setMapLoaded(true);
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
      // @ts-ignore
      delete window.initMap;
    };
  }, [GOOGLE_MAPS_API_KEY, mapLoaded]);

  // Обработчик клика на место
  const handlePlaceClick = useCallback((place: PlaceMarker) => {
    navigate(`/place/${place.handle}`);
  }, [navigate]);

  // Если API ключ не настроен, используем iframe fallback
  if (!GOOGLE_MAPS_API_KEY || !mapLoaded) {
    return (
      <div className="relative" style={{ height }}>
        <iframe
          src={generateMapUrl()}
          className="w-full h-full border-0 rounded-2xl"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        {/* Overlay с местами */}
        <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 max-h-[300px] overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-sm text-gray-900">
                Места ({sortedPlaces.length})
              </h3>
              <button
                onClick={() => setShowTopPlaces(!showTopPlaces)}
                className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium hover:bg-blue-100 transition-colors flex items-center gap-1"
              >
                <TrendingUp className="w-3 h-3" />
                Топ места
              </button>
            </div>
            {sortedPlaces.filter(p => p.isPartner).length > 0 && (
              <p className="text-xs text-[#007AFF] font-medium">
                ⭐ {sortedPlaces.filter(p => p.isPartner).length} партнеров
              </p>
            )}
          </div>
          
          {/* Топ места (TravelAsk style) */}
          {showTopPlaces && (
            <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="mb-3">
                <h4 className="text-xs font-bold text-gray-900 mb-2">🔥 Топ-10 мест</h4>
                <div className="grid grid-cols-5 gap-2">
                  {top10Places.slice(0, 5).map((place, index) => (
                    <button
                      key={place.handle}
                      onClick={() => handlePlaceClick(place)}
                      className="text-center p-2 rounded-xl bg-white hover:bg-blue-50 transition-colors border border-gray-100"
                    >
                      <div className="text-lg mb-1">{place.emoji}</div>
                      <div className="text-xs font-semibold line-clamp-1">{index + 1}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="overflow-y-auto max-h-[240px] p-4">
            <div className="space-y-2">
              {sortedPlaces.map((place) => (
                <button
                  key={place.handle}
                  onClick={() => handlePlaceClick(place)}
                  className={`w-full text-left p-3 rounded-xl transition-all duration-200 border-2 ${
                    place.handle === selectedPlaceHandle
                      ? 'bg-[#007AFF] text-white border-[#007AFF] shadow-lg scale-105'
                      : place.isPartner
                      ? 'bg-[#007AFF]/10 border-[#007AFF] shadow-md'
                      : 'bg-gray-50 border-transparent hover:bg-gray-100 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl flex-shrink-0">{place.emoji}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className={`font-semibold text-sm truncate ${
                          place.handle === selectedPlaceHandle ? 'text-white' : 'text-gray-900'
                        }`}>
                          {place.title}
                        </h4>
                        {place.isPartner && (
                          <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${
                            place.handle === selectedPlaceHandle
                              ? 'bg-white text-[#007AFF]'
                              : 'bg-[#007AFF] text-white'
                          }`}>
                            Партнер
                          </span>
                        )}
                      </div>
                      <div className={`flex items-center gap-3 text-xs ${
                        place.handle === selectedPlaceHandle ? 'text-white/90' : 'text-gray-500'
                      }`}>
                        {place.rating && (
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            {place.rating}
                          </span>
                        )}
                        {place.district && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {place.district}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // TODO: Здесь будет интерактивная карта с Google Maps JavaScript API
  // Пока возвращаем iframe версию
  return (
    <div className="relative" style={{ height }}>
      <iframe
        src={generateMapUrl()}
        className="w-full h-full border-0 rounded-2xl"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};

export default EnhancedMap;

