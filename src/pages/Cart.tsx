import { ShoppingCart } from "lucide-react";

const Cart = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">🛒 Корзина</h1>
          <p className="text-muted-foreground">
            Используйте кнопку корзины справа внизу
          </p>
        </div>

        <div className="text-center py-20">
          <ShoppingCart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Страница в разработке</h2>
          <p className="text-muted-foreground">
            Корзина доступна через плавающую кнопку
          </p>
        </div>
      </div>
    </div>
  );
};

export default Cart;
