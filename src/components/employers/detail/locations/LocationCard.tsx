import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Location } from "@/types/entities";
import { MapPin, Edit, Trash2, Star } from "lucide-react";
import LocationPrimaryBadge from "./LocationPrimaryBadge";
import { Badge } from "@/components/ui/badge";

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
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">{location.name}</CardTitle>
          </div>
          {location.isPrimary && <LocationPrimaryBadge />}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-muted-foreground space-y-1">
          <p>{location.addressLine1}</p>
          {location.addressLine2 && <p>{location.addressLine2}</p>}
          <p>
            {location.city}
            {location.state && `, ${location.state}`} {location.postalCode}
          </p>
          <p>{location.country}</p>
        </div>

        {location.capacity && (
          <div className="flex items-center gap-2 pt-2">
            <Badge variant="outline" className="text-xs">
              Capacity: {location.capacity}
            </Badge>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(location)}
            className="flex-1"
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          
          {!location.isPrimary && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSetPrimary(location)}
              >
                <Star className="h-4 w-4 mr-1" />
                Set Primary
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(location)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
