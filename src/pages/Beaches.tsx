import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductCard } from "@/components/ProductCard";
import { ChevronRight, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "@/lib/shopify";
import heroImage from "@/assets/beaches-hero.jpg";

const Beaches = () => {
  const [filter, setFilter] = useState("all");
  const [district, setDistrict] = useState("all");

  const { data: products, isLoading } = useQuery({
    queryKey: ["beaches"],
    queryFn: () => fetchProducts(50),
  });

  // Filter products for beaches/places category
  const beaches = products?.filter(
    (product) => 
      product.node.productType?.toLowerCase().includes('пляж') ||
      product.node.productType?.toLowerCase().includes('место') ||
      product.node.productType?.toLowerCase() === 'place' ||
      product.node.tags?.some(tag => 
        tag.toLowerCase().includes('пляж') ||
        tag.toLowerCase().includes('category:beaches') ||
        tag.toLowerCase().includes('category:temples')
      )
  ) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Пляжи на Пхукете"
            className="w-full h-full object-cover scale-105 animate-[scale-in_0.6s_ease-out]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
        </div>
        
        <div className="relative h-full flex items-center justify-center">
          <div className="container mx-auto px-4">
            <div className="glass-card max-w-4xl mx-auto p-10 text-center animate-fade-in backdrop-blur-xl bg-background/20 border border-white/20">
              <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-white via-white/90 to-white/80 bg-clip-text text-transparent">
                Пляжи Пхукета
              </h1>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Откройте для себя лучшие пляжи острова — от диких и безлюдных до тусовочных с вечеринками
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary transition-colors">
            Главная
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/phuket" className="hover:text-primary transition-colors">
            Что посетить
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">Пляжи на Пхукете</span>
        </div>

        {/* Description */}
        <div className="max-w-4xl mb-12 animate-fade-in">
          <div className="glass-card p-8 border-l-4 border-primary">
            <p className="text-lg text-foreground leading-relaxed">
              Многообразие пляжей на Пхукете позволяет найти идеальное место для отдыха: от диких и безлюдных до тусовочных, с развлечениями и вечеринками. Каждый пляж Пхукета уникален: природа наградила остров невероятными пейзажами и горными рельефами, а некоторые места украсил человек, сделав интересные инстаграмные локации. 
            </p>
            <p className="text-lg font-bold mt-4 text-primary">
              🔥 Лучшие идут первыми 👇🏼
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card p-6 mb-12 animate-fade-in border border-border/50 shadow-lg">
          <div className="flex flex-wrap items-center gap-4">
            {/* All/Open filter */}
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
                className="rounded-full hover-scale transition-all"
              >
                Все
              </Button>
              <Button
                variant={filter === "open" ? "default" : "outline"}
                onClick={() => setFilter("open")}
                className="rounded-full hover-scale transition-all"
              >
                Открытые
              </Button>
            </div>

            {/* Category select */}
            <Select defaultValue="beaches">
              <SelectTrigger className="w-[200px] rounded-full border-border/50 hover:border-primary transition-colors">
                <SelectValue placeholder="Категория" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beaches">Пляжи</SelectItem>
                <SelectItem value="temples">Храмы</SelectItem>
                <SelectItem value="viewpoints">Смотровые</SelectItem>
                <SelectItem value="waterfalls">Водопады</SelectItem>
              </SelectContent>
            </Select>

            {/* District select */}
            <Select value={district} onValueChange={setDistrict}>
              <SelectTrigger className="w-[200px] rounded-full border-border/50 hover:border-primary transition-colors">
                <SelectValue placeholder="Район" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все</SelectItem>
                <SelectItem value="patong">Патонг</SelectItem>
                <SelectItem value="kata">Ката</SelectItem>
                <SelectItem value="karon">Карон</SelectItem>
                <SelectItem value="rawai">Равай</SelectItem>
                <SelectItem value="kamala">Камала</SelectItem>
              </SelectContent>
            </Select>

            {/* Map button */}
            <Button
              variant="outline"
              className="ml-auto gap-2 bg-gradient-to-r from-[#4CAF50] to-[#45a049] hover:from-[#45a049] hover:to-[#4CAF50] text-white border-0 rounded-full shadow-lg hover-scale transition-all"
            >
              <MapPin className="w-4 h-4" />
              КАРТА
            </Button>
          </div>
        </div>

        {/* Beach Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card h-[420px] animate-pulse rounded-2xl" />
            ))}
          </div>
        ) : beaches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {beaches.map((product, index) => (
              <div 
                key={product.node.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProductCard
                  product={product.node}
                  showPrice={false}
                  showRating={true}
                  linkPrefix="/place"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-fade-in">
            <div className="glass-card p-12 max-w-2xl mx-auto">
              <div className="text-6xl mb-6">🏝️</div>
              <p className="text-2xl font-bold mb-4">
                Пляжи скоро появятся!
              </p>
              <p className="text-muted-foreground mb-8">
                Мы работаем над добавлением информации о лучших пляжах Пхукета
              </p>
              <Link to="/phuket">
                <Button size="lg" className="rounded-full hover-scale">
                  Вернуться к турам
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Beaches;
