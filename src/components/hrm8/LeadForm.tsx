/**
 * Lead Form Component
 * Form for creating new leads with all required fields per spec
 */

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { regionService, Region } from '@/lib/hrm8/regionService';

const leadFormSchema = z.object({
    companyName: z.string().min(1, 'Company name is required'),
    industry: z.string().optional(),
    companySize: z.string().optional(),
    website: z.string().url().optional().or(z.literal('')),
    phone: z.string().optional(),
    email: z.string().email('Valid email is required'),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    city: z.string().optional(),
    stateProvince: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().min(1, 'Country is required'),
    leadSource: z.string().optional(),
    leadSourceDetail: z.string().optional(),
    referredBy: z.string().optional(),
    notes: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

interface LeadFormProps {
    onSubmit: (data: LeadFormData & { regionId?: string }) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const COMPANY_SIZES = [
    { value: '1-10', label: '1-10 employees' },
    { value: '11-50', label: '11-50 employees' },
    { value: '51-200', label: '51-200 employees' },
    { value: '201-500', label: '201-500 employees' },
    { value: '501-1000', label: '501-1000 employees' },
    { value: '1000+', label: '1000+ employees' },
];

const LEAD_SOURCES = [
    { value: 'MANUAL_ENTRY', label: 'Manual Entry' },
    { value: 'WEBSITE', label: 'Website' },
    { value: 'MARKETING_CAMPAIGN', label: 'Marketing Campaign' },
    { value: 'REFERRAL', label: 'Referral' },
    { value: 'PARTNER_IMPORT', label: 'Partner Import' },
];

export function LeadForm({ onSubmit, onCancel, isLoading = false }: LeadFormProps) {
    const [regions, setRegions] = useState<Region[]>([]);
    const [detectedRegion, setDetectedRegion] = useState<Region | null>(null);
    const [showReferredBy, setShowReferredBy] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
    } = useForm<LeadFormData>({
        resolver: zodResolver(leadFormSchema),
        defaultValues: {
            leadSource: 'MANUAL_ENTRY',
        },
    });

    const country = watch('country');
    const leadSource = watch('leadSource');

    // Load regions on mount
    useEffect(() => {
        loadRegions();
    }, []);

    // Auto-detect region based on country
    useEffect(() => {
        if (country && regions.length > 0) {
            const matchedRegion = regions.find((r) => {
                return r.country.toLowerCase() === country.toLowerCase();
            });
            setDetectedRegion(matchedRegion || null);
        } else {
            setDetectedRegion(null);
        }
    }, [country, regions]);

    // Show "Referred By" field when lead source is REFERRAL
    useEffect(() => {
        setShowReferredBy(leadSource === 'REFERRAL');
    }, [leadSource]);

    const loadRegions = async () => {
        try {
            const response = await regionService.getAll();
            if (response.success && response.data?.regions) {
                setRegions(response.data.regions);
            }
        } catch (error) {
            console.error('Failed to load regions:', error);
        }
    };

    const handleFormSubmit = async (data: LeadFormData) => {
        await onSubmit({
            ...data,
            regionId: detectedRegion?.id,
        });
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Company Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Company Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2">
                            <Label htmlFor="companyName">
                                Company Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="companyName"
                                {...register('companyName')}
                                disabled={isLoading}
                            />
                            {errors.companyName && (
                                <p className="text-sm text-destructive mt-1">{errors.companyName.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="industry">Industry</Label>
                            <Input id="industry" {...register('industry')} disabled={isLoading} />
                        </div>

                        <div>
                            <Label htmlFor="companySize">Company Size</Label>
                            <Select
                                onValueChange={(value) => setValue('companySize', value)}
                                disabled={isLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select size" />
                                </SelectTrigger>
                                <SelectContent>
                                    {COMPANY_SIZES.map((size) => (
                                        <SelectItem key={size.value} value={size.value}>
                                            {size.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
                <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="email">
                                Email <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                {...register('email')}
                                disabled={isLoading}
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" {...register('phone')} disabled={isLoading} />
                        </div>

                        <div className="col-span-2">
                            <Label htmlFor="website">Website URL</Label>
                            <Input id="website" type="url" {...register('website')} disabled={isLoading} />
                            {errors.website && (
                                <p className="text-sm text-destructive mt-1">{errors.website.message}</p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Address */}
            <Card>
                <CardHeader>
                    <CardTitle>Address</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="addressLine1">Street Address</Label>
                            <Input id="addressLine1" {...register('addressLine1')} disabled={isLoading} />
                        </div>

                        <div>
                            <Label htmlFor="addressLine2">Address Line 2</Label>
                            <Input id="addressLine2" {...register('addressLine2')} disabled={isLoading} />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="city">City</Label>
                                <Input id="city" {...register('city')} disabled={isLoading} />
                            </div>

                            <div>
                                <Label htmlFor="stateProvince">State/Province</Label>
                                <Input id="stateProvince" {...register('stateProvince')} disabled={isLoading} />
                            </div>

                            <div>
                                <Label htmlFor="postalCode">Postal Code</Label>
                                <Input id="postalCode" {...register('postalCode')} disabled={isLoading} />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="country">
                                Country <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="country"
                                placeholder="e.g., US, UK, IN"
                                {...register('country')}
                                disabled={isLoading}
                            />
                            {errors.country && (
                                <p className="text-sm text-destructive mt-1">{errors.country.message}</p>
                            )}
                            {detectedRegion && (
                                <p className="text-sm text-muted-foreground mt-1">
                                    Region: <span className="font-medium">{detectedRegion.name}</span> (auto-detected)
                                </p>
                            )}
                            {country && !detectedRegion && (
                                <p className="text-sm text-orange-600 mt-1">
                                    ⚠️ No region found for this country. Using default region.
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Lead Source & Attribution */}
            <Card>
                <CardHeader>
                    <CardTitle>Lead Source & Attribution</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="leadSource">Lead Source</Label>
                            <Select
                                onValueChange={(value) => setValue('leadSource', value)}
                                defaultValue="MANUAL_ENTRY"
                                disabled={isLoading}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {LEAD_SOURCES.map((source) => (
                                        <SelectItem key={source.value} value={source.value}>
                                            {source.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div>
                            <Label htmlFor="leadSourceDetail">Lead Source Details</Label>
                            <Input
                                id="leadSourceDetail"
                                placeholder="Campaign name, partner, etc."
                                {...register('leadSourceDetail')}
                                disabled={isLoading}
                            />
                        </div>

                        {showReferredBy && (
                            <div className="col-span-2">
                                <Label htmlFor="referredBy">Referred By (Sales Agent ID)</Label>
                                <Input
                                    id="referredBy"
                                    placeholder="Agent ID who referred this lead"
                                    {...register('referredBy')}
                                    disabled={isLoading}
                                />
                                <p className="text-sm text-muted-foreground mt-1">
                                    Optional: Enter sales agent ID for referral attribution
                                </p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Notes */}
            <Card>
                <CardHeader>
                    <CardTitle>Additional Notes</CardTitle>
                </CardHeader>
                <CardContent>
                    <Textarea
                        {...register('notes')}
                        placeholder="Any additional information about this lead..."
                        rows={4}
                        disabled={isLoading}
                    />
                </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading ? 'Creating Lead...' : 'Create Lead'}
                </Button>
            </div>
        </form>
    );
}
