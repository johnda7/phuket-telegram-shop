import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, MapPin, Search, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/shopify";
import { getAllDistricts, getDistrictNameRu } from "@/config/districts";
import heroImage from "@/assets/beaches-hero.jpg";

// Beach Card Component - УПРОЩЕННАЯ ВЕРСИЯ (только название и район!)
const BeachCard = ({ beach }: { beach: any }) => {
  const image = beach.node.images.edges[0]?.node;
  const tags = beach.node.tags || [];
  
  // Extract district from tags - самое важное!
  const districtTag = tags.find((tag: string) => tag.startsWith('district:'));
  const districtId = districtTag ? districtTag.replace('district:', '') : '';
  const districtName = districtId ? getDistrictNameRu(districtId) : '';

  return (
    <Link
      to={`/place/${beach.node.handle}`}
      className="group block"
    >
      <div className="rounded-2xl overflow-hidden border border-gray-200/60 bg-white/90 backdrop-blur-xl transition-all hover:shadow-lg hover:scale-[1.02]">
        {/* Image */}
        <div className="aspect-[16/9] bg-gradient-to-br from-blue-100 to-cyan-100 overflow-hidden relative">
          {image ? (
            <>
              <img
                src={image.url}
                alt={beach.node.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-blue-100 to-cyan-100">
              🏖️
            </div>
          )}
          
          {/* Район - самое важное! */}
          {districtName && (
            <div className="absolute bottom-3 left-3 right-3">
              <Badge className="bg-white/95 backdrop-blur-sm text-gray-900 font-semibold px-2.5 py-1 text-xs shadow-md border border-gray-200/50">
                <MapPin className="w-3 h-3 mr-1" />
                {districtName}
              </Badge>
            </div>
          )}
        </div>

        {/* Content - только название! */}
        <div className="p-4">
          <h3 className="text-base font-bold text-gray-900 line-clamp-2 group-hover:text-[#007AFF] transition-colors leading-tight">
            {beach.node.title}
          </h3>
        </div>
      </div>
    </Link>
  );
};

const Beaches = () => {
  const [districtFilter, setDistrictFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBeachHandle, setSelectedBeachHandle] = useState<string | null>(null);
  const navigate = useNavigate();

  const { data: products, isLoading } = useQuery({
    queryKey: ["beaches"],
    queryFn: () => fetchProducts(250), // Максимум для загрузки всех пляжей
  });

  // Все районы из конфига
  const allDistricts = getAllDistricts();

  // Filter products for beaches only
  const allBeaches = useMemo(() => {
    return (products || []).filter(
      (product) => 
        product.node.tags?.some(tag => 
          tag.toLowerCase().includes('category:beaches') ||
          tag.toLowerCase() === 'beach' ||
          (tag.includes('info') && tag.includes('beach'))
        )
    );
  }, [products]);

  // Фильтры: район, поиск по названию, выбранный пляж
  const filteredBeaches = useMemo(() => {
    let filtered = allBeaches;

    // Фильтр по выбранному пляжу
    if (selectedBeachHandle) {
      filtered = filtered.filter(beach => beach.node.handle === selectedBeachHandle);
      return filtered;
    }

    // Фильтр по району
    if (districtFilter !== "all") {
      filtered = filtered.filter(beach => 
        beach.node.tags?.some(tag => 
          tag.toLowerCase() === `district:${districtFilter.toLowerCase()}` ||
          tag.toLowerCase().includes(`district:${districtFilter.toLowerCase()}`)
        )
      );
    }

    // Поиск по названию
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(beach => 
        beach.node.title.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [allBeaches, districtFilter, searchQuery, selectedBeachHandle]);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Пляжи на Пхукете"
            className="w-full h-full object-cover scale-105 animate-[scale-in_0.6s_ease-out]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        </div>
        
        <div className="relative h-full flex items-center justify-center">
          <div className="container mx-auto px-4">
            <div className="glass-card max-w-4xl mx-auto p-10 text-center animate-fade-in backdrop-blur-xl bg-background/20 border border-white/20">
              <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
                Пляжи Пхукета
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Откройте для себя лучшие пляжи острова — от диких и безлюдных до тусовочных с вечеринками
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary transition-colors">
            Главная
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/phuket" className="hover:text-primary transition-colors">
            Что посетить
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">Пляжи на Пхукете</span>
        </div>

        {/* Description */}
        <div className="max-w-4xl mb-12 animate-fade-in">
          <div className="glass-card p-8 border-l-4 border-primary">
            <p className="text-lg text-foreground leading-relaxed">
              Многообразие пляжей на Пхукете позволяет найти идеальное место для отдыха: от диких и безлюдных до тусовочных, с развлечениями и вечеринками. Каждый пляж Пхукета уникален: природа наградила остров невероятными пейзажами и горными рельефами, а некоторые места украсил человек, сделав интересные инстаграмные локации. 
            </p>
            <p className="text-lg font-bold mt-4 text-primary">
              🔥 Лучшие идут первыми 👇🏼
            </p>
          </div>
        </div>

        {/* Фильтры: Названия пляжей + Район + Поиск */}
        <div className="mb-8 space-y-4">
          {/* Горизонтальный скролл с названиями пляжей - ВМЕСТО фильтров категории! */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
            <button
              onClick={() => {
                setSelectedBeachHandle(null);
                setSearchQuery('');
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all min-h-[32px] flex-shrink-0 ${
                selectedBeachHandle === null && !searchQuery.trim()
                  ? 'bg-[#007AFF] text-white shadow-md'
                  : 'bg-white/90 text-gray-700 hover:bg-gray-50 border border-gray-200/60'
              }`}
            >
              Все
            </button>
            {allBeaches.map(beach => {
              const beachDistrictTag = beach.node.tags?.find((tag: string) => tag.startsWith('district:'));
              const beachDistrictId = beachDistrictTag ? beachDistrictTag.replace('district:', '') : '';
              const beachDistrictName = beachDistrictId ? getDistrictNameRu(beachDistrictId) : '';
              
              return (
                <button
                  key={beach.node.handle}
                  onClick={() => {
                    setSelectedBeachHandle(beach.node.handle);
                    setSearchQuery('');
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all min-h-[32px] flex-shrink-0 ${
                    selectedBeachHandle === beach.node.handle
                      ? 'bg-[#007AFF] text-white shadow-md'
                      : 'bg-white/90 text-gray-700 hover:bg-gray-50 border border-gray-200/60'
                  }`}
                  title={beachDistrictName ? `${beach.node.title} (${beachDistrictName})` : beach.node.title}
                >
                  {beach.node.title}
                </button>
              );
            })}
          </div>

          {/* Поиск по названию (дополнительно) */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSelectedBeachHandle(null); // Сбрасываем выбор при поиске
              }}
              placeholder="Поиск пляжа по названию..."
              className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200/60 bg-white/90 backdrop-blur-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#007AFF] focus:border-[#007AFF]"
            />
            {searchQuery.trim() && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedBeachHandle(null);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
          </div>

          {/* Фильтр по районам - горизонтальный скролл */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
            <div className="flex items-center gap-1 flex-shrink-0">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500 font-medium">Район:</span>
            </div>
            <button
              onClick={() => {
                setDistrictFilter('all');
                setSelectedBeachHandle(null);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all min-h-[32px] flex-shrink-0 ${
                districtFilter === 'all'
                  ? 'bg-[#007AFF] text-white shadow-md'
                  : 'bg-white/90 text-gray-700 hover:bg-gray-50 border border-gray-200/60'
              }`}
            >
              Все
            </button>
            {allDistricts.map(dist => (
              <button
                key={dist.id}
                onClick={() => {
                  setDistrictFilter(dist.id);
                  setSelectedBeachHandle(null);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all min-h-[32px] flex-shrink-0 ${
                  districtFilter === dist.id
                    ? 'bg-[#007AFF] text-white shadow-md'
                    : 'bg-white/90 text-gray-700 hover:bg-gray-50 border border-gray-200/60'
                }`}
              >
                {dist.nameRu}
              </button>
            ))}
          </div>

          {/* Кнопка карты */}
          <div className="flex justify-end">
            <Button
              onClick={() => navigate('/map?category=beaches')}
              className="gap-2 bg-gradient-to-r from-[#4CAF50] to-[#45a049] hover:from-[#45a049] hover:to-[#4CAF50] text-white border-0 rounded-full shadow-lg transition-all"
            >
              <MapPin className="w-4 h-4" />
              Показать на карте
            </Button>
          </div>
        </div>

        {/* Результаты */}
        <div className="mb-4 text-sm text-gray-600">
          Найдено: <span className="font-bold text-gray-900">{filteredBeaches.length}</span> {filteredBeaches.length === 1 ? 'пляж' : filteredBeaches.length < 5 ? 'пляжа' : 'пляжей'}
        </div>

        {/* Beach Cards Grid - простые карточки с названием и районом */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-[200px] animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        ) : filteredBeaches.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredBeaches.map((beach) => (
              <BeachCard key={beach.node.id} beach={beach} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="p-12 max-w-2xl mx-auto rounded-2xl bg-white/90 backdrop-blur-xl border border-gray-200">
              <div className="text-6xl mb-6">🏝️</div>
              <p className="text-xl font-bold mb-4 text-gray-900">
                Пляжи не найдены
              </p>
              <p className="text-gray-600 mb-6">
                Попробуйте изменить фильтры или выбрать другой район
              </p>
              <Button
                onClick={() => {
                  setDistrictFilter("all");
                  setSearchQuery("");
                }}
                className="rounded-full bg-[#007AFF] hover:bg-[#0056CC] text-white"
              >
                Сбросить фильтры
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Beaches;
