import { useState, useEffect } from "react";
import { AtsPageHeader } from "@/components/layouts/AtsPageHeader";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/tables/DataTable";
import { Plus, Download, ArrowRight, Building2, Mail, Phone, Globe } from "lucide-react";
import { salesService, Lead } from "@/lib/sales/salesService";
import { useToast } from "@/hooks/use-toast";
import { Column } from "@/components/tables/DataTable";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function OpportunitiesPage() {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [convertDialogOpen, setConvertDialogOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Forms State
  const [createForm, setCreateForm] = useState({
    companyName: "",
    email: "",
    phone: "",
    website: "",
    country: "United States",
  });

  const [convertForm, setConvertForm] = useState({
    adminFirstName: "",
    adminLastName: "",
    email: "", // Added email field for validation/correction
    domain: "", // Added domain field for company validation
    password: "",
    acceptTerms: false,
  });

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const response = await salesService.getLeads();
      if (response.success && response.data) {
        setLeads(response.data.leads || []);
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch leads", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleCreateLead = async () => {
    try {
      const response = await salesService.createLead(createForm);
      if (response.success) {
        toast({ title: "Success", description: "Lead created successfully" });
        setCreateDialogOpen(false);
        setCreateForm({ companyName: "", email: "", phone: "", website: "", country: "United States" });
        fetchLeads();
      } else {
        toast({ title: "Error", description: response.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to create lead", variant: "destructive" });
    }
  };

  const handleConvertLead = async () => {
    if (!selectedLead) return;
    try {
      const response = await salesService.convertLead(selectedLead.id, {
        ...convertForm,
        // Ensure we send the updated email/domain if the API supports it
        email: convertForm.email,
        domain: convertForm.domain
      });
      if (response.success) {
        toast({ title: "Success", description: "Lead converted to Company!" });
        setConvertDialogOpen(false);
        setConvertForm({ adminFirstName: "", adminLastName: "", email: "", domain: "", password: "", acceptTerms: false });
        fetchLeads();
      } else {
        toast({ title: "Error", description: response.error, variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Failed to convert lead", variant: "destructive" });
    }
  };

  const openConvertDialog = (lead: Lead) => {
    setSelectedLead(lead);
    // Pre-fill form with lead data, extracting domain from email or website
    const domainFromEmail = lead.email.split('@')[1];
    const domainFromWebsite = lead.website ? new URL(lead.website).hostname.replace('www.', '') : '';
    
    setConvertForm({
      adminFirstName: "",
      adminLastName: "",
      email: lead.email,
      domain: domainFromWebsite || domainFromEmail || "",
      password: "",
      acceptTerms: false,
    });
    setConvertDialogOpen(true);
  };

  const columns: Column<Lead>[] = [
    {
      key: "company_name",
      label: "Company",
      render: (lead) => (
        <div className="flex flex-col">
          <span className="font-medium">{lead.company_name}</span>
          {lead.website && (
            <a href={lead.website} target="_blank" rel="noreferrer" className="text-xs text-muted-foreground hover:underline flex items-center gap-1">
              <Globe className="h-3 w-3" /> {lead.website}
            </a>
          )}
        </div>
      ),
    },
    {
      key: "email",
      label: "Contact",
      render: (lead) => (
        <div className="flex flex-col text-sm">
          <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {lead.email}</span>
          {lead.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {lead.phone}</span>}
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (lead) => {
        const status = lead.status;
        return (
          <Badge variant={status === 'CONVERTED' ? 'success' : status === 'NEW' ? 'default' : 'secondary'}>
            {status}
          </Badge>
        );
      },
    },
    {
      key: "created_at",
      label: "Created",
      render: (lead) => new Date(lead.created_at).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Actions",
      render: (lead) => {
        if (lead.status === 'CONVERTED') return null;
        return (
          <Button size="sm" variant="outline" onClick={() => openConvertDialog(lead)}>
            Convert <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <AtsPageHeader title="Leads Management" subtitle="Track and convert your leads">
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Lead
        </Button>
      </AtsPageHeader>

      <div className="bg-card rounded-lg border shadow-sm p-1">
        <DataTable
          columns={columns}
          data={leads}
          searchable={true}
          searchColumn="company_name"
        />
      </div>

      {/* Create Lead Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
            <DialogDescription>Enter the company details to create a new lead.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input 
                value={createForm.companyName} 
                onChange={(e) => setCreateForm({...createForm, companyName: e.target.value})} 
                placeholder="Acme Inc."
              />
            </div>
            <div className="space-y-2">
              <Label>Email (Admin)</Label>
              <Input 
                value={createForm.email} 
                onChange={(e) => setCreateForm({...createForm, email: e.target.value})} 
                placeholder="admin@acme.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input 
                  value={createForm.phone} 
                  onChange={(e) => setCreateForm({...createForm, phone: e.target.value})} 
                  placeholder="+1..."
                />
              </div>
              <div className="space-y-2">
                <Label>Country</Label>
                <Input 
                  value={createForm.country} 
                  onChange={(e) => setCreateForm({...createForm, country: e.target.value})} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Website</Label>
              <Input 
                value={createForm.website} 
                onChange={(e) => setCreateForm({...createForm, website: e.target.value})} 
                placeholder="https://..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateLead}>Create Lead</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Convert Lead Dialog */}
      <Dialog open={convertDialogOpen} onOpenChange={setConvertDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convert Lead to Company</DialogTitle>
            <DialogDescription>
              Create a company account for <strong>{selectedLead?.company_name}</strong>.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Company Domain (Unique Identifier)</Label>
              <Input 
                value={convertForm.domain} 
                onChange={(e) => setConvertForm({...convertForm, domain: e.target.value})} 
                placeholder="acme.com"
              />
              <p className="text-xs text-muted-foreground">This will be used to create the company workspace.</p>
            </div>
            
            <div className="space-y-2">
              <Label>Admin Email</Label>
              <Input 
                value={convertForm.email} 
                onChange={(e) => setConvertForm({...convertForm, email: e.target.value})} 
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Admin First Name</Label>
                <Input 
                  value={convertForm.adminFirstName} 
                  onChange={(e) => setConvertForm({...convertForm, adminFirstName: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label>Admin Last Name</Label>
                <Input 
                  value={convertForm.adminLastName} 
                  onChange={(e) => setConvertForm({...convertForm, adminLastName: e.target.value})} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Temporary Password</Label>
              <Input 
                type="password"
                value={convertForm.password} 
                onChange={(e) => setConvertForm({...convertForm, password: e.target.value})} 
              />
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="terms" 
                checked={convertForm.acceptTerms}
                onCheckedChange={(c) => setConvertForm({...convertForm, acceptTerms: c as boolean})}
              />
              <Label htmlFor="terms" className="text-sm font-normal">
                I accept the terms and conditions on behalf of the company
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConvertDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleConvertLead} disabled={!convertForm.acceptTerms}>Convert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
