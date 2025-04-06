
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, PencilLine, Trash2, Tag, Hash, Tags } from "lucide-react";
import { toast } from "sonner";

// Mock data for categories and tags
const mockCategories = [
  { id: "1", name: "Match Day", count: 24, slug: "match-day" },
  { id: "2", name: "Team Photos", count: 18, slug: "team-photos" },
  { id: "3", name: "Stadium", count: 12, slug: "stadium" },
  { id: "4", name: "Fans", count: 8, slug: "fans" },
  { id: "5", name: "Events", count: 15, slug: "events" },
];

const mockTags = [
  { id: "1", name: "match", count: 45 },
  { id: "2", name: "goal", count: 22 },
  { id: "3", name: "celebration", count: 18 },
  { id: "4", name: "team", count: 34 },
  { id: "5", name: "training", count: 12 },
  { id: "6", name: "stadium", count: 20 },
  { id: "7", name: "fans", count: 15 },
  { id: "8", name: "award", count: 8 },
  { id: "9", name: "interview", count: 10 },
  { id: "10", name: "highlight", count: 24 },
];

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState(mockCategories);
  const [tags, setTags] = useState(mockTags);
  
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [isEditCategoryOpen, setIsEditCategoryOpen] = useState(false);
  const [isDeleteCategoryOpen, setIsDeleteCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<typeof mockCategories[0] | null>(null);
  
  const [isAddTagOpen, setIsAddTagOpen] = useState(false);
  const [isEditTagOpen, setIsEditTagOpen] = useState(false);
  const [isDeleteTagOpen, setIsDeleteTagOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<typeof mockTags[0] | null>(null);
  
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newTagName, setNewTagName] = useState("");
  
  // Category CRUD operations
  const addCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const slug = newCategoryName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
      
    const newCategory = {
      id: Date.now().toString(),
      name: newCategoryName.trim(),
      slug,
      count: 0,
    };
    
    setCategories([...categories, newCategory]);
    setIsAddCategoryOpen(false);
    setNewCategoryName("");
    toast.success("Category added successfully");
  };
  
  const updateCategory = () => {
    if (!selectedCategory || !newCategoryName.trim()) return;
    
    const slug = newCategoryName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
      
    const updatedCategories = categories.map(category => 
      category.id === selectedCategory.id 
        ? { ...category, name: newCategoryName.trim(), slug } 
        : category
    );
    
    setCategories(updatedCategories);
    setIsEditCategoryOpen(false);
    setNewCategoryName("");
    toast.success("Category updated successfully");
  };
  
  const deleteCategory = () => {
    if (!selectedCategory) return;
    
    const updatedCategories = categories.filter(
      category => category.id !== selectedCategory.id
    );
    
    setCategories(updatedCategories);
    setIsDeleteCategoryOpen(false);
    setSelectedCategory(null);
    toast.success("Category deleted successfully");
  };
  
  // Tag CRUD operations
  const addTag = () => {
    if (!newTagName.trim()) return;
    
    const newTag = {
      id: Date.now().toString(),
      name: newTagName.trim().toLowerCase(),
      count: 0,
    };
    
    setTags([...tags, newTag]);
    setIsAddTagOpen(false);
    setNewTagName("");
    toast.success("Tag added successfully");
  };
  
  const updateTag = () => {
    if (!selectedTag || !newTagName.trim()) return;
    
    const updatedTags = tags.map(tag => 
      tag.id === selectedTag.id 
        ? { ...tag, name: newTagName.trim().toLowerCase() } 
        : tag
    );
    
    setTags(updatedTags);
    setIsEditTagOpen(false);
    setNewTagName("");
    toast.success("Tag updated successfully");
  };
  
  const deleteTag = () => {
    if (!selectedTag) return;
    
    const updatedTags = tags.filter(tag => tag.id !== selectedTag.id);
    
    setTags(updatedTags);
    setIsDeleteTagOpen(false);
    setSelectedTag(null);
    toast.success("Tag deleted successfully");
  };
  
  // Open edit dialogs with pre-filled data
  const openEditCategory = (category: typeof mockCategories[0]) => {
    setSelectedCategory(category);
    setNewCategoryName(category.name);
    setIsEditCategoryOpen(true);
  };
  
  const openDeleteCategory = (category: typeof mockCategories[0]) => {
    setSelectedCategory(category);
    setIsDeleteCategoryOpen(true);
  };
  
  const openEditTag = (tag: typeof mockTags[0]) => {
    setSelectedTag(tag);
    setNewTagName(tag.name);
    setIsEditTagOpen(true);
  };
  
  const openDeleteTag = (tag: typeof mockTags[0]) => {
    setSelectedTag(tag);
    setIsDeleteTagOpen(true);
  };
  
  return (
    <div className="space-y-6">
      <Tabs defaultValue="categories">
        <TabsList>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="tags" className="flex items-center gap-2">
            <Hash className="h-4 w-4" />
            Tags
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Media Categories</CardTitle>
                <CardDescription>
                  Manage categories for your media library
                </CardDescription>
              </div>
              <Button onClick={() => setIsAddCategoryOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Category
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead className="text-right">Items</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No categories found. Create your first category.
                      </TableCell>
                    </TableRow>
                  ) : (
                    categories.map((category) => (
                      <TableRow key={category.id}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant="secondary">{category.count}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openEditCategory(category)}
                            >
                              <PencilLine className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive"
                              onClick={() => openDeleteCategory(category)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tags" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Media Tags</CardTitle>
                <CardDescription>
                  Manage tags for your media library
                </CardDescription>
              </div>
              <Button onClick={() => setIsAddTagOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Tag
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-6">
                {tags.map(tag => (
                  <Badge 
                    key={tag.id} 
                    variant="outline"
                    className="py-2 px-3 text-sm flex items-center gap-2 group"
                  >
                    <span>{tag.name}</span>
                    <span className="text-xs text-muted-foreground">({tag.count})</span>
                    <div className="flex ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4"
                        onClick={() => openEditTag(tag)}
                      >
                        <PencilLine className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 text-destructive"
                        onClick={() => openDeleteTag(tag)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </Badge>
                ))}
                
                {tags.length === 0 && (
                  <div className="w-full py-8 text-center">
                    <Tags className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">No tags found. Add your first tag.</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  {tags.length} tags, {tags.reduce((sum, tag) => sum + tag.count, 0)} total items
                </p>
                <Button variant="outline" onClick={() => setIsAddTagOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Tag
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Add Category Dialog */}
      <Dialog open={isAddCategoryOpen} onOpenChange={setIsAddCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new category to organize your media
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="mb-4"
            />
            {newCategoryName && (
              <p className="text-sm text-muted-foreground">
                Slug: {newCategoryName
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)/g, "")}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddCategoryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addCategory}>Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Category Dialog */}
      <Dialog open={isEditCategoryOpen} onOpenChange={setIsEditCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update the category name and slug
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="mb-4"
            />
            {newCategoryName && (
              <p className="text-sm text-muted-foreground">
                Slug: {newCategoryName
                  .toLowerCase()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/(^-|-$)/g, "")}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditCategoryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={updateCategory}>Update Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Category Dialog */}
      <AlertDialog open={isDeleteCategoryOpen} onOpenChange={setIsDeleteCategoryOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the category "{selectedCategory?.name}"?
              {selectedCategory?.count > 0 && (
                <span className="block mt-2 font-semibold">
                  This category has {selectedCategory.count} items assigned to it.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={deleteCategory}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Add Tag Dialog */}
      <Dialog open={isAddTagOpen} onOpenChange={setIsAddTagOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Tag</DialogTitle>
            <DialogDescription>
              Create a new tag to label your media
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Tag name"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTagOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addTag}>Add Tag</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Tag Dialog */}
      <Dialog open={isEditTagOpen} onOpenChange={setIsEditTagOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
            <DialogDescription>
              Update the tag name
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Tag name"
              value={newTagName}
              onChange={(e) => setNewTagName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditTagOpen(false)}>
              Cancel
            </Button>
            <Button onClick={updateTag}>Update Tag</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Tag Dialog */}
      <AlertDialog open={isDeleteTagOpen} onOpenChange={setIsDeleteTagOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tag</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the tag "{selectedTag?.name}"?
              {selectedTag?.count > 0 && (
                <span className="block mt-2 font-semibold">
                  This tag is used on {selectedTag.count} items.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={deleteTag}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CategoryManager;
