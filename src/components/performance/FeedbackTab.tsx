import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Feedback } from "@/types/performance";
import { format } from "date-fns";
import { Lock, MessageSquare, Search, Trash2 } from "lucide-react";
import { deleteFeedback } from "@/lib/performanceStorage";
import { toast } from "sonner";

interface FeedbackTabProps {
  feedback: Feedback[];
  onRefresh: () => void;
}

export function FeedbackTab({ feedback, onRefresh }: FeedbackTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredFeedback = feedback.filter(item => {
    const matchesSearch = item.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.fromName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeBadge = (type: Feedback['type']) => {
    const variants: Record<string, { variant: "default" | "secondary" | "outline"; label: string }> = {
      positive: { variant: "default", label: "Positive" },
      constructive: { variant: "outline", label: "Constructive" },
      neutral: { variant: "secondary", label: "Neutral" },
    };
    const config = variants[type];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this feedback?")) {
      deleteFeedback(id);
      onRefresh();
      toast.success("Feedback deleted successfully");
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle>Feedback</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search feedback..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="positive">Positive</SelectItem>
                <SelectItem value="constructive">Constructive</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredFeedback.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <MessageSquare className="mx-auto h-12 w-12 mb-2 opacity-50" />
            <p>No feedback found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFeedback.map((item) => (
              <div
                key={item.id}
                className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold">{item.employeeName}</span>
                    {getTypeBadge(item.type)}
                    <Badge variant="outline" className="capitalize">{item.category}</Badge>
                    {item.isPrivate && (
                      <Badge variant="outline" className="gap-1">
                        <Lock className="h-3 w-3" />
                        Private
                      </Badge>
                    )}
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <p className="text-sm mb-2">{item.content}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>From: {item.isAnonymous ? "Anonymous" : item.fromName}</span>
                  <span>•</span>
                  <span>{format(new Date(item.createdAt), "MMM d, yyyy")}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
