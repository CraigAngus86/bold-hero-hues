
import React from 'react';

interface TableRowProps {
  cells: React.ReactNode[];
  className?: string;
  onClick?: () => void;
}

const TableRow: React.FC<TableRowProps> = ({ cells, className, onClick }) => {
  return (
    <tr 
      className={`${className || ''} ${onClick ? 'cursor-pointer hover:bg-gray-50' : ''}`} 
      onClick={onClick}
    >
      {cells.map((cell, index) => (
        <td key={index} className="px-6 py-4 whitespace-nowrap">
          {cell}
        </td>
      ))}
    </tr>
  );
};

export default TableRow;
