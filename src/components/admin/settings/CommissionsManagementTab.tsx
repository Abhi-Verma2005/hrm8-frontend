import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign } from "lucide-react";
import { CommissionRoleManager } from "@/components/commissions/CommissionRoleManager";
import { CommissionRuleBuilder } from "@/components/commissions/CommissionRuleBuilder";

export function CommissionsManagementTab() {
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Commissions Management</CardTitle>
              <CardDescription>Configure commission roles, rules, and automated assignment</CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="roles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="roles">Commission Roles</TabsTrigger>
          <TabsTrigger value="rules">Commission Rules</TabsTrigger>
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
