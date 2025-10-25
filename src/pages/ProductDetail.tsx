import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { storefrontApiRequest, type ShopifyProduct } from "@/lib/shopify";
import { Loader2, ArrowLeft, ShoppingCart, Star, Clock, Users, Calendar, Car, MessageCircle, Check, X, MapPin, Utensils, Waves, Camera, ChevronLeft, ChevronRight, Image as ImageIcon, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { AIConsiergeWidget } from "@/components/AIConsiergeWidget";
import { BookingDialog } from "@/components/BookingDialog";
import { TourMap } from "@/components/TourMap";
import { useMetaTags } from "@/hooks/useMetaTags";
import { RelatedTours } from "@/components/RelatedTours";

// Import additional images for demo
import phiPhiMayaBay from "@/assets/phi-phi-maya-bay.jpg";
import phiPhiSnorkeling from "@/assets/phi-phi-snorkeling.jpg";
import phiPhiSunset from "@/assets/phi-phi-sunset.jpg";
import phiPhiHotel from "@/assets/phi-phi-hotel.jpg";

const PRODUCT_QUERY = `
  query GetProduct($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      handle
      productType
      tags
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      images(first: 50) {
        edges {
          node {
            url
            altText
          }
        }
      }
      variants(first: 10) {
        edges {
          node {
            id
            title
            price {
              amount
              currencyCode
            }
            availableForSale
            selectedOptions {
              name
              value
            }
          }
        }
      }
      options {
        name
        values
      }
    }
  }
`;

const ProductDetail = () => {
  const { handle } = useParams();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await storefrontApiRequest(PRODUCT_QUERY, { handle });
        if (data?.data?.product) {
          const productData = { node: data.data.product };
          setProduct(productData);
          setSelectedVariant(data.data.product.variants.edges[0]?.node);
        }
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    };

    if (handle) {
      loadProduct();
    }
  }, [handle]);

  // Update meta tags for social sharing
  useMetaTags({
    title: product ? `${product.node.title} | PhuketDa` : 'PhuketDa - Туры на Пхукете',
    description: product?.node.description?.substring(0, 160) || 'Забронируйте тур на Пхукете с персональным AI-помощником',
    image: product?.node.images.edges[0]?.node.url || 'https://phuketda.app/og-image.jpg',
    url: window.location.href,
  });

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    const cartItem = {
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions || []
    };

    addItem(cartItem);
    toast.success("Добавлено в корзину!", {
      description: `${product.node.title} - ${selectedVariant.title}`
    });
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = product?.node.title || 'Тур на Пхукете';
    const text = `Смотри какой тур я нашел! ${title}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
        toast.success("Ссылка отправлена!");
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          copyToClipboard(url);
        }
      }
    } else {
      copyToClipboard(url);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Ссылка скопирована!", {
      description: "Теперь можете поделиться ей где угодно"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Тур не найден</h2>
          <Link to="/tours">
            <Button>← Назад к турам</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = product.node.images.edges;
  
  // Add demo images if this is the Phi Phi tour
  const enhancedImages = handle === 'phi-phi-2-days-1-night' 
    ? [
        ...images,
        { node: { url: phiPhiMayaBay, altText: 'Maya Bay aerial view' }},
        { node: { url: phiPhiSnorkeling, altText: 'Snorkeling at Phi Phi' }},
        { node: { url: phiPhiSunset, altText: 'Sunset at Phi Phi viewpoint' }},
        { node: { url: phiPhiHotel, altText: 'Beachfront hotel room' }}
      ]
    : images;
  
  const tags = product.node.tags || [];
  const isHit = tags.includes('хит') || tags.includes('ХИТ') || tags.includes('популярное');
  const category = product.node.productType;

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % enhancedImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + enhancedImages.length) % enhancedImages.length);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="flex items-center justify-between mb-6">
          <Link 
            to="/phuket" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Назад к Пхукету
          </Link>

          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-2"
          >
            <Share2 className="w-4 h-4" />
            Поделиться
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery - Full Width Carousel */}
            <div className="glass-card p-4 mb-6 relative">
              {/* Badges */}
              <div className="absolute top-7 left-7 z-10 flex gap-2">
                {isHit && (
                  <Badge className="bg-destructive text-destructive-foreground font-bold px-3 py-1 text-sm">
                    ХИТ
                  </Badge>
                )}
                {category && (
                  <Badge className="bg-success text-success-foreground font-bold px-3 py-1 text-sm">
                    {category}
                  </Badge>
                )}
              </div>

              {/* Rating (take from tags like "rating:4.5" or fallback) */}
              <div className="absolute top-7 right-7 z-10 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1 shadow-lg">
                <Star className="w-4 h-4 fill-warning text-warning" />
                {(() => {
                  const ratingTag = tags.find(t => t && t.toString().toLowerCase().startsWith('rating:'));
                  const rating = ratingTag ? ratingTag.split(':')[1] : null;
                  return (
                    <span className="text-sm font-semibold">{rating ?? '—'}</span>
                  );
                })()}
              </div>

              {/* Main Carousel Image */}
              <div className="relative aspect-video rounded-xl overflow-hidden bg-secondary/20 group">
                {enhancedImages[selectedImageIndex]?.node && (
                  <img
                    src={enhancedImages[selectedImageIndex].node.url}
                    alt={`${product.node.title} ${selectedImageIndex + 1}`}
                    className="w-full h-full object-cover"
                  />
                )}

                {/* Navigation Arrows */}
                {enhancedImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background shadow-lg"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background shadow-lg"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}
              </div>

              {/* Dot Indicators */}
              {enhancedImages.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {enhancedImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === selectedImageIndex 
                          ? 'w-8 bg-foreground' 
                          : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}

              {/* View All Photos Button */}
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={() => setSelectedImageIndex(0)}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Посмотреть все {enhancedImages.length} фото
              </Button>
            </div>

            {/* Product Info */}
            <div className="glass-card p-6">
              <h1 className="text-3xl font-bold mb-3">{product.node.title}</h1>
              <p className="text-muted-foreground mb-6 flex items-start gap-2">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                {product.node.description?.substring(0, 200) || 'Экскурсия с ночевкой на островах'}
              </p>

              {/* Share Button - Prominent */}
              <Button
                variant="outline"
                size="lg"
                onClick={handleShare}
                className="w-full mb-6 gap-2"
              >
                <Share2 className="w-5 h-5" />
                Поделиться
              </Button>

              {/* Description - HTML from Shopify */}
              <div className="border-t pt-6">
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: product.node.descriptionHtml || product.node.description || '' }}
                />
              </div>

              {/* Tour Map */}
              <div className="border-t pt-6 mt-6">
                <TourMap tourHandle={handle || ''} />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24">
              <h3 className="text-2xl font-bold mb-2">{product.node.title}</h3>
              <p className="text-sm text-muted-foreground mb-6">
                {product.node.description?.substring(0, 100) || ''}
              </p>

              {/* Quick Info: render tour-specific fields only for tours, otherwise show info product CTA/summary */}
              {((product.node.productType && product.node.productType.toLowerCase().includes('excurs')) || tags.includes('tour')) ? (
                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-warning fill-warning" />
                    <span className="font-semibold">{(() => {
                      const ratingTag = tags.find(t => t && t.toString().toLowerCase().startsWith('rating:'));
                      return ratingTag ? ratingTag.split(':')[1] : '—';
                    })()}</span>
                    <span className="text-muted-foreground ml-auto">{product.node.options.find(o=>o.name.toLowerCase().includes('day')) ? 'длительность' : ''}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    {/* prefer metafield or tags — fallback to variant option if present */}
                    <span className="text-muted-foreground">{product.node.tags.find(t=>t.match(/\d+-day|\d+day|\d+\s?дн/)) ?? '—'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{product.node.tags.find(t=>t.toLowerCase().includes('group')) ?? '—'}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 mb-6 text-sm">
                  {/* Information product: show summary + CTA to tours */}
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="font-semibold">Информация</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {/* Show entrance price if variant price is 0 -> Бесплатно */}
                    {parseFloat(product.node.priceRange.minVariantPrice.amount) === 0 ? (
                      <p>Вход: <strong>Бесплатно</strong></p>
                    ) : (
                      <p>Цена: <strong>{parseFloat(product.node.priceRange.minVariantPrice.amount).toFixed(0)} {product.node.priceRange.minVariantPrice.currencyCode}</strong></p>
                    )}
                    <p className="mt-2">{product.node.description?.substring(0, 160)}</p>
                  </div>
                  <div className="mt-4 space-y-2">
                    <Button size="sm" className="w-full" onClick={() => window.location.href = '/tours'}>Посмотреть туры</Button>
                    <Button size="sm" variant="outline" className="w-full" onClick={() => window.open('https://t.me/phuketda_bot', '_blank')}>Написать в Телеграм</Button>
                  </div>
                </div>
              )}

              {/* Price and Buttons Section */}
              <div className="border-t pt-6">
                {/* Price */}
                <div className="mb-6">
                  <p className="text-4xl font-bold text-primary mb-1">
                    от ${parseFloat(product.node.priceRange.minVariantPrice.amount).toFixed(0)} ₽
                  </p>
                  <p className="text-sm text-muted-foreground">за взрослого</p>
                </div>

                {/* Action Buttons - Phukeo Style */}
                <div className="space-y-3">
                  <Button
                    size="lg"
                    className="w-full bg-[#0088cc] hover:bg-[#0088cc]/90 text-white"
                    onClick={() => window.open('https://t.me/phuketda_bot', '_blank')}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Написать в Телеграм
                  </Button>

                  <Button
                    size="lg"
                    className="w-full bg-[#4CAF50] hover:bg-[#4CAF50]/90 text-white"
                    onClick={() => setBookingDialogOpen(true)}
                  >
                    Забронировать
                  </Button>
                </div>
              </div>

              {/* Variant Selection */}
              {product.node.options.length > 0 && product.node.variants.edges.length > 1 && (
                <div className="border-t pt-6 mt-6">
                  <label className="block text-sm font-semibold mb-3">
                    {product.node.options[0].name}
                  </label>
                  <div className="flex flex-col gap-2">
                    {product.node.variants.edges.map(({ node: variant }) => (
                      <Button
                        key={variant.id}
                        variant={selectedVariant?.id === variant.id ? "default" : "outline"}
                        onClick={() => setSelectedVariant(variant)}
                        className="w-full justify-between"
                      >
                        <span>{variant.title}</span>
                        <span className="font-bold">
                          ${parseFloat(variant.price.amount).toFixed(0)}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* AI Concierge */}
            <div className="mt-6">
              <AIConsiergeWidget />
            </div>
          </div>
        </div>
      </div>

      {/* Related Tours Section */}
      <div className="container mx-auto px-4 mb-12">
        <RelatedTours 
          currentProductId={product.node.id}
          currentTags={product.node.tags}
          limit={3}
        />
      </div>

      {/* Booking Dialog */}
      <BookingDialog
        open={bookingDialogOpen}
        onOpenChange={setBookingDialogOpen}
        tourTitle={product.node.title}
        tourDescription={product.node.description?.substring(0, 200) || ''}
        adultPrice={selectedVariant ? parseFloat(selectedVariant.price.amount) : parseFloat(product.node.priceRange.minVariantPrice.amount)}
        childPrice={selectedVariant ? parseFloat(selectedVariant.price.amount) * 0.8 : parseFloat(product.node.priceRange.minVariantPrice.amount) * 0.8}
      />
    </div>
  );
};

export default ProductDetail;
