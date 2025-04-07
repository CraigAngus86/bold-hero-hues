import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { File, Download, Trash2, FileText, FileContract, Receipt, FileSignature } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import {
  addSponsorDocument,
  getSponsorDocuments,
  deleteSponsorDocument,
  downloadSponsorDocument,
} from '@/services/sponsorsService';

interface SponsorDocumentsManagerProps {
  sponsorId: string;
}

const SponsorDocumentsManager: React.FC<SponsorDocumentsManagerProps> = ({ sponsorId }) => {
  const [documents, setDocuments] = useState<any[]>([]);
  const [newDocument, setNewDocument] = useState({ name: '', type: 'contract', file: null });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { auth } = useAuth();

  useEffect(() => {
    loadDocuments();
  }, [sponsorId]);

  const loadDocuments = async () => {
    setIsLoading(true);
    try {
      const response = await getSponsorDocuments(sponsorId);
      if (response.success) {
        setDocuments(response.data);
      } else {
        toast.error(response.error || 'Failed to load documents');
      }
    } catch (error) {
      console.error('Error loading documents:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNewDocument({ ...newDocument, file: e.target.files[0] });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewDocument({ ...newDocument, [e.target.name]: e.target.value });
  };

  const handleAddDocument = async () => {
    if (!newDocument.name || !newDocument.file) {
      toast.error('Please provide a name and select a file');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('sponsor_id', sponsorId);
      formData.append('name', newDocument.name);
      formData.append('type', newDocument.type);
      formData.append('file', newDocument.file);
      formData.append('created_by', auth.user?.id || 'system');

      const response = await addSponsorDocument(formData);
      if (response.success) {
        toast.success('Document added successfully');
        await loadDocuments();
        setNewDocument({ name: '', type: 'contract', file: null });
      } else {
        toast.error(response.error || 'Failed to add document');
      }
    } catch (error) {
      console.error('Error adding document:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async (doc: any) => {
    try {
      const response = await downloadSponsorDocument(doc.id);
      if (response.success && response.data) {
        const url = response.data.url;
        window.open(url, '_blank');
      } else {
        toast.error(response.error || 'Failed to download document');
      }
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await deleteSponsorDocument(documentId);
      if (response.success) {
        toast.success('Document deleted successfully');
        await loadDocuments();
      } else {
        toast.error(response.error || 'Failed to delete document');
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">Manage Documents</h3>

      <div className="mb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="documentName">Document Name</Label>
            <Input
              type="text"
              id="documentName"
              name="name"
              value={newDocument.name}
              onChange={handleInputChange}
              placeholder="Document Name"
            />
          </div>
          <div>
            <Label htmlFor="documentType">Document Type</Label>
            <select
              id="documentType"
              name="type"
              value={newDocument.type}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="contract">Contract</option>
              <option value="invoice">Invoice</option>
              <option value="agreement">Agreement</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <Label htmlFor="documentFile">Choose File</Label>
            <Input
              type="file"
              id="documentFile"
              onChange={handleFileChange}
            />
          </div>
        </div>
        <Button
          onClick={handleAddDocument}
          disabled={isSubmitting}
          className="mt-4"
        >
          {isSubmitting ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            <>
              <File className="mr-2 h-4 w-4" />
              Add Document
            </>
          )}
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading documents...</div>
      ) : documents.length === 0 ? (
        <div className="text-center py-4">No documents found.</div>
      ) : (
        <div>
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between p-3 border rounded mb-2 bg-white hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="text-gray-500">
                  {getDocumentTypeIcon(doc.type)}
                </div>
                <div>
                  <p className="font-medium">{doc.name}</p>
                  <p className="text-xs text-gray-500">{formatDistanceToNow(new Date(doc.created_at), { addSuffix: true })}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleDownload(doc)}>
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-800" onClick={() => handleDeleteDocument(doc.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Helper function for getting document type icons
  function getDocumentTypeIcon(type: string) {
    switch (type) {
      case 'contract':
        return <FileContract className="h-5 w-5" />;
      case 'invoice':
        return <Receipt className="h-5 w-5" />;
      case 'agreement':
        return <FileSignature className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };
};

export default SponsorDocumentsManager;
