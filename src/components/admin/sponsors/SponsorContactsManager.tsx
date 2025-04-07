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
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import {
  addSponsorContact,
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
  const { auth } = useAuth();

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

  const handleAddContact = async (values: any) => {
    try {
      setIsSubmitting(true);
      
      const contactData = {
        sponsor_id: sponsorId,
        name: values.name,
        role: values.role,
        email: values.email,
        phone: values.phone,
        primary_contact: values.primary_contact || false, // Ensure it's never undefined
        notes: values.notes,
      };
      
      await addSponsorContact(contactData as any);
      
      setContacts(prev => [
        ...prev,
        { ...contactData, id: Date.now().toString() }
      ]);
      
      toast.success('Contact added successfully');
      onClose();
    } catch (error: any) {
      toast.error(error.error || 'Failed to add contact');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditContact = async (values: any) => {
    if (!selectedContact) return;

    try {
      setIsSubmitting(true);

      const updatedContactData = {
        ...selectedContact,
        name: values.name,
        role: values.role,
        email: values.email,
        phone: values.phone,
        primary_contact: values.primary_contact,
        notes: values.notes,
      };

      await updateSponsorContact(selectedContact.id, updatedContactData);

      setContacts(prev =>
        prev.map(contact =>
          contact.id === selectedContact.id ? updatedContactData : contact
        )
      );

      toast.success('Contact updated successfully');
      onClose();
    } catch (error: any) {
      toast.error(error.error || 'Failed to update contact');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      setIsSubmitting(true);
      await deleteSponsorContact(contactId);
      setContacts(prev => prev.filter(contact => contact.id !== contactId));
      toast.success('Contact deleted successfully');
    } catch (error: any) {
      toast.error(error.error || 'Failed to delete contact');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onOpenChange = (open: boolean) => {
    setIsAddingContact(open);
    if (!open) {
      setSelectedContact(null);
      setIsEditing(false);
    }
  };

  const onClose = () => {
    setIsAddingContact(false);
    setSelectedContact(null);
    setIsEditing(false);
  };

  const handleOpenEditDialog = (contact: SponsorContact) => {
    setSelectedContact(contact);
    setIsEditing(true);
    setIsAddingContact(true);
  };

  return (
    <div>
      <CardHeader>
        <CardTitle>Sponsor Contacts</CardTitle>
        <CardDescription>
          Manage contacts associated with this sponsor.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Dialog open={isAddingContact} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsAddingContact(true)}>Add Contact</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{isEditing ? 'Edit Contact' : 'Add New Contact'}</DialogTitle>
                <DialogDescription>
                  {isEditing ? 'Update contact details.' : 'Enter details for the new contact.'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    defaultValue={selectedContact?.name || ''}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Input
                    id="role"
                    defaultValue={selectedContact?.role || ''}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={selectedContact?.email || ''}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="phone" className="text-right">
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    defaultValue={selectedContact?.phone || ''}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="notes" className="text-right mt-2">
                    Notes
                  </Label>
                  <Textarea
                    id="notes"
                    defaultValue={selectedContact?.notes || ''}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="primary_contact" className="text-right">
                    Primary Contact
                  </Label>
                  <Checkbox
                    id="primary_contact"
                    defaultChecked={selectedContact?.primary_contact || false}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <DialogClose asChild>
                  <Button type="button" variant="secondary" onClick={onClose}>
                    Cancel
                  </Button>
                </DialogClose>
                <Button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    const name = (document.getElementById('name') as HTMLInputElement).value;
                    const role = (document.getElementById('role') as HTMLInputElement).value;
                    const email = (document.getElementById('email') as HTMLInputElement).value;
                    const phone = (document.getElementById('phone') as HTMLInputElement).value;
                    const notes = (document.getElementById('notes') as HTMLTextAreaElement).value;
                    const primary_contact = (document.getElementById('primary_contact') as HTMLInputElement).checked;

                    const values = { name, role, email, phone, notes, primary_contact };

                    if (isEditing && selectedContact) {
                      handleEditContact(values);
                    } else {
                      handleAddContact(values);
                    }
                  }}
                >
                  {isSubmitting ? 'Submitting...' : isEditing ? 'Update Contact' : 'Add Contact'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="divide-y divide-gray-200">
          {contacts.map((contact) => (
            <div key={contact.id} className="py-4 flex items-center justify-between">
              <div>
                <p className="font-medium">{contact.name}</p>
                <p className="text-sm text-gray-500">{contact.role}</p>
                <div className="text-xs text-gray-500">
                  Last updated {formatDistanceToNow(new Date(contact.updated_at || contact.created_at), { addSuffix: true })}
                </div>
              </div>
              <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={() => handleOpenEditDialog(contact)}>
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-800" onClick={() => handleDeleteContact(contact.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </div>
  );
};

export default SponsorContactsManager;
