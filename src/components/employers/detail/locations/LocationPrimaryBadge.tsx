import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

export default function LocationPrimaryBadge() {
  return (
    <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0">
      <Star className="h-3 w-3 mr-1 fill-current" />
      Primary
    </Badge>
  );
}
