
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { 
  File, 
  FileText, 
  Upload, 
  Loader2, 
  Trash, 
  Download, 
  Plus,
  CalendarIcon,
  FileType,
  FileArchive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

import { 
  fetchSponsorDocuments, 
  createSponsorDocument, 
  deleteSponsorDocument 
} from '@/services/sponsorsService';
import { SponsorDocument } from '@/types/sponsors';

// Mock document upload function - in a real implementation, this would use storage services
const uploadDocument = async (file: File): Promise<string> => {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`/documents/sponsors/${file.name}`);
    }, 1000);
  });
};

const documentSchema = z.object({
  name: z.string().min(2, "Document name is required"),
  document_type: z.enum(['contract', 'invoice', 'receipt', 'other']),
  upload_date: z.date(),
  file: z.instanceof(File).optional(),
});

interface SponsorDocumentsManagerProps {
  sponsorId: string;
}

const SponsorDocumentsManager: React.FC<SponsorDocumentsManagerProps> = ({ sponsorId }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const queryClient = useQueryClient();
  
  const { data: documents = [], isLoading } = useQuery({
    queryKey: ['sponsorDocuments', sponsorId],
    queryFn: async () => {
      const response = await fetchSponsorDocuments(sponsorId);
      if (!response.success) {
        throw new Error(response.error?.message || 'Failed to load documents');
      }
      return response.data;
    },
  });
  
  const form = useForm<z.infer<typeof documentSchema>>({
    resolver: zodResolver(documentSchema),
    defaultValues: {
      name: '',
      document_type: 'contract',
      upload_date: new Date(),
    },
  });
  
  // Form mutations
  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof documentSchema>) => {
      let filePath = '';
      
      if (selectedFile) {
        // In a real implementation, upload the file to storage
        filePath = await uploadDocument(selectedFile);
      } else {
        throw new Error('No file selected');
      }
      
      // Create the document record
      const docData = {
        sponsor_id: sponsorId,
        name: data.name,
        document_type: data.document_type,
        upload_date: data.upload_date.toISOString(),
        file_path: filePath,
      };
      
      return createSponsorDocument(docData);
    },
    onSuccess: () => {
      toast.success('Document uploaded successfully');
      queryClient.invalidateQueries({ queryKey: ['sponsorDocuments', sponsorId] });
      resetAndCloseDialog();
    },
    onError: (error) => {
      toast.error(`Failed to upload document: ${error.message}`);
    },
  });
  
  const deleteMutation = useMutation({
    mutationFn: (id: string) => {
      return deleteSponsorDocument(id);
    },
    onSuccess: () => {
      toast.success('Document deleted');
      queryClient.invalidateQueries({ queryKey: ['sponsorDocuments', sponsorId] });
    },
    onError: (error) => {
      toast.error(`Failed to delete document: ${error.message}`);
    },
  });
  
  const resetAndCloseDialog = () => {
    form.reset({
      name: '',
      document_type: 'contract',
      upload_date: new Date(),
    });
    setSelectedFile(null);
    setIsDialogOpen(false);
  };
  
  const onSubmit = async (data: z.infer<typeof documentSchema>) => {
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }
    
    createMutation.mutate(data);
  };
  
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      deleteMutation.mutate(id);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Auto-populate the name field with the file name if empty
      if (!form.getValues('name')) {
        // Remove extension from filename
        const fileName = file.name.replace(/\.[^/.]+$/, '');
        form.setValue('name', fileName);
      }
    }
  };
  
  const renderDocumentTypeIcon = (type: string) => {
    switch (type) {
      case 'contract':
        return <FileText className="h-5 w-5 text-blue-600" />;
      case 'invoice':
        return <FileType className="h-5 w-5 text-green-600" />;
      case 'receipt':
        return <File className="h-5 w-5 text-amber-600" />;
      default:
        return <FileArchive className="h-5 w-5 text-gray-600" />;
    }
  };
  
  // Mock function for document download - in a real implementation, this would fetch from storage
  const handleDownload = (document: SponsorDocument) => {
    toast.info(`Downloading ${document.name}...`);
    // In a real implementation, this would trigger a file download
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Documents</h3>
        <Button onClick={() => setIsDialogOpen(true)} size="sm">
          <Plus className="mr-2 h-4 w-4" /> Upload Document
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center p-8 border rounded-md bg-muted/10">
          <FileText className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">No Documents Yet</h3>
          <p className="text-muted-foreground mb-4">
            Upload contracts, invoices, or other documents related to this sponsor
          </p>
          <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
            <Upload className="mr-2 h-4 w-4" /> Upload First Document
          </Button>
        </div>
      ) : (
        <div className="border rounded-md p-4 space-y-4 max-h-[500px] overflow-y-auto">
          {documents.map((doc) => (
            <div key={doc.id} className="flex gap-4 p-3 border-b last:border-0 hover:bg-gray-50 rounded-md">
              <div className="flex-shrink-0 p-2 rounded-full bg-gray-100">
                {renderDocumentTypeIcon(doc.document_type)}
              </div>
              
              <div className="flex-grow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{doc.name}</h4>
                    <p className="text-sm text-gray-600">
                      {doc.document_type.charAt(0).toUpperCase() + doc.document_type.slice(1)} • 
                      {' '}
                      {format(new Date(doc.upload_date), 'PPP')}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-blue-500 hover:bg-blue-50"
                      onClick={() => handleDownload(doc)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-red-500 hover:bg-red-50"
                      onClick={() => handleDelete(doc.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <input
                  id="document-file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {selectedFile ? (
                  <div className="space-y-2">
                    <FileText className="h-10 w-10 mx-auto text-primary" />
                    <p className="font-medium">{selectedFile.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedFile(null)}
                    >
                      Remove File
                    </Button>
                  </div>
                ) : (
                  <div 
                    className="cursor-pointer"
                    onClick={() => document.getElementById('document-file')?.click()}
                  >
                    <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm font-medium">
                      Click to select a document to upload
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PDF, Word, Excel or image files
                    </p>
                  </div>
                )}
              </div>
              
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Name*</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Sponsorship Contract 2023" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="document_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Document Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="invoice">Invoice</SelectItem>
                          <SelectItem value="receipt">Receipt</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="upload_date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date*</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormDescription className="text-center">
                Note: Document upload is simulated in this demo.
                In a production environment, files would be stored in Supabase Storage.
              </FormDescription>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetAndCloseDialog}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending || !selectedFile}
                >
                  {createMutation.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Upload Document
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SponsorDocumentsManager;
