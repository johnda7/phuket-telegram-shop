import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProducts, fetchProductByHandle, type ShopifyProduct } from "@/lib/shopify";
import { Loader2, MapPin, Star, ChevronLeft, ChevronRight, ExternalLink, MessageCircle, ChevronRight as ChevronRightIcon, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ProductCard";
import { useMetaTags } from "@/hooks/useMetaTags";
import { PlaceFeatures } from "@/components/PlaceFeatures";
import { NativeServiceLinks } from "@/components/NativeServiceLinks";

interface ParsedPlace {
  id: string;
  handle: string;
  title: string;
  description: string;
  category: string;
  district?: string;
  images: string[];
  tags: string[];
  rating: number;
  reviewsCount: number;
  priceLevel: number;
  duration?: string;
  bestTime?: string;
  amenities?: string[];
  tips?: string[];
  mapUrl?: string;
  relatedTours: string[];
}

const PlaceDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [place, setPlace] = useState<ParsedPlace | null>(null);
  const [relatedTours, setRelatedTours] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedPlaces, setRelatedPlaces] = useState<ShopifyProduct[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const loadPlace = async () => {
      if (!handle) return;
      
      try {
        setLoading(true);
        
        // Загружаем ВСЕ продукты из Shopify (т.к. handle с кириллицей не работает в query)
        const allProducts = await fetchProducts(100);
        
        console.log('Looking for handle:', handle);
        console.log('Available handles:', allProducts.map(p => p.node.handle));
        
        // Ищем нужный продукт по handle
        const foundProduct = allProducts.find(p => p.node.handle === handle);
        
        if (!foundProduct) {
          console.error('Product not found for handle:', handle);
          setError(`Место не найдено: ${handle}`);
          setLoading(false);
          return;
        }
        
        console.log('Found product:', foundProduct.node.title);

        const product = foundProduct.node;
        
        // Парсим метафилды
        const getMetafield = (key: string) => {
          if (!product.metafields) return undefined;
          return product.metafields.find(m => m && m.key === key)?.value;
        };

        const parseJSON = (value: string | undefined) => {
          if (!value) return undefined;
          try {
            return JSON.parse(value);
          } catch {
            return undefined;
          }
        };

        // Парсим категорию из тегов
        const categoryTag = product.tags.find(t => t.startsWith('category:'));
        const category = categoryTag?.replace('category:', '') || '';
        
        // Парсим район
        const districtTag = product.tags.find(t => t.startsWith('district:'));
        const district = districtTag?.replace('district:', '');
        
        // Парсим price level
        const priceLevelTag = product.tags.find(t => t.startsWith('price-level:'));
        const priceLevel = priceLevelTag ? parseInt(priceLevelTag.replace('price-level:', '')) : 2;
        
        // Связанные туры
        const relatedTourHandles = product.tags
          .filter(t => t.startsWith('related-tour:'))
          .map(t => t.replace('related-tour:', ''));

        // Конвертируем в ParsedPlace
        const placeData: ParsedPlace = {
          id: product.id,
          handle: product.handle,
          title: product.title,
          description: product.description,
          category,
          district,
          images: product.images.edges.map(img => img.node.url),
          tags: product.tags,
          rating: parseFloat(getMetafield('rating') || '4.5'),
          reviewsCount: parseInt(getMetafield('reviews_count') || '100'),
          priceLevel,
          duration: getMetafield('duration'),
          bestTime: getMetafield('best_time'),
          amenities: parseJSON(getMetafield('amenities')),
          tips: parseJSON(getMetafield('tips')),
          mapUrl: getMetafield('map_url'),
          relatedTours: relatedTourHandles,
        };
        
        setPlace(placeData);
        
        // Загружаем ВСЕ продукты для связанных мест и туров
        const allProductsData = await fetchProducts(100);
        
        // Фильтруем похожие места (те же теги или категория)
        const placeTags = product.tags || [];
        const relatedPlacesData = allProductsData.filter(
          (p) =>
            p.node.productType === "place" &&
            p.node.id !== product.id &&
            p.node.tags?.some(tag => placeTags.includes(tag))
        );
        
        // Загружаем связанные туры
        if (relatedTourHandles.length > 0) {
          const tours = allProductsData.filter(p => 
            relatedTourHandles.includes(p.node.handle)
          );
          setRelatedTours(tours.slice(0, 6));
        } else {
          // Если нет привязанных туров, показываем общие туры
          const tours = allProductsData.filter(p => 
            p.node.productType !== "place"
          );
          setRelatedTours(tours.slice(0, 6));
        }
        
        setRelatedPlaces(relatedPlacesData.slice(0, 6));
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load place');
      } finally {
        setLoading(false);
      }
    };

    loadPlace();
  }, [handle]);

  // Update meta tags for SEO
  useMetaTags({
    title: place ? `${place.title} | PhuketDa` : 'PhuketDa - Места Пхукета',
    description: place?.description?.substring(0, 160) || 'Откройте для себя лучшие места Пхукета',
    image: place?.images[0] || 'https://phuketda.app/og-image.jpg',
    url: window.location.href,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error || 'Место не найдено'}</p>
          <Link to="/categories">
            <Button>← Вернуться к категориям</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = place.images;
  const district = place.district || 'Пхукет';
  const rating = place.rating;
  const reviewsCount = place.reviewsCount;
  const priceLevel = place.priceLevel;
  
  // Временные данные для часов работы (пока metafields не доступны)
  const hoursData: Record<string, string> = {
    'central-phuket-floresta': '10:00-22:00',
    'jungceylon-shopping-center': '11:00-23:00',
    'premium-outlet-phuket': '10:00-22:00',
    'big-c-supercenter-phuket': '08:00-22:00',
    'tesco-lotus-phuket': '08:00-22:00',
    'robinson-lifestyle-phuket': '10:00-22:00',
    'patong-night-market': '17:00-23:00'
  };
  const workingHours = hoursData[place.handle];
  
  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openMaps = () => {
    if (place.mapUrl) {
      window.open(place.mapUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* МИНИМАЛИСТИЧНЫЙ HERO - Perplexity Style */}
      <div className="relative bg-gradient-to-br from-gray-50 to-white pb-16 pt-24">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Title - ПРОСТОЙ И КРУПНЫЙ */}
          <h1 className="text-5xl md:text-6xl font-black mb-6 text-gray-900">
            {place.title}
          </h1>
          
          {/* Badges - ТОЛЬКО ВАЖНОЕ */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full px-4 py-2">
              <Star className="w-4 h-4 fill-white" />
              <span className="font-bold">{rating.toFixed(1)}</span>
            </div>
            
            {place.priceLevel && (
              <div className="bg-gradient-to-r from-emerald-400 to-green-500 text-white rounded-full px-4 py-2 font-bold">
                {'$'.repeat(place.priceLevel)}
              </div>
            )}
            
            {district && (
              <div className="flex items-center gap-2 bg-gray-100 text-gray-700 rounded-full px-4 py-2">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">{district}</span>
              </div>
            )}
          </div>
          
          {/* Description - КОРОТКО И ЯСНО */}
          <p className="text-xl text-gray-600 leading-relaxed">
            {place.description?.split('\n')[0] || "Популярное место на Пхукете"}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">

            {/* Thumbnail Gallery - под hero */}
                {images.length > 1 && (
              <div className="mb-12 -mt-6">
                <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`
                        relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden snap-center
                        transition-all duration-300 hover:scale-110 hover:shadow-2xl
                          ${index === selectedImageIndex 
                          ? 'ring-4 ring-primary shadow-2xl scale-110' 
                          : 'ring-2 ring-white/50 opacity-60 hover:opacity-100'
                          }
                        `}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
              </div>
            )}

            {/* ПРЕМИУМ Quick Actions - красивые кнопки */}
            <div className="grid md:grid-cols-3 gap-5 mb-12">
              {/* Google Maps Button - ЗЕЛЁНЫЙ */}
              {place.mapUrl && (
                <Button
                  onClick={openMaps}
                  size="lg"
                  className="h-24 flex-col gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-[0_10px_30px_rgba(16,185,129,0.4)] hover:shadow-[0_14px_40px_rgba(16,185,129,0.6)] transition-all duration-300 hover:scale-105 rounded-2xl"
                >
                  <MapPin className="w-7 h-7" />
                  <span className="font-black text-base">На карте</span>
                </Button>
              )}
              
              {/* Telegram Bot - СИНИЙ */}
              <Button
                size="lg"
                className="h-24 flex-col gap-3 bg-gradient-to-r from-[#0088cc] to-[#00a0e9] hover:from-[#0077b5] hover:to-[#0088cc] text-white shadow-[0_10px_30px_rgba(0,136,204,0.4)] hover:shadow-[0_14px_40px_rgba(0,136,204,0.6)] transition-all duration-300 hover:scale-105 rounded-2xl"
                onClick={() => window.open('https://t.me/phuketda_bot', '_blank')}
              >
                <MessageCircle className="w-7 h-7" />
                <span className="font-black text-base">Спросить бота</span>
              </Button>
              
              {/* Share - ФИОЛЕТОВЫЙ */}
              <Button
                size="lg"
                className="h-24 flex-col gap-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-[0_10px_30px_rgba(168,85,247,0.4)] hover:shadow-[0_14px_40px_rgba(168,85,247,0.6)] transition-all duration-300 hover:scale-105 rounded-2xl"
                onClick={() => navigator.share?.({ title: place.title, url: window.location.href })}
              >
                <ExternalLink className="w-7 h-7" />
                <span className="font-black text-base">Поделиться</span>
              </Button>
            </div>

            {/* ПРЕМИУМ Description */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-[28px] shadow-[0_20px_70px_-15px_rgba(0,0,0,0.2)] p-10 mb-10 border-2 border-gray-100 hover:shadow-[0_25px_80px_-15px_rgba(0,0,0,0.25)] transition-shadow duration-300">
              <h2 className="text-4xl font-black mb-8 flex items-center gap-4 text-gray-900">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg">
                  <span className="text-4xl">ℹ️</span>
                </div>
                О месте
              </h2>
              <div className="prose prose-xl max-w-none">
                <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                  {place.description}
                </p>
              </div>
              
              {/* Best Time */}
              {place.bestTime && (
                <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                  <p className="font-semibold text-primary mb-1">Лучшее время для посещения:</p>
                  <p className="text-foreground">{place.bestTime}</p>
                </div>
              )}
              
              {/* Amenities */}
              {place.amenities && place.amenities.length > 0 && (
                <div className="mt-6">
                  <p className="font-semibold mb-2">Удобства:</p>
                  <div className="flex flex-wrap gap-2">
                    {place.amenities.map((amenity, index) => (
                      <Badge key={index} variant="outline">{amenity}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Tips */}
              {place.tips && place.tips.length > 0 && (
                <div className="mt-6">
                  <p className="font-semibold mb-3">💡 Полезные советы:</p>
                  <ul className="space-y-2">
                    {place.tips.map((tip, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex gap-2">
                        <span className="text-primary">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Related Tours - Внутри главного контента */}
            {relatedTours.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold mb-6">🎟️ Туры сюда</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {relatedTours.slice(0, 2).map((tour) => (
                    <ProductCard
                      key={tour.node.id}
                      product={tour.node}
                      showPrice={true}
                      linkPrefix="/product"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* НАТИВНЫЕ ССЫЛКИ НА СЕРВИСЫ - ключ к конверсии! */}
            <NativeServiceLinks context="shopping" className="mb-12" />
          </div>

          {/* Sidebar - УЛУЧШЕННЫЙ */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Info Card - iOS style */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 sticky top-4">
              <h3 className="text-2xl font-black mb-6">Быстрая информация</h3>
              
              <div className="space-y-4">
                {/* Rating */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Star className="w-5 h-5 fill-white text-white" />
                    </div>
                    <span className="font-bold">Рейтинг</span>
                  </div>
                  <span className="text-2xl font-black">{rating}/5.0</span>
                </div>
                
                {/* Price Level */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold">Цены</span>
                  </div>
                  <span className="text-2xl font-black text-green-600">
                    {'$'.repeat(priceLevel)}
                  </span>
                </div>
                
                {/* Hours */}
                {workingHours && (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-xl">
                        🕐
                      </div>
                      <span className="font-bold">Часы</span>
                    </div>
                    <span className="text-sm font-bold text-right">{workingHours.split(' ')[0]}</span>
                  </div>
                )}
                
                {/* District */}
                {district && (
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <span className="font-bold">Район</span>
                    </div>
                    <span className="text-sm font-bold">{district}</span>
                  </div>
                )}
              </div>
              
              {/* CTA Button */}
              <Button
                size="lg"
                className="w-full mt-6 h-14 text-lg font-black bg-gradient-to-r from-[#0088cc] to-[#4CAF50] hover:opacity-90 shadow-xl"
                onClick={() => window.open('https://t.me/phuketda_bot', '_blank')}
              >
                💬 ОТКРЫТЬ ТЕЛЕГРАМ БОТ
              </Button>
            </div>
          </div>
        </div>

        {/* Related Places Section - Полная ширина */}
        {relatedPlaces.length > 0 && (
          <section className="py-16 animate-fade-in border-t border-border/50 mt-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                Похожие места
              </h2>
              <p className="text-muted-foreground text-lg">
                Другие интересные локации в этой категории
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPlaces.map((place, index) => (
                <div
                  key={place.node.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard
                    product={place.node}
                    showPrice={false}
                    showRating={true}
                    linkPrefix="/place"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related Tours Section - Полная ширина */}
        {relatedTours.length > 2 && (
          <section className="py-16 animate-fade-in bg-muted/20 -mx-4 px-4 mt-12">
            <div className="container mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                  Туры в этот район
                </h2>
                <p className="text-muted-foreground text-lg">
                  Забронируйте экскурсию и посетите это место
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedTours.slice(2).map((tour, index) => (
                  <div
                    key={tour.node.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ProductCard
                      product={tour.node}
                      showPrice={true}
                      showRating={true}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default PlaceDetail;
