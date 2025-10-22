import { useEffect, useRef } from 'react';

interface TourMapProps {
  tourHandle: string;
}

// Tour routes data with simple waypoints
const tourRoutes: Record<string, {
  title: string;
  waypoints: Array<{ name: string; time?: string }>;
}> = {
  'phi-phi-2-days-1-night': {
    title: 'Весь путь от Пхукета до Островов Пхи-Пхи (День 2)',
    waypoints: [
      { name: 'Пхукет (отправление)', time: '08:00' },
      { name: 'Остров Пхи-Пхи Дон', time: '10:00' },
      { name: 'Бухта Майя', time: '09:00' },
      { name: 'Бухта Пиле' },
      { name: 'Пещера Викингов' },
      { name: 'Возвращение в Пхукет', time: '17:00' },
    ],
  },
  'james-bond-island-tour': {
    title: 'Маршрут до острова Джеймса Бонда',
    waypoints: [
      { name: 'Пхукет (отправление)', time: '08:00' },
      { name: 'Залив Пханг Нга' },
      { name: 'Остров Джеймса Бонда', time: '11:00' },
      { name: 'Возвращение в Пхукет', time: '16:00' },
    ],
  },
};

export const TourMap = ({ tourHandle }: TourMapProps) => {
  const route = tourRoutes[tourHandle] || tourRoutes['phi-phi-2-days-1-night'];

  return (
    <div className="glass-card p-6">
      <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
        🗺️ Маршрут тура
      </h3>
      <p className="text-sm text-muted-foreground mb-6">
        {route.title}
      </p>

      {/* Simple Route Visualization */}
      <div className="relative">
        {/* Route line */}
        <div className="absolute left-[19px] top-8 bottom-8 w-0.5 bg-gradient-to-b from-primary via-primary to-primary opacity-30" />
        
        <div className="space-y-6">
          {route.waypoints.map((waypoint, index) => (
            <div key={index} className="flex items-start gap-4 relative">
              {/* Waypoint marker */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm z-10 flex-shrink-0 ${
                index === 0 || index === route.waypoints.length - 1
                  ? 'bg-primary shadow-lg shadow-primary/30'
                  : 'bg-success shadow-md'
              }`}>
                {index + 1}
              </div>
              
              {/* Waypoint info */}
              <div className="flex-1 pt-2">
                <p className="font-semibold text-base">{waypoint.name}</p>
                {waypoint.time && (
                  <p className="text-sm text-muted-foreground mt-1">⏰ {waypoint.time}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Distance info */}
      <div className="mt-6 p-4 bg-muted/50 rounded-lg">
        <p className="text-sm text-muted-foreground">
          📍 Общая продолжительность: 2 дня / 1 ночь
        </p>
      </div>
    </div>
  );
};
