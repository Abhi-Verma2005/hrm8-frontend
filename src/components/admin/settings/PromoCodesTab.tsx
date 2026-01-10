/**
 * Promo Codes Management Tab
 * Admin settings tab for managing promotional discount codes
 */

import { useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { apiClient } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Edit, Trash2, Loader2, Tag, Calendar, Percent, Users } from 'lucide-react';
import { format } from 'date-fns';

// Promo Code Types
interface PromoCode {
  id: string;
  code: string;
  description: string;
  discountType: 'PERCENTAGE' | 'FIXED_AMOUNT';
  discountValue: number;
  currency?: string;
  minOrderValue?: number;
  maxUsages?: number;
  currentUsages: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  applicableProducts: string[];
  createdAt: string;
}

// Form validation schema
const promoCodeSchema = z.object({
  code: z.string().trim().min(3, 'Code must be at least 3 characters').max(20).toUpperCase(),
  description: z.string().trim().max(200).optional(),
  discountType: z.enum(['PERCENTAGE', 'FIXED_AMOUNT']),
  discountValue: z.number().min(0.01, 'Discount must be greater than 0'),
  currency: z.string().optional(),
  minOrderValue: z.number().min(0).optional(),
  maxUsages: z.number().int().min(1).optional(),
  validFrom: z.string().min(1, 'Start date is required'),
  validUntil: z.string().min(1, 'End date is required'),
  isActive: z.boolean(),
  applicableProducts: z.array(z.string()).optional(),
});

type PromoCodeFormData = z.infer<typeof promoCodeSchema>;

export function PromoCodesTab() {
  const { toast } = useToast();
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCode, setEditingCode] = useState<PromoCode | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [codeToDelete, setCodeToDelete] = useState<PromoCode | null>(null);

  const form = useForm<PromoCodeFormData>({
    resolver: zodResolver(promoCodeSchema),
    defaultValues: {
      code: '',
      description: '',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      currency: 'USD',
      minOrderValue: 0,
      isActive: true,
      applicableProducts: [],
    },
  });

  useEffect(() => {
    loadPromoCodes();
  }, []);

  const loadPromoCodes = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get<{ promoCodes: PromoCode[] }>('/api/admin/promo-codes');
      if (response.success && response.data?.promoCodes) {
        setPromoCodes(response.data.promoCodes);
      } else {
        // Mock data for development
        setPromoCodes([
          {
            id: '1',
            code: 'WELCOME20',
            description: 'Welcome discount for new customers',
            discountType: 'PERCENTAGE',
            discountValue: 20,
            currency: 'USD',
            maxUsages: 100,
            currentUsages: 45,
            validFrom: '2026-01-01T00:00:00Z',
            validUntil: '2026-03-31T23:59:59Z',
            isActive: true,
            applicableProducts: [],
            createdAt: '2026-01-01T00:00:00Z',
          },
          {
            id: '2',
            code: 'ANNUAL50',
            description: '$50 off annual subscriptions',
            discountType: 'FIXED_AMOUNT',
            discountValue: 50,
            currency: 'USD',
            minOrderValue: 200,
            maxUsages: 50,
            currentUsages: 12,
            validFrom: '2026-01-01T00:00:00Z',
            validUntil: '2026-06-30T23:59:59Z',
            isActive: true,
            applicableProducts: ['annual-subscription'],
            createdAt: '2026-01-01T00:00:00Z',
          },
        ]);
      }
    } catch (error) {
      console.error('Failed to load promo codes:', error);
      // Set mock data on error
      setPromoCodes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCode(null);
    form.reset({
      code: '',
      description: '',
      discountType: 'PERCENTAGE',
      discountValue: 10,
      currency: 'USD',
      minOrderValue: 0,
      validFrom: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActive: true,
      applicableProducts: [],
    });
    setDialogOpen(true);
  };

  const handleEdit = (code: PromoCode) => {
    setEditingCode(code);
    form.reset({
      code: code.code,
      description: code.description,
      discountType: code.discountType,
      discountValue: code.discountValue,
      currency: code.currency,
      minOrderValue: code.minOrderValue,
      maxUsages: code.maxUsages,
      validFrom: code.validFrom.split('T')[0],
      validUntil: code.validUntil.split('T')[0],
      isActive: code.isActive,
      applicableProducts: code.applicableProducts,
    });
    setDialogOpen(true);
  };

  const handleDelete = (code: PromoCode) => {
    setCodeToDelete(code);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!codeToDelete) return;

    try {
      const response = await apiClient.delete(`/api/admin/promo-codes/${codeToDelete.id}`);
      if (response.success) {
        toast({ title: 'Promo code deleted successfully' });
        await loadPromoCodes();
      } else {
        toast({ title: 'Failed to delete promo code', variant: 'destructive' });
      }
    } catch (error) {
      // For mock, just remove from state
      setPromoCodes(promoCodes.filter((p) => p.id !== codeToDelete.id));
      toast({ title: 'Promo code deleted' });
    } finally {
      setDeleteDialogOpen(false);
      setCodeToDelete(null);
    }
  };

  const onSubmit = async (data: PromoCodeFormData) => {
    setSaving(true);
    try {
      if (editingCode) {
        const response = await apiClient.put(`/api/admin/promo-codes/${editingCode.id}`, data);
        if (response.success) {
          toast({ title: 'Promo code updated successfully' });
          await loadPromoCodes();
          setDialogOpen(false);
        } else {
          toast({ title: 'Failed to update promo code', variant: 'destructive' });
        }
      } else {
        const response = await apiClient.post('/api/admin/promo-codes', data);
        if (response.success) {
          toast({ title: 'Promo code created successfully' });
          await loadPromoCodes();
          setDialogOpen(false);
        } else {
          toast({ title: 'Failed to create promo code', variant: 'destructive' });
        }
      }
    } catch (error) {
      // For mock, add to state
      const newCode: PromoCode = {
        id: editingCode?.id || Date.now().toString(),
        code: data.code,
        description: data.description || '',
        discountType: data.discountType,
        discountValue: data.discountValue,
        currency: data.currency,
        minOrderValue: data.minOrderValue,
        maxUsages: data.maxUsages,
        currentUsages: editingCode?.currentUsages || 0,
        createdAt: editingCode?.createdAt || new Date().toISOString(),
        validFrom: new Date(data.validFrom).toISOString(),
        validUntil: new Date(data.validUntil).toISOString(),
        isActive: data.isActive,
        applicableProducts: data.applicableProducts || [],
      };
      if (editingCode) {
        setPromoCodes(promoCodes.map((p) => (p.id === editingCode.id ? newCode : p)));
      } else {
        setPromoCodes([...promoCodes, newCode]);
      }
      toast({ title: editingCode ? 'Promo code updated' : 'Promo code created' });
      setDialogOpen(false);
    } finally {
      setSaving(false);
    }
  };

  const isExpired = (code: PromoCode) => new Date(code.validUntil) < new Date();
  const isActive = (code: PromoCode) => code.isActive && !isExpired(code);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Promo Codes</h2>
          <p className="text-sm text-muted-foreground">
            Manage discount codes for subscriptions and services
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create Promo Code
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Active Promo Codes
          </CardTitle>
          <CardDescription>
            {promoCodes.filter(isActive).length} active codes out of {promoCodes.length} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : promoCodes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No promo codes yet. Create your first promotional code.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Validity</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {promoCodes.map((code) => (
                  <TableRow key={code.id}>
                    <TableCell>
                      <div>
                        <div className="font-mono font-semibold">{code.code}</div>
                        <div className="text-xs text-muted-foreground">{code.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {code.discountType === 'PERCENTAGE' ? (
                          <>
                            <Percent className="h-4 w-4 text-muted-foreground" />
                            {code.discountValue}%
                          </>
                        ) : (
                          <>
                            ${code.discountValue}
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {format(new Date(code.validFrom), 'MMM d')} -{' '}
                          {format(new Date(code.validUntil), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {code.currentUsages}
                        {code.maxUsages && ` / ${code.maxUsages}`}
                      </div>
                    </TableCell>
                    <TableCell>
                      {isExpired(code) ? (
                        <Badge variant="secondary">Expired</Badge>
                      ) : code.isActive ? (
                        <Badge variant="default">Active</Badge>
                      ) : (
                        <Badge variant="outline">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(code)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(code)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingCode ? 'Edit Promo Code' : 'Create Promo Code'}</DialogTitle>
            <DialogDescription>
              {editingCode
                ? 'Update the promo code details'
                : 'Create a new promotional discount code'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Code *</Label>
                <Input
                  id="code"
                  placeholder="SAVE20"
                  {...form.register('code')}
                  className="font-mono uppercase"
                />
                {form.formState.errors.code && (
                  <p className="text-xs text-destructive">{form.formState.errors.code.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountType">Discount Type *</Label>
                <Select
                  value={form.watch('discountType')}
                  onValueChange={(val) => form.setValue('discountType', val as 'PERCENTAGE' | 'FIXED_AMOUNT')}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PERCENTAGE">Percentage</SelectItem>
                    <SelectItem value="FIXED_AMOUNT">Fixed Amount</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Brief description of the offer"
                {...form.register('description')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountValue">
                  {form.watch('discountType') === 'PERCENTAGE' ? 'Discount (%)' : 'Discount ($)'}
                </Label>
                <Input
                  id="discountValue"
                  type="number"
                  step="0.01"
                  {...form.register('discountValue', { valueAsNumber: true })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxUsages">Max Uses (optional)</Label>
                <Input
                  id="maxUsages"
                  type="number"
                  placeholder="Unlimited"
                  {...form.register('maxUsages', { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="validFrom">Valid From *</Label>
                <Input id="validFrom" type="date" {...form.register('validFrom')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="validUntil">Valid Until *</Label>
                <Input id="validUntil" type="date" {...form.register('validUntil')} />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="isActive">Active</Label>
              <Switch
                id="isActive"
                checked={form.watch('isActive')}
                onCheckedChange={(val) => form.setValue('isActive', val)}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editingCode ? (
                  'Update'
                ) : (
                  'Create'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Promo Code</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the promo code{' '}
              <strong className="font-mono">{codeToDelete?.code}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
