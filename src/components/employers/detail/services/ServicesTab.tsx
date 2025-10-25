import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ServicesOverviewCard } from "./ServicesOverviewCard";
import { ActiveServicesList } from "./ActiveServicesList";
import { RPOServiceCard } from "./RPOServiceCard";
import { CreateRPOServiceDialog } from "./CreateRPOServiceDialog";
import { getRPOServicesByEmployer } from "@/lib/rpoServiceStorage";

interface ServicesTabProps {
  employerId: string;
}

export function ServicesTab({ employerId }: ServicesTabProps) {
  const [showCreateRPO, setShowCreateRPO] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  
  const rpoServices = getRPOServicesByEmployer(employerId);

  const handleRPOCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header with Create RPO Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Recruitment Services</h2>
          <p className="text-sm text-muted-foreground">
            Manage recruitment services and RPO engagements
          </p>
        </div>
        <Button onClick={() => setShowCreateRPO(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create RPO Service
        </Button>
      </div>

      {/* Services Overview Stats */}
      <ServicesOverviewCard employerId={employerId} />

      {/* RPO Services Section */}
      {rpoServices.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Active RPO Engagements ({rpoServices.length})
            </h3>
          </div>
          <div className="space-y-4">
            {rpoServices.map(service => (
              <RPOServiceCard 
                key={`${service.id}-${refreshKey}`} 
                service={service}
                onEdit={() => {
                  // TODO: Open edit dialog
                  console.log('Edit RPO:', service.id);
                }}
                onViewDetails={() => {
                  // TODO: Open detail view
                  console.log('View RPO details:', service.id);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Standard Services Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Standard Services</h3>
        <ActiveServicesList employerId={employerId} />
      </div>

      {/* Create RPO Dialog */}
      <CreateRPOServiceDialog 
        open={showCreateRPO} 
        onOpenChange={setShowCreateRPO}
        employerId={employerId}
        onSuccess={handleRPOCreated}
      />
    </div>
  );
}
