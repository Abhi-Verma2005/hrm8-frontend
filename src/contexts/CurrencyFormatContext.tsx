import React, { createContext, useContext, useState, useEffect } from 'react';

type CurrencyFormat = 'whole' | 'decimal';

interface CurrencyFormatContextType {
  currencyFormat: CurrencyFormat;
  setCurrencyFormat: (format: CurrencyFormat) => void;
  formatCurrency: (value: number, currency?: string) => string;
}

const CurrencyFormatContext = createContext<CurrencyFormatContextType | undefined>(undefined);

const CURRENCY_FORMAT_KEY = 'hrm8_currency_format';

export function CurrencyFormatProvider({ children }: { children: React.ReactNode }) {
  const [currencyFormat, setCurrencyFormatState] = useState<CurrencyFormat>(() => {
    const stored = localStorage.getItem(CURRENCY_FORMAT_KEY);
    return (stored as CurrencyFormat) || 'whole';
  });

  useEffect(() => {
    localStorage.setItem(CURRENCY_FORMAT_KEY, currencyFormat);
  }, [currencyFormat]);

  const setCurrencyFormat = (format: CurrencyFormat) => {
    setCurrencyFormatState(format);
  };

  const formatCurrency = (value: number, currency: string = 'USD'): string => {
    const options: Intl.NumberFormatOptions = {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currencyFormat === 'whole' ? 0 : 2,
      maximumFractionDigits: currencyFormat === 'whole' ? 0 : 2,
    };

    return new Intl.NumberFormat('en-US', options).format(value);
  };

  return (
    <CurrencyFormatContext.Provider value={{ currencyFormat, setCurrencyFormat, formatCurrency }}>
      {children}
    </CurrencyFormatContext.Provider>
  );
}

export function useCurrencyFormat() {
  const context = useContext(CurrencyFormatContext);
  if (context === undefined) {
    throw new Error('useCurrencyFormat must be used within a CurrencyFormatProvider');
  }
  return context;
}
