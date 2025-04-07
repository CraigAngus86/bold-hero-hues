
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import {
  createSponsorContact,
  fetchSponsorContacts,
  updateSponsorContact,
  deleteSponsorContact,
} from '@/services/sponsorsService';
import { SponsorContact } from '@/types/sponsors';
import { useAuth } from '@/hooks/useAuth';

interface SponsorContactsManagerProps {
  sponsorId: string;
}

const SponsorContactsManager: React.FC<SponsorContactsManagerProps> = ({ sponsorId }) => {
  const [contacts, setContacts] = useState<SponsorContact[]>([]);
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedContact, setSelectedContact] = useState<SponsorContact | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    phone: '',
    primary_contact: false,
    notes: ''
  });

  useEffect(() => {
    loadContacts();
  }, [sponsorId]);

  const loadContacts = async () => {
    try {
      const response = await fetchSponsorContacts(sponsorId);
      if (response.success && response.data) {
        setContacts(response.data);
      } else {
        toast.error(response.error || 'Failed to load contacts');
      }
    } catch (error) {
      console.error('Error loading contacts:', error);
      toast.error('Failed to load contacts');
    }
  };

  const handleOpenAddDialog = () => {
    setFormData({
      name: '',
      role: '',
      email: '',
      phone: '',
      primary_contact: false,
      notes: ''
    });
    setIsEditing(false);
    setIsAddingContact(true);
  };

  const handleOpenEditDialog = (contact: SponsorContact) => {
    setSelectedContact(contact);
    setFormData({
      name: contact.name,
      role: contact.role || '',
      email: contact.email || '',
      phone: contact.phone || '',
      primary_contact: contact.primary_contact || false,
      notes: contact.notes || ''
    });
    setIsEditing(true);
    setIsAddingContact(true);
  };

  const handleCloseDialog = () => {
    setIsAddingContact(false);
    setSelectedContact(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      primary_contact: checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Contact name is required');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (isEditing && selectedContact) {
        // Update existing contact
        await updateSponsorContact(selectedContact.id, {
          ...selectedContact,
          name: formData.name,
          role: formData.role,
          email: formData.email,
          phone: formData.phone,
          primary_contact: formData.primary_contact,
          notes: formData.notes
        });
        toast.success('Contact updated successfully');
      } else {
        // Add new contact
        await createSponsorContact({
          sponsor_id: sponsorId,
          name: formData.name,
          role: formData.role,
          email: formData.email,
          phone: formData.phone,
          primary_contact: formData.primary_contact,
          notes: formData.notes
        });
        toast.success('Contact added successfully');
      }
      
      await loadContacts();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving contact:', error);
      toast.error('Failed to save contact');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) {
      return;
    }
    
    try {
      await deleteSponsorContact(contactId);
      await loadContacts();
      toast.success('Contact deleted successfully');
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Failed to delete contact');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Contacts</h3>
        <Button onClick={handleOpenAddDialog} size="sm">
          Add Contact
        </Button>
      </div>

      {contacts.length === 0 ? (
        <div className="text-center p-4 border border-dashed rounded-md">
          <p className="text-gray-500">No contacts added yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map((contact) => (
            <div
              key={contact.id}
              className="p-3 border rounded-md bg-white hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {contact.name}
                    {contact.primary_contact && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                        Primary
                      </span>
                    )}
                  </div>
                  {contact.role && (
                    <p className="text-sm text-gray-600">{contact.role}</p>
                  )}
                  {(contact.email || contact.phone) && (
                    <div className="text-sm mt-1">
                      {contact.email && (
                        <p className="text-gray-600">
                          <span className="font-medium">Email:</span> {contact.email}
                        </p>
                      )}
                      {contact.phone && (
                        <p className="text-gray-600">
                          <span className="font-medium">Phone:</span> {contact.phone}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenEditDialog(contact)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-800"
                    onClick={() => handleDeleteContact(contact.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
              {contact.notes && (
                <div className="mt-2 pt-2 border-t text-sm text-gray-600">
                  <p className="whitespace-pre-wrap">{contact.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <Dialog open={isAddingContact} onOpenChange={setIsAddingContact}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Contact' : 'Add New Contact'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role / Position</Label>
                  <Input
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="primary_contact"
                    checked={formData.primary_contact}
                    onCheckedChange={handleCheckboxChange}
                  />
                  <Label htmlFor="primary_contact" className="cursor-pointer">
                    Primary contact for this sponsor
                  </Label>
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    className="resize-none h-20"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseDialog}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Contact'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SponsorContactsManager;
