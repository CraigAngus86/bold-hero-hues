
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload, Image, FileText, File, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// Define schema for file upload form
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  altText: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

const MediaUploader = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [tagInput, setTagInput] = useState("");

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      altText: "",
      description: "",
      category: "",
      tags: [],
    },
  });

  // Handle form submission
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (files.length === 0) {
      toast.error("Please select at least one file to upload");
      return;
    }

    setIsUploading(true);
    
    // Mock upload progress for demo
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            setFiles([]);
            form.reset();
            toast.success(`Successfully uploaded ${files.length} file(s)`);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prevFiles => [...prevFiles, ...selectedFiles]);
      
      // If the first file is added, set title to the file name
      if (files.length === 0 && form.getValues("title") === "") {
        const fileName = selectedFiles[0].name.split('.').slice(0, -1).join('.');
        form.setValue("title", fileName);
      }
    }
  };

  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFiles(prevFiles => [...prevFiles, ...droppedFiles]);
      
      // If the first file is added, set title to the file name
      if (files.length === 0 && form.getValues("title") === "") {
        const fileName = droppedFiles[0].name.split('.').slice(0, -1).join('.');
        form.setValue("title", fileName);
      }
    }
  };

  // Handle file drag events
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };

  // Handle tag input
  const addTag = () => {
    if (!tagInput.trim()) return;
    
    const newTag = tagInput.trim().toLowerCase();
    const currentTags = form.getValues("tags");
    
    if (!currentTags.includes(newTag)) {
      form.setValue("tags", [...currentTags, newTag]);
    }
    
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    const currentTags = form.getValues("tags");
    form.setValue("tags", currentTags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  // Remove file from list
  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="upload">
        <TabsList>
          <TabsTrigger value="upload">Upload Files</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Media Files</CardTitle>
              <CardDescription>Upload images and videos to your media library</CardDescription>
            </CardHeader>
            <CardContent>
              {/* File Drop Zone */}
              <div 
                className={`rounded-lg border-2 border-dashed p-10 ${
                  dragActive ? "border-primary/70 bg-primary/5" : "border-gray-300 dark:border-gray-700"
                } flex flex-col items-center justify-center cursor-pointer mb-6`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById("fileInput")?.click()}
              >
                <Upload className="h-12 w-12 text-gray-400 mb-2" />
                <p className="text-lg font-medium mb-1">Drag & drop files here</p>
                <p className="text-sm text-gray-500 mb-3">Or click to browse</p>
                <p className="text-xs text-gray-400 max-w-sm text-center">
                  Supports JPG, PNG, GIF, WebP, SVG images up to 5MB each, 
                  and MP4, WebM videos up to 50MB each
                </p>
                <input 
                  type="file" 
                  id="fileInput" 
                  className="hidden" 
                  multiple 
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                />
              </div>

              {/* Selected Files Preview */}
              {files.length > 0 && (
                <div className="mb-6 space-y-4">
                  <h3 className="text-sm font-medium">Selected Files ({files.length})</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {files.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-md overflow-hidden bg-gray-100 border">
                          {file.type.startsWith('image/') ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="w-full h-full object-cover"
                            />
                          ) : file.type.startsWith('video/') ? (
                            <div className="w-full h-full flex items-center justify-center">
                              <FileText className="h-12 w-12 text-gray-400" />
                            </div>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <File className="h-12 w-12 text-gray-400" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              className="h-8 w-8 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeFile(index);
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs truncate mt-1">{file.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* File Metadata Form */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Media title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="altText"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Alt Text</FormLabel>
                            <FormControl>
                              <Input placeholder="Describe this media" {...field} />
                            </FormControl>
                            <FormDescription>
                              For accessibility and SEO
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="matchday">Match Day</SelectItem>
                                <SelectItem value="team">Team</SelectItem>
                                <SelectItem value="stadium">Stadium</SelectItem>
                                <SelectItem value="fans">Fans</SelectItem>
                                <SelectItem value="events">Events</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe this media in detail" 
                              rows={3} 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tags"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tags</FormLabel>
                          <div className="space-y-2">
                            <div className="flex flex-wrap gap-2 mb-2">
                              {field.value.map((tag) => (
                                <Badge key={tag} variant="secondary">
                                  {tag}
                                  <X
                                    className="ml-1 h-3 w-3 cursor-pointer"
                                    onClick={() => removeTag(tag)}
                                  />
                                </Badge>
                              ))}
                            </div>
                            <div className="flex space-x-2">
                              <Input
                                placeholder="Add tag"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                              />
                              <Button
                                type="button"
                                variant="outline"
                                onClick={addTag}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <FormDescription>
                            Press Enter or click the + button to add a tag
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Progress Bar (when uploading) */}
                  {isUploading && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                        <div
                          className="bg-primary h-2.5 transition-all duration-300 ease-out"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button
                      type="submit"
                      disabled={isUploading || files.length === 0}
                    >
                      {isUploading ? "Uploading..." : "Upload Files"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Upload</CardTitle>
              <CardDescription>Upload multiple files with batch processing</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center h-48 text-center">
                <div>
                  <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">
                    Bulk upload functionality coming soon
                  </p>
                  <Button disabled>Coming Soon</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MediaUploader;
