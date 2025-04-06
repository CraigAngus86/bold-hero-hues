
import React from 'react';
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Eye } from "lucide-react";

interface DataActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
  disableEdit?: boolean;
  disableDelete?: boolean;
  disableView?: boolean;
}

const DataActions: React.FC<DataActionsProps> = ({
  onEdit,
  onDelete,
  onView,
  disableEdit = false,
  disableDelete = false,
  disableView = true
}) => {
  return (
    <div className="flex space-x-2 justify-end">
      {onView && !disableView && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onView}
          className="h-8 w-8"
        >
          <Eye className="h-4 w-4" />
        </Button>
      )}
      
      {onEdit && !disableEdit && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
          className="h-8 w-8"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      )}
      
      {onDelete && !disableDelete && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="h-8 w-8 text-destructive"
        >
          <Trash className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default DataActions;
