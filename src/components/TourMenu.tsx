import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight, Ship, Compass, Target, MapPin, Waves, Info, Star, Zap, Mountain, Landmark, Eye, Camera } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href?: string;
  submenu?: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    href: string;
    tag: string;
  }[];
}

const menuStructure: MenuItem[] = [
  {
    icon: Ship,
    label: "Туры",
    submenu: [
      { icon: Star, label: "Пхукет да", href: "/phuket", tag: "phuket-da" },
      { icon: Ship, label: "Все морские туры", href: "/phuket?category=tour", tag: "islands" },
      { icon: Compass, label: "Пхи-Пхи острова", href: "/product/phi-phi-2-days-1-night", tag: "phi-phi" },
      { icon: Camera, label: "Джеймс Бонд", href: "/product/james-bond-island-tour", tag: "james-bond" },
      { icon: Waves, label: "Рача и Корал", href: "/product/racha-coral-islands", tag: "racha" },
      { icon: Star, label: "Премиум туры", href: "/phuket?category=tour", tag: "premium" },
      { icon: Compass, label: "Многодневные", href: "/phuket?category=tour", tag: "2-days" },
    ]
  },
  {
    icon: Target,
    label: "Приключения",
    submenu: [
      { icon: Zap, label: "Все активные туры", href: "/phuket?category=tour", tag: "adventure" },
      { icon: Mountain, label: "Зиплайн и ATV", href: "/product/rafting-spa-atv", tag: "zipline" },
      { icon: Landmark, label: "Слоны и джунгли", href: "/phuket?category=temple", tag: "elephants" },
      { icon: Mountain, label: "Водопады и природа", href: "/product/khao-lak-safari", tag: "nature" },
    ]
  },
  {
    icon: MapPin,
    label: "Достопримечательности",
    submenu: [
      { icon: Landmark, label: "Все места", href: "/phuket?category=temple", tag: "place" },
      { icon: Landmark, label: "Храмы", href: "/phuket?category=temple", tag: "temples" },
      { icon: Eye, label: "Смотровые площадки", href: "/categories/viewpoints", tag: "viewpoints" },
      { icon: Landmark, label: "Культурные места", href: "/phuket?category=temple", tag: "culture" },
    ]
  },
  {
    icon: Waves,
    label: "Пляжи",
    href: "/beaches",
  },
  {
    icon: Info,
    label: "Полезная информация",
    href: "/phuket",
  }
];

interface TourMenuProps {
  trigger?: React.ReactNode;
}

export const TourMenu = ({ trigger }: TourMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (label: string) => {
    setExpandedSection(expandedSection === label ? null : label);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="gap-2">
            <span className="text-lg">☰</span>
            <span className="hidden sm:inline">Меню</span>
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle className="text-2xl">
            PhuketDa
          </SheetTitle>
        </SheetHeader>
        
        <nav className="space-y-2">
          {menuStructure.map((section) => (
            <div key={section.label} className="space-y-1">
              {section.href ? (
                <Link
                  to={section.href}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-secondary/80 transition-all group"
                >
                  <section.icon className="w-5 h-5 text-[#007AFF]" />
                  <span className="font-medium">{section.label}</span>
                  <ChevronRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              ) : (
                <>
                  <button
                    onClick={() => toggleSection(section.label)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                      expandedSection === section.label 
                        ? "bg-primary/10 text-primary font-semibold" 
                        : "hover:bg-secondary/80"
                    )}
                  >
                    <section.icon className="w-5 h-5 text-[#007AFF]" />
                    <span className="font-medium">{section.label}</span>
                    <ChevronDown 
                      className={cn(
                        "w-4 h-4 ml-auto transition-transform",
                        expandedSection === section.label && "rotate-180"
                      )} 
                    />
                  </button>
                  
                  {expandedSection === section.label && section.submenu && (
                    <div className="ml-8 space-y-1 mt-1 animate-in fade-in slide-in-from-top-2">
                      {section.submenu.map((item) => (
                        <Link
                          key={item.href}
                          to={item.href}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary/60 transition-all text-sm group"
                        >
                          <item.icon className="w-4 h-4 text-gray-600" />
                          <span>{item.label}</span>
                          <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};
