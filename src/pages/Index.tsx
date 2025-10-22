import { Link } from "react-router-dom";
import { ShoppingBag, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
            🏝️ PhuketDA
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Туры, экскурсии и всё о Пхукете в одном месте
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-12">
          {/* Tours Card */}
          <Link to="/tours" className="block animate-scale-in">
            <div 
              className="group relative overflow-hidden rounded-2xl p-8 h-64 transition-all hover:scale-105"
              style={{
                background: 'rgba(0, 122, 255, 0.85)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0, 122, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.18)'
              }}
            >
              <ShoppingBag className="w-16 h-16 text-white mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">
                Туры
              </h2>
              <p className="text-white/90">
                Экскурсии с ценами и онлайн бронированием
              </p>
              <div className="absolute bottom-4 right-4">
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-white/20"
                >
                  Смотреть →
                </Button>
              </div>
            </div>
          </Link>

          {/* Phuket Insider Card */}
          <Link to="/insider" className="block animate-scale-in" style={{ animationDelay: '0.1s' }}>
            <div 
              className="glass-card group relative overflow-hidden p-8 h-64 transition-all hover:scale-105"
            >
              <Info className="w-16 h-16 text-primary mb-4" />
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Phuket Insider
              </h2>
              <p className="text-muted-foreground">
                Гиды по местам, пляжам и достопримечательностям
              </p>
              <div className="absolute bottom-4 right-4">
                <Button variant="ghost">
                  Изучить →
                </Button>
              </div>
            </div>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
          <div className="text-center p-6 glass-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="text-4xl mb-2">⚡</div>
            <h3 className="font-semibold mb-1">Быстро</h3>
            <p className="text-sm text-muted-foreground">Бронирование за 2 клика</p>
          </div>
          <div className="text-center p-6 glass-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="text-4xl mb-2">💎</div>
            <h3 className="font-semibold mb-1">Премиум</h3>
            <p className="text-sm text-muted-foreground">iOS 26 дизайн</p>
          </div>
          <div className="text-center p-6 glass-card animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-4xl mb-2">📱</div>
            <h3 className="font-semibold mb-1">Telegram</h3>
            <p className="text-sm text-muted-foreground">Прямая связь с менеджером</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
