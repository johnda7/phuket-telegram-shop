/**
 * 🗺️ КАРТА ПУТЕШЕСТВЕННИКА ПХУКЕТА
 * 
 * Преимущество проекта - БЕСПЛАТНАЯ карта всех мест
 * Конкуренты продают карты, мы делаем бесплатно!
 * 
 * Философия:
 * - Показываем ВСЕ места из Shopify с координатами
 * - Партнеры выделены на карте (приоритет)
 * - При клике на маркер → переход на страницу места
 * - iOS 26 дизайн + Telegram Wallet компактность
 */

import { useEffect, useState, useMemo } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Loader2, MapPin, Star, ChevronDown, X, Search, Filter } from "lucide-react";
import { fetchProducts } from "@/lib/shopify";
import { getAllPartners } from "@/config/partners";
import { getAllCategories, type CategoryConfig } from "@/config/categories";
import { getPlaceMetafields } from "@/data/placeMetafields";
import { getFiltersForCategory, hasCategorySpecificFilters, type CategoryFilter } from "@/config/categoryFilters";
import { getAllDistricts, getPopularDistricts, getDistrictNameRu, type DistrictConfig } from "@/config/districts";
import LeafletMap from "@/components/LeafletMap";

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
}

const Map = () => {
  const [places, setPlaces] = useState<PlaceMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedPlaceHandle, setSelectedPlaceHandle] = useState<string | null>(null); // Выбранное место (для пляжей - название пляжа)
  // УБРАНО: showTopPlaces и topPlacesMode (пока нет рейтингов, не нужна функциональность "Топ")
  const [isListExpanded, setIsListExpanded] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState<'all' | '4.0' | '4.5' | '4.7' | '5.0'>('all');
  const [districtFilter, setDistrictFilter] = useState<string>('all');
  // УБРАНО: showMixedBest (связано с "Топ")
  const [categorySpecificFilter, setCategorySpecificFilter] = useState<string>('all'); // Фильтр по подкатегории (видовые, инстаграмные и т.д.)
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Получаем параметры из URL (place и category)
  useEffect(() => {
    const placeParam = searchParams.get('place');
    const categoryParam = searchParams.get('category');
    
    if (placeParam) {
      setSelectedPlaceHandle(placeParam);
    }
    
    // Если есть категория в URL - автоматически выбираем её
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  // Получаем партнеров для выделения на карте
  const partners = getAllPartners();
  const partnerHandles = new Set(partners.map(p => p.id));

  useEffect(() => {
    const loadPlaces = async () => {
      try {
        setLoading(true);
        const products = await fetchProducts(250); // Максимальный лимит Shopify Storefront API
        
        // Фильтруем только места с координатами (info products)
        const placesWithCoordinates: PlaceMarker[] = products
          .filter(p => {
            // Только информационные места (не туры)
            const tags = p.node.tags || [];
            return tags.includes('info') || tags.includes('insider');
          })
          .map(p => {
            // Ищем координаты в metafields (Storefront API)
            // ВАЖНО: Проверяем ОБА namespace (place_info и custom) для совместимости
            let coordinatesField = p.node.metafields?.find(m => 
              m && m.key === 'coordinates' && 
              (m.namespace === 'place_info' || m.namespace === 'custom' || m.namespace === undefined)
            );
            
            // Если нет в Storefront API - используем fallback данные
            if (!coordinatesField?.value) {
              const fallbackData = getPlaceMetafields(p.node.handle);
              if (fallbackData.coordinates) {
                coordinatesField = { value: fallbackData.coordinates } as any;
              }
            }
            
            if (!coordinatesField?.value) return null;
            
            const [lat, lng] = coordinatesField.value.split(',').map(Number);
            if (!lat || !lng || isNaN(lat) || isNaN(lng)) return null;

            // Определяем категорию из тегов (category:shopping, category:beaches и т.д.)
            const tags = p.node.tags || [];
            let category = 'place';
            let emoji = '📍';
            
            // Ищем тег category:*
            const categoryTag = tags.find(t => t.startsWith('category:'));
            if (categoryTag) {
              category = categoryTag.replace('category:', '');
              
              // Маппинг категорий на эмодзи
              const categoryEmojiMap: Record<string, string> = {
                shopping: '🛍️',
                beaches: '🏖️',
                temples: '🛕',
                restaurants: '🍽️',
                spa: '💆',
                viewpoints: '⛰️',
                massage: '💆‍♀️',
                coffee: '☕',
                nightmarkets: '🌃',
                attractions: '🎯',
                nightlife: '🌙',
                museums: '🏛️',
                waterfalls: '💧',
                aquaparks: '💦'
              };
              emoji = categoryEmojiMap[category] || '📍';
            }

            // Определяем партнера
            const isPartner = partnerHandles.has(p.node.handle) || 
                            tags.some(t => t.includes('partner'));

            // Рейтинг - сначала из Storefront API, потом fallback
            let ratingField = p.node.metafields?.find(m => m && m.key === 'rating');
            let rating = ratingField?.value;
            if (!rating) {
              const fallbackData = getPlaceMetafields(p.node.handle);
              rating = fallbackData.rating?.toString();
            }

            // Район - сначала из Storefront API, потом fallback
            let districtField = p.node.metafields?.find(m => m && m.key === 'district');
            let district = districtField?.value;
            if (!district) {
              const fallbackData = getPlaceMetafields(p.node.handle);
              district = fallbackData.district;
            }

            return {
              handle: p.node.handle,
              title: p.node.title,
              lat,
              lng,
              category,
              rating,
              district,
              isPartner,
              emoji,
              tags
            };
          })
          .filter(Boolean) as PlaceMarker[];

        setPlaces(placesWithCoordinates);
      } catch (error) {
        console.error('Error loading map places:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPlaces();
  }, []);

  // Категория-специфичные фильтры (для выбранной категории) - объявляем ПЕРЕД filteredPlaces!
  const categoryFilters = useMemo(() => {
    if (selectedCategory === 'all') return [];
    return getFiltersForCategory(selectedCategory);
  }, [selectedCategory]);
  
  const hasSpecificFilters = useMemo(() => {
    if (selectedCategory === 'all') return false;
    // Для пляжей не показываем стандартные фильтры - покажем названия пляжей
    if (selectedCategory === 'beaches') return false;
    return hasCategorySpecificFilters(selectedCategory);
  }, [selectedCategory]);

  // Для категории пляжей - список всех пляжей (названия вместо фильтров)
  const beachesForFilter = useMemo(() => {
    if (selectedCategory !== 'beaches') return [];
    return places.filter(p => p.category === 'beaches');
  }, [places, selectedCategory]);
  
  // Фильтрация мест - ВАЖНО: показываем ТОЛЬКО выбранную категорию (без перегрузки!)
  const filteredPlaces = useMemo(() => {
    let filtered = selectedCategory === "all" 
      ? places 
      : places.filter(p => p.category === selectedCategory);
    
    // Фильтр по выбранному месту (для пляжей - название пляжа)
    if (selectedPlaceHandle) {
      filtered = filtered.filter(p => p.handle === selectedPlaceHandle);
      return filtered;
    }
    
    // Фильтр по рейтингу
    if (ratingFilter !== 'all') {
      const minRating = parseFloat(ratingFilter);
      filtered = filtered.filter(p => {
        // Парсим рейтинг: может быть строка "4.5" или undefined
        const ratingStr = p.rating || "0";
        const rating = parseFloat(ratingStr);
        // Проверяем что рейтинг валидный и >= минимального
        if (isNaN(rating) || rating === 0) {
          // Если рейтинга нет, исключаем место при фильтрации (не показываем без рейтинга)
          return false;
        }
        return rating >= minRating;
      });
    }
    
    // Фильтр по району
    if (districtFilter !== 'all') {
      filtered = filtered.filter(p => {
        const placeDistrict = p.tags.find(t => t.startsWith('district:'))?.replace('district:', '') || p.district;
        return placeDistrict === districtFilter || placeDistrict?.includes(districtFilter);
      });
    }
    
    // Поиск по названию
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(query) ||
        p.district?.toLowerCase().includes(query)
      );
    }
    
    // Категория-специфичный фильтр (видовые, инстаграмные и т.д.) - НЕ для пляжей!
    if (categorySpecificFilter !== 'all' && hasSpecificFilters && selectedCategory !== 'all' && selectedCategory !== 'beaches') {
      const filterConfig = categoryFilters.find(f => f.id === categorySpecificFilter);
      if (filterConfig && filterConfig.tags.length > 0) {
        filtered = filtered.filter(p => {
          // Проверяем, есть ли хотя бы один из тегов фильтра в тегах места
          return filterConfig.tags.some(tag => 
            p.tags.some(placeTag => 
              placeTag.toLowerCase().includes(tag.toLowerCase().replace('tag:', ''))
            )
          );
        });
      }
    }
    
    return filtered;
  }, [places, selectedCategory, ratingFilter, districtFilter, searchQuery, categorySpecificFilter, categoryFilters, hasSpecificFilters, selectedPlaceHandle]);
  
  // ВСЕ районы из конфига (для выпадающего меню) - всегда показываем ВСЕ
  const allDistrictsConfig = getAllDistricts();
  
  // Доступные районы для фильтра (динамически из мест + все районы из конфига)
  const availableDistricts = useMemo(() => {
    // Сначала собираем районы из мест на карте
    const districtsFromPlaces = new Set<string>();
    filteredPlaces.forEach(place => {
      const district = place.tags.find(t => t.startsWith('district:'))?.replace('district:', '') || place.district;
      if (district) districtsFromPlaces.add(district);
    });
    
    // Всегда показываем ВСЕ районы из конфига (даже если нет мест на карте)
    const result = allDistrictsConfig.map(dist => dist.id);
    
    // Добавляем районы из мест, которых нет в конфиге (обратная совместимость)
    districtsFromPlaces.forEach(district => {
      if (!result.includes(district)) {
        result.push(district);
      }
    });
    
    return result;
  }, [filteredPlaces, allDistrictsConfig]);

  // УБРАНО: getTopPlaces и mixedBestPlaces (функциональность "Топ" временно отключена)

  // Партнеры всегда показываем первыми
  // Если есть selectedPlaceHandle, показываем его первым
  const sortedPlaces = [...filteredPlaces].sort((a, b) => {
    // Выделенное место всегда первое
    if (selectedPlaceHandle && a.handle === selectedPlaceHandle) return -1;
    if (selectedPlaceHandle && b.handle === selectedPlaceHandle) return 1;
    // Партнеры после выделенного места
    if (a.isPartner && !b.isPartner) return -1;
    if (!a.isPartner && b.isPartner) return 1;
    return 0;
  });

  // Найти выделенное место для центрирования карты
  const highlightedPlace = selectedPlaceHandle 
    ? sortedPlaces.find(p => p.handle === selectedPlaceHandle)
    : null;

  // Центр карты (Пхукет)
  const centerLat = 7.8804;
  const centerLng = 98.3923;

  // ВСЕ категории из конфига (для горизонтального скролла и выпадающего меню)
  // ⚡ ЕДИНАЯ СИСТЕМА: используем getAllCategories() - все 26 категорий автоматически!
  const allCategories = useMemo(() => {
    // Полный маппинг эмодзи для ВСЕХ категорий (централизованный!)
    const categoryEmojiMap: Record<string, string> = {
      beaches: '🏖️', temples: '🛕', viewpoints: '⛰️',
      restaurants: '🍽️', nightlife: '🌙', spa: '💆', elephants: '🐘',
      shopping: '🛍️', aquaparks: '💦', museums: '🏛️', nightmarkets: '🌃',
      waterfalls: '💧', districts: '📍', excursions: '🚤', attractions: '🎯',
      amusement: '🎪', diving: '🤿', fishing: '🎣', yachts: '⛵',
      zoos: '🦁', clubs: '🎉', bars: '🍻', events: '📅',
      massage: '💆‍♀️', sauna: '🧖', coffee: '☕'
    };
    
    // ⚡ Берем ВСЕ категории из централизованного конфига (26 категорий)
    return [
      { id: "all", label: "Все места", emoji: "🗺️" },
      ...getAllCategories().map((cat: CategoryConfig) => ({
        id: cat.id,
        label: cat.title.replace('Пхукета', '').replace('на Пхукете', '').replace('Пхукет', '').trim(),
        emoji: categoryEmojiMap[cat.id] || '📍'
      }))
    ];
  }, []);

  // Топ-5 популярных категорий (всегда видны)
  const popularCategories = useMemo(() => {
    const popularIds = ['all', 'shopping', 'beaches', 'temples', 'restaurants'];
    return allCategories.filter(cat => popularIds.includes(cat.id));
  }, [allCategories]);

  // Генерация Google Maps URL - ВАЖНО: центрируем на выбранной категории или выделенном месте
  const generateMapUrl = useMemo(() => {
    // Если есть выделенное место - центрируем на нем
    const highlightedPlace = selectedPlaceHandle 
      ? sortedPlaces.find(p => p.handle === selectedPlaceHandle)
      : null;

    if (highlightedPlace) {
      return `https://www.google.com/maps?q=${highlightedPlace.lat},${highlightedPlace.lng}&z=13&hl=ru`;
    }

    // Если выбрана категория и есть места - центрируем на первом месте
    if (sortedPlaces.length > 0) {
      const firstPlace = sortedPlaces[0];
      return `https://www.google.com/maps?q=${firstPlace.lat},${firstPlace.lng}&z=11&hl=ru`;
    }

    // По умолчанию - центр Пхукета
    return `https://www.google.com/maps?q=${centerLat},${centerLng}&z=11&hl=ru`;
  }, [sortedPlaces, selectedPlaceHandle, centerLat, centerLng]);

  // При клике на место
  const handlePlaceClick = (place: PlaceMarker) => {
    navigate(`/place/${place.handle}`);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Sticky Header - Perplexity Minimalism + Telegram WebApp (iOS 26 Style) */}
      <div 
        className="sticky top-0 z-50 safe-area-inset-top"
        style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          boxShadow: '0 1px 8px rgba(0, 0, 0, 0.06)'
        }}
      >
        <div className="px-3 py-2">
          {/* Компактная строка: заголовок + счётчик */}
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-base font-bold text-gray-900">🗺️ Карта</h1>
            <span className="text-xs text-gray-500 font-medium">
              {sortedPlaces.length} {sortedPlaces.filter(p => p.isPartner).length > 0 && `• ${sortedPlaces.filter(p => p.isPartner).length} партнеров`}
            </span>
          </div>

          {/* Поиск на карте - показываем всегда, если активен */}
          {searchQuery !== '' && (
            <div className="mb-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск места или района..."
                  autoFocus
                  className="w-full pl-8 pr-8 py-1.5 rounded-lg border border-gray-200 bg-white/90 text-xs min-h-[32px] focus:outline-none focus:ring-1 focus:ring-[#007AFF] focus:border-[#007AFF]"
                  style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif' }}
                />
                {searchQuery.trim() && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-3 h-3 text-gray-400" />
                  </button>
                )}
              </div>
              {searchQuery.trim() && (
                <p className="text-[10px] text-gray-500 mt-1 px-1">
                  Найдено: {filteredPlaces.length} {filteredPlaces.length === 1 ? 'место' : 'мест'}
                </p>
              )}
            </div>
          )}
          
          {/* Фильтры категорий - ВСЕ категории в горизонтальном скролле + выпадающее меню */}
          <div className="flex items-center gap-1.5 pb-1">
            {/* ВСЕ категории в горизонтальном скролле (можно листать пальцем) */}
            <div className="flex gap-1.5 flex-1 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
              {allCategories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setCategorySpecificFilter('all'); // Сбрасываем категория-специфичный фильтр при смене категории
                    const newSearchParams = new URLSearchParams(searchParams);
                    if (cat.id === 'all') {
                      newSearchParams.delete('category');
                    } else {
                      newSearchParams.set('category', cat.id);
                    }
                    navigate(`/map?${newSearchParams.toString()}`, { replace: true });
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all min-h-[36px] flex-shrink-0 ${
                    selectedCategory === cat.id
                      ? 'bg-[#007AFF] text-white shadow-md shadow-[#007AFF]/20'
                      : 'bg-white/90 text-gray-700 hover:bg-gray-50 active:bg-gray-100 border border-gray-200/60'
                  }`}
                  style={{
                    backdropFilter: selectedCategory === cat.id ? 'none' : 'blur(20px)',
                    WebkitBackdropFilter: selectedCategory === cat.id ? 'none' : 'blur(20px)',
                  }}
                >
                  <span className="text-sm leading-none">{cat.emoji}</span>
                  <span className="leading-tight">{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Кнопка "Еще" с выпадающим меню для всех категорий */}
            <div className="relative flex-shrink-0">
              <button
                onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold min-h-[36px] transition-all ${
                  isCategoryMenuOpen
                    ? 'bg-[#007AFF] text-white shadow-md shadow-[#007AFF]/20'
                    : 'bg-white/90 text-gray-700 hover:bg-gray-50 active:bg-gray-100 border border-gray-200/60'
                }`}
                style={{
                  backdropFilter: isCategoryMenuOpen ? 'none' : 'blur(20px)',
                  WebkitBackdropFilter: isCategoryMenuOpen ? 'none' : 'blur(20px)',
                }}
              >
                <span>Еще</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${isCategoryMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Выпадающее меню всех категорий */}
              {isCategoryMenuOpen && (
                <>
                  {/* Overlay для закрытия по клику вне меню */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsCategoryMenuOpen(false)}
                  />
                  {/* Меню - Компактное, не перекрывает карту (phuket-insider.com inspiration) */}
                  <div 
                    className="absolute top-full right-0 mt-1 w-[240px] max-h-[50vh] overflow-y-auto bg-white/98 backdrop-blur-xl rounded-xl shadow-lg border border-gray-200 z-50"
                    style={{
                      scrollbarWidth: 'thin',
                      scrollbarColor: '#007AFF transparent'
                    }}
                  >
                    <div className="p-1.5">
                      <div className="flex items-center justify-between px-2 py-1.5 mb-1">
                        <h3 className="text-xs font-bold text-gray-900">Все категории</h3>
                        <button
                          onClick={() => setIsCategoryMenuOpen(false)}
                          className="w-5 h-5 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                        >
                          <X className="w-3.5 h-3.5 text-gray-500" />
                        </button>
                      </div>
                      <div className="space-y-0.5 max-h-[45vh] overflow-y-auto">
                        {allCategories.map(cat => (
                          <button
                            key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    setCategorySpecificFilter('all'); // Сбрасываем категория-специфичный фильтр при смене категории
                    const newSearchParams = new URLSearchParams(searchParams);
                    if (cat.id === 'all') {
                      newSearchParams.delete('category');
                    } else {
                      newSearchParams.set('category', cat.id);
                    }
                    navigate(`/map?${newSearchParams.toString()}`, { replace: true });
                  }}
                            className={`w-full flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                              selectedCategory === cat.id
                                ? 'bg-[#007AFF] text-white'
                                : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                            }`}
                          >
                            <span className="text-sm">{cat.emoji}</span>
                            <span className="flex-1 text-left truncate">{cat.label}</span>
                            {selectedCategory === cat.id && (
                              <div className="w-1.5 h-1.5 rounded-full bg-white flex-shrink-0"></div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Для категории ПЛЯЖИ: названия пляжей вместо фильтров */}
          {selectedCategory === 'beaches' && beachesForFilter.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
              <button
                onClick={() => {
                  setSelectedPlaceHandle(null);
                  setCategorySpecificFilter('all');
                }}
                className={`px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap transition-all min-h-[28px] flex-shrink-0 ${
                  selectedPlaceHandle === null
                    ? 'bg-[#007AFF] text-white shadow-sm'
                    : 'bg-white/90 text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                Все
              </button>
              {beachesForFilter.map(beach => (
                <button
                  key={beach.handle}
                  onClick={() => {
                    setSelectedPlaceHandle(beach.handle);
                    setCategorySpecificFilter('all');
                  }}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap transition-all min-h-[28px] flex-shrink-0 ${
                    selectedPlaceHandle === beach.handle
                      ? 'bg-[#007AFF] text-white shadow-sm'
                      : 'bg-white/90 text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                  title={beach.district ? `${beach.title} (${beach.district})` : beach.title}
                >
                  {beach.title}
                </button>
              ))}
            </div>
          )}

          {/* Категория-специфичные фильтры для других категорий (НЕ пляжи) */}
          {hasSpecificFilters && categoryFilters.length > 0 && selectedCategory !== 'all' && selectedCategory !== 'beaches' && (
            <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Filter className="w-3 h-3 text-gray-400" />
                <span className="text-[10px] text-gray-500 font-medium">
                  {allCategories.find(c => c.id === selectedCategory)?.label || 'Фильтры'}:
                </span>
              </div>
              {categoryFilters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setCategorySpecificFilter(filter.id)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap transition-all min-h-[28px] flex-shrink-0 flex items-center gap-1 ${
                    categorySpecificFilter === filter.id
                      ? 'bg-[#007AFF] text-white shadow-sm'
                      : 'bg-white/90 text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {filter.icon && <span className="text-xs">{filter.icon}</span>}
                  <span>{filter.label}</span>
                </button>
              ))}
            </div>
          )}
          
          {/* Фильтры: РАЙОНЫ СЛЕВА (горизонтальный скролл) + РЕЙТИНГИ СПРАВА (горизонтальный скролл) */}
          <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
            {/* РАЙОНЫ - СЛЕВА (самое важное для туристов!) - горизонтальный скролл */}
            <div className="flex items-center gap-1 flex-shrink-0">
              <MapPin className="w-3 h-3 text-gray-400" />
              <span className="text-[10px] text-gray-500 font-medium">Район:</span>
            </div>
            <button
              onClick={() => setDistrictFilter('all')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap transition-all min-h-[28px] flex-shrink-0 ${
                districtFilter === 'all'
                  ? 'bg-[#007AFF] text-white shadow-sm'
                  : 'bg-white/90 text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Все
            </button>
            {/* Все районы (горизонтальный скролл) - с русскими названиями из конфига */}
            {availableDistricts.map(districtId => {
              const districtName = getDistrictNameRu(districtId);
              return (
                <button
                  key={districtId}
                  onClick={() => setDistrictFilter(districtId)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap transition-all min-h-[28px] flex-shrink-0 ${
                    districtFilter === districtId
                      ? 'bg-[#007AFF] text-white shadow-sm'
                      : 'bg-white/90 text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {districtName}
                </button>
              );
            })}
            
            {/* РЕЙТИНГИ - СПРАВА (второстепенный фильтр, горизонтальный скролл) */}
            {availableDistricts.length > 0 && (
              <div className="w-px h-4 bg-gray-300 mx-1 flex-shrink-0" />
            )}
            <div className="flex items-center gap-1 flex-shrink-0">
              <Filter className="w-3 h-3 text-gray-400" />
              <span className="text-[10px] text-gray-500 font-medium">Рейтинг:</span>
            </div>
            {['all', '4.0', '4.5', '4.7', '5.0'].map(rating => (
              <button
                key={rating}
                onClick={() => setRatingFilter(rating as any)}
                className={`px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap transition-all min-h-[28px] flex-shrink-0 ${
                  ratingFilter === rating
                    ? 'bg-[#007AFF] text-white shadow-sm'
                    : 'bg-white/90 text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {rating === 'all' ? 'Все' : `⭐ ${rating}+`}
              </button>
            ))}
          </div>
          
          {/* Статистика категории (если выбрана) */}
          {selectedCategory !== "all" && (
            <div className="mt-2 p-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100/50">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{allCategories.find(c => c.id === selectedCategory)?.emoji}</span>
                  <div>
                    <div className="font-bold text-gray-900">
                      {allCategories.find(c => c.id === selectedCategory)?.label}
                    </div>
                    <div className="text-gray-600">
                      {filteredPlaces.length} мест • Средний рейтинг: {
                        filteredPlaces.length > 0
                          ? (filteredPlaces.reduce((sum, p) => sum + parseFloat(p.rating || "0"), 0) / filteredPlaces.length).toFixed(1)
                          : "—"
                      }
                    </div>
                  </div>
                </div>
                <Link
                  to={`/category/${selectedCategory}`}
                  className="text-[#007AFF] font-semibold hover:underline flex items-center gap-1"
                >
                  Все места →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-8 h-8 animate-spin text-[#007AFF]" />
        </div>
      ) : (
        // Карта занимает всё доступное пространство (Perplexity: карта = главное)
        <div className="relative h-[calc(100vh-140px)]">
          {/* Интерактивная карта Leaflet + OpenStreetMap */}
          <LeafletMap 
            places={sortedPlaces}
            selectedPlaceHandle={selectedPlaceHandle}
            onPlaceClick={(place) => handlePlaceClick(place)}
          />

          {/* Список мест - Компактный сворачиваемый лист (iOS 26 Style) */}
          <div 
            className={`absolute left-4 right-4 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 transition-all duration-300 overflow-hidden ${
              isListExpanded 
                ? 'bottom-4 max-h-[60vh]' 
                : 'bottom-4 max-h-[48px]' // Уменьшено с 60px до 48px для меньшего перекрытия карты
            }`}
          >
            {/* Заголовок - кликабельный для сворачивания/разворачивания */}
            <button
              onClick={() => setIsListExpanded(!isListExpanded)}
              className={`w-full flex items-center justify-between hover:bg-gray-50/50 transition-colors ${
                isListExpanded 
                  ? 'p-3 border-b border-gray-100' 
                  : 'p-2' // Меньший padding в свернутом состоянии
              }`}
            >
              <div className="flex-1 text-left min-w-0">
                <h3 className={`font-bold text-gray-900 truncate ${
                  isListExpanded ? 'text-sm' : 'text-xs' // Меньший размер текста в свернутом состоянии
                }`}>
                  {selectedCategory === "all" 
                    ? `Все места (${sortedPlaces.length})`
                    : `${allCategories.find(c => c.id === selectedCategory)?.label || 'Места'} (${sortedPlaces.length})`
                  }
                </h3>
                {!isListExpanded && sortedPlaces.filter(p => p.isPartner).length > 0 && (
                  <p className="text-[10px] text-[#007AFF] font-medium mt-0.5 truncate">
                    ⭐ {sortedPlaces.filter(p => p.isPartner).length} партнеров
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                {/* УБРАНО: Кнопка "Топ" (пока нет рейтингов) */}
                <MapPin className={`w-4 h-4 text-gray-400 transition-transform ${isListExpanded ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {/* УБРАНО: Секция "Топ-N мест" (пока нет рейтингов) */}
            
            {/* Список мест - показываем только когда развернуто */}
            {isListExpanded && (
              <div className="overflow-y-auto p-3 max-h-[calc(60vh-60px)]">
                <div className="space-y-2">
                  {sortedPlaces.slice(0, 20).map((place) => (
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
                        <svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Legend - Партнеры */}
          {sortedPlaces.filter(p => p.isPartner).length > 0 && (
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-xl rounded-xl shadow-lg border border-gray-100 p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 rounded-full bg-[#007AFF]"></div>
                <span className="text-xs font-semibold text-gray-900">Партнеры</span>
              </div>
              <p className="text-xs text-gray-500">
                Наши партнеры выделены на карте
              </p>
            </div>
          )}
        </div>
      )}

      {/* Info Block - Perplexity Style */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100/50">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">💎 Бесплатная карта путешественника</h3>
          <p className="text-sm text-gray-700 mb-2">
            Все лучшие места Пхукета на одной карте. <strong>Бесплатно</strong> — в то время как конкуренты продают такие карты, мы делаем их доступными для всех!
          </p>
          <p className="text-xs text-gray-600">
            ⭐ Партнеры выделены синим цветом — поддержите наших проверенных партнеров!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Map;

