import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2, Folder, Tag, Loader2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { apiClient } from "@/lib/api";

interface JobCategory { id: string; name: string; slug: string; description?: string; icon?: string; color?: string; order: number; is_active: boolean; }
interface JobTag { id: string; name: string; slug: string; color?: string; description?: string; is_active: boolean; }

const categorySchema = z.object({
  name: z.string().trim().min(1, "Required").max(100),
  slug: z.string().trim().min(1, "Required").max(100).regex(/^[a-z0-9-]+$/, "Lowercase with hyphens"),
  description: z.string().max(500).optional(),
  icon: z.string().max(50).optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color").optional().or(z.literal("")),
  is_active: z.boolean(),
});

const tagSchema = z.object({
  name: z.string().trim().min(1, "Required").max(100),
  slug: z.string().trim().min(1, "Required").max(100).regex(/^[a-z0-9-]+$/, "Lowercase with hyphens"),
  description: z.string().max(500).optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Invalid color").optional().or(z.literal("")),
  is_active: z.boolean(),
});

type CategoryFormData = z.infer<typeof categorySchema>;
type TagFormData = z.infer<typeof tagSchema>;

export function JobBoardManagementTab() {
  const [categories, setCategories] = useState<JobCategory[]>([]);
  const [tags, setTags] = useState<JobTag[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingTags, setLoadingTags] = useState(true);
  const [editingCategory, setEditingCategory] = useState<JobCategory | null>(null);
  const [editingTag, setEditingTag] = useState<JobTag | null>(null);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [tagDialogOpen, setTagDialogOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const categoryForm = useForm<CategoryFormData>({ resolver: zodResolver(categorySchema), defaultValues: { name: "", slug: "", description: "", icon: "", color: "#3B82F6", is_active: true } });
  const tagForm = useForm<TagFormData>({ resolver: zodResolver(tagSchema), defaultValues: { name: "", slug: "", description: "", color: "#3B82F6", is_active: true } });

  const watchCategoryName = categoryForm.watch("name");
  const watchTagName = tagForm.watch("name");

  useEffect(() => {
    if (!editingCategory && watchCategoryName) {
      categoryForm.setValue("slug", watchCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  }, [watchCategoryName, editingCategory, categoryForm]);

  useEffect(() => {
    if (!editingTag && watchTagName) {
      tagForm.setValue("slug", watchTagName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
    }
  }, [watchTagName, editingTag, tagForm]);

  useEffect(() => { loadCategories(); loadTags(); }, []);

  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await apiClient.get<JobCategory[]>("/api/admin/categories?includeInactive=true");
      if (response.success && response.data) setCategories(response.data);
    } catch (error) { console.error(error); }
    setLoadingCategories(false);
  };

  const loadTags = async () => {
    setLoadingTags(true);
    try {
      const response = await apiClient.get<JobTag[]>("/api/admin/tags?includeInactive=true");
      if (response.success && response.data) setTags(response.data);
    } catch (error) { console.error(error); }
    setLoadingTags(false);
  };

  const onSubmitCategory = async (data: CategoryFormData) => {
    setSaving(true);
    try {
      const response = editingCategory
        ? await apiClient.put(`/api/admin/categories/${editingCategory.id}`, data)
        : await apiClient.post("/api/admin/categories", data);
      if (response.success) {
        toast({ title: editingCategory ? "Updated" : "Created", description: `${data.name} saved.` });
        loadCategories();
        setCategoryDialogOpen(false);
        setEditingCategory(null);
        categoryForm.reset();
      }
    } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
    setSaving(false);
  };

  const onSubmitTag = async (data: TagFormData) => {
    setSaving(true);
    try {
      const response = editingTag
        ? await apiClient.put(`/api/admin/tags/${editingTag.id}`, data)
        : await apiClient.post("/api/admin/tags", data);
      if (response.success) {
        toast({ title: editingTag ? "Updated" : "Created", description: `${data.name} saved.` });
        loadTags();
        setTagDialogOpen(false);
        setEditingTag(null);
        tagForm.reset();
      }
    } catch (error: any) { toast({ title: "Error", description: error.message, variant: "destructive" }); }
    setSaving(false);
  };

  const handleEditCategory = (cat: JobCategory) => { setEditingCategory(cat); categoryForm.reset({ name: cat.name, slug: cat.slug, description: cat.description || "", icon: cat.icon || "", color: cat.color || "#3B82F6", is_active: cat.is_active }); setCategoryDialogOpen(true); };
  const handleEditTag = (tag: JobTag) => { setEditingTag(tag); tagForm.reset({ name: tag.name, slug: tag.slug, description: tag.description || "", color: tag.color || "#3B82F6", is_active: tag.is_active }); setTagDialogOpen(true); };

  const handleDeleteCategory = async (id: string) => { await apiClient.delete(`/api/admin/categories/${id}`); loadCategories(); toast({ title: "Deleted", variant: "destructive" }); };
  const handleDeleteTag = async (id: string) => { await apiClient.delete(`/api/admin/tags/${id}`); loadTags(); toast({ title: "Deleted", variant: "destructive" }); };

  return (
    <Tabs defaultValue="categories" className="space-y-4">
      <TabsList><TabsTrigger value="categories">Categories</TabsTrigger><TabsTrigger value="tags">Tags</TabsTrigger></TabsList>

      <TabsContent value="categories">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"><Folder className="h-5 w-5 text-primary" /></div>
                <div><CardTitle>Job Categories</CardTitle><CardDescription>Manage categories</CardDescription></div>
              </div>
              <Dialog open={categoryDialogOpen} onOpenChange={(o) => { setCategoryDialogOpen(o); if (!o) { setEditingCategory(null); categoryForm.reset(); } }}>
                <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Category</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>{editingCategory ? "Edit" : "Create"} Category</DialogTitle></DialogHeader>
                  <Form {...categoryForm}>
                    <form onSubmit={categoryForm.handleSubmit(onSubmitCategory)} className="space-y-4">
                      <FormField control={categoryForm.control} name="name" render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={categoryForm.control} name="slug" render={({ field }) => (<FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={categoryForm.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <div className="grid grid-cols-2 gap-4">
                        <FormField control={categoryForm.control} name="icon" render={({ field }) => (<FormItem><FormLabel>Icon</FormLabel><FormControl><Input placeholder="💻" {...field} /></FormControl></FormItem>)} />
                        <FormField control={categoryForm.control} name="color" render={({ field }) => (<FormItem><FormLabel>Color</FormLabel><div className="flex gap-2"><Input type="color" {...field} className="w-14 h-10" /><Input value={field.value} onChange={field.onChange} /></div></FormItem>)} />
                      </div>
                      <FormField control={categoryForm.control} name="is_active" render={({ field }) => (<FormItem className="flex items-center gap-2"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Active</FormLabel></FormItem>)} />
                      <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setCategoryDialogOpen(false)}>Cancel</Button><Button type="submit" disabled={saving}>{saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}{editingCategory ? "Update" : "Create"}</Button></div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {loadingCategories ? <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div> : (
              <Table>
                <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Slug</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {categories.map((cat) => (
                    <TableRow key={cat.id}>
                      <TableCell><div className="flex items-center gap-2">{cat.color && <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }} />}{cat.icon} {cat.name}</div></TableCell>
                      <TableCell className="text-muted-foreground">{cat.slug}</TableCell>
                      <TableCell><Badge variant={cat.is_active ? "default" : "secondary"}>{cat.is_active ? "Active" : "Inactive"}</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEditCategory(cat)}><Edit className="h-4 w-4" /></Button>
                        <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete?</AlertDialogTitle></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteCategory(cat.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="tags">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-orange-100 flex items-center justify-center"><Tag className="h-5 w-5 text-orange-600" /></div>
                <div><CardTitle>Promotional Tags</CardTitle><CardDescription>Manage tags</CardDescription></div>
              </div>
              <Dialog open={tagDialogOpen} onOpenChange={(o) => { setTagDialogOpen(o); if (!o) { setEditingTag(null); tagForm.reset(); } }}>
                <DialogTrigger asChild><Button><Plus className="h-4 w-4 mr-2" />Add Tag</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>{editingTag ? "Edit" : "Create"} Tag</DialogTitle></DialogHeader>
                  <Form {...tagForm}>
                    <form onSubmit={tagForm.handleSubmit(onSubmitTag)} className="space-y-4">
                      <FormField control={tagForm.control} name="name" render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={tagForm.control} name="slug" render={({ field }) => (<FormItem><FormLabel>Slug</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={tagForm.control} name="description" render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Textarea {...field} /></FormControl><FormMessage /></FormItem>)} />
                      <FormField control={tagForm.control} name="color" render={({ field }) => (<FormItem><FormLabel>Color</FormLabel><div className="flex gap-2"><Input type="color" {...field} className="w-14 h-10" /><Input value={field.value} onChange={field.onChange} /></div></FormItem>)} />
                      <FormField control={tagForm.control} name="is_active" render={({ field }) => (<FormItem className="flex items-center gap-2"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel>Active</FormLabel></FormItem>)} />
                      <div className="flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setTagDialogOpen(false)}>Cancel</Button><Button type="submit" disabled={saving}>{saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}{editingTag ? "Update" : "Create"}</Button></div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {loadingTags ? <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin" /></div> : (
              <Table>
                <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Slug</TableHead><TableHead>Preview</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                <TableBody>
                  {tags.map((tag) => (
                    <TableRow key={tag.id}>
                      <TableCell>{tag.name}</TableCell>
                      <TableCell className="text-muted-foreground">{tag.slug}</TableCell>
                      <TableCell><Badge style={{ backgroundColor: tag.color || "#3B82F6", color: "#fff" }}>{tag.name}</Badge></TableCell>
                      <TableCell><Badge variant={tag.is_active ? "default" : "secondary"}>{tag.is_active ? "Active" : "Inactive"}</Badge></TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleEditTag(tag)}><Edit className="h-4 w-4" /></Button>
                        <AlertDialog><AlertDialogTrigger asChild><Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Delete?</AlertDialogTitle></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteTag(tag.id)}>Delete</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
