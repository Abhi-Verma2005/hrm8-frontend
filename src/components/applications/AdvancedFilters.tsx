import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Filter, X, CalendarIcon, Save, Star } from 'lucide-react';
import { format } from 'date-fns';
import { ApplicationStatus, ApplicationStage } from '@/types/application';

interface FilterState {
  search: string;
  status: ApplicationStatus | '';
  stage: ApplicationStage | '';
  dateFrom?: Date;
  dateTo?: Date;
  recruiter: string;
  source: string;
}

interface AdvancedFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

const SAVED_FILTERS_KEY = 'application_saved_filters';

interface SavedFilter {
  id: string;
  name: string;
  filters: FilterState;
}

export function AdvancedFilters({ onFilterChange }: AdvancedFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: '',
    stage: '',
    recruiter: '',
    source: '',
  });
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>(() => {
    const saved = localStorage.getItem(SAVED_FILTERS_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [filterName, setFilterName] = useState('');

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: FilterState = {
      search: '',
      status: '',
      stage: '',
      recruiter: '',
      source: '',
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const saveCurrentFilter = () => {
    if (!filterName.trim()) return;
    
    const newFilter: SavedFilter = {
      id: Date.now().toString(),
      name: filterName,
      filters: { ...filters },
    };
    
    const updated = [...savedFilters, newFilter];
    setSavedFilters(updated);
    localStorage.setItem(SAVED_FILTERS_KEY, JSON.stringify(updated));
    setFilterName('');
  };

  const loadSavedFilter = (saved: SavedFilter) => {
    setFilters(saved.filters);
    onFilterChange(saved.filters);
  };

  const deleteSavedFilter = (id: string) => {
    const updated = savedFilters.filter(f => f.id !== id);
    setSavedFilters(updated);
    localStorage.setItem(SAVED_FILTERS_KEY, JSON.stringify(updated));
  };

  const activeFilterCount = Object.values(filters).filter(v => v && v !== '').length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <Popover open={showFilters} onOpenChange={setShowFilters}>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[500px] p-6" align="start">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Advanced Filters</h3>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Search</Label>
                  <Input
                    value={filters.search}
                    onChange={(e) => updateFilter('search', e.target.value)}
                    placeholder="Name, email, phone..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={filters.status} onValueChange={(v) => updateFilter('status', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All</SelectItem>
                      <SelectItem value="applied">Applied</SelectItem>
                      <SelectItem value="screening">Screening</SelectItem>
                      <SelectItem value="interview">Interview</SelectItem>
                      <SelectItem value="offer">Offer</SelectItem>
                      <SelectItem value="hired">Hired</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Stage</Label>
                  <Select value={filters.stage} onValueChange={(v) => updateFilter('stage', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All stages" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All</SelectItem>
                      <SelectItem value="New Application">New Application</SelectItem>
                      <SelectItem value="Resume Review">Resume Review</SelectItem>
                      <SelectItem value="Phone Screen">Phone Screen</SelectItem>
                      <SelectItem value="Technical Interview">Technical Interview</SelectItem>
                      <SelectItem value="Manager Interview">Manager Interview</SelectItem>
                      <SelectItem value="Final Round">Final Round</SelectItem>
                      <SelectItem value="Offer Extended">Offer Extended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Recruiter</Label>
                  <Select value={filters.recruiter} onValueChange={(v) => updateFilter('recruiter', v)}>
                    <SelectTrigger>
                      <SelectValue placeholder="All recruiters" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All</SelectItem>
                      <SelectItem value="Sarah Johnson">Sarah Johnson</SelectItem>
                      <SelectItem value="Michael Chen">Michael Chen</SelectItem>
                      <SelectItem value="Emily Rodriguez">Emily Rodriguez</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date From</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateFrom ? format(filters.dateFrom, 'PP') : 'Pick date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.dateFrom}
                        onSelect={(date) => updateFilter('dateFrom', date)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Date To</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.dateTo ? format(filters.dateTo, 'PP') : 'Pick date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={filters.dateTo}
                        onSelect={(date) => updateFilter('dateTo', date)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="border-t pt-4">
                <Label className="mb-2 block">Save Current Filter</Label>
                <div className="flex gap-2">
                  <Input
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                    placeholder="Filter name..."
                  />
                  <Button onClick={saveCurrentFilter} size="sm" disabled={!filterName.trim()}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>

              {savedFilters.length > 0 && (
                <div className="border-t pt-4">
                  <Label className="mb-2 block">Saved Filters</Label>
                  <div className="space-y-2">
                    {savedFilters.map(saved => (
                      <div key={saved.id} className="flex items-center justify-between p-2 border rounded-md">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => loadSavedFilter(saved)}
                          className="flex-1 justify-start"
                        >
                          <Star className="h-4 w-4 mr-2" />
                          {saved.name}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteSavedFilter(saved.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {activeFilterCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>

      {activeFilterCount > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          {filters.search && (
            <Badge variant="secondary">
              Search: {filters.search}
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => updateFilter('search', '')}
              />
            </Badge>
          )}
          {filters.status && (
            <Badge variant="secondary">
              Status: {filters.status}
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => updateFilter('status', '')}
              />
            </Badge>
          )}
          {filters.stage && (
            <Badge variant="secondary">
              Stage: {filters.stage}
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => updateFilter('stage', '')}
              />
            </Badge>
          )}
          {filters.recruiter && (
            <Badge variant="secondary">
              Recruiter: {filters.recruiter}
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => updateFilter('recruiter', '')}
              />
            </Badge>
          )}
          {filters.dateFrom && (
            <Badge variant="secondary">
              From: {format(filters.dateFrom, 'PP')}
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => updateFilter('dateFrom', undefined)}
              />
            </Badge>
          )}
          {filters.dateTo && (
            <Badge variant="secondary">
              To: {format(filters.dateTo, 'PP')}
              <X
                className="h-3 w-3 ml-1 cursor-pointer"
                onClick={() => updateFilter('dateTo', undefined)}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}
