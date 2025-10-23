import { useEffect, useState } from "react";
import { fetchProducts, type ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "./ProductCard";
import { Loader2 } from "lucide-react";

interface RelatedToursProps {
  currentProductId: string;
  currentTags: string[];
  limit?: number;
}

export const RelatedTours = ({ currentProductId, currentTags, limit = 3 }: RelatedToursProps) => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRelatedProducts = async () => {
      try {
        setLoading(true);
        const allProducts = await fetchProducts(20);
        
        // Filter products that:
        // 1. Are not the current product
        // 2. Share at least one tag with current product
        // 3. Are tours (have price)
        const related = allProducts
          .filter(p => p.node.id !== currentProductId)
          .filter(p => {
            const productTags = p.node.tags;
            return currentTags.some(tag => productTags.includes(tag));
          })
          .filter(p => {
            // Check if it's a tour (has islands, popular, etc tags or is productType tour)
            return p.node.productType === 'Экскурсии' || 
                   p.node.tags.some(tag => ['islands', 'popular', '1-day', '2-days', 'tour'].includes(tag));
          })
          .slice(0, limit);
        
        setProducts(related);
      } catch (err) {
        console.error('Failed to load related products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadRelatedProducts();
  }, [currentProductId, currentTags, limit]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">🌴 Похожие туры</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.node.id}
            product={product.node}
            showPrice={true}
            linkPrefix="/product"
          />
        ))}
      </div>
    </div>
  );
};
