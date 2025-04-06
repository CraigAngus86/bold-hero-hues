
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Edit, Trash, Plus, Save, X, MoveRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
}

interface Tag {
  id: string;
  name: string;
  count: number;
}

const CategoryManager: React.FC = () => {
  // Placeholder data - in a real app, this would come from the database
  const [categories, setCategories] = useState<Category[]>([
    { id: '1', name: 'Match Day', slug: 'match-day', count: 24 },
    { id: '2', name: 'Team', slug: 'team', count: 18 },
    { id: '3', name: 'Stadium', slug: 'stadium', count: 12 },
    { id: '4', name: 'Fans', slug: 'fans', count: 8 },
  ]);
  
  const [tags, setTags] = useState<Tag[]>([
    { id: '1', name: 'goal', count: 15 },
    { id: '2', name: 'celebration', count: 12 },
    { id: '3', name: 'training', count: 8 },
    { id: '4', name: 'interview', count: 5 },
    { id: '5', name: 'trophy', count: 3 },
  ]);
  
  // State for the category form
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<{ id: string, name: string } | null>(null);
  
  // State for the tag form
  const [newTag, setNewTag] = useState('');
  const [editingTag, setEditingTag] = useState<{ id: string, name: string } | null>(null);
  
  // State for merge dialog
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false);
  const [mergeSource, setMergeSource] = useState<string>('');
  const [mergeTarget, setMergeTarget] = useState<string>('');
  const [mergeType, setMergeType] = useState<'category' | 'tag'>('category');

  // Add a new category
  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }
    
    // Simple slug generation
    const slug = newCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    const newCat = {
      id: Math.random().toString(36).substr(2, 9),
      name: newCategory,
      slug,
      count: 0,
    };
    
    setCategories([...categories, newCat]);
    setNewCategory('');
    toast.success('Category added successfully');
  };
  
  // Update a category
  const handleUpdateCategory = (id: string) => {
    if (!editingCategory || !editingCategory.name.trim()) {
      toast.error('Category name cannot be empty');
      return;
    }
    
    setCategories(categories.map(cat => 
      cat.id === id 
        ? { 
          ...cat, 
          name: editingCategory.name,
          slug: editingCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        }
        : cat
    ));
    
    setEditingCategory(null);
    toast.success('Category updated successfully');
  };
  
  // Delete a category
  const handleDeleteCategory = (id: string) => {
    // In a real app, check if the category is in use
    const category = categories.find(c => c.id === id);
    
    if (category && category.count > 0) {
      toast.error(`Cannot delete category '${category.name}' because it's used by ${category.count} media items`);
      return;
    }
    
    setCategories(categories.filter(cat => cat.id !== id));
    toast.success('Category deleted successfully');
  };
  
  // Add a new tag
  const handleAddTag = () => {
    if (!newTag.trim()) {
      toast.error('Tag name cannot be empty');
      return;
    }
    
    const newTagObj = {
      id: Math.random().toString(36).substr(2, 9),
      name: newTag.toLowerCase(),
      count: 0,
    };
    
    setTags([...tags, newTagObj]);
    setNewTag('');
    toast.success('Tag added successfully');
  };
  
  // Update a tag
  const handleUpdateTag = (id: string) => {
    if (!editingTag || !editingTag.name.trim()) {
      toast.error('Tag name cannot be empty');
      return;
    }
    
    setTags(tags.map(tag => 
      tag.id === id ? { ...tag, name: editingTag.name.toLowerCase() } : tag
    ));
    
    setEditingTag(null);
    toast.success('Tag updated successfully');
  };
  
  // Delete a tag
  const handleDeleteTag = (id: string) => {
    // In a real app, check if the tag is in use
    const tag = tags.find(t => t.id === id);
    
    if (tag && tag.count > 0) {
      toast.error(`Cannot delete tag '${tag.name}' because it's used by ${tag.count} media items`);
      return;
    }
    
    setTags(tags.filter(tag => tag.id !== id));
    toast.success('Tag deleted successfully');
  };
  
  // Handle merging categories or tags
  const handleMerge = () => {
    if (mergeSource === mergeTarget) {
      toast.error('Source and target cannot be the same');
      return;
    }
    
    if (mergeType === 'category') {
      const sourceCategory = categories.find(c => c.id === mergeSource);
      const targetCategory = categories.find(c => c.id === mergeTarget);
      
      if (!sourceCategory || !targetCategory) return;
      
      // Update the target category count (in a real app, this would reassign media items)
      const updatedCategories = categories.map(cat => 
        cat.id === mergeTarget 
          ? { ...cat, count: cat.count + sourceCategory.count }
          : cat
      ).filter(cat => cat.id !== mergeSource);
      
      setCategories(updatedCategories);
    } else {
      const sourceTag = tags.find(t => t.id === mergeSource);
      const targetTag = tags.find(t => t.id === mergeTarget);
      
      if (!sourceTag || !targetTag) return;
      
      // Update the target tag count (in a real app, this would reassign media items)
      const updatedTags = tags.map(tag => 
        tag.id === mergeTarget 
          ? { ...tag, count: tag.count + sourceTag.count }
          : tag
      ).filter(tag => tag.id !== mergeSource);
      
      setTags(updatedTags);
    }
    
    setMergeDialogOpen(false);
    toast.success(`Successfully merged items`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Categories Management */}
      <Card>
        <CardHeader>
          <CardTitle>Categories</CardTitle>
          <CardDescription>
            Organize media into categories for easier navigation
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-right">Count</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    {editingCategory && editingCategory.id === category.id ? (
                      <Input
                        value={editingCategory.name}
                        onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                        className="w-full"
                      />
                    ) : (
                      category.name
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {category.slug}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline">{category.count}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end space-x-1">
                      {editingCategory && editingCategory.id === category.id ? (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleUpdateCategory(category.id)}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setEditingCategory(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setEditingCategory({ id: category.id, name: category.name })}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteCategory(category.id)}
                            disabled={category.count > 0}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between pt-6">
          <div className="flex gap-2 flex-1">
            <Input
              placeholder="New category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAddCategory}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Tags Management */}
      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
          <CardDescription>
            Add tags to make media items easily searchable
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Count</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell>
                    {editingTag && editingTag.id === tag.id ? (
                      <Input
                        value={editingTag.name}
                        onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                        className="w-full"
                      />
                    ) : (
                      tag.name
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline">{tag.count}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end space-x-1">
                      {editingTag && editingTag.id === tag.id ? (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleUpdateTag(tag.id)}
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setEditingTag(null)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setEditingTag({ id: tag.id, name: tag.name })}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleDeleteTag(tag.id)}
                            disabled={tag.count > 0}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-between pt-6">
          <div className="flex gap-2 flex-1">
            <Input
              placeholder="New tag name"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAddTag}>
              <Plus className="h-4 w-4 mr-2" />
              Add
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      {/* Merge Tool */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Merge Tool</CardTitle>
          <CardDescription>
            Combine categories or tags and reassign their media items
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-full">
              <Select onValueChange={setMergeType} defaultValue="category">
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="category">Categories</SelectItem>
                  <SelectItem value="tag">Tags</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="outline" 
              onClick={() => setMergeDialogOpen(true)}
              className="w-full sm:w-auto"
            >
              Open Merge Tool
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Merge Dialog */}
      <Dialog open={mergeDialogOpen} onOpenChange={setMergeDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Merge {mergeType === 'category' ? 'Categories' : 'Tags'}
            </DialogTitle>
            <DialogDescription>
              All media items assigned to the source {mergeType} will be reassigned to the target.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="source">Source {mergeType} (will be deleted)</label>
              <Select onValueChange={setMergeSource}>
                <SelectTrigger id="source">
                  <SelectValue placeholder={`Select source ${mergeType}`} />
                </SelectTrigger>
                <SelectContent>
                  {mergeType === 'category' 
                    ? categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name} ({cat.count} items)
                        </SelectItem>
                      ))
                    : tags.map(tag => (
                        <SelectItem key={tag.id} value={tag.id}>
                          {tag.name} ({tag.count} items)
                        </SelectItem>
                      ))
                  }
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-center">
              <MoveRight className="h-6 w-6 text-muted-foreground" />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="target">Target {mergeType} (will be kept)</label>
              <Select onValueChange={setMergeTarget}>
                <SelectTrigger id="target">
                  <SelectValue placeholder={`Select target ${mergeType}`} />
                </SelectTrigger>
                <SelectContent>
                  {mergeType === 'category' 
                    ? categories.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name} ({cat.count} items)
                        </SelectItem>
                      ))
                    : tags.map(tag => (
                        <SelectItem key={tag.id} value={tag.id}>
                          {tag.name} ({tag.count} items)
                        </SelectItem>
                      ))
                  }
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setMergeDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleMerge}
              disabled={!mergeSource || !mergeTarget || mergeSource === mergeTarget}
            >
              Merge {mergeType === 'category' ? 'Categories' : 'Tags'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryManager;
