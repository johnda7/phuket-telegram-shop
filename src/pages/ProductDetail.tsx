import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { storefrontApiRequest, type ShopifyProduct } from "@/lib/shopify";
import { Loader2, ArrowLeft, ShoppingCart, Star, Clock, Users, Calendar, Car, MessageCircle, Check, X, MapPin, Utensils, Waves, Camera, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { AIConsiergeWidget } from "@/components/AIConsiergeWidget";

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
      images(first: 5) {
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
        <Link 
          to="/phuket" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад к Пхукету
        </Link>

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

              {/* Rating */}
              <div className="absolute top-7 right-7 z-10 bg-background/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1 shadow-lg">
                <Star className="w-4 h-4 fill-warning text-warning" />
                <span className="text-sm font-semibold">4.8</span>
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
              <p className="text-muted-foreground mb-6">
                {product.node.description?.substring(0, 200) || 'Экскурсия с ночевкой на островах'}
              </p>

              {/* Tour Details with Icons */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-muted-foreground">Продолжительность:</p>
                    <p className="font-semibold">2 дня / 1 ночь</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-muted-foreground">Группа:</p>
                    <p className="font-semibold">до 30 человек</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-muted-foreground">Расписание:</p>
                    <p className="font-semibold">Ежедневно</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-sm">
                  <Car className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-muted-foreground">Трансфер:</p>
                    <p className="font-semibold">Включен</p>
                  </div>
                </div>
              </div>

              {/* Program */}
              <div className="border-t pt-6">
                <h2 className="text-xl font-bold mb-4">📋 Программа тура</h2>
                
                <div className="space-y-6">
                  {/* Day 1 */}
                  <div>
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                      День 1
                    </h3>
                    <div className="space-y-2 ml-10 text-sm text-muted-foreground">
                      <p className="flex items-start gap-2">
                        <Clock className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                        <span><strong>08:00</strong> - Выезд из отеля на Пхукете</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                        <span><strong>10:00</strong> - Прибытие на остров Пхи-Пхи Дон • Заселение в отель 3* на берегу моря</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <Utensils className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                        <span>Обед в местном ресторане</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <Waves className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                        <span>Снорклинг в бухте Лох Далам • Свободное время на пляже</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <Camera className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                        <span>Ужин и прогулка по вечерней набережной</span>
                      </p>
                    </div>
                  </div>

                  {/* Day 2 */}
                  <div>
                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                      <span className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                      День 2
                    </h3>
                    <div className="space-y-2 ml-10 text-sm text-muted-foreground">
                      <p className="flex items-start gap-2">
                        <Utensils className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                        <span><strong>08:00</strong> - Завтрак в отеле</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <Waves className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                        <span><strong>09:00</strong> - Экскурсия на спидботе к бухте Майя Бэй</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <Waves className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                        <span>Снорклинг в бухте Пиле • Посещение пещеры викингов</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <Utensils className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                        <span>Обед на острове</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <Car className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                        <span><strong>15:00</strong> - Возвращение на Пхукет • <strong>17:00</strong> - Трансфер в отель</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* What's Included */}
              <div className="border-t pt-6 mt-6">
                <h2 className="text-xl font-bold mb-4">✅ Что включено</h2>
                <div className="grid md:grid-cols-2 gap-3 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-success" />
                    </div>
                    <span className="text-sm">Трансфер от отеля и обратно</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-success" />
                    </div>
                    <span className="text-sm">Проживание в отеле 3* (1 ночь)</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-success" />
                    </div>
                    <span className="text-sm">2 завтрака, 2 обеда, 1 ужин</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-success" />
                    </div>
                    <span className="text-sm">Все экскурсии на спидботе</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-success" />
                    </div>
                    <span className="text-sm">Снаряжение для снорклинга</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-success" />
                    </div>
                    <span className="text-sm">Русскоговорящий гид</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-success" />
                    </div>
                    <span className="text-sm">Страховка</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-success" />
                    </div>
                    <span className="text-sm">Питьевая вода</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold mb-4 mt-6">❌ Не включено</h3>
                <div className="grid md:grid-cols-2 gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X className="w-3 h-3 text-destructive" />
                    </div>
                    <span className="text-sm text-muted-foreground">Дополнительные напитки в ресторанах</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X className="w-3 h-3 text-destructive" />
                    </div>
                    <span className="text-sm text-muted-foreground">Личные расходы</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X className="w-3 h-3 text-destructive" />
                    </div>
                    <span className="text-sm text-muted-foreground">Национальный парк (400 бат/взрослый, 200 бат/ребенок)</span>
                  </div>
                </div>
              </div>

              {/* Important Info */}
              <div className="border-t pt-6 mt-6">
                <h2 className="text-xl font-bold mb-4">ℹ️ Важная информация</h2>
                <div className="glass-card p-4 space-y-2 text-sm text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Рекомендуется взять с собой: купальник, солнцезащитный крем, головной убор, полотенце
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Время выезда может незначительно меняться в зависимости от локации отеля
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    Не рекомендуется беременным женщинам и людям с проблемами спины
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24">
              <h3 className="text-2xl font-bold mb-2">{product.node.title}</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Экскурсия с ночевкой на островах Пхи-Пхи
              </p>

              {/* Tour Quick Info */}
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Продолжительность:</span>
                  <span className="font-semibold ml-auto">2 дня / 1 ночь</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Группа:</span>
                  <span className="font-semibold ml-auto">до 30 человек</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Расписание:</span>
                  <span className="font-semibold ml-auto">Ежедневно</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="w-4 h-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Трансфер:</span>
                  <span className="font-semibold ml-auto">Включен</span>
                </div>
              </div>

              {/* Price */}
              <div className="mb-6 text-center">
                <p className="text-4xl font-bold text-primary mb-1">
                  от ${parseFloat(product.node.priceRange.minVariantPrice.amount).toFixed(0)}
                </p>
                <p className="text-sm text-muted-foreground">за взрослого</p>
              </div>

              {/* Variant Selection */}
              {product.node.options.length > 0 && product.node.variants.edges.length > 1 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">
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

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  size="lg"
                  className="w-full"
                  onClick={handleAddToCart}
                  disabled={!selectedVariant?.availableForSale}
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Забронировать тур
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open('https://t.me/phuketda_bot', '_blank')}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Написать в Telegram
                </Button>
              </div>
            </div>

            {/* AI Concierge */}
            <div className="mt-6">
              <AIConsiergeWidget />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
