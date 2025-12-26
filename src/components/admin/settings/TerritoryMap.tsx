import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface Territory {
  id: string;
  name: string;
  coordinates: [number, number];
  color: string;
}

interface TerritoryMapProps {
  territories: Territory[];
  onTerritoryClick?: (territoryId: string) => void;
}

export function TerritoryMap({ territories, onTerritoryClick }: TerritoryMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapboxToken, setMapboxToken] = useState(localStorage.getItem('mapbox_token') || '');
  const [tokenInput, setTokenInput] = useState('');
  const [mapInitialized, setMapInitialized] = useState(false);

  const initializeMap = (token: string) => {
    if (!mapContainer.current || !token) return;

    try {
      mapboxgl.accessToken = token;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-98.5795, 39.8283], // Center of USA
        zoom: 3.5,
      });

      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      map.current.on('load', () => {
        setMapInitialized(true);
      });

      return true;
    } catch (error) {
      console.error('Error initializing map:', error);
      return false;
    }
  };

  const handleSaveToken = () => {
    if (tokenInput.trim()) {
      localStorage.setItem('mapbox_token', tokenInput.trim());
      setMapboxToken(tokenInput.trim());
      initializeMap(tokenInput.trim());
    }
  };

  useEffect(() => {
    if (mapboxToken) {
      initializeMap(mapboxToken);
    }

    return () => {
      markers.current.forEach(marker => marker.remove());
      map.current?.remove();
    };
  }, [mapboxToken]);

  useEffect(() => {
    if (!map.current || !mapInitialized) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add markers for each territory
    territories.forEach(territory => {
      const el = document.createElement('div');
      el.className = 'territory-marker';
      el.style.backgroundColor = territory.color;
      el.style.width = '30px';
      el.style.height = '30px';
      el.style.borderRadius = '50%';
      el.style.border = '3px solid white';
      el.style.cursor = 'pointer';
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';

      const marker = new mapboxgl.Marker(el)
        .setLngLat(territory.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 })
            .setHTML(`<strong>${territory.name}</strong>`)
        )
        .addTo(map.current!);

      el.addEventListener('click', () => {
        if (onTerritoryClick) {
          onTerritoryClick(territory.id);
        }
      });

      markers.current.push(marker);
    });
  }, [territories, mapInitialized, onTerritoryClick]);

  if (!mapboxToken) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              To display the interactive map, please enter your Mapbox public token. 
              You can get one from <a href="https://mapbox.com" target="_blank" rel="noopener noreferrer" className="underline font-medium">mapbox.com</a> after creating a free account.
            </AlertDescription>
          </Alert>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter your Mapbox public token (pk.xxxxx)"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSaveToken}>
              Save Token
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden border">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
}
