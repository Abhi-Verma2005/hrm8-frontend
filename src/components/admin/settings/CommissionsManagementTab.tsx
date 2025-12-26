import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign } from "lucide-react";
import { CommissionRoleManager } from "@/components/commissions/CommissionRoleManager";
import { CommissionRuleBuilder } from "@/components/commissions/CommissionRuleBuilder";

export function CommissionsManagementTab() {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader className="p-4 md:p-6">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="h-10 w-10 md:h-12 md:w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <DollarSign className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-lg md:text-2xl truncate">Commissions Management</CardTitle>
              <CardDescription className="text-xs md:text-sm line-clamp-2">Configure commission roles, rules, and automated assignment</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="roles" className="space-y-4 md:space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-auto">
          <TabsTrigger value="roles" className="touch-manipulation min-h-[44px] text-sm md:text-base">Commission Roles</TabsTrigger>
          <TabsTrigger value="rules" className="touch-manipulation min-h-[44px] text-sm md:text-base">Commission Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="roles" className="space-y-4">
          <CommissionRoleManager />
        </TabsContent>

        <TabsContent value="rules" className="space-y-4">
          <CommissionRuleBuilder />
        </TabsContent>
      </Tabs>
    </div>
  );
}
