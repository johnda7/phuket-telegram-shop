import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { storefrontApiRequest, type ShopifyProduct } from "@/lib/shopify";
import { Loader2, ArrowLeft, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          to="/tours" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Назад к турам
        </Link>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image */}
          <div className="relative rounded-2xl overflow-hidden">
            {product.node.images.edges[0]?.node && (
              <img
                src={product.node.images.edges[0].node.url}
                alt={product.node.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.node.title}</h1>
            
            {/* Price */}
            <div className="mb-6">
              <p className="text-3xl font-bold text-primary">
                от ${parseFloat(product.node.priceRange.minVariantPrice.amount).toFixed(0)}
              </p>
              <p className="text-sm text-muted-foreground">за человека</p>
            </div>

            {/* Variant Selection */}
            {product.node.options.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">
                  {product.node.options[0].name}
                </label>
                <div className="flex gap-2">
                  {product.node.variants.edges.map(({ node: variant }) => (
                    <Button
                      key={variant.id}
                      variant={selectedVariant?.id === variant.id ? "default" : "outline"}
                      onClick={() => setSelectedVariant(variant)}
                      className="flex-1"
                    >
                      {variant.title}
                      <br />
                      <span className="text-xs">
                        ${parseFloat(variant.price.amount).toFixed(0)}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart */}
            <Button
              size="lg"
              className="w-full mb-6"
              onClick={handleAddToCart}
              disabled={!selectedVariant?.availableForSale}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Добавить в корзину
            </Button>

            {/* Description */}
            <div 
              className="prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: product.node.description }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
