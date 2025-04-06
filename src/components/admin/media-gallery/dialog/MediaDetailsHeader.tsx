
import React from 'react';
import { DialogTitle, DialogDescription } from "@/components/ui/dialog";

const MediaDetailsHeader: React.FC = () => {
  return (
    <div className="mb-4">
      <DialogTitle className="text-xl">Media Details</DialogTitle>
      <DialogDescription>
        View and edit details for this media item
      </DialogDescription>
    </div>
  );
};

export default MediaDetailsHeader;
