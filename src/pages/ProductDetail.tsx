import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { storefrontApiRequest, type ShopifyProduct } from "@/lib/shopify";
import { Loader2, ArrowLeft, Star, Clock, Users, MessageCircle, MapPin, ChevronLeft, ChevronRight, Image as ImageIcon, Share2, Phone, Calendar, Shield, CheckCircle, XCircle, Info, ExternalLink, Heart, Bookmark, ChevronDown, ChevronUp } from "lucide-react";
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
      descriptionHtml
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

// Функция парсинга маршрута из descriptionHtml
function parseTourScheduleFromHTML(descriptionHtml: string) {
  if (!descriptionHtml) return null;

  try {
    // Находим секцию "📅 Программа тура"
    const scheduleMatch = descriptionHtml.match(/<h2>📅 Программа тура<\/h2>([\s\S]*?)(?=<h2>|$)/);
    if (!scheduleMatch) return null;

    const scheduleSection = scheduleMatch[1];
    const schedule: Array<{ day: number; title: string; items: Array<{ time: string; title: string; description?: string }> }> = [];

    // Парсим дни (h3 с заголовками дней)
    const dayRegex = /<h3>(День \d+[^<]*)<\/h3>([\s\S]*?)(?=<h3>|$)/g;
    let dayMatch;

    while ((dayMatch = dayRegex.exec(scheduleSection)) !== null) {
      const dayTitle = dayMatch[1];
      const dayContent = dayMatch[2];
      
      // Извлекаем номер дня
      const dayNumber = dayTitle.match(/День (\d+)/)?.[1] || '1';
      
      // Парсим элементы дня (div с временем и описанием)
      const items: Array<{ time: string; title: string; description?: string }> = [];
      const itemRegex = /<div[^>]*>[\s\S]*?<strong>([^<]+)<\/strong>\s*—\s*([^<]+)<\/div>(?:<p>([^<]*)<\/p>)?/g;
      let itemMatch;
      
      while ((itemMatch = itemRegex.exec(dayContent)) !== null) {
        items.push({
          time: itemMatch[1].trim(),
          title: itemMatch[2].trim(),
          description: itemMatch[3]?.trim()
        });
      }

      if (items.length > 0) {
        schedule.push({
          day: parseInt(dayNumber),
          title: dayTitle,
          items
        });
      }
    }

    return schedule.length > 0 ? schedule : null;
  } catch (error) {
    console.error('Ошибка парсинга маршрута:', error);
    return null;
  }
}

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

  // Initialize accordion functionality after descriptionHtml is rendered
  useEffect(() => {
    if (!product) return;

    const initAccordions = () => {
      const accordionTriggers = document.querySelectorAll('.accordion-trigger');
      
      accordionTriggers.forEach((trigger) => {
        // Remove existing listeners to prevent duplicates
        const newTrigger = trigger.cloneNode(true);
        trigger.parentNode?.replaceChild(newTrigger, trigger);
        
        newTrigger.addEventListener('click', () => {
          const section = newTrigger.closest('[data-accordion-section]');
          if (!section) return;

          const content = section.querySelector('.accordion-content');
          const icon = newTrigger.querySelector('.accordion-icon');
          
          if (!content) return;

          const isHidden = content.classList.contains('hidden');
          
          if (isHidden) {
            content.classList.remove('hidden');
            content.classList.add('block');
            if (icon) {
              icon.textContent = '▲';
              icon.classList.remove('text-gray-400');
              icon.classList.add('text-[#007AFF]');
            }
          } else {
            content.classList.add('hidden');
            content.classList.remove('block');
            if (icon) {
              icon.textContent = '▼';
              icon.classList.add('text-gray-400');
              icon.classList.remove('text-[#007AFF]');
            }
          }
        });
      });
    };

    // Run after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(initAccordions, 100);
    
    return () => clearTimeout(timeoutId);
  }, [product, isDescriptionExpanded]);

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

  // Парсим маршрут из descriptionHtml (приоритет: descriptionHtml из Storefront API)
  const descriptionHtml = product.node.descriptionHtml || 
                          product.node.metafields?.find(m => m?.key === 'description')?.value || 
                          getTourDescription(product.node.handle) ||
                          product.node.description || '';
  
  const tourSchedule = parseTourScheduleFromHTML(descriptionHtml);

  // Определяем подзаголовок маршрута на основе названия тура
  const routeSubtitle = (() => {
    const title = product.node.title || '';
    if (title.includes('Пхи-Пхи')) return 'Весь путь от Пхукета до Островов Пхи-Пхи';
    if (title.includes('Краби') || title.includes('Krabi')) return 'Весь путь от Пхукета до Краби';
    if (title.includes('Джеймс Бонд') || title.includes('James Bond')) return 'Маршрут до острова Джеймса Бонда';
    if (title.includes('Симилан')) return 'Маршрут до Симиланских островов';
    return 'Маршрут тура';
  })();

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header - Telegram WebApp Style */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="flex items-center justify-between px-2 py-2">
            <Link 
              to="/tours" 
              className="inline-flex items-center text-xs text-gray-600 hover:text-[#007AFF] transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Назад
            </Link>

            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="p-1.5 text-gray-600 hover:text-[#007AFF]"
              >
                <Share2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="p-1.5 text-gray-600 hover:text-[#007AFF]"
              >
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Breadcrumbs - Exchange24 Style - КОМПАКТНЫЙ */}
          <div className="px-2 pb-2">
            <nav className="flex items-center space-x-1.5 text-xs">
              <Link to="/" className="text-gray-500 hover:text-[#007AFF] transition-colors">
                Главная
              </Link>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <Link to="/tours" className="text-gray-500 hover:text-[#007AFF] transition-colors">
                Туры
              </Link>
              <ChevronRight className="w-3 h-3 text-gray-400" />
              <span className="text-gray-900 font-medium truncate text-xs">
                {product.node.title}
              </span>
            </nav>
          </div>
        </div>

        <div className="px-2 py-2">

        {/* Image Gallery - Telegram WebApp Style */}
        <div className="bg-white rounded-xl overflow-hidden mb-2 border border-gray-200">
          {/* Badges - Exchange24 Style - КОМПАКТНЫЕ */}
          <div className="absolute top-2 left-2 z-10 flex gap-1.5">
            {isHit && (
              <div className="bg-red-500 text-white font-bold px-2 py-0.5 text-[10px] rounded-full">
                ХИТ
              </div>
            )}
            {category && (
              <div className="bg-green-500 text-white font-bold px-2 py-0.5 text-[10px] rounded-full">
                {category}
              </div>
            )}
          </div>

          {/* Rating */}
          <div className="absolute top-2 right-2 z-10 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span className="text-white text-xs font-semibold">
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

            {/* Image Counter - Exchange24 Style - КОМПАКТНЫЙ */}
            {enhancedImages.length > 1 && (
              <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm rounded-full px-2 py-0.5">
                <span className="text-white text-[10px] font-medium">
                  {selectedImageIndex + 1} / {enhancedImages.length}
                </span>
              </div>
            )}
          </div>

          {/* View All Photos Button */}
          {enhancedImages.length > 1 && (
            <div className="p-2 border-t border-gray-100">
              <Button
                variant="outline"
                className="w-full bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-700 text-xs py-2 min-h-[44px]"
                onClick={() => {
                  // TODO: Implement photo gallery modal
                  toast.info("Галерея фотографий скоро будет доступна!");
                }}
              >
                <ImageIcon className="w-3 h-3 mr-1.5" />
                Посмотреть все {enhancedImages.length} фото
              </Button>
            </div>
          )}
        </div>

        {/* Tour Info - Exchange24 Style - МАКСИМАЛЬНО КОМПАКТНЫЙ */}
        {/* УБРАЛИ ДУБЛИРОВАНИЕ: заголовок и мета-информация уже в descriptionHtml из Shopify! */}
        <div className="bg-white rounded-xl p-2 mb-2 border border-gray-200">
          {/* Description - Collapsible with Accordion Support */}
          <div className="space-y-1">
            <div className={`relative transition-all duration-300 ${isDescriptionExpanded ? 'max-h-none' : 'max-h-96 overflow-hidden'}`}>
              <div 
                className="prose prose-sm max-w-none text-gray-700 prose-headings:text-sm prose-headings:font-semibold prose-headings:mb-1 prose-p:text-xs prose-p:leading-snug prose-p:mb-1 prose-ul:text-xs prose-li:text-xs prose-li:leading-tight prose-h2:text-xs prose-h2:mb-1 prose-h3:text-xs prose-h3:mb-0.5"
                dangerouslySetInnerHTML={{ 
                  __html: descriptionHtml
                }}
              />
              {!isDescriptionExpanded && (
                <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
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

            {/* Accordion Styles */}
            <style>{`
              .accordion-trigger {
                transition: all 0.2s ease;
              }
              .accordion-trigger:hover {
                color: #007AFF;
              }
              .accordion-icon {
                transition: transform 0.2s ease;
              }
              .accordion-content {
                animation: fadeIn 0.2s ease;
              }
              @keyframes fadeIn {
                from {
                  opacity: 0;
                  transform: translateY(-5px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}</style>
          </div>
        </div>

                {/* Tour Itinerary - Premium Design (Dynamic from descriptionHtml) */}
                {tourSchedule && tourSchedule.length > 0 && (
                  <div className="bg-white rounded-xl p-2 mb-2 border border-gray-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <MapPin className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-gray-900">Маршрут тура</h3>
                        <p className="text-[11px] text-gray-500">{routeSubtitle}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {tourSchedule.map((daySchedule, dayIndex) => {
                        const isDay2 = daySchedule.day === 2;
                        return (
                          <div 
                            key={dayIndex}
                            className={`bg-gradient-to-r ${isDay2 ? 'from-green-50 to-blue-50' : 'from-blue-50 to-purple-50'} rounded-xl p-2 mb-1.5`}
                          >
                            <div className="flex items-center gap-2 mb-1.5">
                              <div className={`w-6 h-6 ${isDay2 ? 'bg-green-500' : 'bg-blue-500'} text-white rounded-full flex items-center justify-center font-bold text-xs`}>
                                {daySchedule.day}
                        </div>
                              <h4 className="text-xs font-semibold text-gray-900">{daySchedule.title}</h4>
                      </div>
                            <div className="space-y-1 ml-8">
                              {daySchedule.items.map((item, itemIndex) => {
                                // Определяем иконку: время = Clock, место = MapPin
                                const isLocation = item.title.toLowerCase().includes('пляж') || 
                                                  item.title.toLowerCase().includes('остров') ||
                                                  item.title.toLowerCase().includes('бухта') ||
                                                  item.title.toLowerCase().includes('лагуна') ||
                                                  item.title.toLowerCase().includes('пещера') ||
                                                  item.title.toLowerCase().includes('площадка');
                                const Icon = isLocation ? MapPin : Clock;
                                const iconColor = isLocation ? 'text-green-500' : 'text-red-500';
                                
                                return (
                                  <div key={itemIndex} className="flex items-center gap-1.5">
                                    <Icon className={`w-3 h-3 ${iconColor}`} />
                                    <span className="text-xs text-gray-700 leading-tight">
                                      {item.time} - {item.title}
                                    </span>
                        </div>
                                );
                              })}
                        </div>
                      </div>
                        );
                      })}
                    </div>
                  </div>
                )}

        {/* Price & Booking Section - Exchange24 Style - КОМПАКТНЫЙ */}
        <div className="bg-white rounded-xl p-3 mb-2 border border-gray-200">
          {/* Price Display */}
          <div className="text-center mb-3">
            <AnimatedPrice 
              adultPrice={adultPrice} 
              childPrice={childPrice} 
              className="text-2xl font-bold mb-1"
            />
          </div>

          {/* Variant Selection */}
          {product.node.options.length > 0 && product.node.variants.edges.length > 1 && (
            <div className="mb-3">
              <h4 className="text-xs font-semibold text-gray-900 mb-2">
                {product.node.options[0].name}
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {product.node.variants.edges.map(({ node: variant }) => (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`p-2 rounded-xl border-2 transition-all ${
                      selectedVariant?.id === variant.id 
                        ? 'border-[#007AFF] bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-gray-900">{variant.title}</span>
                      <span className="text-xs font-bold text-[#007AFF]">
                        {parseFloat(variant.price.amount).toFixed(0)} ฿
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons - Exchange24 Style - КОМПАКТНЫЕ */}
          <div className="space-y-2">
            <Button
              size="lg"
              className="w-full bg-[#007AFF] hover:bg-[#0056CC] text-white rounded-xl min-h-[44px] text-xs font-semibold py-2"
              onClick={() => window.open('https://t.me/PHUKETDABOT', '_blank')}
            >
              <MessageCircle className="w-4 h-4 mr-1.5" />
              Написать в Telegram
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="w-full border-2 border-green-500 text-green-600 hover:bg-green-50 rounded-xl min-h-[44px] text-xs font-semibold py-2"
              onClick={() => setBookingDialogOpen(true)}
            >
              <Calendar className="w-4 h-4 mr-1.5" />
              Забронировать
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                <span className="text-xs">Страховка включена</span>
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span className="text-xs">Бесплатная отмена</span>
              </span>
            </div>
          </div>
        </div>

        {/* AI Concierge */}
        <div className="bg-white rounded-xl p-2 mb-2 border border-gray-200">
          <AIConsiergeWidget />
        </div>
      </div>

        {/* Related Tours Section - Exchange24 Style - КОМПАКТНЫЙ */}
        <div className="bg-white rounded-xl p-2 mb-2 border border-gray-200">
          <h3 className="text-xs font-semibold mb-2 text-gray-900">Похожие туры</h3>
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

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-2 py-2">
        <div className="flex items-center justify-between max-w-md mx-auto gap-2">
          <AnimatedPrice 
            adultPrice={adultPrice} 
            childPrice={childPrice} 
            className="text-center text-xs"
          />
          <div className="flex gap-1.5">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open('https://t.me/PHUKETDABOT', '_blank')}
              className="px-2 py-1.5 text-[#007AFF] border-[#007AFF] hover:bg-blue-50 text-xs min-h-[44px]"
            >
              <MessageCircle className="w-3 h-3 mr-1" />
              Telegram
            </Button>
            <Button 
              size="sm"
              onClick={() => setBookingDialogOpen(true)}
              className="px-2 py-1.5 bg-[#007AFF] hover:bg-[#0056CC] text-white text-xs min-h-[44px]"
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
