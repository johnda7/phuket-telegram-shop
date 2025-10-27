import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { ShopifyProduct } from '@/lib/shopify';

interface ShoppingMapProps {
  products: ShopifyProduct[];
  onClose: () => void;
}

interface PlaceCoordinates {
  handle: string;
  title: string;
  lat: number;
  lng: number;
  emoji: string;
  tags: string[];
}

export const ShoppingMap = ({ products, onClose }: ShoppingMapProps) => {
  const [selectedPlace, setSelectedPlace] = useState<PlaceCoordinates | null>(null);
  
  // Extract coordinates from metafields
  const placesWithCoordinates: PlaceCoordinates[] = products
    .map(p => {
      const coordinatesField = p.node.metafields?.find(m => m?.key === 'coordinates');
      if (!coordinatesField) return null;
      
      const [lat, lng] = coordinatesField.value.split(',').map(Number);
      if (!lat || !lng) return null;
      
      // Определяем emoji по тегам
      let emoji = '🏢';
      if (p.node.tags.includes('luxury')) emoji = '💎';
      else if (p.node.tags.includes('outlet')) emoji = '🏷️';
      else if (p.node.tags.includes('supermarket')) emoji = '🛒';
      else if (p.node.tags.includes('mall')) emoji = '🏬';
      else if (p.node.tags.includes('market')) emoji = '🛍️';
      
      return {
        handle: p.node.handle,
        title: p.node.title,
        lat,
        lng,
        emoji,
        tags: p.node.tags
      };
    })
    .filter(Boolean) as PlaceCoordinates[];

  // Calculate center of all places
  const centerLat = placesWithCoordinates.reduce((sum, p) => sum + p.lat, 0) / placesWithCoordinates.length;
  const centerLng = placesWithCoordinates.reduce((sum, p) => sum + p.lng, 0) / placesWithCoordinates.length;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-3xl shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold">🗺️ Карта торговых центров</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {placesWithCoordinates.length} мест на Пхукете
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative overflow-hidden">
          {/* Google Maps Iframe */}
          <iframe
            src={`https://www.google.com/maps?q=${centerLat},${centerLng}&z=11&output=embed&hl=ru`}
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          
          {/* Places List Overlay - iOS Style */}
          <div className="absolute bottom-4 left-4 right-4 bg-background/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-border p-4 max-h-[200px] overflow-y-auto">
            <h3 className="font-bold mb-3 text-sm uppercase tracking-wide text-muted-foreground">
              Места на карте:
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {placesWithCoordinates.map((place) => (
                <button
                  key={place.handle}
                  onClick={() => {
                    setSelectedPlace(place);
                    // Open Google Maps with this location
                    window.open(
                      `https://www.google.com/maps?q=${place.lat},${place.lng}&hl=ru`,
                      '_blank'
                    );
                  }}
                  className={`text-left p-3 rounded-xl transition-all duration-200 border-2 ${
                    selectedPlace?.handle === place.handle
                      ? 'bg-primary/10 border-primary shadow-lg scale-105'
                      : 'bg-muted/50 border-transparent hover:bg-muted hover:border-border'
                  }`}
                >
                  <div className="text-2xl mb-1">{place.emoji}</div>
                  <div className="text-xs font-semibold line-clamp-2 leading-tight">
                    {place.title}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="p-4 border-t border-border bg-muted/30">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>💎 Люкс</span>
              <span>🏬 Молл</span>
              <span>🏷️ Аутлет</span>
              <span>🛒 Супермаркет</span>
              <span>🛍️ Рынок</span>
            </div>
            <span className="text-primary font-medium">
              Кликните на место чтобы открыть в Google Maps
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};


