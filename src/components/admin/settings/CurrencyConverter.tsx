import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight } from "lucide-react";

interface CurrencyConverterProps {
  currencies: any[];
}

export function CurrencyConverter({ currencies }: CurrencyConverterProps) {
  const activeCurrencies = currencies.filter(c => c.isActive);
  const [fromCurrency, setFromCurrency] = useState<string>(
    activeCurrencies.find(c => c.code === "USD")?.code || activeCurrencies[0]?.code || ""
  );
  const [toCurrency, setToCurrency] = useState<string>(
    activeCurrencies.find(c => c.code === "EUR")?.code || activeCurrencies[1]?.code || ""
  );
  const [amount, setAmount] = useState<string>("1");
  const [convertedAmount, setConvertedAmount] = useState<string>("0");

  useEffect(() => {
    calculateConversion();
  }, [amount, fromCurrency, toCurrency]);

  const calculateConversion = () => {
    if (!amount || isNaN(parseFloat(amount))) {
      setConvertedAmount("0");
      return;
    }

    const fromCurrencyData = activeCurrencies.find(c => c.code === fromCurrency);
    const toCurrencyData = activeCurrencies.find(c => c.code === toCurrency);

    if (!fromCurrencyData || !toCurrencyData) {
      setConvertedAmount("0");
      return;
    }

    // Convert from source currency to base currency (USD or default)
    // Then convert from base currency to target currency
    const baseAmount = parseFloat(amount) / fromCurrencyData.exchangeRate;
    const result = baseAmount * toCurrencyData.exchangeRate;
    
    const decimals = parseInt(toCurrencyData.decimalPlaces) || 2;
    setConvertedAmount(result.toFixed(decimals));
  };

  const handleSwapCurrencies = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  const handleAmountChange = (value: string) => {
    // Allow only numbers and decimal point
    const sanitized = value.replace(/[^0-9.]/g, '');
    // Ensure only one decimal point
    const parts = sanitized.split('.');
    const formatted = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : sanitized;
    setAmount(formatted);
  };

  const fromCurrencyData = activeCurrencies.find(c => c.code === fromCurrency);
  const toCurrencyData = activeCurrencies.find(c => c.code === toCurrency);

  if (activeCurrencies.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground text-center">
            No active currencies available. Please add and activate currencies first.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Currency Converter</CardTitle>
        <CardDescription>Convert between different currencies using live exchange rates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {/* From Currency */}
          <div className="space-y-2">
            <Label>From</Label>
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <div className="relative">
                <Input
                  type="text"
                  inputMode="decimal"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  placeholder="0.00"
                  className="text-lg font-semibold pr-12"
                />
                {fromCurrencyData && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {fromCurrencyData.symbol}
                  </span>
                )}
              </div>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {activeCurrencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {fromCurrencyData && (
              <p className="text-xs text-muted-foreground">
                {fromCurrencyData.name} • Rate: {fromCurrencyData.exchangeRate.toFixed(4)}
              </p>
            )}
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwapCurrencies}
              className="rounded-full"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </Button>
          </div>

          {/* To Currency */}
          <div className="space-y-2">
            <Label>To</Label>
            <div className="grid grid-cols-[1fr_auto] gap-2">
              <div className="relative">
                <Input
                  type="text"
                  value={convertedAmount}
                  readOnly
                  className="text-lg font-semibold bg-muted pr-12"
                />
                {toCurrencyData && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    {toCurrencyData.symbol}
                  </span>
                )}
              </div>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {activeCurrencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {toCurrencyData && (
              <p className="text-xs text-muted-foreground">
                {toCurrencyData.name} • Rate: {toCurrencyData.exchangeRate.toFixed(4)}
              </p>
            )}
          </div>
        </div>

        {/* Conversion Summary */}
        {fromCurrencyData && toCurrencyData && parseFloat(amount) > 0 && (
          <div className="p-4 bg-muted rounded-lg space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Exchange Rate</span>
              <span className="font-medium">
                1 {fromCurrencyData.code} = {(toCurrencyData.exchangeRate / fromCurrencyData.exchangeRate).toFixed(6)} {toCurrencyData.code}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Inverse Rate</span>
              <span className="font-medium">
                1 {toCurrencyData.code} = {(fromCurrencyData.exchangeRate / toCurrencyData.exchangeRate).toFixed(6)} {fromCurrencyData.code}
              </span>
            </div>
            <div className="pt-2 border-t">
              <p className="text-sm font-medium text-center">
                {amount} {fromCurrencyData.symbol} = {convertedAmount} {toCurrencyData.symbol}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
