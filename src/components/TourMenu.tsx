import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Waves, MapPin, Camera, Utensils, Building2 } from "lucide-react";

const tourCategories = [
  {
    id: "tours",
    label: "Туры",
    icon: Camera,
    description: "Экскурсии и приключения",
    path: "/phuket?category=tours"
  },
  {
    id: "beaches",
    label: "Пляжи",
    icon: Waves,
    description: "Лучшие пляжи Пхукета",
    path: "/beaches"
  },
  {
    id: "temples",
    label: "Храмы",
    icon: Building2,
    description: "Культурные достопримечательности",
    path: "/phuket?category=temples"
  },
  {
    id: "restaurants",
    label: "Рестораны",
    icon: Utensils,
    description: "Местная кухня",
    path: "/phuket?category=restaurants"
  },
  {
    id: "districts",
    label: "Районы",
    icon: MapPin,
    description: "Районы Пхукета",
    path: "/phuket?category=districts"
  }
];

export const TourMenu = () => {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent hover:bg-primary/10 text-foreground">
            Каталог
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {tourCategories.map((category) => (
                <li key={category.id}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={category.path}
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <category.icon className="h-4 w-4 text-primary" />
                        <div className="text-sm font-medium leading-none">
                          {category.label}
                        </div>
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {category.description}
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
