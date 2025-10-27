import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const AIConsiergeWidget = () => {
  const handleTelegramClick = () => {
    // TODO: Add actual Telegram bot link
    window.open('https://t.me/PHUKETDABOT', '_blank');
  };

  return (
    <div className="glass-card p-6 sticky top-20 animate-fade-in">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-3 rounded-full bg-primary/10">
          <MessageCircle className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-lg mb-1">🤖 Не знаете что выбрать?</h3>
          <p className="text-sm text-muted-foreground">
            AI консьерж подберет идеальный тур для вас
          </p>
        </div>
      </div>
      
      <Button 
        onClick={handleTelegramClick}
        className="w-full"
        size="lg"
      >
        <MessageCircle className="w-5 h-5 mr-2" />
        Написать в Telegram
      </Button>
      
      <p className="text-xs text-muted-foreground text-center mt-3">
        Отвечаем в течение 5 минут
      </p>
    </div>
  );
};
