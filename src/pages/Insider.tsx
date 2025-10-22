import { Link } from "react-router-dom";
import { MapPin, Info } from "lucide-react";

const Insider = () => {
  const categories = [
    { name: "Достопримечательности", emoji: "🏛️", slug: "attractions" },
    { name: "Храмы", emoji: "⛩️", slug: "temples" },
    { name: "Пляжи", emoji: "🏖️", slug: "beaches" },
    { name: "Рестораны", emoji: "🍽️", slug: "restaurants" },
    { name: "SPA", emoji: "💆", slug: "spa" },
    { name: "Районы", emoji: "🗺️", slug: "regions" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary mb-4 inline-block">
            ← Назад
          </Link>
          <h1 className="text-4xl font-bold mb-4">📚 Phuket Insider</h1>
          <p className="text-muted-foreground">
            Информационный гид по Пхукету: места, советы, лайфхаки
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.slug}
              className="rounded-2xl p-8 cursor-pointer transition-all hover:scale-105"
              style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(20px) saturate(180%)',
                WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                boxShadow: 'var(--glass-shadow), inset 0 1px 0 var(--glass-border)',
                border: '1px solid var(--glass-border)'
              }}
            >
              <div className="text-5xl mb-4">{category.emoji}</div>
              <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
              <p className="text-sm text-muted-foreground">
                Скоро добавим контент из Phuket Insider
              </p>
            </div>
          ))}
        </div>

        {/* Coming Soon Notice */}
        <div className="mt-16 text-center">
          <Info className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">В разработке</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Мы переносим весь контент с Phuket Insider в Shopify. 
            Скоро здесь будут сотни мест с описаниями, фото и рейтингами!
          </p>
        </div>
      </div>
    </div>
  );
};

export default Insider;
