/**
 * Lead Create Page
 * Page for creating new leads via form
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Hrm8PageLayout } from '@/components/layouts/Hrm8PageLayout';
import { LeadForm } from '@/components/hrm8/LeadForm';
import { leadService } from '@/lib/hrm8/leadService';
import { toast } from 'sonner';

export default function LeadCreatePage() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (data: any) => {
        try {
            setIsLoading(true);
            const response = await leadService.create(data);

            if (response.success && response.data) {
                toast.success('Lead created successfully');
                // Redirect to lead detail page
                navigate(`/hrm8/leads/${response.data.id}`);
            } else {
                toast.error(response.error || 'Failed to create lead');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to create lead');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/hrm8/leads');
    };

    return (
        <Hrm8PageLayout
            title="Create New Lead"
            subtitle="Capture a new employer lead for sales pipeline"
        >
            <div className="p-6">
                <LeadForm
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    isLoading={isLoading}
                />
            </div>
        </Hrm8PageLayout>
    );
}
