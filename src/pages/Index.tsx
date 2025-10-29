import { Link } from "react-router-dom";
import { Map, Users, Compass, Flame, Backpack, Landmark, Leaf, Loader2, MessageCircle, Info, MapPin, Sparkles, Star, Ship, Waves, Eye, ShoppingBag, UtensilsCrossed, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import heroImage from "@/assets/phi-phi-hero.jpg";
import { useEffect, useState } from "react";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";
import { getAllServices } from "@/config/services";
import { getButtonClass, getCardClass, cn } from "@/styles/design-system";

// ✅ Сервисы из централизованного конфига (НЕ хардкод!)
const services = getAllServices();

const Index = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string>('all');
  
  // Загрузка реальных туров для рекомендации на главной
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const data = await fetchProducts(100);
        // Берем только туры
        const tours = data.filter(p => p.node.productType === 'Экскурсии' || p.node.tags.includes('tour'));
        setProducts(tours);
      } catch (err) {
        console.error('Failed to load tours for home:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  // УБРАНО: Дублирование экскурсий на главной странице
  // Экскурсии теперь только в разделе "Туры" (/phuket)

  // УБРАНО: Загрузка экскурсий на главной странице
  // Экскурсии теперь только в разделе "Туры" (/phuket)

  // УБРАНО: Фильтрация экскурсий на главной странице

  const handleTelegramClick = () => {
    window.open('https://t.me/PHUKETDABOT', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[42vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-background" />
        </div>
        <div className="relative z-10 text-center px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-[#007AFF] flex items-center justify-center shadow-lg">
              <span className="text-xl font-bold text-white">DA</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-3 leading-tight">
            Консьерж‑сервис на Пхукете
          </h1>
          <p className="text-sm md:text-base text-white/90 max-w-xl mx-auto mb-5">
            Бронируйте туры, аренду авто и решайте любые вопросы через Telegram. Быстро, удобно, как в приложении.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button onClick={handleTelegramClick} size="lg" className="bg-[#007AFF] hover:bg-[#0056CC]">
              <MessageCircle className="w-5 h-5 mr-2" /> Открыть ДА Бота
            </Button>
            <Link to="/categories">
              <Button variant="secondary" size="lg" className="backdrop-blur bg-white/80 hover:bg-white">
                Перейти в каталог
              </Button>
            </Link>
          </div>
        </div>
      </section>

        <div className="container mx-auto px-4 py-8">
        {/* Main Services Grid - Premium Telegram Wallet Style */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {services.map((service) => (
            <a 
              key={service.id}
              href={service.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                getCardClass('hover'),
                "group block p-4 text-center transition-all duration-200 hover:scale-105"
              )}
            >
              <div className="w-12 h-12 rounded-2xl bg-[#007AFF] flex items-center justify-center mx-auto mb-3 group-hover:bg-[#0056CC] transition-colors">
                <service.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-sm mb-1 text-gray-900 group-hover:text-[#007AFF] transition-colors">
                {service.title}
              </h3>
              <p className="text-xs text-gray-500 leading-tight">
                {service.subtitle}
              </p>
            </a>
          ))}
        </div>

        {/* Description */}
        <div className={cn(getCardClass('default'), "p-6 mb-6")}>
          <div className="flex items-center gap-3 mb-3">
            <Sparkles className="w-5 h-5 text-[#007AFF]" />
            <h3 className="font-semibold text-lg">О проекте</h3>
          </div>
          <p className="text-sm leading-relaxed text-gray-600">
            Здесь всё про Пхукет — от туриста до резидента: пляжи, еда, экскурсии, аренда, жильё, обмен валют, мероприятия и местная жизнь.
          </p>
        </div>

        {/* Pinned Info */}
        <div className={cn(getCardClass('default'), "p-6 mb-6")}>
          <div className="flex items-center gap-3 mb-3">
            <MapPin className="w-5 h-5 text-[#007AFF]" />
            <h3 className="font-semibold text-lg">Telegram-канал</h3>
          </div>
          <p className="text-sm mb-3 text-gray-600">
            В закрепе — лучшие локации, советы, гайды и быстрые ответы от местных.
          </p>
          <p className="text-sm text-gray-500">
            Быстрые ссылки на проверенные сервисы:
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Link to="/categories">
            <div className={cn(getCardClass('hover'), "p-4 flex items-center justify-between")}>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#007AFF]" />
                <span className="font-medium text-sm">Каталог</span>
              </div>
              <span className="text-gray-400">→</span>
            </div>
          </Link>
          
          <Link to="/phuket">
            <div className={cn(getCardClass('hover'), "p-4 flex items-center justify-between")}>
              <div className="flex items-center gap-3">
                <Info className="w-5 h-5 text-[#007AFF]" />
                <span className="font-medium text-sm">Полезная информация</span>
              </div>
              <span className="text-gray-400">→</span>
            </div>
          </Link>
        </div>

        {/* Рекомендуем сегодня - Топ-6 туров */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Star className="w-6 h-6 text-[#007AFF]" />
              <h2 className="text-2xl font-bold">Рекомендуем сегодня</h2>
            </div>
            <Link to="/phuket" className="text-[#007AFF] hover:text-[#0056CC] font-medium">
              Все туры →
            </Link>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#007AFF]" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">Туры скоро появятся</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.slice(0, 6).map((product) => (
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

            {/* Популярные категории - Perplexity Style */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Compass className="w-5 h-5 text-[#007AFF]" />
                  <h2 className="text-xl font-bold">Популярные категории</h2>
                </div>
                <Link to="/categories" className="text-[#007AFF] hover:text-[#0056CC] text-sm font-medium">
                  Все →
                </Link>
              </div>

              {/* Горизонтальный скролл в стиле Perplexity */}
              <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                {[
                  { name: "Пляжи", icon: Waves, color: "from-blue-500 to-cyan-500", href: "/category/beaches", count: "18 мест" },
                  { name: "Храмы", icon: Landmark, color: "from-orange-500 to-amber-500", href: "/category/temples", count: "12 мест" },
                  { name: "Экскурсии", icon: Ship, color: "from-purple-500 to-pink-500", href: "/category/excursions", count: "15 туров" },
                  { name: "Смотровые площадки", icon: Eye, color: "from-green-500 to-emerald-500", href: "/category/viewpoints", count: "11 мест" },
                  { name: "Рестораны", icon: UtensilsCrossed, color: "from-red-500 to-pink-500", href: "/category/restaurants", count: "25 мест" },
                  { name: "СПА", icon: Sparkles, color: "from-pink-500 to-purple-500", href: "/category/spa", count: "17 мест" },
                  { name: "Ночная жизнь", icon: Moon, color: "from-indigo-500 to-purple-500", href: "/category/nightlife", count: "18 мест" },
                  { name: "Торговые центры", icon: ShoppingBag, color: "from-gray-500 to-blue-500", href: "/category/shopping", count: "7 мест" },
                ].map((category) => (
                  <Link
                    key={category.name}
                    to={category.href}
                    className={cn(
                      "flex-shrink-0 w-32 p-4 rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100",
                      "hover:bg-white hover:shadow-lg hover:border-[#007AFF]/20 transition-all duration-200",
                      "group"
                    )}
                  >
                    {/* Круглая иконка */}
                    <div className={cn(
                      "w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center",
                      `bg-gradient-to-r ${category.color}`
                    )}>
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    
                    {/* Название */}
                    <h3 className="font-semibold text-sm text-center mb-1 group-hover:text-[#007AFF] transition-colors">
                      {category.name}
                    </h3>
                    
                    {/* Количество мест */}
                    <p className="text-xs text-gray-500 text-center">
                      {category.count}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

        {/* Как это работает */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Info className="w-6 h-6 text-[#007AFF]" />
            <h2 className="text-2xl font-bold">Как это работает</h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "Выберите услугу",
                description: "Туры, аренда авто, обмен валюты или недвижимость",
                icon: Compass
              },
              {
                step: "2", 
                title: "Свяжитесь с нами",
                description: "Напишите в Telegram или позвоните",
                icon: MessageCircle
              },
              {
                step: "3",
                title: "Получите результат",
                description: "Быстрое решение ваших задач",
                icon: Star
              }
            ].map((item) => (
              <div key={item.step} className={cn(getCardClass('default'), "p-6 text-center")}>
                <div className="w-16 h-16 rounded-full bg-[#007AFF]/10 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-[#007AFF]" />
                </div>
                <div className="w-8 h-8 rounded-full bg-[#007AFF] text-white font-bold flex items-center justify-center mx-auto mb-3">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Concierge CTA */}
        <div className={cn(getCardClass('default'), "p-6 text-center")}>
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#007AFF]/10 mb-3">
            <MessageCircle className="w-8 h-8 text-[#007AFF]" />
          </div>
          <h2 className="text-lg font-bold mb-2">
            Не знаете что выбрать?
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            AI консьерж подберет идеальный вариант
          </p>
          <Button 
            onClick={handleTelegramClick}
            size="lg"
            className="w-full max-w-sm bg-[#007AFF] hover:bg-[#0056CC]"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Написать в Telegram
          </Button>
          <p className="text-xs text-gray-500 mt-3">
            Отвечаем в течение 5 минут
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
