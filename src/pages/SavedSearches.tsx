import { DashboardPageLayout } from "@/components/layouts/DashboardPageLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Star, Share2, Clock, Trash2, Play } from "lucide-react";
import { useState } from "react";

interface SavedSearch {
  id: string;
  name: string;
  module: 'candidates' | 'jobs' | 'employees' | 'performance';
  criteria: string;
  resultCount: number;
  lastRun: string;
  isFavorite: boolean;
  sharedWith: string[];
  createdBy: string;
}

export default function SavedSearches() {
  const [searches, setSearches] = useState<SavedSearch[]>([
    {
      id: '1',
      name: 'Senior Developers - Active',
      module: 'candidates',
      criteria: 'Position: Senior Developer, Status: Active',
      resultCount: 42,
      lastRun: '2024-01-15T10:30:00',
      isFavorite: true,
      sharedWith: ['john@company.com', 'sarah@company.com'],
      createdBy: 'You'
    },
    {
      id: '2',
      name: 'Engineering Department - All',
      module: 'employees',
      criteria: 'Department: Engineering',
      resultCount: 128,
      lastRun: '2024-01-14T14:20:00',
      isFavorite: false,
      sharedWith: [],
      createdBy: 'You'
    },
    {
      id: '3',
      name: 'Open Remote Positions',
      module: 'jobs',
      criteria: 'Status: Open, Type: Remote',
      resultCount: 15,
      lastRun: '2024-01-15T09:00:00',
      isFavorite: true,
      sharedWith: ['hiring@company.com'],
      createdBy: 'John Smith'
    },
    {
      id: '4',
      name: 'Q4 Reviews Pending',
      module: 'performance',
      criteria: 'Period: Q4 2024, Status: Pending',
      resultCount: 23,
      lastRun: '2024-01-13T16:45:00',
      isFavorite: false,
      sharedWith: [],
      createdBy: 'You'
    }
  ]);

  const toggleFavorite = (id: string) => {
    setSearches(prev =>
      prev.map(s => s.id === id ? { ...s, isFavorite: !s.isFavorite } : s)
    );
  };

  const deleteSearch = (id: string) => {
    setSearches(prev => prev.filter(s => s.id !== id));
  };

  const getModuleColor = (module: SavedSearch['module']) => {
    switch (module) {
      case 'candidates': return 'bg-blue-500/10 text-blue-500';
      case 'jobs': return 'bg-emerald-500/10 text-emerald-500';
      case 'employees': return 'bg-purple-500/10 text-purple-500';
      case 'performance': return 'bg-amber-500/10 text-amber-500';
    }
  };

  const favoriteSearches = searches.filter(s => s.isFavorite);
  const recentSearches = searches.slice().sort((a, b) => 
    new Date(b.lastRun).getTime() - new Date(a.lastRun).getTime()
  ).slice(0, 5);

  return (
    <DashboardPageLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Saved Searches</h1>
            <p className="text-muted-foreground">Quick access to your favorite search queries</p>
          </div>
          <Button>
            <Search className="h-4 w-4 mr-2" />
            New Search
          </Button>
        </div>

        {/* Favorites Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-amber-500 text-amber-500" />
              <CardTitle>Favorite Searches</CardTitle>
            </div>
            <CardDescription>Your most frequently used searches</CardDescription>
          </CardHeader>
          <CardContent>
            {favoriteSearches.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No favorite searches yet. Star your most used searches for quick access.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {favoriteSearches.map(search => (
                  <Card key={search.id} className="border-2">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{search.name}</h4>
                          <p className="text-xs text-muted-foreground mb-2">{search.criteria}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(search.id)}
                        >
                          <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge className={getModuleColor(search.module)} variant="secondary">
                            {search.module}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{search.resultCount} results</span>
                        </div>
                        <Button size="sm">
                          <Play className="h-3 w-3 mr-1" />
                          Run
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Searches */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <CardTitle>Recent Searches</CardTitle>
            </div>
            <CardDescription>Recently executed search queries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSearches.map(search => (
                <Card key={search.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold">{search.name}</h4>
                          <Badge className={getModuleColor(search.module)} variant="secondary">
                            {search.module}
                          </Badge>
                          {search.isFavorite && (
                            <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{search.criteria}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Last run: {new Date(search.lastRun).toLocaleString()}</span>
                          <span>{search.resultCount} results</span>
                          <span>By: {search.createdBy}</span>
                          {search.sharedWith.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Share2 className="h-3 w-3" />
                              Shared with {search.sharedWith.length}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleFavorite(search.id)}
                        >
                          <Star className={`h-4 w-4 ${search.isFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Play className="h-3 w-3 mr-1" />
                          Run
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteSearch(search.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Search Templates</CardTitle>
            <CardDescription>Pre-configured search templates for common queries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'New Applicants This Week', module: 'candidates', count: 87 },
                { name: 'Employees Anniversary', module: 'employees', count: 12 },
                { name: 'Urgent Positions', module: 'jobs', count: 5 },
                { name: 'Outstanding Reviews', module: 'performance', count: 34 }
              ].map((template, idx) => (
                <Card key={idx} className="cursor-pointer hover:border-primary transition-colors">
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-2">{template.name}</h4>
                    <div className="flex items-center justify-between">
                      <Badge className={getModuleColor(template.module as SavedSearch['module'])} variant="secondary">
                        {template.module}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{template.count} results</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardPageLayout>
  );
}
