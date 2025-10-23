import { Link } from "react-router-dom";
import { Home, RefreshCw, Car, MapPin, Info, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/phi-phi-hero.jpg";
import { useEffect, useState } from "react";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";

const services = [
  {
    id: 'real-estate',
    icon: Home,
    title: 'Недвижимость',
    description: 'Аренда и продажа',
    link: 'https://t.me/PhuketDAexpert',
    external: true
  },
  {
    id: 'currency',
    icon: RefreshCw,
    title: 'Обмен валюты',
    description: 'Березa - выгодный курс',
    link: 'https://t.me/bereza_manager',
    external: true
  },
  {
    id: 'car-rental',
    icon: Car,
    title: 'Аренда авто',
    description: '100+ автомобилей',
    link: 'https://t.me/RentaCarPhu',
    external: true
  },
  {
    id: 'tours',
    icon: MapPin,
    title: 'Экскурсии',
    description: 'Пхукет Go',
    link: 'https://t.me/PhuketGa',
    external: true
  },
];

const Index = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  
  // Категории тегов с цветами
  const tagCategories = [
    { id: 'all', label: 'Все туры', emoji: '🗺️', color: 'from-blue-500 to-cyan-500' },
    { id: 'islands', label: 'Острова', emoji: '🏝️', color: 'from-emerald-500 to-teal-500' },
    { id: '2-days', label: '2 дня', emoji: '⏰', color: 'from-orange-500 to-amber-500' },
    { id: 'popular', label: 'Популярные', emoji: '🔥', color: 'from-red-500 to-pink-500' },
    { id: 'adventure', label: 'Приключения', emoji: '🎒', color: 'from-purple-500 to-indigo-500' },
    { id: 'cultural', label: 'Культура', emoji: '🏛️', color: 'from-violet-500 to-purple-500' },
    { id: 'nature', label: 'Природа', emoji: '🌿', color: 'from-green-500 to-emerald-500' },
  ];

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts(50);
        // Фильтруем только туры (productType: Экскурсии)
        const tours = data.filter(p => p.node.productType === 'Экскурсии');
        setProducts(tours);
        setFilteredProducts(tours);
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    if (selectedTag === 'all') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(p => 
        p.node.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [selectedTag, products]);

  const handleTelegramClick = () => {
    window.open('https://t.me/+meHzcVXS2mIzZmU1', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[45vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-background" />
        </div>
        
        <div className="relative z-10 text-center px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">DA</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Добро пожаловать<br />в Пхукет DA!
          </h1>
          <p className="text-base text-white/90">
            Полезная информация
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Main Services Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {services.map((service) => {
            const IconComponent = service.icon;
            const cardContent = (
              <Card className="hover:shadow-lg transition-all text-center h-full">
                <CardContent className="pt-6 pb-4 px-3">
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center mx-auto mb-3">
                    <IconComponent className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{service.title}</h3>
                  <p className="text-xs text-muted-foreground leading-tight">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            );
            
            return service.external ? (
              <a 
                key={service.id}
                href={service.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {cardContent}
              </a>
            ) : (
              <Link key={service.id} to={service.link}>
                {cardContent}
              </Link>
            );
          })}
        </div>

        {/* Description */}
        <div className="glass-card p-5 mb-6">
          <p className="text-center text-sm leading-relaxed">
            Здесь всё про Пхукет — от туриста до резидента:<br/>
            🏖️ пляжи, 🍜 еда, 🗺️ экскурсии, 💰 аренда, 🏠 жильё, 💱 обмен валют, 🎭 мероприятия и местная жизнь.
          </p>
        </div>

        {/* Pinned Info */}
        <div className="glass-card p-5 mb-6">
          <p className="text-sm mb-3">
            📌 В закрепе — лучшие локации, советы, гайды и быстрые ответы от местных.
          </p>
          <p className="text-sm text-muted-foreground">
            👇 Быстрые ссылки на проверенные сервисы:
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link to="/categories">
            <Card className="hover:shadow-md transition-all">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-primary" />
                  <span className="font-medium text-sm">📍 Каталог</span>
                </div>
                <span className="text-muted-foreground">→</span>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/phuket">
            <Card className="hover:shadow-md transition-all">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-primary" />
                  <span className="font-medium text-sm">ℹ️ Инсайдер</span>
                </div>
                <span className="text-muted-foreground">→</span>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Tours Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">🎟️ Экскурсии</h2>
          </div>
          
          {/* iOS 26 Style Tag Filter */}
          <div className="mb-6 -mx-4 px-4 overflow-x-auto">
            <div className="flex gap-3 pb-3">
              {tagCategories.map((tag) => {
                const isSelected = selectedTag === tag.id;
                return (
                  <button
                    key={tag.id}
                    onClick={() => setSelectedTag(tag.id)}
                    className={`
                      relative flex-shrink-0 px-5 py-2.5 rounded-full font-medium text-sm
                      transition-all duration-300 ease-out
                      ${isSelected 
                        ? 'text-white shadow-lg scale-105' 
                        : 'text-foreground bg-secondary/50 hover:bg-secondary/80 hover:scale-105'
                      }
                    `}
                    style={isSelected ? {
                      background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                      '--tw-gradient-from': `rgb(${tag.color === 'from-blue-500 to-cyan-500' ? '59 130 246' : 
                                                    tag.color === 'from-emerald-500 to-teal-500' ? '16 185 129' :
                                                    tag.color === 'from-orange-500 to-amber-500' ? '249 115 22' :
                                                    tag.color === 'from-red-500 to-pink-500' ? '239 68 68' :
                                                    tag.color === 'from-purple-500 to-indigo-500' ? '168 85 247' :
                                                    tag.color === 'from-violet-500 to-purple-500' ? '139 92 246' :
                                                    '34 197 94'})`,
                      '--tw-gradient-to': `rgb(${tag.color === 'from-blue-500 to-cyan-500' ? '6 182 212' : 
                                                  tag.color === 'from-emerald-500 to-teal-500' ? '20 184 166' :
                                                  tag.color === 'from-orange-500 to-amber-500' ? '245 158 11' :
                                                  tag.color === 'from-red-500 to-pink-500' ? '236 72 153' :
                                                  tag.color === 'from-purple-500 to-indigo-500' ? '99 102 241' :
                                                  tag.color === 'from-violet-500 to-purple-500' ? '168 85 247' :
                                                  '16 185 129'})`,
                    } as React.CSSProperties : undefined}
                  >
                    <span className="mr-1.5">{tag.emoji}</span>
                    {tag.label}
                    {isSelected && (
                      <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tours Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Туры не найдены</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.node.id}
                  product={product.node}
                  showPrice={true}
                  showRating={false}
                  linkPrefix="/product"
                />
              ))}
            </div>
          )}
        </div>

        {/* AI Concierge CTA */}
        <div className="glass-card p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-3">
            <MessageCircle className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-lg font-bold mb-2">
            🤖 Не знаете что выбрать?
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            AI консьерж подберет идеальный вариант
          </p>
          <Button 
            onClick={handleTelegramClick}
            size="lg"
            className="w-full max-w-sm"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Написать в Telegram
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            Отвечаем в течение 5 минут
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
