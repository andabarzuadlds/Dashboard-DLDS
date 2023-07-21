interface PaginationProps {
    visiblePages: number;
    totalPages: number;
    currentPage: number;
    onPageChange: (page: number) => void;
  }
  
  export const Pagination: React.FC<PaginationProps> = ({ totalPages, currentPage, onPageChange }) => {
    const range = 3;
    const startPage = Math.max(1, currentPage - range);
    const endPage = Math.min(totalPages, currentPage + range);
    const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  
    return (
      <div>
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        >
          Atrás
        </button>
        {pages.map(page => (
          <button
            key={page}
            className={`border-4 rounded-lg border-gray-600 ${currentPage === page ? 'bg-gray-600 text-white' : ''}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
        {currentPage < totalPages && (
          <button onClick={() => onPageChange(currentPage + 1)}>
            Siguiente
          </button>
        )}
      </div>
    );
  };
  