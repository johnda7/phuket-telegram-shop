import { Badge } from "@/components/ui/badge";
import { 
  Waves, 
  Users, 
  Baby, 
  PartyPopper, 
  Umbrella, 
  Sun, 
  Camera, 
  Utensils,
  MapPin,
  Clock,
  DollarSign,
  Star
} from "lucide-react";

interface PlaceFeaturesProps {
  tags: string[];
  district?: string;
  priceLevel?: number;
  duration?: string;
  rating?: number;
}

export const PlaceFeatures = ({ 
  tags, 
  district, 
  priceLevel = 2, 
  duration,
  rating = 4.5 
}: PlaceFeaturesProps) => {
  const features = [
    {
      icon: Waves,
      label: "Водные виды спорта",
      active: tags.includes('watersports') || tags.includes('водные-виды-спорта'),
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Baby,
      label: "Для семьи",
      active: tags.includes('family') || tags.includes('семейный'),
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: PartyPopper,
      label: "Тусовка",
      active: tags.includes('party') || tags.includes('тусовка'),
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Umbrella,
      label: "Спокойный",
      active: tags.includes('quiet') || tags.includes('спокойный'),
      color: "from-teal-500 to-cyan-500"
    },
    {
      icon: Sun,
      label: "Красивые закаты",
      active: tags.includes('sunset') || tags.includes('закаты'),
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Camera,
      label: "Instagram",
      active: tags.includes('instagram') || tags.includes('инстаграм'),
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: Utensils,
      label: "Рестораны",
      active: tags.includes('restaurants') || tags.includes('рестораны'),
      color: "from-amber-500 to-orange-500"
    }
  ];

  const activeFeatures = features.filter(f => f.active);

  return (
    <div className="space-y-6">
      {/* Quick Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* District */}
        {district && (
          <div className="glass-card p-4 rounded-2xl border border-border/50 hover:border-primary/50 transition-all hover:scale-105">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-muted-foreground font-medium">Район</span>
            </div>
            <p className="font-bold text-lg">{district}</p>
          </div>
        )}

        {/* Rating */}
        <div className="glass-card p-4 rounded-2xl border border-border/50 hover:border-primary/50 transition-all hover:scale-105">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <Star className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">Рейтинг</span>
          </div>
          <p className="font-bold text-lg">{rating.toFixed(1)}/5.0</p>
        </div>

        {/* Duration */}
        {duration && (
          <div className="glass-card p-4 rounded-2xl border border-border/50 hover:border-primary/50 transition-all hover:scale-105">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs text-muted-foreground font-medium">Время</span>
            </div>
            <p className="font-bold text-lg">{duration}</p>
          </div>
        )}

        {/* Price Level */}
        <div className="glass-card p-4 rounded-2xl border border-border/50 hover:border-primary/50 transition-all hover:scale-105">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <span className="text-xs text-muted-foreground font-medium">Цены</span>
          </div>
          <p className="font-bold text-lg">
            {"$".repeat(priceLevel)}
            <span className="text-muted-foreground">{"$".repeat(4 - priceLevel)}</span>
          </p>
        </div>
      </div>

      {/* Features Grid */}
      {activeFeatures.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-4">Особенности</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {activeFeatures.map((feature, index) => (
              <div
                key={index}
                className="glass-card p-4 rounded-2xl border border-border/50 hover:border-primary/50 transition-all hover:scale-105 group"
              >
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${feature.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-semibold leading-tight">{feature.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Tags */}
      {tags.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-4">Все теги</h3>
          <div className="flex flex-wrap gap-2">
            {tags
              .filter(tag => 
                !tag.startsWith('category:') && 
                !tag.startsWith('district:') && 
                !tag.startsWith('related-') &&
                !tag.startsWith('price-level:') &&
                tag !== 'place' &&
                tag !== 'beach'
              )
              .map((tag, index) => (
                <Badge 
                  key={index}
                  variant="secondary" 
                  className="text-xs px-3 py-1.5 hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  #{tag}
                </Badge>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
