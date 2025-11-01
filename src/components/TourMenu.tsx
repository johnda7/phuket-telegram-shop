/**
 * 🗂️ ГЛАВНОЕ МЕНЮ PhuketDa
 * 
 * Структура:
 * - 4 ОСНОВНЫХ СЕРВИСА (продажи): Туры, Аренда авто, Недвижимость, Обмен валюты
 * - Полезная информация (вспомогательное): Все категории для туристов
 * 
 * Философия:
 * - Категории = вспомогательный инструмент для туристов (информационный)
 * - В каждой категории мы продаем (ссылки на сервисы внизу)
 * - Акцент на 4 основных сервисах (это наше основное направление)
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight, Ship, Car, Home, DollarSign, Info, Grid3x3 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getAllServices } from "@/config/services";

interface MenuItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
  description?: string;
  highlight?: boolean; // Для основных сервисов
}

interface MainMenuProps {
  trigger?: React.ReactNode;
}

export const TourMenu = ({ trigger }: MainMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // 4 ОСНОВНЫХ СЕРВИСА (продажи) - из централизованного конфига
  const services = getAllServices();
  
  // Главное меню: 4 сервиса + Полезная информация
  const mainMenuItems: MenuItem[] = [
    // ОСНОВНЫЕ СЕРВИСЫ (продажи) - приоритет!
    ...services.map(service => ({
      icon: service.icon,
      label: service.title,
      href: service.path,
      description: service.subtitle,
      highlight: true, // Выделяем основные сервисы
    })),
    // Полезная информация (вспомогательное)
    {
      icon: Info,
      label: "Полезная информация",
      href: "/categories",
      description: "Все категории для туристов",
      highlight: false,
    }
  ];

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="gap-2 min-h-[44px]">
            <span className="text-lg">☰</span>
            <span className="hidden sm:inline">Меню</span>
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="left" className="w-[320px] sm:w-[380px] overflow-y-auto">
        <SheetHeader className="mb-6 pb-4 border-b border-gray-200">
          <SheetTitle className="text-2xl font-bold text-gray-900">
            PhuketDa
          </SheetTitle>
          <p className="text-xs text-gray-500 mt-1">Консьерж-сервис на Пхукете</p>
        </SheetHeader>
        
        <nav className="space-y-1">
          {mainMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-start gap-3 px-4 py-3 rounded-xl transition-all group",
                  item.highlight
                    ? "bg-gradient-to-r from-blue-50 to-blue-50/50 hover:from-blue-100 hover:to-blue-100/50 border border-blue-100/50"
                    : "hover:bg-gray-50 border border-transparent"
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all",
                  item.highlight
                    ? "bg-[#007AFF] text-white"
                    : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                )}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className={cn(
                    "font-semibold text-sm leading-tight mb-0.5",
                    item.highlight ? "text-gray-900" : "text-gray-700"
                  )}>
                    {item.label}
                  </div>
                  {item.description && (
                    <div className="text-xs text-gray-500 line-clamp-1">
                      {item.description}
                    </div>
                  )}
                </div>
                <ChevronRight className={cn(
                  "w-4 h-4 flex-shrink-0 transition-opacity",
                  item.highlight ? "text-[#007AFF] opacity-60" : "text-gray-400 opacity-0 group-hover:opacity-100"
                )} />
              </Link>
            );
          })}
        </nav>

        {/* Разделитель */}
        <div className="my-6 h-px bg-gray-200" />

        {/* Дополнительные ссылки */}
        <div className="space-y-1">
          <Link
            to="/map"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-50 transition-all text-sm text-gray-700"
          >
            <Grid3x3 className="w-4 h-4 text-gray-500" />
            <span>Карта путешественника</span>
            <ChevronRight className="w-3 h-3 ml-auto text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
};
