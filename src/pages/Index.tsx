import { Link } from "react-router-dom";
import { MessageCircle, Compass, ShoppingCart } from "lucide-react";
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
          <p className="text-xl text-muted-foreground mb-4">
            AI консьерж для вашего отдыха на Пхукете
          </p>
          <p className="text-md text-muted-foreground mb-8">
            Расскажите что вам нужно — мы подберем идеальный вариант
          </p>
        </div>

        {/* CTA Button */}
        <div className="max-w-md mx-auto mt-8 animate-scale-in">
          <Link to="/ai-concierge">
            <div 
              className="group relative overflow-hidden rounded-2xl p-8 transition-all hover:scale-105"
              style={{
                background: 'rgba(0, 122, 255, 0.85)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 8px 32px rgba(0, 122, 255, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.18)'
              }}
            >
              <div className="text-center">
                <MessageCircle className="w-16 h-16 text-white mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">
                  🤖 Написать AI консьержу
                </h2>
                <p className="text-white/90 mb-4">
                  Подберем идеальный тур за 5 минут
                </p>
                <Button 
                  variant="ghost" 
                  className="text-white hover:bg-white/20"
                >
                  Открыть Telegram →
                </Button>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto mt-8">
          <Link to="/phuket" className="block animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="glass-card p-6 text-center hover:scale-105 transition-all">
              <Compass className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-1">🗺️ Всё о Пхукете</h3>
              <p className="text-sm text-muted-foreground">
                Туры, пляжи, храмы, рестораны
              </p>
            </div>
          </Link>
          
          <Link to="/cart" className="block animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="glass-card p-6 text-center hover:scale-105 transition-all">
              <ShoppingCart className="w-12 h-12 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-lg mb-1">🛒 Корзина</h3>
              <p className="text-sm text-muted-foreground">
                Завершите бронирование
              </p>
            </div>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
          <div className="text-center p-6 glass-card animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="text-4xl mb-2">⚡</div>
            <h3 className="font-semibold mb-1">Быстро</h3>
            <p className="text-sm text-muted-foreground">Бронирование за 2 клика</p>
          </div>
          <div className="text-center p-6 glass-card animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="text-4xl mb-2">🤖</div>
            <h3 className="font-semibold mb-1">AI подбор</h3>
            <p className="text-sm text-muted-foreground">Персональные рекомендации</p>
          </div>
          <div className="text-center p-6 glass-card animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="text-4xl mb-2">📱</div>
            <h3 className="font-semibold mb-1">Telegram</h3>
            <p className="text-sm text-muted-foreground">Прямая связь с консьержем</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
