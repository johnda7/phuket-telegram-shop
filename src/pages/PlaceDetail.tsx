import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchProductByHandle, fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import { Loader2, MapPin, Star, ChevronLeft, ChevronRight, ExternalLink, MessageCircle, ChevronRight as ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ProductCard";
import { useMetaTags } from "@/hooks/useMetaTags";

const PlaceDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [relatedPlaces, setRelatedPlaces] = useState<ShopifyProduct[]>([]);
  const [relatedTours, setRelatedTours] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const loadProduct = async () => {
      if (!handle) return;
      
      try {
        setLoading(true);
        const data = await fetchProductByHandle(handle);
        setProduct(data);
        
        // Load related content
        const allProducts = await fetchProducts(50);
        const tours = allProducts.filter(p => p.node.tags.includes('tour'));
        const places = allProducts.filter(p => 
          p.node.tags.some(tag => ['пляж', 'место', 'beach', 'place'].includes(tag.toLowerCase())) &&
          p.node.handle !== handle
        );
        
        setRelatedTours(tours.slice(0, 2));
        setRelatedPlaces(places.slice(0, 3));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load place');
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [handle]);

  // Update meta tags for SEO
  useMetaTags({
    title: product ? `${product.node.title} | PhuketDa` : 'PhuketDa - Пляжи Пхукета',
    description: product?.node.description?.substring(0, 160) || 'Откройте для себя лучшие места Пхукета',
    image: product?.node.images.edges[0]?.node.url || 'https://phuketda.app/og-image.jpg',
    url: window.location.href,
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error || 'Place not found'}</p>
          <Link to="/beaches">
            <Button>← Вернуться к пляжам</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = product.node.images.edges;
  const category = product.node.productType || 'Пляж';
  const district = 'Пхукет'; // Can be extracted from tags or metadata in future
  const rating = 4.8;
  const reviewsCount = 2524;
  
  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const openMaps = () => {
    // For demo purposes - in production would use actual coordinates
    window.open('https://maps.app.goo.gl/b3Qv3S5sKsWTVvEm6', '_blank');
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
          <span className="text-foreground font-medium">{product.node.title}</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Title */}
            <h1 className="text-4xl font-bold mb-6">{product.node.title}</h1>

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
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge variant="secondary" className="text-base px-3 py-1">
                {category}
              </Badge>
              <Badge variant="outline" className="text-base px-3 py-1">
                {district}
              </Badge>
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
                    src={images[selectedImageIndex].node.url}
                    alt={`${product.node.title} ${selectedImageIndex + 1}`}
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

                {/* Thumbnail Strip */}
                {images.length > 1 && (
                  <div className="grid grid-cols-6 gap-2">
                    {images.slice(0, 6).map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`aspect-square rounded-lg overflow-hidden ${
                          index === selectedImageIndex
                            ? 'ring-2 ring-primary'
                            : 'opacity-60 hover:opacity-100'
                        } transition-all`}
                      >
                        <img
                          src={image.node.url}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div className="glass-card p-6 mb-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {product.node.description || "Описание скоро появится"}
                </p>
              </div>
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
                  {relatedPlaces.map((place) => (
                    <Link
                      key={place.node.id}
                      to={`/place/${place.node.handle}`}
                      className="flex gap-3 group"
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                        {place.node.images.edges[0]?.node && (
                          <img
                            src={place.node.images.edges[0].node.url}
                            alt={place.node.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                          {place.node.title}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {place.node.description?.substring(0, 80)}
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
