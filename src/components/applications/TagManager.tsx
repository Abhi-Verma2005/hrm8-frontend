import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { X, Plus, Tag } from "lucide-react";
import { PREDEFINED_TAGS, getTagColor, addTagToApplication, removeTagFromApplication } from "@/lib/applicationTags";
import { toast } from "sonner";

interface TagManagerProps {
  applicationId: string;
  tags: string[];
  onTagsChange?: () => void;
}

export function TagManager({ applicationId, tags = [], onTagsChange }: TagManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customTag, setCustomTag] = useState("");

  const handleAddTag = (tag: string) => {
    if (!tags.includes(tag)) {
      addTagToApplication(applicationId, tag);
      toast.success(`Tag "${tag}" added`);
      onTagsChange?.();
    }
  };

  const handleRemoveTag = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeTagFromApplication(applicationId, tag);
    toast.success(`Tag "${tag}" removed`);
    onTagsChange?.();
  };

  const handleAddCustomTag = () => {
    if (customTag.trim() && !tags.includes(customTag.trim())) {
      addTagToApplication(applicationId, customTag.trim());
      toast.success(`Tag "${customTag}" added`);
      setCustomTag("");
      onTagsChange?.();
    }
  };

  return (
    <div className="flex items-center gap-1 flex-wrap" onClick={(e) => e.stopPropagation()}>
      {tags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className={`text-[10px] px-1.5 py-0.5 ${getTagColor(tag)}`}
        >
          {tag}
          <button
            onClick={(e) => handleRemoveTag(tag, e)}
            className="ml-1 hover:opacity-70"
          >
            <X className="h-2.5 w-2.5" />
          </button>
        </Badge>
      ))}
      
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-5 px-1.5 text-[10px]"
          >
            <Plus className="h-2.5 w-2.5 mr-0.5" />
            Tag
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-3" align="start">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <h4 className="font-semibold text-sm">Add Tags</h4>
            </div>
            
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Predefined Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {PREDEFINED_TAGS.map((tag) => (
                  <Badge
                    key={tag}
                    variant={tags.includes(tag) ? "default" : "outline"}
                    className={`cursor-pointer text-[10px] px-2 py-1 ${
                      tags.includes(tag) ? '' : 'hover:bg-accent'
                    }`}
                    onClick={() => handleAddTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Custom Tag</p>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter custom tag..."
                  value={customTag}
                  onChange={(e) => setCustomTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCustomTag()}
                  className="h-8 text-sm"
                />
                <Button
                  size="sm"
                  onClick={handleAddCustomTag}
                  disabled={!customTag.trim()}
                  className="h-8"
                >
                  Add
                </Button>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
