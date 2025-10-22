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
      product.node.tags?.some(tag => tag.toLowerCase().includes('пляж'))
  ) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Пляжи на Пхукете"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-background" />
        </div>
        
        <div className="relative h-full flex items-center justify-center">
          <div className="container mx-auto px-4">
            <div className="glass-card max-w-3xl mx-auto p-8 text-center">
              <h1 className="text-5xl font-bold mb-4">Пляжи на Пхукете</h1>
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
        <div className="max-w-4xl mb-12">
          <p className="text-lg text-muted-foreground leading-relaxed">
            Многообразие пляжей на Пхукете позволяет найти идеальное место для отдыха: от диких и безлюдных до тусовочных, с развлечениями и вечеринками. Каждый пляж Пхукета уникален: природа наградила остров невероятными пейзажами и горными рельефами, а некоторые места украсил человек, сделав интересные инстаграмные локации. Хотите узнать какие места лучше выбрать для купания в зависимости от сезона, куда отправиться с детьми и где находятся морские развлечения Пхукета? 
            <span className="font-bold"> 🔥 Лучшие идут первыми 👇🏼</span>
          </p>
        </div>

        {/* Filters */}
        <div className="glass-card p-6 mb-12">
          <div className="flex flex-wrap items-center gap-4">
            {/* All/Open filter */}
            <div className="flex gap-2">
              <Button
                variant={filter === "all" ? "default" : "outline"}
                onClick={() => setFilter("all")}
                className="rounded-full"
              >
                Все
              </Button>
              <Button
                variant={filter === "open" ? "default" : "outline"}
                onClick={() => setFilter("open")}
                className="rounded-full"
              >
                Открытые
              </Button>
            </div>

            {/* Category select */}
            <Select defaultValue="beaches">
              <SelectTrigger className="w-[200px] rounded-full">
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
              <SelectTrigger className="w-[200px] rounded-full">
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
              className="ml-auto gap-2 bg-[#4CAF50] hover:bg-[#4CAF50]/90 text-white border-0"
            >
              <MapPin className="w-4 h-4" />
              ПОКАЗАТЬ НА КАРТЕ
            </Button>
          </div>
        </div>

        {/* Beach Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card h-96 animate-pulse" />
            ))}
          </div>
        ) : beaches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {beaches.map((product) => (
              <ProductCard
                key={product.node.id}
                product={product.node}
                showPrice={false}
                showRating={true}
                linkPrefix="/place"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground mb-4">
              Пляжи скоро появятся! 🏝️
            </p>
            <p className="text-muted-foreground mb-8">
              Мы работаем над добавлением информации о лучших пляжах Пхукета
            </p>
            <Link to="/phuket">
              <Button>
                Вернуться к турам
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Beaches;
