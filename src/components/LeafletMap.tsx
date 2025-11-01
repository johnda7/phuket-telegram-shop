/**
 * 🗺️ ИНТЕРАКТИВНАЯ КАРТА С LEAFLET + OPENSTREETMAP
 * 
 * Преимущества:
 * - Бесплатно (OpenStreetMap данные)
 * - Те же карты что Maps.me использует
 * - Полный контроль: маркеры, кластеризация, стили
 * - Интерактивные маркеры из Shopify
 */

import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon, LatLng } from "leaflet";
import { Lock, Unlock, Navigation } from "lucide-react";

interface PlaceMarker {
  handle: string;
  title: string;
  lat: number;
  lng: number;
  category: string;
  rating?: string;
  district?: string;
  isPartner: boolean;
  emoji: string;
  tags: string[];
}

interface LeafletMapProps {
  places: PlaceMarker[];
  height?: string;
  selectedPlaceHandle?: string | null;
  onPlaceClick?: (place: PlaceMarker) => void;
  locked?: boolean; // Заблокирована ли карта (по умолчанию true - не двигается при скролле)
}

// Компонент для центрирования карты при выборе места
function MapController({ 
  selectedPlaceHandle, 
  places 
}: { 
  selectedPlaceHandle: string | null; 
  places: PlaceMarker[] 
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedPlaceHandle) {
      const place = places.find(p => p.handle === selectedPlaceHandle);
      if (place) {
        map.setView([place.lat, place.lng], 15, { animate: true });
      }
    }
  }, [selectedPlaceHandle, places, map]);

  return null;
}

// Компонент для управления блокировкой карты
function MapLockController({ 
  locked,
  onUnlock
}: { 
  locked: boolean;
  onUnlock?: () => void;
}) {
  const map = useMap();

  useEffect(() => {
    // Управление интерактивностью карты
    if (locked) {
      // Блокируем: отключаем скролл колесом, перетаскивание и touch zoom
      map.scrollWheelZoom.disable();
      map.dragging.disable();
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
      
      // КРИТИЧНО: Отключаем события скролла и тач на контейнере карты
      // НО разрешаем клики на zoom controls и маркеры
      const container = map.getContainer();
      if (container) {
        // Предотвращаем все touch события
        container.style.touchAction = 'none';
        
        // Блокируем события скролла на контейнере
        const preventDefault = (e: Event) => {
          // Разрешаем клики на zoom controls, маркеры и кнопку разблокировки
          const target = e.target as HTMLElement;
          if (
            target.closest('.leaflet-control-zoom') || 
            target.closest('.leaflet-marker-icon') ||
            target.closest('[title*="блокиров"]') // Кнопка разблокировки
          ) {
            return; // Пропускаем клики на controls, маркеры и кнопки
          }
          
          // Предотвращаем только wheel (скролл) и touchmove (перетаскивание), но НЕ клики
          if (e.type === 'wheel' || e.type === 'touchmove') {
            e.preventDefault();
            e.stopPropagation();
          }
          // Для mousedown - предотвращаем только если это не клик на controls
          if (e.type === 'mousedown' && !target.closest('.leaflet-control-zoom')) {
            e.preventDefault();
            e.stopPropagation();
          }
        };
        
        // Блокируем wheel (скролл колесом) и touchmove (перетаскивание)
        const preventWheel = (e: WheelEvent) => {
          e.preventDefault();
          e.stopPropagation();
        };
        
        const preventTouchMove = (e: TouchEvent) => {
          // Разрешаем только если это не клик на controls
          const target = e.target as HTMLElement;
          if (!target.closest('.leaflet-control-zoom') && !target.closest('.leaflet-marker-icon')) {
            e.preventDefault();
            e.stopPropagation();
          }
        };
        
        container.addEventListener('wheel', preventWheel, { passive: false });
        container.addEventListener('touchmove', preventTouchMove, { passive: false });
        container.addEventListener('touchstart', preventDefault, { passive: false });
        
        return () => {
          container.style.touchAction = '';
          container.removeEventListener('wheel', preventWheel);
          container.removeEventListener('touchmove', preventTouchMove);
          container.removeEventListener('touchstart', preventDefault);
        };
      }
    } else {
      // Разблокируем: включаем все интерактивные функции
      map.scrollWheelZoom.enable();
      map.dragging.enable();
      map.touchZoom.enable();
      map.doubleClickZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();
      
      // Восстанавливаем события на контейнере
      const container = map.getContainer();
      if (container) {
        container.style.touchAction = '';
        container.style.pointerEvents = '';
      }
    }
  }, [locked, map]);

  // Автоматическая разблокировка при использовании zoom controls
  useEffect(() => {
    if (locked && onUnlock) {
      const handleZoomClick = () => {
        onUnlock();
      };

      // Слушаем клики на zoom controls
      const zoomIn = document.querySelector('.leaflet-control-zoom-in');
      const zoomOut = document.querySelector('.leaflet-control-zoom-out');
      
      if (zoomIn) {
        zoomIn.addEventListener('click', handleZoomClick);
      }
      if (zoomOut) {
        zoomOut.addEventListener('click', handleZoomClick);
      }

      return () => {
        if (zoomIn) {
          zoomIn.removeEventListener('click', handleZoomClick);
        }
        if (zoomOut) {
          zoomOut.removeEventListener('click', handleZoomClick);
        }
      };
    }
  }, [locked, onUnlock]);

  return null;
}

// Создаем кастомные иконки для маркеров (используем encodeURIComponent для эмодзи)
const createCustomIcon = (emoji: string, isPartner: boolean) => {
  const svg = `<svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
    <circle cx="16" cy="16" r="15" fill="${isPartner ? '#007AFF' : '#fff'}" stroke="${isPartner ? '#0056CC' : '#007AFF'}" stroke-width="2"/>
    <text x="16" y="22" font-size="16" text-anchor="middle">${emoji}</text>
  </svg>`;
  
  // Используем encodeURIComponent вместо btoa для поддержки эмодзи
  return new Icon({
    iconUrl: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const LeafletMap = ({ 
  places, 
  height = "calc(100vh - 200px)",
  selectedPlaceHandle,
  onPlaceClick,
  locked = true // По умолчанию карта заблокирована (не двигается при скролле)
}: LeafletMapProps) => {
  // Центр карты (Пхукет)
  const center: [number, number] = [7.8804, 98.3923];
  const [isLocked, setIsLocked] = useState(locked);

  // Синхронизируем isLocked с prop locked
  useEffect(() => {
    setIsLocked(locked);
  }, [locked]);

  return (
    <div 
      className="relative rounded-2xl overflow-hidden" 
      style={{ height }}
    >
      <MapContainer 
        center={center} 
        zoom={11} 
        style={{ 
          height: '100%', 
          width: '100%'
        }}
        className="z-0"
        scrollWheelZoom={false} // По умолчанию отключено (будет управляться через MapLockController)
        dragging={false} // По умолчанию отключено
        touchZoom={false} // По умолчанию отключено
        zoomControl={true} // Zoom controls всегда видны, но карта разблокируется при их использовании
      >
        {/* OpenStreetMap тайлы с русским языком интерфейса */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
        />
        
        {/* Скрываем атрибуцию Leaflet через CSS */}
        {/* КРИТИЧНО: Zoom controls должны оставаться кликабельными даже при блокировке */}
        <style>{`
          .leaflet-container .leaflet-control-attribution {
            display: none !important;
          }
          /* Zoom controls всегда кликабельны (для разблокировки карты) */
          .leaflet-control-zoom {
            pointer-events: auto !important;
          }
          .leaflet-control-zoom-in,
          .leaflet-control-zoom-out {
            pointer-events: auto !important;
            cursor: pointer !important;
          }
        `}</style>
        
        {/* Контроллер для центрирования карты */}
        <MapController selectedPlaceHandle={selectedPlaceHandle} places={places} />
        
        {/* Контроллер для управления блокировкой карты */}
        <MapLockController 
          locked={isLocked} 
          onUnlock={() => setIsLocked(false)}
        />
        
        {/* Маркеры мест */}
        {places.map((place) => (
          <Marker
            key={place.handle}
            position={[place.lat, place.lng]}
            icon={createCustomIcon(place.emoji, place.isPartner)}
            eventHandlers={{
              click: () => {
                // При клике на маркер - автоматически разблокируем карту для лучшего UX
                if (isLocked) {
                  setIsLocked(false);
                }
                if (onPlaceClick) {
                  onPlaceClick(place);
                }
              }
            }}
          >
            <Popup className="custom-popup">
              <div className="p-2 min-w-[200px]">
                <div className="flex items-start gap-2 mb-2">
                  <span className="text-xl">{place.emoji}</span>
                  <div className="flex-1">
                    <h3 className="font-bold text-sm text-gray-900 leading-tight">
                      {place.title}
                    </h3>
                    {place.isPartner && (
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs font-bold rounded-full bg-[#007AFF] text-white">
                        Партнер
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-xs text-gray-600 mb-3">
                  {place.rating && (
                    <span className="flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      {place.rating}
                    </span>
                  )}
                  {place.district && (
                    <span className="flex items-center gap-1">
                      📍 {place.district}
                    </span>
                  )}
                </div>
                
                <a
                  href={`/place/${place.handle}`}
                  onClick={(e) => {
                    e.preventDefault();
                    if (onPlaceClick) {
                      onPlaceClick(place);
                    }
                  }}
                  className="inline-flex items-center gap-1 text-[#007AFF] text-xs font-semibold hover:text-[#0056CC] transition-colors"
                >
                  Подробнее →
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Кнопка блокировки/разблокировки карты - iOS 26 Style */}
      {/* КРИТИЧНО: pointer-events: auto чтобы кнопка работала даже когда карта заблокирована */}
      <button
        onClick={() => setIsLocked(!isLocked)}
        style={{ pointerEvents: 'auto' }}
        className={`absolute top-4 right-4 z-[1000] p-3 rounded-full shadow-lg backdrop-blur-md transition-all ${
          isLocked
            ? 'bg-white/90 hover:bg-white border border-gray-200 text-gray-700'
            : 'bg-[#007AFF] hover:bg-[#0056CC] text-white'
        }`}
        title={isLocked ? 'Разблокировать карту' : 'Заблокировать карту'}
      >
        {isLocked ? (
          <Unlock className="w-5 h-5" />
        ) : (
          <Lock className="w-5 h-5" />
        )}
      </button>
      
      {/* Индикатор состояния карты - правее от zoom controls */}
      {/* КРИТИЧНО: pointer-events: auto чтобы не блокировал клики */}
      {isLocked && (
        <div 
          style={{ pointerEvents: 'auto' }}
          className="absolute top-4 left-20 z-[1000] px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-gray-200 shadow-md text-xs font-medium text-gray-600 flex items-center gap-1.5"
        >
          <Navigation className="w-3.5 h-3.5 text-gray-500" />
          <span>Карта заблокирована</span>
        </div>
      )}
    </div>
  );
};

export default LeafletMap;

