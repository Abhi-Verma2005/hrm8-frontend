import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
  showTotalPages?: boolean;
}

export function TablePagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [25, 50, 100, 200, 500],
  showTotalPages = true,
}: TablePaginationProps) {
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  
  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft' && currentPage > 1) {
      onPageChange(currentPage - 1);
    } else if (e.key === 'ArrowRight' && currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const getPageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];
    
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }
    
    // Always add first page
    pages.push(1);
    
    // Calculate range around current page
    const showLeftEllipsis = currentPage > 4;
    const showRightEllipsis = currentPage < totalPages - 3;
    
    if (showLeftEllipsis) {
      pages.push('ellipsis');
    }
    
    // Determine start and end of middle section
    const startPage = Math.max(2, currentPage - 2);
    const endPage = Math.min(totalPages - 1, currentPage + 2);
    
    for (let i = startPage; i <= endPage; i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }
    
    if (showRightEllipsis) {
      pages.push('ellipsis');
    }
    
    // Always add last page
    if (!pages.includes(totalPages)) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div 
      className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mt-4 pt-4 border-t"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Left: Items per page selector */}
      <div className="flex items-center gap-2">
        <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">Rows per page:</span>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="w-[70px] sm:w-[80px] h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map(size => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Center: Page info */}
      <div className="flex items-center gap-3">
        <div className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
          {totalItems === 0 ? (
            <span>No items</span>
          ) : (
            <>
              <span className="font-medium text-foreground">{startItem}-{endItem}</span>
              {' '}of{' '}
              <span className="font-medium text-foreground">{totalItems.toLocaleString()}</span>
              {showTotalPages && totalPages > 1 && (
                <span className="hidden sm:inline">
                  {' '}• Page <span className="font-medium text-foreground">{currentPage}</span> of <span className="font-medium text-foreground">{totalPages}</span>
                </span>
              )}
            </>
          )}
        </div>
      </div>

      {/* Right: Pagination controls */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
              className={cn(
                currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-accent',
                'transition-colors'
              )}
              aria-label="Previous page"
            />
          </PaginationItem>

          <div className="hidden sm:flex">
            {getPageNumbers().map((page, index) => (
              <PaginationItem key={index}>
                {page === 'ellipsis' ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => onPageChange(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer transition-colors"
                    aria-label={`Go to page ${page}`}
                    aria-current={currentPage === page ? 'page' : undefined}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
          </div>

          {/* Mobile: Show only current page */}
          <div className="sm:hidden px-2 text-sm font-medium">
            {currentPage}/{totalPages}
          </div>

          <PaginationItem>
            <PaginationNext
              onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
              className={cn(
                currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-accent',
                'transition-colors'
              )}
              aria-label="Next page"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
