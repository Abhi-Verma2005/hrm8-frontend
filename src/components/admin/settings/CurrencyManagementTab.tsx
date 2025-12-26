import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Banknote, RefreshCw, TrendingUp, DollarSign } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { CurrencyConverter } from "./CurrencyConverter";

const currencySchema = z.object({
  code: z.string().trim().length(3, "Currency code must be 3 characters").toUpperCase(),
  name: z.string().trim().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  symbol: z.string().trim().min(1, "Symbol is required").max(5, "Symbol must be less than 5 characters"),
  decimalPlaces: z.string().regex(/^[0-4]$/, "Must be between 0-4"),
  isActive: z.boolean(),
  isDefault: z.boolean(),
});

type CurrencyFormData = z.infer<typeof currencySchema>;

interface Currency extends CurrencyFormData {
  id: string;
  exchangeRate: number;
  lastUpdated: string;
}

const exchangeRateSchema = z.object({
  baseCurrency: z.string().min(3, "Base currency required"),
  targetCurrency: z.string().min(3, "Target currency required"),
  rate: z.string().regex(/^\d+(\.\d{1,6})?$/, "Invalid rate format").refine((val) => parseFloat(val) > 0, "Rate must be positive"),
  isManual: z.boolean(),
});

type ExchangeRateFormData = z.infer<typeof exchangeRateSchema>;

interface ExchangeRate extends ExchangeRateFormData {
  id: string;
  lastUpdated: string;
}

const mockCurrencies: Currency[] = [
  {
    id: "1",
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    decimalPlaces: "2",
    exchangeRate: 1.0,
    isActive: true,
    isDefault: true,
    lastUpdated: "2024-11-09",
  },
  {
    id: "2",
    code: "EUR",
    name: "Euro",
    symbol: "€",
    decimalPlaces: "2",
    exchangeRate: 0.92,
    isActive: true,
    isDefault: false,
    lastUpdated: "2024-11-09",
  },
  {
    id: "3",
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    decimalPlaces: "2",
    exchangeRate: 0.79,
    isActive: true,
    isDefault: false,
    lastUpdated: "2024-11-09",
  },
  {
    id: "4",
    code: "JPY",
    name: "Japanese Yen",
    symbol: "¥",
    decimalPlaces: "0",
    exchangeRate: 149.50,
    isActive: true,
    isDefault: false,
    lastUpdated: "2024-11-09",
  },
];

const mockExchangeRates: ExchangeRate[] = [
  {
    id: "1",
    baseCurrency: "USD",
    targetCurrency: "EUR",
    rate: "0.92",
    isManual: false,
    lastUpdated: "2024-11-09 10:30:00",
  },
  {
    id: "2",
    baseCurrency: "USD",
    targetCurrency: "GBP",
    rate: "0.79",
    isManual: false,
    lastUpdated: "2024-11-09 10:30:00",
  },
  {
    id: "3",
    baseCurrency: "USD",
    targetCurrency: "JPY",
    rate: "149.50",
    isManual: false,
    lastUpdated: "2024-11-09 10:30:00",
  },
];

export function CurrencyManagementTab() {
  const [currencies, setCurrencies] = useState<Currency[]>(mockCurrencies);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>(mockExchangeRates);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);
  const [editingRate, setEditingRate] = useState<ExchangeRate | null>(null);
  const [currencyDialogOpen, setCurrencyDialogOpen] = useState(false);
  const [rateDialogOpen, setRateDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const currencyForm = useForm<CurrencyFormData>({
    resolver: zodResolver(currencySchema),
    defaultValues: {
      code: "",
      name: "",
      symbol: "",
      decimalPlaces: "2",
      isActive: true,
      isDefault: false,
    },
  });

  const rateForm = useForm<ExchangeRateFormData>({
    resolver: zodResolver(exchangeRateSchema),
    defaultValues: {
      baseCurrency: "USD",
      targetCurrency: "",
      rate: "1.0",
      isManual: true,
    },
  });

  const fetchExchangeRates = async () => {
    setIsUpdating(true);
    try {
      // Using frankfurter.app - a free, open-source currency exchange rate API
      const baseCurrency = currencies.find(c => c.isDefault)?.code || "USD";
      const response = await fetch(`https://api.frankfurter.app/latest?from=${baseCurrency}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch exchange rates");
      }

      const data = await response.json();
      const rates = data.rates;

      // Update currencies with new rates
      const updatedCurrencies = currencies.map(currency => {
        if (currency.code === baseCurrency) {
          return { ...currency, exchangeRate: 1.0, lastUpdated: new Date().toISOString().split('T')[0] };
        }
        const newRate = rates[currency.code];
        if (newRate) {
          return { ...currency, exchangeRate: newRate, lastUpdated: new Date().toISOString().split('T')[0] };
        }
        return currency;
      });

      setCurrencies(updatedCurrencies);

      // Update exchange rates
      const updatedRates = exchangeRates.map(rate => {
        if (rate.isManual) return rate;
        
        const newRate = rates[rate.targetCurrency];
        if (newRate) {
          return {
            ...rate,
            rate: newRate.toString(),
            lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 19),
          };
        }
        return rate;
      });

      setExchangeRates(updatedRates);

      toast({
        title: "Exchange Rates Updated",
        description: `Successfully updated ${Object.keys(rates).length} exchange rates.`,
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not fetch latest exchange rates. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const onSubmitCurrency = (data: CurrencyFormData) => {
    if (editingCurrency) {
      setCurrencies(currencies.map(c => 
        c.id === editingCurrency.id 
          ? { ...data, id: editingCurrency.id, exchangeRate: editingCurrency.exchangeRate, lastUpdated: editingCurrency.lastUpdated } 
          : c
      ));
      toast({
        title: "Currency Updated",
        description: `${data.name} has been updated successfully.`,
      });
    } else {
      const newCurrency: Currency = {
        ...data,
        id: Date.now().toString(),
        exchangeRate: 1.0,
        lastUpdated: new Date().toISOString().split('T')[0],
      };
      setCurrencies([...currencies, newCurrency]);
      toast({
        title: "Currency Added",
        description: `${data.name} has been added successfully.`,
      });
    }
    setCurrencyDialogOpen(false);
    setEditingCurrency(null);
    currencyForm.reset();
  };

  const onSubmitRate = (data: ExchangeRateFormData) => {
    if (editingRate) {
      setExchangeRates(exchangeRates.map(r => 
        r.id === editingRate.id 
          ? { ...data, id: editingRate.id, lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 19) } 
          : r
      ));
      toast({
        title: "Rate Updated",
        description: "Exchange rate has been updated successfully.",
      });
    } else {
      const newRate: ExchangeRate = {
        ...data,
        id: Date.now().toString(),
        lastUpdated: new Date().toISOString().replace('T', ' ').substring(0, 19),
      };
      setExchangeRates([...exchangeRates, newRate]);
      toast({
        title: "Rate Added",
        description: "Exchange rate has been added successfully.",
      });
    }
    setRateDialogOpen(false);
    setEditingRate(null);
    rateForm.reset();
  };

  const handleEditCurrency = (currency: Currency) => {
    setEditingCurrency(currency);
    currencyForm.reset(currency);
    setCurrencyDialogOpen(true);
  };

  const handleEditRate = (rate: ExchangeRate) => {
    setEditingRate(rate);
    rateForm.reset(rate);
    setRateDialogOpen(true);
  };

  const handleDeleteCurrency = (id: string) => {
    const currency = currencies.find(c => c.id === id);
    setCurrencies(currencies.filter(c => c.id !== id));
    toast({
      title: "Currency Deleted",
      description: `${currency?.name} has been deleted successfully.`,
      variant: "destructive",
    });
  };

  const handleDeleteRate = (id: string) => {
    setExchangeRates(exchangeRates.filter(r => r.id !== id));
    toast({
      title: "Rate Deleted",
      description: "Exchange rate has been deleted successfully.",
      variant: "destructive",
    });
  };

  return (
    <Tabs defaultValue="currencies" className="space-y-4">
      <TabsList>
        <TabsTrigger value="currencies">Currencies</TabsTrigger>
        <TabsTrigger value="rates">Exchange Rates</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>

      <TabsContent value="currencies" className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Banknote className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Supported Currencies</CardTitle>
                  <CardDescription>Manage currencies accepted in your system</CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={fetchExchangeRates}
                  disabled={isUpdating}
                >
                  <RefreshCw className={`h-4 w-4 mr-2 ${isUpdating ? 'animate-spin' : ''}`} />
                  Update Rates
                </Button>
                <Dialog open={currencyDialogOpen} onOpenChange={(open) => {
                  setCurrencyDialogOpen(open);
                  if (!open) {
                    setEditingCurrency(null);
                    currencyForm.reset();
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Currency
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-xl">
                    <DialogHeader>
                      <DialogTitle>{editingCurrency ? "Edit Currency" : "Add Currency"}</DialogTitle>
                      <DialogDescription>
                        {editingCurrency ? "Update currency details below." : "Add a new currency to the system."}
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...currencyForm}>
                      <form onSubmit={currencyForm.handleSubmit(onSubmitCurrency)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={currencyForm.control}
                            name="code"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Currency Code</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="USD" 
                                    maxLength={3} 
                                    {...field} 
                                    onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                  />
                                </FormControl>
                                <FormDescription>ISO 4217 code</FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={currencyForm.control}
                            name="symbol"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Symbol</FormLabel>
                                <FormControl>
                                  <Input placeholder="$" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={currencyForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Currency Name</FormLabel>
                              <FormControl>
                                <Input placeholder="US Dollar" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={currencyForm.control}
                          name="decimalPlaces"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Decimal Places</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="0">0 (e.g., JPY)</SelectItem>
                                  <SelectItem value="2">2 (e.g., USD)</SelectItem>
                                  <SelectItem value="3">3</SelectItem>
                                  <SelectItem value="4">4</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="flex gap-6">
                          <FormField
                            control={currencyForm.control}
                            name="isActive"
                            render={({ field }) => (
                              <FormItem className="flex items-center gap-2 space-y-0">
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel className="!mt-0">Active</FormLabel>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={currencyForm.control}
                            name="isDefault"
                            render={({ field }) => (
                              <FormItem className="flex items-center gap-2 space-y-0">
                                <FormControl>
                                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <FormLabel className="!mt-0">Default Currency</FormLabel>
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                          <Button type="button" variant="outline" onClick={() => setCurrencyDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit">
                            {editingCurrency ? "Update" : "Add"} Currency
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Exchange Rate</TableHead>
                  <TableHead>Decimals</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currencies.map((currency) => (
                  <TableRow key={currency.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold">{currency.code}</span>
                        {currency.isDefault && (
                          <Badge variant="default" className="text-xs">Default</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{currency.name}</TableCell>
                    <TableCell className="text-xl">{currency.symbol}</TableCell>
                    <TableCell>
                      <span className="font-semibold">{currency.exchangeRate.toFixed(4)}</span>
                    </TableCell>
                    <TableCell>{currency.decimalPlaces}</TableCell>
                    <TableCell>
                      <Badge variant={currency.isActive ? "default" : "secondary"}>
                        {currency.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{currency.lastUpdated}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditCurrency(currency)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        {!currency.isDefault && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Currency</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {currency.name}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteCurrency(currency.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="rates" className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Exchange Rates</CardTitle>
                  <CardDescription>Manage currency conversion rates</CardDescription>
                </div>
              </div>
              <Dialog open={rateDialogOpen} onOpenChange={(open) => {
                setRateDialogOpen(open);
                if (!open) {
                  setEditingRate(null);
                  rateForm.reset();
                }
              }}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Rate
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-xl">
                  <DialogHeader>
                    <DialogTitle>{editingRate ? "Edit Exchange Rate" : "Add Exchange Rate"}</DialogTitle>
                    <DialogDescription>
                      {editingRate ? "Update exchange rate details." : "Add a manual exchange rate."}
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...rateForm}>
                    <form onSubmit={rateForm.handleSubmit(onSubmitRate)} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={rateForm.control}
                          name="baseCurrency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Base Currency</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {currencies.map(c => (
                                    <SelectItem key={c.id} value={c.code}>{c.code} - {c.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={rateForm.control}
                          name="targetCurrency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Target Currency</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select currency" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {currencies.map(c => (
                                    <SelectItem key={c.id} value={c.code}>{c.code} - {c.name}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={rateForm.control}
                        name="rate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Exchange Rate</FormLabel>
                            <FormControl>
                              <Input type="text" placeholder="1.25" {...field} />
                            </FormControl>
                            <FormDescription>How many target currency units per base currency unit</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={rateForm.control}
                        name="isManual"
                        render={({ field }) => (
                          <FormItem className="flex items-center gap-2 space-y-0">
                            <FormControl>
                              <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div>
                              <FormLabel className="!mt-0">Manual Override</FormLabel>
                              <FormDescription className="text-xs">
                                Prevent automatic updates for this rate
                              </FormDescription>
                            </div>
                          </FormItem>
                        )}
                      />

                      <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setRateDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          {editingRate ? "Update" : "Add"} Rate
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Conversion</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exchangeRates.map((rate) => (
                  <TableRow key={rate.id}>
                    <TableCell>
                      <div className="font-medium">
                        {rate.baseCurrency} → {rate.targetCurrency}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">{parseFloat(rate.rate).toFixed(6)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={rate.isManual ? "secondary" : "default"}>
                        {rate.isManual ? "Manual" : "Automatic"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{rate.lastUpdated}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEditRate(rate)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Exchange Rate</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this exchange rate? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteRate(rate.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="settings" className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CurrencyConverter currencies={currencies} />
          
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Currency Settings</CardTitle>
                  <CardDescription>Configure global currency preferences</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Auto-Update Exchange Rates</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatically fetch latest rates from external API
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="p-4 border rounded-lg space-y-3">
                  <h4 className="font-medium">Update Frequency</h4>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="manual">Manual Only</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    How often to update exchange rates automatically
                  </p>
                </div>

                <div className="p-4 border rounded-lg space-y-3">
                  <h4 className="font-medium">Exchange Rate Source</h4>
                  <Select defaultValue="frankfurter">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frankfurter">Frankfurter API (Free)</SelectItem>
                      <SelectItem value="custom">Custom API</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Select the API source for exchange rates
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Show Currency Symbols</h4>
                    <p className="text-sm text-muted-foreground">
                      Display currency symbols instead of codes
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Round to Currency Decimals</h4>
                    <p className="text-sm text-muted-foreground">
                      Automatically round amounts based on currency settings
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>

              <Button className="w-full">Save Settings</Button>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  );
}
