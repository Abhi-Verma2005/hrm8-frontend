import { DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useCurrencyFormat } from "@/contexts/CurrencyFormatContext";
import { toast } from "@/hooks/use-toast";

export function CurrencyFormatToggle() {
  const { currencyFormat, setCurrencyFormat } = useCurrencyFormat();

  const handleFormatChange = (value: string) => {
    const newFormat = value as 'whole' | 'decimal';
    setCurrencyFormat(newFormat);
    
    toast({
      title: "Currency Format Updated",
      description: `Currency values will now display ${newFormat === 'whole' ? 'without' : 'with'} decimal places.`,
    });
  };

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9">
              <DollarSign className="h-4 w-4" />
              <span className="sr-only">Toggle currency format</span>
            </Button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Currency Format: {currencyFormat === 'whole' ? 'Whole Dollars' : 'With Decimals'}</p>
        </TooltipContent>
      </Tooltip>
      
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Currency Display Format</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuRadioGroup value={currencyFormat} onValueChange={handleFormatChange}>
          <DropdownMenuRadioItem value="whole">
            <div className="flex flex-col">
              <span className="font-medium">Whole Dollars</span>
              <span className="text-xs text-muted-foreground">$1,234,567</span>
            </div>
          </DropdownMenuRadioItem>
          
          <DropdownMenuRadioItem value="decimal">
            <div className="flex flex-col">
              <span className="font-medium">With Decimals</span>
              <span className="text-xs text-muted-foreground">$1,234,567.00</span>
            </div>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5 text-xs text-muted-foreground">
          Changes apply instantly across all dashboards
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
