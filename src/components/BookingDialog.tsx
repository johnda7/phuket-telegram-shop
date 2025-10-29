import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Minus, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const bookingSchema = z.object({
  name: z.string().trim().min(1, "Введите ваше имя").max(100, "Имя слишком длинное"),
  phone: z.string().trim().min(10, "Введите корректный телефон").max(20, "Телефон слишком длинный"),
  email: z.string().trim().email("Введите корректный email").max(255, "Email слишком длинный"),
  adults: z.number().min(1, "Минимум 1 взрослый"),
  children: z.number().min(0),
});

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tourTitle: string;
  tourDescription: string;
  adultPrice: number;
  childPrice: number;
}

export const BookingDialog = ({
  open,
  onOpenChange,
  tourTitle,
  tourDescription,
  adultPrice,
  childPrice,
}: BookingDialogProps) => {
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = adults * adultPrice + children * childPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      const validatedData = bookingSchema.parse({
        name,
        phone,
        email,
        adults,
        children,
      });

      // Prepare message for Telegram
      const message = `🎫 Новое бронирование!\n\n` +
        `📍 Тур: ${tourTitle}\n` +
        `👥 Гости: ${validatedData.adults} взрослых, ${validatedData.children} детей\n` +
        `💰 Сумма: ${totalPrice.toLocaleString()} ฿\n\n` +
        `👤 Имя: ${validatedData.name}\n` +
        `📞 Телефон: ${validatedData.phone}\n` +
        `📧 Email: ${validatedData.email}`;

      // Send to Telegram bot (you can implement this via edge function)
      const telegramBotToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN;
      const telegramChatId = import.meta.env.VITE_TELEGRAM_CHAT_ID;

      if (telegramBotToken && telegramChatId) {
        await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: telegramChatId,
            text: message,
            parse_mode: 'HTML',
          }),
        });
      }

      toast.success("Бронирование отправлено!", {
        description: "Мы свяжемся с вами в ближайшее время",
      });

      // Reset form
      setName("");
      setPhone("");
      setEmail("");
      setAdults(1);
      setChildren(0);
      onOpenChange(false);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast.error("Ошибка валидации", {
          description: error.errors[0].message,
        });
      } else {
        toast.error("Ошибка отправки", {
          description: "Попробуйте еще раз или напишите нам в Telegram",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            🏝️ Бронирование
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tour Info */}
          <div className="glass-card p-4">
            <h3 className="font-bold text-lg mb-1">{tourTitle}</h3>
            <p className="text-sm text-muted-foreground">{tourDescription}</p>
          </div>

          {/* Guest Counter */}
          <div>
            <h4 className="font-bold mb-4">Количество гостей:</h4>
            
            {/* Adults */}
            <div className="glass-card p-4 mb-3 flex items-center justify-between">
              <div>
                <p className="font-semibold">Взрослые</p>
                <p className="text-sm text-muted-foreground">{adultPrice.toLocaleString()} ฿</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10"
                  onClick={() => setAdults(Math.max(1, adults - 1))}
                  disabled={adults <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-xl font-bold min-w-[2rem] text-center text-primary">
                  {adults}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10"
                  onClick={() => setAdults(Math.min(30, adults + 1))}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Children */}
            <div className="glass-card p-4 mb-3 flex items-center justify-between">
              <div>
                <p className="font-semibold">Дети (4-11 лет)</p>
                <p className="text-sm text-muted-foreground">{childPrice.toLocaleString()} ฿</p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10"
                  onClick={() => setChildren(Math.max(0, children - 1))}
                  disabled={children <= 0}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-xl font-bold min-w-[2rem] text-center text-primary">
                  {children}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="rounded-full h-10 w-10"
                  onClick={() => setChildren(Math.min(20, children + 1))}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Info */}
            <p className="text-center text-sm text-muted-foreground">
              👶 Младенцы до 3 лет - бесплатно
            </p>
          </div>

          {/* Total */}
          <div className="glass-card p-4 bg-primary/5 border-primary/20">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">Итого:</span>
              <span className="text-3xl font-bold text-primary">
                {totalPrice.toLocaleString()} ฿
              </span>
            </div>
          </div>

          {/* Contact Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Ваше имя *</Label>
              <Input
                id="name"
                type="text"
                placeholder="Иван Иванов"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={100}
              />
            </div>

            <div>
              <Label htmlFor="phone">Телефон *</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 (999) 123-45-67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                maxLength={20}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={255}
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Отправка..." : "Забронировать"}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Нажимая кнопку, вы соглашаетесь с условиями бронирования
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};
