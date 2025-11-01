import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/styles/design-system";
import { getAllCategories, type CategoryConfig } from "@/config/categories";

// Маппинг цветов для градиентов (iOS 26 style)
const getColorFromIconColor = (iconColor: string): string => {
  const colorMap: Record<string, string> = {
    '#00B4D8': 'from-blue-500 to-cyan-500',
    '#FF9500': 'from-orange-500 to-amber-500',
    '#34C759': 'from-green-500 to-emerald-500',
    '#FF3B30': 'from-red-500 to-pink-500',
    '#AF52DE': 'from-purple-500 to-pink-500',
    '#FF2D55': 'from-pink-500 to-rose-500',
    '#8E8E93': 'from-gray-500 to-slate-500',
    '#007AFF': 'from-blue-500 to-indigo-500',
  };
  return colorMap[iconColor] || 'from-gray-500 to-blue-500';
};

const Categories = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Берем ВСЕ категории из централизованного конфига
  const allCategories = useMemo(() => {
    return getAllCategories().map((cat: CategoryConfig) => ({
      id: cat.id,
      label: cat.title.replace('Пхукета', '').replace('на Пхукете', '').replace('Пхукет', '').trim(),
      description: cat.description,
      icon: cat.icon,
      iconColor: cat.iconColor,
      path: `/category/${cat.id}`,
      color: getColorFromIconColor(cat.iconColor),
      priority: cat.priority
    }));
  }, []);

  // Сортируем: сначала high priority, потом medium, потом low
  const sortedCategories = useMemo(() => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return [...allCategories].sort((a, b) => 
      priorityOrder[a.priority || 'low'] - priorityOrder[b.priority || 'low']
    );
  }, [allCategories]);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="container mx-auto px-4 pt-6 pb-3">
        <h1 className="text-2xl font-bold">Категории</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Выберите раздел — компактные карточки в стиле Telegram Wallet
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Всего категорий: {sortedCategories.length}
        </p>
      </div>

      {/* Categories Grid - Compact Wallet Style */}
      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {sortedCategories.map((category) => {
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
                    "w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0",
                    `bg-gradient-to-r ${category.color}`
                  )}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm text-foreground group-hover:text-[#007AFF] truncate">
                      {category.label}
                    </div>
                    <div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                      {category.description}
                    </div>
                  </div>
                  <svg
                    className={`ml-auto w-4 h-4 text-muted-foreground group-hover:text-[#007AFF] transition-transform flex-shrink-0 ${
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
