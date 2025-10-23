import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProducts, fetchProductByHandle, type ShopifyProduct } from "@/lib/shopify";
import { Loader2, MapPin, Star, ChevronLeft, ChevronRight, ExternalLink, MessageCircle, ChevronRight as ChevronRightIcon, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ProductCard";
import { useMetaTags } from "@/hooks/useMetaTags";

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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const loadPlace = async () => {
      if (!handle) return;
      
      try {
        setLoading(true);
        
        // Загружаем место из Shopify
        const shopifyProduct = await fetchProductByHandle(handle);
        
        if (!shopifyProduct?.node) {
          setError('Место не найдено');
          setLoading(false);
          return;
        }

        const product = shopifyProduct.node;
        
        // Парсим метафилды
        const getMetafield = (key: string) => {
          return product.metafields?.find(m => m.key === key)?.value;
        };

        const parseJSON = (value: string | undefined) => {
          try {
            return value ? JSON.parse(value) : undefined;
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
        
        // Загружаем связанные туры
        if (relatedTourHandles.length > 0) {
          const allProducts = await fetchProducts(50);
          const tours = allProducts.filter(p => 
            relatedTourHandles.includes(p.node.handle)
          );
          setRelatedTours(tours.slice(0, 2));
        }
        
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary transition-colors">
            Главная
          </Link>
          <ChevronRightIcon className="w-4 h-4" />
          <Link to={`/beaches?district=${district.toLowerCase()}`} className="hover:text-primary transition-colors">
            {district}
          </Link>
          <ChevronRightIcon className="w-4 h-4" />
          <Link to="/beaches" className="hover:text-primary transition-colors">
            Пляжи
          </Link>
          <ChevronRightIcon className="w-4 h-4" />
          <span className="text-foreground font-medium">{place.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Title */}
            <h1 className="text-4xl font-bold mb-6">{place.title}</h1>

            {/* Rating & Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(rating)
                        ? 'fill-warning text-warning'
                        : 'text-muted-foreground'
                    }`}
                  />
                ))}
                <span className="font-bold text-lg">{rating}</span>
                <span className="text-muted-foreground">({reviewsCount})</span>
              </div>
              
              {/* Duration */}
              {place.duration && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4" />
                  <span>{place.duration}</span>
                </div>
              )}
              
              {/* Price Level */}
              <div className="flex items-center gap-1">
                {[...Array(4)].map((_, i) => (
                  <DollarSign
                    key={i}
                    className={`w-4 h-4 ${
                      i < priceLevel
                        ? 'text-green-600'
                        : 'text-muted-foreground/30'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-6">
              {place.tags.slice(0, 5).map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-base px-3 py-1">
                  {tag}
                </Badge>
              ))}
              {district && (
                <Badge variant="outline" className="text-base px-3 py-1">
                  {district}
                </Badge>
              )}
            </div>

            {/* Google Maps Link */}
            {place.mapUrl && (
              <Button
                onClick={openMaps}
                variant="outline"
                className="mb-6 gap-2"
              >
                <MapPin className="w-4 h-4" />
                Гео: Открыть на карте
                <ExternalLink className="w-4 h-4" />
              </Button>
            )}

            {/* Image Gallery */}
            {images.length > 0 && (
              <div className="mb-8">
                {/* Main Image with Navigation */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-secondary/20 group mb-4">
                  <img
                    src={images[selectedImageIndex]}
                    alt={`${place.title} ${selectedImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {/* Navigation Arrows */}
                  {images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/90 backdrop-blur-sm rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background shadow-xl"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/90 backdrop-blur-sm rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background shadow-xl"
                        aria-label="Next image"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                    {selectedImageIndex + 1} / {images.length}
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="glass-card p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">О месте</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
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

            {/* Related Tours */}
            {relatedTours.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-6">🎟️ Туры сюда</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {relatedTours.map((tour) => (
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
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Telegram Bot Card */}
            <div className="glass-card p-6 text-center bg-gradient-to-br from-[#0088cc]/10 to-[#4CAF50]/10">
              <div className="w-24 h-24 mx-auto mb-4 bg-[#0088cc] rounded-full flex items-center justify-center">
                <MessageCircle className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Телеграм бот Инсайдера</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Собрали лучшие места и локации Пхукета. Запускай, чтобы иметь под рукой лучший гид.
              </p>
              <Button
                size="lg"
                className="w-full bg-[#4CAF50] hover:bg-[#4CAF50]/90"
                onClick={() => window.open('https://t.me/phuketda_bot', '_blank')}
              >
                ОТКРЫТЬ ТЕЛЕГРАМ БОТ
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetail;
