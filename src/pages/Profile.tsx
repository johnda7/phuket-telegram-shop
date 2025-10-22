import { User } from "lucide-react";

const Profile = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">👤 Профиль</h1>
          <p className="text-muted-foreground">
            Ваш личный кабинет
          </p>
        </div>

        <div className="text-center py-20">
          <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Скоро здесь появится</h2>
          <p className="text-muted-foreground">
            • Личная информация<br/>
            • История бронирований<br/>
            • Программа лояльности<br/>
            • Реферальная программа
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
