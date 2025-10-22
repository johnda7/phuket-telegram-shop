import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';

interface TourMapProps {
  tourHandle: string;
}

// Tour routes data
const tourRoutes: Record<string, {
  center: [number, number];
  zoom: number;
  waypoints: Array<{ name: string; coordinates: [number, number] }>;
}> = {
  'phi-phi-2-days-1-night': {
    center: [98.7784, 7.7407],
    zoom: 10,
    waypoints: [
      { name: 'Пхукет', coordinates: [98.3380, 7.8804] },
      { name: 'Остров Пхи-Пхи Дон', coordinates: [98.7784, 7.7407] },
      { name: 'Бухта Майя', coordinates: [98.7667, 7.6771] },
      { name: 'Бухта Пиле', coordinates: [98.7590, 7.6820] },
    ],
  },
  'james-bond-island-tour': {
    center: [98.5018, 8.2744],
    zoom: 11,
    waypoints: [
      { name: 'Пхукет', coordinates: [98.3380, 7.8804] },
      { name: 'Остров Джеймса Бонда', coordinates: [98.5018, 8.2744] },
      { name: 'Залив Пханг Нга', coordinates: [98.5300, 8.4500] },
    ],
  },
};

export const TourMap = ({ tourHandle }: TourMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [tokenSaved, setTokenSaved] = useState(false);

  const route = tourRoutes[tourHandle] || tourRoutes['phi-phi-2-days-1-night'];

  useEffect(() => {
    // Check if token is saved in localStorage
    const savedToken = localStorage.getItem('mapbox_token');
    if (savedToken) {
      setMapboxToken(savedToken);
      setTokenSaved(true);
    }
  }, []);

  useEffect(() => {
    if (!mapContainer.current || !tokenSaved || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: route.center,
        zoom: route.zoom,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Wait for map to load
      map.current.on('load', () => {
        if (!map.current) return;

        // Add markers for waypoints
        route.waypoints.forEach((waypoint, index) => {
          const el = document.createElement('div');
          el.className = 'marker';
          el.style.width = '32px';
          el.style.height = '32px';
          el.style.borderRadius = '50%';
          el.style.backgroundColor = index === 0 || index === route.waypoints.length - 1 
            ? 'hsl(211 100% 50%)' 
            : 'hsl(142 76% 36%)';
          el.style.border = '3px solid white';
          el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
          el.style.display = 'flex';
          el.style.alignItems = 'center';
          el.style.justifyContent = 'center';
          el.style.color = 'white';
          el.style.fontWeight = 'bold';
          el.style.fontSize = '14px';
          el.textContent = (index + 1).toString();

          new mapboxgl.Marker(el)
            .setLngLat(waypoint.coordinates)
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setHTML(
                `<strong>${waypoint.name}</strong>`
              )
            )
            .addTo(map.current);
        });

        // Draw route line
        const coordinates = route.waypoints.map(w => w.coordinates);
        
        map.current.addSource('route', {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coordinates,
            },
          },
        });

        map.current.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round',
          },
          paint: {
            'line-color': 'hsl(211 100% 50%)',
            'line-width': 4,
            'line-dasharray': [2, 2],
          },
        });
      });
    } catch (error) {
      console.error('Error initializing map:', error);
    }

    return () => {
      map.current?.remove();
    };
  }, [tokenSaved, mapboxToken, route]);

  const handleSaveToken = () => {
    if (mapboxToken.trim()) {
      localStorage.setItem('mapbox_token', mapboxToken);
      setTokenSaved(true);
    }
  };

  if (!tokenSaved) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-lg font-bold mb-4">🗺️ Карта маршрута</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Для отображения карты маршрута необходим токен Mapbox.
          Получите бесплатный токен на{' '}
          <a
            href="https://mapbox.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            mapbox.com
          </a>
        </p>
        <div className="space-y-3">
          <div>
            <Label htmlFor="mapbox-token">Mapbox Access Token</Label>
            <Input
              id="mapbox-token"
              type="text"
              placeholder="pk.eyJ1..."
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
            />
          </div>
          <Button onClick={handleSaveToken} className="w-full">
            Сохранить токен
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-4">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        🗺️ Маршрут тура
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Весь путь от Пхукета до {route.waypoints[route.waypoints.length - 1].name}
      </p>
      <div
        ref={mapContainer}
        className="w-full h-[400px] rounded-xl overflow-hidden"
      />
      <div className="mt-4 space-y-2">
        {route.waypoints.map((waypoint, index) => (
          <div key={index} className="flex items-center gap-3 text-sm">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs ${
              index === 0 || index === route.waypoints.length - 1
                ? 'bg-primary'
                : 'bg-success'
            }`}>
              {index + 1}
            </div>
            <span>{waypoint.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
