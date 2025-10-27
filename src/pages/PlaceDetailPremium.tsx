/**
 * 🏆 PREMIUM PLACE DETAIL PAGE
 * 
 * Design Philosophy:
 * - Perplexity AI: Minimalist, Fast, Focus on Essential
 * - Steve Jobs: "Design is how it works"
 * - iOS 26: Glassmorphism, Fluid animations, Native feel
 * 
 * Features:
 * - Full-screen hero with real photos
 * - Glassmorphism cards
 * - Conversion-focused layout
 * - Native service links (Tours, Car, Currency, Bot)
 * - Related places/tours
 */

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProducts } from "@/lib/shopify";
import { 
  Loader2, MapPin, Star, ExternalLink, MessageCircle, 
  Clock, DollarSign, ChevronLeft, ChevronRight,
  Wifi, ParkingCircle, CreditCard, ShoppingBag,
  Utensils, Film, Baby, Phone
} from "lucide-react";

interface PlacePhoto {
  url: string;
  alt: string;
}

interface ParsedPlace {
  id: string;
  handle: string;
  title: string;
  description: string;
  category: string;
  district?: string;
  images: PlacePhoto[];
  tags: string[];
  rating: number;
  priceLevel: number;
  workingHours?: string;
  amenities?: string[];
}

const PlaceDetailPremium = () => {
  const { handle } = useParams<{ handle: string }>();
  const [place, setPlace] = useState<ParsedPlace | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const loadPlace = async () => {
      if (!handle) return;
      
      try {
        setLoading(true);
        const allProducts = await fetchProducts(100);
        const foundProduct = allProducts.find(p => p.node.handle === handle);
        
        if (!foundProduct) {
          setLoading(false);
          return;
        }

        const product = foundProduct.node;
        
        // Parse category
        const categoryTag = product.tags.find(t => t.startsWith('category:'));
        const category = categoryTag?.replace('category:', '') || '';
        
        // Parse district
        const districtTag = product.tags.find(t => t.startsWith('district:'));
        const district = districtTag?.replace('district:', '');
        
        // Parse price level
        const priceLevelTag = product.tags.find(t => t.startsWith('price-level:'));
        const priceLevel = priceLevelTag ? parseInt(priceLevelTag.replace('price-level:', '')) : 2;
        
        // Parse working hours from metafields or tags
        const workingHoursTag = product.tags.find(t => t.includes(':00'));
        const workingHours = workingHoursTag;
        
        // Parse rating
        const ratingTag = product.tags.find(t => t.startsWith('rating:'));
        const rating = ratingTag ? parseFloat(ratingTag.replace('rating:', '')) : 4.5;
        
        // Images
        const images = product.images?.edges.map(e => ({
          url: e.node.url,
          alt: e.node.altText || product.title
        })) || [];

        setPlace({
          id: product.id,
          handle: product.handle,
          title: product.title,
          description: product.description || '',
          category,
          district,
          images,
          tags: product.tags,
          rating,
          priceLevel,
          workingHours,
          amenities: ['Wi-Fi', 'Parking', 'Food Court', 'ATM'] // TODO: from metafields
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading place:', error);
        setLoading(false);
      }
    };

    loadPlace();
  }, [handle]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!place) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <p className="text-lg text-gray-600 mb-4">Место не найдено</p>
        <Link to="/categories" className="text-primary hover:underline">
          ← Вернуться к категориям
        </Link>
      </div>
    );
  }

  const heroImage = place.images[currentImageIndex] || {
    url: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"%3E%3Crect fill="%234B5563" width="1200" height="800"/%3E%3C/svg%3E',
    alt: place.title
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 
        🌟 HERO SECTION - Full Screen Photo Gallery
        Design: iOS 26 + Perplexity AI
      */}
      <div className="relative h-[70vh] overflow-hidden">
        {/* Hero Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-500"
          style={{ backgroundImage: `url(${heroImage.url})` }}
        >
          {/* Gradient Overlay для читаемости */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
        </div>

        {/* Navigation Controls */}
        {place.images.length > 1 && (
          <>
            <button
              onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? place.images.length - 1 : prev - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all"
            >
              <ChevronLeft className="w-6 h-6 text-white drop-shadow-lg" />
            </button>
            <button
              onClick={() => setCurrentImageIndex((prev) => (prev === place.images.length - 1 ? 0 : prev + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white/30 transition-all"
            >
              <ChevronRight className="w-6 h-6 text-white drop-shadow-lg" />
            </button>
          </>
        )}

        {/* Content Overlay - iOS 26 Glassmorphism */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-4xl mx-auto">
            {/* Category Badge */}
            <div className="mb-4">
              <span className="inline-block px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium">
                {place.category}
              </span>
            </div>

            {/* Title - Apple Typography */}
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 drop-shadow-2xl">
              {place.title}
            </h1>

            {/* Meta Info - Compact & Clean */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {/* Rating */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400 drop-shadow-lg" />
                <span className="text-white font-bold">{place.rating.toFixed(1)}</span>
              </div>

              {/* Price Level */}
              {place.priceLevel && (
                <div className="flex items-center gap-1 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
                  {Array.from({ length: place.priceLevel }).map((_, i) => (
                    <DollarSign key={i} className="w-4 h-4 text-green-400 drop-shadow-lg" />
                  ))}
                </div>
              )}

              {/* District */}
              {place.district && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
                  <MapPin className="w-4 h-4 text-white" />
                  <span className="text-white font-medium">{place.district}</span>
                </div>
              )}

              {/* Working Hours */}
              {place.workingHours && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
                  <Clock className="w-4 h-4 text-white" />
                  <span className="text-white font-medium">{place.workingHours}</span>
                </div>
              )}
            </div>

            {/* Quick Actions - iOS 26 Style */}
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://t.me/PHUKETDABOT`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white font-semibold hover:scale-105 transition-transform shadow-lg"
              >
                <MessageCircle className="w-5 h-5" />
                Написать в бот
              </a>
              <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold hover:bg-white/30 transition-all">
                <MapPin className="w-5 h-5" />
                Показать на карте
              </button>
              <button className="flex items-center gap-2 px-6 py-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white font-semibold hover:bg-white/30 transition-all">
                <ExternalLink className="w-5 h-5" />
                Поделиться
              </button>
            </div>
          </div>
        </div>

        {/* Photo Counter */}
        {place.images.length > 1 && (
          <div className="absolute top-4 right-4 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md text-white text-sm font-medium">
            {currentImageIndex + 1} / {place.images.length}
          </div>
        )}
      </div>

      {/* 
        📝 CONTENT SECTION - Perplexity Minimalism
      */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Description Card - Glassmorphism */}
        <div className="mb-12 p-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl">
          <h2 className="text-3xl font-black text-gray-900 mb-6">О месте</h2>
          <div 
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: place.description }}
          />
        </div>

        {/* Amenities - Icon Grid */}
        {place.amenities && place.amenities.length > 0 && (
          <div className="mb-12 p-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-gray-200/50 shadow-xl">
            <h2 className="text-3xl font-black text-gray-900 mb-6">Удобства</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {place.amenities.map((amenity, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Wifi className="w-5 h-5 text-primary" />
                  </div>
                  <span className="font-medium text-gray-900">{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 
          💰 CONVERSION SECTION - Native Service Links
          KEY FOR BUSINESS!
        */}
        <div className="mb-12">
          <h2 className="text-3xl font-black text-gray-900 mb-6">Наши сервисы</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                icon: ShoppingBag,
                title: 'Туры на Пхукете',
                description: 'Экскурсии на острова, храмы, водопады',
                link: '/phuket',
                gradient: 'from-blue-500 to-purple-600'
              },
              {
                icon: Car,
                title: 'Аренда авто',
                description: 'Удобные машины для поездок',
                link: '/services/car-rental',
                gradient: 'from-green-500 to-teal-600'
              },
              {
                icon: RefreshCw,
                title: 'Обмен валюты',
                description: 'Выгодный курс без комиссии',
                link: '/services/currency-exchange',
                gradient: 'from-orange-500 to-red-600'
              },
              {
                icon: Home,
                title: 'Недвижимость',
                description: 'Аренда и продажа вилл',
                link: '/services/real-estate',
                gradient: 'from-purple-500 to-pink-600'
              }
            ].map((service, i) => (
              <Link
                key={i}
                to={service.link}
                className="group p-6 rounded-2xl bg-gradient-to-br hover:scale-[1.02] transition-all border border-gray-200/50 shadow-lg hover:shadow-xl"
                style={{
                  background: `linear-gradient(135deg, ${service.gradient.includes('blue') ? '#3B82F6' : service.gradient.includes('green') ? '#10B981' : service.gradient.includes('orange') ? '#F59E0B' : '#A855F7'}, ${service.gradient.includes('purple') ? '#9333EA' : service.gradient.includes('teal') ? '#14B8A6' : service.gradient.includes('red') ? '#EF4444' : '#EC4899'})`
                }}
              >
                <service.icon className="w-8 h-8 text-white mb-3" />
                <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
                <p className="text-white/90 text-sm">{service.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Telegram Bot CTA */}
        <div className="p-8 rounded-3xl bg-gradient-to-br from-primary to-blue-600 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-black text-white mb-2">
                Есть вопросы? Спросите ДА Бота! 🤖
              </h3>
              <p className="text-white/90">
                AI-консьерж ответит на все вопросы про Пхукет 24/7
              </p>
            </div>
            <a
              href="https://t.me/PHUKETDABOT"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-full bg-white text-primary font-bold hover:scale-105 transition-transform shadow-lg whitespace-nowrap"
            >
              Открыть бот →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

// Missing imports for service links
import { Car, Home, RefreshCw } from "lucide-react";

export default PlaceDetailPremium;

