import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { storefrontApiRequest, type ShopifyProduct } from "@/lib/shopify";
import { Loader2, ArrowLeft, Star, Clock, Users, MessageCircle, MapPin, ChevronLeft, ChevronRight, Image as ImageIcon, Share2, Phone, Calendar, Shield, CheckCircle, XCircle, Info, ExternalLink, Heart, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { AIConsiergeWidget } from "@/components/AIConsiergeWidget";
import { BookingDialog } from "@/components/BookingDialog";
import { TourMap } from "@/components/TourMap";
import { useMetaTags } from "@/hooks/useMetaTags";
import { RelatedTours } from "@/components/RelatedTours";
import { getTourDescription } from "@/data/tourDescriptions";
import { getCardClass } from "@/styles/design-system";
import { AnimatedPrice } from "@/components/AnimatedPrice";

// Import additional images for demo
import phiPhiMayaBay from "@/assets/phi-phi-maya-bay.jpg";
import phiPhiSnorkeling from "@/assets/phi-phi-snorkeling.jpg";
import phiPhiSunset from "@/assets/phi-phi-sunset.jpg";
import phiPhiHotel from "@/assets/phi-phi-hotel.jpg";

// Import additional Phi-Phi tour photos
import mayaBay1 from '@/assets/phi-phi-tour/maya-bay-1.jpg';
import mayaBay2 from '@/assets/phi-phi-tour/maya-bay-2.jpg';
import mayaBay3 from '@/assets/phi-phi-tour/maya-bay-3.jpg';
import mayaBay4 from '@/assets/phi-phi-tour/maya-bay-4.jpg';
import pilehLagoon from '@/assets/phi-phi-tour/pileh-lagoon.jpg';
import vikingCave from '@/assets/phi-phi-tour/viking-cave.jpg';
import fireShow1 from '@/assets/phi-phi-tour/fire-show-1.jpg';
import fireShow2 from '@/assets/phi-phi-tour/fire-show-2.jpg';
import fireShow3 from '@/assets/phi-phi-tour/fire-show-3.jpg';
import bambooIsland from '@/assets/phi-phi-tour/bamboo-island.webp';
import rangYai1 from '@/assets/phi-phi-tour/rang-yai-1.jpg';
import rangYai2 from '@/assets/phi-phi-tour/rang-yai-2.jpg';

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
      metafields(identifiers: [
        { namespace: "custom", key: "description" }
      ]) {
        key
        value
      }
    }
  }
`;

const ProductDetail = () => {
  const { handle } = useParams();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<any>(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const data = await storefrontApiRequest(PRODUCT_QUERY, { handle });
        console.log('Product data:', data.data.product);
        console.log('Metafields:', data.data.product?.metafields);
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
        { node: { url: mayaBay1, altText: 'Maya Bay 1' }},
        { node: { url: mayaBay2, altText: 'Maya Bay 2' }},
        { node: { url: mayaBay3, altText: 'Maya Bay 3' }},
        { node: { url: mayaBay4, altText: 'Maya Bay 4' }},
        { node: { url: pilehLagoon, altText: 'Pileh Lagoon' }},
        { node: { url: vikingCave, altText: 'Viking Cave' }},
        { node: { url: phiPhiSnorkeling, altText: 'Snorkeling at Phi Phi' }},
        { node: { url: fireShow1, altText: 'Fire show 1' }},
        { node: { url: fireShow2, altText: 'Fire show 2' }},
        { node: { url: fireShow3, altText: 'Fire show 3' }},
        { node: { url: bambooIsland, altText: 'Bamboo Island' }},
        { node: { url: rangYai1, altText: 'Rang Yai Island 1' }},
        { node: { url: rangYai2, altText: 'Rang Yai Island 2' }},
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

  // Derive adult/child variants and prices for consistent display
  const variants = product.node.variants?.edges?.map((e:any) => e.node) || [];
  const adultVariant = variants.find((v:any) => /взрос/i.test(v.title) || /adult/i.test(v.title)) || variants[0];
  const childVariant = variants.find((v:any) => /дет/i.test(v.title) || /child/i.test(v.title));
  
  // Use adult price for display (should be 4500฿ for Phi-Phi)
  const adultPrice = adultVariant ? parseFloat(adultVariant.price.amount) : parseFloat(product.node.priceRange.minVariantPrice.amount);
  const childPrice = childVariant ? parseFloat(childVariant.price.amount) : Math.round(adultPrice * 0.88);
  
  // Ensure we show the correct adult price (4500฿ for Phi-Phi)
  const displayPrice = adultPrice;

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header - Telegram WebApp Style */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="flex items-center justify-between px-4 py-3">
            <Link 
              to="/tours" 
              className="inline-flex items-center text-sm text-gray-600 hover:text-[#007AFF] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Назад
            </Link>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="p-2 text-gray-600 hover:text-[#007AFF]"
              >
                <Share2 className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-2 text-gray-600 hover:text-[#007AFF]"
              >
                <Heart className="w-5 h-5" />
              </Button>
            </div>
          </div>
          
          {/* Breadcrumbs */}
          <div className="px-4 pb-3">
            <nav className="flex items-center space-x-2 text-sm">
              <Link to="/" className="text-gray-500 hover:text-[#007AFF] transition-colors">
                Главная
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <Link to="/tours" className="text-gray-500 hover:text-[#007AFF] transition-colors">
                Туры
              </Link>
              <ChevronRight className="w-4 h-4 text-gray-400" />
              <span className="text-gray-900 font-medium truncate">
                {product.node.title}
              </span>
            </nav>
          </div>
        </div>

        <div className="px-4 py-6">

        {/* Image Gallery - Telegram WebApp Style */}
        <div className="bg-white rounded-2xl overflow-hidden mb-6 shadow-sm">
          {/* Badges */}
          <div className="absolute top-4 left-4 z-10 flex gap-2">
            {isHit && (
              <div className="bg-red-500 text-white font-bold px-3 py-1 text-xs rounded-full">
                ХИТ
              </div>
            )}
            {category && (
              <div className="bg-green-500 text-white font-bold px-3 py-1 text-xs rounded-full">
                {category}
              </div>
            )}
          </div>

          {/* Rating */}
          <div className="absolute top-4 right-4 z-10 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-white text-sm font-semibold">
              {(() => {
                const ratingTag = tags.find(t => t && t.toString().toLowerCase().startsWith('rating:'));
                return ratingTag ? ratingTag.split(':')[1] : '4.8';
              })()}
            </span>
          </div>

          {/* Main Image */}
          <div className="relative aspect-[4/3] bg-gray-100">
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
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/70 transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/70 transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Image Counter */}
            {enhancedImages.length > 1 && (
              <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-white text-sm font-medium">
                  {selectedImageIndex + 1} / {enhancedImages.length}
                </span>
              </div>
            )}
          </div>

          {/* View All Photos Button */}
          {enhancedImages.length > 1 && (
            <div className="p-4 border-t border-gray-100">
              <Button
                variant="outline"
                className="w-full bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700"
                onClick={() => {
                  // TODO: Implement photo gallery modal
                  toast.info("Галерея фотографий скоро будет доступна!");
                }}
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                Посмотреть все {enhancedImages.length} фото
              </Button>
            </div>
          )}
        </div>

        {/* Tour Info - Telegram WebApp Style */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <h1 className="text-2xl font-bold mb-3 text-gray-900">{product.node.title}</h1>
          
          {/* Quick Info Row */}
          <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>2 дня / 1 ночь</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>До 30 человек</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>Пхи-Пхи</span>
            </div>
          </div>

          {/* Description - Collapsible */}
          <div className="space-y-4">
            <div className={`relative transition-all duration-300 ${isDescriptionExpanded ? 'max-h-none' : 'max-h-96 overflow-hidden'}`}>
              <div 
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ 
                  __html: product.node.metafields?.find(m => m?.key === 'description')?.value || 
                          getTourDescription(product.node.handle) || 
                          product.node.description || '' 
                }}
              />
              {!isDescriptionExpanded && (
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none" />
              )}
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="w-full text-[#007AFF] hover:bg-blue-50"
            >
              {isDescriptionExpanded ? 'Свернуть' : 'Показать полностью'}
            </Button>
          </div>
        </div>

                {/* Tour Itinerary - Premium Design */}
                <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Маршрут тура</h3>
                      <p className="text-sm text-gray-500">Весь путь от Пхукета до Островов Пхи-Пхи</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Day 1 */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          1
                        </div>
                        <h4 className="font-semibold text-gray-900">День 1: Пхукет → Пхи-Пхи</h4>
                      </div>
                      <div className="space-y-2 ml-11">
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-gray-700">06:50 - Выезд из отеля</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700">09:50 - Майя Бэй (съемки "Пляжа")</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700">10:50 - Лагуна Пиле (снорклинг)</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-gray-700">14:20 - Обед в ресторане</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-gray-700">20:30 - Огненное шоу на пляже</span>
                        </div>
                      </div>
                    </div>

                    {/* Day 2 */}
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          2
                        </div>
                        <h4 className="font-semibold text-gray-900">День 2: Пхи-Пхи → Пхукет</h4>
                      </div>
                      <div className="space-y-2 ml-11">
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-gray-700">07:00 - Завтрак в отеле</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700">10:30 - Смотровая площадка (панорама)</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-green-500" />
                          <span className="text-sm text-gray-700">15:30 - Снорклинг у кораллов</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-4 h-4 text-red-500" />
                          <span className="text-sm text-gray-700">17:00 - Возвращение в Пхукет</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

        {/* Price & Booking Section - Telegram WebApp Style */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          {/* Price Display */}
          <div className="text-center mb-6">
            <AnimatedPrice 
              adultPrice={adultPrice} 
              childPrice={childPrice} 
              className="text-4xl font-bold mb-1"
            />
          </div>

          {/* Variant Selection */}
          {product.node.options.length > 0 && product.node.variants.edges.length > 1 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">
                {product.node.options[0].name}
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {product.node.variants.edges.map(({ node: variant }) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      selectedVariant?.id === variant.id 
                        ? 'border-[#007AFF] bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-900">{variant.title}</span>
                      <span className="font-bold text-[#007AFF]">
                        {parseFloat(variant.price.amount).toFixed(0)} ฿
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              size="lg"
              className="w-full bg-[#007AFF] hover:bg-[#0056CC] text-white rounded-xl h-12 text-base font-semibold"
              onClick={() => window.open('https://t.me/PHUKETDABOT', '_blank')}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Написать в Telegram
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50 rounded-xl h-12 text-base font-semibold"
              onClick={() => setBookingDialogOpen(true)}
            >
              <Calendar className="w-5 h-5 mr-2" />
              Забронировать
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
              <span className="flex items-center gap-1">
                <Shield className="w-4 h-4" />
                Страховка включена
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Бесплатная отмена
              </span>
            </div>
            <div className="text-xs text-gray-500 text-center">
              Подтверждение в течение 24 часов
            </div>
          </div>
        </div>

        {/* AI Concierge */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <AIConsiergeWidget />
        </div>
      </div>

        {/* Related Tours Section */}
        <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Похожие туры</h3>
          <RelatedTours 
            currentProductId={product.node.id}
            currentTags={product.node.tags}
            limit={3}
          />
        </div>
      </div>

      <BookingDialog
        open={bookingDialogOpen}
        onOpenChange={setBookingDialogOpen}
        tourTitle={product.node.title}
        tourDescription={product.node.description?.substring(0, 200) || ''}
        adultPrice={adultPrice}
        childPrice={childPrice}
      />

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <AnimatedPrice 
            adultPrice={adultPrice} 
            childPrice={childPrice} 
            className="text-center"
          />
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('https://t.me/PHUKETDABOT', '_blank')}
              className="px-4 py-2 text-[#007AFF] border-[#007AFF] hover:bg-blue-50"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Telegram
            </Button>
            <Button 
              size="sm"
              onClick={() => setBookingDialogOpen(true)}
              className="px-4 py-2 bg-[#007AFF] hover:bg-[#0056CC] text-white"
            >
              Забронировать
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
