import { useParams, Link } from "react-router-dom";
import { Car, RefreshCw, Home, ArrowLeft } from "lucide-react";

const Services = () => {
  const { service } = useParams<{ service: string }>();
  
  const services: Record<string, { title: string; description: string; icon: any }> = {
    'car-rental': {
      title: '🚗 Аренда автомобилей',
      description: 'Удобные машины для поездок по Пхукету',
      icon: Car
    },
    'currency-exchange': {
      title: '💱 Обмен валюты',
      description: 'Выгодный курс без комиссии',
      icon: RefreshCw
    },
    'real-estate': {
      title: '🏠 Недвижимость',
      description: 'Аренда и продажа вилл на Пхукете',
      icon: Home
    }
  };

  const current = services[service || ''] || services['car-rental'];
  const Icon = current.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-primary hover:underline mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Вернуться на главную
        </Link>
        
        <div className="p-12 rounded-3xl bg-white shadow-xl text-center">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <Icon className="w-12 h-12 text-primary" />
          </div>
          
          <h1 className="text-4xl font-black text-gray-900 mb-4">
            {current.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-8">
            {current.description}
          </p>
          
          <div className="p-6 rounded-2xl bg-blue-50 mb-8">
            <p className="text-gray-700">
              🚧 Страница в разработке
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Скоро здесь появится полная информация и возможность бронирования
            </p>
          </div>
          
          <a
            href="https://t.me/PHUKETDABOT"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 rounded-full bg-primary text-white font-bold hover:scale-105 transition-transform"
          >
            Написать в Telegram →
          </a>
        </div>
      </div>
    </div>
  );
};

export default Services;

