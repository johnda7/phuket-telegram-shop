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
  Calendar,
  Sparkles,
  Home,
  UtensilsCrossed,
  Coffee,
  Ship,
  Fish,
  Bike,
  Zap,
  Baby,
  Heart,
  Eye,
  Camera,
  PartyPopper,
  Flame
} from "lucide-react";
import { cn } from "@/styles/design-system";

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
  // Что посетить
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
    description: "Лучшие виды на Пхукет с высоты - закаты и рассветы",
    image: "/placeholder.svg",
    path: "/category/viewpoints",
    color: "from-orange-500 to-amber-500"
  },
  {
    id: "viewpoints2",
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
  },
  
  // Массажи и СПА
  {
    id: "spa",
    label: "Лучшие СПА",
    icon: Sparkles,
    description: "Премиальные СПА-центры Пхукета",
    image: "/placeholder.svg",
    path: "/category/spa",
    color: "from-pink-400 to-purple-400"
  },
  {
    id: "massage",
    label: "Массажные салоны",
    icon: Heart,
    description: "Тайский массаж по районам",
    image: "/placeholder.svg",
    path: "/category/massage",
    color: "from-rose-400 to-pink-400"
  },
  {
    id: "sauna",
    label: "Бани и сауны",
    icon: Flame,
    description: "Традиционные бани и сауны",
    image: "/placeholder.svg",
    path: "/category/sauna",
    color: "from-orange-400 to-red-400"
  },
  
  // Кафе и рестораны
  {
    id: "restaurants-districts",
    label: "Рестораны по районам",
    icon: UtensilsCrossed,
    description: "Лучшие рестораны в каждом районе",
    image: "/placeholder.svg",
    path: "/category/restaurants-districts",
    color: "from-emerald-500 to-green-500"
  },
  {
    id: "restaurants-view",
    label: "Видовые рестораны",
    icon: Eye,
    description: "Рестораны с панорамным видом",
    image: "/placeholder.svg",
    path: "/category/restaurants-view",
    color: "from-sky-500 to-blue-500"
  },
  {
    id: "restaurants-instagram",
    label: "Инстаграмные кафе",
    icon: Camera,
    description: "Красивые места для фото",
    image: "/placeholder.svg",
    path: "/category/restaurants-instagram",
    color: "from-fuchsia-500 to-pink-500"
  },
  {
    id: "restaurants-best",
    label: "Лучшие рестораны",
    icon: Sparkles,
    description: "Топовые заведения острова",
    image: "/placeholder.svg",
    path: "/category/restaurants-best",
    color: "from-yellow-400 to-orange-400"
  },
  {
    id: "restaurants-romantic",
    label: "Романтичные рестораны",
    icon: Heart,
    description: "Для романтических ужинов",
    image: "/placeholder.svg",
    path: "/category/restaurants-romantic",
    color: "from-rose-500 to-red-500"
  },
  {
    id: "coffee",
    label: "Кофейни",
    icon: Coffee,
    description: "Лучший кофе на Пхукете",
    image: "/placeholder.svg",
    path: "/category/coffee",
    color: "from-amber-600 to-brown-600"
  },
  {
    id: "restaurants-kids",
    label: "С детской комнатой",
    icon: Baby,
    description: "Рестораны с детскими зонами",
    image: "/placeholder.svg",
    path: "/category/restaurants-kids",
    color: "from-cyan-400 to-blue-400"
  },
  
  // Отдых и развлечения
  {
    id: "fishing",
    label: "Рыбалка",
    icon: Fish,
    description: "Морская и озерная рыбалка",
    image: "/placeholder.svg",
    path: "/category/fishing",
    color: "from-blue-600 to-cyan-600"
  },
  {
    id: "diving",
    label: "Дайвинг",
    icon: Droplets,
    description: "Дайв-центры и снорклинг",
    image: "/placeholder.svg",
    path: "/category/diving",
    color: "from-teal-600 to-blue-600"
  },
  {
    id: "yacht",
    label: "Аренда яхт",
    icon: Ship,
    description: "Яхты и катера напрокат",
    image: "/placeholder.svg",
    path: "/category/yacht",
    color: "from-indigo-500 to-purple-500"
  },
  {
    id: "zoos",
    label: "Зоопарки",
    icon: TreePalm,
    description: "Контактные зоопарки и фермы",
    image: "/placeholder.svg",
    path: "/category/zoos",
    color: "from-green-600 to-emerald-600"
  },
  {
    id: "gaming",
    label: "Компьютерные клубы",
    icon: Zap,
    description: "Gaming-зоны и киберспорт",
    image: "/placeholder.svg",
    path: "/category/gaming",
    color: "from-violet-600 to-purple-600"
  },
  {
    id: "biking",
    label: "Аренда байков",
    icon: Bike,
    description: "Прокат мотобайков и велосипедов",
    image: "/placeholder.svg",
    path: "/category/biking",
    color: "from-orange-600 to-red-600"
  },
  {
    id: "parties",
    label: "Ночная жизнь",
    icon: PartyPopper,
    description: "Клубы, бары и вечеринки",
    image: "/placeholder.svg",
    path: "/category/parties",
    color: "from-purple-600 to-pink-600"
  }
];

const Categories = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="container mx-auto px-4 pt-6 pb-3">
        <h1 className="text-2xl font-bold">Категории</h1>
        <p className="text-sm text-muted-foreground mt-1">Выберите раздел — компактные карточки в стиле Telegram Wallet</p>
      </div>

      {/* Categories Grid - Compact Wallet Style */}
      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                to={category.path}
                className={cn(
                  "group p-4 rounded-2xl border bg-card hover:bg-accent/30 transition-all",
                  "hover:shadow-md hover:-translate-y-0.5"
                )}
                onMouseEnter={() => setActiveCategory(category.id)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center",
                    `bg-gradient-to-r ${category.color}`
                  )}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-foreground group-hover:text-[#007AFF] truncate">
                      {category.label}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {category.description}
                    </div>
                  </div>
                  <svg
                    className={`ml-auto w-4 h-4 text-muted-foreground group-hover:text-[#007AFF] transition-transform ${
                      activeCategory === category.id ? "translate-x-1" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Categories;
