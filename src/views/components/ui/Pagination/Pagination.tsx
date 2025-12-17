import React from 'react';
import { ArrowIcon, DotsIcon } from '../../icons';
import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages: (number | 'dots')[] = [];
    
    if (totalPages <= 7) {
      // Если страниц мало, показываем все
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }
    
    // Всегда показываем первую страницу
    pages.push(1);
    
    // Вычисляем начало и конец диапазона вокруг текущей страницы
    let start = Math.max(2, currentPage - 1);
    let end = Math.min(totalPages - 1, currentPage + 1);
    
    // Если текущая страница близко к началу, показываем страницы от 2
    if (currentPage <= 3) {
      start = 2;
      end = Math.min(4, totalPages - 1);
    }
    
    // Если текущая страница близко к концу, показываем страницы до конца
    if (currentPage >= totalPages - 2) {
      start = Math.max(2, totalPages - 3);
      end = totalPages - 1;
    }
    
    // Если есть разрыв между первой страницей и началом диапазона
    if (start > 2) {
      pages.push('dots');
    }
    
    // Показываем страницы в диапазоне
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    // Если есть разрыв между концом диапазона и последней страницей
    if (end < totalPages - 1) {
      pages.push('dots');
    }
    
    // Всегда показываем последнюю страницу
    pages.push(totalPages);
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination">
      <button
        className="pagination__arrow"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Предыдущая страница"
      >
        <ArrowIcon 
          direction="left" 
          size={16}
          strokeColor={currentPage === 1 ? '#CCCCCC' : '#666'}
        />
      </button>

      <div className="pagination__pages">
        {pageNumbers.map((page, index) => {
          if (page === 'dots') {
            return (
              <span key={`dots-${index}`} className="pagination__dots">
                <DotsIcon 
                  size={16}
                  orientation="horizontal"
                  fillColor="#999"
                />
              </span>
            );
          }

          return (
            <button
              key={page}
              className={`pagination__page ${
                page === currentPage ? 'pagination__page--active' : ''
              }`}
              onClick={() => onPageChange(page)}
              aria-label={`Страница ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          );
        })}
      </div>

      <button
        className="pagination__arrow"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Следующая страница"
      >
        <ArrowIcon 
          direction="right" 
          size={16}
          strokeColor={currentPage === totalPages ? '#CCCCCC' : '#666'}
        />
      </button>
    </div>
  );
};


