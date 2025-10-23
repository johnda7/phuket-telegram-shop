import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProducts, fetchProductByHandle, type ShopifyProduct } from "@/lib/shopify";
import { getPlaceByHandle, getRelatedPlaces, type Place } from "@/data/places";
import { Loader2, MapPin, Star, ChevronLeft, ChevronRight, ExternalLink, MessageCircle, ChevronRight as ChevronRightIcon, Clock, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ProductCard";
import { useMetaTags } from "@/hooks/useMetaTags";

const PlaceDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [place, setPlace] = useState<Place | null>(null);
  const [relatedPlaces, setRelatedPlaces] = useState<Place[]>([]);
  const [relatedTours, setRelatedTours] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const loadPlace = async () => {
      if (!handle) return;
      
      try {
        setLoading(true);
        
        // Сначала пробуем загрузить из локальной базы
        let placeData = getPlaceByHandle(handle);
        
        // Если не найдено локально, пробуем загрузить из Shopify
        if (!placeData) {
          try {
            const shopifyProduct = await fetchProductByHandle(handle);
            if (shopifyProduct?.node) {
              const product = shopifyProduct.node;
              // Конвертируем Shopify продукт в Place
              placeData = {
                id: product.id,
                handle: product.handle,
                title: product.title,
                description: product.description,
                category: product.tags.includes('category:beaches') ? 'beaches' as const : 
                         product.tags.includes('category:temples') ? 'temples' as const : 
                         'attractions' as const,
                images: product.images.edges.map(img => img.node.url),
                tags: product.tags,
                rating: 4.5,
                reviewsCount: 100,
                priceLevel: 2 as const,
              };
            }
          } catch (err) {
            console.error('Error loading from Shopify:', err);
          }
        }
        
        if (!placeData) {
          setError('Место не найдено');
          setLoading(false);
          return;
        }
        
        setPlace(placeData);
        
        // Загружаем связанные места
        const related = getRelatedPlaces(handle, 3);
        setRelatedPlaces(related);
        
        // Загружаем связанные туры из Shopify
        if (placeData.relatedTours && placeData.relatedTours.length > 0) {
          const allProducts = await fetchProducts(50);
          const tours = allProducts.filter(p => 
            placeData.relatedTours!.includes(p.node.handle)
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
  const rating = place.rating || 4.5;
  const reviewsCount = place.reviewsCount || 100;
  const priceLevel = place.priceLevel || 2;
  
  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openMaps = () => {
    if (place.mapUrl) {
      window.open(place.mapUrl, '_blank');
    } else if (place.coordinates) {
      window.open(`https://www.google.com/maps?q=${place.coordinates.lat},${place.coordinates.lng}`, '_blank');
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
            <Button
              onClick={openMaps}
              variant="outline"
              className="mb-6 gap-2"
            >
              <MapPin className="w-4 h-4" />
              Гео: Открыть на карте
              <ExternalLink className="w-4 h-4" />
            </Button>

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

            {/* Related Places */}
            {relatedPlaces.length > 0 && (
              <div className="glass-card p-6">
                <h3 className="text-lg font-bold mb-4">
                  Лучшие места на пляже {district}
                </h3>
                <div className="space-y-4">
                  {relatedPlaces.map((relPlace) => (
                    <Link
                      key={relPlace.id}
                      to={`/place/${relPlace.handle}`}
                      className="flex gap-3 group"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        {relPlace.images[0] && (
                          <img
                            src={relPlace.images[0]}
                            alt={relPlace.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                          {relPlace.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {relPlace.description.substring(0, 80)}...
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetail;
