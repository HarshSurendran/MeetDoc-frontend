import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';
import { Button } from "@/components/ui/button";


interface PaginationProps {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
  }
  

const ReviewPagination : React.FC<PaginationProps> = ({
    currentPage,
    pageSize,
    totalItems,
    onPageChange,
}) => {
    const totalPages = Math.ceil(totalItems / Number(pageSize));
    console.log(totalPages)
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];      
      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          pages.push(1, 2, 3, 4, '...', totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
          pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
        }
      }
      return pages;
    };
  return (
    <div className="w-full px-2 py-4">
      <div className="flex  sm:flex-row items-center justify-center gap-4">
        

        {/* Pagination controls */}
        <div className="flex items-center gap-1">
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="hidden sm:flex"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button> */}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="px-2 py-1">...</span>
                ) : (
                  <Button
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => onPageChange(Number(page))}
                    className={`px-3 py-1 hidden sm:flex ${
                      currentPage === page 
                        ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                        : 'hover:bg-blue-50'
                    }`}
                  >
                    {page}
                  </Button>
                )}
              </React.Fragment>
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="hidden sm:flex"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button> */}
        </div>
      </div>
    </div>
  )
}

export default ReviewPagination

