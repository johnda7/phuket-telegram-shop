import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { storefrontApiRequest, type ShopifyProduct } from "@/lib/shopify";
import { Loader2, ArrowLeft, ShoppingCart, Star, Clock, Users, Calendar, Car, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { AIConsiergeWidget } from "@/components/AIConsiergeWidget";

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
  const tags = product.node.tags || [];
  const isHit = tags.includes('хит') || tags.includes('ХИТ') || tags.includes('популярное');
  const category = product.node.productType;

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
            {/* Image Gallery */}
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

              <div className="grid grid-cols-2 gap-3">
                {/* Main Image */}
                <div className="col-span-2 lg:col-span-1 aspect-[4/3] rounded-xl overflow-hidden bg-secondary/20 relative group">
                  {images[selectedImageIndex]?.node && (
                    <img
                      src={images[selectedImageIndex].node.url}
                      alt={product.node.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  )}
                </div>

                {/* Thumbnail Gallery */}
                <div className="col-span-2 lg:col-span-1 grid grid-cols-2 gap-3">
                  {images.slice(1, 4).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index + 1)}
                      className="aspect-[4/3] rounded-xl overflow-hidden bg-secondary/20 relative hover:ring-2 hover:ring-primary transition-all"
                    >
                      <img
                        src={image.node.url}
                        alt={`${product.node.title} ${index + 2}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                  
                  {images.length > 4 && (
                    <button
                      onClick={() => setSelectedImageIndex(0)}
                      className="aspect-[4/3] rounded-xl overflow-hidden bg-secondary/20 relative hover:ring-2 hover:ring-primary transition-all"
                    >
                      <div className="w-full h-full bg-muted/80 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-2xl font-bold text-foreground">
                          +{images.length - 4}
                        </span>
                      </div>
                    </button>
                  )}
                </div>
              </div>

              {/* All Photos Link */}
              <button 
                onClick={() => setSelectedImageIndex(0)}
                className="mt-4 text-sm text-muted-foreground hover:text-primary transition-colors flex items-center"
              >
                🖼️ Все {images.length} фото
              </button>
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

              {/* Description */}
              {product.node.description && (
                <div className="border-t pt-6">
                  <h2 className="text-xl font-bold mb-4">Описание</h2>
                  <div 
                    className="prose prose-sm max-w-none text-muted-foreground"
                    dangerouslySetInnerHTML={{ __html: product.node.description }}
                  />
                </div>
              )}
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
