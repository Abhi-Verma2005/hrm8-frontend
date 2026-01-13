/**
 * Change Role Dialog Component
 * Dialog for quickly changing a staff member's role
 */

import { useState, useEffect } from 'react';
import { StaffMember, staffService } from '@/lib/hrm8/staffService';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface ChangeRoleDialogProps {
    staff: StaffMember | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function ChangeRoleDialog({
    staff,
    open,
    onOpenChange,
    onSuccess,
}: ChangeRoleDialogProps) {
    const [loading, setLoading] = useState(false);
    const [selectedRole, setSelectedRole] = useState<'RECRUITER' | 'SALES_AGENT' | 'CONSULTANT_360'>('RECRUITER');

    useEffect(() => {
        if (staff) {
            setSelectedRole(staff.role);
        }
    }, [staff]);

    const handleChangeRole = async () => {
        if (!staff) return;

        if (selectedRole === staff.role) {
            toast.info('Role is already set to this value');
            return;
        }

        try {
            setLoading(true);
            const response = await staffService.update(staff.id, { role: selectedRole });

            if (response.success) {
                toast.success('Staff role updated successfully');
                onSuccess();
                onOpenChange(false);
            } else {
                toast.error(response.error || 'Failed to update staff role');
            }
        } catch (error) {
            toast.error('An error occurred while updating staff role');
        } finally {
            setLoading(false);
        }
    };

    if (!staff) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Change Staff Role</DialogTitle>
                    <DialogDescription>
                        Update the role for <strong>{staff.firstName} {staff.lastName}</strong>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="role">New Role</Label>
                        <Select value={selectedRole} onValueChange={(value) => setSelectedRole(value as any)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="RECRUITER">Recruiter</SelectItem>
                                <SelectItem value="SALES_AGENT">Sales Agent</SelectItem>
                                <SelectItem value="CONSULTANT_360">360 Consultant</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="text-sm text-muted-foreground">
                        Current role: <strong>{staff.role.replace('_', ' ')}</strong>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleChangeRole} disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Role
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
