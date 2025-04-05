
import React, { useState } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Edit, Trash, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { formatDate } from '@/components/fixtures/types';

interface FixturesListProps {
  fixtures: any[];
  onEdit?: (fixture: any) => void;
  onDelete?: (fixtureId: string) => void;
}

export const FixturesList: React.FC<FixturesListProps> = ({ 
  fixtures, 
  onEdit, 
  onDelete 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Get current fixtures
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentFixtures = fixtures.slice(indexOfFirstItem, indexOfLastItem);
  
  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  const totalPages = Math.ceil(fixtures.length / itemsPerPage);
  
  const getStatusBadge = (fixture: any) => {
    if (fixture.isCompleted) {
      return <Badge variant="success">Completed</Badge>;
    }
    
    const fixtureDate = new Date(fixture.date);
    const today = new Date();
    
    if (fixtureDate.toDateString() === today.toDateString()) {
      return <Badge variant="secondary">Today</Badge>;
    }
    
    return <Badge variant="outline">Scheduled</Badge>;
  };
  
  const getResultBadge = (fixture: any) => {
    if (!fixture.isCompleted) return null;
    
    return (
      <Badge variant="secondary">
        {fixture.homeScore} - {fixture.awayScore}
      </Badge>
    );
  };
  
  return (
    <div className="space-y-4">
      {fixtures.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No fixtures found.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Competition</TableHead>
                  <TableHead>Teams</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Result</TableHead>
                  {(onEdit || onDelete) && <TableHead>Actions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentFixtures.map((fixture) => (
                  <TableRow key={fixture.id}>
                    <TableCell className="whitespace-nowrap">
                      {formatDate(fixture.date)}
                      <div className="text-xs text-muted-foreground">{fixture.time}</div>
                    </TableCell>
                    <TableCell>{fixture.competition}</TableCell>
                    <TableCell>
                      <div className="font-medium">{fixture.homeTeam}</div>
                      <div className="text-muted-foreground">vs</div>
                      <div className="font-medium">{fixture.awayTeam}</div>
                    </TableCell>
                    <TableCell>{fixture.venue || 'TBD'}</TableCell>
                    <TableCell>{getStatusBadge(fixture)}</TableCell>
                    <TableCell>{getResultBadge(fixture)}</TableCell>
                    {(onEdit || onDelete) && (
                      <TableCell className="whitespace-nowrap">
                        <div className="flex space-x-2">
                          {onEdit && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onEdit(fixture)}
                              title="Edit fixture"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onDelete(fixture.id)}
                              title="Delete fixture"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {fixtures.length > itemsPerPage && (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, fixtures.length)}
                  </span>{" "}
                  of <span className="font-medium">{fixtures.length}</span> fixtures
                </p>
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-muted-foreground">Items per page:</label>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={(value) => {
                      setItemsPerPage(Number(value));
                      setCurrentPage(1);
                    }}
                  >
                    <SelectTrigger className="w-16 h-8">
                      <SelectValue>{itemsPerPage}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => paginate(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center">
                  <Input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const page = Math.max(1, Math.min(totalPages, Number(e.target.value)));
                      paginate(page);
                    }}
                    className="w-12 h-8 text-center"
                  />
                  <span className="mx-2 text-sm text-muted-foreground">
                    of {totalPages}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => paginate(Math.min(currentPage + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
