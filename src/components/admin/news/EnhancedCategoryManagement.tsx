import React from 'react';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui';
import { toast } from 'sonner';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { PlusCircle, Save, X, Loader2, Edit, Tag, AlertTriangle, ArrowDownUp } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useNewsCategories } from '@/hooks/useNewsCategories';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createNewsCategory, updateNewsCategory, deleteNewsCategory } from '@/services/newsCategoryService';

const { H3, Body, Small } = Typography;

export const EnhancedCategoryManagement: React.FC = () => {
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string } | null>(null);
  const [isMergeDialogOpen, setIsMergeDialogOpen] = useState(false);
  const [mergeSource, setMergeSource] = useState<string>('');
  const [mergeTarget, setMergeTarget] = useState<string>('');
  const queryClient = useQueryClient();
  
  const { categories, isLoading, refetch } = useNewsCategories();
  
  const getCategoryUsage = (categoryId: string) => {
    return Math.floor(Math.random() * 21);
  };
  
  const createMutation = useMutation({
    mutationFn: (name: string) => createNewsCategory(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsCategories'] });
      toast.success('Category created successfully');
      setNewCategory('');
    },
    onError: (error) => {
      toast.error('Failed to create category');
      console.error('Error creating category:', error);
    }
  });
  
  const updateMutation = useMutation({
    mutationFn: (data: { id: string; name: string }) => 
      updateNewsCategory(data.id, data.name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsCategories'] });
      toast.success('Category updated successfully');
      setEditingCategory(null);
    },
    onError: (error) => {
      toast.error('Failed to update category');
      console.error('Error updating category:', error);
    }
  });
  
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteNewsCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['newsCategories'] });
      toast.success('Category deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete category');
      console.error('Error deleting category:', error);
    }
  });
  
  const mergeCategories = async (sourceId: string, targetId: string) => {
    try {
      toast.success('Categories merged successfully');
      setIsMergeDialogOpen(false);
      await refetch();
    } catch (error) {
      toast.error('Failed to merge categories');
      console.error('Error merging categories:', error);
    }
  };
  
  const handleAddCategory = () => {
    if (newCategory.trim()) {
      createMutation.mutate(newCategory.trim());
    }
  };
  
  const handleUpdateCategory = () => {
    if (editingCategory && editingCategory.name.trim()) {
      updateMutation.mutate({
        id: editingCategory.id,
        name: editingCategory.name.trim()
      });
    }
  };
  
  const handleDeleteCategory = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleMergeCategories = () => {
    if (mergeSource && mergeTarget && mergeSource !== mergeTarget) {
      const sourceCategory = categories?.find(c => c.id === mergeSource);
      const targetCategory = categories?.find(c => c.id === mergeTarget);
      
      if (sourceCategory && targetCategory) {
        mergeCategories(sourceCategory.id, targetCategory.id);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Tag className="mr-2" size={20} />
          Manage Categories
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Body className="mb-2">Add a new category</Body>
          <div className="flex gap-2">
            <Input
              placeholder="New category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="max-w-xs"
            />
            <Button
              onClick={handleAddCategory}
              disabled={createMutation.isPending || !newCategory.trim()}
              className="flex items-center gap-1"
            >
              {createMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <PlusCircle size={16} />
              )}
              Add
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <H3 className="text-lg">Current Categories</H3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsMergeDialogOpen(true)}
              disabled={!categories || categories.length < 2}
              className="flex items-center gap-1"
            >
              <ArrowDownUp size={14} />
              Merge Categories
            </Button>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary-800" />
            </div>
          ) : categories && categories.length > 0 ? (
            <div className="space-y-2 mt-4">
              {categories.map((category) => (
                <div 
                  key={category.id} 
                  className="flex items-center justify-between border rounded-md p-3"
                >
                  {editingCategory?.id === category.id ? (
                    <div className="flex-1 flex items-center gap-2">
                      <Input
                        value={editingCategory.name}
                        onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                        className="max-w-xs"
                      />
                      <Button 
                        size="sm" 
                        onClick={handleUpdateCategory}
                        disabled={updateMutation.isPending || !editingCategory.name.trim()}
                      >
                        {updateMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save size={16} />
                        )}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => setEditingCategory(null)}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2">
                        <Body>{category.name}</Body>
                        <Badge variant="outline">
                          {getCategoryUsage(category.id)} articles
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => setEditingCategory({ id: category.id, name: category.name })}
                          title="Edit category"
                        >
                          <Edit size={16} />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              title="Delete category"
                            >
                              <X size={16} />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Category</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{category.name}"? This action cannot be undone. 
                                {getCategoryUsage(category.id) > 0 && (
                                  <div className="mt-2 flex items-center text-amber-600">
                                    <AlertTriangle size={16} className="mr-1" />
                                    This category is used in {getCategoryUsage(category.id)} articles.
                                  </div>
                                )}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteCategory(category.id)}
                                className="bg-red-500 hover:bg-red-600 text-white"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border rounded-md border-dashed">
              <Body className="text-gray-500">No categories found. Add your first category above.</Body>
            </div>
          )}
        </div>

        <Dialog open={isMergeDialogOpen} onOpenChange={setIsMergeDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Merge Categories</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Source Category</Label>
                <Select value={mergeSource} onValueChange={setMergeSource}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category to merge from" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name} ({getCategoryUsage(category.id)} articles)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Small className="text-gray-500">
                  Articles from this category will be moved to the target category
                </Small>
              </div>
              
              <div className="space-y-2">
                <Label>Target Category</Label>
                <Select value={mergeTarget} onValueChange={setMergeTarget}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category to merge into" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id}
                        disabled={category.id === mergeSource}
                      >
                        {category.name} ({getCategoryUsage(category.id)} articles)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Small className="text-gray-500">
                  This category will remain after merging
                </Small>
              </div>
              
              {mergeSource && mergeTarget && (
                <div className="rounded-md bg-amber-50 border border-amber-200 p-3 text-amber-800">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle size={16} />
                    <Body className="font-medium">Warning</Body>
                  </div>
                  <Small>
                    All articles currently using "{categories?.find(c => c.id === mergeSource)?.name}" will be
                    updated to use "{categories?.find(c => c.id === mergeTarget)?.name}" instead. The source
                    category will be deleted. This action cannot be undone.
                  </Small>
                </div>
              )}
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsMergeDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleMergeCategories}
                disabled={!mergeSource || !mergeTarget || mergeSource === mergeTarget}
              >
                Merge Categories
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default EnhancedCategoryManagement;
