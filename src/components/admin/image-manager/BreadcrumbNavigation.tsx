
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbSeparator 
} from '@/components/ui/breadcrumb';
import { ImageFolder } from './types';

interface BreadcrumbNavigationProps {
  breadcrumbs: ImageFolder[];
  onNavigate: (folder: ImageFolder | null) => void;
}

const BreadcrumbNavigation = ({ breadcrumbs, onNavigate }: BreadcrumbNavigationProps) => {
  return (
    <Breadcrumb className="mb-4">
      <BreadcrumbItem>
        <BreadcrumbLink onClick={() => onNavigate(null)}>
          Home
        </BreadcrumbLink>
      </BreadcrumbItem>
      
      {breadcrumbs.map((folder, index) => (
        <BreadcrumbItem key={folder.id}>
          <BreadcrumbSeparator />
          <BreadcrumbLink 
            onClick={() => onNavigate(folder)}
            className={index === breadcrumbs.length - 1 ? "font-semibold" : ""}
          >
            {folder.name}
          </BreadcrumbLink>
        </BreadcrumbItem>
      ))}
    </Breadcrumb>
  );
};

export default BreadcrumbNavigation;
