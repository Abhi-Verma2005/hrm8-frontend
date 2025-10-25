import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getEmployerSettings, updateTags } from "@/lib/employerSettingsStorage";
import { toast } from "@/hooks/use-toast";
import { X, Plus } from "lucide-react";

interface TagsManagerCardProps {
  employerId: string;
}

const suggestedTags = [
  'VIP',
  'Enterprise Client',
  'SMB',
  'Fortune 500',
  'Startup',
  'High Priority',
  'At Risk',
  'Upsell Opportunity',
  'Trial',
  'New Client',
];

const tagColors = [
  'bg-purple-100 text-purple-800 border-purple-200',
  'bg-blue-100 text-blue-800 border-blue-200',
  'bg-green-100 text-green-800 border-green-200',
  'bg-orange-100 text-orange-800 border-orange-200',
  'bg-red-100 text-red-800 border-red-200',
  'bg-cyan-100 text-cyan-800 border-cyan-200',
  'bg-pink-100 text-pink-800 border-pink-200',
  'bg-yellow-100 text-yellow-800 border-yellow-200',
];

export function TagsManagerCard({ employerId }: TagsManagerCardProps) {
  const [settings, setSettings] = useState(getEmployerSettings(employerId));
  const [tags, setTags] = useState<string[]>(settings.tags);
  const [newTag, setNewTag] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleAddTag = (tag: string) => {
    if (!tag.trim()) return;
    if (tags.length >= 10) {
      toast({
        title: "Maximum tags reached",
        description: "You can only add up to 10 tags",
        variant: "destructive",
      });
      return;
    }
    if (tags.includes(tag)) {
      toast({
        title: "Tag already exists",
        variant: "destructive",
      });
      return;
    }

    const newTags = [...tags, tag];
    setTags(newTags);
    saveTags(newTags);
    setNewTag('');
    setShowInput(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter(t => t !== tagToRemove);
    setTags(newTags);
    saveTags(newTags);
  };

  const saveTags = (newTags: string[]) => {
    const success = updateTags(employerId, newTags);
    if (success) {
      setSettings(getEmployerSettings(employerId));
      toast({ title: "Tags updated successfully" });
    }
  };

  const getTagColor = (index: number) => {
    return tagColors[index % tagColors.length];
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tags</CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowInput(!showInput)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showInput && (
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Enter tag name..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddTag(newTag);
                }
              }}
            />
            <Button onClick={() => handleAddTag(newTag)}>Add</Button>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <Badge
              key={tag}
              variant="outline"
              className={getTagColor(index)}
            >
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-2 hover:text-destructive"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>

        {tags.length === 0 && (
          <p className="text-sm text-muted-foreground">No tags yet</p>
        )}

        <div className="border-t pt-4">
          <p className="text-sm font-medium mb-2">Suggested Tags:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedTags
              .filter(tag => !tags.includes(tag))
              .map(tag => (
                <Button
                  key={tag}
                  size="sm"
                  variant="ghost"
                  onClick={() => handleAddTag(tag)}
                  className="h-7"
                >
                  + {tag}
                </Button>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
