
interface NoFixturesFoundProps {
  onClearFilters: () => void;
}

const NoFixturesFound = ({ onClearFilters }: NoFixturesFoundProps) => {
  return (
    <div className="text-center py-12">
      <p className="text-gray-500 text-lg">No fixtures found matching your criteria.</p>
      <button 
        className="mt-4 text-team-blue hover:underline"
        onClick={onClearFilters}
      >
        Clear filters
      </button>
    </div>
  );
};

export default NoFixturesFound;
