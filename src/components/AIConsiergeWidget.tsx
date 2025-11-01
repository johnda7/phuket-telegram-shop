import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import daBotSvg from "@/assets/dabot-animated.svg";

export const AIConsiergeWidget = () => {
  const handleTelegramClick = () => {
    window.open('https://t.me/PHUKETDABOT', '_blank');
  };

  return (
    <div className="bg-white rounded-xl p-2 border border-gray-200">
      <div className="flex items-start gap-2 mb-2">
        {/* Премиум иконка бота из DaBot (SVG) вместо эмодзи */}
        <div className="p-1.5 rounded-full bg-[#007AFF]/10 flex-shrink-0">
          <img
            src={daBotSvg}
            alt="ДА БОТ"
            className="w-5 h-5"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-xs mb-0.5 text-gray-900">Не знаете что выбрать?</h3>
          <p className="text-xs text-gray-600 leading-tight">
            AI консьерж подберет идеальный тур для вас
          </p>
        </div>
      </div>
      
      <Button 
        onClick={handleTelegramClick}
        className="w-full bg-[#007AFF] hover:bg-[#0051D5] text-white min-h-[44px] text-xs font-semibold py-2"
        size="sm"
      >
        <MessageCircle className="w-3 h-3 mr-1.5" />
        Написать в Telegram
      </Button>
      
      <p className="text-[10px] text-gray-500 text-center mt-1.5">
        Отвечаем в течение 5 минут
      </p>
    </div>
  );
};
