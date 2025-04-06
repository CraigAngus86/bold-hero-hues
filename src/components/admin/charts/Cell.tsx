
import React from 'react';

interface CellProps {
  fill?: string;
  children?: React.ReactNode;
}

const Cell: React.FC<CellProps> = ({ fill, children }) => {
  return <>{children}</>;
};

export default Cell;
