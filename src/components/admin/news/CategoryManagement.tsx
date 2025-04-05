
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Typography } from '@/components/ui';
import { toast } from 'sonner';
import { PlusCircle, Save, X, Loader2, Edit, Tag } from 'lucide-react';
import { useNewsCategories } from '@/hooks/useNewsCategories';
import { createNewsCategory, updateNewsCategory, deleteNewsCategory } from '@/services/newsCategoryService';

const { H3, Body, Small } = Typography;

export const CategoryManagement: React.FC = () => {
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<{ id: string; name: string } | null>(null);
  const queryClient = useQueryClient();
  
  const { categories, isLoading } = useNewsCategories();
  
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

        <div className="space-y-2">
          <H3 className="text-lg">Current Categories</H3>
          {isLoading ? (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary-800" />
            </div>
          ) : categories && categories.length > 0 ? (
            <div className="space-y-2 mt-4">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center justify-between border rounded-md p-2">
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
                      <Body>{category.name}</Body>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => setEditingCategory({ id: category.id, name: category.name })}
                        >
                          <Edit size={16} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteCategory(category.id)}
                          disabled={deleteMutation.isPending}
                        >
                          {deleteMutation.isPending && deleteMutation.variables === category.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <X size={16} />
                          )}
                        </Button>
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
      </CardContent>
    </Card>
  );
};
