import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, MapPin, Star, Waves, Users, Clock, Sun, Umbrella, PartyPopper, Baby } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/shopify";
import heroImage from "@/assets/beaches-hero.jpg";

// Beach Card Component
const BeachCard = ({ beach }: { beach: any }) => {
  const image = beach.node.images.edges[0]?.node;
  const tags = beach.node.tags || [];
  const isPopular = tags.includes('popular') || tags.includes('популярное');
  const isQuiet = tags.includes('quiet') || tags.includes('спокойный');
  const hasWatersports = tags.includes('watersports') || tags.includes('водные-виды-спорта');
  const isFamily = tags.includes('family') || tags.includes('семейный');
  const isParty = tags.includes('party') || tags.includes('тусовка');
  
  // Extract district from tags
  const districtTag = tags.find((tag: string) => tag.startsWith('district:'));
  const district = districtTag ? districtTag.replace('district:', '') : '';

  return (
    <Link
      to={`/place/${beach.node.handle}`}
      className="group block animate-fade-in"
    >
      <div className="glass-card overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl border border-border/50 hover:border-primary/50 rounded-3xl bg-gradient-to-b from-background to-background/95">
        {/* Image */}
        <div className="aspect-[4/3] bg-secondary/20 overflow-hidden relative">
          {image ? (
            <>
              <img
                src={image.url}
                alt={beach.node.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2 z-10 flex-wrap">
                {isPopular && (
                  <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold px-3 py-1.5 text-xs shadow-lg">
                    🔥 ТОП
                  </Badge>
                )}
                {district && (
                  <Badge className="bg-background/90 backdrop-blur-sm text-foreground font-semibold px-3 py-1.5 text-xs shadow-lg border border-border/50">
                    📍 {district}
                  </Badge>
                )}
              </div>
              
              {/* Bottom Icons */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
                <div className="flex gap-2">
                  {hasWatersports && (
                    <div className="bg-blue-500/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                      <Waves className="w-4 h-4 text-white" />
                    </div>
                  )}
                  {isFamily && (
                    <div className="bg-green-500/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                      <Baby className="w-4 h-4 text-white" />
                    </div>
                  )}
                  {isParty && (
                    <div className="bg-purple-500/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                      <PartyPopper className="w-4 h-4 text-white" />
                    </div>
                  )}
                  {isQuiet && (
                    <div className="bg-teal-500/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                      <Umbrella className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                
                {/* Rating */}
                <div className="bg-background/95 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  <span className="text-sm font-bold">4.{Math.floor(Math.random() * 3 + 5)}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-blue-500/10 to-cyan-500/5">
              🏖️
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-2xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors leading-tight">
            {beach.node.title}
          </h3>
          
          <p className="text-sm text-muted-foreground line-clamp-3 mb-5 leading-relaxed">
            {beach.node.description?.split('\n\n')[0] || "Один из лучших пляжей Пхукета"}
          </p>

          {/* Quick Info */}
          <div className="flex flex-wrap gap-2 mb-5">
            {hasWatersports && (
              <Badge variant="secondary" className="text-xs font-medium gap-1">
                <Waves className="w-3 h-3" />
                Водные виды спорта
              </Badge>
            )}
            {isFamily && (
              <Badge variant="secondary" className="text-xs font-medium gap-1">
                <Users className="w-3 h-3" />
                Для семьи
              </Badge>
            )}
            {isQuiet && (
              <Badge variant="secondary" className="text-xs font-medium gap-1">
                <Sun className="w-3 h-3" />
                Спокойный
              </Badge>
            )}
          </div>

          {/* Action Button */}
          <Button 
            className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold shadow-lg group-hover:shadow-xl transition-all"
          >
            Подробнее
            <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </Link>
  );
};

const Beaches = () => {
  const [typeFilter, setTypeFilter] = useState("all");
  const [district, setDistrict] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  const { data: products, isLoading } = useQuery({
    queryKey: ["beaches"],
    queryFn: () => fetchProducts(50),
  });

  // Filter products for beaches only
  let beaches = products?.filter(
    (product) => 
      product.node.tags?.some(tag => 
        tag.toLowerCase().includes('category:beaches') ||
        tag.toLowerCase() === 'beach'
      )
  ) || [];

  // Apply filters
  if (typeFilter !== "all") {
    beaches = beaches.filter(beach => 
      beach.node.tags?.includes(typeFilter)
    );
  }

  if (district !== "all") {
    beaches = beaches.filter(beach => 
      beach.node.tags?.some(tag => tag.toLowerCase().includes(`district:${district.toLowerCase()}`))
    );
  }

  // Apply sorting
  if (sortBy === "popular") {
    beaches = [...beaches].sort((a, b) => {
      const aPopular = a.node.tags?.includes('popular') ? 1 : 0;
      const bPopular = b.node.tags?.includes('popular') ? 1 : 0;
      return bPopular - aPopular;
    });
  } else if (sortBy === "name") {
    beaches = [...beaches].sort((a, b) => 
      a.node.title.localeCompare(b.node.title)
    );
  }

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

        {/* Filters */}
        <div className="glass-card p-6 mb-12 animate-fade-in border border-border/50 shadow-lg">
          <div className="flex flex-wrap items-center gap-4">
            {/* Type filters */}
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={typeFilter === "all" ? "default" : "outline"}
                onClick={() => setTypeFilter("all")}
                className="rounded-full hover-scale transition-all"
              >
                Все
              </Button>
              <Button
                variant={typeFilter === "quiet" ? "default" : "outline"}
                onClick={() => setTypeFilter("quiet")}
                className="rounded-full hover-scale transition-all gap-2"
              >
                <Umbrella className="w-4 h-4" />
                Спокойные
              </Button>
              <Button
                variant={typeFilter === "party" ? "default" : "outline"}
                onClick={() => setTypeFilter("party")}
                className="rounded-full hover-scale transition-all gap-2"
              >
                <PartyPopper className="w-4 h-4" />
                Тусовочные
              </Button>
              <Button
                variant={typeFilter === "family" ? "default" : "outline"}
                onClick={() => setTypeFilter("family")}
                className="rounded-full hover-scale transition-all gap-2"
              >
                <Baby className="w-4 h-4" />
                Семейные
              </Button>
              <Button
                variant={typeFilter === "watersports" ? "default" : "outline"}
                onClick={() => setTypeFilter("watersports")}
                className="rounded-full hover-scale transition-all gap-2"
              >
                <Waves className="w-4 h-4" />
                С развлечениями
              </Button>
            </div>

            {/* District select */}
            <Select value={district} onValueChange={setDistrict}>
              <SelectTrigger className="w-[180px] rounded-full border-border/50 hover:border-primary transition-colors">
                <SelectValue placeholder="Район" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">🌏 Все районы</SelectItem>
                <SelectItem value="Patong">📍 Патонг</SelectItem>
                <SelectItem value="Kata">📍 Ката</SelectItem>
                <SelectItem value="Karon">📍 Карон</SelectItem>
                <SelectItem value="Rawai">📍 Равай</SelectItem>
                <SelectItem value="Kamala">📍 Камала</SelectItem>
                <SelectItem value="Bangtao">📍 Бангтао</SelectItem>
                <SelectItem value="Naiyang">📍 Найянг</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort select */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px] rounded-full border-border/50 hover:border-primary transition-colors">
                <SelectValue placeholder="Сортировка" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">🔥 Популярные</SelectItem>
                <SelectItem value="name">🔤 По названию</SelectItem>
              </SelectContent>
            </Select>

            {/* Map button */}
            <Button
              variant="outline"
              className="ml-auto gap-2 bg-gradient-to-r from-[#4CAF50] to-[#45a049] hover:from-[#45a049] hover:to-[#4CAF50] text-white border-0 rounded-full shadow-lg hover-scale transition-all"
            >
              <MapPin className="w-4 h-4" />
              КАРТА
            </Button>
          </div>
          
          {/* Active filters count */}
          {(typeFilter !== "all" || district !== "all") && (
            <div className="mt-4 pt-4 border-t border-border/50">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Найдено:</span>
                <Badge variant="secondary" className="font-bold">
                  {beaches.length} {beaches.length === 1 ? 'пляж' : beaches.length < 5 ? 'пляжа' : 'пляжей'}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setTypeFilter("all");
                    setDistrict("all");
                  }}
                  className="ml-auto text-xs hover:text-primary"
                >
                  Сбросить фильтры
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Beach Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card h-[520px] animate-pulse rounded-3xl bg-muted/20" />
            ))}
          </div>
        ) : beaches.length > 0 ? (
          <>
            <div className="mb-6 text-sm text-muted-foreground">
              Показано <span className="font-bold text-foreground">{beaches.length}</span> {beaches.length === 1 ? 'пляж' : beaches.length < 5 ? 'пляжа' : 'пляжей'}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {beaches.map((product, index) => (
                <div 
                  key={product.node.id}
                  style={{ 
                    animation: 'fade-in 0.5s ease-out forwards',
                    animationDelay: `${index * 0.05}s`,
                    opacity: 0
                  }}
                >
                  <BeachCard beach={product} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-20 animate-fade-in">
            <div className="glass-card p-12 max-w-2xl mx-auto rounded-3xl">
              <div className="text-6xl mb-6">🏝️</div>
              <p className="text-2xl font-bold mb-4">
                Пляжи не найдены
              </p>
              <p className="text-muted-foreground mb-6">
                Попробуйте изменить фильтры или выбрать другой район
              </p>
              <Button
                onClick={() => {
                  setTypeFilter("all");
                  setDistrict("all");
                }}
                className="rounded-full"
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
