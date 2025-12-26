import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { subscribeToAuditLogs, type AuditLog as AuditLogType } from "@/lib/auditLogService";
import { FileText, Download, Search, Filter, CalendarIcon, RefreshCw } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { TablePagination } from "@/components/tables/TablePagination";
import { AuditLogDetailsModal } from "./AuditLogDetailsModal";
import { AuditLogTimeline } from "./AuditLogTimeline";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AuditLog {
  id: string;
  timestamp: string;
  user: string;
  userId: string;
  action: string;
  category: string;
  entityType: string;
  entityId: string;
  changes: string;
  ipAddress: string;
  userAgent: string;
  status: "success" | "failed";
}

const mockAuditLogs: AuditLog[] = [
  {
    id: "1",
    timestamp: "2024-11-09 14:32:15",
    user: "John Doe",
    userId: "user_1",
    action: "Created pricing tier",
    category: "pricing",
    entityType: "pricing_tier",
    entityId: "tier_123",
    changes: "Created new tier 'Enterprise' with price $99",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    status: "success",
  },
  {
    id: "2",
    timestamp: "2024-11-09 14:15:42",
    user: "Jane Smith",
    userId: "user_2",
    action: "Updated commission rule",
    category: "commission",
    entityType: "commission_rule",
    entityId: "rule_456",
    changes: "Changed base rate from 8% to 10%",
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    status: "success",
  },
  {
    id: "3",
    timestamp: "2024-11-09 13:45:20",
    user: "Mike Johnson",
    userId: "user_3",
    action: "Deleted territory",
    category: "territory",
    entityType: "territory",
    entityId: "terr_789",
    changes: "Deleted territory 'Pacific Northwest'",
    ipAddress: "192.168.1.102",
    userAgent: "Mozilla/5.0 (X11; Linux x86_64)",
    status: "success",
  },
  {
    id: "4",
    timestamp: "2024-11-09 12:30:10",
    user: "Sarah Wilson",
    userId: "user_4",
    action: "Updated currency rate",
    category: "currency",
    entityType: "exchange_rate",
    entityId: "rate_321",
    changes: "Updated EUR/USD rate from 0.92 to 0.93",
    ipAddress: "192.168.1.103",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X)",
    status: "success",
  },
  {
    id: "5",
    timestamp: "2024-11-09 11:20:05",
    user: "Tom Brown",
    userId: "user_5",
    action: "Failed login attempt",
    category: "security",
    entityType: "auth",
    entityId: "auth_999",
    changes: "Invalid credentials",
    ipAddress: "203.0.113.45",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    status: "failed",
  },
  {
    id: "6",
    timestamp: "2024-11-09 10:15:30",
    user: "Lisa Garcia",
    userId: "user_6",
    action: "Created territory assignment",
    category: "territory",
    entityType: "assignment",
    entityId: "assign_555",
    changes: "Assigned John Doe to Northeast Region",
    ipAddress: "192.168.1.104",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    status: "success",
  },
  {
    id: "7",
    timestamp: "2024-11-09 09:45:18",
    user: "John Doe",
    userId: "user_1",
    action: "Updated system settings",
    category: "settings",
    entityType: "system_config",
    entityId: "config_111",
    changes: "Changed auto-update frequency to daily",
    ipAddress: "192.168.1.100",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    status: "success",
  },
  {
    id: "8",
    timestamp: "2024-11-08 16:22:45",
    user: "Jane Smith",
    userId: "user_2",
    action: "Exported audit logs",
    category: "audit",
    entityType: "export",
    entityId: "export_777",
    changes: "Exported 500 audit logs to CSV",
    ipAddress: "192.168.1.101",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    status: "success",
  },
];

export function AuditLogsTab() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"table" | "timeline">("table");
  const { toast } = useToast();

  // Subscribe to real-time audit log updates
  useEffect(() => {
    const unsubscribe = subscribeToAuditLogs((updatedLogs: any[]) => {
      // Convert from AuditLogService format to component format
      const formattedLogs: AuditLog[] = updatedLogs.map(log => ({
        id: log.id,
        timestamp: log.timestamp,
        user: log.userName,
        userId: log.userId,
        action: log.description,
        category: log.category,
        entityType: log.resource,
        entityId: log.resourceId || '',
        changes: log.metadata?.changes ? JSON.stringify(log.metadata.changes) : '',
        ipAddress: log.ipAddress || 'N/A',
        userAgent: log.userAgent || 'N/A',
        status: log.status,
      }));
      setLogs(formattedLogs);
    });
    
    return unsubscribe;
  }, []);

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "pricing", label: "Pricing" },
    { value: "commission", label: "Commission" },
    { value: "territory", label: "Territory" },
    { value: "currency", label: "Currency" },
    { value: "security", label: "Security" },
    { value: "settings", label: "Settings" },
    { value: "audit", label: "Audit" },
  ];

  // Apply filters whenever logs or filters change
  useEffect(() => {
    applyFilters();
  }, [logs, searchQuery, categoryFilter, statusFilter, dateFrom, dateTo]);

  const applyFilters = () => {
    let filtered = [...logs];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        log =>
          log.user.toLowerCase().includes(query) ||
          log.action.toLowerCase().includes(query) ||
          log.changes.toLowerCase().includes(query) ||
          log.ipAddress.includes(query)
      );
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter(log => log.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(log => log.status === statusFilter);
    }

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter(log => new Date(log.timestamp) >= dateFrom);
    }
    if (dateTo) {
      const endOfDay = new Date(dateTo);
      endOfDay.setHours(23, 59, 59, 999);
      filtered = filtered.filter(log => new Date(log.timestamp) <= endOfDay);
    }

    setFilteredLogs(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setIsRefreshing(false);
      toast({
        title: "Logs Refreshed",
        description: "Audit logs have been refreshed successfully.",
      });
    }, 1000);
  };

  const exportToCSV = () => {
    const headers = ["Timestamp", "User", "Action", "Category", "Changes", "IP Address", "Status"];
    const rows = filteredLogs.map(log => [
      log.timestamp,
      log.user,
      log.action,
      log.category,
      log.changes,
      log.ipAddress,
      log.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `audit_logs_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: `Exported ${filteredLogs.length} audit logs to CSV.`,
    });
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(filteredLogs, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `audit_logs_${format(new Date(), "yyyy-MM-dd")}.json`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: `Exported ${filteredLogs.length} audit logs to JSON.`,
    });
  };

  const resetFilters = () => {
    setSearchQuery("");
    setCategoryFilter("all");
    setStatusFilter("all");
    setDateFrom(undefined);
    setDateTo(undefined);
    setFilteredLogs(logs);
    setCurrentPage(1);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredLogs.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when page size changes
  };

  const handleRowClick = (log: AuditLog) => {
    setSelectedLog(log);
    setIsDetailsOpen(true);
  };

  const getRelatedLogs = (log: AuditLog) => {
    return logs.filter(
      (l) =>
        l.id !== log.id &&
        (l.userId === log.userId || 
         l.category === log.category ||
         l.entityId === log.entityId)
    );
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Audit Logs</CardTitle>
                <CardDescription>
                  Comprehensive activity tracking for compliance and security
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "table" | "timeline")}>
                <TabsList>
                  <TabsTrigger value="table">Table</TabsTrigger>
                  <TabsTrigger value="timeline">Timeline</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={exportToCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm" onClick={exportToJSON}>
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters Section */}
          <div className="p-4 border rounded-lg space-y-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Filters</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <Label>Search</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search logs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date From */}
              <div className="space-y-2">
                <Label>From Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateFrom && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={setDateFrom}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Date To */}
              <div className="space-y-2">
                <Label>To Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !dateTo && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateTo ? format(dateTo, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={setDateTo}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={applyFilters}>Apply Filters</Button>
              <Button variant="outline" onClick={resetFilters}>
                Reset
              </Button>
            </div>
          </div>

          {/* View Content */}
          {viewMode === "table" ? (
            <>
              {/* Audit Logs Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Timestamp</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Changes</TableHead>
                      <TableHead>IP Address</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No audit logs found matching your filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedLogs.map((log) => (
                        <TableRow 
                          key={log.id} 
                          className="cursor-pointer hover:bg-muted/70 transition-colors"
                          onClick={() => handleRowClick(log)}
                        >
                          <TableCell className="font-mono text-xs">{log.timestamp}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{log.user}</div>
                              <div className="text-xs text-muted-foreground">{log.userId}</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{log.action}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize">
                              {log.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-xs truncate" title={log.changes}>
                            {log.changes}
                          </TableCell>
                          <TableCell className="font-mono text-xs">{log.ipAddress}</TableCell>
                          <TableCell>
                            <Badge variant={log.status === "success" ? "default" : "destructive"}>
                              {log.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {filteredLogs.length > 0 && (
                <TablePagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  pageSize={pageSize}
                  totalItems={filteredLogs.length}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              )}
            </>
          ) : (
            /* Timeline View */
            <AuditLogTimeline 
              logs={filteredLogs} 
              onLogClick={handleRowClick}
            />
          )}
        </CardContent>
      </Card>

      {/* Audit Log Details Modal */}
      <AuditLogDetailsModal
        log={selectedLog}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        relatedLogs={selectedLog ? getRelatedLogs(selectedLog) : []}
      />
    </div>
  );
}
