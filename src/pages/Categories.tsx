import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Waves, 
  Landmark, 
  MapPin, 
  TreePalm, 
  Droplets, 
  Tent,
  Mountain,
  Church,
  Building2,
  Moon,
  Footprints,
  ShoppingBag,
  Calendar
} from "lucide-react";

interface Category {
  id: string;
  label: string;
  icon: any;
  description: string;
  image: string;
  path: string;
  color: string;
}

const categories: Category[] = [
  {
    id: "beaches",
    label: "Пляжи",
    icon: Waves,
    description: "Лучшие пляжи Пхукета для отдыха и купания",
    image: "/placeholder.svg",
    path: "/beaches",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: "attractions",
    label: "Достопримечательности",
    icon: Landmark,
    description: "Главные достопримечательности острова",
    image: "/placeholder.svg",
    path: "/phuket?category=attractions",
    color: "from-purple-500 to-pink-500"
  },
  {
    id: "tours",
    label: "Экскурсии",
    icon: MapPin,
    description: "Увлекательные экскурсии по Пхукету и окрестностям",
    image: "/placeholder.svg",
    path: "/",
    color: "from-green-500 to-emerald-500"
  },
  {
    id: "elephants",
    label: "Слоны",
    icon: TreePalm,
    description: "Парки и центры для общения со слонами",
    image: "/placeholder.svg",
    path: "/category/elephants",
    color: "from-amber-500 to-orange-500"
  },
  {
    id: "aquaparks",
    label: "Аквапарки",
    icon: Droplets,
    description: "Водные развлечения для всей семьи",
    image: "/placeholder.svg",
    path: "/category/aquaparks",
    color: "from-blue-400 to-indigo-500"
  },
  {
    id: "amusement",
    label: "Парки развлечений",
    icon: Tent,
    description: "Развлекательные парки и активности",
    image: "/placeholder.svg",
    path: "/category/amusement",
    color: "from-red-500 to-rose-500"
  },
  {
    id: "viewpoints",
    label: "Смотровые площадки",
    icon: Mountain,
    description: "Панорамные виды на остров и море",
    image: "/placeholder.svg",
    path: "/category/viewpoints",
    color: "from-teal-500 to-cyan-500"
  },
  {
    id: "temples",
    label: "Храмы",
    icon: Church,
    description: "Священные буддийские храмы",
    image: "/placeholder.svg",
    path: "/category/temples",
    color: "from-yellow-500 to-amber-500"
  },
  {
    id: "museums",
    label: "Музеи",
    icon: Building2,
    description: "Музеи и культурные центры",
    image: "/placeholder.svg",
    path: "/category/museums",
    color: "from-violet-500 to-purple-500"
  },
  {
    id: "nightmarkets",
    label: "Ночные рынки",
    icon: Moon,
    description: "Рынки с едой, сувенирами и развлечениями",
    image: "/placeholder.svg",
    path: "/category/nightmarkets",
    color: "from-indigo-500 to-blue-500"
  },
  {
    id: "walking",
    label: "Прогулочные",
    icon: Footprints,
    description: "Места для прогулок и отдыха",
    image: "/placeholder.svg",
    path: "/category/walking",
    color: "from-green-400 to-teal-500"
  },
  {
    id: "shopping",
    label: "Торговые центры",
    icon: ShoppingBag,
    description: "Шопинг и развлекательные центры",
    image: "/placeholder.svg",
    path: "/category/shopping",
    color: "from-pink-500 to-rose-500"
  },
  {
    id: "events",
    label: "Афиша событий",
    icon: Calendar,
    description: "Мероприятия и события на Пхукете",
    image: "/placeholder.svg",
    path: "/category/events",
    color: "from-orange-500 to-red-500"
  }
];

const Categories = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <div className="relative h-[40vh] bg-gradient-to-br from-primary/20 via-primary/10 to-background overflow-hidden">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] bg-cover bg-center opacity-10" />
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Что посетить на Пхукете
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
            Исследуйте лучшие места острова: от райских пляжей до древних храмов
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                to={category.path}
                onMouseEnter={() => setActiveCategory(category.id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 group">
                  <div className={`h-48 bg-gradient-to-br ${category.color} relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon className="w-20 h-20 text-white/90 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-white text-sm font-medium">Новое</span>
                    </div>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {category.label}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {category.description}
                    </p>
                    <div className="mt-4 flex items-center text-primary text-sm font-medium">
                      Узнать больше
                      <svg
                        className={`ml-2 w-4 h-4 transition-transform ${
                          activeCategory === category.id ? "translate-x-1" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Categories;
