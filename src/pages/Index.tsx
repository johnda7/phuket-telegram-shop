import { Link } from "react-router-dom";
import { Home, RefreshCw, Car, MapPin, Info, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import heroImage from "@/assets/phi-phi-hero.jpg";

const services = [
  {
    id: 'real-estate',
    icon: Home,
    title: 'Недвижимость',
    description: 'Аренда и продажа',
    link: 'https://t.me/PhuketDAexpert',
    external: true
  },
  {
    id: 'currency',
    icon: RefreshCw,
    title: 'Обмен валюты',
    description: 'Березa - выгодный курс',
    link: 'https://t.me/bereza_manager',
    external: true
  },
  {
    id: 'car-rental',
    icon: Car,
    title: 'Аренда авто',
    description: '100+ автомобилей',
    link: 'https://t.me/RentaCarPhu',
    external: true
  },
  {
    id: 'tours',
    icon: MapPin,
    title: 'Экскурсии',
    description: 'Пхукет Go',
    link: 'https://t.me/PhuketGa',
    external: true
  },
];

const Index = () => {
  const handleTelegramClick = () => {
    window.open('https://t.me/+meHzcVXS2mIzZmU1', '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[45vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-background" />
        </div>
        
        <div className="relative z-10 text-center px-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">DA</span>
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Добро пожаловать<br />в Пхукет DA!
          </h1>
          <p className="text-base text-white/90">
            Полезная информация
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Main Services Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {services.map((service) => {
            const IconComponent = service.icon;
            const cardContent = (
              <Card className="hover:shadow-lg transition-all text-center h-full">
                <CardContent className="pt-6 pb-4 px-3">
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center mx-auto mb-3">
                    <IconComponent className="w-7 h-7 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{service.title}</h3>
                  <p className="text-xs text-muted-foreground leading-tight">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            );
            
            return service.external ? (
              <a 
                key={service.id}
                href={service.link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {cardContent}
              </a>
            ) : (
              <Link key={service.id} to={service.link}>
                {cardContent}
              </Link>
            );
          })}
        </div>

        {/* Description */}
        <div className="glass-card p-5 mb-6">
          <p className="text-center text-sm leading-relaxed">
            Здесь всё про Пхукет — от туриста до резидента:<br/>
            🏖️ пляжи, 🍜 еда, 🗺️ экскурсии, 💰 аренда, 🏠 жильё, 💱 обмен валют, 🎭 мероприятия и местная жизнь.
          </p>
        </div>

        {/* Pinned Info */}
        <div className="glass-card p-5 mb-6">
          <p className="text-sm mb-3">
            📌 В закрепе — лучшие локации, советы, гайды и быстрые ответы от местных.
          </p>
          <p className="text-sm text-muted-foreground">
            👇 Быстрые ссылки на проверенные сервисы:
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-3 mb-6">
          <Link to="/phuket">
            <Card className="hover:shadow-md transition-all">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5 text-primary" />
                  <span className="font-medium">ℹ️ Полезная информация</span>
                </div>
                <span className="text-muted-foreground">→</span>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* AI Concierge CTA */}
        <div className="glass-card p-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-3">
            <MessageCircle className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-lg font-bold mb-2">
            🤖 Не знаете что выбрать?
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            AI консьерж подберет идеальный вариант
          </p>
          <Button 
            onClick={handleTelegramClick}
            size="lg"
            className="w-full max-w-sm"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            Написать в Telegram
          </Button>
          <p className="text-xs text-muted-foreground mt-3">
            Отвечаем в течение 5 минут
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
