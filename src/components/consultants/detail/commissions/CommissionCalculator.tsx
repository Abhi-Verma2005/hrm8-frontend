import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Calculator, Plus, X, Save, DollarSign, Users } from "lucide-react";
import { toast } from "sonner";
import { addCommission, updateCommission } from "@/lib/commissionStorage";
import type { Commission } from "@/types/commission";

interface CommissionCalculatorProps {
  consultantId: string;
  onSave?: () => void;
}

interface CommissionTier {
  id: string;
  from: number;
  to?: number;
  rate: number;
  flatBonus?: number;
}

interface ConsultantSplit {
  id: string;
  consultantId: string;
  consultantName: string;
  role: string;
  percentage: number;
}

export function CommissionCalculator({ consultantId, onSave }: CommissionCalculatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [transactionType, setTransactionType] = useState("recruitment");
  const [baseAmount, setBaseAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [structureType, setStructureType] = useState<"percentage" | "flat" | "tiered">("percentage");
  const [percentageRate, setPercentageRate] = useState("30");
  const [flatAmount, setFlatAmount] = useState("");
  const [tiers, setTiers] = useState<CommissionTier[]>([
    { id: "1", from: 0, to: 10000, rate: 20 },
    { id: "2", from: 10001, to: 25000, rate: 30 },
    { id: "3", from: 25001, rate: 40 },
  ]);
  const [useMultiSplit, setUseMultiSplit] = useState(false);
  const [splits, setSplits] = useState<ConsultantSplit[]>([
    { id: "1", consultantId: consultantId, consultantName: "Primary Consultant", role: "Sales", percentage: 100 },
  ]);

  const addTier = () => {
    const lastTier = tiers[tiers.length - 1];
    const newFrom = lastTier.to ? lastTier.to + 1 : 0;
    setTiers([
      ...tiers.slice(0, -1),
      { ...lastTier, to: newFrom - 1 },
      { id: Date.now().toString(), from: newFrom, rate: 30 },
    ]);
  };

  const removeTier = (id: string) => {
    if (tiers.length > 1) {
      setTiers(tiers.filter(t => t.id !== id));
    }
  };

  const updateTier = (id: string, field: keyof CommissionTier, value: any) => {
    setTiers(tiers.map(t => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const addSplit = () => {
    setSplits([
      ...splits,
      {
        id: Date.now().toString(),
        consultantId: "",
        consultantName: "",
        role: "",
        percentage: 0,
      },
    ]);
  };

  const removeSplit = (id: string) => {
    if (splits.length > 1) {
      setSplits(splits.filter(s => s.id !== id));
    }
  };

  const updateSplit = (id: string, field: keyof ConsultantSplit, value: any) => {
    setSplits(splits.map(s => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const calculateCommission = () => {
    const base = parseFloat(baseAmount) || 0;
    if (base <= 0) return { total: 0, breakdown: [] };

    let totalCommission = 0;

    if (structureType === "percentage") {
      totalCommission = base * (parseFloat(percentageRate) / 100);
    } else if (structureType === "flat") {
      totalCommission = parseFloat(flatAmount) || 0;
    } else if (structureType === "tiered") {
      let remaining = base;
      tiers.forEach((tier) => {
        if (remaining <= 0) return;
        const tierMax = tier.to || Infinity;
        const tierAmount = Math.min(remaining, tierMax - tier.from + 1);
        totalCommission += tierAmount * (tier.rate / 100);
        if (tier.flatBonus) {
          totalCommission += tier.flatBonus;
        }
        remaining -= tierAmount;
      });
    }

    const totalSplitPercentage = splits.reduce((sum, s) => sum + s.percentage, 0);
    const breakdown = useMultiSplit
      ? splits.map((s) => ({
          ...s,
          amount: (totalCommission * s.percentage) / 100,
        }))
      : [{ ...splits[0], amount: totalCommission }];

    return { total: totalCommission, breakdown, totalSplitPercentage };
  };

  const result = calculateCommission();

  const handleSave = () => {
    const base = parseFloat(baseAmount) || 0;
    if (base <= 0) {
      toast.error("Please enter a valid base amount");
      return;
    }

    if (useMultiSplit && result.totalSplitPercentage !== 100) {
      toast.error("Split percentages must total 100%");
      return;
    }

    try {
      const commission: Omit<Commission, 'id' | 'createdAt' | 'updatedAt'> = {
        consultantId: consultantId,
        consultantName: "Consultant",
        entityType: "other",
        entityName: transactionType,
        baseAmount: base,
        commissionRate: structureType === "percentage" ? parseFloat(percentageRate) : 0,
        commissionAmount: result.total,
        currency: currency,
        status: "pending",
        earnedDate: new Date().toISOString(),
        description: `${transactionType} commission`,
        notes: `Structure: ${structureType}`,
        splitWith: useMultiSplit ? splits.slice(1).map(s => s.consultantId).filter(Boolean) : undefined,
      };

      addCommission(commission);
      toast.success("Commission saved successfully");
      
      // Reset form
      setBaseAmount("");
      setStructureType("percentage");
      setPercentageRate("30");
      setUseMultiSplit(false);
      setSplits([{ id: "1", consultantId: consultantId, consultantName: "Primary Consultant", role: "Sales", percentage: 100 }]);
      
      onSave?.();
    } catch (error) {
      toast.error("Failed to save commission");
    }
  };

  if (!isExpanded) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Commission Calculator
            </CardTitle>
            <Button variant="outline" size="sm" onClick={() => setIsExpanded(true)}>
              Expand
            </Button>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Commission Calculator
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)}>
            Collapse
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Transaction Details */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="transaction-type">Transaction Type</Label>
            <Select value={transactionType} onValueChange={setTransactionType}>
              <SelectTrigger id="transaction-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recruitment">Recruitment Service</SelectItem>
                <SelectItem value="rpo">RPO Service</SelectItem>
                <SelectItem value="ats">ATS Subscription</SelectItem>
                <SelectItem value="consulting">Consulting</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="base-amount">Base Amount</Label>
            <div className="flex gap-2">
              <Input
                id="base-amount"
                type="number"
                placeholder="0.00"
                value={baseAmount}
                onChange={(e) => setBaseAmount(e.target.value)}
                min="0"
                step="0.01"
              />
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator />

        {/* Commission Structure */}
        <div className="space-y-4">
          <Label>Commission Structure</Label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="structure"
                checked={structureType === "percentage"}
                onChange={() => setStructureType("percentage")}
                className="accent-primary"
              />
              <span>Percentage</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="structure"
                checked={structureType === "flat"}
                onChange={() => setStructureType("flat")}
                className="accent-primary"
              />
              <span>Flat Amount</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="structure"
                checked={structureType === "tiered"}
                onChange={() => setStructureType("tiered")}
                className="accent-primary"
              />
              <span>Tiered</span>
            </label>
          </div>

          {/* Percentage Structure */}
          {structureType === "percentage" && (
            <div className="space-y-2">
              <Label htmlFor="percentage-rate">Commission Rate (%)</Label>
              <Input
                id="percentage-rate"
                type="number"
                value={percentageRate}
                onChange={(e) => setPercentageRate(e.target.value)}
                min="0"
                max="100"
                step="0.1"
              />
            </div>
          )}

          {/* Flat Amount Structure */}
          {structureType === "flat" && (
            <div className="space-y-2">
              <Label htmlFor="flat-amount">Flat Commission Amount</Label>
              <Input
                id="flat-amount"
                type="number"
                value={flatAmount}
                onChange={(e) => setFlatAmount(e.target.value)}
                min="0"
                step="0.01"
                placeholder="0.00"
              />
            </div>
          )}

          {/* Tiered Structure */}
          {structureType === "tiered" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Tier Configuration</Label>
                <Button type="button" variant="outline" size="sm" onClick={addTier}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Tier
                </Button>
              </div>
              <div className="space-y-2">
                {tiers.map((tier, index) => (
                  <div key={tier.id} className="flex items-center gap-2 p-3 border rounded-lg bg-muted/30">
                    <span className="text-sm font-medium w-16">Tier {index + 1}</span>
                    <Input
                      type="number"
                      placeholder="From"
                      value={tier.from}
                      onChange={(e) => updateTier(tier.id, "from", parseFloat(e.target.value) || 0)}
                      className="w-24"
                    />
                    <span className="text-sm">-</span>
                    <Input
                      type="number"
                      placeholder="To"
                      value={tier.to || ""}
                      onChange={(e) => updateTier(tier.id, "to", e.target.value ? parseFloat(e.target.value) : undefined)}
                      className="w-24"
                      disabled={index === tiers.length - 1}
                    />
                    <span className="text-sm">=</span>
                    <Input
                      type="number"
                      placeholder="Rate %"
                      value={tier.rate}
                      onChange={(e) => updateTier(tier.id, "rate", parseFloat(e.target.value) || 0)}
                      className="w-20"
                      min="0"
                      max="100"
                    />
                    <span className="text-sm">%</span>
                    {tiers.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTier(tier.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Multi-Consultant Split */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="multi-split">Multi-Consultant Split</Label>
              <p className="text-xs text-muted-foreground">
                Divide commission among multiple consultants
              </p>
            </div>
            <Switch
              id="multi-split"
              checked={useMultiSplit}
              onCheckedChange={setUseMultiSplit}
            />
          </div>

          {useMultiSplit && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Consultant Splits
                </Label>
                <Button type="button" variant="outline" size="sm" onClick={addSplit}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Consultant
                </Button>
              </div>
              <div className="space-y-2">
                {splits.map((split) => (
                  <div key={split.id} className="flex items-start gap-2 p-3 border rounded-lg bg-muted/30">
                    <div className="flex-1 grid gap-2 sm:grid-cols-3">
                      <Input
                        placeholder="Consultant Name"
                        value={split.consultantName}
                        onChange={(e) => updateSplit(split.id, "consultantName", e.target.value)}
                      />
                      <Input
                        placeholder="Role"
                        value={split.role}
                        onChange={(e) => updateSplit(split.id, "role", e.target.value)}
                      />
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="% Split"
                          value={split.percentage}
                          onChange={(e) => updateSplit(split.id, "percentage", parseFloat(e.target.value) || 0)}
                          min="0"
                          max="100"
                        />
                        <span className="text-sm">%</span>
                      </div>
                    </div>
                    {splits.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSplit(split.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              {result.totalSplitPercentage !== 100 && (
                <p className="text-sm text-destructive">
                  Total split: {result.totalSplitPercentage}% (must equal 100%)
                </p>
              )}
            </div>
          )}
        </div>

        <Separator />

        {/* Calculation Results */}
        <div className="space-y-4 p-4 border rounded-lg bg-primary/5">
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Calculation Results</h3>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Base Amount:</span>
              <span className="font-medium">
                {currency} {parseFloat(baseAmount || "0").toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Commission (Total):</span>
              <span className="text-primary">
                {currency} {result.total.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                {structureType === "percentage" && ` (${percentageRate}%)`}
              </span>
            </div>
          </div>

          {useMultiSplit && result.breakdown.length > 1 && (
            <div className="pt-3 border-t space-y-2">
              <p className="text-sm font-semibold">Split Breakdown:</p>
              {result.breakdown.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{item.role}</Badge>
                    <span>{item.consultantName}</span>
                  </div>
                  <span className="font-medium">
                    {currency} {item.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} ({item.percentage}%)
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={handleSave} className="flex-1">
            <Save className="h-4 w-4 mr-2" />
            Save Commission
          </Button>
          <Button variant="outline" onClick={() => {
            setBaseAmount("");
            setPercentageRate("30");
            setFlatAmount("");
            setUseMultiSplit(false);
          }}>
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
