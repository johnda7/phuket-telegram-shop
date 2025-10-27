
import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import daBotSvg from "@/assets/dabot-animated.svg";

/**
 * ДА БОТ - AI-консьерж GPT-5
 * Анимированный виджет чата, доступный на КАЖДОЙ странице
 */
const DaBot = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button - всегда видимый в углу */}
      <div className="fixed bottom-6 right-6 z-50">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="group relative bg-primary hover:bg-primary/90 text-white rounded-full p-4 shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-110"
          >
            {/* Пульсирующее кольцо */}
            <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-20"></span>
            
            {/* Иконка бота (SVG, анимированный) */}
            <div className="relative w-14 h-14 flex items-center justify-center">
              <img
                src={daBotSvg}
                alt="ДА БОТ"
                className="w-14 h-14 animate-[pulse_1.6s_ease-in-out_infinite] drop-shadow-lg"
                style={{ filter: 'drop-shadow(0 2px 8px #007AFF33)' }}
              />
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full right-0 mb-2 w-48 bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="font-semibold">ДА БОТ - AI консьерж</div>
              <div className="text-xs text-gray-300 mt-1">
                Спросите что-то про Пхукет!
              </div>
              <div className="absolute top-full right-4 -mt-1 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
            </div>
          </button>
        )}

        {/* Chat Widget - открывается при клике */}
        {isOpen && (
          <div className="bg-white rounded-2xl shadow-2xl w-96 max-w-[calc(100vw-3rem)] overflow-hidden border border-gray-200 animate-in slide-in-from-bottom-5 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-blue-600 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={daBotSvg}
                  alt="ДА БОТ"
                  className="w-10 h-10 animate-[pulse_1.6s_ease-in-out_infinite] drop-shadow"
                  style={{ filter: 'drop-shadow(0 2px 8px #007AFF33)' }}
                />
                <div>
                  <div className="text-white font-bold text-lg">ДА БОТ</div>
                  <div className="text-blue-100 text-xs">AI-консьерж по Пхукету</div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 bg-gradient-to-b from-blue-50 to-white">
              <div className="space-y-4">
                {/* Welcome Message */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100">
                  <p className="text-gray-800 font-medium mb-2">
                    👋 Привет! Я ДА БОТ - ваш личный AI-гид по Пхукету!
                  </p>
                  <p className="text-sm text-gray-600">
                    Работаю на GPT-5. Могу помочь с:
                  </p>
                  <ul className="text-sm text-gray-600 mt-2 space-y-1">
                    <li>✅ Выбор туров и экскурсий</li>
                    <li>✅ Аренда авто и трансфер</li>
                    <li>✅ Обмен валюты</li>
                    <li>✅ Рестораны и развлечения</li>
                    <li>✅ Любые вопросы про Пхукет!</li>
                  </ul>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700">Быстрые вопросы:</p>
                  <button className="w-full text-left bg-white hover:bg-blue-50 rounded-xl p-3 text-sm text-gray-700 shadow-sm border border-gray-200 transition-colors">
                    🏝️ Какие туры самые популярные?
                  </button>
                  <button className="w-full text-left bg-white hover:bg-blue-50 rounded-xl p-3 text-sm text-gray-700 shadow-sm border border-gray-200 transition-colors">
                    🚗 Где дешевле арендовать авто?
                  </button>
                  <button className="w-full text-left bg-white hover:bg-blue-50 rounded-xl p-3 text-sm text-gray-700 shadow-sm border border-gray-200 transition-colors">
                    🏖️ Лучшие пляжи для отдыха?
                  </button>
                  <button className="w-full text-left bg-white hover:bg-blue-50 rounded-xl p-3 text-sm text-gray-700 shadow-sm border border-gray-200 transition-colors">
                    💱 Где выгодно обменять валюту?
                  </button>
                </div>

                {/* CTA - Open in Telegram */}
                <a
                  href="https://t.me/PHUKETDABOT"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button className="w-full bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-500 text-white font-semibold py-6 text-base shadow-lg">
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Открыть в Telegram
                  </Button>
                </a>

                <p className="text-xs text-center text-gray-500">
                  Полный функционал доступен в Telegram-боте 🚀
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DaBot;
