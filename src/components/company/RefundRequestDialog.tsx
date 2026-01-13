/**
 * RefundRequestDialog
 * Modal dialog for requesting refunds on transactions
 */

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { refundRequestService } from '../../lib/company/refundRequestService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface RefundRequestDialogProps {
    isOpen: boolean;
    onClose: () => void;
    transaction: {
        id: string;
        type: 'JOB_PAYMENT' | 'SUBSCRIPTION_BILL';
        amount: number;
        description: string;
    };
    onSuccess?: () => void;
}

export const RefundRequestDialog: React.FC<RefundRequestDialogProps> = ({
    isOpen,
    onClose,
    transaction,
    onSuccess,
}) => {
    const [amount, setAmount] = useState(transaction.amount.toString());
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (reason.trim().length < 20) {
            setError('Reason must be at least 20 characters');
            return;
        }

        const refundAmount = parseFloat(amount);
        if (isNaN(refundAmount) || refundAmount <= 0 || refundAmount > transaction.amount) {
            setError(`Refund amount must be between $0 and $${transaction.amount}`);
            return;
        }

        setLoading(true);

        try {
            const result = await refundRequestService.create({
                transactionId: transaction.id,
                transactionType: transaction.type,
                amount: refundAmount,
                reason: reason.trim(),
            });

            if (result.success) {
                onSuccess?.();
                onClose();
            } else {
                setError(result.error || 'Failed to submit refund request');
            }
        } catch (err: any) {
            setError(err.message || 'Failed to submit refund request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">Request Refund</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                <div className="mb-4 p-3 bg-gray-50 rounded">
                    <p className="text-sm text-gray-600">Transaction</p>
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-sm text-gray-600 mt-1">
                        Original Amount: ${transaction.amount.toFixed(2)}
                    </p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Refund Amount
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            max={transaction.amount}
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Maximum: ${transaction.amount.toFixed(2)}
                        </p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Reason for Refund *
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Please provide a detailed explanation for the refund request (minimum 20 characters)"
                            required
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {reason.length}/20 characters minimum
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-2 justify-end">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit Request'}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};
