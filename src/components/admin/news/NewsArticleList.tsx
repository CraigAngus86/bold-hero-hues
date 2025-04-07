
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { fetchNewsArticles, deleteNewsArticle, toggleArticleFeatured } from '@/services/newsService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, Search, Edit, Trash2, Star, Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { NewsArticle } from '@/types/news';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format } from 'date-fns';

interface EnhancedNewsArticleListProps {
  onEdit: (article: NewsArticle) => void;
  onCreateNew: () => void;
}

export const EnhancedNewsArticleList: React.FC<EnhancedNewsArticleListProps> = ({ 
  onEdit,
  onCreateNew 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['news'],
    queryFn: () => fetchNewsArticles({
      orderBy: sortOrder
    })
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    
    try {
      const result = await deleteNewsArticle(id);
      if (result.success) {
        toast.success('Article deleted successfully');
        refetch();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error(`Failed to delete article: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleToggleFeatured = async (article: NewsArticle) => {
    try {
      const result = await toggleArticleFeatured(article.id, !article.is_featured);
      if (result.success) {
        toast.success(`Article ${result.data?.is_featured ? 'featured' : 'unfeatured'} successfully`);
        refetch();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error(`Failed to update article: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(prev => prev.filter(t => t !== tag));
    } else {
      setSelectedTags(prev => [...prev, tag]);
    }
  };

  const articles = data?.data as NewsArticle[] || [];

  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  ).filter(article => selectedTags.length === 0 || selectedTags.includes(article.category));

  const columns: ColumnDef<NewsArticle>[] = [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "publish_date",
      header: "Published",
      cell: ({ row }) => {
        const date = new Date(row.getValue("publish_date"))
        const formattedDate = format(date, 'MM/dd/yyyy');
        return <div>{formattedDate}</div>
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const article = row.original;
        const isPublished = article.publish_date && new Date(article.publish_date) <= new Date();
        return (
          <Badge variant={isPublished ? "default" : "secondary"}>
            {isPublished ? 'Published' : 'Draft'}
          </Badge>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const article = row.original;
        const [open, setOpen] = React.useState(false)

        return (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleToggleFeatured(article)}>
                  <Star className="mr-2 h-4 w-4" />
                  {article.is_featured ? 'Unfeature' : 'Feature'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(article)}>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setOpen(true)}>
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <AlertDialog open={open} onOpenChange={setOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the article from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => {
                    handleDelete(article.id);
                    setOpen(false);
                  }}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )
      },
    },
  ]

  const table = useReactTable({
    data: filteredArticles,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const availableTags = [...new Set(articles.map(article => article.category))];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>Articles</CardTitle>
        <Button onClick={onCreateNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Article
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search articles..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-8"
            />
          </div>
        </div>

        <div className="flex items-center justify-between py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} of {table.getCoreRowModel().rows.length} row(s)
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>

        {isFilterOpen && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="col-span-4">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex flex-wrap gap-1 mt-2">
                {availableTags.map((tag) => (
                  <Button
                    key={tag}
                    variant="outline"
                    size="sm"
                    className={cn(
                      "border-2 rounded-full",
                      selectedTags.includes(tag)
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-input"
                    )}
                    onClick={() => handleTagToggle(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">
            Error loading articles: {error instanceof Error ? error.message : 'Unknown error'}
          </div>
        ) : filteredArticles && filteredArticles.length > 0 ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No articles found. {searchQuery ? 'Try a different search term.' : 'Create your first article to get started.'}
          </div>
        )}
        <div className="flex items-center justify-between px-2">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredRowModel().rows.length} of {table.getCoreRowModel().rows.length} row(s)
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedNewsArticleList;
