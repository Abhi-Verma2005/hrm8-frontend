import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Location } from "@/types/entities";
import { MapPin, Edit, Trash2, Star, Phone } from "lucide-react";
import LocationPrimaryBadge from "./LocationPrimaryBadge";

interface LocationCardProps {
  location: Location;
  onEdit: (location: Location) => void;
  onDelete: (location: Location) => void;
  onSetPrimary: (location: Location) => void;
}

export default function LocationCard({ location, onEdit, onDelete, onSetPrimary }: LocationCardProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">{location.name}</CardTitle>
          </div>
          <div className="flex items-center gap-1">
            {location.isPrimary && <LocationPrimaryBadge />}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onEdit(location)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            {!location.isPrimary && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onSetPrimary(location)}
                >
                  <Star className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onDelete(location)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-muted-foreground space-y-1">
          <p>{location.addressLine1}</p>
          {location.addressLine2 && <p>{location.addressLine2}</p>}
          <p>
            {location.city}
            {location.state && `, ${location.state}`}
            {location.postalCode && ` ${location.postalCode}`}
          </p>
          <p>{location.country}</p>
          {location.phone && (
            <p className="flex items-center gap-2 pt-2">
              <Phone className="h-3.5 w-3.5" />
              {location.phone}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
